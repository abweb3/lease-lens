'use client';

import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useFeatureFlag } from '@/hooks/use-feature-flag';
import { FileUpload } from '@/components/enhanced/file-upload';
import { AppLayout } from '@/components/enhanced/layout';
import { isPDFFile, isValidFileSize } from '@/lib/utils';

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  // Feature flags
  const isEnhancedNavigationEnabled = useFeatureFlag('enhanced-navigation');

  const handleFileSelect = (selectedFile: File) => {
    // Validate file type
    if (!isPDFFile(selectedFile)) {
      setError('Please select a PDF file.');
      return;
    }

    // Validate file size (10MB limit)
    if (!isValidFileSize(selectedFile, 10)) {
      setError('File size must be less than 10MB.');
      return;
    }

    setFile(selectedFile);
    setError('');
  };

  const handleFileUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError('Please select a file to analyze.');
      return;
    }

    setIsLoading(true);
    setError('');
    setAnalysis('');
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 30;
      });
    }, 200);

    try {
      const response = await axios.post('http://127.0.0.1:8000/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      setAnalysis(response.data.analysis);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      if (error.response) {
        setError(error.response.data?.detail || 'An unknown error occurred.');
      } else {
        setError('Could not connect to the analysis service. Please check if the backend server is running.');
      }
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };


  const content = (
    <div className="w-full max-w-4xl mx-auto">
      <header className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          Lease Lens 🔎
        </h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
          Get AI-powered analysis of your lease agreement. Understand your rights, spot red flags, and negotiate with confidence.
        </p>
      </header>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Upload Your Lease</h2>
          <p className="text-gray-600">
            Upload your PDF lease agreement to get instant AI analysis and insights.
          </p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleFileUpload}>
            <FileUpload
              onFileSelect={handleFileSelect}
              isUploading={isLoading}
              uploadProgress={uploadProgress}
              error={error}
              accept=".pdf"
              maxSize={10}
              className="mb-8"
            />
            
            <button
              type="submit"
              disabled={isLoading || !file}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Your Lease...
                </div>
              ) : (
                'Analyze My Lease'
              )}
            </button>
          </form>
        </div>
      </div>

      {isLoading && (
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Your Lease</h3>
            <p className="text-gray-600 mb-4">Our AI is carefully reviewing your lease agreement...</p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      )}

      {analysis && (
        <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-6 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Analysis Complete</h2>
                <p className="text-gray-600">Here&apos;s what our AI found in your lease agreement</p>
              </div>
            </div>
          </div>
          <div className="p-8">
            <article className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700">
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </article>
          </div>
        </div>
      )}
    </div>
  );

  if (isEnhancedNavigationEnabled) {
    return <AppLayout>{content}</AppLayout>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <div className="container mx-auto px-4 py-12 md:py-20">
        {content}
      </div>
    </main>
  );
}