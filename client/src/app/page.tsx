'use client';

import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to analyze.');
      return;
    }

    setIsLoading(true);
    setError('');
    setAnalysis('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:8000/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setAnalysis(response.data.analysis);
    } catch (err: any) {
      if (err.response) {
        setError(`Error: ${err.response.data.detail || 'An unknown error occurred.'}`);
      } else {
        setError('Could not connect to the analysis service. Is it running?');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-gray-50">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Lease Lens 🔎</h1>
          <p className="mt-2 text-lg text-gray-600">Understand your lease before you sign.</p>
        </header>

        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="file-upload" className="block text-lg font-medium text-gray-700 mb-2">Upload Lease Agreement (PDF)</label>
              <input
                id="file-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !file}
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-3 transition-all duration-150 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Analyzing...' : 'Analyze My Lease'}
            </button>
          </form>
          {error && <div className="mt-4 text-red-600 bg-red-100 p-3 rounded-lg">{error}</div>}
        </div>

        {isLoading && (
            <div className="mt-8 text-center">
                <div role="status">
                    <svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0492C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
                <p className="mt-4 text-gray-600">AI is reading your lease... this may take a moment.</p>
            </div>
        )}

        {analysis && (
          <div className="mt-8 bg-white p-8 rounded-xl shadow-md border border-gray-200">
              <article className="prose prose-lg max-w-none">
                 <ReactMarkdown>{analysis}</ReactMarkdown>
              </article>
          </div>
        )}
      </div>
    </main>
  );
}
