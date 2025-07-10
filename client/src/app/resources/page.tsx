'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

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

// Phase 1: Expanded resource content
const resources: Resource[] = [
  {
    id: '1',
    title: 'Tenant Rights Handbook',
    description: 'Comprehensive guide to understanding your rights as a tenant, including lease terms, habitability standards, and legal protections.',
    category: 'rights',
    type: 'guide',
    content: 'Your complete guide to tenant rights and responsibilities including privacy rights, repair requests, and protection from retaliation.'
  },
  {
    id: '2',
    title: 'Security Deposit Guide',
    description: 'Learn when and how to get your security deposit back, including documentation requirements and dispute resolution.',
    category: 'financial',
    type: 'guide',
    content: 'Understanding security deposit laws, proper documentation, and steps to take if your deposit is wrongfully withheld.'
  },
  {
    id: '3',
    title: 'Legal Aid Hotline',
    description: 'Free legal advice for housing issues, tenant rights violations, and landlord disputes.',
    category: 'legal',
    type: 'contact',
    phone: '1-800-LEGAL-AID'
  },
  {
    id: '4',
    title: 'Rent Stabilization Board',
    description: 'File complaints about illegal rent increases, housing code violations, and habitability issues.',
    category: 'legal',
    type: 'external',
    link: 'https://www.example.gov/rent-board'
  },
  {
    id: '5',
    title: 'Emergency Housing Assistance',
    description: '24/7 help for housing emergencies, homelessness prevention, and emergency rental assistance programs.',
    category: 'emergency',
    type: 'contact',
    phone: '211'
  },
  {
    id: '6',
    title: 'Fair Housing Commission',
    description: 'Report housing discrimination based on race, gender, disability, family status, and other protected characteristics.',
    category: 'rights',
    type: 'external',
    link: 'https://www.hud.gov/fairhousing'
  },
  {
    id: '7',
    title: 'Lease Negotiation Tips',
    description: 'Expert strategies for negotiating better lease terms, understanding clauses, and protecting your interests.',
    category: 'rights',
    type: 'guide',
    content: 'Professional tips for lease negotiations, red flag clauses to avoid, and how to propose favorable amendments.'
  },
  {
    id: '8',
    title: 'Eviction Prevention',
    description: 'Know your rights and legal options if facing eviction, including tenant defenses and assistance programs.',
    category: 'emergency',
    type: 'guide',
    content: 'Understanding the eviction process, your legal defenses, emergency assistance programs, and how to respond to notices.'
  },
  {
    id: '9',
    title: 'Rent Control Information',
    description: 'Understanding rent control laws, allowable increases, and tenant protections in regulated units.',
    category: 'financial',
    type: 'guide',
    content: 'Complete guide to rent control regulations, calculating legal increases, and challenging illegal rent hikes.'
  },
  {
    id: '10',
    title: 'Housing Code Violations',
    description: 'How to report and document housing code violations, health hazards, and habitability issues.',
    category: 'legal',
    type: 'guide',
    content: 'Step-by-step guide to identifying, documenting, and reporting housing code violations to authorities.'
  },
  {
    id: '11',
    title: 'Disability Rights in Housing',
    description: 'Reasonable accommodations, accessibility requirements, and disability rights in rental housing.',
    category: 'rights',
    type: 'guide',
    content: 'Understanding your rights to reasonable accommodations, service animals, and accessible housing modifications.'
  },
  {
    id: '12',
    title: 'Tenant Union Resources',
    description: 'Find local tenant unions, organize with other renters, and collective bargaining information.',
    category: 'rights',
    type: 'external',
    link: 'https://www.tenantstogether.org'
  }
];

