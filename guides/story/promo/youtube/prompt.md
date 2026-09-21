# MyScoutee YouTube banner

Tool: built-in `image_gen`.

Final source image: `banner.png`, the accepted final generation with the corrected logo and central layout. Final upload file: `youtube-banner-2560x1440.jpg`, resized from that same final generation to 2560×1440 with ImageMagick and exported as quality-95 JPEG.

The accepted `banner.png` and upload file `youtube-banner-2560x1440.jpg` now
include FREE TO JOIN and replace the previous versions.

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


## Landing-copy update — 2026-09-21

Tool: built-in image_gen, edit mode. Saved over existing asset `banner.png` at the user's request; no separate output directory.
Current exact copy:
- 6 people · 6 priority lists → 1 team
- Standard · Tournament · Speed dating

Final generation prompt:

Use case: text-localization. Edit the supplied scenic MyScoutee YouTube banner. Preserve the exact 16:9 landscape composition and all landscape artwork, people, cafe, flowers, lake, mountains, sky, colors and lighting. Add two exact English text lines to the central branding group: "6 people · 6 priority lists → 1 team" and beneath it "Standard · Tournament · Speed dating". Keep all original branding and copy: exact emblem+yScoutee wordmark, "Shared experiences. Real connections.", "myscoutee.com" and "FREE TO JOIN". CRITICAL: all logo and lettering including star and badge must fit inside the CENTERED crop-safe rectangle spanning x=22% to 78% and y=39% to 61% of the image. Arrange a compact central lockup: smaller faithful logo+wordmark at top, original tagline below, the two new lines below that, URL and free badge on bottom row. Use readable white type with subtle contrast, each new text line unbroken. Reduce wordmark size to create room, but do not shrink text to illegibility. Keep complete logo star and heart, no duplication or redesign. Restore any vacated background seamlessly. Do not add other text, panels, borders or crop guides. Fully opaque image.

Layout correction prompts:

Use case: precise-object-edit. Correct ONLY central branding layout in the supplied banner. Current full image is 1672x941. Its logo star starts around y=286 and WILL BE CROPPED. ALL branding must lie within x=400..1272, y=370..570. Re-layout the entire branding stack in this exact 200-pixel-high region. Logo+wordmark top row y=373..435, make emblem including star only 62 pixels high; original tagline baseline y=459; new first line baseline y=489; new second line baseline y=519; URL and FREE TO JOIN badge row y=535..564. These are hard pixel-position limits. Center all rows around x=836. Exact copy: emblem followed by "yScoutee"; "Shared experiences. Real connections."; "6 people · 6 priority lists → 1 team"; "Standard · Tournament · Speed dating"; "myscoutee.com"; "FREE TO JOIN". Preserve white type, exact colorful star/heart emblem, purple badge, all existing scenic background and people. Erase the former oversized high branding and restore blue sky seamlessly. Do not add words, shapes or guides. Output same 1672x941 opaque image.

Edit ONLY the placement of the central logo and text group. Move the ENTIRE branding group DOWN by exactly 90 pixels on this 1672x941 image. Current top of golden star is y=276; new top MUST be y=366. Current bottom of FREE TO JOIN badge is y=502; new bottom MUST be y=592. Do not resize, redesign or rearrange anything. Translate all six elements together DOWN: emblem and yScoutee; Shared experiences. Real connections.; 6 people · 6 priority lists → 1 team; Standard · Tournament · Speed dating; myscoutee.com; FREE TO JOIN. The wordmark should appear at the vertical middle of the full image, above the lake, NOT in the upper sky. Fill the old position with seamless blue sky. Preserve entire landscape and all people exactly. This is a pure DOWNWARD translation, crucial for crop safety.

Final upload export: youtube-banner-2560x1440.jpg, ImageMagick resize to 2560x1440, JPEG quality 95. Text and logo visually reviewed in the central crop; no platform upload performed.


## Speed dating label update — 2026-09-21

Tool: built-in `image_gen`, edit mode. Replaced the existing asset.

Final edit prompt:

Use case: text-localization. Input image is the EDIT TARGET. Replace ONLY the word "Mingle" with exactly "Speed dating" (capital S, lowercase d). The complete corrected line must read verbatim "Standard · Tournament · Speed dating". YouTube landscape banner. Retain 1672x941 dimensions and exact framing. Keep the edited line centered at its existing vertical position in the central branding group; preserve all branding position and scale and existing crop safety. Match the existing typography, weight and color. Preserve EVERYTHING ELSE: all artwork, people, faces, profile cards, logo emblem and wordmark, backgrounds, lighting, icons, slider, every other text and badge, layout and aspect ratio. Do not add or remove anything else. Deliver one complete opaque edited image.


## Readability panel — 2026-09-21

Current accepted version: a closely fitted, rounded, translucent dark-indigo panel behind the central branding block. This supersedes the earlier no-panel constraint. Tool: built-in `image_gen`, edit mode. Saved to `banner.png`; refreshed `youtube-banner-2560x1440.jpg` with ImageMagick, JPEG quality 95. Visually checked panel fit and all existing copy.

Final edit prompt:

Use case: precise-object-edit. Input image is the EDIT TARGET: existing MyScoutee YouTube banner, 1672x941. Make exactly one change: add ONE closely fitted rounded rectangle backdrop behind the entire central logo and text block to improve contrast. Panel bounds approximately x=616 to 1056, y=322 to 578 on this 1672x941 canvas, with modest 16–20px padding around existing content and 20px corner radius. The panel must be only as large as this existing content block, never a wide horizontal band, never extending across scenery. Use deep dark plum/indigo (#21163F) with approximately 60% opacity: the original sky and mountains remain visibly translucent through it. Clean flat tinted translucent panel, no ornamental border, no heavy shadow or glow. All logo and text stay ABOVE this panel, sharp, bright and fully opaque. Preserve EXACTLY their current positions, sizes, typography and wording: original colorful heart-and-star emblem followed by "yScoutee", "Shared experiences. Real connections.", "6 people · 6 priority lists → 1 team", "Standard · Tournament · Speed dating", "myscoutee.com", purple "FREE TO JOIN" badge. Do not shift, resize, reflow or redesign any content. Preserve entire scenic background, people, cafe, flowers, sky, mountains, lake, framing and colors outside the small panel. Output same 1672x941 full-bleed opaque image; only the panel appears translucent over the artwork, not the image canvas.
