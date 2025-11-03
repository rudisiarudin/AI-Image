
import type { StyleCategory, RecommendedStyle, AspectRatio, CustomStyle } from './types';

export const RECOMMENDED_STYLES: RecommendedStyle[] = [
  {
    label: 'Photo di Mekah (Ayah & Ibu)',
    value: '__MECCA_FAMILY_PHOTO__',
    note: 'Buat foto keluarga di depan Ka\'bah dengan pakaian ihram.'
  },
  {
    label: 'Aku sekarang dan masa kecil',
    value: '__ME_AND_MY_CHILDHOOD__',
    note: 'Buat foto sureal di mana Anda bertemu dengan diri Anda di masa kecil.'
  },
  {
    label: 'Restorasi Photo Jadul',
    value: 'Edit foto ini menjadi foto berwarna dengan berkualitas sangat tinggi, sebanding dengan hasil Canon EOS R5.\n\nSubjek (Fokus Utama):\nPertahankan tubuh penuh subjek dalam bingkai, dengan proporsi yang alami.\nJaga agar fitur wajah asli (mata, hidung, bibir, alis, dan kontur) tetap akurat.\n\nKulit:\nTingkatkan agar terlihat halus, cerah, sehat, dan alami, bebas dari noda.\n\nRambut:\nBuat tampak berkilau dan sehat (abaikan jika tertutup hijab).\n\nPakaian:\nPertahankan gaya, potongan, dan warna yang sama.\nTingkatkan tekstur dan detail agar terlihat baru, premium, dan rapi.\n\nPencahayaan & Kualitas Visual:\nTerapkan pencahayaan studio yang lembut, cerah, dan merata dari depan (mirip dengan beauty dish atau ring light).\nPastikan gambar tajam, jelas, bebas noise, dengan kontras seimbang, pantulan realistis, dan tone alami.\nTingkatkan kedalaman, detail, dan kekayaan pada kulit, kain, serta keseluruhan komposisi.\n\nHindari tekstur yang mengganggu; fokus pada subjek agar terlihat jelas.\nGunakan peningkatan piksel jika foto asli buram, gelap, atau berbutir.\nSesuaikan pose, bentuk tubuh, atau pakaian hanya jika diperlukan untuk hasil realistis yang optimal. Jika terdapat watermark bantu hapus saya. Dan potong juga untuk garis pinggir seperti outline tidak penting lainnya',
    note: 'Mewarnai dan meningkatkan kualitas foto lama, buram, atau hitam putih.'
  },
  {
    label: 'Restorasi Photo Jadul ke Studio',
    value: 'Edit foto ini menjadi potret studio profesional berkualitas sangat tinggi, sebanding dengan hasil Canon EOS R5.\n\nSubjek (Fokus Utama):\nPertahankan tubuh penuh subjek dalam bingkai, dengan proporsi yang alami.\nJaga agar fitur wajah asli (mata, hidung, bibir, alis, dan kontur) tetap akurat.\n\nKulit:\nTingkatkan agar terlihat halus, cerah, sehat, dan alami, bebas dari noda.\n\nRambut:\nBuat tampak berkilau dan sehat (abaikan jika tertutup hijab).\n\nPakaian:\nPertahankan gaya, potongan, dan warna yang sama.\nTingkatkan tekstur dan detail agar terlihat baru, premium, dan rapi.\n\nPencahayaan & Kualitas Visual:\nTerapkan pencahayaan studio yang lembut, cerah, dan merata dari depan (mirip dengan beauty dish atau ring light).\nPastikan gambar tajam, jelas, bebas noise, dengan kontras seimbang, pantulan realistis, dan tone alami.\nTingkatkan kedalaman, detail, dan kekayaan pada kulit, kain, serta keseluruhan komposisi.\n\nLatar Belakang (Atmosfer):\nGanti latar belakang dengan backdrop studio profesional yang bersih, solid, dan elegan.\nHindari tekstur yang mengganggu; fokus pada subjek agar terlihat jelas.\nGunakan peningkatan piksel jika foto asli buram, gelap, atau berbutir.\nSesuaikan pose, bentuk tubuh, atau pakaian hanya jika diperlukan untuk hasil realistis yang optimal. Jika terdapat watermark bantu hapus saya. Dan potong juga untuk garis pinggir seperti outline tidak penting lainnya',
    note: 'Mengubah foto lama menjadi potret studio profesional dengan latar belakang baru.'
  },
  {
    label: 'with you',
    value: 'Medium-shot portrait of a couple at the beach during sunset, framed from the waist up, centered composition. The couple poses in a romantic prewedding style: standing very close, holding each other gently, with soft affectionate expressions. One partner may lean slightly toward the other, while the other holds around the waist or shoulder, creating a natural intimate mood. Both wear matching neutral-colored outfits (white, beige, or soft pastel tones) that look elegant and harmonious. For male: light neutral shirt or simple linen beachwear. For female: modest neutral dress or flowing outfit with soft fabric. Outfits appear coordinated, simple, and timeless. Lighting uses a strobo technique: strong, crisp flash illuminates the couple from the front, making their faces, hair, and outfits sharp and clear, while the background remains darker with dramatic colors. The sky behind shows a moody sunset with deep orange, pink, and purple tones glowing subtly, contrasting beautifully with the bright subject. Maintain exact details of both faces and hair from the uploaded reference photos, preserving realistic skin texture, natural expressions, and photorealistic quality, 8k resolution. Ratio 9:16.',
    note: 'Buat foto prewedding romantis di pantai saat sunset dengan teknik strobist.'
  },
  {
    label: 'Action figure Bandai',
    value: 'Create a 1/7th scale commercial figure of the character in the illustration, with a realistic style and environment. Place the figure on a computer desk, using a circular, transparent acrylic base with no text. On the computer screen, display the ZBrush modeling process for the figure. Next to the computer screen, place a BANDAI-style toy packaging box printed with original artwork. Make it hyper-realistic, 8k, sharp focus, detailed textures, cinematic lighting.'
  },
  {
    label: 'Photo studios kece',
    value: 'Hyperrealistic cinematic editorial portrait of the uploaded person. They stand upright in a studio with natural lighting and a background color that matches the type of clothing worn, surrounded by smoke (according to the color of the clothing) billowing under dramatic lighting behind the subject. Clothing: Match the uploaded reference photo. Perfect the pose with various themes such as cute/cool/natural/friendly with relaxed shoulders, a confident expression, *if the photo is not uploaded with a full body, improve the legs and pants. Create a hyperrealistic portrait, 8K, sharp focus, detailed textures, and cinematic lighting. high image quality'
  },
  {
    label: 'Photo Studio Kece (Tanpa Asap)',
    value: 'Hyperrealistic cinematic editorial portrait of the uploaded person. They stand upright in a studio with natural lighting and background color that matches the type of clothing worn, dramatic lighting behind the subject. Clothing: Adjust according to the uploaded reference photo. Keep the pose according to the uploaded photo, relaxed shoulders, confident expression, *if the photo is not uploaded with a full body, retouch the legs and pants. Create a hyperrealistic portrait, 8K, sharp focus, detailed textures, and cinematic lighting. High image quality.'
  },
  {
    label: 'photo studio kece tanpa asap (sesuai pose referensi photo)',
    value: 'Hyperrealistic cinematic editorial portrait of the person you uploaded. They stand upright in a studio with natural lighting and a background color that matches the type of clothing they are wearing, with dramatic lighting behind the subject. Clothing: Match the uploaded reference photo. Maintain the pose according to the uploaded photo, relaxed shoulders, confident expression. Create a hyperrealistic portrait, 8K, sharp focus, detailed textures, and cinematic lighting. High image quality.'
  },
  {
    label: 'photo studio kece (pose sesuai referensi )',
    value: 'A hyper-realistic cinematic editorial portrait of the uploaded person. They are standing upright in a studio with natural lighting and a background color that matches the type of clothing worn, surrounded by smoke (matching the color of the clothing) billowing under dramatic lighting behind the subject. Clothing: Match the uploaded reference photo. Maintain a pose consistent with the uploaded photo: relaxed shoulders and a confident expression. Create a hyper-realistic portrait in 8K with sharp focus, detailed textures, and cinematic lighting. High image quality.'
  },
  {
    label: 'Family Photo studio',
    value: 'A hyper-realistic cinematic editorial portrait of all uploaded people. They stand upright in a naturally lit studio with a background color that matches the type of clothing worn, surrounded by smoke (according to the color of the clothing) billowing under dramatic lighting behind the subjects. Clothing: Matches the uploaded reference photo. Both hands are casually tucked into their pockets, shoulders relaxed, confident expression, and head slightly tilted. Create a hyper-realistic portrait, 8k, sharp focus, detailed textures, and cinematic lighting.',
    note: 'Fitur ini hanya mengubah latar belakang, menyesuaikannya dengan warna pakaian.'
  },
  {
    label: 'Family Photo Studio (Latar Polos)',
    value: 'Hyperrealistic cinematic editorial portraits of all uploaded people. They stand upright in a studio with natural lighting and background colors that match the type of clothing they\'re wearing. Clothing: Match the uploaded reference photo. Adjust the pose to the uploaded photo (if the uploaded photo isn\'t full-body, improve the pose and dress code), with relaxed shoulders and a confident expression. Create hyperrealistic portraits, 8K, with sharp focus, detailed textures, and cinematic lighting.',
    note: 'Ubah foto keluarga Anda menjadi potret studio profesional dengan latar belakang polos yang serasi.'
  },
  {
    label: 'Black and White',
    value: 'Use the face in this photo for a black-and-white studio shoot. The lighting is soft and minimalist, creating sharp shadows and a moody atmosphere. The pose is relaxed, leaning slightly with one arm on the back of the chair, her face turned to the side. The background is plain, with a simple, modern aesthetic. Create hyperrealism, 8K, sharp focus, detailed textures, and cinematic lighting.'
  },
  {
    label: 'Basah Estetik',
    value: 'A low-angle medium close-up shot of the person, wet skin and hair, intense and introspective expression looking up. Dramatic hard lighting from above creates deep shadows and highlights on the wet skin. The image is taken from the tips of the hair to the stomach or chest. Backlighting/rim light subtly defines the subject. Gives the effect of water droplets or splashes. The background is lit with a warm orange gradient on the left that blends with a deep maroon/purple on the right. The color palette is high-contrast, cinematic, and moody with rich tones and little desaturation. 8K quality, super realistic.'
  },
  {
    label: 'Kipas angin Estetik',
    value: 'A low-angle medium close-up shot of the person, skin and hair blowing in the wind, an intense and introspective expression looking up. Dramatic hard lighting from above-front creates deep shadows and highlights on the naturally windblown hair. The image is taken from the tips of the hair to the stomach or chest. Backlighting/rim light subtly frames the subject. giving a windblown effect that enhances the aesthetic of the hair. The background is lit with a warm orange gradient on the left that blends with a deep maroon/purple on the right. The color palette is high-contrast, cinematic, and moody with rich tones and a slight desaturation. 8K quality, super realistic.'
  },
  {
    label: 'Me & toys',
    value: 'A man/woman wearing a shirt and pants (as in the uploaded photo) with a gentle expression, is holding an action figure that resembles him/herself, almost the same size as him/her. The action figure is wearing similar clothes, appears to be assembling parts or parts of an unfinished toy in the assembly. The toy display is arranged on a luxurious wooden table. In the background, a collection of other action figures can be seen on the shelf. provide natural lighting, but aesthetic. 8k Quality, sharp focus, high contrast, realistic'
  },
  {
    label: 'GTA V5',
    value: 'The character exudes a confident and slightly mischievous aura, rendered in the iconic Grand Theft Auto (GTA) cartoon style. Focus on exaggerated and stylized proportions, sharp and clean lines, and a bright color palette reminiscent of GTA V character models. He stands in a dynamic and slightly arrogant pose, perhaps with a slight smirk, looking directly at the viewer. 8K quality, like the colors. and give it an airbrush spray effect, sharp focus, high contrast, realistic'
  },
  {
    label: 'Style Vektor',
    value: 'Create an image using a face that is 100% identical to the reference photo: A stylized portrait of a man/woman, from the neck up. The face is slightly tilted to the right, exposing part of the right ear.\nThe background should conform to the dress code but be darker.\nVector art, Flat Design, Pop Art Style\nIndirect lighting, even light distribution\nClose-up portrait, profile view\nClean lines, thick shadows, minimal detail in the background.\nHigh quality 8K',
    note: 'Ubah foto Anda menjadi karya seni vektor bergaya Pop Art.'
  },
  {
    label: 'pas photo estetik',
    value: 'A hyper-realistic, cinematic editorial portrait of the person you\'re uploading. They stand upright in a studio with natural lighting and a background color that matches their clothing, with dramatic lighting behind the subject. Clothing: (As per the uploaded reference photo) Relaxed shoulders, a confident expression, and a slightly tilted head provide natural light to the face with contrasting details and colors. The scene is lit with a dramatic, warm backlight that creates a glow that matches the color of the clothing and soft fill light on the face. Create a hyper-realistic 8K portrait with sharp focus, detailed textures, and cinematic lighting. Professional'
  },
  {
    label: 'Action Figure Custom Outfit',
    value: '__ACTION_FIGURE_CUSTOM__',
    note: 'Ubah orang di foto Anda menjadi action figure dengan kostum kustom.'
  },
  {
    label: 'Prompt Ajaib Kamu',
    value: '__CUSTOM_PROMPT__',
    note: 'Tulis prompt bebas dalam Bahasa Indonesia, dan AI akan menerjemahkan & menjalankannya.'
  },
  {
    label: '6 Casual Generate Model',
    value: '__SIX_CASUAL_MODELS__',
    note: 'Hasilkan 6 model pakaian kasual dari satu foto wajah (rasio 9:16).'
  },
  {
    label: 'Giant Selfie',
    value: '__GIANT_SELFIE__',
    note: 'Ubah foto Anda menjadi selfie raksasa di sebelah monumen ikonik.'
  },
  {
    label: 'Photo Keluarga (Sudut Rendah)',
    value: '__FAMILY_PHOTO_LOW_ANGLE__',
    note: 'Buat foto keluarga dengan banyak wajah, dari sudut rendah menghadap ke langit.'
  },
  {
    label: 'Jadi Pemain Sepak Bola',
    value: '__SOCCER_PLAYER__',
    note: 'Ubah wajah Anda menjadi pemain sepak bola profesional dengan jersey kustom.'
  },
  {
    label: 'Wallpaper Sepak Bola',
    value: '__SOCCER_WALLPAPER__',
    note: 'Buat wallpaper pemain sepak bola kustom dengan nama dan nomor punggung.'
  },
  {
      label: 'Selfie Keliling Indo',
      value: 'A confident selfie of the person from the uploaded photo, taken at a famous Indonesian tourist destination. The AI should creatively choose a beautiful and iconic location in Indonesia. The person\'s outfit should be stylish and appropriate for the chosen location. The lighting should be natural and flattering. 8K quality, super realistic, sharp focus, high contrast, realistic',
      note: 'Buat selfie Anda di lokasi wisata ikonik di Indonesia secara acak.'
  },
  {
    label: 'Selfie estetik Sebahu',
    value: 'Potret neon sinematik close-up dari orang yang diunggah. Berpose dengan kepala sedikit miring, candid dan percaya diri, menunjukkan senyum menawan yang alami. Kenakan pakaian yang serasi dengan foto referensi. Terapkan pencahayaan neon yang dramatis dengan kontras biru dan oranye yang kuat. Latar belakang gradien teal gelap. Sudut kamera sedikit rendah, hanya memotong wajah dan bahu. Ini adalah gaya fotografi resolusi tinggi yang sangat realistis dengan suasana yang ramah dan menawan.',
    note: 'Buat selfie close-up dengan pencahayaan neon yang dramatis.'
  },
  {
    label: 'Photo Lamaran Kerja',
    value: '__JOB_APPLICATION_PHOTO__',
    note: 'Ubah selfie Anda menjadi pas foto formal dengan latar belakang kustom.'
  },
  {
      label: 'Jadi Hotwheels',
      value: '__HOTWHEELS__',
      note: 'Ubah foto mobil Anda menjadi mainan Hotwheels dalam kemasan (rasio 1:1).'
  },
  {
    label: 'Style Miniatur Gedung',
    value: 'A hyper-realistic, high-quality photograph of a miniature diorama. The diorama is a 100% accurate replica of the building and its surroundings from the uploaded photo, capturing every architectural detail, texture, and color. It\'s built with realistic materials like 3D-printed resin and acrylic, with detailed landscaping using miniature moss and sand. Warm, inviting miniature LED lights create a deep, atmospheric scene. The entire diorama is elegantly displayed on a luxurious marble table against a plain, soft, warm-colored background. The overall image has high contrast and sharp focus. Critically important: Any visible text from the original photo must be perfectly replicated, sharp focus, high contrast, realistic',
    note: 'Ubah foto gedung Anda menjadi diorama miniatur yang sangat detail dan realistis.'
  },
  {
    label: 'Diorama',
    value: 'Create a hyper-realistic photograph of a miniature diorama displayed on a table. The diorama is a faithful recreation of the building or monument from the uploaded photo, capturing its essence as an iconic landmark. The composition must focus solely on the diorama, removing any original background such as the sky. Utilize dramatic lighting to create depth and atmosphere, ensuring the final image has sharp focus and intricate, high-quality details in every corner. The image should emulate a shot taken with a professional DSLR camera, resulting in a hyper-realistic, 8k, 16:9 landscape photograph., sharp focus, high contrast, realistic',
    note: 'Ubah foto bangunan atau monumen Anda menjadi diorama miniatur yang dramatis.'
  },
  {
    label: 'black shoot studios',
    value: 'An emotional cinematic portrait of myself, featuring me, my head slightly tilted, wearing the shirt and pants as shown in the uploaded photo. Warm, golden-blue light isolates her from the dark void, softly illuminating her hair, capturing the profound stillness. However, her face remains visible. High quality, sharp facial details, realistic.',
    note: 'Ciptakan potret sinematik yang emosional dengan pencahayaan dramatis dan latar belakang gelap.'
  },
  {
    label: 'Close-up Ekstrem (Wajah)',
    value: 'Create a very close-up of the face, focusing especially on the eyes, and only showing half of the face, leaving the hair down to the chin on the right side of the face visible. Make the pores of the skin very visible with high contrast. and dramatically enhance this image to very high detail. Sharpen every texture, clarify reflections, perfect the lighting, and bring out small details to create a very sharp and high-fidelity result, so that the cornea of the eye is clearly visible. The photo was taken using a Canon EF 100mm f/2.8L Macro IS USM macro lens. Ensure the face is very realistic and the pores of the skin are clearly visible., sharp focus, high contrast, realistic',
    note: 'Buat foto close-up super detail dari wajah Anda, menonjolkan tekstur kulit dan detail mata.'
  },
  {
    label: 'Dark Smoke',
    value: 'Hands in Pockets – Relaxed Authority. A hyper-realistic, cinematic editorial portrait of the person being uploaded. They stand upright in a dark, gloomy studio, surrounded by billowing smoke under dramatic lighting. Clothing: As per the uploaded reference photo. Both hands are casually tucked into their pockets, shoulders relaxed, a confident expression, and the head is slightly tilted. Make it hyper-realistic, 8k, sharp focus, detailed textures, cinematic lighting., sharp focus, high contrast, realistic',
    note: 'Ciptakan potret sinematik dengan asap dan pencahayaan dramatis.'
  },
  {
    label: 'Siluet',
    value: 'A hyperrealistic, minimalist black-and-white portrait of a man/woman (based on the uploaded reference), facing 90 degrees to the side, away from the camera, with soft light behind him. His expression is intense and mysterious. The dramatic lighting creates strong shadows. With a photorealistic, cinematic vertical shot (9:16), sharp focus',
    note: 'makin kece photo stengah badan'
  },
  {
    label: 'Monokrom Luxury',
    value: 'Use the face in this photo for a black-and-white studio shoot. The lighting is soft and minimalist, creating sharp shadows and a moody atmosphere. The pose is relaxed, leaning slightly with one arm on the back of the chair, her face turned to the side. The background is plain, with a simple, modern aesthetic. Create hyperrealism, 8K, sharp focus, detailed textures, and cinematic lighting., sharp focus, high contrast, realistic',
    note: 'Ciptakan potret monokrom yang mewah dan artistik.'
  },
  {
    label: 'Close Up',
    value: 'A close-up portrait, captured with an 85mm prime lens at f/1.8, focusing on a subject with a genuinely sweet and serene smile that gently crinkles the eyes. The expression conveys a deep sense of quiet contentment and approachable warmth. The camera angle is subtly low, just below eye-level, lending an ethereal grace to the subject. Lighting is soft, diffused natural window light, meticulously sculpted to highlight the delicate planes of the face and create a luminous glow, reminiscent of Vermeer\'s intimate portraits. The background is starkly minimalist—a seamless, smooth off-white or light grey wall, or expansive negative space—with creamy, dreamlike bokeh that completely isolates the subject. The overall aesthetic is ultra-minimalist, inspired by the clean lines of Jil Sander and the understated elegance of Scandinavian design. The image is processed to evoke the soft, natural skin tones, subtle desaturation, and fine grain of Kodak Portra 400 film stock, imbuing it with a timeless, tranquil, and sophisticated feel. NOTE: For maximum results, please upload a half-body photo., sharp focus, high contrast, realistic',
    note: 'Untuk hasil maksimal, mohon unggah foto setengah badan.'
  },
  {
    label: 'Caricature',
    value: 'Create a captivating, laughter-filled, and highly expressive digital caricature portrait. Transform the subject into a unique and intriguing representation, where their most prominent facial features—such as the nose, eyes, lips, chin, or even a distinctive hairstyle—are exaggerated intelligently, absurdly, and artistically. Despite the exaggeration, ensure the subject\'s likeness remains instantly recognizable, yet with a distilled and iconic visual style, resembling a high-quality modern cartoon portrait.\n\n*Artistic Style & Details:* Visualize in a contemporary digital illustration style, resembling high-end animation studio concept art (like Pixar, DreamWorks, or modern magazine illustration style). Use clean, expressive, and sometimes bold lines to define forms. Small details in facial expressions—playful crinkles around the eyes, a mischievous glint, or a cheeky smile—should be emphasized. Add simplified yet palpable texture, such as subtle creases in clothing or dynamically flowing hair details, to add depth without distracting from the main focus.\n\n*Color Palette:* Apply a bright, cheerful, and vibrant color palette. Use high yet harmonious saturation, with smooth color gradients and soft tonal transitions to add volume and dimension. Dominate with eye-catching primary and secondary colors (e.g., bright red, cheerful yellow, electric blue), or clever complementary color schemes to create delightful, pop-art contrast. Avoid dull or dark colors; every pigment should radiate positive energy.\n\n*Lighting & Shadows:* Employ a dramatic yet playful lighting scheme, specifically designed to highlight the exaggerated facial features. Consider soft studio lighting from the front to accentuate expressions, or clever side-lighting to create artistic depth and shadows. Add a subtle, sparkling rim light effect around the subject\'s silhouette to separate them from the background and add definition. Shadows should be intelligent, minimalist, and strategically used to add dimension without appearing gloomy or distracting from the visual humor. Highlights should be clear and deliberately placed to draw the eye to key features.\n\n*Composition & Background:* The composition should be a close-up shoulder-up portrait or headshot, focusing full and undivided attention on the subject\'s face and expression. The viewpoint should be dynamic, perhaps with a slight camera tilt or a clever eye-level perspective, to add a sense of playfulness and energy. The background should be minimalist, clean, and non-distracting, perhaps a soft solid color gradient, a very simple abstract pattern, or a gently contrasting color field that serves as a canvas, supporting the caricature without competing with it. Ensure negative space is effectively used to frame the subject.\n\n*Quality & Mood:* The final output must have very high resolution (minimum 4K, ideally 8K), with exceptionally clean, sharp, and professional rendering. The primary focus should be perfectly sharp on the exaggerated features. Capture the essence of the subject\'s personality with a cheerful, goofy, or witty expression, radiating an aura of joy, intelligent humor, and positive energy. The image should feel alive, dynamic, and exude an undeniable appeal, inviting a wide smile from anyone who views it., sharp focus, high contrast, realistic',
    note: 'Ubah foto Anda menjadi karikatur digital yang lucu dan ekspresif.'
  },
  {
    label: 'sketsa',
    value: 'Transform this photo into a detailed facial sketch using black pen strokes on aged, canvas-textured paper. Focus on capturing the likeness with expressive, confident lines and cross-hatching for shading., sharp focus, high contrast, realistic',
    note: 'Ubah foto Anda menjadi sketsa pensil yang artistik.'
  },
  {
    label: '6 avatar ku',
    value: 'Create a hyper-realistic 8K portrait of the man/woman in the uploaded photo. Create a 3x2 grid of 6 avatars, each with a different hairstyle. Make sure the clothes are consistent like (the uploaded reference photo). Ensure natural skin texture, detailed lighting, Provide sharp details, no blur, and bright colors. Make the photo background plain, the color matches the dress code he/she is wearing. Create a hyper-realistic portrait, sharp focus, high contrast, realistic',
    note: 'Buat 6 avatar diri Anda dengan gaya rambut berbeda dalam satu gambar.'
  }
];

