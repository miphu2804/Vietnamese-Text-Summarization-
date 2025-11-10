import React, { useRef, ChangeEvent } from 'react';
import { useAudioUpload } from '../../hooks/useAudioUpload';
import { PlayIcon, MicrophoneIcon, DocumentIcon } from '@heroicons/react/24/outline';

interface AudioUploaderProps {
  onFileUploaded?: (file: File) => void;
  disabled?: boolean;
  accept?: string;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({
  onFileUploaded,
  disabled = false,
  accept = 'audio/*,video/*',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    currentFile,
    uploadProgress,
    isUploading,
    uploadError,
    handleFileSelect,
  } = useAudioUpload();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
      onFileUploaded?.(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
      onFileUploaded?.(files[0]);
    }
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${disabled
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : 'border-blue-300 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
          }
        `}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        {isUploading ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">Processing...</p>
              <p className="text-sm text-gray-500">{uploadProgress}%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        ) : currentFile ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <DocumentIcon className="h-16 w-16 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">{currentFile.name}</p>
              <p className="text-sm text-gray-500">{formatFileSize(currentFile.size)}</p>
            </div>
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              onClick={(e) => {
                e.stopPropagation();
                openFileDialog();
              }}
            >
              Choose different file
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <MicrophoneIcon className="h-16 w-16 text-gray-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                Drop your audio file here, or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Supports MP3, WAV, M4A, FLAC, MP4, AVI (Max 100MB)
              </p>
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={(e) => {
                e.stopPropagation();
                openFileDialog();
              }}
            >
              Select File
            </button>
          </div>
        )}
      </div>

      {uploadError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{uploadError}</p>
        </div>
      )}
    </div>
  );
};