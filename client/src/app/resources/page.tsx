'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'legal' | 'financial' | 'rights' | 'emergency';
  type: 'guide' | 'tool' | 'contact' | 'external';
  link?: string;
  phone?: string;
  content?: string;
}

const resources: Resource[] = [
  {
    id: '1',
    title: 'Tenant Rights Handbook',
    description: 'Comprehensive guide to understanding your rights as a tenant',
    category: 'rights',
    type: 'guide',
    content: 'Your complete guide to tenant rights and responsibilities...'
  },
  {
    id: '2',
    title: 'Security Deposit Guide',
    description: 'Learn when and how to get your security deposit back',
    category: 'financial',
    type: 'guide',
    content: 'Understanding security deposit laws and your rights...'
  },
  {
    id: '3',
    title: 'Legal Aid Hotline',
    description: 'Free legal advice for housing issues',
    category: 'legal',
    type: 'contact',
    phone: '1-800-LEGAL-AID'
  },
  {
    id: '4',
    title: 'Rent Stabilization Board',
    description: 'File complaints about rent increases and housing conditions',
    category: 'legal',
    type: 'external',
    link: 'https://www.example.gov/rent-board'
  },
  {
    id: '5',
    title: 'Emergency Housing Assistance',
    description: '24/7 help for housing emergencies and homelessness prevention',
    category: 'emergency',
    type: 'contact',
    phone: '211'
  },
  {
    id: '6',
    title: 'Fair Housing Commission',
    description: 'Report discrimination and learn about fair housing laws',
    category: 'rights',
    type: 'external',
    link: 'https://www.hud.gov/fairhousing'
  },
  {
    id: '7',
    title: 'Lease Negotiation Tips',
    description: 'Strategies for negotiating better lease terms',
    category: 'rights',
    type: 'guide',
    content: 'Expert tips for negotiating with landlords...'
  },
  {
    id: '8',
    title: 'Eviction Prevention',
    description: 'Know your rights and options if facing eviction',
    category: 'emergency',
    type: 'guide',
    content: 'Understanding the eviction process and your defenses...'
  }
];

const categories = [
  { id: 'all', label: 'All Resources', icon: 'fileText' as const },
  { id: 'legal', label: 'Legal Help', icon: 'scale' as const },
  { id: 'financial', label: 'Financial', icon: 'dollarSign' as const },
  { id: 'rights', label: 'Tenant Rights', icon: 'shield' as const },
  { id: 'emergency', label: 'Emergency', icon: 'alertTriangle' as const }
];

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredResources = selectedCategory === 'all' 
    ? resources 
    : resources.filter(resource => resource.category === selectedCategory);

  const getCategoryIcon = (iconName: string) => {
    const iconMap = {
      fileText: Icons.fileText,
      scale: Icons.shield,
      dollarSign: Icons.dollarSign,
      shield: Icons.shield,
      alertTriangle: Icons.alertTriangle
    };
    return iconMap[iconName as keyof typeof iconMap] || Icons.fileText;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return Icons.bookOpen;
      case 'tool': return Icons.settings;
      case 'contact': return Icons.phone;
      case 'external': return Icons.externalLink;
      default: return Icons.fileText;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'legal': return 'text-blue-600 bg-blue-100';
      case 'financial': return 'text-green-600 bg-green-100';
      case 'rights': return 'text-purple-600 bg-purple-100';
      case 'emergency': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Tenant Resources</h1>
            <p className="text-xl text-gray-600">
              Essential tools, guides, and contacts to protect your rights as a tenant
            </p>
          </div>

          {/* Emergency Banner */}
          <Card className="border-red-200 bg-red-50 mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Icons.alertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-900">Need Immediate Help?</h3>
                  <p className="text-red-800">
                    For housing emergencies, call <span className="font-semibold">211</span> or contact your local emergency housing assistance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Categories */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                  <CardDescription>
                    Browse resources by topic
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories.map((category) => {
                    const IconComponent = getCategoryIcon(category.icon);
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-blue-100 text-blue-900'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span className="font-medium">{category.label}</span>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Quick Contact */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Quick Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Icons.phone className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold">Emergency Housing</h4>
                    <p className="text-2xl font-bold text-blue-600">211</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Icons.shield className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold">Legal Aid</h4>
                    <p className="text-sm font-mono">1-800-LEGAL-AID</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content - Resources */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {categories.find(cat => cat.id === selectedCategory)?.label}
                </h2>
                <p className="text-gray-600">
                  {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''} available
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredResources.map((resource) => {
                  const TypeIcon = getTypeIcon(resource.type);
                  return (
                    <Card key={resource.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(resource.category)}`}>
                              <TypeIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{resource.title}</CardTitle>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(resource.category)}`}>
                                  {resource.category}
                                </span>
                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                  {resource.type}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-4">
                          {resource.description}
                        </CardDescription>
                        
                        <div className="flex space-x-2">
                          {resource.type === 'contact' && resource.phone && (
                            <Button className="flex-1">
                              <Icons.phone className="h-4 w-4 mr-2" />
                              Call {resource.phone}
                            </Button>
                          )}
                          {resource.type === 'external' && resource.link && (
                            <Button className="flex-1" asChild>
                              <a href={resource.link} target="_blank" rel="noopener noreferrer">
                                <Icons.externalLink className="h-4 w-4 mr-2" />
                                Visit Website
                              </a>
                            </Button>
                          )}
                          {resource.type === 'guide' && (
                            <Button asChild className="flex-1">
                              <Link href={`/resources/${resource.id}`}>
                                <Icons.bookOpen className="h-4 w-4 mr-2" />
                                Read Guide
                              </Link>
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Icons.bookmark className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {filteredResources.length === 0 && (
                <div className="text-center py-12">
                  <Icons.search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
                  <p className="text-gray-600">
                    Try selecting a different category or check back later for more resources
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}