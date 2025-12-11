
import React, { useState, useCallback, useEffect } from 'react';
import { Language, Action, CodeAnalysisResult, RefactorSuggestion, AiSettings } from './types';
import { SUPPORTED_LANGUAGES, ACTIONS } from './constants';
import { processCode } from './services/aiService';
import { CodePane } from './components/CodePane';
import { Controls } from './components/Controls';
import { BrainIcon, CogIcon } from './components/icons';
import { Spinner } from './components/Spinner';
import { RefactorSuggestionCard } from './components/RefactorSuggestionCard';
import { SettingsModal } from './components/SettingsModal';

const App: React.FC = () => {
  const [inputCode, setInputCode] = useState<string>('');
  const [output, setOutput] = useState<CodeAnalysisResult | null>(null);
  const [refactorSuggestions, setRefactorSuggestions] = useState<RefactorSuggestion[] | null>(null);
  const [language, setLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]); // Default to Auto-Detect
  const [action, setAction] = useState<Action>(ACTIONS[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [aiSettings, setAiSettings] = useState<AiSettings>({ provider: 'gemini', apiKey: '' });

  useEffect(() => {
    const savedSettings = localStorage.getItem('aiSettings');
    if (savedSettings) {
      setAiSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSaveSettings = (settings: AiSettings) => {
    setAiSettings(settings);
    localStorage.setItem('aiSettings', JSON.stringify(settings));
    setIsSettingsOpen(false);
  };

  const handleFileRead = (content: string) => {
    setInputCode(content);
  };

  const handleApproveSuggestion = useCallback((index: number) => {
    if (!refactorSuggestions) return;

    const suggestion = refactorSuggestions[index];
    let replaced = false;
    const newCode = inputCode.replace(suggestion.originalCode, () => {
        if (replaced) return suggestion.originalCode;
        replaced = true;
        return suggestion.refactoredCode;
    });

    setInputCode(newCode);
    setRefactorSuggestions(prev => prev!.filter((_, i) => i !== index));
  }, [inputCode, refactorSuggestions]);

  const handleRejectSuggestion = useCallback((index: number) => {
    setRefactorSuggestions(prev => prev!.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!inputCode.trim()) {
      setError('Please enter some code to process.');
      return;
    }
    if (!aiSettings.apiKey) {
        setError('API Key is not configured. Please set it in the Agent Settings.');
        setIsSettingsOpen(true);
        return;
    }

    setIsLoading(true);
    setError(null);
    setOutput(null);
    setRefactorSuggestions(null);

    try {
      const result = await processCode(inputCode, language, action, aiSettings);
      if (action.id === 'auto_refactor' && Array.isArray(result)) {
        if (result.length === 0) {
            setOutput({ code: inputCode, explanation: "No specific refactoring suggestions found. The code looks good!" });
            setRefactorSuggestions(null);
        } else {
            setRefactorSuggestions(result);
            setOutput(null);
        }
      } else if (!Array.isArray(result)) {
        setOutput(result);
        setRefactorSuggestions(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [inputCode, language, action, aiSettings]);

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-300 font-sans">
      <header className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <BrainIcon className="w-8 h-8 text-cyan-400" />
            <h1 className="text-2xl font-bold text-gray-100">Code Brain AI</h1>
        </div>
        <button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-md hover:bg-gray-700 transition-colors" aria-label="Open settings">
            <CogIcon className="w-6 h-6 text-gray-400"/>
        </button>
      </header>
      <main className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Controls
            language={language}
            setLanguage={setLanguage}
            action={action}
            setAction={setAction}
            onFileRead={handleFileRead}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CodePane
              title="Input Code"
              code={inputCode}
              onCodeChange={setInputCode}
              language={language.name}
              isReadOnly={isLoading}
            />
            <div className="relative min-h-[400px] lg:min-h-0">
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#161b22]/80 rounded-lg z-10">
                  <Spinner />
                  <p className="mt-4 text-lg text-gray-400">AI is thinking...</p>
                  <p className="text-sm text-gray-500">{action.processingText}</p>
                </div>
              )}
              {error && (
                <div className="h-full flex flex-col items-center justify-center bg-[#161b22] rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-red-500 mb-2">An Error Occurred</h3>
                  <p className="text-center text-red-400">{error}</p>
                  <button
                    onClick={handleSubmit}
                    className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white font-semibold transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
              {!isLoading && !error && refactorSuggestions && refactorSuggestions.length > 0 && (
                <div className="h-full flex flex-col space-y-4">
                    <div className="p-4 bg-[#161b22] rounded-lg border border-gray-800">
                        <h3 className="text-lg font-semibold text-gray-200">Refactoring Suggestions</h3>
                        <p className="text-sm text-gray-500">Approve or reject the suggestions below. Approved changes will be applied to the input code.</p>
                    </div>
                    <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-350px)] p-1 custom-scrollbar">
                        {refactorSuggestions.map((suggestion, index) => (
                            <RefactorSuggestionCard
                                key={index}
                                suggestion={suggestion}
                                onApprove={() => handleApproveSuggestion(index)}
                                onReject={() => handleRejectSuggestion(index)}
                                isLoading={isLoading}
                            />
                        ))}
                    </div>
                </div>
              )}
              {!isLoading && !error && !refactorSuggestions && output && (
                <div className="h-full flex flex-col space-y-4">
                   <div className="bg-[#161b22] rounded-lg p-4 border border-gray-800 flex-grow">
                      <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2 mb-3">Explanation</h3>
                      {output.detectedLanguage && (
                        <div className="mb-3 text-sm">
                          <span className="font-semibold text-gray-400">Detected Language(s): </span>
                          <span className="font-mono bg-gray-700 text-cyan-400 px-2 py-1 rounded-md text-xs">{output.detectedLanguage}</span>
                        </div>
                      )}
                      <p className="text-sm text-gray-400 whitespace-pre-wrap">{output.explanation}</p>
                   </div>
                   <CodePane
                    title="Processed Code"
                    code={output.code}
                    language={output.detectedLanguage || language.name}
                    isReadOnly={true}
                  />
                </div>
              )}
              {!isLoading && !error && !output && (!refactorSuggestions || refactorSuggestions.length === 0) && (
                 <div className="h-full flex flex-col items-center justify-center bg-[#161b22] rounded-lg p-4 text-center">
                    <BrainIcon className="w-16 h-16 text-gray-600 mb-4"/>
                    <h3 className="text-xl font-semibold text-gray-400">Output will appear here</h3>
                    <p className="text-gray-500 mt-2">Enter your code, select an action, and click "Process Code" to see the magic.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentSettings={aiSettings}
        onSave={handleSaveSettings}
      />
    </div>
  );
};

export default App;
