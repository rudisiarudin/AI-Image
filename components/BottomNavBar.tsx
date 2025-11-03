import React from 'react';

type ActiveView = 'generator' | 'result';

interface BottomNavBarProps {
    activeView: ActiveView;
    setActiveView: (view: ActiveView) => void;
}

const GeneratorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

const ResultIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);


const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, setActiveView }) => {
    
    const navItems = [
        { id: 'generator', label: 'Generator', icon: GeneratorIcon },
        { id: 'result', label: 'Hasil', icon: ResultIcon },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-lg border-t border-border-color z-20">
            <div className="container mx-auto flex justify-around p-1">
                {navItems.map(item => {
                    const isActive = activeView === item.id;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id as ActiveView)}
                            className={`flex flex-col items-center justify-center w-full py-1 transition-colors rounded-lg ${
                                isActive ? 'text-accent-blue' : 'text-secondary-text hover:bg-surface-2'
                            }`}
                        >
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${isActive ? 'bg-accent-blue/10' : ''}`}>
                                <Icon className="w-5 h-5" />
                                <span className="text-sm font-medium">{item.label}</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNavBar;