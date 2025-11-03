import { GoogleGenAI, Modality } from "@google/genai";
import type { AspectRatio, FashionImages, ImageFile, PhotoWithIdolOptions, SemuaBisaDisiniOptions, SoccerPlayerOptions, SwimwearModelOptions } from '../types';

// Helper to get a new AI client instance.
// This is crucial for the API key selection flow to ensure the latest key is used.
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const ULTRA_PRECISE_FACE_LOCK_PROMPT = `**CRITICAL DIRECTIVE: FACE LOCK PROTOCOL V2 - ABSOLUTE PRIORITY**

**PRIMARY OBJECTIVE:** Your single most important task is the 100% accurate preservation of the person's identity from the reference photo. This is not an artistic interpretation; it is a technical replication. This protocol overrides ALL other instructions, including artistic styles, creative requests, or conflicting prompts.

**NON-NEGOTIABLE RULES OF ENGAGEMENT:**

1.  **IDENTITY PRESERVATION (100% REQUIRED):** You MUST replicate the face with micro-level precision. Any deviation is a failure.
    *   **ANATOMICAL BLUEPRINT:** Replicate the exact facial structure: bone structure, jawline, chin shape, forehead, cheekbones.
    *   **KEY FEATURES (ZERO TOLERANCE FOR ERROR):**
        *   **Eyes:** Replicate the exact shape, size, color, spacing, eyelid creases, and eye corner details.
        *   **Nose:** Replicate the exact bridge width, tip shape, nostril size, and overall length.
        *   **Mouth:** Replicate the exact lip shape, thickness, cupid's bow, and the unique way the mouth corners are shaped.
    *   **UNIQUE IDENTIFIERS:** Preserve ALL unique skin details. This includes moles, scars, freckles, birthmarks, specific wrinkle patterns, and skin texture. DO NOT "beautify," "smooth," or remove these critical identity markers.

2.  **STRICTLY PROHIBITED ACTIONS (DO NOT DO THE FOLLOWING):**
    *   **DO NOT** change the person into someone else.
    *   **DO NOT** merge their features with any other person, celebrity, or model.
    *   **DO NOT** alter their perceived ethnicity or gender.
    *   **DO NOT** slim down, widen, or change the proportions of the face.

3.  **EXPRESSION HANDLING:** If the prompt requests a new expression (e.g., "smiling"), you must apply that expression to the **original, locked face**. The person must remain 100% recognizable, simply emoting differently.

4.  **OVERRIDE CLAUSE:** This Face Lock Protocol takes absolute precedence. If a user's prompt asks for "anime style," that style applies to hair, clothing, and background ONLY. The face MUST remain 100% photorealistic and identical to the source photo. The face is the anchor of realism and cannot be changed.

**FAILURE TO ADHERE TO THIS PROTOCOL CONSTITUTES A TOTAL TASK FAILURE. NO EXCEPTIONS.**`;

// Helper function to handle potential API errors, especially rate limiting.
const handleGeminiError = (error: unknown): string => {
    if (error instanceof Error) {
        // Check for specific error status or message for rate limiting
        if (error.message.includes('RESOURCE_EXHAUSTED') || error.message.includes('429')) {
            return "Batas penggunaan API telah tercapai. Ini adalah batasan dari paket gratis. Silakan coba lagi nanti.";
        }
         if (error.message.includes('billed users')) {
            return "Model API yang diminta hanya tersedia untuk akun dengan penagihan aktif. Silakan periksa pengaturan akun Google Cloud Anda.";
        }
        return error.message;
    }
    return 'Terjadi kesalahan yang tidak diketahui.';
};


// Helper function to convert ImageFile to Gemini Part
const imageFileToPart = (image: ImageFile) => {
    // The Gemini API expects only the Base64 data, not the data URL prefix.
    const base64Data = image.data.startsWith('data:') 
        ? image.data.split(',')[1] 
        : image.data;
    
    return {
        inlineData: {
            data: base64Data,
            mimeType: image.mimeType,
        },
    };
};

// Helper function to generate a more specific error message from a Gemini response.
const getErrorFromResponse = (response: any, defaultMessage: string): string => {
    if (response.candidates && response.candidates[0] && response.candidates[0].finishReason) {
        const reason = response.candidates[0].finishReason;
        if (reason === 'SAFETY') {
            return 'Pembuatan gambar diblokir karena alasan keamanan. Coba ubah prompt Anda menjadi lebih umum atau artistik.';
        }
        if (reason === 'RECITATION') {
             return 'Pembuatan gambar diblokir karena kebijakan sitasi. Coba prompt yang berbeda.';
        }
        return `Pembuatan gambar gagal dengan alasan: ${reason}.`;
    }
    return defaultMessage;
};


/**
 * Generates an image from a text prompt using a more accessible model.
 */
