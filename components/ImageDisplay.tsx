
import React from 'react';
import Spinner from './Spinner';
import type { ImageFile } from '../types';

interface ImageDisplayProps {
    image: ImageFile | null;
    text: string | null;
    isLoading: boolean;
    error: string | null;
}

const DownloadIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const CopyIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);


const ImageDisplay: React.FC<ImageDisplayProps> = ({ image, text, isLoading, error }) => {
    const [isCopied, setIsCopied] = React.useState(false);

    const handleCopy = (content: string) => {
        navigator.clipboard.writeText(content).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    const renderTextResult = (resultText: string) => {
        const parts = resultText.split('---PROMPT SUMMARY---');
        const analysis = parts[0].trim();
        const summary = parts.length > 1 ? parts[1].trim() : null;

        return (
            <div className="bg-surface p-4 sm:p-6 rounded-2xl border border-border-color flex flex-col gap-6 w-full max-w-2xl mx-auto">
                <div>
                    <h3 className="text-lg font-semibold text-primary-text mb-3">Hasil Analisis</h3>
                    <div className="bg-background p-4 rounded-lg border border-border-color whitespace-pre-wrap text-secondary-text text-sm font-mono max-h-96 overflow-y-auto">
                        {analysis}
                    </div>
                </div>
                {summary && (
                    <div>
                        <div className="flex justify-between items-center mb-3">
                             <h3 className="text-lg font-semibold text-primary-text">Ringkasan Prompt</h3>
                             <button onClick={() => handleCopy(summary)} className="p-2 bg-surface-2 rounded-lg hover:bg-border-color transition-colors">
                                {isCopied ? <CheckIcon className="w-5 h-5 text-green-400"/> : <CopyIcon className="w-5 h-5 text-secondary-text"/>}
                             </button>
                        </div>
                        <div className="bg-background p-4 rounded-lg border border-border-color whitespace-pre-wrap text-secondary-text text-sm font-mono">
                           {summary}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderContent = () => {
        if (isLoading) {
            return <Spinner />;
        }
        if (error) {
            return (
                 <div className="text-center bg-error-red-bg border border-error-red/50 p-6 rounded-lg max-w-xl mx-auto">
                    <h2 className="text-xl font-bold text-error-red">Terjadi Kesalahan</h2>
                    <p className="mt-2 text-error-red/80 font-mono">{error}</p>
                </div>
            );
        }
        if (image) {
            return (
                 <div className="flex flex-col items-center gap-6">
                    <div className="relative group max-w-4xl w-full">
                        <img 
                            src={image.data} 
                            alt="Generated content" 
                            className="rounded-lg shadow-2xl shadow-black/20 border border-border-color object-contain w-full"
                        />
                    </div>
                    <a
                        href={image.data}
                        download={`generated-image-${Date.now()}.png`}
                        className="flex items-center gap-2 w-full max-w-xs justify-center bg-accent-blue hover:bg-accent-blue-hover text-background font-bold py-3 px-4 rounded-lg transition-all shadow-lg shadow-black/20 hover:shadow-glow-blue"
                    >
                        <DownloadIcon className="w-5 h-5" />
                        Unduh Gambar
                    </a>
                </div>
            );
        }
        if (text) {
            return renderTextResult(text);
        }
        return (
            <div className="text-center text-secondary-text py-10">
                <h2 className="text-2xl font-bold">Hasil Akan Muncul di Sini</h2>
                <p className="mt-2">Buat gambar pertama Anda dari tab Generator.</p>
            </div>
        );
    };
    
    return (
        <div className="w-full h-full flex items-center justify-center p-4">
            {renderContent()}
        </div>
    );
};

export default ImageDisplay;
