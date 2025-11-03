import React, { useState } from 'react';

const ExternalLinkIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);

const LogoutIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);


interface HeaderProps {
    onLogout: () => void;
    googleUser: any | null;
}

const Header: React.FC<HeaderProps> = ({ onLogout, googleUser }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-background/80 backdrop-blur-md border-b border-border-color sticky top-0 z-10 flex-shrink-0">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div>
                    <h1 className="text-xl lg:text-2xl font-semibold text-primary-text">
                        IT Palugada - <span className="text-accent-blue">AI Studio</span>
                    </h1>
                    <p className="text-xs text-secondary-text mt-1">Your Vision, Instantly Realized</p>
                </div>
                 <div className="flex items-center gap-4">
                    {googleUser && (
                        <div className="hidden sm:flex items-center gap-3 text-right">
                            <div>
                                <p className="text-sm font-medium text-primary-text">{googleUser.name}</p>
                                <p className="text-xs text-secondary-text">{googleUser.email}</p>
                            </div>
                            <img src={googleUser.picture} alt="User profile" className="w-10 h-10 rounded-full border-2 border-border-color"/>
                        </div>
                    )}
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
                                            onClick={onLogout}
                                            className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-error-red bg-error-red-bg border border-error-red/50 rounded-lg hover:bg-error-red/20 transition-all"
                                            title="Logout & Clear API Key"
                                        >
                                            <LogoutIcon className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;