export const generateImageFromText = async ({ prompt, aspectRatio }: { prompt: string; aspectRatio: AspectRatio['value'] }): Promise<ImageFile> => {
    try {
        const ai = getAiClient();
        // Aspect ratio needs to be part of the prompt for this model.
        const fullPrompt = `${prompt}. The image must be ultra-high quality, 8k resolution, professional photography, with sharp focus and incredible detail. The image must have a ${aspectRatio} aspect ratio.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { text: fullPrompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const candidate of response.candidates || []) {
            if (candidate.content && candidate.content.parts) {
                for (const part of candidate.content.parts) {
                    if (part.inlineData) {
                        const base64ImageBytes: string = part.inlineData.data;
                        const mimeType = part.inlineData.mimeType || 'image/jpeg'; // Fallback MIME type
                        return {
                            data: `data:${mimeType};base64,${base64ImageBytes}`,
                            mimeType: mimeType,
                        };
                    }
                }
            }
        }
        throw new Error(getErrorFromResponse(response, 'Pembuatan gambar gagal: tidak ada gambar yang dikembalikan dari model.'));
    } catch (error) {
        throw new Error(handleGeminiError(error));
    }
};


/**
 * Edits an existing image based on a text prompt.
 */
export const editImage = async ({ image, prompt, useFaceLock, useBackgroundLock }: { image: ImageFile; prompt: string; useFaceLock: boolean; useBackgroundLock: boolean; }): Promise<ImageFile> => {
    try {
        const ai = getAiClient();
        const instructions = [];

        if (useFaceLock) {
            instructions.push(ULTRA_PRECISE_FACE_LOCK_PROMPT);
        }

        if (useBackgroundLock) {
            instructions.push(`**BACKGROUND LOCK PROTOCOL: ACTIVE**
**RULE:** The background of the image must be remain exactly the same. Do not alter the environment, objects, lighting, or colors of the background in any way. All changes should only apply to the subject(s).`);
        }
        
        const fullPrompt = instructions.length > 0
            ? `${instructions.join('\n\n')}\n\n**USER'S EDIT REQUEST:**\n---\n${prompt}\n\n**QUALITY REQUIREMENT:** The final image must be ultra-high quality, 8k resolution, with sharp focus and professional-grade detail.`
            : `${prompt}\n\n**QUALITY REQUIREMENT:** The final image must be ultra-high quality, 8k resolution, with sharp focus and professional-grade detail.`;
            
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    imageFileToPart(image),
                    { text: fullPrompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const candidate of response.candidates || []) {
            if (candidate.content && candidate.content.parts) {
                for (const part of candidate.content.parts) {
                    if (part.inlineData) {
                        const base64ImageBytes: string = part.inlineData.data;
                        return {
                            data: `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`,
                            mimeType: part.inlineData.mimeType,
                        };
                    }
                }
            }
        }

        throw new Error(getErrorFromResponse(response, 'Pengeditan gambar gagal: tidak ada gambar yang dikembalikan dari model.'));
    } catch (error) {
         throw new Error(handleGeminiError(error));
    }
};

/**
 * Flexible image generation for the "Manual" tab.
 * Handles no image, single image, or multiple images.
 */
export const generateFromManual = async ({ prompt, images, aspectRatio, useFaceLock }: { prompt: string; images: ImageFile[] | null; aspectRatio: AspectRatio['value']; useFaceLock: boolean; }): Promise<ImageFile> => {
    try {
        const hasImages = images && images.length > 0;

        if (!hasImages) {
            // Case 1: No images, just text-to-image
            return await generateImageFromText({ prompt, aspectRatio });
        }
        
        if (images.length === 1) {
            // Case 2: One image, treat as an edit but with transformation instruction
            const transformPrompt = `**IMPORTANT:** This is not a simple edit. You must **completely transform** the subject(s) in the provided image according to the new description. Do not just return the original photo. The user's new prompt is: "${prompt}"`;
            return await editImage({ image: images[0], prompt: transformPrompt, useFaceLock, useBackgroundLock: false });
        }

        // Case 3: Multiple images, combine them
        const ai = getAiClient();
        const parts: any[] = images.map(imageFileToPart);
        let combinedPrompt = `**TASK:** Create a single, cohesive, hyper-realistic image by creatively combining the subjects and elements from all the provided images, guided by the following description.
- **SCENE DESCRIPTION:** ${prompt}
- **ASPECT RATIO:** The final image must have a ${aspectRatio} aspect ratio.
- **QUALITY:** The final image must be ultra-high quality, 8k resolution, with professional lighting, sharp focus, and incredible detail.`;
        
        if (useFaceLock) {
            combinedPrompt += `\n\n**FACE LOCK PROTOCOL:** The faces of the people in ALL provided photos MUST be preserved with 100% accuracy. Follow this protocol for every face:\n${ULTRA_PRECISE_FACE_LOCK_PROMPT}`;
        }
        
        parts.push({ text: combinedPrompt });
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: parts },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const candidate of response.candidates || []) {
            if (candidate.content && candidate.content.parts) {
                for (const part of candidate.content.parts) {
                    if (part.inlineData) {
                        const base64ImageBytes: string = part.inlineData.data;
                        return {
                            data: `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`,
                            mimeType: part.inlineData.mimeType,
                        };
                    }
                }
            }
        }
        throw new Error(getErrorFromResponse(response, 'Gagal menggabungkan gambar.'));

    } catch (error) {
        throw new Error(handleGeminiError(error));
    }
};


/**
 * Swaps the face in a base image with a face from a new image.
 */