export const STYLE_CATEGORIES: StyleCategory[] = [
    {
        id: 'baseStyle',
        name: 'Gaya Dasar',
        options: [
            { value: 'photorealistic', label: 'Photorealistic' },
            { value: 'digital art', label: 'Digital Art' },
            { value: 'oil painting', label: 'Oil Painting' },
            { value: 'watercolor', label: 'Watercolor' },
            { value: 'anime style', label: 'Anime' },
            { value: 'comic book style', label: 'Comic Book' },
            { value: 'fantasy art', label: 'Fantasy Art' },
            { value: 'sci-fi art', label: 'Sci-Fi Art' },
            { value: 'cyberpunk', label: 'Cyberpunk' },
            { value: 'steampunk', label: 'Steampunk' },
            { value: 'pixel art', label: 'Pixel Art' },
            { value: '3d render', label: '3D Render' },
            { value: 'low poly', label: 'Low Poly' },
            { value: 'impressionism', label: 'Impressionism' },
            { value: 'surrealism', label: 'Surrealism' },
            { value: 'pop art', label: 'Pop Art' },
            { value: 'minimalist', label: 'Minimalist' },
        ]
    },
    {
        id: 'lighting',
        name: 'Pencahayaan',
        options: [
            { value: 'cinematic lighting', label: 'Cinematic' },
            { value: 'dramatic lighting', label: 'Dramatic' },
            { value: 'soft lighting', label: 'Soft' },
            { value: 'studio lighting', label: 'Studio' },
            { value: 'natural lighting', label: 'Natural' },
            { value: 'golden hour', label: 'Golden Hour' },
            { value: 'blue hour', label: 'Blue Hour' },
            { value: 'neon lighting', label: 'Neon' },
            { value: 'backlighting', label: 'Backlighting' },
            { value: 'rim lighting', label: 'Rim Lighting' },
            { value: 'hard lighting', label: 'Hard Lighting' },
        ]
    },
    {
        id: 'colorPalette',
        name: 'Palet Warna',
        options: [
            { value: 'vibrant colors', label: 'Vibrant' },
            { value: 'pastel colors', label: 'Pastel' },
            { value: 'monochromatic', label: 'Monochromatic' },
            { value: 'warm colors', label: 'Warm' },
            { value: 'cool colors', label: 'Cool' },
            { value: 'high contrast', label: 'High Contrast' },
            { value: 'low contrast', label: 'Low Contrast' },
            { value: 'saturated', label: 'Saturated' },
            { value: 'desaturated', label: 'Desaturated' },
        ]
    },
    {
        id: 'composition',
        name: 'Komposisi',
        options: [
            { value: 'wide angle shot', label: 'Wide Angle' },
            { value: 'close-up shot', label: 'Close-up' },
            { value: 'medium shot', label: 'Medium Shot' },
            { value: 'full body shot', label: 'Full Body' },
            { value: 'portrait', label: 'Portrait' },
            { value: 'landscape', label: 'Landscape' },
            { value: 'dynamic angle', label: 'Dynamic Angle' },
            { value: 'low angle', label: 'Low Angle' },
            { value: 'high angle', label: 'High Angle' },
            { value: 'dutch angle', label: 'Dutch Angle' },
            { value: 'rule of thirds', label: 'Rule of Thirds' },
            { value: 'symmetrical composition', label: 'Symmetrical' },
        ]
    },
    {
        id: 'details',
        name: 'Detail & Kualitas',
        options: [
            { value: 'highly detailed, 4k resolution', label: 'Highly Detailed, 4k' },
            { value: 'hyperrealistic, 8k resolution', label: 'Hyperrealistic, 8k' },
            { value: 'sharp focus', label: 'Sharp Focus' },
            { value: 'soft focus', label: 'Soft Focus' },
            { value: 'intricate details', label: 'Intricate Details' },
            { value: 'photorealistic textures', label: 'Photorealistic Textures' },
            { value: 'Unreal Engine render', label: 'Unreal Engine Render' },
            { value: 'Octane render', label: 'Octane Render' },
        ]
    },
    {
        id: 'camera',
        name: 'Kamera & Lensa',
        options: [
            { value: 'shot on Canon EOS R5, 50mm f/1.2 lens', label: 'Canon R5, 50mm f/1.2' },
            { value: 'shot on Sony A7R IV, 85mm f/1.4 lens', label: 'Sony A7R IV, 85mm f/1.4' },
            { value: 'shot on Nikon Z9, 24-70mm f/2.8 lens', label: 'Nikon Z9, 24-70mm f/2.8' },
            { value: 'shot on Fujifilm GFX 100, 110mm f/2 lens', label: 'Fujifilm GFX 100' },
            { value: 'shot on film, Kodak Portra 400', label: 'Film - Kodak Portra 400' },
            { value: 'shot on film, Ilford HP5', label: 'Film - Ilford HP5 (B&W)' },
            { value: 'wide angle lens', label: 'Wide Angle Lens' },
            { value: 'telephoto lens', label: 'Telephoto Lens' },
            { value: 'macro lens', label: 'Macro Lens' },
            { value: 'depth of field (bokeh)', label: 'Depth of Field (Bokeh)' },
        ]
    }
];

export const ASPECT_RATIOS: AspectRatio[] = [
    { value: '1:1', label: '1:1 (Kotak)' },
    { value: '16:9', label: '16:9 (Lanskap)' },
    { value: '9:16', label: '9:16 (Potret)' },
    { value: '4:3', label: '4:3 (Klasik)' },
    { value: '3:4', label: '3:4 (Potret Klasik)' },
];

export const CUSTOM_STYLES: CustomStyle[] = [
    {
        id: 'photoWithIdol',
        name: 'Foto Bareng Doi',
        note: 'Gabungkan foto Anda dengan foto idola Anda menjadi satu gambar yang realistis.',
        requiresImage: true,
    },
    {
        id: 'gantiBaju',
        name: 'Ganti Baju Keseluruhan',
        note: 'Ganti pakaian model di foto pertama dengan pakaian dari foto kedua.',
        requiresImage: true,
    },
    {
        id: 'semuaBisaDisini',
        name: 'Semua Bisa Disini',
        note: 'Gabungkan 2 hingga 5 foto menjadi satu gambar berdasarkan deskripsi Anda.',
    },
    {
        id: 'touchUpWajah',
        name: 'Touch Up Wajah',
        note: 'Lakukan perbaikan pada wajah seperti menghapus noda, menambah riasan, atau mengubah gaya rambut.',
        requiresImage: true,
    },
     {
        id: 'drawPose',
        name: 'Draw Pose',
        note: 'Ubah pose model di foto Anda dengan menggambar pose baru atau menggunakan foto referensi.',
        requiresImage: false, // The uploader is inside the custom UI
    },
    {
        id: 'sceneMovie',
        name: 'Masuk Scene Movie',
        note: 'Masukkan wajah Anda ke dalam sebuah scene film favorit Anda.',
        requiresImage: true,
    },
    {
        id: 'swimwearModel',
        name: 'Model Pakaian Renang',
        note: 'Hasilkan model yang mengenakan pakaian renang dari foto produk yang Anda unggah.',
        requiresImage: true,
    },
    {
        id: 'promptVideoVeo',
        name: 'Prompt Video (Veo)',
        note: 'Tulis ide Anda, dan AI akan membuatkan prompt video sinematik dalam Bahasa Inggris untuk model Veo.',
    },
    {
        id: 'identifikasiFashion',
        name: 'Identifikasi Fashion',
        note: 'Unggah foto outfit, dan AI akan memberikan analisis detail serta ringkasan prompt untuk Anda gunakan.',
    },
    {
        id: 'tingkatkanKualitas',
        name: 'Tingkatkan Kualitas Foto',
        note: 'Secara otomatis meningkatkan resolusi, pencahayaan, dan detail foto tanpa mengubah kontennya.',
        requiresImage: true,
    },
    {
        id: 'removeWatermark',
        name: 'Hapus Watermark',
        note: 'Mencoba menghapus watermark, logo, atau teks yang ada pada gambar secara otomatis.',
        requiresImage: true,
    },
    {
        id: 'analisaModelRambut',
        name: 'Analisa Model Rambut',
        note: 'Unggah foto, dan AI akan menganalisis gaya rambut serta memberikan saran model & warna rambut yang cocok.',
        requiresImage: true,
    },
    {
        id: 'qrCodeArtistik',
        name: 'QR Code Artistik',
        note: 'Buat QR code yang berfungsi dan terintegrasi secara artistik ke dalam sebuah gambar.',
        requiresImage: false,
    },
];

