import React, { useState } from 'react';
import { verifyApiKey } from '../services/geminiService';

interface ApiKeyInputProps {
  onKeyProvided: () => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onKeyProvided }) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim() || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    const trimmedKey = apiKey.trim();

    try {
      await verifyApiKey(trimmedKey);
      // If verification is successful, store the key and proceed
      localStorage.setItem('gemini_api_key', trimmedKey);
      onKeyProvided();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Terjadi kesalahan yang tidak diketahui.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-lg border border-border-color shadow-black/30">
        <div className="text-center">
            <h1 className="text-2xl font-semibold text-primary-text">
                Masukkan Kunci API Gemini Anda
            </h1>
            <p className="text-secondary-text mt-4 text-sm">
                Aplikasi ini membutuhkan kunci API Google Gemini untuk berfungsi. Kunci Anda akan diverifikasi dan disimpan di browser Anda untuk penggunaan di masa mendatang.
            </p>
             <p className="text-secondary-text mt-3 text-xs">
                Dapatkan kunci API Anda dari <a href="https://aistudio.google.com/keys" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">Google AI Studio</a>.
            </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="api-key" className="sr-only">Google Gemini API Key</label>
            <input
              id="api-key"
              name="api-key"
              type="password"
              autoComplete="off"
              required
              autoFocus
              className={`appearance-none rounded-lg relative block w-full px-4 py-3 border bg-background placeholder-secondary-text/70 text-primary-text focus:outline-none focus:ring-1 focus:border-accent-blue sm:text-sm transition-colors ${error ? 'border-error-red focus:ring-error-red' : 'border-border-color focus:ring-accent-blue'}`}
              placeholder="Kunci API Anda"
              value={apiKey}
              onChange={(e) => { setApiKey(e.target.value); setError(null); }}
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-error-red text-sm text-center font-medium">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-background bg-accent-blue hover:bg-accent-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-accent-blue transition-all shadow-lg shadow-black/20 disabled:bg-accent-blue/50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-background" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memverifikasi...
                </>
              ) : (
                'Simpan & Lanjutkan'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApiKeyInput;