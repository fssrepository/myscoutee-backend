# MyScoutee YouTube banner

Tool: built-in `image_gen`.

Final source image: `banner.png`, the accepted final generation with the corrected logo and central layout. Final upload file: `youtube-banner-2560x1440.jpg`, resized from that same final generation to 2560×1440 with ImageMagick and exported as quality-95 JPEG.

Free-to-join source variant: `banner-free-to-join.png`. Matching upload file:
`youtube-banner-free-to-join-2560x1440.jpg`, resized to 2560×1440 and exported
as quality-95 JPEG. The accepted originals remain unchanged.

## Production correction

Edit image 1, the full scenic MyScoutee banner. Image 2 is the exact original logo and must be reproduced faithfully, not simplified into a generic rounded M.
Preserve the gorgeous full landscape illustration, clouds, colors, people, café, lake and panoramic framing.
Correct these three production details:
1. Replace the generic M symbol to the left of yScoutee with the EXACT emblem from image 2, including the angular blue and violet folded-wing M silhouette, large white heart cutout, magenta lower glow and yellow five-pointed star with orange/pink edging. Do not simplify or redesign its silhouette. The emblem substitutes for capital M, followed by white "yScoutee".
2. Fit ALL branding into the centered horizontal crop band. On the current 1672x941 image, ALL of the logo including star, the wordmark, the tagline and URL must be between y=365 and y=575 and between x=365 and x=1307. Place the logo and wordmark between y=376 and y=470, with logo roughly 100x100 pixels. Tagline baseline around y=511, URL baseline around y=546. Wordmark horizontally centered and about 590px wide including logo. This means move the wordmark DOWN and reduce the logo. Text exactly "yScoutee", "Shared experiences. Real connections.", "myscoutee.com". This tight central layout is essential for a usable YouTube banner. No other text.
3. Remove the wooden signpost on the right and replace it seamlessly with matching landscape. Remove the café chalkboard on the left and fill its area with matching café/flowers/stone scenery. Preserve everything else.
Output a fully opaque 16:9 banner, ideally 2560x1440 pixels, without any crop guides or borders.

## Final layout correction

One precise layout correction to this existing image, preserve everything else pixel-for-pixel as much as possible. The entire central branding group (colorful logo INCLUDING golden star, white yScoutee text, tagline and URL) is currently TOO HIGH. Translate that whole group DOWN by 90 pixels in this 1672x941 canvas, keeping its exact current size, horizontal position, logo design and typography. Its current approximate bounds are x580..1100 y300..488. Its NEW bounds must be x580..1100 y390..578. The top of the golden star MUST be at y390, below the horizontal center of the open blue sky. The URL bottom MUST be at y578, just above the lake. Restore the old group's vacated area with seamless blue sky. Preserve the background landscape, café, friends, mountains, flowers and clouds. Do not change the words or introduce anything. Exact text remains logo+"yScoutee", "Shared experiences. Real connections.", "myscoutee.com". This deliberate lowered central placement is required for YouTube cropping.

Reference: user-provided YouTube banner settings screenshot, used as visual inspiration only; original logo at `frontend/src/assets/logo/heart.png`.

## Generation prompt

Use case: ads-marketing.
Create one finished, richly layered MyScoutee YouTube channel banner as a flat full-bleed image, 2560 x 1440 pixels, 16:9. Use the screenshot supplied in this conversation ONLY as visual inspiration for the little banner inside it: luminous blue-violet fantasy sky, peach and lavender clouds, warm golden sunlight, small floating hearts and sparkles, welcoming green landscape. Do not reproduce the screenshot, settings interface, device mockups, borders, buttons, or UI.
The other supplied image is the original MyScoutee logo: a blue-violet M-shaped emblem with a white heart-shaped center and a glowing golden five-pointed star at its top. Preserve this recognizable design faithfully.
Create a sophisticated, detailed, panoramic illustration, charming painterly 3D animation aesthetic, crisp crafted detail and atmospheric depth, aspirational and welcoming, not childish. A continuous scenic world with winding paths through green hills and lush flowering gardens, a friendly café terrace toward the lower left, small groups of adult friends chatting and enjoying an outdoor gathering toward the lower right, distant sunlit mountains, subtle sparkling trails and a few floating pink heart shapes in the upper sky. These are environmental supporting details, coherent integrated scenery, not collage panels. Deep cornflower blue and luminous violet sky behind the center, pastel clouds around the outside, golden afternoon highlights, fresh green ground, delicate pink floral accents. Rich detail at the edges, calmer readable central sky.
CRITICAL YOUTUBE CROP COMPOSITION: all branding and all text must fit in the central rectangle x=560 to 2000 and y=555 to 885 on the 2560x1440 canvas. The scenic background fills every pixel and extends naturally above, below and to both sides. Do not draw safe-zone lines. Keep the wordmark compact, centrally aligned, no taller than about 180 pixels. Place the exact supplied star/heart M logo immediately before the white text "yScoutee", to read visually as MyScoutee. NO typed capital M, no duplicated M, no space splitting the name. Logo and letters form one centered horizontal wordmark with polished modern rounded sans-serif lettering, legible at small sizes. Preserve the white heart and the golden star, no substitutions.
Under the wordmark inside the safe zone, use the exact one-line tagline in smaller elegant white type: "Shared experiences. Real connections."
Under that, still inside the safe zone, small clear white text: "myscoutee.com"
Keep all essential type centered and comfortably away from cropping boundaries, without a panel or dark rectangular box. No additional words, no launch badges, no calls to subscribe, no watermark. Fully opaque rectangular finished banner.

## Free-to-join variant prompt

Use case: precise marketing-text addition to `banner.png`. Preserve the scenic
background, café, all people and faces, flowers, lake, mountains, clouds,
lighting, colors, emblem, wordmark, tagline, URL, aspect ratio and composition.
Add one small premium rounded pill reading exactly `FREE TO JOIN` on the same
horizontal row as `myscoutee.com`, immediately to its right with a modest gap.
Keep the combined row centered and wholly inside the central YouTube safe crop.
Use a subtle luminous lavender/violet fill with legible white uppercase text.
Add no other text and do not alter or duplicate the logo.
