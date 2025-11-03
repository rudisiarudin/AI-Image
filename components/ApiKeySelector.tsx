import React, { useState, useEffect } from 'react';

// FIX: Moved the `AIStudio` interface declaration inside the `declare global` block.
// This makes the `AIStudio` type global, resolving the "Subsequent property declarations must have the same type" error
// that can occur when multiple modules declare types for the same global property.
declare global {
    interface AIStudio {
        hasSelectedApiKey: () => Promise<boolean>;
        openSelectKey: () => Promise<void>;
    }

    interface Window {
        aistudio?: AIStudio;
    }
}

interface ApiKeySelectorProps {
  onKeySelected: () => void;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
        onKeySelected();
      } else {
        setIsChecking(false);
      }
    };
    
    // Give the aistudio object a moment to initialize
    setTimeout(checkKey, 100);

  }, [onKeySelected]);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Per guideline: Assume selection is successful after triggering the dialog to avoid race conditions.
      onKeySelected();
    } else {
      alert("API selection interface is not available in this environment.");
    }
  };

  if (isChecking) {
    return (
       <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="text-center text-secondary-text">
            <p>Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-lg border border-border-color shadow-black/30 text-center">
        <h1 className="text-2xl font-semibold text-primary-text">
            Welcome to <span className="text-accent-blue">AI Studio</span>
        </h1>
        <p className="text-secondary-text mt-4 text-sm">
            To use this application, you need to select a Google AI API key. Your key is stored securely and used only for your requests.
        </p>
        <p className="text-secondary-text mt-3 text-xs">
            Project activity may incur billing charges. For more information, please see the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">billing documentation</a>.
        </p>
        <div className="mt-8">
            <button
              onClick={handleSelectKey}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-background bg-accent-blue hover:bg-accent-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-accent-blue transition-all shadow-lg shadow-black/20"
            >
              Select API Key
            </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySelector;