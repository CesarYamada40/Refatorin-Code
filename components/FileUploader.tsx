
import React, { useRef } from 'react';
import { UploadIcon } from './icons';

interface FileUploaderProps {
  onFileRead: (content: string) => void;
  isDisabled: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileRead, isDisabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Basic check for file type, can be expanded
      if (file.size > 500 * 1024 * 1024) {
          alert('File is too large. Maximum size is 500MB.');
          return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onFileRead(text);
      };
      reader.readAsText(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        disabled={isDisabled}
      />
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className="w-full flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <UploadIcon className="w-5 h-5 mr-2"/>
        Upload File
      </button>
    </>
  );
};
