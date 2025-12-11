
export interface Language {
  id: string;
  name: string;
}

export interface Action {
  id: string;
  name: string;
  description: string;
  prompt: string;
  processingText: string;
}

export interface CodeAnalysisResult {
  code: string;
  explanation: string;
  detectedLanguage?: string;
}

export interface RefactorSuggestion {
  description: string;
  reasoning: string;
  originalCode: string;
  refactoredCode: string;
}

export type AiProvider = 'gemini' | 'openai';

export interface AiSettings {
  provider: AiProvider;
  apiKey: string;
}
