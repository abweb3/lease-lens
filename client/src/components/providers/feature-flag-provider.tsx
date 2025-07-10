'use client';

import { GrowthBookProvider } from '@growthbook/growthbook-react';
import { initializeGrowthBook } from '@/lib/feature-flags';
import { useEffect, useState } from 'react';

interface FeatureFlagProviderProps {
  children: React.ReactNode;
}

export function FeatureFlagProvider({ children }: FeatureFlagProviderProps) {
  const [growthbook, setGrowthbook] = useState(() => initializeGrowthBook());

  useEffect(() => {
    // Initialize GrowthBook on mount
    const gb = initializeGrowthBook();
    setGrowthbook(gb);

    // Cleanup on unmount
    return () => {
      gb.destroy();
    };
  }, []);

  return (
    <GrowthBookProvider growthbook={growthbook}>
      {children}
    </GrowthBookProvider>
  );
}