export const swapFace = async ({ baseImage, newFaceImage }: { baseImage: ImageFile; newFaceImage: ImageFile; }): Promise<ImageFile> => {
    try {
        const ai = getAiClient();
        const prompt = `**TASK: Perform a precise and seamless face swap.**

**INPUTS:**
1.  **BASE IMAGE:** The main photograph containing the body, pose, clothing, hair, and background to be kept.
2.  **NEW FACE IMAGE:** A photograph containing the new face to be applied.

**CRITICAL INSTRUCTIONS:**
1.  **Targeted Replacement:** Identify the primary person in the 'BASE IMAGE'. Replace ONLY their face with the face from the 'NEW FACE IMAGE'.
2.  **Face Lock on New Face:** The new face must be a 100% perfect replication of the face from the 'NEW FACE IMAGE'. The following protocol applies to the **new face**:
${ULTRA_PRECISE_FACE_LOCK_PROMPT}
3.  **Absolute Preservation of Base Image (NON-NEGOTIABLE):** You MUST preserve everything else from the 'BASE IMAGE' with 100% accuracy. This includes:
    - The **hairstyle** (shape, color, length).
    - The body shape and pose.
    - The clothing and accessories.
    - The background and environment.
    - The lighting, shadows, and color grading of the original scene.
4.  **Seamless Integration:** The new face must be blended perfectly onto the head of the person in the 'BASE IMAGE'. The skin tone, lighting, and angle must match the original scene flawlessly.
5.  **Ignore New Face's Context:** Discard all information from the 'NEW FACE IMAGE' except for the core facial features. Do not use its hair, background, or lighting.

The final output must be the 'BASE IMAGE' but with the new face seamlessly and realistically integrated. The image quality must be professional, 8k resolution, and highly detailed.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    imageFileToPart(baseImage),
                    imageFileToPart(newFaceImage),
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const candidate of response.candidates || []) {
            if (candidate.content && candidate.content.parts) {
                for (const part of candidate.content.parts) {
                    if (part.inlineData) {
                        const base64ImageBytes: string = part.inlineData.data;
                        return {
                            data: `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`,
                            mimeType: part.inlineData.mimeType,
                        };
                    }
                }
            }
        }

        throw new Error(getErrorFromResponse(response, 'Face swap gagal: tidak ada gambar yang dikembalikan dari model.'));
    } catch (error) {
        throw new Error(handleGeminiError(error));
    }
};

/**
 * Generates an image by reposing a model from a photo into the pose of a sketch or another photo.
 */
export const generateImageFromPose = async ({ poseInput, modelImage, isPoseFromPhoto }: { poseInput: ImageFile; modelImage: ImageFile; isPoseFromPhoto: boolean; }): Promise<ImageFile> => {
    try {
        const ai = getAiClient();
        const promptForSketch = `**TASK: Create a hyper-realistic photograph by reposing the person from the 'MODEL PHOTO' into the exact pose from the 'POSE SKETCH'.**

**INPUTS:**
1.  **MODEL PHOTO:** A photograph of the person to be used. This is the source for the person's identity, face, clothing, and accessories.
2.  **POSE SKETCH:** A simple line drawing indicating the desired new pose.

**CRITICAL INSTRUCTIONS:**
1.  **Adhere to the Pose:** The person in the final image MUST perfectly match the pose shown in the 'POSE SKETCH'. The positioning of limbs, torso, and head must be identical to the sketch.
2.  **Clothing & Accessory Lock:** The person must be wearing the exact same clothes and any visible accessories from the 'MODEL PHOTO'. Do not change the outfit.
3.  **Face Lock:**
${ULTRA_PRECISE_FACE_LOCK_PROMPT}
4.  **Ignore Sketch Style:** The line drawing is for pose reference ONLY. Do not replicate the sketchy, black-and-white style of the drawing.
5.  **Scene & Quality:** Place the re-posed person against a minimal, neutral studio background. The final image must be 8k, with sharp focus and professional, flattering lighting.`;

        const promptForPhoto = `**TASK: Create a hyper-realistic photograph by reposing the person from the 'MODEL PHOTO' into the exact pose from the 'POSE REFERENCE PHOTO'.**

**INPUTS:**
1.  **MODEL PHOTO:** A photograph of the person to be used. This is the source for the person's identity, face, clothing, and accessories.
2.  **POSE REFERENCE PHOTO:** A photograph of another person in the desired new pose.

**CRITICAL INSTRUCTIONS:**
1.  **Adhere to the Pose:** The person in the final image MUST perfectly match the pose of the person in the 'POSE REFERENCE PHOTO'. The positioning of limbs, torso, and head must be identical.
2.  **Clothing & Accessory Lock:** The person must be wearing the exact same clothes and any visible accessories from the 'MODEL PHOTO'. Do not change the outfit.
3.  **Ignore Pose Reference Identity:** The identity, face, and clothing of the person in the 'POSE REFERENCE PHOTO' must be completely ignored. That photo is for POSE information ONLY.
4.  **Face Lock:**
${ULTRA_PRECISE_FACE_LOCK_PROMPT}
5.  **Scene & Quality:** Place the re-posed person against a minimal, neutral studio background. The final image must be 8k, with sharp focus and professional, flattering lighting.`;
        
        const prompt = isPoseFromPhoto ? promptForPhoto : promptForSketch;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    imageFileToPart(modelImage), // First image is the model
                    imageFileToPart(poseInput),   // Second image is the pose sketch/photo
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const candidate of response.candidates || []) {
            if (candidate.content && candidate.content.parts) {
                for (const part of candidate.content.parts) {
                    if (part.inlineData) {
                        const base64ImageBytes: string = part.inlineData.data;
                        return {
                            data: `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`,
                            mimeType: part.inlineData.mimeType,
                        };
                    }
                }
            }
        }

        throw new Error(getErrorFromResponse(response, 'Pembuatan gambar dari pose gagal: tidak ada gambar yang dikembalikan dari model.'));
    } catch (error) {
        throw new Error(handleGeminiError(error));
    }
};

/**
 * Translates text to a specified target language.
 */
export const translateText = async (text: string, targetLanguage: 'English' | 'Indonesian'): Promise<string> => {
    if (!text || !text.trim()) {
        return '';
    }
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Translate the following text to ${targetLanguage}. Return only the translation, without any preamble, labels, or explanation.\n\nText: "${text}"`,
            config: {
                // Disable thinking for faster, direct translations.
                thinkingConfig: { thinkingBudget: 0 },
            }
        });
        return (response.text || '').trim();
    } catch (error) {
        console.error(`Translation to ${targetLanguage} failed:`, error);
        throw new Error(handleGeminiError(error));
    }
};

/**
 * Attempts to remove watermarks from an image.
 */
