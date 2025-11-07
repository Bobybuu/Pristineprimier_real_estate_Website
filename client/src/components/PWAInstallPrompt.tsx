import { useState, useEffect } from 'react';
import { X, Download, Share, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    console.log('🔍 PWAInstallPrompt mounting...');
    
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('📱 App already installed (standalone mode)');
      setIsStandalone(true);
      return;
    }

    // Check for iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);
    console.log('📱 Device is iOS:', isIOSDevice);

    // Check if prompt was recently dismissed
    const dismissedTime = localStorage.getItem('pwa-prompt-dismissed');
    console.log('⏰ Dismissed time from localStorage:', dismissedTime);
    
    if (dismissedTime) {
      const timeDiff = Date.now() - parseInt(dismissedTime);
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
      console.log('⏰ Days since dismissal:', daysDiff);
      
      if (timeDiff < 7 * 24 * 60 * 60 * 1000) {
        console.log('🚫 Prompt dismissed recently, not showing');
        return;
      }
    }

    // 🎯 TEMPORARY FIX: Force show prompt for testing
    console.log('🔧 TEMPORARY: Forcing prompt to show for testing');
    setTimeout(() => {
      console.log('🔄 Setting showPrompt to true');
      setShowPrompt(true);
    }, 3000);

    // Listen for beforeinstallprompt event (if it ever fires)
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      console.log('🎯 beforeinstallprompt event caught!', e);
      e.preventDefault();
      setDeferredPrompt(e);
    };

    if ('beforeinstallprompt' in window) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      console.log('👂 Listening for beforeinstallprompt event');
    } else {
      console.log('⚠️ beforeinstallprompt not supported in this browser');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, [isIOS]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Use the actual install prompt if available
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setShowPrompt(false);
      }
      
      setDeferredPrompt(null);
    } else {
      // Fallback: Show manual installation instructions
      console.log('Manual installation required');
      // You could show a modal with installation instructions here
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Store dismissal time in localStorage
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 animate-in slide-in-from-bottom-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-[#f77f77] rounded-full flex items-center justify-center">
          <Smartphone className="h-5 w-5 text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-1">Install PristinePrimier</h3>
          <p className="text-xs text-gray-600 mb-3">
            Install our app for a better experience and quick access to properties.
          </p>
          
          {isIOS ? (
            <div className="text-xs text-gray-600 mb-2 flex items-center">
              Tap <Share className="h-3 w-3 inline mx-1" /> then "Add to Home Screen"
            </div>
          ) : (
            <div className="text-xs text-gray-600 mb-2">
              Click install to add to your home screen
            </div>
          )}
          
          <div className="flex gap-2">
            <Button 
              onClick={handleInstallClick}
              size="sm" 
              className="bg-[#f77f77] hover:bg-[#f77f77]/90 text-white text-xs"
            >
              <Download className="h-3 w-3 mr-1" />
              Install
            </Button>
            <Button 
              onClick={handleDismiss}
              variant="outline" 
              size="sm" 
              className="text-xs"
            >
              Not Now
            </Button>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="h-6 w-6 p-0 flex-shrink-0"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;