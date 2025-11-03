import React, { useState } from 'react';

const ExternalLinkIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);

const LockIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);


interface HeaderProps {
    onLock: () => void;
    remainingTime?: number | null;
}

const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const Header: React.FC<HeaderProps> = ({ onLock, remainingTime }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-background/80 backdrop-blur-md border-b border-border-color sticky top-0 z-10 flex-shrink-0">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div>
                    <h1 className="text-xl lg:text-2xl font-semibold text-primary-text">
                        IT Palugada - <span className="text-accent-blue">AI Studio</span>
                    </h1>
                    <p className="text-xs text-secondary-text mt-1">Your Vision, Instantly Realized</p>
                </div>
                 <div className="relative">
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 rounded-lg bg-surface border border-border-color hover:bg-surface-2 transition-colors"
                    >
                        <MenuIcon className="w-5 h-5" />
                    </button>
                    {isMenuOpen && (
                        <div 
                            className="absolute top-full right-0 mt-2 w-56 bg-surface rounded-xl border border-border-color shadow-lg shadow-black/20 z-20"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <div className="p-2 flex flex-col gap-1">
                                <a 
                                    href="https://aistudio.google.com/prompts/new_video" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-primary-text rounded-md hover:bg-surface-2 transition-colors"
                                >
                                    <ExternalLinkIcon className="w-4 h-4 text-secondary-text" />
                                    Buka Veo
                                </a>
                                <a 
                                    href="https://translate.google.co.id/?hl=id&sl=id&tl=en&op=translate" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-primary-text rounded-md hover:bg-surface-2 transition-colors"
                                >
                                    <ExternalLinkIcon className="w-4 h-4 text-secondary-text" />
                                    Buka Translate
                                </a>
                                <a 
                                    href="https://gemini.google.com/" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-primary-text rounded-md hover:bg-surface-2 transition-colors"
                                >
                                    <ExternalLinkIcon className="w-4 h-4 text-secondary-text" />
                                    Buka Gemini
                                </a>
                                <div className="border-t border-border-color my-1"></div>
                                <div className="flex flex-col items-center px-3 py-2">
                                    <button 
                                        onClick={onLock}
                                        className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-error-red bg-error-red-bg border border-error-red/50 rounded-lg hover:bg-error-red/20 transition-all"
                                        title="Reset Access & Lock App"
                                    >
                                        <LockIcon className="w-4 h-4" />
                                        Lock
                                    </button>
                                    {remainingTime !== null && remainingTime > 0 && (
                                        <p className="text-xs text-secondary-text font-mono mt-2">
                                            Sisa Waktu: {formatTime(remainingTime)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;