const POSE_PROMPT_SUFFIX = "WAJIB: Pertahankan 100% kemiripan wajah, ekspresi, pakaian, dan gaya rambut dari subjek asli. Jangan mengubah orangnya. Latar belakang harus tetap sama.";

export const SOLO_STUDIO_POSE_TEMPLATES = [
    { label: 'Berdiri Tegas', prompt: `Posisikan ulang subjek menjadi berdiri tegak, kaki sedikit terbuka, tangan di pinggul, menatap lurus ke kamera dengan percaya diri. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Bersandar Santai', prompt: `Ubah pose subjek menjadi bersandar santai ke dinding, satu kaki disilangkan di depan, lengan terlipat di dada. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Duduk di Kursi', prompt: `Posisikan subjek duduk di kursi, sedikit condong ke depan, siku di atas lutut, dengan tatapan yang intens. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Berjalan Dinamis', prompt: `Buat subjek seolah-olah sedang berjalan ke arah kamera, satu kaki di depan, dengan gerakan yang alami dan dinamis. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Tangan di Saku', prompt: `Ubah pose subjek menjadi berdiri santai dengan kedua tangan di saku celana, bahu rileks. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Profil Samping', prompt: `Posisikan subjek menghadap ke samping, menampilkan profil wajah dan tubuhnya, dengan tatapan ke kejauhan. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Melompat Gembira', prompt: `Buat subjek melompat ke udara dengan ekspresi gembira dan lengan terangkat. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Pose Berpikir', prompt: `Ubah pose subjek menjadi duduk dengan gestur berpikir, jari telunjuk menyentuh pelipis atau dagu. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Action Pose', prompt: `Posisikan subjek dalam pose aksi, seperti akan berlari atau melakukan gerakan atletis. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Duduk di Lantai', prompt: `Ubah pose subjek menjadi duduk santai di lantai, satu kaki ditekuk, lengan bertumpu dengan santai. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Melihat ke Atas Bahu', prompt: `Buat subjek berdiri membelakangi kamera tetapi menoleh ke belakang melewati bahunya. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Pose Contrapposto', prompt: `Posisikan subjek dalam pose contrapposto klasik, berat badan pada satu kaki, menciptakan lekuk tubuh yang elegan. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Menari', prompt: `Buat subjek dalam pose menari yang ekspressif dan penuh gerakan. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Tangan di Rambut', prompt: `Ubah pose subjek dengan satu tangan menyapu rambutnya ke belakang, tatapan percaya diri. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Tertawa Lepas', prompt: `Posisikan subjek dalam tawa yang tulus dan lepas, kepala sedikit mendongak. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Pose Yoga', prompt: `Buat subjek dalam pose yoga yang tenang dan seimbang, misalnya pose pohon (Vrksasana). ${POSE_PROMPT_SUFFIX}` },
    { label: 'Berlutut Satu Kaki', prompt: `Posisikan subjek berlutut dengan satu kaki, seperti seorang ksatria, dengan postur yang kuat. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Memegang Jaket', prompt: `Ubah pose subjek menjadi memegang kerah jaketnya dengan kedua tangan, memberikan kesan keren. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Duduk di Meja', prompt: `Posisikan subjek duduk di tepi meja, dengan postur yang santai namun berwibawa. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Menunjuk ke Kamera', prompt: `Buat subjek menunjuk langsung ke arah kamera dengan ekspresi yang menarik. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Membaca Buku', prompt: `Ubah pose subjek menjadi duduk sambil fokus membaca buku yang dipegangnya. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Pose Pahlawan Super', prompt: `Posisikan subjek dalam pose pahlawan super klasik, tangan di pinggang dan dada dibusungkan. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Bermain Gitar', prompt: `Ubah pose subjek seolah-olah sedang bermain gitar akustik dengan penuh perasaan. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Menyesuaikan Dasi', prompt: `Buat subjek dalam pose sedang menyesuaikan dasi atau kerah bajunya, tatapan tajam. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Berbisik', prompt: `Posisikan subjek dengan satu tangan di samping mulut seolah-olah sedang berbisik. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Merentangkan Tangan', prompt: `Ubah pose subjek menjadi merentangkan kedua tangan ke samping, ekspresi bebas. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Duduk Melamun', prompt: `Posisikan subjek duduk di dekat jendela, menopang dagu sambil menatap keluar dengan tatapan melamun. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Memegang Topi', prompt: `Buat subjek memegang pinggiran topinya dengan satu tangan, memberikan kesan misterius. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Pose Atletis', prompt: `Posisikan subjek dalam pose peregangan atletis, menunjukkan kekuatan dan fleksibilitas. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Memberi Hormat', prompt: `Ubah pose subjek menjadi posisi hormat yang formal dan tegas. ${POSE_PROMPT_SUFFIX}` }
];

export const COUPLE_POSE_TEMPLATES = [
    { label: 'Pelukan dari Belakang', prompt: `Posisikan ulang pasangan: satu orang memeluk pasangannya dari belakang dengan lembut, keduanya tersenyum. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Dahi Bertemu', prompt: `Ubah pose pasangan menjadi saling berhadapan, dahi mereka bersentuhan dengan lembut, mata terpejam. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Gendong di Punggung (Piggyback)', prompt: `Posisikan ulang pasangan: satu orang menggendong yang lain di punggung (piggyback), keduanya tertawa bahagia. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Dansa Romantis', prompt: `Buat pasangan dalam pose dansa yang intim, satu tangan berpegangan, tangan lainnya di pinggang/bahu. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Berbisik', prompt: `Ubah pose menjadi salah satu orang berbisik di telinga pasangannya, yang bereaksi dengan senyum atau tawa kecil. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Berpegangan Tangan & Berjalan', prompt: `Posisikan pasangan berjalan berdampingan sambil berpegangan tangan, menatap satu sama lain. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Cium Pipi', prompt: `Buat salah satu orang mencium pipi pasangannya dengan lembut, yang lain tersenyum bahagia. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Bersandar di Bahu', prompt: `Posisikan satu orang duduk dan yang lain menyandarkan kepala dengan nyaman di bahu pasangannya. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Selfie Kocak', prompt: `Buat pasangan mengambil selfie bersama dengan ekspresi wajah yang lucu dan konyol. ${POSE_PROMPT_SUFFIX}` },
    { label: 'High-Five Kemenangan', prompt: `Posisikan pasangan saling memberikan high-five dengan penuh semangat, merayakan sesuatu bersama. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Menatap Mata Masing-Masing', prompt: `Posisikan pasangan saling berhadapan, menatap mata satu sama lain dengan dalam dan penuh perasaan. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Duduk Berdampingan', prompt: `Ubah pose menjadi pasangan duduk berdampingan di bangku taman, bahu bersentuhan, terlihat santai. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Mengangkat Pasangan (Bridal Style)', prompt: `Posisikan satu orang mengangkat pasangannya dengan gaya pengantin (bridal style). ${POSE_PROMPT_SUFFIX}` },
    { label: 'Berbagi Payung', prompt: `Buat pasangan berdiri berdekatan di bawah satu payung, menciptakan suasana yang intim. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Berteduh di Bawah Jaket', prompt: `Posisikan satu orang membuka jaketnya untuk melindungi pasangannya dari dingin atau hujan. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Main Gitar Bersama', prompt: `Buat satu orang bermain gitar sementara pasangannya duduk di sebelahnya, ikut bernyanyi atau mendengarkan. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Membaca Buku Bersama', prompt: `Posisikan pasangan bersandar satu sama lain sambil membaca buku yang sama. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Pose "Titanic"', prompt: `Posisikan pasangan dalam pose ikonik "Titanic" di mana satu orang berdiri di belakang yang lain dengan tangan terentang. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Punggung Saling Bersandar', prompt: `Buat pasangan duduk di lantai saling membelakangi, punggung mereka bersentuhan, terlihat santai. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Pose Pahlawan Super', prompt: `Posisikan pasangan berdiri berdampingan dalam pose pahlawan super yang kuat, tangan di pinggang. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Menari di Dapur', prompt: `Buat pasangan menari dengan riang di dapur sambil memasak. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Minum dari Gelas yang Sama', prompt: `Posisikan pasangan minum dari satu gelas dengan dua sedotan, dengan tatapan main-main. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Memasak Bersama', prompt: `Ubah pose menjadi pasangan yang bekerja sama di dapur, satu mengaduk sementara yang lain memotong sayuran. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Suapan Pertama', prompt: `Buat satu orang menyuapi pasangannya dengan sepotong kue atau buah. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Menunjuk ke Arah yang Sama', prompt: `Posisikan pasangan menunjuk ke sesuatu di kejauhan dengan ekspresi takjub atau gembira. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Berpose Formal (Red Carpet)', prompt: `Buat pasangan berpose formal seperti di karpet merah, satu tangan melingkari pinggang yang lain. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Berpelukan di Sofa', prompt: `Posisikan pasangan berpelukan dengan nyaman di sofa, mungkin sambil menonton TV. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Berolahraga Bersama', prompt: `Buat pasangan melakukan pose yoga atau peregangan bersama. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Memperbaiki Dasi Pasangan', prompt: `Posisikan satu orang dengan lembut memperbaiki dasi atau kerah baju pasangannya. ${POSE_PROMPT_SUFFIX}` },
    { label: 'Tertawa Lepas Bersama', prompt: `Posisikan pasangan tertawa lepas bersama-sama, menunjukkan kebahagiaan yang tulus. ${POSE_PROMPT_SUFFIX}` }
];

