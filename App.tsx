import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ApiKeyInput from './components/ApiKeyInput';
import { PromptStudio } from './components/PromptStudio';
import ImageDisplay from './components/ImageDisplay';
import BottomNavBar from './components/BottomNavBar';
import * as geminiService from './services/geminiService';
import type { ImageFile } from './types';

// Deklarasikan objek google global untuk menghindari error TypeScript
declare global {
  interface Window {
    google: any;
  }
}

// PENTING: Ganti placeholder ini dengan Google Client ID Anda yang sebenarnya.
// Anda bisa mendapatkannya dari Google Cloud Console.
const GOOGLE_CLIENT_ID = '757026754736-9ar63shod2u140c5046m1d32sgj16jbv.apps.googleusercontent.com';


const App: React.FC = () => {
    const [googleUser, setGoogleUser] = useState<any | null>(null);
    const [isGsiLoaded, setIsGsiLoaded] = useState(false);
    const [isApiKeyProvided, setIsApiKeyProvided] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<ImageFile | null>(null);
    const [generatedText, setGeneratedText] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeView, setActiveView] = useState<'generator' | 'result'>('generator');

    // Efek untuk menginisialisasi GSI dan memeriksa login/kunci yang ada
    useEffect(() => {
        // Cek pengguna yang tersimpan di sessionStorage saat load awal
        const storedUser = sessionStorage.getItem('google_user');
        if (storedUser) {
            setGoogleUser(JSON.parse(storedUser));
        }

        // Muat skrip GSI
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => setIsGsiLoaded(true);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // Cek kunci API setelah pengguna berhasil login
    useEffect(() => {
        if (googleUser) {
            const key = localStorage.getItem('gemini_api_key');
            if (key && key.trim() !== '') {
                setIsApiKeyProvided(true);
            }
        }
    }, [googleUser]);

    const handleCredentialResponse = (response: any) => {
        try {
            const credential = response.credential;
            const payloadBase64 = credential.split('.')[1];
            const decodedPayload = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));
            
            const userObject = {
                name: decodedPayload.name,
                email: decodedPayload.email,
                picture: decodedPayload.picture,
            };
            
            setGoogleUser(userObject);
            // Simpan profil pengguna di sessionStorage agar terhapus saat browser ditutup
            sessionStorage.setItem('google_user', JSON.stringify(userObject));
        } catch (e) {
            console.error("Error decoding JWT", e);
            setError("Gagal memproses login Google.");
        }
    };
    
    useEffect(() => {
        if (isGsiLoaded && !googleUser) {
            // Tambahkan pengecekan di sini
            if (GOOGLE_CLIENT_ID.startsWith('MASUKKAN_GOOGLE_CLIENT_ID')) {
                setError(
                    'Konfigurasi Belum Selesai: Anda harus mengganti placeholder GOOGLE_CLIENT_ID di file App.tsx dengan Client ID Anda yang valid dari Google Cloud Console.'
                );
                // Jangan render tombol jika ID tidak valid
                const googleButtonContainer = document.getElementById('google-signin-button');
                if (googleButtonContainer) {
                    googleButtonContainer.innerHTML = ''; // Hapus tombol yang mungkin sudah ada
                }
                return;
            }
            
            // Hapus error jika konfigurasi sudah benar
            setError(null);

            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
            });
            
            const googleButtonContainer = document.getElementById('google-signin-button');
            if (googleButtonContainer) {
                 window.google.accounts.id.renderButton(
                    googleButtonContainer,
                    { theme: 'outline', size: 'large', type: 'standard', text: 'signin_with', shape: 'pill' }
                );
            }
        }
    }, [isGsiLoaded, googleUser]);
    
    const handleKeyProvided = () => {
        setIsApiKeyProvided(true);
    };

    const handleLogout = () => {
        setGoogleUser(null);
        setIsApiKeyProvided(false);
        setGeneratedImage(null);
        setGeneratedText(null);
        setError(null);
        setActiveView('generator');
        
        sessionStorage.removeItem('google_user');
        localStorage.removeItem('gemini_api_key');

        if (window.google && window.google.accounts.id) {
            window.google.accounts.id.disableAutoSelect();
        }
    };
    
    const handleResetApiKey = () => {
        localStorage.removeItem('gemini_api_key');
        setIsApiKeyProvided(false);
        setError('QUOTA_ERROR:Kunci API telah dihapus. Silakan masukkan kunci yang baru.');
        setActiveView('generator');
    };

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
            const lowerCaseError = errorMessage.toLowerCase();

            if (lowerCaseError.includes('api key not valid') || 
                lowerCaseError.includes('api key is invalid') ||
                lowerCaseError.includes('api_key_invalid') ||
                lowerCaseError.includes('requested entity was not found') ||
                lowerCaseError.includes('permission to access')) {
                setError('QUOTA_ERROR:Kunci API tidak valid atau telah dicabut. Silakan masukkan kunci yang lain.');
            } else if (lowerCaseError.includes('kunci api tidak ditemukan')) {
                 setError('QUOTA_ERROR:Sesi kunci API Anda telah berakhir. Silakan masukkan kembali kunci Anda.');
            } else if (lowerCaseError.includes('batas penggunaan') || lowerCaseError.includes('quota')) {
                setError('QUOTA_ERROR:Batas penggunaan API untuk kunci ini telah tercapai. Kunci gratis memiliki batasan penggunaan. Silakan ganti dengan kunci API yang lain.');
            }
            else {
                setError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);
    
    if (!googleUser) {
        return (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="w-full max-w-sm bg-surface p-8 rounded-2xl shadow-lg border border-border-color shadow-black/30">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-primary-text">
                        IT Palugada - <span className="text-accent-blue">AI Studio</span>
                    </h1>
                    <p className="text-secondary-text mt-2 text-sm">Silakan login dengan akun Google untuk melanjutkan.</p>
                </div>
                <div className="mt-8 flex justify-center">
                  <div id="google-signin-button"></div>
                </div>
                {!isGsiLoaded && !error && <p className="text-center text-secondary-text text-xs mt-4">Memuat tombol login...</p>}
                {error && (
                    <div className="bg-error-red-bg border border-error-red/50 p-3 rounded-lg mt-4">
                        <p className="text-error-red text-xs text-center font-semibold">{error}</p>
                    </div>
                )}
              </div>
            </div>
        );
    }

    if (!isApiKeyProvided) {
        return <ApiKeyInput onKeyProvided={handleKeyProvided} googleUser={googleUser} />;
    }

    return (
        <div className="bg-background text-primary-text h-screen font-sans flex flex-col">
            <Header onLogout={handleLogout} googleUser={googleUser} />
            <main className="flex-grow container mx-auto p-4 md:p-6 pb-24 overflow-y-auto">
                 <div className={`${activeView === 'generator' ? 'block' : 'hidden'} h-full`}>
                    <PromptStudio 
                        onGenerate={handleGenerate} 
                        isLoading={isLoading}
                        accessType={null}
                    />
                </div>
                 <div className={`${activeView === 'result' ? 'block' : 'hidden'} h-full`}>
                    <ImageDisplay 
                        image={generatedImage} 
                        text={generatedText}
                        isLoading={isLoading} 
                        error={error} 
                        onResetApiKey={handleResetApiKey}
                    />
                </div>
            </main>
            <BottomNavBar activeView={activeView} setActiveView={setActiveView} />
        </div>
    );
};

export default App;