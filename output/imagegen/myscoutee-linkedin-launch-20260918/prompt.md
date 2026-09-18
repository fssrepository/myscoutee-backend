# LinkedIn launch cover

User preference: LinkedIn articles and cover copy must always be English.

Tool: built-in `image_gen`, edit mode. Final image: `cover.png`.

Logo source: `frontend/src/assets/logo/heart.png`. The logo replaces the capital M in the wordmark.

## Logo insertion prompt

Use case: compositing.
Asset type: English LinkedIn article cover, landscape approximately 16:9.
Input image 1 is the edit target: the English MyScoutee launch cover with six friends at a café.
Input image 2 is the exact original MyScoutee logo to insert: a colorful purple/blue M-shaped emblem with a white heart and gold star, on transparency.
Change ONLY the first capital M in the large MyScoutee wordmark. Remove that typographic M and replace it with the supplied logo, preserving the logo's exact shapes, heart, star and colors. The resulting wordmark must read visually as [LOGO]yScoutee, with no duplicate typed M and no gap inside the name. Size the emblem harmoniously with the existing capital height and align it to the wordmark; it may extend very slightly above and below the lettering.
Keep the remaining letters "yScoutee", all other text, faces, people, poses, table, background, lighting, colors and layout unchanged.
Keep exact English text: "NOW LIVE", "Shared experiences.", "Real connections.", "myscoutee.com".
No new elements or other logos. Do not redesign the logo or redraw it as a generic M. Preserve the same landscape composition.

## Final background repair prompt

Use case: precise-object-edit. Image 1 is the cover to repair; image 2 is its original full rectangular background reference.
Restore ONLY the missing/transparent/black irregular outer corners and edges of image 1 to the full background shown in image 2. The final output must be a FULLY OPAQUE rectangular LinkedIn cover, every pixel filled, no transparent pixels, no alpha cutouts, no vignette holes, no torn or feathered border. Top left is pale ivory/lavender, top right is the continuous cafe awning, bottom left is pale lavender and blurred foliage, bottom right is the cafe scene.
CRITICAL: preserve the [colorful M-shaped star-and-heart logo]yScoutee wordmark of image 1 exactly, all its English text, people, faces and composition. Do NOT restore the plain typed M from image 2. Image 2 is ONLY a reference for filling the outer background.
Keep exact text "NOW LIVE", logo followed by "yScoutee", "Shared experiences.", "Real connections.", "myscoutee.com". Full-bleed approximately 16:9 landscape.