export const IDOL_POSE_TEMPLATES = [
    {
        label: "Pelukan Samping Santai",
        value: "Orang A dan Orang B berdiri berdampingan. Orang B (Idol) merangkul bahu Orang A (User) dengan santai, keduanya tersenyum hangat ke arah kamera."
    },
    {
        label: "Selfie Ceria",
        value: "Orang A (User) dan Orang B (Idol) berpose untuk selfie. Orang A memegang kamera (tidak terlihat), dan keduanya membuat ekspresi ceria atau tanda 'peace'."
    },
    {
        label: "Tanda Tangan",
        value: "Orang B (Idol) sedang memberikan tanda tangan pada sebuah item (misalnya poster atau buku) yang dipegang oleh Orang A (User) yang terlihat sangat bahagia."
    },
    {
        label: "High-Five",
        value: "Orang A (User) dan Orang B (Idol) saling memberikan high-five di udara, keduanya tertawa seolah-olah baru saja menyelesaikan sesuatu yang hebat."
    },
    {
        label: "Berbisik",
        value: "Orang B (Idol) sedikit membungkuk untuk membisikkan sesuatu ke telinga Orang A (User), yang bereaksi dengan ekspresi terkejut atau gembira."
    },
    {
        label: "Punggung Saling Bersandar",
        value: "Orang A (User) dan Orang B (Idol) duduk atau berdiri dengan punggung saling bersandar, lengan terlipat, memberikan kesan 'cool' dan partner in crime."
    },
    {
        label: "Tertawa Bersama",
        value: "Orang A (User) dan Orang B (Idol) sedang tertawa lepas bersama-sama karena lelucon yang hanya mereka berdua yang tahu. Momen candid dan natural."
    },
    {
        label: "Pose 'Fighting!'",
        value: "Orang A (User) dan Orang B (Idol) keduanya mengepalkan tangan dengan semangat (pose 'fighting!') untuk memberikan dorongan semangat."
    }
];

