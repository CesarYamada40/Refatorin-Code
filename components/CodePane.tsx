
import React from 'react';

interface CodePaneProps {
  title: string;
  code: string;
  onCodeChange?: (code: string) => void;
  language: string;
  isReadOnly?: boolean;
}

export const CodePane: React.FC<CodePaneProps> = ({ title, code, onCodeChange, language, isReadOnly = false }) => {
  return (
    <div className="bg-[#161b22] rounded-lg border border-gray-800 flex flex-col h-full">
      <div className="flex justify-between items-center p-3 border-b border-gray-800">
        <h3 className="text-md font-semibold text-gray-200">{title}</h3>
        <span className="text-xs font-mono bg-gray-700 text-cyan-400 px-2 py-1 rounded">{language}</span>
      </div>
      <div className="p-1 flex-grow">
        <textarea
          value={code}
          onChange={(e) => onCodeChange && onCodeChange(e.target.value)}
          readOnly={isReadOnly}
          className="w-full h-full min-h-[400px] bg-transparent text-gray-300 font-mono text-sm p-3 resize-none focus:outline-none placeholder-gray-500"
          placeholder={isReadOnly ? '' : 'Paste your code here or upload a file...'}
          spellCheck="false"
        />
      </div>
    </div>
  );
};