export const removeWatermark = async (image: ImageFile): Promise<ImageFile> => {
    try {
        const ai = getAiClient();
        const prompt = "Please meticulously analyze the provided image to identify and completely remove any watermarks, logos, or overlaid text. The goal is a perfectly clean image with the watermarked areas seamlessly inpainted to match the surrounding content and textures. Preserve the original image quality and details. Do not alter any other part of the image.";

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    imageFileToPart(image),
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const candidate of response.candidates || []) {
            if (candidate.content && candidate.content.parts) {
                for (const part of candidate.content.parts) {
                    if (part.inlineData) {
                        const base64ImageBytes: string = part.inlineData.data;
                        return {
                            data: `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`,
                            mimeType: part.inlineData.mimeType,
                        };
                    }
                }
            }
        }
        
        console.warn("Remove watermark did not return an image, returning original.");
        return image;
    } catch (error) {
        throw new Error(handleGeminiError(error));
    }
};

/**
 * Identifies fashion items in an image and provides a detailed analysis and a prompt summary.
 */
export const identifyFashion = async (images: FashionImages): Promise<string> => {
    try {
        const ai = getAiClient();
        if (images.fullDresscode) {
            const prompt = `**TASK:** Analyze the clothing and accessories worn by the person in the image with extreme detail. Then, create a concise, descriptive prompt summary.

**FORMATTING RULE:** You MUST separate the two sections with the exact string '---PROMPT SUMMARY---'.

**SECTION 1: DETAILED ANALYSIS**
Break down every single visible fashion item. For each item, describe:
- **Type:** (e.g., t-shirt, blazer, skinny jeans, A-line skirt, handbag, sneakers)
- **Color:** Be specific (e.g., navy blue, crimson red, off-white, charcoal gray).
- **Material/Texture:** (e.g., denim, silk, leather, chunky knit, sheer chiffon)
- **Fit/Cut:** (e.g., oversized, slim-fit, high-waisted, cropped, wide-leg)
- **Pattern/Details:** (e.g., pinstriped, floral print, embroidered logo, ripped details, gold hardware)
- **Style/Vibe:** (e.g., casual, formal, bohemian, streetwear, minimalist, vintage)

**SECTION 2: PROMPT SUMMARY**
Synthesize the detailed analysis into a single, cohesive, comma-separated string suitable for an AI image generator prompt. Start with the most significant item.
Example: "a minimalist off-white oversized blazer, a black silk camisole, high-waisted light-wash denim jeans, a pair of white leather sneakers, a gold chain necklace".`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: {
                    parts: [
                        imageFileToPart(images.fullDresscode),
                        { text: prompt },
                    ]
                },
            });
            return response.text || '';
        }

        const imageParts: { inlineData: { data: string; mimeType: string; } }[] = [];
        const promptSections: string[] = ["**TASK:** Analyze the provided fashion items individually. Then, create a cohesive outfit description and a prompt summary based on combining them."];
        
        if (images.top) {
            promptSections.push("\n**Item 1: Atasan/Baju**");
            imageParts.push(imageFileToPart(images.top));
        }
        if (images.pants) {
            promptSections.push("\n**Item 2: Celana**");
            imageParts.push(imageFileToPart(images.pants));
        }
        if (images.shoes) {
            promptSections.push("\n**Item 3: Sepatu**");
            imageParts.push(imageFileToPart(images.shoes));
        }
        if (images.accessory) {
            promptSections.push("\n**Item 4: Aksesori**");
            imageParts.push(imageFileToPart(images.accessory));
        }
        
        promptSections.push(`
**FORMATTING RULE:** You MUST separate the two sections with the exact string '---PROMPT SUMMARY---'.

**SECTION 1: DETAILED ANALYSIS**
For each item provided, give a detailed breakdown (Type, Color, Material, etc.). After analyzing all items, describe how they could be combined into a single, stylish outfit.

**SECTION 2: PROMPT SUMMARY**
Synthesize the analysis of all items into a single, cohesive, comma-separated string suitable for an AI image generator prompt. This summary should describe a person wearing the complete, combined outfit.`);

        const parts = [...imageParts, { text: promptSections.join('\n') }];

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts },
        });

        return response.text || '';

    } catch (error) {
         throw new Error(handleGeminiError(error));
    }
};

/**
 * Analyzes the hairstyle in an image and provides a detailed analysis and a prompt summary.
 */
export const analyzeHairstyle = async (image: ImageFile): Promise<string> => {
    try {
        const ai = getAiClient();
        const prompt = `**TASK:** Analyze the hairstyle of the person in the image with extreme detail. Then, provide thoughtful suggestions for alternative hairstyles and colors. Finally, create a concise prompt summary to recreate the original hairstyle.

**FORMATTING RULE:** You MUST separate the two main sections with the exact string '---PROMPT SUMMARY---'.

**SECTION 1: DETAILED ANALYSIS & SUGGESTIONS**
1.  **Current Hairstyle Analysis:**
    *   **Style:** (e.g., Bob cut, Pixie, Long layers, Undercut, Curly shag).
    *   **Length:** (e.g., Chin-length, Shoulder-length, Very long).
    *   **Color:** Be specific (e.g., Jet black, Ash blonde with dark roots, Chestnut brown, Copper red).
    *   **Texture:** (e.g., Straight, Wavy, Curly, Coily).
    *   **Health/Condition:** (e.g., Looks healthy and shiny, appears dry, has split ends).
2.  **Face Shape Inference:** Briefly infer the person's likely face shape (e.g., Oval, Round, Square, Heart).
3.  **Hairstyle Suggestions:** Based on the inferred face shape, suggest 3-4 different hairstyles that would be flattering. For each suggestion, explain *why* it would work (e.g., "A long bob would soften a square jawline," "Side-swept bangs can balance a heart-shaped face").
4.  **Hair Color Suggestions:** Suggest 2-3 different hair colors that would complement the person's apparent skin tone.

**SECTION 2: PROMPT SUMMARY**
Synthesize the analysis of the *original* hairstyle into a single, cohesive, comma-separated string suitable for an AI image generator prompt.
Example: "a woman with shoulder-length, wavy, chestnut brown hair, styled in a side part, looking healthy and shiny".`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    imageFileToPart(image),
                    { text: prompt },
                ]
            },
        });
        return response.text || '';

    } catch (error) {
         throw new Error(handleGeminiError(error));
    }
};