export const SHOT_STYLE_TEMPLATES = [
    { label: "Medium Shot", value: "medium shot, dari pinggang ke atas, fokus pada interaksi dan ekspresi mereka" },
    { label: "Full Body Shot", value: "full body shot, menampilkan seluruh tubuh dan pakaian mereka" },
    { label: "Close-up Shot", value: "close-up shot, fokus erat pada wajah mereka untuk menangkap emosi" },
    { label: "Wide Angle Shot", value: "wide angle shot, menampilkan mereka dan sedikit lingkungan studio di sekitarnya" }
];

export const LIGHT_STYLE_TEMPLATES = [
    { label: "Pencahayaan Studio Lembut", value: "pencahayaan studio yang lembut dan merata (softbox lighting), menciptakan tampilan yang bersih dan profesional" },
    { label: "Pencahayaan Dramatis", value: "pencahayaan dramatis dengan satu sumber cahaya utama (key light) yang kuat, menciptakan bayangan yang dalam" },
    { label: "Rim Lighting", value: "rim lighting, di mana ada cahaya dari belakang yang menciptakan garis cahaya di sekitar subjek, memisahkan mereka dari latar belakang" },
    { label: "Golden Hour Glow", value: "mensimulasikan cahaya hangat dan keemasan seperti saat matahari terbenam (golden hour)" }
];

