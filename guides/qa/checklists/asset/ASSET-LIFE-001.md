# ASSET-LIFE-001 user test guide

This file is the tester's stable, repeatable click-by-click guide. It is not an
execution log: do not check off its steps or add current status, dates, IDs, or
machine-oracle evidence to it.

The complete journey is one testcase transaction. The Create, Edit, Trash and
Restore boundaries are replay savepoints inside that testcase, not separate
matrix rows.

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

Record the three visible `My Assets` type counters before the first Create.

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
5. Select Save exactly once. Confirm the editor closes and the new Transport
   card appears exactly once with a working image.

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
14. Open the Asset type selector and confirm the visible Transport,
    Accommodation and Supplies counters are each exactly `+1` from the three
    values recorded at startup.
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
    counter does not change.
21. Reopen that Transport with `Edit`. Confirm the edited Subtitle and the
    original ID-backed card data, category, capacity, quantity, details,
    source link and image all persist. Close without saving.
22. Reopen Accommodation and Supplies read-only-by-observation through `Edit`;
    both still contain their original values and images. Close both without
    saving.
23. Report this phrase and wait for Codex's persisted edit/control oracle:

    `ASSET-LIFE-001 Edit ready: Transport subtitle persists once`

## 3. Delete the Transport to Trash

24. After Codex confirms the `edited` boundary, open the Transport card menu.
25. Select `Delete`, then select `Delete` once in the confirmation dialog.
26. Without reloading, confirm the Transport card disappears and the visible
    Transport counter returns exactly to its startup value. Accommodation and
    Supplies remain visible and their counters remain at startup `+1`.
27. Open the Asset type selector. It must expose a `Trash` entry whose counter
    is exactly startup Trash `+1`; open it and confirm the deleted Transport is
    present exactly once with the edited Subtitle and a working image.

If the Asset selector has no `Trash` entry, its counter is absent/wrong, or the
trashed card cannot be opened, stop here and report the exact mismatch. This is
a checkpoint FAIL; do not ask Codex to expose the backend record or move it by
API/Mongo as a substitute for the missing product surface.

28. Report this phrase and wait for Codex's persisted Trash oracle:

    `ASSET-LIFE-001 Trash ready: same Transport is in Trash once`

## 4. Restore the same Transport identity

29. After Codex confirms the `trashed` boundary, open the trashed Transport's
    card menu and select `Restore` exactly once.

If no Restore action exists, stop and report the mismatch. Do not recreate the
Transport and do not use an API/Mongo workaround; a newly created Asset would
not prove identity preservation.

30. Confirm the card disappears from Trash, the Trash counter returns to its
    startup value, and the Transport counter returns to startup `+1`.
31. Return to Transport and confirm exactly one
    `QA ASSET-LIFE-001 Transport` card is visible with the edited Subtitle and
    working image. Accommodation and Supplies remain unchanged.
32. Report this phrase and wait for Codex's same-ID Restore oracle:

    `ASSET-LIFE-001 Restore ready: same Transport identity is active`

33. After Codex confirms `restored`, reload Casey exactly once.
34. Repeat the three type-list checks. Each target card appears once, all
    three active counters remain startup `+1`, Trash remains at startup, the
    Transport keeps the edited Subtitle, and the two controls keep their
    initial fields and images.
35. Report the terminal phrase:

    `ASSET-LIFE-001 UI complete after reload`

Wait for Codex's final persisted oracle. Do not reset or continue to another
Asset testcase until Codex records the outcome and restores this fixture.
