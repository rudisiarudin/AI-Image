
import React, { useState, useEffect, useCallback } from 'react';
import { STYLE_CATEGORIES, RECOMMENDED_STYLES, ASPECT_RATIOS, CUSTOM_STYLES, LIPSTICK_COLORS, IDOL_POSE_TEMPLATES, SHOT_STYLE_TEMPLATES, LIGHT_STYLE_TEMPLATES, SWIMWEAR_POSE_TEMPLATES, SOCCER_POSE_TEMPLATES, SBD_SHOT_STYLE_TEMPLATES, SBD_LIGHT_STYLE_TEMPLATES, MALE_HAIRSTYLE_TEMPLATES, FEMALE_HAIRSTYLE_TEMPLATES } from '../constants';
import { improvePrompt, improveIdolPrompt, improveMultiImagePrompt, improveVideoPrompt, translateText } from '../services/geminiService';
import ImageUploader from './ImageUploader';
import DrawingCanvas from './DrawingCanvas';
import type { StyleCategory, AspectRatio, ImageFile, CustomStyle, TouchUpOptions, PhotoWithIdolOptions, SemuaBisaDisiniOptions, SoccerPlayerOptions, FashionImages, SwimwearModelOptions } from '../types';

interface PromptStudioProps {
    onGenerate: (options: any) => void;
    isLoading: boolean;
    accessType: string | null;
}

const SparklesIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.5l-.648-1.938a3.375 3.375 0 00-2.456-2.456L11.25 18l1.938-.648a3.375 3.375 0 002.456-2.456L16.25 13.5l.648 1.938a3.375 3.375 0 002.456 2.456L21 18l-1.938.648a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
);

const SectionCard: React.FC<{title: string; children: React.ReactNode; className?: string}> = ({ title, children, className }) => (
    <div className={`bg-background p-4 rounded-xl border border-border-color ${className}`}>
        <h3 className="text-sm font-medium text-secondary-text mb-3">{title}</h3>
        {children}
    </div>
);


