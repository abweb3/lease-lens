'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFeatureFlag } from '@/hooks/use-feature-flag';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';

interface NavigationItem {
  href: string;
  label: string;
  icon?: keyof typeof Icons;
  requiresAuth?: boolean;
  featureFlag?: string;
}

const navigationItems: NavigationItem[] = [
  {
    href: '/',
    label: 'Analyze',
    icon: 'fileText',
  },
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: 'home',
    requiresAuth: true,
    featureFlag: 'user-dashboard',
  },
  {
    href: '/resources',
    label: 'Resources',
    icon: 'bookOpen',
    featureFlag: 'resource-center',
  },
  {
    href: '/help',
    label: 'Help',
    icon: 'helpCircle',
  },
];

// Original layout component (simple)
function OriginalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}

// Enhanced navigation header
function NavigationHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const isAuthEnabled = useFeatureFlag('authentication');
  
  // Get all feature flags we might need
  const userDashboard = useFeatureFlag('user-dashboard');
  const resourceCenter = useFeatureFlag('resource-center');
  const enhancedAnalysis = useFeatureFlag('enhanced-analysis');
  
  // Filter navigation items based on feature flags
  const visibleItems = navigationItems.filter(item => {
    if (item.featureFlag) {
      // Check specific feature flags
      if (item.featureFlag === 'user-dashboard' && !userDashboard) return false;
      if (item.featureFlag === 'resource-center' && !resourceCenter) return false;
      if (item.featureFlag === 'enhanced-analysis' && !enhancedAnalysis) return false;
    }
    if (item.requiresAuth && !isAuthEnabled) {
      return false;
    }
    return true;
  });

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Icons.shield className="h-8 w-8 text-lease-primary mr-2" />
            <span className="text-xl font-bold text-gray-900">
              Lease Lens
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {visibleItems.map((item) => {
              const Icon = item.icon ? Icons[item.icon] : null;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'text-lease-primary bg-lease-primary-light'
                      : 'text-gray-700 hover:text-lease-primary hover:bg-gray-100'
                  )}
                >
                  {Icon && <Icon className="mr-2 h-4 w-4" />}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthEnabled ? (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Icons.user className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
                <Button size="sm">
                  Get Started
                </Button>
              </div>
            ) : (
              <Button size="sm">
                <Icons.zap className="mr-2 h-4 w-4" />
                Get Started
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <Icons.x className="h-5 w-5" />
              ) : (
                <Icons.menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="space-y-2">
              {visibleItems.map((item) => {
                const Icon = item.icon ? Icons[item.icon] : null;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? 'text-lease-primary bg-lease-primary-light'
                        : 'text-gray-700 hover:text-lease-primary hover:bg-gray-100'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {Icon && <Icon className="mr-2 h-4 w-4" />}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

// Enhanced footer
function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <Icons.shield className="h-6 w-6 text-lease-primary mr-2" />
              <span className="font-bold text-gray-900">Lease Lens</span>
            </div>
            <p className="text-sm text-gray-600">
              Empowering tenants with AI-powered lease analysis and comprehensive resources.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 hover:text-lease-primary">
                  Analyze Lease
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-gray-600 hover:text-lease-primary">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-600 hover:text-lease-primary">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/resources/tenant-rights" className="text-gray-600 hover:text-lease-primary">
                  Tenant Rights
                </Link>
              </li>
              <li>
                <Link href="/resources/legal-aid" className="text-gray-600 hover:text-lease-primary">
                  Legal Aid
                </Link>
              </li>
              <li>
                <Link href="/resources/grants" className="text-gray-600 hover:text-lease-primary">
                  Financial Assistance
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:support@leaselens.com" className="text-gray-600 hover:text-lease-primary flex items-center">
                  <Icons.mail className="mr-2 h-4 w-4" />
                  Contact Us
                </a>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-lease-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-lease-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-500">
            © 2025 Lease Lens. All rights reserved. Empowering tenants through technology.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Enhanced layout component
function EnhancedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavigationHeader />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

// Main layout component with feature flag switching
export function AppLayout({ children }: { children: React.ReactNode }) {
  const isEnhancedNavEnabled = useFeatureFlag('enhanced-navigation');

  if (isEnhancedNavEnabled) {
    return <EnhancedLayout>{children}</EnhancedLayout>;
  }

  return <OriginalLayout>{children}</OriginalLayout>;
}