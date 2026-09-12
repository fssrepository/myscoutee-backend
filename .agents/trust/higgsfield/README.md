# Higgsfield production continuity

Scope: MyScoutee film production in Higgsfield, including prompts, Elements,
reference checks, downloaded media and production reporting. This is a separate
domain within the trust library, not the application's manual-QA workflow.
Read [review provenance](history-review.md) only when recovering history or
checking why a rule exists. Latest explicit user instructions take precedence.

## Resume the actual task

- Keep the active clip, requested elements, pending additions and last accepted
  result together. An IDE tab or status question does not advance the clip.
- Chat in Hungarian; write repository prompts, imports, trackers, briefs and
  support drafts in English unless explicitly requested otherwise.
- In this established workflow, "generate again" means prepare the revised
  Higgsfield prompt when the user is operating generation. Do not spend credits,
  generate elsewhere, upload or publish merely because a prompt is requested.
  Explicit authorization to perform an external action overrides this default.
- Do not open files or switch editor tabs without a current explicit request.
  This supersedes the earlier request to always open the next prompt.
- Do not revert user work or restore an old prompt automatically. Read the diff
  and Git history to identify the narrowly requested change. A P03-specific
  opening correction does not authorize rewriting every later opening.
- Keep `draft`, `production`, `prerelease` and `shortened` roles distinct. Update
  the requested artifact; do not sync experimental differences over production.
  Create a new file when requested, otherwise prefer the existing owning file.

## Element imports and replacements

1. An import contains exactly the requested elements: name, type and one short
   identifying description each. Image-generation detail belongs in its own
   prompt, not the import. Do not embed character IDs, nested prop descriptions,
   old/new UUID tables, deletion instructions or a production diary in it.
2. Use additions or replacements only, not a full-library reimport. If asked
   what to delete, give the exact old handles for that requested set. Listing
   deletion targets does not itself delete them.
3. Inspect the importer preview when available. Two Markdown sections do not
   prove two extracted elements: the P06 preview extracted five because it also
   interpreted the described characters and fingerprint props as elements.
4. After "imported" or "attached", use the available Higgsfield MCP read tools
   to resolve actual names, UUIDs and media attachments. Names can keep `s0_v1`,
   change to `s1_v1`/`s2_v1`, or lose a prefix. Never manufacture the new handle.
5. Compare the live handle with the specified clip. Update only changed
   references. A new UUID with the same handle can leave the text correct;
   explain that result rather than making an unrelated edit to show activity.
6. Inspect every attachment of the affected element, including its description.
   Adding a replacement may leave the rejected image attached alongside it.
   When asked to inspect the image, view the actual new media; an attachment ID
   or an old thumbnail is not a visual review.

## Evidence for a reference check

Keep these distinct: local prompt handle; live Element identity; attached image;
project membership; composer selection; eligibility result; completed output.
The evidence for one does not automatically establish the next.

- Start a known-problem review with the local
  [Face/IP tracker](../../../guides/story/london/cinema_studio_steps/04_tracking/FACE_IP_ELIGIBILITY_REVIEW.md)
  and the active clip. Use MCP for the requested live check, with pagination as
  needed. Filter results to relevant fields instead of dumping the whole library.
- `completed` on an Element does not prove an attached image exists or that
  video eligibility passed. `ip_checking`, a slow check, Face/IP rejection,
  NSFW rejection and a generic Failed generation are different observations.
- Cinema Studio's observed `@` autoload avoids manual handle transcription.
  Do not assume Extend has the same control. If the user already attached the
  replacement, do not instruct them to attach it again without contrary evidence.
- For a screenshot check, inspect all supplied views, reference count, warning
  icons, duration, resolution, aspect ratio, audio, outputs and displayed price.
  The hover `×` is a removal control. No visible warning means no visible warning;
  it neither invents a blocker nor guarantees the next generation's acceptance.
- State what MCP actually exposes. Missing browser access does not prevent an
  available MCP check; a local file check is not a live composer inspection.
  Ask for missing evidence only if it blocks the requested conclusion.

## Prompt preparation and experiments

- Preserve named events, identities, wardrobe, material stages, reference roles,
  timing and sound unless their alteration is requested. Shorten repetition
  before concrete detail; never substitute local storyboard prose that the
  model will not receive for necessary instructions in the pasted prompt.
- Put a readable image ID, selected resolution, aspect ratio and single-image
  or grid layout at the top of image prompts. Distinguish whole-sheet resolution
  from panel resolution and requested settings from actual downloaded dimensions.
- For the current production route, use the observed 15,000-character and
  30-reference working limits, including the predecessor frame. These are
  interface observations, not proven model limits. Count unique handles and
  attached images separately. Check current controls when they change.
- If a clip exceeds capacity, preserve its story and examine repartitioning
  before dropping detail or references. Existing sheets are used whole; the
  accepted workflow does not require panel crops or another paid storyboard set.
- The agreed prerelease diagnostic starts as an exact production prompt copy.
  Its 4 s / 480p values are UI test settings; original beat times intentionally
  remain. Change one nominated variable, including removing its textual handle
  and checking its attachment. Do not "fix" this intentional timing mismatch.
- Diagnose benign-content rejections from the actual prompt, images and error.
  A clothed statue replacement must preserve the requested garment through all
  intermediate states. Do not treat a suspected image as a proven filter cause,
  conflate NSFW with Face/IP, or start an unrequested paid retry campaign.
- Preserve the London film's established photographic, solid-material and
  embodied-memory direction, distinct grid states, current-city decimal cards,
  card-free memories and delayed protagonist-score reveal. Load the current
  [creative direction](../../../guides/story/london/cinema_studio_steps/00_project/LOOK.md)
  and relevant source prompts for exact requirements, not older Flow defaults.

## Media and reporting

- For downloaded video, final-frame extraction, sound or seam work, read
  [media handling](media-handling.md). A review alone does not authorize an edit.
- Keep one current row per affected element in the Face/IP tracker: original
  issue, replacement/binding state, acceptance and remaining action. Separate
  "needs a new image" from "new image attached, acceptance pending". Repeated
  use of one element in multiple clips is not multiple unique failures.
- Public statistics stay short and reproducible. Distinguish unique failed
  elements, pending checks, generation jobs and folder counts; do not add unlike
  units. A refund is recorded only when reported or evidenced.
- Recalculate budget from actual remaining clip durations and current prices;
  never assume every clip is 15 seconds. Do not carry an obsolete balance,
  promotion or Unlimited setting forward as a fact.
- For shortening metrics, follow the existing
  [assessment method](../../../guides/story/london/cinema_studio_steps/03_film/shortened/README.md).
  Text reduction, story adherence, detail loss and visible reference resemblance
  need separate denominators. Visible resemblance is not internal model usage;
  a shorter retrospective description is not a tested equivalent prompt.
- A brief/support report states the operation, expected and observed result,
  evidence and practical effect. Keep measured defects definite while marking
  unknown internal causes. Writing a support draft does not send it.
