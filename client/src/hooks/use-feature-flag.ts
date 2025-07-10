'use client';

import { useFeatureValue } from '@growthbook/growthbook-react';
import { FeatureFlags } from '@/lib/feature-flags';

// Hook to use feature flags throughout the application
export function useFeatureFlag(flag: keyof FeatureFlags): boolean {
  return useFeatureValue(flag, false);
}


// Hook for feature flag with fallback value
export function useFeatureFlagWithFallback(
  flag: keyof FeatureFlags,
  fallback: boolean
): boolean {
  return useFeatureValue(flag, fallback);
}

// Hook to check if user is in development mode
export function useIsDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

// Hook to get all feature flags status (for debugging)
export function useAllFeatureFlags(): Record<keyof FeatureFlags, boolean> {
  const enhancedNavigation = useFeatureValue('enhanced-navigation', false);
  const enhancedUpload = useFeatureValue('enhanced-upload', false);
  const userDashboard = useFeatureValue('user-dashboard', false);
  const resourceCenter = useFeatureValue('resource-center', false);
  const enhancedAnalysis = useFeatureValue('enhanced-analysis', false);
  const authentication = useFeatureValue('authentication', false);
  const dragDropUpload = useFeatureValue('drag-drop-upload', false);
  const filePreview = useFeatureValue('file-preview', false);
  const analysisExport = useFeatureValue('analysis-export', false);
  const darkMode = useFeatureValue('dark-mode', false);
  const mobileOptimization = useFeatureValue('mobile-optimization', false);
  const accessibilityEnhanced = useFeatureValue('accessibility-enhanced', false);

  return {
    'enhanced-navigation': enhancedNavigation,
    'enhanced-upload': enhancedUpload,
    'user-dashboard': userDashboard,
    'resource-center': resourceCenter,
    'enhanced-analysis': enhancedAnalysis,
    'authentication': authentication,
    'drag-drop-upload': dragDropUpload,
    'file-preview': filePreview,
    'analysis-export': analysisExport,
    'dark-mode': darkMode,
    'mobile-optimization': mobileOptimization,
    'accessibility-enhanced': accessibilityEnhanced,
  };
}