const categories = [
  { id: 'all', label: 'All Resources', icon: 'fileText' as const, count: 0 },
  { id: 'legal', label: 'Legal Help', icon: 'shield' as const, count: 0 },
  { id: 'financial', label: 'Financial', icon: 'dollarSign' as const, count: 0 },
  { id: 'rights', label: 'Tenant Rights', icon: 'user' as const, count: 0 },
  { id: 'emergency', label: 'Emergency', icon: 'alertTriangle' as const, count: 0 }
];

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredResources, setFilteredResources] = useState<Resource[]>(resources);

  // Phase 1: Enhanced filtering and search
  useEffect(() => {
    let filtered = selectedCategory === 'all' 
      ? resources 
      : resources.filter(resource => resource.category === selectedCategory);

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(resource => 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (resource.content && resource.content.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredResources(filtered);
  }, [selectedCategory, searchQuery]);

  // Update category counts
  const categoriesWithCounts = categories.map(category => ({
    ...category,
    count: category.id === 'all' 
      ? resources.length 
      : resources.filter(r => r.category === category.id).length
  }));

  const getCategoryIcon = (iconName: string) => {
    const iconMap = {
      fileText: Icons.fileText,
      scale: Icons.shield,
      dollarSign: Icons.dollarSign,
      shield: Icons.shield,
      user: Icons.user,
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Tenant Resources</h1>
                <p className="text-gray-600">
                  Essential tools, guides, and contacts to protect your rights as a tenant
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-blue-50 px-3 py-2 rounded-lg">
                  <span className="text-sm font-medium text-blue-700">
                    {resources.length} Resources Available
                  </span>
                </div>
                <Button asChild>
                  <Link href="/dashboard">
                    <Icons.fileText className="h-4 w-4 mr-2" />
                    View Dashboard
                  </Link>
                </Button>
              </div>
            </div>

            {/* Phase 1: Enhanced Search and Filter Controls */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search resources by title, description, or content..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Clear Search */}
                {searchQuery && (
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchQuery('')}
                    className="whitespace-nowrap"
                  >
                    <Icons.x className="h-4 w-4 mr-2" />
                    Clear Search
                  </Button>
                )}
              </div>

              {/* Results Summary */}
              {searchQuery && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Showing {filteredResources.length} of {resources.length} resources matching &ldquo;{searchQuery}&rdquo;
                  </p>
                </div>
              )}
            </div>
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
                  {categoriesWithCounts.map((category) => {
                    const IconComponent = getCategoryIcon(category.icon);
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 group",
                          selectedCategory === category.id
                            ? 'bg-blue-100 text-blue-900 shadow-sm border border-blue-200'
                            : 'hover:bg-gray-50 hover:shadow-sm border border-transparent'
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                            selectedCategory === category.id
                              ? 'bg-blue-200'
                              : 'bg-gray-100 group-hover:bg-gray-200'
                          )}>
                            <IconComponent className={cn(
                              "h-4 w-4",
                              selectedCategory === category.id
                                ? 'text-blue-700'
                                : 'text-gray-600'
                            )} />
                          </div>
                          <span className="font-medium">{category.label}</span>
                        </div>
                        <span className={cn(
                          "text-sm font-medium px-2 py-1 rounded-full",
                          selectedCategory === category.id
                            ? 'bg-blue-200 text-blue-800'
                            : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                        )}>
                          {category.count}
                        </span>
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

              {filteredResources.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icons.search className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No resources found
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {searchQuery 
                      ? `No resources match your search for "${searchQuery}"` 
                      : `No resources available in the ${categoriesWithCounts.find(cat => cat.id === selectedCategory)?.label} category`
                    }
                  </p>
                  <div className="flex gap-2 justify-center">
                    {searchQuery && (
                      <Button 
                        variant="outline" 
                        onClick={() => setSearchQuery('')}
                      >
                        Clear Search
                      </Button>
                    )}
                    <Button 
                      onClick={() => {
                        setSelectedCategory('all');
                        setSearchQuery('');
                      }}
                    >
                      View All Resources
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredResources.map((resource) => {
                    const TypeIcon = getTypeIcon(resource.type);
                    return (
                      <Card key={resource.id} className="group hover:shadow-xl hover:border-blue-300 transition-all duration-200 cursor-pointer bg-white">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110",
                                getCategoryColor(resource.category)
                              )}>
                                <TypeIcon className="h-6 w-6" />
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-lg group-hover:text-blue-900 transition-colors">
                                  {resource.title}
                                </CardTitle>
                                <div className="flex items-center space-x-2 mt-2">
                                  <span className={cn(
                                    "px-3 py-1 text-xs font-medium rounded-full capitalize",
                                    getCategoryColor(resource.category)
                                  )}>
                                    {resource.category.replace('-', ' ')}
                                  </span>
                                  <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full capitalize">
                                    {resource.type}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <CardDescription className="mb-6 text-gray-600 leading-relaxed">
                            {resource.description}
                          </CardDescription>
                          
                          <div className="flex gap-3">
                            {resource.type === 'contact' && resource.phone && (
                              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                                <Icons.phone className="h-4 w-4 mr-2" />
                                Call {resource.phone}
                              </Button>
                            )}
                            {resource.type === 'external' && resource.link && (
                              <Button className="flex-1 bg-blue-600 hover:bg-blue-700" asChild>
                                <a href={resource.link} target="_blank" rel="noopener noreferrer">
                                  <Icons.externalLink className="h-4 w-4 mr-2" />
                                  Visit Website
                                </a>
                              </Button>
                            )}
                            {resource.type === 'guide' && (
                              <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700">
                                <Link href={`/resources/${resource.id}`}>
                                  <Icons.bookOpen className="h-4 w-4 mr-2" />
                                  Read Guide
                                </Link>
                              </Button>
                            )}
                            <Button variant="outline" size="sm" className="hover:bg-gray-50">
                              <Icons.bookmark className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}