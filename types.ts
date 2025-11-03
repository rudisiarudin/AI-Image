
export interface StyleOption {
    value: string;
    label: string;
}

export interface StyleCategory {
    id: string;
    name: string;
    options: StyleOption[];
}

export interface RecommendedStyle {
    label: string;
    value: string;
    note?: string;
}

export interface AspectRatio {
    value: "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
    label:string;
}

export interface ImageFile {
    data: string;
    mimeType: string;
}

export interface CustomStyle {
    id: 'photoWithIdol' | 'touchUpWajah' | 'semuaBisaDisini' | 'promptVideoVeo' | 'identifikasiFashion' | 'removeWatermark' | 'tingkatkanKualitas' | 'swimwearModel' | 'sceneMovie' | 'drawPose' | 'analisaModelRambut' | 'qrCodeArtistik' | 'gantiBaju';
    name: string;
    note: string;
    requiresImage?: boolean;
}

export interface TouchUpOptions {
    lipColor: string;
    blushIntensity: 'none' | 'subtle' | 'medium' | 'strong';
    brightenFace: boolean;
    healSkin: boolean;
    hairstyle: string;
    hairColor: string;
    improviseHairStyle?: boolean;
    hairImproviseStyle?: 'close-up' | 'half-body';
}

export interface PhotoWithIdolOptions {
    manualPrompt: string;
    poseTemplate: string;
    shotStyleTemplate: string;
    lightStyleTemplate: string;
}

export interface SemuaBisaDisiniOptions {
    numberOfPhotos: number;
    images: (ImageFile | null)[];
    prompt: string;
    faceLockIndices: number[];
    shotStyle: string;
    lightStyle: string;
    aspectRatio: AspectRatio['value'];
}

export interface SwimwearModelOptions {
    swimwearType: 'thong g-string' | 'string bikini' | 'micro bikini';
    ethnicity: 'asia' | 'kaukasia' | 'latina' | 'kulit hitam' | 'timur tengah' | 'indonesia';
    bodyType: 'langsing' | 'atletis' | 'berisi' | 'melengkung';
    hairColor: 'pirang' | 'coklat' | 'hitam' | 'merah';
    setting: 'tepi kolam renang mewah' | 'pantai tropis cerah' | 'di atas kapal pesiar';
    bustSize: 'kecil' | 'sedang' | 'besar';
    hipSize: 'kecil' | 'sedang' | 'besar' | 'sangat besar';
    pose: string;
}

export interface SoccerPlayerOptions {
    clubName: string;
    jerseyName: string;
    jerseyNumber: string;
    pose: string;
}

export interface FashionImages {
    fullDresscode?: ImageFile | null;
    top?: ImageFile | null;
    pants?: ImageFile | null;
    shoes?: ImageFile | null;
    accessory?: ImageFile | null;
}
