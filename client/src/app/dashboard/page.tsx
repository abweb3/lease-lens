'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
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
  const [filteredHistory, setFilteredHistory] = useState<AnalysisHistory[]>([]);
  const [showExportMenu, setShowExportMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'redFlags'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'high-risk' | 'low-risk'>('all');
  const [, setSelectedAnalysis] = useState<AnalysisHistory | null>(null);

  useEffect(() => {
    loadAnalysisHistory();
  }, []);

  useEffect(() => {
    let filtered = [...analysisHistory];

    if (searchQuery.trim()) {
      filtered = filtered.filter(analysis => 
        analysis.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        analysis.summary.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterBy === 'high-risk') {
      filtered = filtered.filter(analysis => analysis.redFlags >= 3);
    } else if (filterBy === 'low-risk') {
      filtered = filtered.filter(analysis => analysis.redFlags < 3);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.fileName.localeCompare(b.fileName);
        case 'redFlags':
          return b.redFlags - a.redFlags;
        case 'date':
        default:
          return new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime();
      }
    });

    setFilteredHistory(filtered);
  }, [analysisHistory, searchQuery, sortBy, filterBy]);

  const loadAnalysisHistory = () => {
    const savedHistory = localStorage.getItem('lease-lens-history');
    if (savedHistory) {
      try {
        setAnalysisHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading analysis history:', error);
      }
    }
  };

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analysis Dashboard</h1>
              <p className="text-gray-600">
                View and manage your lease analysis history
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-blue-50 px-3 py-2 rounded-lg">
                <span className="text-sm font-medium text-blue-700">
                  {analysisHistory.length} {analysisHistory.length === 1 ? 'Analysis' : 'Analyses'}
                </span>
              </div>
              <Button asChild>
                <Link href="/">
                  <Icons.upload className="h-4 w-4 mr-2" />
                  New Analysis
                </Link>
              </Button>
            </div>
          </div>

          {analysisHistory.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by filename or content..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'redFlags')}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="date">Date</option>
                    <option value="name">Name</option>
                    <option value="redFlags">Risk Level</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter:</label>
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value as 'all' | 'high-risk' | 'low-risk')}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Analyses</option>
                    <option value="high-risk">High Risk (3+ flags)</option>
                    <option value="low-risk">Low Risk (&lt;3 flags)</option>
                  </select>
                </div>
              </div>

              {(searchQuery || filterBy !== 'all') && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Showing {filteredHistory.length} of {analysisHistory.length} analyses
                    {searchQuery && ` matching "${searchQuery}"`}
                    {filterBy !== 'all' && ` filtered by ${filterBy.replace('-', ' ')}`}
                  </p>
                </div>
              )}
            </div>
          )}

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
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icons.fileText className="h-10 w-10 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No analyses yet
                      </h3>
                      <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        Upload your first lease document to get started with AI-powered analysis and insights
                      </p>
                      <Button asChild size="lg">
                        <Link href="/">
                          <Icons.upload className="h-5 w-5 mr-2" />
                          Analyze Your First Lease
                        </Link>
                      </Button>
                    </div>
                  ) : filteredHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icons.search className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No matching analyses
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Try adjusting your search or filter criteria
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSearchQuery('');
                          setFilterBy('all');
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredHistory.map((analysis) => (
                        <div
                          key={analysis.id}
                          className="group flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md cursor-pointer transition-all duration-200 bg-white"
                          onClick={() => setSelectedAnalysis(analysis)}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                              analysis.redFlags >= 3 
                                ? "bg-red-100 group-hover:bg-red-200" 
                                : analysis.redFlags >= 1
                                ? "bg-yellow-100 group-hover:bg-yellow-200"
                                : "bg-green-100 group-hover:bg-green-200"
                            )}>
                              <Icons.fileText className={cn(
                                "h-6 w-6",
                                analysis.redFlags >= 3 
                                  ? "text-red-600" 
                                  : analysis.redFlags >= 1
                                  ? "text-yellow-600"
                                  : "text-green-600"
                              )} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
                                {analysis.fileName}
                              </h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                <span className="flex items-center">
                                  <Icons.fileText className="h-3 w-3 mr-1" />
                                  {formatFileSize(analysis.fileSize)}
                                </span>
                                <span>•</span>
                                <span className="flex items-center">
                                  <Icons.calendar className="h-3 w-3 mr-1" />
                                  {formatDate(analysis.analyzedAt)}
                                </span>
                                <span>•</span>
                                <span className={cn(
                                  "flex items-center font-medium",
                                  analysis.redFlags >= 3 
                                    ? "text-red-600" 
                                    : analysis.redFlags >= 1
                                    ? "text-yellow-600"
                                    : "text-green-600"
                                )}>
                                  <Icons.shield className="h-3 w-3 mr-1" />
                                  {analysis.redFlags} {analysis.redFlags === 1 ? 'flag' : 'flags'}
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