const ImprovedOptionsDisplay: React.FC<{
    detailed: string;
    concise: string;
    onSelect: (version: string) => void;
    onClose: () => void;
}> = ({ detailed, concise, onSelect, onClose }) => {
    return (
        <div className="mt-3 p-4 bg-background border border-border-color rounded-lg flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h4 className="text-md font-semibold text-accent-blue">Pilih Versi Prompt</h4>
                <button onClick={onClose} className="text-secondary-text hover:text-primary-text text-2xl leading-none">&times;</button>
            </div>
            {/* Detailed Version */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-primary-text">Versi Detail:</label>
                <p className="text-xs bg-background p-2 rounded-md text-secondary-text max-h-24 overflow-y-auto border border-border-color">{detailed}</p>
                <button onClick={() => onSelect(detailed)} className="text-xs bg-accent-blue/20 hover:bg-accent-blue/30 text-accent-blue font-semibold py-1 px-3 rounded-md transition self-start">
                    Gunakan Versi Ini
                </button>
            </div>
             {/* Concise Version */}
             <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-primary-text">Versi Ringkas:</label>
                <p className="text-xs bg-background p-2 rounded-md text-secondary-text max-h-24 overflow-y-auto border border-border-color">{concise}</p>
                <button onClick={() => onSelect(concise)} className="text-xs bg-accent-blue/20 hover:bg-accent-blue/30 text-accent-blue font-semibold py-1 px-3 rounded-md transition self-start">
                    Gunakan Versi Ini
                </button>
            </div>
        </div>
    );
};

const SpinnerIcon: React.FC = () => (
    <svg className="animate-spin h-5 w-5 text-background" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


export const PromptStudio: React.FC<PromptStudioProps> = ({ onGenerate, isLoading, accessType }) => {
    const [activeTab, setActiveTab] = useState<'manual' | 'rekomendasi' | 'kustom'>('manual');
    
    const [mainSubject, setMainSubject] = useState<string>('Seekor kucing astronot yang agung duduk di atas bulan, memandangi galaksi nebula');
    const [translatedMainSubject, setTranslatedMainSubject] = useState<string>('');
    const [isTranslatingSubject, setIsTranslatingSubject] = useState<boolean>(false);
    const [isImprovingSubject, setIsImprovingSubject] = useState<boolean>(false);
    const [selections, setSelections] = useState<Record<string, string>>({
        baseStyle: 'digital art',
        lighting: 'cinematic lighting',
        colorPalette: 'vibrant colors',
        composition: 'wide angle shot',
        details: 'highly detailed, 4k resolution',
    });
    const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
    const [uploadedImages, setUploadedImages] = useState<(ImageFile | null)[]>([]);
    const [isFaceLockEnabled, setIsFaceLockEnabled] = useState<boolean>(false);
    const [selectedStyle, setSelectedStyle] = useState<string>(RECOMMENDED_STYLES[0].value);
    const [aspectRatio, setAspectRatio] = useState<AspectRatio['value']>('1:1');
    const [isRatioLocked, setIsRatioLocked] = useState<boolean>(false);
    
    // State untuk "Prompt Ajaib Kamu"
    const [customPrompt, setCustomPrompt] = useState<string>('');
    const [translatedCustomPrompt, setTranslatedCustomPrompt] = useState<string>('');
    const [isTranslatingCustomPrompt, setIsTranslatingCustomPrompt] = useState<boolean>(false);
    const [isImprovingPrompt, setIsImprovingPrompt] = useState<boolean>(false);
    const [customPromptFaces, setCustomPromptFaces] = useState<(ImageFile | null)[]>([]);
    
    // State untuk "Action Figure Custom Outfit"
    const [actionFigureOutfit, setActionFigureOutfit] = useState<string>('');
    const [translatedActionFigureOutfit, setTranslatedActionFigureOutfit] = useState<string>('');
    const [isTranslatingOutfit, setIsTranslatingOutfit] = useState<boolean>(false);

    // State untuk "Giant Selfie"
    const [giantSelfieMonument, setGiantSelfieMonument] = useState<string>('Monas, Jakarta');
    const [translatedGiantSelfieMonument, setTranslatedGiantSelfieMonument] = useState<string>('');
    const [isTranslatingMonument, setIsTranslatingMonument] = useState<boolean>(false);

    // State untuk "Soccer Wallpaper"
    const [soccerWallpaperOptions, setSoccerWallpaperOptions] = useState({
        clubTeamYear: 'Real Madrid 2024',
        customBackNo: '7',
        jerseyName: 'YOURNAME',
        stadiumClub: 'Santiago Bernabéu'
    });

    // State untuk "6 Casual Generate Model"
    const [sixCasualModelSubject, setSixCasualModelSubject] = useState<'anak pria' | 'anak wanita' | 'pria dewasa' | 'wanita dewasa'>('pria dewasa');

    // State untuk "Photo Keluarga"
    const [familyFaces, setFamilyFaces] = useState<(ImageFile | null)[]>([]);
    const [familyPhotoOutfitColor, setFamilyPhotoOutfitColor] = useState('putih');

    // State for "Jadi Pemain Sepak Bola"
    const [soccerJerseyImage, setSoccerJerseyImage] = useState<ImageFile | null>(null);
    const [soccerPlayerOptions, setSoccerPlayerOptions] = useState<SoccerPlayerOptions>({
        clubName: 'Real Madrid 2024',
        jerseyName: 'YOURNAME',
        jerseyNumber: '10',
        pose: SOCCER_POSE_TEMPLATES[0].value,
    });
    
    // State for "Jadi Hotwheels"
    const [hotwheelsName, setHotwheelsName] = useState<string>('Custom Model');

    // State for "Aku sekarang dan masa kecil"
    const [childhoodImage, setChildhoodImage] = useState<ImageFile | null>(null);

    // State for "Photo Lamaran Kerja"
    const [jobAppPhotoBgColor, setJobAppPhotoBgColor] = useState<string>('#ff0000');

    // State untuk Style Kustom
    const [activeCustomStyle, setActiveCustomStyle] = useState<CustomStyle['id'] | null>(null);
    const [idolImage, setIdolImage] = useState<ImageFile | null>(null);
    const [sceneMovieImage, setSceneMovieImage] = useState<ImageFile | null>(null);
    const [clothingImage, setClothingImage] = useState<ImageFile | null>(null);
    const [isIdolFaceLockEnabled, setIsIdolFaceLockEnabled] = useState<boolean>(true);
    const [photoWithIdolOptions, setPhotoWithIdolOptions] = useState<PhotoWithIdolOptions>({
        manualPrompt: '',
        poseTemplate: IDOL_POSE_TEMPLATES[0].value,
        shotStyleTemplate: SHOT_STYLE_TEMPLATES[0].value,
        lightStyleTemplate: LIGHT_STYLE_TEMPLATES[0].value,
    });
    const [isImprovingIdolPrompt, setIsImprovingIdolPrompt] = useState<boolean>(false);
    const [idolTemplatePrompt, setIdolTemplatePrompt] = useState<string>('');
    const [touchUpOptions, setTouchUpOptions] = useState<TouchUpOptions>({
        lipColor: '',
        blushIntensity: 'none',
        brightenFace: false,
        healSkin: true,
        hairstyle: '',
        hairColor: '',
        improviseHairStyle: false,
        hairImproviseStyle: 'close-up',
    });
    const [hairGenderTab, setHairGenderTab] = useState<'wanita' | 'pria'>('wanita');


    // State for Identifikasi Fashion
    const [fashionFullDresscode, setFashionFullDresscode] = useState<ImageFile | null>(null);
    const [fashionTop, setFashionTop] = useState<ImageFile | null>(null);
    const [fashionPants, setFashionPants] = useState<ImageFile | null>(null);
    const [fashionShoes, setFashionShoes] = useState<ImageFile | null>(null);
    const [fashionAccessory, setFashionAccessory] = useState<ImageFile | null>(null);

    const [semuaBisaDisiniOptions, setSemuaBisaDisiniOptions] = useState<SemuaBisaDisiniOptions>({
        numberOfPhotos: 2,
        images: [null, null],
        prompt: '',
        faceLockIndices: [],
        shotStyle: SBD_SHOT_STYLE_TEMPLATES[0].value,
        lightStyle: SBD_LIGHT_STYLE_TEMPLATES[0].value,
        aspectRatio: '1:1',
    });
    const [isImprovingSBDPrompt, setIsImprovingSBDPrompt] = useState(false);
    const [veoManualPrompt, setVeoManualPrompt] = useState<string>('');
    const [isImprovingVeoPrompt, setIsImprovingVeoPrompt] = useState<boolean>(false);
    const [improvedVeoPrompt, setImprovedVeoPrompt] = useState<{ detailed: string, concise: string } | null>(null);
    const [selectedVeoVersion, setSelectedVeoVersion] = useState<'detailed' | 'concise'>('detailed');
    const [swimwearModelOptions, setSwimwearModelOptions] = useState<SwimwearModelOptions>({
        swimwearType: 'thong g-string',
        ethnicity: 'indonesia',
        bodyType: 'atletis',
        hairColor: 'coklat',
        setting: 'pantai tropis cerah',
        bustSize: 'sedang',
        hipSize: 'sedang',
        pose: SWIMWEAR_POSE_TEMPLATES[0].value,
    });
    const [swimwearClothingImage, setSwimwearClothingImage] = useState<ImageFile | null>(null);


    // State for Draw Pose
    const [poseModelImage, setPoseModelImage] = useState<ImageFile | null>(null);
    const [poseReferenceImage, setPoseReferenceImage] = useState<ImageFile | null>(null);
    const [isPoseFromSketch, setIsPoseFromSketch] = useState<boolean>(false);
    const [poseInputMode, setPoseInputMode] = useState<'upload' | 'draw'>('upload');
    const [drawnPose, setDrawnPose] = useState<ImageFile | null>(null);

    // State for QR Code
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('https://it-palugada.com');
    const [qrCodeArtPrompt, setQrCodeArtPrompt] = useState<string>('A beautiful, intricate mandala pattern made of glowing neon lines on a dark background');
    
    // State for improved prompt choices
    const [improvedOptions, setImprovedOptions] = useState<{
        key: string; // To identify which input the options are for
        detailed: string;
        concise: string;
        onSelect: (version: string) => void;
        onClose: () => void;
    } | null>(null);

    const selectedStyleObject = RECOMMENDED_STYLES.find(s => s.value === selectedStyle);
    const selectedStyleNote = selectedStyleObject?.note;
    
    // The main image for Rekomendasi and some Kustom styles is the first image in uploadedImages
    const uploadedImage = uploadedImages[0] || null;

    const handleTextChangeWithTranslation = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        setValue: React.Dispatch<React.SetStateAction<string>>,
        setTranslatedValue: React.Dispatch<React.SetStateAction<string>>,
        setIsTranslating: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        const value = event.target.value;
        setValue(value);
        setTranslatedValue(''); // Clear old translation on new input

        const endsWithEnglish = value.endsWith('..');
        const endsWithIndonesian = value.endsWith('.,');

        if (endsWithEnglish || endsWithIndonesian) {
            const textToTranslate: string = value.slice(0, -2);
            setValue(textToTranslate); // Remove trigger from UI immediately
            
            if (textToTranslate.trim() === '') {
                return;
            }

            const translate = async () => {
                setIsTranslating(true);
                setTranslatedValue('Menerjemahkan...'); // Provide instant feedback
                try {
                    const targetLanguage = endsWithEnglish ? 'English' : 'Indonesian';
                    const translation = await translateText(textToTranslate, targetLanguage);
                    setTranslatedValue(translation);
                } catch (error) {
                    console.error(`Translation failed:`, error);
                    setTranslatedValue(''); // Clear on error
                    alert('Gagal menerjemahkan.');
                } finally {
                    setIsTranslating(false);
                }
            };
            translate();
        }
    };

    useEffect(() => {
        let finalPrompt: string = '';
        
        switch(activeTab) {
            case 'manual':
                const styleParts = Object.values(selections)
                    .filter(value => value && value.trim() !== '')
                    .join(', ');
                let subjectToUse = mainSubject;
                if (isTranslatingSubject) {
                    subjectToUse = 'Menerjemahkan...';
                } else if (translatedMainSubject.trim()) {
                    subjectToUse = translatedMainSubject;
                }
                finalPrompt = subjectToUse.trim() ? `${subjectToUse.trim()}, ${styleParts}` : styleParts;
                break;
            
            case 'rekomendasi':
                 if (!uploadedImage) {
                    finalPrompt = "Unggah gambar untuk menggunakan gaya yang direkomendasikan.";
                    break;
                }
                let basePrompt = '';
                 if (selectedStyle === '__ME_AND_MY_CHILDHOOD__') {
                    basePrompt = `Foto sureal seorang dewasa (dari foto pertama) bertemu dengan diri mereka di masa kecil (dari foto kedua) di sebuah gang kumuh.`;
                 } else if (selectedStyle === '__MECCA_FAMILY_PHOTO__') {
                    const faceCount = 1 + familyFaces.filter(f => f).length;
                    basePrompt = `Foto keluarga dengan ${faceCount} orang di Mekah (berdasarkan foto yang diunggah). Ayah memakai ihram, Ibu memakai pakaian ihram wanita, dan anak-anak memakai pakaian sopan. Mereka berpose bahagia di depan Ka'bah dengan suasana pagi yang hangat. Hyper-realistic, 8k, sharp focus, cinematic lighting.`;
                 } else if (selectedStyle === '__JOB_APPLICATION_PHOTO__') {
                    basePrompt = `**TASK: Transform the uploaded photo into a professional Indonesian job application photo (pas foto).**

**SUBJECT & ATTIRE (CRITICAL):**
- **For Women with Hijab:** If the original photo shows a woman wearing a hijab, transform it into a neat, simple, motif-less black hijab. She must be wearing a white collared blouse underneath.
- **For Women without Hijab:** If the original photo shows a woman not wearing a hijab, keep her original hairstyle but make it look neat and professional. She must be wearing a white formal blouse.
- **For Men:** Keep his original hairstyle but make it look neat and professional. He must be wearing a white formal shirt.

**COMPOSITION & STYLE:**
- **Framing:** The final photo MUST be a close-up shot from the chest up.
- **Expression:** The subject should have a neutral expression or a very subtle, professional smile.
- **Background:** The background MUST be a solid, plain color: ${jobAppPhotoBgColor}.
- **Lighting & Quality:** Use even, soft studio lighting. The skin tone must be natural. The image should be high-resolution, sharp, and look like a professional photograph. No artistic filters.
- **Aspect Ratio:** The final image aspect ratio MUST be 3:4.

**FACE LOCK (ABSOLUTE RULE):**
The person's face must be 100% identical to the uploaded photo. Do not change their facial features.`;
                 } else if (selectedStyle === '__FAMILY_PHOTO_LOW_ANGLE__') {
                    const faceCount = 1 + familyFaces.filter(f => f).length;
                    basePrompt = `Foto keluarga dengan ${faceCount} orang (berdasarkan foto yang diunggah). Mereka semua memakai baju ${familyPhotoOutfitColor} yang serasi dan berpose dengan tanda damai. Foto diambil dari sudut rendah, melihat ke atas, dengan semua kepala mereka berkumpul membentuk lingkaran, melihat ke bawah ke arah kamera. Latar belakangnya adalah langit biru cerah yang indah penuh dengan awan putih halus. Hyper-realistic, 8k, sharp focus, cinematic lighting.`;
                } else if (selectedStyle === '__SOCCER_PLAYER__') {
                    basePrompt = `Seorang pemain sepak bola profesional baru untuk klub ${soccerPlayerOptions.clubName} diperkenalkan ke media. Dia adalah orang dari foto wajah yang diunggah, mengenakan jersey lengkap yang cocok dengan foto jersey yang diunggah, lengkap dengan nama "${soccerPlayerOptions.jerseyName}" dan nomor "${soccerPlayerOptions.jerseyNumber}" di punggung. Posenya adalah ${soccerPlayerOptions.pose}. Dia berada di tengah lapangan sepak bola yang sangat detail dengan rumput hijau subur. Pencahayaan adalah sinar matahari sore hari, menciptakan bayangan panjang, di bawah langit biru jernih dengan beberapa awan putih. Fotonya hiper-realis, kualitas 8k, cinematic.`;
                } else if (selectedStyle === '__HOTWHEELS__') {
                    basePrompt = `Ubah foto ini menjadi mainan 'Hotwheels' die-cast skala 1:64. Buat sangat realistis dan detail di setiap sudutnya, seolah-olah ini adalah mainan baru yang mengkilat, mewah, dan terbuat dari bahan premium. Pajang mainan ini di dalam kemasan Hotwheels blister pack yang mewah dengan cover plastik transparan, tertutup rapi. Gantung kemasan ini pada satu gantungan (single hook) di lorong mainan supermarket. Pastikan hanya ada varian mainan ini saja yang terpajang. Berikan pencahayaan alami yang lembut seolah dari lampu supermarket. Di bagian bawah kemasan, berikan nama model mobil: '${hotwheelsName}'. Kualitas gambar harus sangat tajam (8k, sharp focus), dan aspek rasio harus kotak 1:1.`;
                } else if (selectedStyle === '__GIANT_SELFIE__') {
                    let monumentText = giantSelfieMonument;
                    if (isTranslatingMonument) monumentText = 'Menerjemahkan...';
                    else if (translatedGiantSelfieMonument) monumentText = translatedGiantSelfieMonument;
                    basePrompt = `Transform the photo man/woman into a giant with a crouching position like a giant on the side ${monumentText}, while maintaining the resemblance of his face to the uploaded reference photo. His hands holding his head looked confused looking at the camera with a dramatic effect using a Nikon D3000 camera. The photo style is very realistic, with cinematic lighting, cloudy blue skies, and small people walking around, as if photographed with a 16mm ultra wide angle lens.`;
                } else if (selectedStyle === '__SOCCER_WALLPAPER__') {
                    basePrompt = `A cinematic, ultra-realistic sports poster featuring a young professional soccer player wearing a home jersey (${soccerWallpaperOptions.clubTeamYear}) with the number (${soccerWallpaperOptions.customBackNo}) and the name (${soccerWallpaperOptions.jerseyName}). The composition features three perspectives: a dramatic close-up with an intense expression, a rear view showing the name and number on the jersey, and a full-body action shot of the player powerfully and dynamically kicking the ball on a gleaming grass field.
    Background: a modern soccer stadium (${soccerWallpaperOptions.stadiumClub}) with dim lighting, a dim atmosphere, and spotlight effects illuminating the player. The number (${soccerWallpaperOptions.customBackNo}) glows brightly in a neon glow behind him. The typography of the name (${soccerWallpaperOptions.jerseyName}) appears in bold, illuminated letters in the center.
    Cinematic atmosphere, high contrast, sharp details, strong depth`;
                } else if (selectedStyle === '__SIX_CASUAL_MODELS__') {
                    const subjectMap = {
                      'anak pria': { singular: 'boy', plural: 'boys' },
                      'anak wanita': { singular: 'girl', plural: 'girls' },
                      'pria dewasa': { singular: 'man', plural: 'men' },
                      'wanita dewasa': { singular: 'woman', plural: 'women' },
                    };
                    const subject = subjectMap[sixCasualModelSubject];
                    basePrompt = `Create a highly realistic 8K casual fashion catalog using a professional DSLR camera. Featuring the same ${subject.singular} (from the attached photo) in six different full-body versions. Each version displays a unique pose, expression, and casual style. All six versions of the model are arranged in two neat rows (three models in the top row, and three models in the bottom row), standing against a white studio background. Professional studio lighting. The result is a unified photo catalog. 9:16 aspect ratio. Provides sharp, blur-free details and vibrant colors.`;
                } else if (selectedStyle === '__ACTION_FIGURE_CUSTOM__') {
                    const base = `A hyper-realistic 3D render, 3:4 ratio. A collectible action figure, 100% face similarity to the uploaded photo`;
                    let outfitText = actionFigureOutfit;
                    if(isTranslatingOutfit) outfitText = 'Menerjemahkan...';
                    else if(translatedActionFigureOutfit) outfitText = translatedActionFigureOutfit;

                    if (outfitText) {
                        basePrompt = `${base}, wearing ${outfitText}.`;
                    } else {
                        basePrompt = `${base}.`;
                    }
                } else if (selectedStyle === '__CUSTOM_PROMPT__') {
                    if (isTranslatingCustomPrompt) {
                        basePrompt = 'Menerjemahkan prompt Anda...';
                    } else {
                        basePrompt = translatedCustomPrompt || customPrompt;
                    }
                } else {
                    basePrompt = selectedStyle;
                }

                const isSpecialKeyword = selectedStyle.startsWith('__') && selectedStyle.endsWith('__');
                if (isRatioLocked && !isSpecialKeyword) {
                    const ratioInstruction = `\n\n**ATURAN ASPEK RASIO (WAJIB & MUTLAK):** Ubah gambar agar memiliki aspek rasio ${aspectRatio}. Perluas atau potong gambar secara cerdas untuk mengisi dimensi baru tanpa mendistorsi atau mengubah subjek utama.`;
                    basePrompt += ratioInstruction;
                }
                
                finalPrompt = basePrompt;
                break;

            case 'kustom':
                 if (!activeCustomStyle) {
                    finalPrompt = "Pilih salah satu style kustom di atas.";
                    break;
                }
                const customStylesWithAutoPrompt: CustomStyle['id'][] = ['touchUpWajah', 'identifikasiFashion', 'removeWatermark', 'tingkatkanKualitas', 'swimwearModel', 'sceneMovie', 'drawPose', 'analisaModelRambut', 'gantiBaju'];
                if (activeCustomStyle && customStylesWithAutoPrompt.includes(activeCustomStyle)) {
                    finalPrompt = "Prompt dibuat secara otomatis berdasarkan gambar dan gaya yang dipilih.";
                } else if (activeCustomStyle === 'promptVideoVeo') {
                    if (improvedVeoPrompt) {
                         finalPrompt = improvedVeoPrompt[selectedVeoVersion];
                    } else {
                         finalPrompt = 'Tulis ide Anda di atas dan klik "Tingkatkan" untuk membuat prompt video.';
                    }
                } else if(activeCustomStyle === 'semuaBisaDisini') {
                    finalPrompt = semuaBisaDisiniOptions.prompt || "Tulis deskripsi untuk menggabungkan foto di atas.";
                 } else if (activeCustomStyle === 'photoWithIdol') {
                     if (photoWithIdolOptions.manualPrompt.trim()) {
                        finalPrompt = photoWithIdolOptions.manualPrompt;
                    } else if (idolTemplatePrompt.trim()) {
                        finalPrompt = idolTemplatePrompt;
                    }
                     else {
                        finalPrompt = "Pilih template dan klik 'Buat Prompt dari Template' di atas, atau tulis prompt manual.";
                    }
                } else {
                    finalPrompt = "Gaya kustom tidak valid.";
                }
                break;
            default:
                finalPrompt = "";
        }
        
        setGeneratedPrompt(finalPrompt);
    }, [mainSubject, translatedMainSubject, isTranslatingSubject, selections, uploadedImage, selectedStyle, customPrompt, activeTab, activeCustomStyle, translatedActionFigureOutfit, isTranslatingOutfit, isTranslatingCustomPrompt, translatedCustomPrompt, photoWithIdolOptions.manualPrompt, idolTemplatePrompt, semuaBisaDisiniOptions.prompt, improvedVeoPrompt, selectedVeoVersion, giantSelfieMonument, translatedGiantSelfieMonument, isTranslatingMonument, sixCasualModelSubject, familyFaces, familyPhotoOutfitColor, soccerWallpaperOptions, soccerPlayerOptions, hotwheelsName, isRatioLocked, aspectRatio, jobAppPhotoBgColor]);

    // Effect to auto-manage face lock
    useEffect(() => {
        if (activeTab === 'kustom' && activeCustomStyle) {
            if (['photoWithIdol', 'touchUpWajah', 'tingkatkanKualitas', 'sceneMovie', 'gantiBaju', 'swimwearModel'].includes(activeCustomStyle)) {
                setIsFaceLockEnabled(true);
            } else if (['identifikasiFashion', 'removeWatermark', 'semuaBisaDisini', 'drawPose', 'analisaModelRambut', 'qrCodeArtistik'].includes(activeCustomStyle)) {
                setIsFaceLockEnabled(false);
            }
        }
    }, [activeTab, activeCustomStyle]);

    const handleSelectionChange = (categoryId: string, value: string) => {
        setSelections(prev => ({ ...prev, [categoryId]: value, }));
    };

    const handleImageUpload = (file: File, index: number) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            const newImage: ImageFile = { data: result, mimeType: file.type };
            setUploadedImages(prev => {
                const newImages = [...prev];
                newImages[index] = newImage;
                return newImages;
            });
            if (index === 0) {
                 setIsFaceLockEnabled(true);
            }
        };
        reader.readAsDataURL(file);
    };

    const removeImage = (index: number) => {
        setUploadedImages(prev => {
            const newImages = [...prev];
            newImages[index] = null;
            // Filter out trailing nulls to shrink the array if the last item is removed
            return newImages.filter(img => img !== null);
        });
        if (index === 0) {
             // Reset dependent states when main image is removed
            setChildhoodImage(null);
            setIsFaceLockEnabled(false);
            setActiveCustomStyle(null);
            setIdolImage(null);
            setSceneMovieImage(null);
            setClothingImage(null);
            setSwimwearClothingImage(null);
            setActionFigureOutfit('');
            setTranslatedActionFigureOutfit('');
            setSoccerJerseyImage(null);
        }
    };
    
    const addImageSlot = () => {
        setUploadedImages(prev => [...prev, null]);
    };

    const handleChildhoodImageChange = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setChildhoodImage({ data: reader.result as string, mimeType: file.type });
        };
        reader.readAsDataURL(file);
    };

    const handleIdolImageChange = (file: File | null) => {
         if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setIdolImage({ data: reader.result as string, mimeType: file.type });
            };
            reader.readAsDataURL(file);
        } else {
            setIdolImage(null);
        }
    };
    
    const handleClothingImageChange = (file: File) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setClothingImage({ data: reader.result as string, mimeType: file.type });
        };
        reader.readAsDataURL(file);
    };
    
    const handleSwimwearClothingImageChange = (file: File) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setSwimwearClothingImage({ data: reader.result as string, mimeType: file.type });
        };
        reader.readAsDataURL(file);
    };

    const handleSceneMovieImageChange = (file: File | null) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSceneMovieImage({ data: reader.result as string, mimeType: file.type });
            };
            reader.readAsDataURL(file);
        } else {
            setSceneMovieImage(null);
        }
    };
    
    const handleFashionImageChange = (setter: React.Dispatch<React.SetStateAction<ImageFile | null>>) => (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setter({ data: reader.result as string, mimeType: file.type });
        };
        reader.readAsDataURL(file);
    };

    const handleSBDPhotoCountChange = (count: number) => {
        setSemuaBisaDisiniOptions(prev => ({
            ...prev,
            numberOfPhotos: count,
            images: Array(count).fill(null).map((_, i) => prev.images[i] || null),
            faceLockIndices: [], // Reset face lock on count change
        }));
    };

    const handleSBDImageChange = (index: number, file: File | null) => {
        const processFile = (f: File, callback: (result: ImageFile) => void) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                callback({ data: reader.result as string, mimeType: f.type });
            };
            reader.readAsDataURL(f);
        };
        
        const newImages = [...semuaBisaDisiniOptions.images];
        if (file) {
            processFile(file, (imageFile) => {
                newImages[index] = imageFile;
                const newFaceLockIndices = [...semuaBisaDisiniOptions.faceLockIndices];
                if (!newFaceLockIndices.includes(index)) {
                    newFaceLockIndices.push(index);
                }
                setSemuaBisaDisiniOptions(prev => ({ ...prev, images: newImages, faceLockIndices: newFaceLockIndices }));
            });
        } else {
            newImages[index] = null;
            const newFaceLockIndices = semuaBisaDisiniOptions.faceLockIndices.filter(i => i !== index);
            setSemuaBisaDisiniOptions(prev => ({ ...prev, images: newImages, faceLockIndices: newFaceLockIndices }));
        }
    };
    
    const handleSBDToggleFaceLock = (index: number) => {
        setSemuaBisaDisiniOptions(prev => {
            const newFaceLockIndices = [...prev.faceLockIndices];
            if (newFaceLockIndices.includes(index)) {
                return { ...prev, faceLockIndices: newFaceLockIndices.filter(i => i !== index) };
            } else {
                newFaceLockIndices.push(index);
                return { ...prev, faceLockIndices: newFaceLockIndices };
            }
        });
    };

    const handleImproveSBDPrompt = async () => {
        if (!semuaBisaDisiniOptions.prompt.trim() || isImprovingSBDPrompt) return;
        setIsImprovingSBDPrompt(true);
        try {
            const improved = await improveMultiImagePrompt(semuaBisaDisiniOptions.prompt);
            setImprovedOptions({
                ...improved,
                key: 'sbd',
                onSelect: (version) => {
                    setSemuaBisaDisiniOptions(p => ({ ...p, prompt: version }));
                    setImprovedOptions(null);
                },
                onClose: () => setImprovedOptions(null)
            });
        } catch (error) {
            console.error("Gagal meningkatkan prompt 'Semua Bisa Disini':", error);
        } finally {
            setIsImprovingSBDPrompt(false);
        }
    };


    const handleImproveSubject = async () => {
        if (!mainSubject.trim() || isImprovingSubject) return;
        setIsImprovingSubject(true);
        try {
            const improved = await improvePrompt(mainSubject);
            setImprovedOptions({
                ...improved,
                key: 'mainSubject',
                onSelect: (version) => {
                    setMainSubject(version);
                    setImprovedOptions(null);
                },
                onClose: () => setImprovedOptions(null)
            });
        } catch (error) {
            console.error("Gagal meningkatkan subjek:", error);
        } finally {
            setIsImprovingSubject(false);
        }
    };

    const handleImprovePrompt = async () => {
        if (!customPrompt.trim() || isImprovingPrompt) return;
        setIsImprovingPrompt(true);
        try {
            const improved = await improvePrompt(customPrompt);
            setImprovedOptions({
                ...improved,
                key: 'customPrompt',
                onSelect: (version) => {
                    setCustomPrompt(version);
                    setImprovedOptions(null);
                },
                onClose: () => setImprovedOptions(null)
            });
        } catch (error) {
            console.error("Gagal meningkatkan prompt:", error);
        } finally {
            setIsImprovingPrompt(false);
        }
    };

    const handleImproveIdolManualPrompt = async () => {
        if (!photoWithIdolOptions.manualPrompt.trim() || isImprovingIdolPrompt) return;
        setIsImprovingIdolPrompt(true);
        try {
            const improved = await improveIdolPrompt(photoWithIdolOptions.manualPrompt);
             setImprovedOptions({
                ...improved,
                key: 'idol',
                onSelect: (version) => {
                    setPhotoWithIdolOptions(p => ({ ...p, manualPrompt: version }));
                    setImprovedOptions(null);
                },
                onClose: () => setImprovedOptions(null)
            });
        } catch (error) {
            console.error("Gagal meningkatkan prompt idola:", error);
        } finally {
            setIsImprovingIdolPrompt(false);
        }
    };

    const handleGenerateIdolTemplatePrompt = () => {
        const { poseTemplate, shotStyleTemplate, lightStyleTemplate } = photoWithIdolOptions;
        if (!poseTemplate || !shotStyleTemplate || !lightStyleTemplate) {
            alert("Silakan pilih opsi untuk Pose, Gaya Pengambilan Gambar, dan Pencahayaan.");
            return;
        }
        
        const prompt = `A hyper-realistic and sharply detailed 8k photo.
- Pose: ${poseTemplate}.
- Camera Shot: a ${shotStyleTemplate}.
- Lighting: ${lightStyleTemplate}.`;
        
        setIdolTemplatePrompt(prompt);
    };
    
    const handleImproveVeoPrompt = async () => {
        if (!veoManualPrompt.trim() || isImprovingVeoPrompt) return;
        setIsImprovingVeoPrompt(true);
        setImprovedVeoPrompt(null);
        try {
            const improved = await improveVideoPrompt(veoManualPrompt);
            setImprovedVeoPrompt(improved);
            setSelectedVeoVersion('detailed');
        } catch (error) {
            console.error("Gagal meningkatkan prompt Veo:", error);
        } finally {
            setIsImprovingVeoPrompt(false);
        }
    };

    const handleFamilyFaceChange = (index: number, file: File | null) => {
        const processFile = (f: File, callback: (result: ImageFile) => void) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                callback({ data: reader.result as string, mimeType: f.type });
            };
            reader.readAsDataURL(f);
        };

        const newFaces = [...familyFaces];
        while (newFaces.length <= index) {
            newFaces.push(null);
        }

        if (file) {
            processFile(file, (imageFile) => {
                newFaces[index] = imageFile;
                setFamilyFaces(newFaces);
            });
        } else {
            newFaces[index] = null;
            setFamilyFaces(newFaces);
        }
    };
    
    const handleCustomPromptFaceChange = (index: number, file: File | null) => {
        const processFile = (f: File, callback: (result: ImageFile) => void) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                callback({ data: reader.result as string, mimeType: f.type });
            };
            reader.readAsDataURL(f);
        };

        const newFaces = [...customPromptFaces];
        if (file) {
            processFile(file, (imageFile) => {
                newFaces[index] = imageFile;
                setCustomPromptFaces(newFaces);
            });
        } else {
            newFaces[index] = null;
            setCustomPromptFaces(newFaces);
        }
    };

    const handlePoseModelImageChange = (file: File | null) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPoseModelImage({ data: reader.result as string, mimeType: file.type });
            };
            reader.readAsDataURL(file);
        } else {
            setPoseModelImage(null);
        }
    }
    
    const handlePoseReferenceImageChange = (file: File | null) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPoseReferenceImage({ data: reader.result as string, mimeType: file.type });
            };
            reader.readAsDataURL(file);
        } else {
            setPoseReferenceImage(null);
        }
    }

    const handleGenerateClick = () => {
        const isMeAndChildhood = activeTab === 'rekomendasi' && uploadedImage && childhoodImage && selectedStyle === '__ME_AND_MY_CHILDHOOD__';
        const isFamilyPhoto = activeTab === 'rekomendasi' && uploadedImage && selectedStyle === '__FAMILY_PHOTO_LOW_ANGLE__';
        const isMeccaFamilyPhoto = activeTab === 'rekomendasi' && uploadedImage && selectedStyle === '__MECCA_FAMILY_PHOTO__';
        const isSoccerPlayer = activeTab === 'rekomendasi' && uploadedImage && soccerJerseyImage && selectedStyle === '__SOCCER_PLAYER__';
        const isCustomPromptSelected = activeTab === 'rekomendasi' && selectedStyle === '__CUSTOM_PROMPT__';
        
        if (activeTab === 'manual') {
             if (!mainSubject.trim()) {
                 alert('Prompt tidak boleh kosong.');
                 return;
            }
            onGenerate({
                activeTab: 'manual',
                prompt: generatedPrompt,
                images: uploadedImages.filter(img => img !== null) as ImageFile[],
                useFaceLock: isFaceLockEnabled,
                aspectRatio,
            });
            return;
        }

        if (activeTab === 'kustom') {
            switch(activeCustomStyle) {
                case 'gantiBaju':
                    if (!uploadedImage || !clothingImage) {
                        alert('Silakan unggah foto model dan foto pakaian.');
                        return;
                    }
                    onGenerate({
                        prompt: 'ganti-baju-prompt',
                        image: uploadedImage,
                        clothingImage: clothingImage,
                        useFaceLock: true,
                        aspectRatio,
                        customStyle: 'gantiBaju',
                    });
                    return;
                case 'qrCodeArtistik':
                    if (!qrCodeUrl.trim() || !qrCodeArtPrompt.trim()) {
                        alert('Silakan isi URL/Teks dan Deskripsi Seni untuk QR Code.');
                        return;
                    }
                    onGenerate({
                        prompt: 'qr-code-artistik-prompt',
                        customStyle: 'qrCodeArtistik',
                        qrCodeUrl,
                        qrCodeArtPrompt,
                        aspectRatio,
                    });
                    return;
                case 'analisaModelRambut':
                    if (!uploadedImage) {
                        alert('Silakan unggah foto yang ingin dianalisis model rambutnya.');
                        return;
                    }
                    onGenerate({
                        prompt: 'analisa-model-rambut-prompt',
                        image: uploadedImage,
                        useFaceLock: false,
                        aspectRatio,
                        customStyle: 'analisaModelRambut',
                    });
                    return;
                case 'drawPose':
                    if (!poseModelImage) {
                        alert('Silakan unggah foto model (Wajah & Baju).');
                        return;
                    }
                    const poseImage = poseInputMode === 'draw' ? drawnPose : poseReferenceImage;
                    if (!poseImage) {
                        alert('Silakan gambar pose atau unggah foto referensi.');
                        return;
                    }
                    onGenerate({
                        prompt: 'draw-pose-prompt',
                        image: poseImage,
                        poseModelImage: poseModelImage,
                        useFaceLock: true,
                        aspectRatio,
                        customStyle: 'drawPose',
                        isPoseFromPhoto: poseInputMode === 'upload' && !isPoseFromSketch,
                    });
                    return;
                case 'sceneMovie':
                     if (!uploadedImage || !sceneMovieImage) {
                        alert('Silakan unggah foto wajah Anda dan foto scene movie.');
                        return;
                    }
                    onGenerate({
                        prompt: 'scene-movie-prompt',
                        image: uploadedImage,
                        sceneImage: sceneMovieImage,
                        useFaceLock: true,
                        aspectRatio,
                        customStyle: 'sceneMovie',
                    });
                    return;
                case 'swimwearModel':
                    if (!uploadedImage || !swimwearClothingImage) {
                        alert('Silakan unggah foto wajah model dan foto pakaian renang.');
                        return;
                    }
                    onGenerate({
                        prompt: 'swimwear-model-prompt',
                        image: uploadedImage, // This is the face
                        clothingImage: swimwearClothingImage, // This is the clothing
                        useFaceLock: true, // Face lock is essential here
                        aspectRatio,
                        customStyle: 'swimwearModel',
                        swimwearModelOptions: swimwearModelOptions,
                    });
                    return;
                case 'semuaBisaDisini':
                    onGenerate({
                        prompt: 'semua-bisa-disini-prompt',
                        image: null, 
                        useFaceLock: false,
                        aspectRatio: semuaBisaDisiniOptions.aspectRatio,
                        customStyle: 'semuaBisaDisini',
                        semuaBisaDisiniOptions: semuaBisaDisiniOptions,
                    });
                    return;
                 case 'removeWatermark':
                    if (!uploadedImage) {
                        alert('Silakan unggah foto yang ingin dibersihkan dari watermark.');
                        return;
                    }
                    onGenerate({
                        prompt: 'remove-watermark-prompt',
                        image: uploadedImage,
                        useFaceLock: false,
                        aspectRatio,
                        customStyle: 'removeWatermark',
                    });
                    return;
                 case 'tingkatkanKualitas':
                    if (!uploadedImage) {
                        alert('Silakan unggah foto yang ingin ditingkatkan kualitasnya.');
                        return;
                    }
                    onGenerate({
                        prompt: 'tingkatkan-kualitas-prompt',
                        image: uploadedImage,
                        useFaceLock: true,
                        aspectRatio,
                        customStyle: 'tingkatkanKualitas',
                    });
                    return;
                 case 'identifikasiFashion':
                    const fashionImages: FashionImages = {
                        fullDresscode: fashionFullDresscode,
                        top: fashionTop,
                        pants: fashionPants,
                        shoes: fashionShoes,
                        accessory: fashionAccessory,
                    };
                    if (!Object.values(fashionImages).some(img => img !== null)) {
                        alert('Silakan unggah setidaknya satu foto fashion untuk dianalisis.');
                        return;
                    }
                    onGenerate({
                        prompt: 'identifikasi-fashion-prompt',
                        image: null,
                        useFaceLock: false,
                        aspectRatio,
                        customStyle: 'identifikasiFashion',
                        fashionImages: fashionImages,
                    });
                    return;
                 case 'photoWithIdol':
                    if (!idolImage || !uploadedImage) {
                        alert('Silakan unggah foto Anda dan foto idola Anda.');
                        return;
                    }
                    const hasManualPrompt = photoWithIdolOptions.manualPrompt.trim() !== '';
                    if (!hasManualPrompt && !photoWithIdolOptions.poseTemplate) {
                        alert('Silakan tulis prompt manual atau pilih setidaknya satu template pose.');
                        return;
                    }
                    onGenerate({
                        prompt: 'photo-with-idol-prompt',
                        image: uploadedImage,
                        idolImage: idolImage,
                        useFaceLock: true,
                        useIdolFaceLock: isIdolFaceLockEnabled,
                        aspectRatio,
                        customStyle: 'photoWithIdol',
                        photoWithIdolOptions: photoWithIdolOptions,
                    });
                    return;
                 case 'touchUpWajah':
                    if (!touchUpOptions.lipColor && touchUpOptions.blushIntensity === 'none' && !touchUpOptions.brightenFace && !touchUpOptions.healSkin && !touchUpOptions.hairstyle && !touchUpOptions.hairColor) {
                        alert('Pilih setidaknya satu opsi "Touch Up" untuk melanjutkan.');
                        return;
                    }
                    if (!uploadedImage) {
                         alert('Silakan unggah foto wajah yang akan di-touch up.');
                        return;
                    }
                    onGenerate({
                        prompt: 'touch-up-wajah-prompt',
                        image: uploadedImage,
                        useFaceLock: true,
                        aspectRatio,
                        customStyle: 'touchUpWajah',
                        touchUpOptions: touchUpOptions,
                    });
                    return;
                default:
                    return;
            }
        }
        
        const promptToSend = isMeAndChildhood ? '__ME_AND_MY_CHILDHOOD__' : isMeccaFamilyPhoto ? '__MECCA_FAMILY_PHOTO__' : isFamilyPhoto ? '__FAMILY_PHOTO_LOW_ANGLE__' : isSoccerPlayer ? '__SOCCER_PLAYER__' : generatedPrompt;

        // FIX: Coerced `promptToSend` to a string before calling `.trim()` to prevent a potential runtime error.
        if (isCustomPromptSelected && !String(promptToSend).trim()) {
            alert('Prompt tidak boleh kosong.');
            return;
        }

        onGenerate({
            prompt: promptToSend,
            image: uploadedImage,
            childhoodImage: isMeAndChildhood ? childhoodImage : undefined,
            useFaceLock: isFaceLockEnabled,
            aspectRatio,
            familyFaces: isFamilyPhoto ? familyFaces.filter(f => f !== null) as ImageFile[] : (isMeccaFamilyPhoto ? familyFaces : undefined),
            familyPhotoOutfitColor: isFamilyPhoto ? familyPhotoOutfitColor : undefined,
            soccerJerseyImage: isSoccerPlayer ? soccerJerseyImage : undefined,
            soccerPlayerOptions: isSoccerPlayer ? soccerPlayerOptions : undefined,
            customPromptFaces: isCustomPromptSelected ? customPromptFaces : undefined,
        });
        
    };
    
    const TabButton: React.FC<{
        label: string;
        isActive: boolean;
        onClick: () => void;
    }> = ({ label, isActive, onClick }) => (
        <button
            onClick={onClick}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                isActive
                    ? 'border-accent-blue text-primary-text'
                    : 'border-transparent text-secondary-text hover:text-primary-text'
            }`}
        >
            {label}
        </button>
    );

    const isFaceLockDisabled = activeTab === 'kustom' && (['photoWithIdol', 'touchUpWajah', 'tingkatkanKualitas', 'sceneMovie', 'gantiBaju', 'swimwearModel'].includes(activeCustomStyle || ''));

    const generateButtonText = 
        (activeTab === 'kustom' && activeCustomStyle === 'gantiBaju') ? 'Ganti Baju' :
        (activeTab === 'kustom' && activeCustomStyle === 'qrCodeArtistik') ? 'Buat QR Code' :
        (activeTab === 'kustom' && activeCustomStyle === 'identifikasiFashion') ? 'Mulai Analisis' :
        (activeTab === 'kustom' && activeCustomStyle === 'analisaModelRambut') ? 'Mulai Analisis Rambut' :
        (activeTab === 'kustom' && activeCustomStyle === 'removeWatermark') ? 'Hapus Watermark' :
        (activeTab === 'kustom' && activeCustomStyle === 'tingkatkanKualitas') ? 'Tingkatkan Kualitas' :
        'Buat Gambar';
        
    const loadingText = 
        (activeTab === 'kustom' && activeCustomStyle === 'gantiBaju') ? 'Mengganti...' :
        (activeTab === 'kustom' && activeCustomStyle === 'qrCodeArtistik') ? 'Membuat QR...' :
        (activeTab === 'kustom' && activeCustomStyle === 'identifikasiFashion') ? 'Menganalisis...' :
        (activeTab === 'kustom' && activeCustomStyle === 'analisaModelRambut') ? 'Menganalisis Rambut...' :
        (activeTab === 'kustom' && activeCustomStyle === 'removeWatermark') ? 'Menghapus...' :
        (activeTab === 'kustom' && activeCustomStyle === 'tingkatkanKualitas') ? 'Meningkatkan...' :
        'Membuat...';

    const isFullDresscodeMode = fashionFullDresscode != null;
    const isIndividualMode = fashionTop != null || fashionPants != null || fashionShoes != null;

    const meccaFamilySlots = [
        { label: 'Ibu (Wajah 2)', index: 0 },
        { label: 'Anak 1 (Wajah 3)', index: 1 },
        { label: 'Anak 2 (Wajah 4)', index: 2 },
        { label: 'Anak 3 (Wajah 5)', index: 3 },
    ];

    const mainUploaderLabel = selectedStyle === '__ME_AND_MY_CHILDHOOD__' 
        ? "Unggah Foto Dewasa (Wajib)"
        : "Unggah Foto Wajah (Wajib)";

    const inputClasses = "w-full bg-background border border-border-color rounded-lg p-2.5 text-primary-text placeholder:text-secondary-text/60 focus:ring-1 focus:ring-accent-blue focus:border-accent-blue transition";
    const smallInputClasses = "w-full mt-1 bg-background border border-border-color rounded-md p-1.5 text-xs focus:ring-1 focus:ring-accent-blue focus:border-accent-blue transition";
    const secondaryButtonClasses = "w-full text-sm bg-surface-2 hover:bg-border-color disabled:bg-surface/50 disabled:cursor-not-allowed text-primary-text font-medium py-2 px-3 rounded-lg transition flex items-center justify-center gap-2 border border-border-color";

    return (
        <div className="bg-surface p-4 sm:p-6 rounded-2xl border border-border-color flex flex-col h-full">
            <div className="flex-shrink-0 border-b border-border-color">
                <TabButton label="Manual" isActive={activeTab === 'manual'} onClick={() => setActiveTab('manual')} />
                <TabButton label="Rekomendasi" isActive={activeTab === 'rekomendasi'} onClick={() => setActiveTab('rekomendasi')} />
                <TabButton label="Kustom" isActive={activeTab === 'kustom'} onClick={() => setActiveTab('kustom')} />
            </div>

            <div className="flex-grow py-4 overflow-y-auto flex flex-col gap-4">
            {/* Manual Tab Content */}
            {activeTab === 'manual' && (
                <>
                    <SectionCard title="1. Subjek & Gambar">
                        <textarea id="mainSubject" rows={3} className={inputClasses} placeholder="Tulis subjek... akhiri dengan '..' untuk B.Inggris / '.,' untuk B.Indo" value={mainSubject} onChange={(e) => {
                            handleTextChangeWithTranslation(e, setMainSubject, setTranslatedMainSubject, setIsTranslatingSubject);
                            if (improvedOptions?.key === 'mainSubject') setImprovedOptions(null);
                        }}/>
                        <button onClick={handleImproveSubject} disabled={isImprovingSubject || !mainSubject.trim()} className={`${secondaryButtonClasses} mt-2`}>
                            {isImprovingSubject ? <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <SparklesIcon className="w-5 h-5 text-accent-blue"/>}
                            {isImprovingSubject ? 'Meningkatkan...' : 'Tingkatkan dengan AI'}
                        </button>
                        {improvedOptions?.key === 'mainSubject' && <ImprovedOptionsDisplay {...improvedOptions} />}
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-secondary-text mb-2">Unggah Foto (Opsional)</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {uploadedImages.map((image, index) => (
                                     <ImageUploader key={index} label={``} image={image} onImageSelect={(file) => handleImageUpload(file, index)} onImageRemove={() => removeImage(index)} showRemoveButton={!!image}/>
                                ))}
                                 <button onClick={addImageSlot} className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-border-color rounded-lg transition hover:border-accent-blue hover:bg-surface-2 text-secondary-text">
                                    + Tambah
                                </button>
                            </div>
                          {uploadedImages.some(img => img) && (
                              <div className="flex items-center mt-3">
                                  <input type="checkbox" id="faceLock" className="h-4 w-4 rounded border-border-color bg-surface text-accent-blue focus:ring-accent-blue" checked={isFaceLockEnabled} onChange={(e) => setIsFaceLockEnabled(e.target.checked)}/>
                                  <label htmlFor="faceLock" className="ml-2 text-sm text-primary-text">Kunci Wajah</label>
                              </div>
                          )}
                        </div>
                    </SectionCard>
                     <SectionCard title="2. Gaya Visual">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                             <div>
                                <label htmlFor="aspectRatio" className="block text-xs font-medium text-secondary-text mb-1">Aspek Rasio</label>
                                <select id="aspectRatio" className={`${inputClasses} text-sm`} value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as AspectRatio['value'])}>
                                    {ASPECT_RATIOS.map(ratio => (<option key={ratio.value} value={ratio.value} className="bg-surface">{ratio.label}</option>))}
                                </select>
                            </div>
                            {STYLE_CATEGORIES.map(category => (
                                <div key={category.id}>
                                    <label htmlFor={category.id} className="block text-xs font-medium text-secondary-text mb-1">{category.name}</label>
                                    <select id={category.id} className={`${inputClasses} text-sm`} value={selections[category.id] || ''} onChange={(e) => handleSelectionChange(category.id, e.target.value)}>
                                        {category.options.map(option => (
                                            <option key={option.value} value={option.value} className="bg-surface">{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </>
            )}
            
            {/* Rekomendasi Tab Content */}
            {activeTab === 'rekomendasi' && (
                <>
                    <SectionCard title={mainUploaderLabel}>
                       <ImageUploader label="" image={uploadedImage} onImageSelect={(file) => handleImageUpload(file, 0)} onImageRemove={() => removeImage(0)} showRemoveButton={!!uploadedImage}/>
                    </SectionCard>
                    
                    {uploadedImage ? (
                        <>
                            <SectionCard title="2. Opsi & Gaya">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center">
                                        <input type="checkbox" id="faceLockRec" className="h-4 w-4 rounded border-border-color bg-surface text-accent-blue focus:ring-accent-blue" checked={isFaceLockEnabled} onChange={(e) => setIsFaceLockEnabled(e.target.checked)}/>
                                        <label htmlFor="faceLockRec" className="ml-2 text-sm text-primary-text">Kunci Wajah</label>
                                    </div>
                                    <div>
                                         <label htmlFor="recommendedStyle" className="block text-xs font-medium text-secondary-text mb-2">
                                            Pilih Rekomendasi
                                        </label>
                                         <select id="recommendedStyle" className={inputClasses} value={selectedStyle} onChange={(e) => { const newStyle = e.target.value; setSelectedStyle(newStyle); if (newStyle === '__SIX_CASUAL_MODELS__') { setAspectRatio('9:16'); setIsRatioLocked(true); } else if (newStyle === '__HOTWHEELS__') { setAspectRatio('1:1'); setIsRatioLocked(true); } else if (newStyle === '__JOB_APPLICATION_PHOTO__') { setAspectRatio('3:4'); setIsRatioLocked(true); } else { setIsRatioLocked(false); } if (newStyle !== '__FAMILY_PHOTO_LOW_ANGLE__' && newStyle !== '__MECCA_FAMILY_PHOTO__') { setFamilyFaces([]); } if (newStyle !== '__ME_AND_MY_CHILDHOOD__') { setChildhoodImage(null); }}}>
                                            {RECOMMENDED_STYLES.map(style => (
                                                <option key={style.label} value={style.value} className="bg-surface">{style.label}</option>
                                            ))}
                                         </select>
                                        {selectedStyleNote && (
                                            <p className="text-xs text-accent-blue/80 bg-accent-blue/10 p-2 rounded-md border border-accent-blue/20 mt-2">
                                                {selectedStyleNote}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </SectionCard>
                            
                            {/* Conditional UI Sections */}
                            {selectedStyle === '__JOB_APPLICATION_PHOTO__' && (
                                <SectionCard title="Opsi Foto Lamaran">
                                    <label htmlFor="jobAppPhotoBgColor" className="block text-xs font-medium text-secondary-text">
                                        Pilih Warna Latar Belakang
                                    </label>
                                    <div className="flex items-center gap-3 mt-2">
                                        <input
                                            id="jobAppPhotoBgColor"
                                            type="color"
                                            value={jobAppPhotoBgColor}
                                            onChange={(e) => setJobAppPhotoBgColor(e.target.value)}
                                            className="w-10 h-10 p-1 bg-transparent border-none rounded-md cursor-pointer"
                                        />
                                        <span className="font-mono text-sm text-secondary-text">{jobAppPhotoBgColor.toUpperCase()}</span>
                                    </div>
                                </SectionCard>
                            )}
                            {selectedStyle === '__ME_AND_MY_CHILDHOOD__' && (
                                <SectionCard title="Unggah Foto Masa Kecil">
                                    <ImageUploader 
                                        label=""
                                        image={childhoodImage}
                                        onImageSelect={handleChildhoodImageChange}
                                        onImageRemove={() => setChildhoodImage(null)}
                                        showRemoveButton
                                    />
                                </SectionCard>
                            )}
                            {selectedStyle === '__MECCA_FAMILY_PHOTO__' && (
                                <SectionCard title="Tambah Anggota Keluarga">
                                    <p className="text-xs text-secondary-text mb-3">
                                        Foto utama Anda akan dianggap sebagai <strong>Ayah (Wajah 1)</strong>.
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {meccaFamilySlots.map(slot => (
                                            <ImageUploader 
                                                key={slot.index} 
                                                label={slot.label}
                                                image={familyFaces[slot.index]} 
                                                onImageSelect={(file) => handleFamilyFaceChange(slot.index, file)} 
                                                onImageRemove={() => handleFamilyFaceChange(slot.index, null)} 
                                                showRemoveButton
                                            />
                                        ))}
                                    </div>
                                </SectionCard>
                            )}
                            {selectedStyle === '__HOTWHEELS__' && (
                                <SectionCard title="Detail Hotwheels">
                                    <label htmlFor="hotwheelsName" className="block text-xs font-medium text-secondary-text mb-2">
                                        Nama Model di Kemasan:
                                    </label>
                                    <input 
                                        id="hotwheelsName"
                                        type="text"
                                        value={hotwheelsName}
                                        onChange={(e) => setHotwheelsName(e.target.value)}
                                        className={`${inputClasses} text-sm`}
                                        placeholder="Contoh: Night Burner"
                                    />
                                </SectionCard>
                            )}
                            {selectedStyle === '__SOCCER_PLAYER__' && (
                                <SectionCard title="Opsi Pemain Sepak Bola">
                                    <div className="flex flex-col gap-4">
                                        <ImageUploader 
                                            label="Unggah Foto Jersey" 
                                            image={soccerJerseyImage} 
                                            onImageSelect={(file) => {
                                                if(!file) return;
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setSoccerJerseyImage({ data: reader.result as string, mimeType: file.type });
                                                };
                                                reader.readAsDataURL(file);
                                            }}
                                            onImageRemove={() => setSoccerJerseyImage(null)}
                                            showRemoveButton
                                        />
                                        <h4 className="text-sm font-medium text-secondary-text border-t border-border-color pt-4">Isi Detail Pemain:</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div>
                                                <label htmlFor="clubName" className="block text-xs font-medium text-secondary-text mb-1">Nama Klub & Tahun</label>
                                                <input id="clubName" type="text" className={`${inputClasses} text-sm`} placeholder="Contoh: Real Madrid 2024" value={soccerPlayerOptions.clubName} onChange={(e) => setSoccerPlayerOptions(prev => ({ ...prev, clubName: e.target.value }))}/>
                                            </div>
                                            <div>
                                                <label htmlFor="jerseyNamePlayer" className="block text-xs font-medium text-secondary-text mb-1">Nama di Jersey</label>
                                                <input id="jerseyNamePlayer" type="text" className={`${inputClasses} text-sm`} placeholder="Contoh: YOURNAME" value={soccerPlayerOptions.jerseyName} onChange={(e) => setSoccerPlayerOptions(prev => ({ ...prev, jerseyName: e.target.value }))}/>
                                            </div>
                                            <div>
                                                <label htmlFor="jerseyNumber" className="block text-xs font-medium text-secondary-text mb-1">Nomor Punggung</label>
                                                <input id="jerseyNumber" type="text" className={`${inputClasses} text-sm`} placeholder="Contoh: 10" value={soccerPlayerOptions.jerseyNumber} onChange={(e) => setSoccerPlayerOptions(prev => ({ ...prev, jerseyNumber: e.target.value }))}/>
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="soccerPose" className="block text-xs font-medium text-secondary-text mb-1">Pilih Pose</label>
                                            <select id="soccerPose" className={`${inputClasses} text-sm`} value={soccerPlayerOptions.pose} onChange={(e) => setSoccerPlayerOptions(prev => ({ ...prev, pose: e.target.value }))}>
                                                {SOCCER_POSE_TEMPLATES.map(opt => <option className="bg-surface" key={opt.label} value={opt.value}>{opt.label}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </SectionCard>
                            )}
                            {selectedStyle === '__FAMILY_PHOTO_LOW_ANGLE__' && (
                                <SectionCard title="Opsi Foto Keluarga">
                                    <div>
                                        <label htmlFor="familyOutfitColor" className="block text-xs font-medium text-secondary-text mb-2">
                                            Warna/Model Baju
                                        </label>
                                        <input 
                                            id="familyOutfitColor"
                                            type="text"
                                            value={familyPhotoOutfitColor}
                                            onChange={(e) => setFamilyPhotoOutfitColor(e.target.value)}
                                            className={`${inputClasses} text-sm`}
                                            placeholder="Contoh: putih, kemeja denim biru"
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-xs font-medium text-secondary-text mb-2">Unggah Wajah Anggota Lainnya (Maks. 5)</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">{familyFaces.map((face, index) => (<ImageUploader key={index} label={`Wajah ${index + 2}`} image={face} onImageSelect={(file) => handleFamilyFaceChange(index, file)} onImageRemove={() => handleFamilyFaceChange(index, null)} showRemoveButton/>))}</div>
                                        {familyFaces.length < 5 && (<button onClick={() => setFamilyFaces(prev => [...prev, null])} className="text-xs bg-surface-2 hover:bg-border-color text-primary-text font-medium py-1 px-3 rounded-md transition self-start mt-2">+ Tambah</button>)}
                                    </div>
                                </SectionCard>
                            )}
                             {selectedStyle === '__GIANT_SELFIE__' && (
                                <SectionCard title="Opsi Selfie Raksasa">
                                    <label htmlFor="giantSelfieMonument" className="block text-xs font-medium text-secondary-text mb-2">Nama monumen atau tempat ikonik:</label>
                                    <input id="giantSelfieMonument" type="text" className={inputClasses} placeholder="Contoh: Monas.. (akhiri '..' untuk B.Inggris)" value={giantSelfieMonument} onChange={(e) => handleTextChangeWithTranslation(e, setGiantSelfieMonument, setTranslatedGiantSelfieMonument, setIsTranslatingMonument)} />
                                </SectionCard>
                             )}
                             {selectedStyle === '__SOCCER_WALLPAPER__' && (
                                <SectionCard title="Detail Wallpaper Sepak Bola">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div><label htmlFor="clubTeamYear" className="block text-xs font-medium text-secondary-text mb-1">Tim &amp; Tahun</label><input id="clubTeamYear" type="text" className={`${inputClasses} text-sm`} placeholder="Real Madrid 2024" value={soccerWallpaperOptions.clubTeamYear} onChange={(e) => setSoccerWallpaperOptions(prev => ({ ...prev, clubTeamYear: e.target.value }))}/></div>
                                        <div><label htmlFor="jerseyName" className="block text-xs font-medium text-secondary-text mb-1">Nama</label><input id="jerseyName" type="text" className={`${inputClasses} text-sm`} placeholder="RONALDO" value={soccerWallpaperOptions.jerseyName} onChange={(e) => setSoccerWallpaperOptions(prev => ({ ...prev, jerseyName: e.target.value }))}/></div>
                                        <div><label htmlFor="customBackNo" className="block text-xs font-medium text-secondary-text mb-1">Nomor</label><input id="customBackNo" type="text" className={`${inputClasses} text-sm`} placeholder="7" value={soccerWallpaperOptions.customBackNo} onChange={(e) => setSoccerWallpaperOptions(prev => ({ ...prev, customBackNo: e.target.value }))}/></div>
                                        <div><label htmlFor="stadiumClub" className="block text-xs font-medium text-secondary-text mb-1">Stadion</label><input id="stadiumClub" type="text" className={`${inputClasses} text-sm`} placeholder="Santiago Bernabéu" value={soccerWallpaperOptions.stadiumClub} onChange={(e) => setSoccerWallpaperOptions(prev => ({ ...prev, stadiumClub: e.target.value }))}/></div>
                                    </div>
                                </SectionCard>
                             )}
                            {selectedStyle === '__SIX_CASUAL_MODELS__' && (
                                <SectionCard title="Opsi Model">
                                    <label htmlFor="sixCasualModelSubject" className="block text-xs font-medium text-secondary-text mb-2">Subjek Model:</label>
                                    <select id="sixCasualModelSubject" className={inputClasses} value={sixCasualModelSubject} onChange={(e) => setSixCasualModelSubject(e.target.value as any)}>
                                        <option className="bg-surface" value="anak pria">Anak Pria</option>
                                        <option className="bg-surface" value="anak wanita">Anak Wanita</option>
                                        <option className="bg-surface" value="pria dewasa">Pria Dewasa</option>
                                        <option className="bg-surface" value="wanita dewasa">Wanita Dewasa</option>
                                    </select>
                                </SectionCard>
                            )}
                            {selectedStyle === '__ACTION_FIGURE_CUSTOM__' && (
                                <SectionCard title="Opsi Action Figure">
                                    <label htmlFor="actionFigureOutfit" className="block text-xs font-medium text-secondary-text mb-2">Deskripsi kostum:</label>
                                    <textarea id="actionFigureOutfit" rows={3} className={inputClasses} placeholder="Contoh: Baju zirah futuristik.. (akhiri '..' untuk B.Inggris)" value={actionFigureOutfit} onChange={(e) => handleTextChangeWithTranslation(e, setActionFigureOutfit, setTranslatedActionFigureOutfit, setIsTranslatingOutfit)} />
                                </SectionCard>
                            )}
                            {selectedStyle === '__CUSTOM_PROMPT__' && (
                                <SectionCard title="Prompt Ajaib Kamu">
                                    <label htmlFor="customPrompt" className="block text-xs font-medium text-secondary-text mb-2">Deskripsi Anda:</label>
                                    <textarea id="customPrompt" rows={4} className={inputClasses} placeholder="Contoh: Seorang ksatria.. (akhiri '..' untuk B.Inggris)" value={customPrompt} onChange={(e) => { 
                                        handleTextChangeWithTranslation(e, setCustomPrompt, setTranslatedCustomPrompt, setIsTranslatingCustomPrompt);
                                        if (improvedOptions?.key === 'customPrompt') setImprovedOptions(null);
                                    }}/>
                                    <button onClick={handleImprovePrompt} disabled={isImprovingPrompt || !customPrompt.trim()} className={`${secondaryButtonClasses} mt-2`}>
                                        {isImprovingPrompt ? <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <SparklesIcon className="w-5 h-5 text-accent-blue"/>}
                                        {isImprovingPrompt ? 'Meningkatkan...' : 'Tingkatkan dengan AI'}
                                    </button>
                                    {improvedOptions?.key === 'customPrompt' && <ImprovedOptionsDisplay {...improvedOptions} />}
                                    <div className="mt-4 border-t border-border-color pt-4">
                                        <h4 className="block text-xs font-medium text-secondary-text mb-3">Unggah Wajah Tambahan (Maks. 9)</h4>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                                            {customPromptFaces.map((face, index) => (
                                                <ImageUploader 
                                                    key={index} 
                                                    label={`Wajah ${index + 2}`} 
                                                    image={face} 
                                                    onImageSelect={(file) => handleCustomPromptFaceChange(index, file)} 
                                                    onImageRemove={() => handleCustomPromptFaceChange(index, null)} 
                                                    showRemoveButton
                                                />
                                            ))}
                                        </div>
                                        {customPromptFaces.length < 9 && (
                                            <button 
                                                onClick={() => setCustomPromptFaces(prev => [...prev, null])} 
                                                className="text-xs bg-surface-2 hover:bg-border-color text-primary-text font-medium py-1 px-3 rounded-md transition self-start mt-4"
                                            >
                                                + Tambah
                                            </button>
                                        )}
                                    </div>
                                </SectionCard>
                            )}
                        </>
                    ) : (
                        <div className="text-center text-secondary-text bg-background p-6 rounded-lg border border-dashed border-border-color">
                            <p>Silakan unggah gambar terlebih dahulu untuk memilih gaya.</p>
                        </div>
                    )}
                </>
            )}
            
            {/* Kustom Tab Content */}
            {activeTab === 'kustom' && (
                <>
                     <SectionCard title="1. Pilih Style Kustom">
                        <div className="flex flex-wrap gap-2">
                            {CUSTOM_STYLES.map(style => (
                                <button key={style.id} onClick={() => { 
                                    const newStyle = activeCustomStyle === style.id ? null : style.id; 
                                    setActiveCustomStyle(newStyle); 
                                     if (newStyle === 'drawPose') {
                                        setAspectRatio('1:1');
                                    }
                                    if (newStyle !== 'identifikasiFashion') { 
                                        setFashionFullDresscode(null);
                                        setFashionTop(null);
                                        setFashionPants(null);
                                        setFashionShoes(null);
                                        setFashionAccessory(null);
                                    } 
                                    if (newStyle !== 'sceneMovie') { 
                                        setSceneMovieImage(null); 
                                    }
                                    if (newStyle !== 'gantiBaju') {
                                        setClothingImage(null);
                                    }
                                     if (newStyle !== 'swimwearModel') {
                                        setSwimwearClothingImage(null);
                                    }
                                }} className={`px-3 py-2 text-sm font-medium rounded-lg transition-all border ${activeCustomStyle === style.id ? 'bg-accent-blue text-background border-accent-blue font-semibold' : 'bg-surface-2 text-primary-text hover:bg-border-color border-border-color'}`}>
                                    {style.name}
                                </button>
                            ))}
                        </div>
                    </SectionCard>
                    {activeCustomStyle && (
                        <SectionCard title={CUSTOM_STYLES.find(s => s.id === activeCustomStyle)?.name || 'Opsi'}>
                            <div className="flex flex-col gap-4">
                               <p className="text-xs text-center text-accent-blue/80 bg-accent-blue/10 p-2 rounded-md border border-accent-blue/20 -mt-2 mb-2">{CUSTOM_STYLES.find(s => s.id === activeCustomStyle)?.note}</p>
                              
                              {CUSTOM_STYLES.find(s => s.id === activeCustomStyle)?.requiresImage && activeCustomStyle !== 'swimwearModel' && (
                                  <div className="flex flex-col gap-2">
                                       <ImageUploader label="Unggah Foto Utama" image={uploadedImage} onImageSelect={(file) => handleImageUpload(file, 0)} onImageRemove={() => removeImage(0)} showRemoveButton={!!uploadedImage}/>
                                       {uploadedImage && (
                                          <div className="flex items-center">
                                              <input type="checkbox" id="faceLockKustom" className="h-4 w-4 rounded border-border-color bg-surface text-accent-blue focus:ring-accent-blue disabled:opacity-50" checked={isFaceLockEnabled} onChange={(e) => setIsFaceLockEnabled(e.target.checked)} disabled={isFaceLockDisabled}/>
                                              <label htmlFor="faceLockKustom" className={`ml-2 text-sm ${uploadedImage ? 'text-primary-text' : 'text-secondary-text'}`}>Kunci Wajah</label>
                                              {isFaceLockDisabled && <span className="text-xs text-secondary-text ml-2">(Otomatis aktif)</span>}
                                          </div>
                                      )}
                                  </div>
                              )}

                               {activeCustomStyle === 'gantiBaju' && (
                                    <div className="flex flex-col gap-4">
                                        <ImageUploader 
                                            label="Unggah Foto Pakaian Baru"
                                            image={clothingImage} 
                                            onImageSelect={handleClothingImageChange} 
                                            onImageRemove={() => setClothingImage(null)} 
                                            showRemoveButton={!!clothingImage}
                                        />
                                    </div>
                                )}

                               {activeCustomStyle === 'qrCodeArtistik' && (
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label htmlFor="qrCodeUrl" className="block text-xs font-medium text-secondary-text mb-2">
                                                URL atau Teks untuk QR Code
                                            </label>
                                            <input 
                                                id="qrCodeUrl"
                                                type="text"
                                                value={qrCodeUrl}
                                                onChange={(e) => setQrCodeUrl(e.target.value)}
                                                className={inputClasses}
                                                placeholder="https://contoh.com"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="qrCodeArtPrompt" className="block text-xs font-medium text-secondary-text mb-2">
                                                Deskripsi Seni Latar Belakang
                                            </label>
                                            <textarea 
                                                id="qrCodeArtPrompt"
                                                rows={3}
                                                value={qrCodeArtPrompt}
                                                onChange={(e) => setQrCodeArtPrompt(e.target.value)}
                                                className={inputClasses}
                                                placeholder="Sebuah taman bunga fantasi di malam hari..."
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="qrCodeAspectRatio" className="block text-xs font-medium text-secondary-text mb-2">Aspek Rasio</label>
                                            <select id="qrCodeAspectRatio" className={inputClasses} value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as AspectRatio['value'])}>
                                                {ASPECT_RATIOS.map(ratio => (<option className="bg-surface" key={ratio.value} value={ratio.value}>{ratio.label}</option>))}
                                            </select>
                                        </div>
                                    </div>
                                )}

                               {activeCustomStyle === 'drawPose' && (
                                  <div className="flex flex-col gap-4">
                                      <ImageUploader 
                                          label="Pilih Photo Model (Wajah & Baju)"
                                          image={poseModelImage} 
                                          onImageSelect={handlePoseModelImageChange}
                                          onImageRemove={() => handlePoseModelImageChange(null)}
                                          showRemoveButton={true}
                                      />
                                      <div>
                                          <label className="block text-xs font-medium text-secondary-text mb-2">Metode Input Pose</label>
                                          <div className="flex gap-2 rounded-lg bg-background p-1">
                                              <button onClick={() => setPoseInputMode('upload')} className={`flex-1 text-sm py-1.5 rounded-md transition ${poseInputMode === 'upload' ? 'bg-accent-blue text-background' : 'text-primary-text'}`}>Unggah Referensi</button>
                                              <button onClick={() => setPoseInputMode('draw')} className={`flex-1 text-sm py-1.5 rounded-md transition ${poseInputMode === 'draw' ? 'bg-accent-blue text-background' : 'text-primary-text'}`}>Gambar Pose</button>
                                          </div>
                                      </div>
                                      {poseInputMode === 'upload' && (
                                          <div className="flex flex-col gap-3">
                                              <ImageUploader 
                                                  label="Unggah Foto atau Sketsa Gaya"
                                                  image={poseReferenceImage} 
                                                  onImageSelect={handlePoseReferenceImageChange}
                                                  onImageRemove={() => handlePoseReferenceImageChange(null)}
                                                  showRemoveButton={true}
                                              />
                                              <div className="flex items-center p-2 bg-background rounded-md">
                                                  <input type="checkbox" id="isPoseFromSketch" className="h-4 w-4 rounded border-border-color bg-surface text-accent-blue focus:ring-accent-blue" checked={isPoseFromSketch} onChange={(e) => setIsPoseFromSketch(e.target.checked)} />
                                                  <label htmlFor="isPoseFromSketch" className="ml-2 text-sm font-medium text-primary-text">Referensi adalah sketsa (bukan foto)</label>
                                              </div>
                                          </div>
                                      )}
                                      {poseInputMode === 'draw' && (
                                          <DrawingCanvas width={256} height={341} onCanvasExport={setDrawnPose} />
                                      )}
                                      <div>
                                          <label htmlFor="drawPoseAspectRatio" className="block text-xs font-medium text-secondary-text mb-2">Aspek Rasio (Opsional)</label>
                                          <select id="drawPoseAspectRatio" className={inputClasses} value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as AspectRatio['value'])}>
                                              {ASPECT_RATIOS.map(ratio => (<option className="bg-surface" key={ratio.value} value={ratio.value}>{ratio.label}</option>))}
                                          </select>
                                      </div>
                                  </div>
                              )}

                               {activeCustomStyle === 'analisaModelRambut' && (
                                  <div className="flex flex-col gap-4">
                                      <ImageUploader 
                                          label="Unggah Foto Wajah"
                                          image={uploadedImage}
                                          onImageSelect={(file) => handleImageUpload(file, 0)}
                                          onImageRemove={() => removeImage(0)}
                                          showRemoveButton
                                      />
                                  </div>
                              )}

                              {activeCustomStyle === 'sceneMovie' && (
                                  <ImageUploader
                                      label="Unggah Foto Scene Movie"
                                      image={sceneMovieImage}
                                      onImageSelect={handleSceneMovieImageChange}
                                      onImageRemove={() => handleSceneMovieImageChange(null)}
                                      showRemoveButton={true}
                                  />
                              )}
                              
                               {activeCustomStyle === 'swimwearModel' && (
                                    <div className="flex flex-col gap-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <ImageUploader 
                                                label="Foto Wajah Model"
                                                image={uploadedImage} 
                                                onImageSelect={(file) => handleImageUpload(file, 0)} 
                                                onImageRemove={() => removeImage(0)} 
                                                showRemoveButton={!!uploadedImage}
                                            />
                                            <ImageUploader 
                                                label="Foto Pakaian Renang"
                                                image={swimwearClothingImage} 
                                                onImageSelect={handleSwimwearClothingImageChange} 
                                                onImageRemove={() => setSwimwearClothingImage(null)} 
                                                showRemoveButton={!!swimwearClothingImage}
                                            />
                                        </div>
                                        {uploadedImage && (
                                            <div className="flex items-center">
                                                <input type="checkbox" id="faceLockKustom" className="h-4 w-4 rounded border-border-color bg-surface text-accent-blue focus:ring-accent-blue disabled:opacity-50" checked={isFaceLockEnabled} onChange={(e) => setIsFaceLockEnabled(e.target.checked)} disabled={isFaceLockDisabled}/>
                                                <label htmlFor="faceLockKustom" className={`ml-2 text-sm ${uploadedImage ? 'text-primary-text' : 'text-secondary-text'}`}>Kunci Wajah</label>
                                                {isFaceLockDisabled && <span className="text-xs text-secondary-text ml-2">(Otomatis aktif)</span>}
                                            </div>
                                        )}
                                      <h4 className="text-sm font-medium text-secondary-text border-t border-border-color pt-3">Spesifikasi Model & Scene</h4>
                                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                          <div><label className="text-xs text-secondary-text">Tipe Bikini</label><select value={swimwearModelOptions.swimwearType} onChange={e => setSwimwearModelOptions(p => ({...p, swimwearType: e.target.value as any}))} className={smallInputClasses}><option className="bg-surface" value="thong g-string">Thong/G-String</option><option className="bg-surface" value="string bikini">String Bikini</option><option className="bg-surface" value="micro bikini">Micro Bikini</option></select></div>
                                          <div><label className="text-xs text-secondary-text">Etnis</label><select value={swimwearModelOptions.ethnicity} onChange={e => setSwimwearModelOptions(p => ({...p, ethnicity: e.target.value as any}))} className={smallInputClasses}><option className="bg-surface" value="indonesia">Indonesia</option><option className="bg-surface" value="asia">Asia</option><option className="bg-surface" value="kaukasia">Kaukasia</option><option className="bg-surface" value="latina">Latina</option><option className="bg-surface" value="kulit hitam">Kulit Hitam</option><option className="bg-surface" value="timur tengah">Timur Tengah</option></select></div>
                                          <div><label className="text-xs text-secondary-text">Tipe Badan</label><select value={swimwearModelOptions.bodyType} onChange={e => setSwimwearModelOptions(p => ({...p, bodyType: e.target.value as any}))} className={smallInputClasses}><option className="bg-surface" value="langsing">Langsing</option><option className="bg-surface" value="atletis">Atletis</option><option className="bg-surface" value="berisi">Berisi</option><option className="bg-surface" value="melengkung">Melengkung</option></select></div>
                                          <div><label className="text-xs text-secondary-text">Warna Rambut</label><select value={swimwearModelOptions.hairColor} onChange={e => setSwimwearModelOptions(p => ({...p, hairColor: e.target.value as any}))} className={smallInputClasses}><option className="bg-surface" value="pirang">Pirang</option><option className="bg-surface" value="coklat">Coklat</option><option className="bg-surface" value="hitam">Hitam</option><option className="bg-surface" value="merah">Merah</option></select></div>
                                          <div><label className="text-xs text-secondary-text">Ukuran Dada</label><select value={swimwearModelOptions.bustSize} onChange={e => setSwimwearModelOptions(p => ({...p, bustSize: e.target.value as any}))} className={smallInputClasses}><option className="bg-surface" value="kecil">Kecil</option><option className="bg-surface" value="sedang">Sedang</option><option className="bg-surface" value="besar">Besar</option></select></div>
                                          <div><label className="text-xs text-secondary-text">Ukuran Pinggul</label><select value={swimwearModelOptions.hipSize} onChange={e => setSwimwearModelOptions(p => ({...p, hipSize: e.target.value as any}))} className={smallInputClasses}><option className="bg-surface" value="kecil">Kecil</option><option className="bg-surface" value="sedang">Sedang</option><option className="bg-surface" value="besar">Besar</option><option className="bg-surface" value="sangat besar">Sangat Besar</option></select></div>
                                          <div><label className="text-xs text-secondary-text">Setting</label><select value={swimwearModelOptions.setting} onChange={e => setSwimwearModelOptions(p => ({...p, setting: e.target.value as any}))} className={smallInputClasses}><option className="bg-surface" value="tepi kolam renang mewah">Tepi Kolam Renang Mewah</option><option className="bg-surface" value="pantai tropis cerah">Pantai Tropis Cerah</option><option className="bg-surface" value="di atas kapal pesiar">Di Atas Kapal Pesiar</option></select></div>
                                      </div>
                                      <div><label className="text-xs text-secondary-text">Pose</label><select value={swimwearModelOptions.pose} onChange={e => setSwimwearModelOptions(p => ({...p, pose: e.target.value as any}))} className={smallInputClasses}>{SWIMWEAR_POSE_TEMPLATES.map(p => <option className="bg-surface" key={p.label} value={p.value}>{p.label}</option>)}</select></div>
                                  </div>
                              )}

                               {activeCustomStyle === 'identifikasiFashion' && (
                                  <div className="flex flex-col gap-4">
                                      <p className="text-xs font-bold text-accent-blue/80 mb-2">Pilih Salah Satu Mode:</p>
                                      <div className="flex flex-col gap-3">
                                          <ImageUploader 
                                              label="Mode 1: Analisis Outfit Lengkap"
                                              image={fashionFullDresscode}
                                              onImageSelect={handleFashionImageChange(setFashionFullDresscode)}
                                              onImageRemove={() => setFashionFullDresscode(null)}
                                              showRemoveButton
                                              disabled={isIndividualMode}
                                          />
                                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-t border-border-color pt-3">
                                              <ImageUploader label="Mode 2: Baju" image={fashionTop} onImageSelect={handleFashionImageChange(setFashionTop)} onImageRemove={() => setFashionTop(null)} showRemoveButton disabled={isFullDresscodeMode} />
                                              <ImageUploader label="Celana/Rok" image={fashionPants} onImageSelect={handleFashionImageChange(setFashionPants)} onImageRemove={() => setFashionPants(null)} showRemoveButton disabled={isFullDresscodeMode} />
                                              <ImageUploader label="Sepatu" image={fashionShoes} onImageSelect={handleFashionImageChange(setFashionShoes)} onImageRemove={() => setFashionShoes(null)} showRemoveButton disabled={isFullDresscodeMode} />
                                              <ImageUploader label="Aksesori" image={fashionAccessory} onImageSelect={handleFashionImageChange(setFashionAccessory)} onImageRemove={() => setFashionAccessory(null)} showRemoveButton disabled={isFullDresscodeMode} />
                                          </div>
                                      </div>
                                  </div>
                              )}

                               {activeCustomStyle === 'semuaBisaDisini' && (
                                  <div className="flex flex-col gap-4">
                                       <div>
                                          <label htmlFor="sbdPhotoCount" className="block text-xs font-medium text-secondary-text mb-2">Jumlah Foto</label>
                                          <div className="flex gap-2">
                                              {[2,3,4,5].map(num => (
                                                  <button key={num} onClick={() => handleSBDPhotoCountChange(num)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors border ${semuaBisaDisiniOptions.numberOfPhotos === num ? 'bg-accent-blue text-background border-accent-blue' : 'bg-surface-2 text-primary-text hover:bg-border-color border-border-color'}`}>
                                                      {num}
                                                  </button>
                                              ))}
                                          </div>
                                      </div>
                                      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${semuaBisaDisiniOptions.numberOfPhotos > 3 ? '3' : '2'} gap-4`}>
                                          {semuaBisaDisiniOptions.images.map((img, index) => (
                                              <div key={index}>
                                                  <ImageUploader 
                                                      label={`Foto ${index + 1}`} 
                                                      image={img} 
                                                      onImageSelect={(file) => handleSBDImageChange(index, file)}
                                                      onImageRemove={() => handleSBDImageChange(index, null)}
                                                      showRemoveButton
                                                  />
                                                  {img && (
                                                      <div className="flex items-center mt-2">
                                                          <input type="checkbox" id={`sbdFaceLock-${index}`} checked={semuaBisaDisiniOptions.faceLockIndices.includes(index)} onChange={() => handleSBDToggleFaceLock(index)} className="h-4 w-4 rounded border-border-color bg-surface text-accent-blue focus:ring-accent-blue" />
                                                          <label htmlFor={`sbdFaceLock-${index}`} className="ml-2 text-xs text-primary-text">Kunci Wajah</label>
                                                      </div>
                                                  )}
                                              </div>
                                          ))}
                                      </div>
                                       <div>
                                          <label htmlFor="sbdPrompt" className="block text-xs font-medium text-secondary-text mb-2">Deskripsi Scene</label>
                                          <textarea id="sbdPrompt" value={semuaBisaDisiniOptions.prompt} onChange={(e) => {setSemuaBisaDisiniOptions(p => ({...p, prompt: e.target.value})); if (improvedOptions?.key === 'sbd') setImprovedOptions(null);}} rows={3} className={`${inputClasses} text-sm`} placeholder="Contoh: Orang dari foto 1 dan 2 sedang minum kopi bersama di kafe..."></textarea>
                                          <button onClick={handleImproveSBDPrompt} disabled={isImprovingSBDPrompt || !semuaBisaDisiniOptions.prompt.trim()} className={`${secondaryButtonClasses} mt-2`}>
                                              {isImprovingSBDPrompt ? <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <SparklesIcon className="w-5 h-5 text-accent-blue"/>}
                                              {isImprovingSBDPrompt ? 'Meningkatkan...' : 'Tingkatkan dengan AI'}
                                          </button>
                                          {improvedOptions?.key === 'sbd' && <ImprovedOptionsDisplay {...improvedOptions} />}
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                          <div><label className="text-xs text-secondary-text">Gaya Pengambilan</label><select value={semuaBisaDisiniOptions.shotStyle} onChange={e => setSemuaBisaDisiniOptions(p => ({...p, shotStyle: e.target.value as any}))} className={smallInputClasses}>{SBD_SHOT_STYLE_TEMPLATES.map(s => <option className="bg-surface" key={s.label} value={s.value}>{s.label}</option>)}</select></div>
                                          <div><label className="text-xs text-secondary-text">Gaya Pencahayaan</label><select value={semuaBisaDisiniOptions.lightStyle} onChange={e => setSemuaBisaDisiniOptions(p => ({...p, lightStyle: e.target.value as any}))} className={smallInputClasses}>{SBD_LIGHT_STYLE_TEMPLATES.map(l => <option className="bg-surface" key={l.label} value={l.value}>{l.label}</option>)}</select></div>
                                          <div><label className="text-xs text-secondary-text">Aspek Rasio</label><select value={semuaBisaDisiniOptions.aspectRatio} onChange={e => setSemuaBisaDisiniOptions(p => ({...p, aspectRatio: e.target.value as any}))} className={smallInputClasses}>{ASPECT_RATIOS.map(r => <option className="bg-surface" key={r.value} value={r.value}>{r.label}</option>)}</select></div>
                                      </div>
                                  </div>
                              )}

                               {activeCustomStyle === 'promptVideoVeo' && (
                                  <div className="flex flex-col gap-4">
                                      <textarea value={veoManualPrompt} onChange={(e) => {setVeoManualPrompt(e.target.value); setImprovedVeoPrompt(null);}} rows={4} className={`${inputClasses} text-sm`} placeholder="Tulis ide video Anda di sini dalam Bahasa Indonesia..."></textarea>
                                      <button onClick={handleImproveVeoPrompt} disabled={isImprovingVeoPrompt || !veoManualPrompt.trim()} className={`${secondaryButtonClasses} w-full`}>
                                           {isImprovingVeoPrompt ? <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <SparklesIcon className="w-5 h-5 text-accent-blue"/>}
                                          {isImprovingVeoPrompt ? 'Meningkatkan...' : 'Tingkatkan Prompt (Veo)'}
                                      </button>
                                      {improvedVeoPrompt && (
                                          <div className="p-3 bg-background rounded-lg border border-border-color">
                                              <div className="flex gap-2 rounded-lg bg-surface p-1 mb-3">
                                                  <button onClick={() => setSelectedVeoVersion('detailed')} className={`flex-1 text-xs py-1.5 rounded-md transition ${selectedVeoVersion === 'detailed' ? 'bg-accent-blue text-background' : 'text-primary-text'}`}>Detail</button>
                                                  <button onClick={() => setSelectedVeoVersion('concise')} className={`flex-1 text-xs py-1.5 rounded-md transition ${selectedVeoVersion === 'concise' ? 'bg-accent-blue text-background' : 'text-primary-text'}`}>Ringkas</button>
                                              </div>
                                              <p className="text-xs text-secondary-text whitespace-pre-wrap">{improvedVeoPrompt[selectedVeoVersion]}</p>
                                          </div>
                                      )}
                                  </div>
                              )}

                               {activeCustomStyle === 'photoWithIdol' && (
                                  <div className="flex flex-col gap-4">
                                       <ImageUploader
                                          label="Unggah Foto Idola"
                                          image={idolImage}
                                          onImageSelect={handleIdolImageChange}
                                          onImageRemove={() => handleIdolImageChange(null)}
                                          showRemoveButton={true}
                                      />
                                      {idolImage && (
                                          <div className="flex items-center">
                                              <input type="checkbox" id="idolFaceLock" checked={isIdolFaceLockEnabled} onChange={(e) => setIsIdolFaceLockEnabled(e.target.checked)} className="h-4 w-4 rounded border-border-color bg-surface text-accent-blue focus:ring-accent-blue"/>
                                              <label htmlFor="idolFaceLock" className="ml-2 text-sm text-primary-text">Kunci Wajah Idola</label>
                                          </div>
                                      )}
                                      <div className="border-t border-border-color pt-4">
                                          <h4 className="text-sm font-medium text-secondary-text mb-3">Opsi Prompt</h4>
                                          <div className="p-3 bg-background rounded-lg border border-border-color flex flex-col gap-3">
                                              <p className="text-xs text-secondary-text">Gunakan template di bawah ini, atau tulis prompt manual.</p>
                                               <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                  <div><label className="text-xs text-secondary-text">Pose</label><select value={photoWithIdolOptions.poseTemplate} onChange={e => setPhotoWithIdolOptions(p => ({...p, poseTemplate: e.target.value}))} className={smallInputClasses}>{IDOL_POSE_TEMPLATES.map(p => <option className="bg-surface" key={p.label} value={p.value}>{p.label}</option>)}</select></div>
                                                  <div><label className="text-xs text-secondary-text">Gaya Pengambilan</label><select value={photoWithIdolOptions.shotStyleTemplate} onChange={e => setPhotoWithIdolOptions(p => ({...p, shotStyleTemplate: e.target.value}))} className={smallInputClasses}>{SHOT_STYLE_TEMPLATES.map(s => <option className="bg-surface" key={s.label} value={s.value}>{s.label}</option>)}</select></div>
                                                  <div><label className="text-xs text-secondary-text">Pencahayaan</label><select value={photoWithIdolOptions.lightStyleTemplate} onChange={e => setPhotoWithIdolOptions(p => ({...p, lightStyleTemplate: e.target.value}))} className={smallInputClasses}>{LIGHT_STYLE_TEMPLATES.map(l => <option className="bg-surface" key={l.label} value={l.value}>{l.label}</option>)}</select></div>
                                              </div>
                                               <button onClick={handleGenerateIdolTemplatePrompt} className="text-xs bg-surface-2 hover:bg-border-color text-primary-text font-medium py-2 px-3 rounded-md transition self-start">Buat Prompt dari Template</button>
                                              <textarea value={photoWithIdolOptions.manualPrompt} onChange={(e) => {setPhotoWithIdolOptions(p => ({...p, manualPrompt: e.target.value})); if (improvedOptions?.key === 'idol') setImprovedOptions(null);}} rows={3} className={`${inputClasses} text-sm mt-2`} placeholder="Atau, tulis prompt manual di sini..."></textarea>
                                               <button onClick={handleImproveIdolManualPrompt} disabled={isImprovingIdolPrompt || !photoWithIdolOptions.manualPrompt.trim()} className={`${secondaryButtonClasses} w-full mt-1`}>
                                                  {isImprovingIdolPrompt ? <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <SparklesIcon className="w-5 h-5 text-accent-blue"/>}
                                                  {isImprovingIdolPrompt ? 'Meningkatkan...' : 'Tingkatkan Manual Prompt'}
                                              </button>
                                              {improvedOptions?.key === 'idol' && <ImprovedOptionsDisplay {...improvedOptions} />}
                                          </div>
                                      </div>
                                  </div>
                              )}
                               {activeCustomStyle === 'touchUpWajah' && (
                                    <div className="flex flex-col gap-5">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-5">
                                            {/* Heal & Brighten */}
                                            <div className="flex items-center"><input id="healSkin" type="checkbox" checked={touchUpOptions.healSkin} onChange={e => setTouchUpOptions(p=>({...p, healSkin: e.target.checked}))} className="h-4 w-4 rounded border-border-color bg-surface text-accent-blue focus:ring-accent-blue" /><label htmlFor="healSkin" className="ml-2 text-sm">Haluskan Kulit</label></div>
                                            <div className="flex items-center"><input id="brightenFace" type="checkbox" checked={touchUpOptions.brightenFace} onChange={e => setTouchUpOptions(p=>({...p, brightenFace: e.target.checked}))} className="h-4 w-4 rounded border-border-color bg-surface text-accent-blue focus:ring-accent-blue" /><label htmlFor="brightenFace" className="ml-2 text-sm">Cerahkan Wajah</label></div>
                                        </div>
                                        {/* Lip Color */}
                                        <div>
                                            <label className="block text-xs font-medium text-secondary-text mb-2">Warna Lipstik (Opsional)</label>
                                            <div className="flex flex-wrap gap-2">
                                                <button onClick={() => setTouchUpOptions(p => ({...p, lipColor: ''}))} className={`px-3 py-1.5 text-xs rounded-full transition-all border ${!touchUpOptions.lipColor ? 'bg-accent-blue text-background border-accent-blue' : 'bg-surface hover:border-secondary-text border-border-color'}`}>None</button>
                                                {LIPSTICK_COLORS.map(color => (
                                                    <button key={color.name} onClick={() => setTouchUpOptions(p => ({...p, lipColor: color.name}))} className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-full transition-all border ${touchUpOptions.lipColor === color.name ? 'border-accent-blue ring-2 ring-accent-blue/50' : 'border-border-color'}`}>
                                                        <span className="w-4 h-4 rounded-full" style={{backgroundColor: color.value}}></span>
                                                        {color.displayName}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Blush */}
                                        <div>
                                            <label className="block text-xs font-medium text-secondary-text mb-2">Intensitas Blush On</label>
                                            <div className="flex gap-2">
                                                {['none', 'subtle', 'medium', 'strong'].map(intensity => (
                                                    <button key={intensity} onClick={() => setTouchUpOptions(p => ({...p, blushIntensity: intensity as any}))} className={`px-3 py-1.5 text-xs rounded-full transition-all border capitalize ${touchUpOptions.blushIntensity === intensity ? 'bg-accent-blue text-background border-accent-blue' : 'bg-surface hover:border-secondary-text border-border-color'}`}>{intensity}</button>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Hair */}
                                        <div className="border-t border-border-color pt-4">
                                            <h4 className="text-sm font-medium text-secondary-text mb-3">Gaya & Warna Rambut (Opsional)</h4>
                                            <div className="flex gap-2 rounded-lg bg-background p-1 mb-3">
                                                <button onClick={() => setHairGenderTab('wanita')} className={`flex-1 text-sm py-1.5 rounded-md transition ${hairGenderTab === 'wanita' ? 'bg-accent-blue text-background' : 'text-primary-text'}`}>Wanita</button>
                                                <button onClick={() => setHairGenderTab('pria')} className={`flex-1 text-sm py-1.5 rounded-md transition ${hairGenderTab === 'pria' ? 'bg-accent-blue text-background' : 'text-primary-text'}`}>Pria</button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-xs text-secondary-text">Model Rambut</label>
                                                    <select value={touchUpOptions.hairstyle} onChange={e => setTouchUpOptions(p => ({...p, hairstyle: e.target.value}))} className={smallInputClasses}>
                                                        <option className="bg-surface" value="">-- Pilih Model --</option>
                                                        {(hairGenderTab === 'wanita' ? FEMALE_HAIRSTYLE_TEMPLATES : MALE_HAIRSTYLE_TEMPLATES).map(s => <option className="bg-surface" key={s.label} value={s.value}>{s.label}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-secondary-text">Warna Rambut</label>
                                                    <input type="text" value={touchUpOptions.hairColor} onChange={e => setTouchUpOptions(p => ({...p, hairColor: e.target.value}))} placeholder="Contoh: ash brown, platinum blonde" className={smallInputClasses} />
                                                </div>
                                            </div>
                                        </div>
                                        {/* Improvise */}
                                        <div className="border-t border-border-color pt-4 flex flex-col gap-3">
                                            <div className="flex items-center">
                                                <input id="improviseHairStyle" type="checkbox" checked={touchUpOptions.improviseHairStyle} onChange={e => setTouchUpOptions(p=>({...p, improviseHairStyle: e.target.checked}))} className="h-4 w-4 rounded border-border-color bg-surface text-accent-blue focus:ring-accent-blue" />
                                                <label htmlFor="improviseHairStyle" className="ml-2 text-sm">Improvisasi Latar & Pose</label>
                                            </div>
                                            {touchUpOptions.improviseHairStyle && (
                                                <div>
                                                    <label className="text-xs text-secondary-text">Gaya Improvisasi</label>
                                                    <select value={touchUpOptions.hairImproviseStyle} onChange={e => setTouchUpOptions(p => ({...p, hairImproviseStyle: e.target.value as any}))} className={smallInputClasses}>
                                                        <option className="bg-surface" value="close-up">Close-up</option>
                                                        <option className="bg-surface" value="half-body">Setengah Badan</option>
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                            </div>
                        </SectionCard>
                    )}
                </>
            )}
            </div>

             <div className="flex-shrink-0 mt-auto pt-4 border-t border-border-color">
                 <div className="bg-background p-3 rounded-lg border border-border-color mb-4">
                     <p className="text-xs text-secondary-text font-mono whitespace-pre-wrap break-all h-24 overflow-y-auto">{generatedPrompt}</p>
                 </div>
                 <button 
                    onClick={handleGenerateClick} 
                    disabled={isLoading}
                    className="w-full bg-accent-blue hover:bg-accent-blue-hover disabled:bg-accent-blue/50 disabled:cursor-not-allowed text-background font-bold py-4 px-4 rounded-lg transition-all shadow-lg shadow-black/20 hover:shadow-glow-blue flex items-center justify-center gap-2"
                >
                    {isLoading ? <SpinnerIcon /> : null}
                    {isLoading ? loadingText : generateButtonText}
                </button>
            </div>
        </div>
    );
};
