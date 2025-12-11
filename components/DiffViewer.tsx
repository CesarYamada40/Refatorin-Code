
import React from 'react';

interface DiffViewerProps {
  originalCode: string;
  refactoredCode: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ originalCode, refactoredCode }) => {
  return (
    <div className="font-mono text-xs mt-2 space-y-2">
      <div>
        <div className="text-red-400 text-sm font-semibold mb-1">- Before</div>
        <pre className="bg-red-900/20 p-2 rounded-md whitespace-pre-wrap break-all">
          <code>{originalCode}</code>
        </pre>
      </div>
      <div>
        <div className="text-green-400 text-sm font-semibold mb-1">+ After</div>
        <pre className="bg-green-900/20 p-2 rounded-md whitespace-pre-wrap break-all">
          <code>{refactoredCode}</code>
        </pre>
      </div>
    </div>
  );
};
