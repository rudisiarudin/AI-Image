import React from 'react';
import type { ImageFile } from '../types';

interface ImageUploaderProps {
    label: string;
    image: ImageFile | null;
    onImageSelect: (file: File) => void;
    onImageRemove: () => void;
    showRemoveButton?: boolean;
    disabled?: boolean;
}

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const RemoveIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const ImageUploader: React.FC<ImageUploaderProps> = ({ label, image, onImageSelect, onImageRemove, showRemoveButton = false, disabled = false }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImageSelect(file);
        }
    };

    return (
        <div className={disabled ? 'opacity-50' : ''}>
            {label && <h3 className="block text-sm font-medium text-secondary-text mb-2">{label}</h3>}
            <div className="flex items-center gap-4">
                {image ? (
                    <div className="relative w-24 h-24">
                        <img src={image.data} alt="Pratinjau Unggahan" className="w-full h-full object-cover rounded-lg border border-border-color" />
                        {showRemoveButton && (
                            <button onClick={onImageRemove} disabled={disabled} className="absolute -top-2 -right-2 bg-surface-2 text-secondary-text rounded-full p-1 leading-none hover:bg-error-red hover:text-primary-text transition-all disabled:cursor-not-allowed border border-border-color" aria-label={`Hapus ${label}`}>
                                <RemoveIcon className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                ) : (
                    <label className={`w-24 h-24 flex items-center justify-center border-2 border-dashed border-border-color rounded-lg transition ${disabled ? 'cursor-not-allowed bg-surface' : 'cursor-pointer hover:border-accent-blue hover:bg-surface-2'}`}>
                         <div className="text-center">
                            <UploadIcon className="mx-auto h-6 w-6 text-secondary-text" />
                            <span className="mt-1 text-xs text-secondary-text">Pilih Foto</span>
                        </div>
                        <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleFileChange} disabled={disabled} />
                    </label>
                )}
            </div>
        </div>
    );
};

export default ImageUploader;