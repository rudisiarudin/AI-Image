import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import PinAccess from './components/PinAccess';
import ApiKeyInput from './components/ApiKeyInput';
// FIX: Changed import for PromptStudio to a named import to resolve module error.
import { PromptStudio } from './components/PromptStudio';
import ImageDisplay from './components/ImageDisplay';
import BottomNavBar from './components/BottomNavBar';
import * as geminiService from './services/geminiService';
import type { ImageFile } from './types';

const App: React.FC = () => {
    const [isApiKeyProvided, setIsApiKeyProvided] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessType, setAccessType] = useState<string | null>(null);
    const [remainingTime, setRemainingTime] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<ImageFile | null>(null);
    const [generatedText, setGeneratedText] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeView, setActiveView] = useState<'generator' | 'result'>('generator');

    useEffect(() => {
        const key = sessionStorage.getItem('gemini_api_key');
        if (key && key.trim() !== '') {
            setIsApiKeyProvided(true);
        }
    }, []);

    const ACCESS_PINS: { [key: string]: { type: string, duration?: number } } = {
        '1122': { type: 'permanent' },
        '24': { type: 'timed', duration: 3600 } // 1 hour
    };
    
    const handleKeyProvided = () => {
        setIsApiKeyProvided(true);
    };

    const handleUnlock = (pin: string): boolean => {
        const access = ACCESS_PINS[pin];
        if (access) {
            setIsAuthenticated(true);
            setAccessType(access.type);
            if (access.type === 'timed' && access.duration) {
                setRemainingTime(access.duration);
            }
            return true;
        }
        return false;
    };

    const handleLock = () => {
        setIsAuthenticated(false);
        setAccessType(null);
        setRemainingTime(null);
    };

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (accessType === 'timed' && remainingTime !== null && remainingTime > 0) {
            timer = setInterval(() => {
                setRemainingTime(prev => {
                    if (prev !== null && prev > 1) {
                        return prev - 1;
                    } else {
                        handleLock();
                        return 0;
                    }
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [accessType, remainingTime]);


    const handleGenerate = useCallback(async (options: any) => {
        if (isLoading) return;

        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);
        setGeneratedText(null);
        setActiveView('result');

        try {
            let result: ImageFile | string | null = null;
            
            if (options.activeTab === 'manual') {
                result = await geminiService.generateFromManual({
                    prompt: options.prompt,
                    images: options.images,
                    aspectRatio: options.aspectRatio,
                    useFaceLock: options.useFaceLock,
                });
            } else if (options.customStyle === 'identifikasiFashion') {
                result = await geminiService.identifyFashion(options.fashionImages);
            } else if (options.customStyle === 'analisaModelRambut') {
                result = await geminiService.analyzeHairstyle(options.image);
            } else if (options.customStyle === 'qrCodeArtistik') {
                result = await geminiService.generateArtisticQRCode({
                    url: options.qrCodeUrl,
                    artPrompt: options.qrCodeArtPrompt,
                    aspectRatio: options.aspectRatio,
                });
            } 
            else {
                if (options.customStyle === 'gantiBaju') {
                    result = await geminiService.changeOutfit({ modelImage: options.image, clothingImage: options.clothingImage });
                } else if (options.customStyle === 'removeWatermark') {
                    result = await geminiService.removeWatermark(options.image);
                } else if (options.customStyle === 'tingkatkanKualitas') {
                     const enhancePrompt = `**MISI: REMASTERING FOTO TINGKAT FORENSIK**
Anda adalah spesialis restorasi gambar digital kelas dunia. Tugas tunggal Anda adalah me-remaster foto ini ke tingkat kualitas, ketajaman, dan kejernihan yang belum pernah ada sebelumnya. Hasil akhirnya harus setara dengan foto yang diambil menggunakan kamera medium format Hasselblad X2D 100C dengan lensa prime.

**DAFTAR PERIKSA REMASTERING TEKNIS (TERAPKAN SECARA GLOBAL):**
1.  **Ketajaman Ekstrem:** Capai fokus setajam silet di seluruh gambar. Tingkatkan detail-detail mikro ke tingkat forensik: setiap helai rambut, serat kain, pori-pori kulit, dan pantulan di mata harus sejernih kristal.
2.  **Pembersihan Digital Total:** Lakukan pemurnian digital lengkap. Hilangkan 100% noise digital, artefak kompresi, dan grain tanpa kehilangan detail tekstur.
3.  **Kalibrasi Ulang Pencahayaan & Warna:** Kalibrasi ulang pencahayaan menjadi kualitas studio profesional. Tingkatkan rentang dinamis, ciptakan warna hitam yang pekat dan kaya, serta warna putih yang bersih. Pastikan transisi tonal sangat halus dan alami. Warna harus menjadi lebih hidup, tetapi skema warna asli harus dipertahankan.

**PERINTAH MUTLAK (TIDAK BISA DITAWAR): FIDELITAS KONTEN 100%**
-   Ini adalah tugas remastering teknis, BUKAN interpretasi kreatif.
-   Elemen-elemen berikut WAJIB TETAP 100% IDENTIK dengan gambar sumber: **Wajah, Pose, Bentuk Tubuh, Pakaian, Gaya Rambut, dan Latar Belakang.**
-   JANGAN mengubah orangnya. JANGAN mengubah pemandangannya. Satu-satunya tugas Anda adalah meningkatkan kualitas teknis ke standar tertinggi yang memungkinkan.`;
                     result = await geminiService.editImage({
                        image: options.image,
                        prompt: enhancePrompt,
                        useFaceLock: true,
                        useBackgroundLock: true,
                    });
                } else if (options.customStyle === 'photoWithIdol') {
                    result = await geminiService.createPhotoWithIdol({
                        userImage: options.image,
                        idolImage: options.idolImage,
                        useIdolFaceLock: options.useIdolFaceLock,
                        options: options.photoWithIdolOptions,
                    });
                } else if (options.customStyle === 'touchUpWajah') {
                    let touchUpPrompt = 'Please perform the following touch-ups to the person in the photo. Keep their facial identity 100% intact. ';
                    if (options.touchUpOptions.healSkin) touchUpPrompt += 'Heal skin blemishes for a smooth, natural look. ';
                    if (options.touchUpOptions.brightenFace) touchUpPrompt += 'Brighten the face for a healthier glow. ';
                    if (options.touchUpOptions.lipColor) touchUpPrompt += `Apply ${options.touchUpOptions.lipColor} lipstick. `;
                    if (options.touchUpOptions.blushIntensity !== 'none') touchUpPrompt += `Apply a ${options.touchUpOptions.blushIntensity} amount of blush. `;
                    if (options.touchUpOptions.hairstyle) touchUpPrompt += `Change the hairstyle to: ${options.touchUpOptions.hairstyle}. `;
                    if (options.touchUpOptions.hairColor) touchUpPrompt += `Change the hair color to: ${options.touchUpOptions.hairColor}. `;
                    if (options.touchUpOptions.improviseHairStyle) touchUpPrompt += `Improvise a new creative background and pose for a ${options.touchUpOptions.hairImproviseStyle} shot.`;
                    
                    result = await geminiService.editImage({ image: options.image, prompt: touchUpPrompt, useFaceLock: true, useBackgroundLock: !options.touchUpOptions.improviseHairStyle });
                } else if (options.customStyle === 'semuaBisaDisini') {
                    result = await geminiService.combineImages(options.semuaBisaDisiniOptions);
                } else if (options.customStyle === 'swimwearModel') {
                    result = await geminiService.generateSwimwearModel({ faceImage: options.image, clothingImage: options.clothingImage, options: options.swimwearModelOptions });
                } else if (options.customStyle === 'sceneMovie') {
                    result = await geminiService.insertIntoScene({ faceImage: options.image, sceneImage: options.sceneImage });
                } else if (options.customStyle === 'drawPose') {
                    result = await geminiService.generateImageFromPose({ poseInput: options.image, modelImage: options.poseModelImage, isPoseFromPhoto: options.isPoseFromPhoto });
                } else if (options.prompt === '__MECCA_FAMILY_PHOTO__') {
                    const faces = [options.image, ...(options.familyFaces || [])];
                    result = await geminiService.createMeccaFamilyPhoto({ faces });
                } else if (options.prompt === '__ME_AND_MY_CHILDHOOD__') {
                    result = await geminiService.createMeAndChildhoodPhoto({ adultImage: options.image, childImage: options.childhoodImage });
                } else if (options.prompt === '__FAMILY_PHOTO_LOW_ANGLE__') {
                    const faces = [options.image, ...(options.familyFaces || [])];
                    result = await geminiService.createFamilyPhoto({ faces, outfitColor: options.familyPhotoOutfitColor });
                } else if (options.prompt === '__SOCCER_PLAYER__') {
                    result = await geminiService.createSoccerPlayer({ faceImage: options.image, jerseyImage: options.soccerJerseyImage, options: options.soccerPlayerOptions });
                } else if (options.image) {
                     result = await geminiService.editImage({ image: options.image, prompt: options.prompt, useFaceLock: options.useFaceLock, useBackgroundLock: false });
                } else {
                     result = await geminiService.generateImageFromText({ prompt: options.prompt, aspectRatio: options.aspectRatio });
                }
            }

            if (typeof result === 'string') {
                setGeneratedText(result);
            } else if (result && typeof result === 'object' && 'data' in result) {
                setGeneratedImage(result as ImageFile);
            } else {
                setError('Gagal menghasilkan output. Coba lagi.');
            }

        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Terjadi kesalahan.';
             if (errorMessage.includes('API key not valid') || 
                errorMessage.includes('API key is invalid') ||
                errorMessage.includes('API_KEY_INVALID') ||
                errorMessage.includes('Requested entity was not found.') ||
                errorMessage.includes('permission to access')) {
                setError('Kunci API tidak valid atau tidak ditemukan. Silakan muat ulang halaman dan masukkan kunci yang benar.');
                sessionStorage.removeItem('gemini_api_key');
                setIsApiKeyProvided(false);
            } else if (errorMessage.includes('Kunci API tidak ditemukan')) {
                setError('Sesi kunci API Anda telah berakhir. Silakan muat ulang halaman dan masukkan kembali kunci Anda.');
                setIsApiKeyProvided(false);
            }
            else {
                setError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);
    
    if (!isApiKeyProvided) {
        return <ApiKeyInput onKeyProvided={handleKeyProvided} />;
    }

    if (!isAuthenticated) {
        return <PinAccess onUnlock={handleUnlock} />;
    }

    return (
        <div className="bg-background text-primary-text h-screen font-sans flex flex-col">
            <Header onLock={handleLock} remainingTime={remainingTime} />
            <main className="flex-grow container mx-auto p-4 md:p-6 pb-24 overflow-y-auto">
                 <div className={`${activeView === 'generator' ? 'block' : 'hidden'} h-full`}>
                    <PromptStudio 
                        onGenerate={handleGenerate} 
                        isLoading={isLoading}
                        accessType={accessType}
                    />
                </div>
                 <div className={`${activeView === 'result' ? 'block' : 'hidden'} h-full`}>
                    <ImageDisplay 
                        image={generatedImage} 
                        text={generatedText}
                        isLoading={isLoading} 
                        error={error} 
                    />
                </div>
            </main>
            <BottomNavBar activeView={activeView} setActiveView={setActiveView} />
        </div>
    );
};

export default App;