export const SWIMWEAR_POSE_TEMPLATES = [
  { label: "Berdiri di Tepi Air", value: "berdiri dengan percaya diri di tepi air, satu kaki sedikit di depan, menatap ke arah matahari." },
  { label: "Duduk di Kursi Pantai", value: "duduk santai di kursi pantai atau handuk, sedikit menyandarkan tubuh ke belakang." },
  { label: "Berjalan di Pasir", value: "berjalan santai di sepanjang garis pantai, menciptakan gerakan yang alami." },
  { label: "Bermain dengan Air", value: "berpose seolah-olah sedang bermain atau menyipratkan air dengan gembira." },
  { label: "Berpose di Bawah Payung", value: "berpose di bawah payung pantai, menciptakan bayangan yang menarik." },
  { label: "Keluar dari Air", value: "pose dinamis seolah-olah baru saja keluar dari kolam renang atau laut." },
];

export const SOCCER_POSE_TEMPLATES = [
    { label: "Berdiri Tegak dengan Bola", value: "berdiri tegak dengan satu kaki di atas bola, tangan di pinggul, menatap tajam ke kamera." },
    { label: "Selebrasi Gol", value: "berlari dengan kedua tangan terangkat atau meluncur di atas lutut dalam selebrasi gol yang penuh semangat." },
    { label: "Menendang Bola", value: "dalam pose aksi dinamis saat akan menendang bola dengan kekuatan penuh." },
    { label: "Mengontrol Bola", value: "dalam posisi fokus, mengontrol bola yang datang dengan dada atau kakinya." },
    { label: "Menunjuk ke Lambang Klub", value: "menunjuk dengan bangga ke lambang klub di jerseynya." },
    { label: "Berpose dengan Jersey", value: "memegang jersey dengan namanya di bagian belakang, menunjukkannya ke kamera." },
    { label: "Duduk di Atas Bola", value: "duduk santai di atas bola di tengah lapangan." }
];

export const SBD_SHOT_STYLE_TEMPLATES = [
    { label: 'Close-Up', value: 'a close-up shot, focusing tightly on the main subject\'s face and expression.' },
    { label: 'Medium Shot', value: 'a medium shot, capturing the subjects from the waist up to show their interaction.' },
    { label: 'Full Shot', value: 'a full shot, showing the entire body of the subjects and their immediate surroundings.' },
    { label: 'Wide Shot', value: 'a wide shot, showing the subjects within a larger environment or background.' },
    { label: 'Low Angle Shot', value: 'a low angle shot, looking up at the subjects to make them appear dominant or heroic.' },
    { label: 'High Angle Shot', value: 'a high angle shot, looking down on the subjects.' }
];

export const SBD_LIGHT_STYLE_TEMPLATES = [
    { label: 'Cinematic Lighting', value: 'dramatic and moody cinematic lighting with high contrast and deep shadows.' },
    { label: 'Studio Lighting', value: 'clean and professional studio lighting with soft, even light.' },
    { label: 'Natural Sunlight', value: 'warm and bright natural sunlight, as if shot outdoors on a sunny day.' },
    { label: 'Golden Hour', value: 'beautiful, soft, warm light characteristic of the golden hour just after sunrise or before sunset.' },
    { label: 'Neon Lighting', value: 'vibrant and colorful neon lighting, creating a futuristic or cyberpunk atmosphere.' },
    { label: 'Backlight', value: 'a strong backlight that creates a glowing rim or halo effect around the subjects.' }
];

export const LIPSTICK_COLORS = [
    { name: 'Classic Red', displayName: 'Classic Red', value: '#C00000' },
    { name: 'Nude Pink', displayName: 'Nude Pink', value: '#D9A697' },
    { name: 'Deep Plum', displayName: 'Deep Plum', value: '#5A0D3D' },
    { name: 'Coral Peach', displayName: 'Coral Peach', value: '#F8AFA6' },
    { name: 'Hot Pink', displayName: 'Hot Pink', value: '#FF69B4' },
    { name: 'Rich Berry', displayName: 'Rich Berry', value: '#990033' },
    { name: 'Soft Mauve', displayName: 'Soft Mauve', value: '#A48694' },
];

