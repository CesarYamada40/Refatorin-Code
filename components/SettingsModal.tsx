
import React, { useState, useEffect } from 'react';
import { AiSettings, AiProvider } from '../types';
import { XIcon } from './icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: AiSettings;
  onSave: (settings: AiSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentSettings, onSave }) => {
  const [provider, setProvider] = useState<AiProvider>(currentSettings.provider);
  const [apiKey, setApiKey] = useState(currentSettings.apiKey);

  useEffect(() => {
    setProvider(currentSettings.provider);
    setApiKey(currentSettings.apiKey);
  }, [currentSettings, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    onSave({ provider, apiKey });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
      <div className="bg-[#161b22] rounded-lg border border-gray-700 shadow-xl w-full max-w-md m-4">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Agent Settings</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700" aria-label="Close settings">
            <XIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label htmlFor="ai-provider" className="block text-sm font-medium text-gray-300 mb-2">
              AI Provider
            </label>
            <select
              id="ai-provider"
              value={provider}
              onChange={(e) => setProvider(e.target.value as AiProvider)}
              className="w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-white"
            >
              <option value="gemini">Google Gemini</option>
              <option value="openai" disabled>OpenAI (ChatGPT) - Coming Soon</option>
            </select>
            <p className="text-xs text-gray-500 mt-2">Choose which AI model will power the agent.</p>
          </div>
          <div>
            <label htmlFor="api-key" className="block text-sm font-medium text-gray-300 mb-2">
              API Key
            </label>
            <input
              type="password"
              id="api-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              className="w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-white"
            />
            <p className="text-xs text-gray-500 mt-2">Your API key is stored only in your browser.</p>
          </div>
        </div>
        <div className="flex justify-end gap-4 p-4 bg-gray-900/50 border-t border-gray-700 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