/**
 * Inserts a person's face into a movie scene.
 */
export const insertIntoScene = async ({ faceImage, sceneImage }: { faceImage: ImageFile; sceneImage: ImageFile; }): Promise<ImageFile> => {
    try {
        const ai = getAiClient();
        const prompt = `**TASK: Hyper-Realistically Insert a New Person into a Movie Scene.**

You are provided with two images. The first is the base movie scene, and the second is the photo of the face to be inserted.

**CRITICAL INSTRUCTIONS:**
1.  **Identify Target:** Intelligently identify a primary character in the 'movie scene' image to replace.
2.  **Seamless Face Integration:** Replace the character's face with the face from the 'face photo'. The integration must be FLAWLESS.
    -   **Lighting & Color:** The lighting, shadows, and color grading on the new face MUST perfectly match the movie scene's atmosphere.
    -   **Perspective & Angle:** The new face must be placed at the correct angle and perspective to match the original character's head position.
    -   **Film Grain & Texture:** The new face must have the same film grain, texture, and quality as the rest of the scene.
3.  **Preserve Scene Integrity:** Do NOT change the background, other characters, or the overall composition of the movie scene.
4.  **Preserve Body & Clothing:** Retain the original body, pose, and clothing of the character being replaced. You are only swapping the face.
5.  **Face Lock on New Face:**
    ${ULTRA_PRECISE_FACE_LOCK_PROMPT}

The final output should look like a genuine, unaltered frame from the movie, rendered in stunning 8k resolution with sharp focus and high fidelity details.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    imageFileToPart(sceneImage),
                    imageFileToPart(faceImage),
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const candidate of response.candidates || []) {
            if (candidate.content && candidate.content.parts) {
                for (const part of candidate.content.parts) {
                    if (part.inlineData) {
                        const base64ImageBytes: string = part.inlineData.data;
                        return {
                            data: `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`,
                            mimeType: part.inlineData.mimeType,
                        };
                    }
                }
            }
        }

        throw new Error(getErrorFromResponse(response, 'Gagal memasukkan ke scene: tidak ada gambar yang dikembalikan dari model.'));
    } catch (error) {
        throw new Error(handleGeminiError(error));
    }
};

/**
 * Creates a photo of a user with an idol.
 */
export const createPhotoWithIdol = async ({ userImage, idolImage, useIdolFaceLock, options }: { userImage: ImageFile; idolImage: ImageFile; useIdolFaceLock: boolean; options: PhotoWithIdolOptions; }): Promise<ImageFile> => {
    try {
        const ai = getAiClient();
        const prompt = options.manualPrompt.trim()
            ? options.manualPrompt
            : `A hyper-realistic and sharply detailed 8k photo.
- Pose: ${options.poseTemplate}.
- Camera Shot: a ${options.shotStyleTemplate}.
- Lighting: ${options.lightStyleTemplate}.`;
        
        const faceLockInstructions = [
            "**USER FACE LOCK:**",
            ULTRA_PRECISE_FACE_LOCK_PROMPT.replace(/the person/g, "person A (the user)")
        ];

        if (useIdolFaceLock) {
            faceLockInstructions.push(
                "**IDOL FACE LOCK:**",
                ULTRA_PRECISE_FACE_LOCK_PROMPT.replace(/the person/g, "person B (the idol)")
            );
        }

        const fullPrompt = `${faceLockInstructions.join('\n\n')}\n\n**USER REQUEST:**\n${prompt}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    imageFileToPart(userImage),
                    imageFileToPart(idolImage),
                    { text: fullPrompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const candidate of response.candidates || []) {
            if (candidate.content && candidate.content.parts) {
                for (const part of candidate.content.parts) {
                    if (part.inlineData) {
                        const base64ImageBytes: string = part.inlineData.data;
                        return {
                            data: `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`,
                            mimeType: part.inlineData.mimeType,
                        };
                    }
                }
            }
        }

        throw new Error(getErrorFromResponse(response, 'Gagal membuat foto bersama idola.'));
    } catch (error) {
        throw new Error(handleGeminiError(error));
    }
};

/**
 * Combines multiple images based on a prompt.
 */
export const combineImages = async (options: SemuaBisaDisiniOptions): Promise<ImageFile> => {
    try {
        const ai = getAiClient();
        const parts: any[] = options.images
            .filter(img => img !== null)
            .map(img => imageFileToPart(img as ImageFile));

        let faceLockPrompt = "";
        if (options.faceLockIndices.length > 0) {
            const lockedIndices = options.faceLockIndices.map(i => `Foto ${i + 1}`).join(', ');
            faceLockPrompt = `**FACE LOCK PROTOCOL:** The faces of the people in the following photos MUST be preserved with 100% accuracy: ${lockedIndices}.\n${ULTRA_PRECISE_FACE_LOCK_PROMPT}\n\n`;
        }

        const fullPrompt = `${faceLockPrompt}**TASK:** Create a single, cohesive, hyper-realistic image by combining the subjects from the ${options.numberOfPhotos} uploaded photos based on the following description.
- **SCENE DESCRIPTION:** ${options.prompt}
- **SHOT STYLE:** ${options.shotStyle}
- **LIGHTING:** ${options.lightStyle}
- **ASPECT RATIO:** ${options.aspectRatio}

The final image must be 8k resolution, hyper-realistic, photorealistic, and seamlessly blended with professional lighting and sharp focus.`;

        parts.push({ text: fullPrompt });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: parts },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const candidate of response.candidates || []) {
            if (candidate.content && candidate.content.parts) {
                for (const part of candidate.content.parts) {
                    if (part.inlineData) {
                        const base64ImageBytes: string = part.inlineData.data;
                        return {
                            data: `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`,
                            mimeType: part.inlineData.mimeType,
                        };
                    }
                }
            }
        }
        throw new Error(getErrorFromResponse(response, 'Gagal menggabungkan gambar.'));
    } catch (error) {
        throw new Error(handleGeminiError(error));
    }
};

