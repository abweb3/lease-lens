'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { exportAsMarkdown, exportAsText, exportAsHTML, exportSummaryReport } from '@/lib/export';

interface AnalysisHistory {
  id: string;
  fileName: string;
  fileSize: number;
  analyzedAt: string;
  summary: string;
  redFlags: number;
  analysis?: string;
}

export default function DashboardPage() {
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistory[]>([]);
  // Keep setSelectedAnalysis for future use when implementing detailed analysis view
  const [, setSelectedAnalysis] = useState<AnalysisHistory | null>(null);
  const [showExportMenu, setShowExportMenu] = useState<string | null>(null);

  // Load analysis history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('lease-lens-history');
    if (savedHistory) {
      try {
        setAnalysisHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading analysis history:', error);
      }
    }
  }, []);

  const clearHistory = () => {
    setAnalysisHistory([]);
    localStorage.removeItem('lease-lens-history');
    setSelectedAnalysis(null);
  };

  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleExport = (analysis: AnalysisHistory, format: 'markdown' | 'text' | 'html') => {
    if (!analysis.analysis) return;
    
    const exportData = {
      fileName: analysis.fileName,
      analyzedAt: analysis.analyzedAt,
      analysis: analysis.analysis,
      fileSize: analysis.fileSize
    };

    switch (format) {
      case 'markdown':
        exportAsMarkdown(exportData);
        break;
      case 'text':
        exportAsText(exportData);
        break;
      case 'html':
        exportAsHTML(exportData);
        break;
    }
    setShowExportMenu(null);
  };

  const handleExportAll = () => {
    const validAnalyses = analysisHistory.filter(a => a.analysis);
    if (validAnalyses.length === 0) return;

    const exportData = validAnalyses.map(analysis => ({
      fileName: analysis.fileName,
      analyzedAt: analysis.analyzedAt,
      analysis: analysis.analysis!,
      fileSize: analysis.fileSize
    }));

    exportSummaryReport(exportData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-xl text-gray-600">Manage your lease analyses and explore tenant resources</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
                <Icons.fileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analysisHistory.length}</div>
                <p className="text-xs text-muted-foreground">
                  Lease documents analyzed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Red Flags Found</CardTitle>
                <Icons.shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analysisHistory.reduce((total, analysis) => total + analysis.redFlags, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Potential issues identified
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Analysis</CardTitle>
                <Icons.clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analysisHistory.length > 0 
                    ? formatDate(analysisHistory[0].analyzedAt).split(',')[0]
                    : 'None'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Most recent document
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Analysis History */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Analysis History</CardTitle>
                      <CardDescription>
                        Your previous lease analyses and their results
                      </CardDescription>
                    </div>
                    {analysisHistory.length > 0 && (
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleExportAll}
                        >
                          <Icons.download className="h-4 w-4 mr-1" />
                          Export All
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={clearHistory}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Icons.trash className="h-4 w-4 mr-1" />
                          Clear History
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {analysisHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <Icons.fileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No analyses yet</h3>
                      <p className="text-gray-600 mb-4">
                        Upload your first lease document to get started
                      </p>
                      <Button asChild>
                        <Link href="/">
                          <Icons.upload className="h-4 w-4 mr-2" />
                          Analyze a Lease
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {analysisHistory.map((analysis) => (
                        <div
                          key={analysis.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => setSelectedAnalysis(analysis)}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Icons.helpCircle className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{analysis.fileName}</h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>{formatFileSize(analysis.fileSize)}</span>
                                <span>•</span>
                                <span>{formatDate(analysis.analyzedAt)}</span>
                                <span>•</span>
                                <span className="flex items-center">
                                  <Icons.shield className="h-3 w-3 mr-1" />
                                  {analysis.redFlags} red flags
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedAnalysis(analysis)}
                            >
                              <Icons.fileText className="h-4 w-4 mr-2 inline" />
                              View
                            </Button>
                            <div className="relative">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setShowExportMenu(showExportMenu === analysis.id ? null : analysis.id)}
                              >
                                <Icons.download className="h-4 w-4 mr-1" />
                                Export
                              </Button>
                              {showExportMenu === analysis.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                  <div className="py-1">
                                    <button
                                      onClick={() => handleExport(analysis, 'markdown')}
                                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                      <Icons.fileText className="h-5 w-5" />
                                      Export as Markdown
                                    </button>
                                    <button
                                      onClick={() => handleExport(analysis, 'html')}
                                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                      <Icons.externalLink className="h-5 w-5" />
                                      Export as HTML
                                    </button>
                                    <button
                                      onClick={() => handleExport(analysis, 'text')}
                                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                      <Icons.fileText className="h-5 w-5" />
                                      Export as Text
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common tasks and tools
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" asChild>
                    <Link href="/">
                      <Icons.upload className="h-4 w-4 mr-2" />
                      Analyze New Lease
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/resources">
                      <Icons.helpCircle className="h-4 w-4 mr-2" />
                      Tenant Resources
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Icons.user className="h-4 w-4 mr-2" />
                    Find Legal Help
                  </Button>
                </CardContent>
              </Card>

              {/* Additional resources and tips section */}
              <Card>
                <CardHeader>
                  <CardTitle>Tenant Tips</CardTitle>
                  <CardDescription>
                    Knowledge to protect your rights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium text-gray-900">Security Deposits</h4>
                      <p className="text-sm text-gray-600">
                        In most states, landlords must return deposits within 14-30 days
                      </p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-medium text-gray-900">Rent Increases</h4>
                      <p className="text-sm text-gray-600">
                        Most jurisdictions require 30-60 days notice for rent increases
                      </p>
                    </div>
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <h4 className="font-medium text-gray-900">Maintenance</h4>
                      <p className="text-sm text-gray-600">
                        Landlords are typically responsible for major repairs and habitability
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}