export const MALE_HAIRSTYLE_TEMPLATES = [
    { label: "Undercut Klasik", value: "a classic, clean undercut with faded sides and a longer top" },
    { label: "Taper Fade", value: "a stylish taper fade, seamlessly blended on the sides and back" },
    { label: "Textured Crop", value: "a modern textured crop with a forward fringe" },
    { label: "Quiff Bervolume", value: "a voluminous quiff, brushed up and back from the forehead" },
    { label: "Pompadour Elegan", value: "an elegant pompadour with significant height and slicked sides" },
    { label: "Slick Back Rapi", value: "a sharp, slicked-back hairstyle with a wet look" },
    { label: "Buzz Cut", value: "a very short, masculine buzz cut" },
    { label: "Crew Cut", value: "a classic, neat crew cut, short on the sides, slightly longer on top" },
    { label: "Ivy League", value: "a sophisticated Ivy League haircut, parted on the side" },
    { label: "Side Part Profesional", value: "a professional and timeless side part hairstyle" },
    { label: "French Crop", value: "a chic French crop with a short, straight fringe" },
    { label: "Man Bun", value: "a trendy man bun, tying up long hair at the back" },
    { label: "Top Knot", value: "a stylish top knot with shaved or very short sides" },
    { label: "Rambut Gondrong Terurai", value: "long, flowing, healthy shoulder-length hair" },
    { label: "Ikal Bergelombang", value: "natural, messy, shoulder-length wavy hair" },
    { label: "Gaya Rambut Berantakan", value: "an effortlessly cool, messy, and textured hairstyle" },
    { label: "Faux Hawk Modern", value: "a modern faux hawk, less extreme than a mohawk" },
    { label: "Mullet Modern", value: "a stylish modern mullet, 'business in the front, party in the back'" },
    { label: "Ikal dengan Fade", value: "curly hair on top with a clean fade on the sides" },
    { label: "Poni Bertekstur", value: "a hairstyle with a prominent, textured fringe over the forehead" },
    { label: "Caesar Cut", value: "a short, horizontal, straight-cut fringe, like a Caesar cut" },
    { label: "Bro Flow", value: "a medium-length 'bro flow' hairstyle, pushed back off the face" },
    { label: "Disconnected Undercut", value: "a dramatic disconnected undercut with a sharp contrast in length" },
    { label: "Hard Part", value: "a side part defined by a shaved line (hard part)" },
    { label: "Comma Hair (Gaya Korea)", value: "a popular Korean 'comma' hairstyle with a curved fringe" },
    { label: "Two Block Cut (Gaya Korea)", value: "a Korean two-block haircut, short on sides/back, long on top" },
    { label: "Gaya Rambut Basah", value: "a wet-look hairstyle, as if fresh from the shower" },
    { label: "Rambut Berwarna Platinum", value: "a bold platinum blonde or silver hair color" },
    { label: "High Top Fade", value: "a retro high top fade hairstyle" },
    { label: "Cornrows Rapi", value: "neatly braided cornrows" },
];

export const FEMALE_HAIRSTYLE_TEMPLATES = [
    { label: "Bob Rapi dan Lurus", value: "a sleek, sharp, chin-length bob, perfectly straight" },
    { label: "Lob (Long Bob) Bergelombang", value: "a trendy, shoulder-length long bob (lob) with soft waves" },
    { label: "Pixie Cut Elegan", value: "a chic and edgy pixie cut, framing the face beautifully" },
    { label: "Shag Modern Berlapis", value: "a modern shag haircut with lots of choppy layers and texture" },
    { label: "Poni Tirai (Curtain Bangs)", value: "long hair with stylish, face-framing curtain bangs" },
    { label: "Poni Rata (Blunt Bangs)", value: "a bold hairstyle with straight, blunt bangs across the forehead" },
    { label: "Lapisan Panjang (Long Layers)", value: "very long hair styled with soft, flowing layers for volume" },
    { label: "Gelombang Pantai (Beach Waves)", value: "effortless, tousled beach waves on long hair" },
    { label: "Kuncir Kuda Tinggi", value: "a powerful and sleek high ponytail" },
    { label: "Cepol Berantakan (Messy Bun)", value: "a casual and stylish messy bun with loose strands" },
    { label: "Sanggul Elegan (Elegant Updo)", value: "an intricate and elegant updo, suitable for a formal event" },
    { label: "Mahkota Kepang (Braided Crown)", value: "a beautiful braided crown or halo braid hairstyle" },
    { label: "Kepang Samping (Side Braid)", value: "a thick, romantic side-swept braid" },
    { label: "Lurus dan Mengkilap", value: "perfectly straight, long, and glossy 'glass hair'" },
    { label: "Ikal Bervolume", value: "big, bouncy, and voluminous curls" },
    { label: "Bob Asimetris", value: "an edgy, asymmetrical bob that is longer on one side" },
    { label: "Gaya Setengah Ikat", value: "a cute half-up, half-down hairstyle" },
    { label: "Cepol Atas (Top Knot)", value: "a trendy and neat top knot bun" },
    { label: "Gelombang Hollywood", value: "glamorous, old Hollywood-style waves, swept to one side" },
    { label: "Ikal Alami (Afro)", value: "beautifully defined natural curly or coily hair" },
    { label: "Wolf Cut", value: "a trendy, edgy wolf cut, a mix of a shag and a mullet" },
    { label: "Bixie (Bob-Pixie)", value: "a Bixie cut, the perfect blend between a bob and a pixie" },
    { label: "Rambut Kaca (Glass Hair)", value: "ultra-sleek, shiny, sharp-cut glass hair" },
    { label: "Kuncir Kuda Gelembung", value: "a playful and stylish bubble ponytail" },
    { label: "Warna Balayage", value: "a beautiful, natural-looking balayage hair color" },
    { label: "Warna Ombré", value: "a dramatic ombré hair color, transitioning from dark to light" },
    { label: "Warna Pastel", value: "a fantasy pastel hair color like lavender or baby pink" },
    { label: "Warna Merah Terang", value: "a vibrant and bold bright red hair color" },
    { label: "Rambut Basah (Wet Look)", value: "a high-fashion wet look hairstyle" },
    { label: "Kepang Boxer (Boxer Braids)", value: "two tight, neat Dutch braids (boxer braids)" },
];

export const SHOT_STYLE_TEMPLATES_FOR_BACKGROUND = [
    { label: 'Medium Shot (Default)', value: 'The scene is captured in a medium shot, showing the subject from the waist up.' },
    { label: 'Close-Up Shot', value: 'The scene is an intimate close-up shot, focusing tightly on the subject\'s expression.' },
    { label: 'Full Body Shot', value: 'The scene is a full body shot, capturing the subject from head to toe within the new environment.' },
    { label: 'Wide Angle Shot', value: 'The scene is a wide angle shot, showcasing the subject as a smaller part of the expansive new background.' },
    { label: 'Low Angle Shot', value: 'Shot from a dramatic low angle, making the subject appear powerful and dominant against the new background.' },
    { label: 'High Angle Shot', value: 'Shot from a high angle, looking down on the subject and giving a sense of scale or vulnerability in the new scene.' },
    { label: 'Dutch Angle Shot', value: 'The camera is tilted for a dynamic dutch angle shot, adding a sense of unease or energy to the scene.' },
    { label: 'Over-the-Shoulder Shot', value: 'An over-the-shoulder shot, as if the viewer is looking past another person (not visible) at the main subject.' },
    { label: 'Point of View (POV)', value: 'A point of view (POV) shot, making it seem like the viewer is seeing the scene through the subject\'s own eyes.' },
    { label: 'Drone / Aerial Shot', value: 'A breathtaking aerial shot as if taken from a drone, showing the subject from high above within the vast new landscape.' }
];