/**
 * Generates a swimwear model image from a clothing photo.
 */
export const generateSwimwearModel = async ({ faceImage, clothingImage, options }: { faceImage: ImageFile; clothingImage: ImageFile; options: SwimwearModelOptions }): Promise<ImageFile> => {
    try {
        const ai = getAiClient();
        const prompt = `**TASK:** Create a professional, elegant, and tasteful full-body photograph of a model wearing the swimwear from the 'PRODUCT IMAGE'. The model's face MUST be identical to the face in the 'FACE PHOTO'.

**INPUTS:**
1.  **FACE PHOTO:** The photo containing the face to be used for the model.
2.  **PRODUCT IMAGE:** The photo of the swimwear the model should wear.

${ULTRA_PRECISE_FACE_LOCK_PROMPT}

**INSTRUCTIONS:**
1.  **Face:** Use the face from the 'FACE PHOTO' and apply the Face Lock Protocol with 100% accuracy.
2.  **Swimwear:** Dress the model in the swimwear shown in the 'PRODUCT IMAGE'.
3.  **Model & Scene Specifications:**
    - The final output should show the model wearing a **${options.swimwearType}** style bikini, matching the product image.
    - **Body Type:** ${options.bodyType}
    - **Hair Color:** ${options.hairColor}
    - **Bust Size:** ${options.bustSize}
    - **Hip Size:** ${options.hipSize}
    - **Pose:** The model should be in the following pose: ${options.pose}.
    - **Setting:** The background should be: ${options.setting}.
4.  **Quality:** The final image must be 8k, hyper-realistic, with sharp focus, and bright, natural sunlight that creates a beautiful, sun-kissed look.

**SAFETY & TASTEFULNESS PROTOCOL (NON-NEGOTIABLE):**
- **NO NUDITY OR SUGGESTIVE CONTENT:** The image MUST NOT contain nudity, explicit content, or overly suggestive poses. The goal is professional product photography that is stylish and aspirational, not eroticism.
- **FOCUS ON THE PRODUCT & VIBE:** The primary focus should be on showcasing the swimwear as a fashion item and capturing a fun, sunny, vacation vibe.
- **ELEGANCE & PROFESSIONALISM:** The entire composition, including the model's expression and pose, must be elegant, confident, and meet professional catalog standards.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { 
                parts: [
                    imageFileToPart(faceImage),
                    imageFileToPart(clothingImage), 
                    { text: prompt }
                ] 
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const candidate of response.candidates || []) {
            if (candidate.content && candidate.content.parts) {
                for (const part of candidate.content.parts) {
                    if (part.inlineData) {
                        const base64ImageBytes: string = part.inlineData.data;
                        return {
                            data: `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`,
                            mimeType: part.inlineData.mimeType,
                        };
                    }
                }
            }
        }
        throw new Error(getErrorFromResponse(response, 'Gagal membuat model pakaian renang.'));
    } catch (error) {
        throw new Error(handleGeminiError(error));
    }
};

/**
 * Generates an artistic image containing a functional QR code.
 */
export const generateArtisticQRCode = async ({ url, artPrompt, aspectRatio }: { url: string; artPrompt: string; aspectRatio: AspectRatio['value'] }): Promise<ImageFile> => {
    try {
        const ai = getAiClient();
        const fullPrompt = `Create a visually stunning and artistic image based on the theme: "${artPrompt}".

**CRITICAL REQUIREMENT:**
You MUST embed a functional, scannable QR code within the artwork.
- The QR code must encode this exact data: **${url}**
- The QR code should be a central and integral part of the art, not just placed on top. It needs to be creatively blended into the scene's elements, textures, and composition.
- The QR code must remain clear and high-contrast enough to be easily scannable by a standard smartphone camera.

The final image must have a ${aspectRatio} aspect ratio. The style should be beautiful and highly detailed, 8k, photorealistic.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { text: fullPrompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const candidate of response.candidates || []) {
            if (candidate.content && candidate.content.parts) {
                for (const part of candidate.content.parts) {
                    if (part.inlineData) {
                        const base64ImageBytes: string = part.inlineData.data;
                        const mimeType = part.inlineData.mimeType || 'image/jpeg';
                        return {
                            data: `data:${mimeType};base64,${base64ImageBytes}`,
                            mimeType: mimeType,
                        };
                    }
                }
            }
        }
        throw new Error(getErrorFromResponse(response, 'Pembuatan QR Code gagal: tidak ada gambar yang dikembalikan dari model.'));
    } catch (error) {
        throw new Error(handleGeminiError(error));
    }
};

/**
 * Changes the outfit of a person in an image.
 */
