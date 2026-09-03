# ASSET-LIFE-001 user test guide

This file is the tester's stable, repeatable click-by-click guide. It is not an
execution log: do not check off its steps or add current status, dates, IDs, or
machine-oracle evidence to it.

The complete journey is one testcase transaction. The Create, Edit and Delete
boundaries are replay savepoints inside that testcase, not separate matrix
rows.

## Actor and startup

- Perform every action in the isolated **Casey** window opened by Codex.
- Use the HTTP-backed dev stack and the normal `My Assets` UI. Do not create
  replacement browser profiles or use an API, MongoDB, local adapter, or
  fixture command to perform an Asset lifecycle action.
- For each image upload, select the versioned source file
  `guides/qa/manuals/img/myscoutee-heart.png`. Wait for the uploaded preview
  before selecting Save. Each Asset must receive its own managed media identity.
- Keep Pricing Off, Lending Policies Off and Visibility `Public` for all three
  Assets. Change only fields explicitly named below.
- Stop at the first mismatch. Do not compensate with a second Save, Delete,
  Restore, upload, reload, or renamed test Asset.

To start a complete replay, tell Codex:

`Prepare the ASSET-LIFE-001 user test.`

Begin only after Codex confirms all of the following:

- the three `QA ASSET-LIFE-001 ...` titles are absent for Casey;
- the stored Transport, Accommodation and Supplies counters equal their
  authoritative active Asset counts;
- the checkpoint is at `baseline-ready`;
- one isolated Casey window is open.

Record the three visible `My Assets` type counters in both the Asset type
selector and the side menu before the first Create.

## 1. Create the three type controls

### Transport

1. Open Casey's menu, then `My Assets → Transport`.
2. Select the green `+` action exactly once.
3. Fill the form with these exact values:

   - Title: `QA ASSET-LIFE-001 Transport`
   - Subtitle: `Initial shared-field value`
   - Category: `Sedan`
   - Total capacity: `4`
   - Quantity: `2`
   - Source link: `https://example.com/qa/asset-life-001/transport`
   - Details: `Manual QA Transport lifecycle control.`

4. Upload the versioned image once and wait for its preview.
5. Select Save exactly once. Without reloading, confirm the editor closes, the
   new Transport card appears exactly once with a working image, and the
   Transport counter is startup `+1` in both the Asset type selector and the
   side menu.

### Accommodation

6. In the Asset type selector choose `Accommodation`, then select the green
   `+` action exactly once.
7. Fill the form with these exact values:

   - Title: `QA ASSET-LIFE-001 Accommodation`
   - Subtitle: `Initial shared-field value`
   - Category: `Apartment`
   - Total capacity: `6`
   - Quantity: `3`
   - Source link: `https://example.com/qa/asset-life-001/accommodation`
   - Details: `Manual QA Accommodation lifecycle control.`
   - Location: select one non-empty Austin result from the Location control;
     do not leave raw, unselected search text in the field.

8. Upload the versioned image once and wait for its preview.
9. Select Save exactly once. Confirm the editor closes and the new
   Accommodation card appears exactly once with its selected Location and a
   working image.

### Supplies

10. In the Asset type selector choose `Supplies`, then select the green `+`
    action exactly once.
11. Fill the form with these exact values:

    - Title: `QA ASSET-LIFE-001 Supplies`
    - Subtitle: `Initial shared-field value`
    - Category: `Safety`
    - Total capacity: `12`
    - Quantity: `8`
    - Source link: `https://example.com/qa/asset-life-001/supplies`
    - Details: `Manual QA Supplies lifecycle control.`

12. Upload the versioned image once and wait for its preview.
13. Select Save exactly once. Confirm the editor closes and the new Supplies
    card appears exactly once with a working image.
14. Confirm the visible Transport, Accommodation and Supplies counters are
    each exactly `+1` from startup in both the Asset type selector and the side
    menu. Do not reload to obtain either update. Each list-card image must use
    the maximum available area without cropping or stretching.
15. Reopen each card with `Edit`, one at a time, without changing anything.
    Confirm the exact type-specific values and uploaded image return. For
    Accommodation, the selected Location returns; Transport and Supplies do
    not acquire an Accommodation Location field. Close each editor without
    saving.
16. Report this phrase and wait for Codex's identity, schema, media and counter
    oracle:

    `ASSET-LIFE-001 Create ready: three type controls persist`

## 2. Edit one shared Transport field

17. After Codex confirms the `created` boundary, return to `Transport`.
18. Open only `QA ASSET-LIFE-001 Transport` with `Edit`.
19. Change only Subtitle from `Initial shared-field value` to
    `Edited shared-field value`.
20. Select Save exactly once. Confirm one Transport card remains and its type
    counter does not change in either the Asset type selector or the side menu.
21. Reopen that Transport with `Edit`. Confirm the edited Subtitle and the
    original ID-backed card data, category, capacity, quantity, details,
    source link and image all persist. Close without saving.
22. Reopen Accommodation and Supplies read-only-by-observation through `Edit`;
    both still contain their original values and images. Close both without
    saving.
23. Report this phrase and wait for Codex's persisted edit/control oracle:

    `ASSET-LIFE-001 Edit ready: Transport subtitle persists once`

## 3. Delete the Transport

24. After Codex confirms the `edited` boundary, open the Transport card menu.
25. Select `Delete`, then select `Delete` once in the confirmation dialog.
26. Without reloading, confirm the Transport card disappears and its counter
    returns exactly to startup in both the Asset type selector and the side
    menu. Accommodation and Supplies remain visible and their counters remain
    at startup `+1`.
27. Report this phrase and wait for Codex's persisted Delete oracle:

    `ASSET-LIFE-001 Delete ready: Transport is removed once`

Asset deletion is terminal in the current `My Assets` UI. Do not look for a
Trash selector or Restore action; backend retention is not a user-facing
lifecycle step.

28. After Codex confirms `deleted`, reload Casey exactly once.
29. Confirm Transport remains absent with its counter at startup in both
    counter surfaces. Accommodation and Supplies each remain present once at
    startup `+1`, with their initial fields and maximally contained,
    uncropped, unstretched images.
30. Report the terminal phrase:

    `ASSET-LIFE-001 UI complete after reload`

Wait for Codex's final persisted oracle. Do not reset or continue to another
Asset testcase until Codex records the outcome and restores this fixture.
