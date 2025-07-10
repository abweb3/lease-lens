'use client';

import * as React from 'react';
import { useFeatureFlag } from '@/hooks/use-feature-flag';
import { cn, formatFileSize, isPDFFile, isValidFileSize } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

// Original file upload component (fallback)
function OriginalFileUpload({ 
  onFileSelect, 
  isUploading, 
  error, 
  accept = '.pdf',
  className 
}: FileUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Upload Lease Agreement (PDF)
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            style={{ display: 'none' }}
          />
          <Button
            type="button"
            onClick={handleButtonClick}
            disabled={isUploading}
            loading={isUploading}
            className="w-full"
          >
            {isUploading ? 'Uploading...' : 'Choose PDF File'}
          </Button>
        </div>
      </div>
      
      {error && (
        <Alert variant="error">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// Enhanced file upload component with drag-and-drop (Phase 1 Enhanced)
function EnhancedFileUpload({ 
  onFileSelect, 
  isUploading, 
  uploadProgress = 0,
  error, 
  accept = '.pdf',
  maxSize = 10,
  className 
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [validationError, setValidationError] = React.useState<string>('');
  const [isValidating, setIsValidating] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleFileSelection = async (file: File) => {
    setIsValidating(true);
    setValidationError('');
    
    // Enhanced validation with better feedback
    if (!isPDFFile(file)) {
      setValidationError(`Invalid file type. Please select a PDF file. Selected: ${file.type || 'unknown'}`);
      setIsValidating(false);
      return;
    }

    if (!isValidFileSize(file, maxSize)) {
      setValidationError(`File too large. Maximum size is ${maxSize}MB. Selected file: ${formatFileSize(file.size)}`);
      setIsValidating(false);
      return;
    }

    // Simulate file validation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setSelectedFile(file);
    setIsValidating(false);
    onFileSelect(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* File Upload Area */}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer',
          isDragOver 
            ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
            : selectedFile
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50',
          isUploading && 'pointer-events-none opacity-50'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
          disabled={isUploading}
        />

        {!selectedFile ? (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300",
                isDragOver 
                  ? "bg-blue-100 scale-110 animate-pulse" 
                  : isValidating
                  ? "bg-yellow-100 animate-spin"
                  : "bg-gray-100 hover:bg-blue-50"
              )}>
                {isValidating ? (
                  <svg className="w-8 h-8 text-yellow-600 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className={cn(
                    "w-10 h-10 transition-colors duration-200",
                    isDragOver ? "text-blue-600" : "text-gray-600"
                  )} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                )}
              </div>
            </div>
            <div className="text-center">
              <p className={cn(
                "text-xl font-semibold mb-2 transition-colors duration-200",
                isDragOver ? "text-blue-900" : "text-gray-900"
              )}>
                {isValidating 
                  ? 'Validating file...' 
                  : isDragOver 
                  ? 'Drop your PDF here' 
                  : 'Upload your lease agreement'
                }
              </p>
              <p className="text-gray-600 mb-2">
                {isValidating 
                  ? 'Please wait while we validate your file'
                  : 'Drag and drop your PDF file here, or click to browse'
                }
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  PDF files only
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Max {maxSize}MB
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-900 mb-1">
                File ready for analysis
              </p>
              <p className="text-lg font-medium text-gray-700 mb-1">
                {selectedFile.name}
              </p>
              <p className="text-sm text-gray-500">
                {formatFileSize(selectedFile.size)} • PDF Document
              </p>
            </div>
            
            {isUploading ? (
              <div className="space-y-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">Uploading... {Math.round(uploadProgress)}%</p>
              </div>
            ) : (
              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Change File
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Error Display */}
      {(error || validationError) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-start">
            <div className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-red-800 font-medium">{error || validationError}</p>
              {validationError && (
                <p className="text-red-600 text-sm mt-1">
                  Please select a valid PDF file and try again.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Success Message */}
      {selectedFile && !error && !validationError && !isUploading && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center">
            <div className="w-5 h-5 text-green-500 mr-3">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-green-800 font-medium">
              File ready for analysis! Click "Analyze My Lease" to continue.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Main file upload component with feature flag switching (Phase 1: Enhanced by default)
export function FileUpload(props: FileUploadProps) {
  const isDragDropEnabled = useFeatureFlag('drag-drop-upload');
  const isEnhancedUploadEnabled = useFeatureFlag('enhanced-upload');
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Phase 1: Enable enhanced upload by default in development, or when feature flags are enabled
  if (isDevelopment || isEnhancedUploadEnabled || isDragDropEnabled) {
    return <EnhancedFileUpload {...props} />;
  }

  return <OriginalFileUpload {...props} />;
}