export const changeOutfit = async ({ modelImage, clothingImage }: { modelImage: ImageFile; clothingImage: ImageFile; }): Promise<ImageFile> => {
    try {
        const ai = getAiClient();
        const prompt = `**TASK: Perform a complete and hyper-realistic outfit swap.**

**INPUTS:**
1.  **MODEL PHOTO:** Contains the person whose outfit will be changed. This is the source for their face, body, pose, hair, and the background scene.
2.  **CLOTHING PHOTO:** Contains the new, complete outfit to be applied to the person.

**CRITICAL INSTRUCTIONS (ABSOLUTE PRIORITY):**
1.  **APPLY NEW OUTFIT:** Identify the full outfit in the 'CLOTHING PHOTO' and meticulously dress the person from the 'MODEL PHOTO' in it. The fit should be natural and realistic for their body type.
2.  **PRESERVE THE PERSON (100% REQUIRED):** You MUST keep the person from the 'MODEL PHOTO' completely unchanged, except for their clothes.
    -   **FACE LOCK PROTOCOL:** The face must be an exact, 100% replication.
        ${ULTRA_PRECISE_FACE_LOCK_PROMPT}
    -   **BODY & POSE LOCK:** Do NOT change their body shape, proportions, height, or their original pose.
    -   **HAIR LOCK:** Do NOT change their hairstyle or color.
3.  **PRESERVE THE SCENE:** The background, lighting, and shadows from the original 'MODEL PHOTO' MUST be maintained perfectly. The new clothing must be lit to match the scene.
4.  **IGNORE CLOTHING MODEL:** Completely disregard the person, mannequin, or hanger in the 'CLOTHING PHOTO'. Your task is to extract ONLY the clothing items themselves.
5.  **SEAMLESS INTEGRATION:** The final image must be a single, cohesive, 8k hyper-realistic photograph. The new outfit must look completely natural on the person, with no visual artifacts or signs of editing.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    imageFileToPart(modelImage),
                    imageFileToPart(clothingImage),
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const candidate of response.candidates || []) {
            if (candidate.content && candidate.content.parts) {
                for (const part of candidate.content.parts) {
                    if (part.inlineData) {
                        const base64ImageBytes: string = part.inlineData.data;
                        return {
                            data: `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`,
                            mimeType: part.inlineData.mimeType,
                        };
                    }
                }
            }
        }

        throw new Error(getErrorFromResponse(response, 'Gagal mengganti baju: tidak ada gambar yang dikembalikan dari model.'));
    } catch (error) {
        throw new Error(handleGeminiError(error));
    }
};

/**
 * Creates a family photo.
 */
export const createFamilyPhoto = async ({ faces, outfitColor }: { faces: ImageFile[]; outfitColor: string }): Promise<ImageFile> => {
    try {
        const ai = getAiClient();
        const prompt = `**TASK:** Create a single, joyful family portrait featuring ${faces.length} people, based on the provided face photos.

**CRITICAL INSTRUCTIONS:**
1.  **Face Lock:** Every person in the final photo MUST be a perfect likeness from their respective source photo.
    ${ULTRA_PRECISE_FACE_LOCK_PROMPT}
2.  **Scene & Pose:**
    - The family is posing together happily, looking down towards the camera.
    - The shot is taken from a low angle, looking up towards the sky.
    - Their heads are close together, forming a circle.
    - The background is a beautiful bright blue sky with soft, white clouds.
3.  **Outfit:** Everyone is wearing matching outfits in the color: **${outfitColor}**.
4.  **Quality:** The final image must be hyper-realistic, 8k, with sharp focus and bright, natural lighting.`;
        
        const parts = [
            ...faces.map(imageFileToPart),
            { text: prompt }
        ];
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const candidate of response.candidates || []) {
            if (candidate.content && candidate.content.parts) {
                for (const part of candidate.content.parts) {
                    if (part.inlineData) {
                        const base64ImageBytes: string = part.inlineData.data;
                        return {
                            data: `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`,
                            mimeType: part.inlineData.mimeType,
                        };
                    }
                }
            }
        }
        throw new Error(getErrorFromResponse(response, 'Gagal membuat foto keluarga.'));
    } catch (error) {
        throw new Error(handleGeminiError(error));
    }
};

/**
 * Creates a soccer player image.
 */
export const createSoccerPlayer = async ({ faceImage, jerseyImage, options }: { faceImage: ImageFile; jerseyImage: ImageFile; options: SoccerPlayerOptions }): Promise<ImageFile> => {
    try {
        const ai = getAiClient();
        const prompt = `**TASK:** Create a dynamic, hyper-realistic photo of a professional soccer player.

**INPUTS:**
1.  **FACE PHOTO:** Contains the face of the player.
2.  **JERSEY PHOTO:** Shows the team jersey to be replicated.

**CRITICAL INSTRUCTIONS:**
1.  **Face Lock:** The player's face MUST be a perfect likeness from the 'FACE PHOTO'.
    ${ULTRA_PRECISE_FACE_LOCK_PROMPT}
2.  **Jersey Replication:** The player must be wearing a full kit (jersey, shorts, socks) that perfectly matches the design and colors from the 'JERSEY PHOTO'. The jersey must have the name "${options.jerseyName}" and the number "${options.jerseyNumber}" on the back.
3.  **Scene:** The player is on a pristine, professional soccer pitch inside a large stadium.
4.  **Pose:** The player's pose is: ${options.pose}.
5.  **Quality:** 8k, hyper-realistic, cinematic lighting, sharp focus, dynamic action shot.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imageFileToPart(faceImage), imageFileToPart(jerseyImage), { text: prompt }] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const candidate of response.candidates || []) {
            if (candidate.content && candidate.content.parts) {
                for (const part of candidate.content.parts) {
                    if (part.inlineData) {
                        const base64ImageBytes: string = part.inlineData.data;
                        return {
                            data: `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`,
                            mimeType: part.inlineData.mimeType,
                        };
                    }
                }
            }
        }
        throw new Error(getErrorFromResponse(response, 'Gagal membuat pemain sepak bola.'));
    } catch (error) {
        throw new Error(handleGeminiError(error));
    }
};

