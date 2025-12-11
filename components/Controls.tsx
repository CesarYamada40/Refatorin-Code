
import React from 'react';
import { Language, Action } from '../types';
import { SUPPORTED_LANGUAGES, ACTIONS } from '../constants';
import { FileUploader } from './FileUploader';
import { SubmitIcon } from './icons';

interface ControlsProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  action: Action;
  setAction: (action: Action) => void;
  onFileRead: (content: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  language,
  setLanguage,
  action,
  setAction,
  onFileRead,
  onSubmit,
  isLoading
}) => {
  return (
    <div className="bg-[#161b22] p-4 rounded-lg border border-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        
        <div>
          <label htmlFor="language-select" className="block text-sm font-medium text-gray-400 mb-1">Language</label>
          <select
            id="language-select"
            value={language.id}
            onChange={(e) => {
              const selectedLang = SUPPORTED_LANGUAGES.find(l => l.id === e.target.value);
              if (selectedLang) setLanguage(selectedLang);
            }}
            className="w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-white"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>{lang.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Action</label>
          <div className="flex flex-wrap gap-2">
            {ACTIONS.map((act) => (
              <button
                key={act.id}
                type="button"
                onClick={() => setAction(act)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  action.id === act.id
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {act.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
            <FileUploader onFileRead={onFileRead} isDisabled={isLoading}/>
        </div>

        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="w-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SubmitIcon className="w-5 h-5 mr-2"/>
          {isLoading ? 'Processing...' : 'Process Code'}
        </button>
      </div>
       <p className="text-xs text-gray-500 mt-3 pl-1">{action.description}</p>
    </div>
  );
};
