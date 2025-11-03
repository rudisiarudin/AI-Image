import React, { useState } from 'react';

interface PinAccessProps {
  onUnlock: (pin: string) => boolean;
}

const PinAccess: React.FC<PinAccessProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) return;
    setError('');
    const success = onUnlock(pin);
    if (!success) {
      setError('Invalid PIN. Please try again.');
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-sm bg-surface p-8 rounded-2xl shadow-lg border border-border-color shadow-black/30">
        <div className="text-center">
            <h1 className="text-2xl font-semibold text-primary-text">
                IT Palugada - <span className="text-accent-blue">AI Studio</span>
            </h1>
            <p className="text-secondary-text mt-2 text-sm">Please enter your access PIN.</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="pin" className="sr-only">PIN</label>
            <input
              id="pin"
              name="pin"
              type="password"
              autoComplete="current-password"
              required
              autoFocus
              className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-border-color bg-background placeholder-secondary-text/70 text-primary-text focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-accent-blue sm:text-sm"
              placeholder="Access PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          </div>
          {error && <p className="text-error-red text-sm text-center">{error}</p>}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-background bg-accent-blue hover:bg-accent-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-accent-blue transition-all shadow-lg shadow-black/20"
            >
              Unlock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PinAccess;