/**
 * Creates a family photo in Mecca.
 */
export const createMeccaFamilyPhoto = async ({ faces }: { faces: (ImageFile | null)[] }): Promise<ImageFile> => {
    const validFaces = faces.filter(f => f !== null) as ImageFile[];
    try {
        const ai = getAiClient();
        const prompt = `**TASK:** Create a beautiful, respectful family portrait of ${validFaces.length} people in Mecca.

**CRITICAL INSTRUCTIONS:**
1.  **Face Lock:** Every person's face MUST perfectly match the corresponding uploaded photo.
    ${ULTRA_PRECISE_FACE_LOCK_PROMPT}
2.  **Scene:** The family is standing together in front of the Kaaba in Mecca. The atmosphere is peaceful and serene, with warm morning light.
3.  **Attire:** All individuals should be dressed in appropriate Ihram clothing.
4.  **Pose:** The family should be posed together respectfully and happily.
5.  **Quality:** 8k, hyper-realistic, sharp focus, beautiful cinematic lighting.`;

        const parts = [
            ...validFaces.map(imageFileToPart),
            { text: prompt }
        ];

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const candidate of response.candidates || []) {
            if (candidate.content && candidate.content.parts) {
                for (const part of candidate.content.parts) {
                    if (part.inlineData) {
                        const base64ImageBytes: string = part.inlineData.data;
                        return {
                            data: `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`,
                            mimeType: part.inlineData.mimeType,
                        };
                    }
                }
            }
        }
        throw new Error(getErrorFromResponse(response, 'Gagal membuat foto keluarga di Mekah.'));
    } catch (error) {
        throw new Error(handleGeminiError(error));
    }
};

/**
 * Creates a photo of an adult self with a childhood self.
 */
export const createMeAndChildhoodPhoto = async ({ adultImage, childImage }: { adultImage: ImageFile; childImage: ImageFile; }): Promise<ImageFile> => {
    try {
        const ai = getAiClient();
        const prompt = `**TASK:** Create a surreal and emotional photorealistic image.

**INPUTS:**
1.  **ADULT PHOTO:** A photo of a person as an adult.
2.  **CHILD PHOTO:** A photo of the same person as a child.

**SCENE:**
Create a scene where the adult version of the person is interacting with their younger, childhood self. The setting should be reminiscent of a childhood memory (e.g., an old park, a nostalgic-looking street).

**CRITICAL INSTRUCTIONS:**
1.  **Face Lock:** Both the adult and the child in the final image MUST be perfect likenesses from their respective source photos.
    ${ULTRA_PRECISE_FACE_LOCK_PROMPT} (Apply this to both faces).
2.  **Interaction:** The interaction should be gentle and meaningful. For example, the adult could have a hand on the child's shoulder, or they could be looking at each other with understanding.
3.  **Style:** The image should be photorealistic, but with a slightly dreamy, nostalgic, and cinematic quality. Use warm lighting and a shallow depth of field.
4.  **Quality:** 8k, sharp focus, hyper-realistic.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imageFileToPart(adultImage), imageFileToPart(childImage), { text: prompt }] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const candidate of response.candidates || []) {
            if (candidate.content && candidate.content.parts) {
                for (const part of candidate.content.parts) {
                    if (part.inlineData) {
                        const base64ImageBytes: string = part.inlineData.data;
                        return {
                            data: `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`,
                            mimeType: part.inlineData.mimeType,
                        };
                    }
                }
            }
        }
        throw new Error(getErrorFromResponse(response, 'Gagal membuat foto masa kecil.'));
    } catch (error) {
        throw new Error(handleGeminiError(error));
    }
};

/**
 * A factory for creating prompt improvement functions.
 */
const createPromptImprover = (promptContext: string) => async (userPrompt: string): Promise<{ detailed: string; concise: string }> => {
    try {
        const ai = getAiClient();
        const fullPrompt = `**TASK:** You are an expert AI Prompt Engineer. Your goal is to rewrite a user's prompt to be more vivid, detailed, and effective for a generative AI model.

**CONTEXT:** ${promptContext}

**USER'S PROMPT:**
"${userPrompt}"

**YOUR TASK:**
1.  **DETAILED VERSION:** Rewrite the prompt into a rich, descriptive paragraph. Include details about composition, lighting, style, atmosphere, and specific visual elements. Make it cinematic and inspiring.
2.  **CONCISE VERSION:** Distill the essence of the detailed version into a powerful, comma-separated list of keywords and short phrases.

**OUTPUT FORMATTING (STRICTLY ENFORCED):**
You MUST separate the two versions with the exact string: "---CONCISE---". Do not add any other text, labels, or explanations.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                temperature: 0.7,
            }
        });

        const text = (response.text || '').trim();
        const parts = text.split('---CONCISE---');
        if (parts.length < 2) {
            return { detailed: text, concise: text.split('. ')[0] || text };
        }
        return {
            detailed: parts[0].trim(),
            concise: parts[1].trim(),
        };
    } catch (error) {
        throw new Error(handleGeminiError(error));
    }
};

export const improvePrompt = createPromptImprover("The user is generating a still image.");
export const improveIdolPrompt = createPromptImprover("The user is trying to create a realistic photo of themselves with a celebrity or idol. The prompt should describe the scene and interaction.");
export const improveMultiImagePrompt = createPromptImprover("The user is combining multiple photos into one scene. The prompt should describe how the subjects from different photos interact in the final image.");
export const improveVideoPrompt = createPromptImprover("The user is generating a short video clip for the Veo model. The prompt should be highly descriptive, including camera movements, action, and atmosphere, and must be in English.");
export const improvePosePrompt = createPromptImprover("The user wants to change the pose of a person in a photo. The prompt should describe the new pose clearly and dynamically.");