# Media image variants manual QA

Status: `MEDIA-IMG-001` not run
Last updated: 2026-08-05

## Contract

One uploaded managed image has one canonical persisted URL and four stored
objects: the original plus three WebP renditions.

| Rendition | Maximum bounding box | Intended use |
| --- | ---: | --- |
| `small.webp` | 128 x 128 | avatar, row and editor carousel slot |
| `medium.webp` | 640 x 640 | ordinary card and editor preview |
| `large.webp` | 1280 x 1280 | fullscreen card, Article body/viewer and chat attachment |

The resize preserves aspect ratio, applies orientation, strips metadata and
does not upscale a smaller source. The entity stores the canonical managed
image URL, normally `large.webp`. Rendering derives the requested object name
from that URL; it must not persist three copies of the URL in Event or Article
domain data.

External, `data:`, `blob:` and local-mode URLs have no managed rendition key and
must remain unchanged.

## `MEDIA-IMG-001` — upload once, request the correct rendition everywhere

### Preparation

- Use the existing dev stack; do not start another server or frontend watcher.
- Prepare one clearly identifiable JPEG or PNG larger than 1600 x 1200 with a
  non-square aspect ratio and visible orientation marker.
- Open browser Network tools and preserve the log.
- Record the source pixel dimensions, content type and file size.

### Event Editor upload

1. Open a new or disposable Event draft and upload the source once.
2. Require one successful upload response containing distinct `originalUrl`,
   `smallUrl`, `mediumUrl` and `largeUrl` values.
3. Open each returned URL directly and record its decoded dimensions and
   content type.
4. Require the carousel slot request to end in `small.webp` and the selected
   editor preview request to end in `medium.webp`.
5. Save, close and reopen the Event. Require the same image and rendition
   selection without another upload or duplicated domain URL.
6. Open the Event in an ordinary list/card and fullscreen presentation.
   Require `medium.webp` for the card and `large.webp` for fullscreen.

### Admin Article reuse

1. Create a disposable Article and upload the same source through its shared
   image carousel.
2. Require `small.webp` in carousel slots and `medium.webp` in the editor
   preview.
3. Insert a managed image URL into the Article body, save, reopen and publish.
4. Require the Article list card to request `medium.webp` and both the admin
   viewer and public Article body to request `large.webp`.
5. Require the persisted Article HTML/domain DTO to retain the canonical URL;
   rendition selection happens only while rendering.

### Admin Help reuse

1. Upload the same source into one disposable Help section.
2. Require the shared carousel to use `small.webp` for slots and `medium.webp`
   for its editor preview.
3. Save and reopen. Require no repeated upload and no broken image placeholder.

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

Record Event ID, Article ID, Help section ID, the four returned URLs, decoded
dimensions and one Network screenshot for each distinct screen class.

## Automated evidence and remaining gap

- Backend controller coverage verifies the response fields but uses a mocked
  image set.
- Backend HTTP E2E requires four distinct URLs and retrieves all three WebP
  renditions. The service now fails and removes a partial set instead of
  reporting an original-only fallback as success. Exact dimensions are not yet
  decoded by the automated test.
- Frontend unit coverage verifies managed URL rewriting, Article HTML rewriting
  and the shared carousel's `small`/`medium` selection.
- Exact decoded dimensions and the cross-screen Network mapping remain manual
  until a real-image backend integration test and browser E2E are added.
