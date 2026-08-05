# Media image variants manual QA

Status: `MEDIA-IMG-001` PASS / CLOSED as an Event Editor subcase;
`ARTICLE-EDITOR-001` PASS / CLOSED
Last updated: 2026-08-05

## Contract

One uploaded managed image has one canonical persisted URL and four stored
objects: the original plus three WebP renditions.

| Rendition | Maximum bounding box | Intended use |
| --- | ---: | --- |
| `small.webp` | 128 x 128 | avatar, row and compact thumbnail |
| `medium.webp` | 640 x 640 | ordinary card and large editor slot/preview |
| `large.webp` | 1280 x 1280 | fullscreen card, Article body/viewer and chat attachment |

The resize preserves aspect ratio, applies orientation, strips metadata and
does not upscale a smaller source. The entity stores the canonical managed
image URL, normally `large.webp`. Rendering derives the requested object name
from that URL; it must not persist three copies of the URL in Event or Article
domain data.

External, `data:`, `blob:` and local-mode URLs have no managed rendition key and
must remain unchanged.

## `MEDIA-IMG-001` — Event Editor managed-image subcase

### Preparation

- Use the existing dev stack; do not start another server or frontend watcher.
- Prepare one clearly identifiable non-square JPEG or PNG large enough to
  exercise the 128, 640 and 1280 landscape or portrait bounds.
- Open browser Network tools and preserve the log.
- Record the source pixel dimensions, content type and file size.

### Event Editor upload

1. Open a new or disposable Event draft and upload the source once.
2. Require one successful upload response containing distinct `originalUrl`,
   `smallUrl`, `mediumUrl` and `largeUrl` values.
3. Open each returned URL directly and record its decoded dimensions and
   content type.
4. Require the large Event Editor image slot and ordinary event card to request
   `medium.webp`; a 128-pixel thumbnail must not be stretched across the editor.
5. Save, close and reopen the Event. Require the same image and rendition
   selection without another upload or duplicated domain URL.
6. Do not claim an Event fullscreen image check: the Event Activities surface
   has no fullscreen presentation control. Fullscreen card presentation belongs
   to the separate Rates surface.

### Recorded Event result

- Event ID: `manual-qa-checkpoint:v1:event-domain:event`.
- Source: PNG, 1853 x 919, 52,326 bytes.
- `small.webp`: 128 x 63, 242 bytes; `medium.webp`: 640 x 317,
  1,930 bytes; `large.webp`: 1280 x 635, 5,766 bytes.
- All four objects returned HTTP 200; the three renditions were WebP and kept
  the landscape aspect ratio within pixel rounding.
- Save/reopen retained one canonical `large.webp` URL in MongoDB and caused no
  second upload. The event card requested `medium.webp`.
- A fresh editor initially requested `small.webp` and rendered visibly blurred.
  The Event Editor now opts its large slot into `medium.webp`; the focused
  regression passed 3/3 and the reopened UI was sharp after hot deploy.
- Result: PASS / CLOSED. This is a separate subcase beside the already closed
  Event Editor create/save/reopen flow; it does not alter that flow's result.

## `ARTICLE-EDITOR-001` — Article save/reopen with image subcase

This is a separate owning editor checkpoint. Image upload is not an independent
producer case; it is one subcase of the Article Save operation.

1. Create one identifiable English Article with title, excerpt and HTML body.
2. Upload the managed image once as part of that draft, then Save once.
3. Reopen and require every field plus one canonical image URL to persist with
   no second upload.
4. Require the Article list card to request `medium.webp` and the admin Article
   viewer body to request `large.webp`.
5. Require persisted Article HTML/domain data to retain the canonical URL;
   rendition selection happens only while rendering.
6. Leave publish-to-landing behavior to `LANDING-ARTICLE-001`.

### Recorded Article result

- Draft: `Manual QA ARTICLE-SRC-002`, content key
  `idea-1785909541279`.
- Source: PNG, 1229 x 706, 119,898 bytes. `small.webp`: 128 x 74,
  556 bytes; `medium.webp`: 640 x 368, 6,948 bytes; `large.webp`:
  1229 x 706, 20,462 bytes. All four objects returned HTTP 200.
- Save/reopen retained one canonical `large.webp` URL in `imageUrl`,
  `imageUrls` and Article HTML. The list requested `medium.webp`; the admin
  viewer requested `large.webp` and rendered it without a broken link.
- Removing an image without replacement removed its HTML reference, persisted
  empty image fields, and deleted `original` plus all three renditions (all
  returned HTTP 404 afterward) while retaining the Article body.
- Copying raw HTML from a rendered code snippet initially pasted a `<code>`
  wrapper; the editor now prefers plain-text HTML fragments and preserves raw
  URL pastes inside existing tags. Focused frontend coverage passed 5/5; the
  focused Article service coverage passed.
- Result: PASS / CLOSED. Publication and landing propagation remain owned by
  `LANDING-ARTICLE-001`.

## Deferred owning-editor split

Admin Help image behavior belongs under a future Help Editor save/reopen case,
not under `MEDIA-IMG-001` or `ARTICLE-EDITOR-001`.

### Independent media oracle

The case passes only when all of these are true:

- all three managed renditions exist, are WebP and have the documented maximum
  dimensions while preserving aspect ratio;
- the original remains retrievable in its original format;
- Network requests match the screen mapping above;
- save/reload preserves one canonical domain URL;
- a deliberately external image URL remains unchanged;
- a missing rendition is a failure, not a successful upload silently mapped to
  the original for all sizes;
- no extra server, watcher or build process was started for the test.

Record the owning entity ID, the four returned URLs, decoded dimensions and one
Network screenshot for each distinct screen class exercised by that editor.

## Automated evidence and remaining gap

- Backend controller coverage verifies the response fields but uses a mocked
  image set.
- Backend HTTP E2E requires four distinct URLs and retrieves all three WebP
  renditions. The service now fails and removes a partial set instead of
  reporting an original-only fallback as success. Exact dimensions are not yet
  decoded by the automated test.
- Frontend unit coverage verifies managed URL rewriting, Article HTML rewriting
  and the shared carousel's `small`/`medium` selection.
- Exact decoded dimensions and each owning editor's Network mapping remain
  manual until a real-image backend integration test and browser E2E are added.
