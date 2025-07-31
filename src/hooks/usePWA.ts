// hooks/usePWA.ts
import { useState, useEffect } from 'react';

// TypeScript interface for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const PWA_INSTALLED_KEY = 'pwa-installation-state';

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Check if currently running as installed PWA
    const isCurrentlyRunningAsPWA = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSInstalled = (window.navigator as any).standalone === true;
      const isTWA = document.referrer.includes('android-app://');
      const isMinimalUI = window.matchMedia('(display-mode: minimal-ui)').matches;

      return isStandalone || isIOSInstalled || isTWA || isMinimalUI;
    };

    // Check if PWA was ever installed (persisted state)
    const wasEverInstalled = () => {
      try {
        const stored = localStorage.getItem(PWA_INSTALLED_KEY);
        return stored === 'true';
      } catch {
        return false;
      }
    };

    // Determine installation state
    const determineInstallationState = () => {
      const currentlyPWA = isCurrentlyRunningAsPWA();
      const wasInstalled = wasEverInstalled();

      console.log('PWA State Check:', {
        currentlyRunningAsPWA: currentlyPWA,
        wasEverInstalled: wasInstalled,
        context: currentlyPWA ? 'PWA App' : 'Browser'
      });

      // If currently running as PWA, definitely installed
      if (currentlyPWA) {
        // Make sure we mark it as installed in storage
        try {
          localStorage.setItem(PWA_INSTALLED_KEY, 'true');
        } catch (e) {
          console.log('Could not save install state:', e);
        }
        return true;
      }

      // If not currently PWA, check if it was ever installed
      return wasInstalled;
    };

    const initialInstallState = determineInstallationState();
    setIsInstalled(initialInstallState);

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      console.log('beforeinstallprompt event fired - app is installable');
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);

      // If we get this event, the app is definitely not installed yet
      // (browsers don't fire this for already installed apps)
      setIsInstalled(false);
      try {
        localStorage.removeItem(PWA_INSTALLED_KEY);
      } catch (e) {
        console.log('Could not clear install state:', e);
      }
    };

    const handleAppInstalled = () => {
      console.log('PWA installation completed');
      setIsInstallable(false);
      setIsInstalled(true);
      setDeferredPrompt(null);

      // Persist the installation state
      try {
        localStorage.setItem(PWA_INSTALLED_KEY, 'true');
      } catch (e) {
        console.log('Could not save install state:', e);
      }
    };

    // Listen for display mode changes
    const standaloneMediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = () => {
      const newState = determineInstallationState();
      setIsInstalled(newState);
    };

    // Event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled);
    standaloneMediaQuery.addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
      standaloneMediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  const installApp = async (): Promise<void> => {
    if (!deferredPrompt) {
      console.log('No install prompt available');
      return;
    }

    try {
      console.log('Showing install prompt...');
      await deferredPrompt.prompt();

      const { outcome } = await deferredPrompt.userChoice;
      console.log('Install prompt result:', outcome);

      if (outcome === 'accepted') {
        console.log('User accepted installation');
        setIsInstalled(true);
        // Save install state immediately
        try {
          localStorage.setItem(PWA_INSTALLED_KEY, 'true');
        } catch (e) {
          console.log('Could not save install state:', e);
        }
      } else {
        console.log('User dismissed installation');
      }

      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('Error during installation:', error);
    }
  };

  // Method to manually mark as installed (for iOS/manual installations)
  const markAsInstalled = () => {
    setIsInstalled(true);
    try {
      localStorage.setItem(PWA_INSTALLED_KEY, 'true');
    } catch (e) {
      console.log('Could not save install state:', e);
    }
  };

  // Method to reset installation state (for testing)
  const resetInstallState = () => {
    setIsInstalled(false);
    setIsInstallable(false);
    setDeferredPrompt(null);
    try {
      localStorage.removeItem(PWA_INSTALLED_KEY);
    } catch (e) {
      console.log('Could not clear install state:', e);
    }
  };

  const getInstallStatus = () => {
    if (isInstalled) return 'installed';
    if (isInstallable) return 'installable';
    return 'not-supported';
  };

  return {
    isInstallable,
    isInstalled,
    installStatus: getInstallStatus(),
    installApp,
    markAsInstalled, // For manual iOS installations
    resetInstallState // For testing
  };
};