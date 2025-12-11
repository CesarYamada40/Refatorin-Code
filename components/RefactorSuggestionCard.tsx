
import React from 'react';
import { RefactorSuggestion } from '../types';
import { DiffViewer } from './DiffViewer';
import { CheckIcon, XIcon } from './icons';

interface RefactorSuggestionCardProps {
  suggestion: RefactorSuggestion;
  onApprove: () => void;
  onReject: () => void;
  isLoading: boolean;
}

export const RefactorSuggestionCard: React.FC<RefactorSuggestionCardProps> = ({ suggestion, onApprove, onReject, isLoading }) => {
  return (
    <div className="bg-[#161b22] p-4 rounded-lg border border-gray-800 transition-all hover:border-cyan-600/50">
      <h4 className="font-semibold text-gray-200">{suggestion.description}</h4>
      <p className="text-sm text-gray-400 mt-1 mb-3">{suggestion.reasoning}</p>
      
      <DiffViewer originalCode={suggestion.originalCode} refactoredCode={suggestion.refactoredCode} />

      <div className="flex justify-end items-center gap-3 mt-4">
        <button
          onClick={onReject}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md text-red-400 bg-red-900/20 hover:bg-red-900/40 transition-colors disabled:opacity-50"
          aria-label="Reject suggestion"
        >
          <XIcon className="w-4 h-4" />
          Reject
        </button>
        <button
          onClick={onApprove}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md text-green-400 bg-green-900/20 hover:bg-green-900/40 transition-colors disabled:opacity-50"
          aria-label="Approve suggestion"
        >
          <CheckIcon className="w-4 h-4" />
          Approve
        </button>
      </div>
    </div>
  );
};
