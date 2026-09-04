# CONTENT-ADMIN-LIFECYCLE-001 user test guide

This file is the tester's stable, repeatable click-by-click guide. It is not an
execution log: do not check off its steps or add current dates, IDs, status or
machine evidence to it.

The complete journey is one testcase transaction. `drafts-saved`,
`privacy-active`, `privacy-fallback`, `article-trashed`, `article-restored` and
`article-republished` are replay savepoints inside this testcase, not separate
matrix rows.

## Actors and startup

- **Ava** performs every Admin Content and Admin Article mutation.
- **Kai** is the retained already-open public/member client and owns the
  consent action.
- **Riley** is the fresh public/member control and must not receive Kai's
  consent or another actor's state.
- Codex stages the governed revisions, historical consents, disposable
  article, managed media and isolated browser sessions, then runs every
  independent machine oracle. Do not create replacement content, articles,
  users, media or browser profiles.
- Stop at the first mismatch. Do not compensate with a second Save, Activate,
  Delete, Approve privacy, Move to trash, Restore, Publish or unlisted reload.

To start a complete replay, tell Codex:

`Prepare the CONTENT-ADMIN-LIFECYCLE-001 user test.`

Begin only after Codex confirms this exact baseline:

- governed content contains active Help HU `v1`, Terms EN `v1`, Home cards
  Explanation EN `v1`, and Privacy EN `v2`; Privacy EN `v1` is the newest
  inactive fallback;
- no fixture-owned Help `v2`, Terms `v2`, Explanation `v2` or Privacy `v3`
  exists, and every content scope has exactly one active revision;
- Kai and Riley each have immutable historical Privacy `v1` consent and valid
  current Privacy `v2` consent, but no Privacy `v3` consent;
- `QA CONTENT-ADMIN-LIFECYCLE-001 Article` is one English, published,
  non-featured article with a canonical managed image set and is visible once
  publicly; its exact All/Featured/Published/Drafts/Trashed counts are reported;
- `QA CONTENT-ADMIN-LIFECYCLE-001 Featured Control`, the pre-stage presence or
  absence of the previously proven `ARTICLE-SRC-002` record, and all
  non-fixture content are unchanged controls;
- isolated Ava, Kai and Riley windows are open and identity-verified.

## Complete test journey

### 1. Create four bounded inactive revisions

1. In **Ava**, open `Admin -> Configuration -> Content`.
2. Select `Help`, then `Magyar`. Confirm Help `v1` is marked `Active` and its
   `Activate revision` action is disabled.
3. Select `Edit revision` on Help `v1`. Confirm an editable `v2` draft appears
   while `v1` stays Active.
4. Change only these values:

   - title: `QA CONTENT Help HU v2`;
   - Header: `QA Content súgó`;
   - Description: `QA only Help draft`;
   - first section title: `QA súgó szakasz`;
   - first section HTML: `<p>QA help draft HU.</p>`.

5. Select `Save v2` exactly once. While saving, confirm the action-ring is
   visible and another save cannot be started.
6. Confirm Help `v2` is present once and inactive; Help `v1` remains Active.
7. Select `Terms`, then `English`, and edit active Terms `v1` into `v2` with:

   - title: `QA CONTENT Terms EN v2`;
   - Header: `QA Content terms`;
   - Description: `QA only Terms draft`;
   - first section title: `QA terms section`;
   - first section HTML: `<p>QA terms draft EN.</p>`.

8. Select `Save v2` once and confirm Terms `v2` is inactive while `v1` stays
   Active.
9. From `Explanations`, select `Home cards`, keep `English`, and edit active
   Explanation `v1` into `v2` with:

   - title: `QA CONTENT Home cards EN v2`;
   - Header: `QA Content explanation`;
   - Description: `QA only Home cards draft`;
   - first section title: `QA home-card explanation`;
   - first section HTML: `<p>QA explanation draft EN.</p>`;
   - panel span: `span-2`.

10. Confirm the canonical screen remains `Home cards`, select `Save v2` once,
    and verify only that exact Explanation context received inactive `v2`.
11. Select `Privacy`, then `English`, and edit active Privacy `v2` into `v3`.
12. Set title `QA CONTENT Privacy EN v3`, Header `QA Content privacy update`,
    Description `QA privacy consent boundary`, and header color `blue`.
13. Keep the first section Mandatory, rename it `Required QA notice`, and set
    its HTML to:

    `<p onclick="qaUnsafe()"><strong>QA privacy v3</strong></p><script>qaUnsafe()</script>`

14. Edit the existing second section: rename it `QA research choice`, set its
    HTML to `<p>Optional QA research consent.</p>`, and keep it `Optional`. Do
    not add a third section.
15. Switch both sections to Preview once. Confirm no script, alert, navigation
    or other active content executes and the mandatory/optional presentation is
    distinct.
16. Select `Save v3` exactly once. Confirm Privacy `v3` appears once and is
    inactive; Privacy `v2` remains Active.
17. Close Content, reopen it, then reload Ava exactly once. Recheck all four
    document/language/context combinations. Every new revision and value must
    persist once, remain inactive, and retain the correct base revision.
18. In **Kai**, open Settings -> Privacy, Help and Terms. Confirm the public
    versions are still Privacy `v2`, Help HU `v1` and Terms EN `v1`; no draft
    text is public and no new consent is requested.
19. Report and wait for Codex's persisted revision/audit/sanitization oracle:

    `CONTENT-ADMIN-LIFECYCLE-001 drafts saved: four inactive revisions, public content unchanged`

### 2. Activate Privacy once and prove the consent boundary

20. After Codex confirms `drafts-saved`, leave Kai's Privacy `v2` popup open.
21. In Ava, reopen Content -> Privacy -> English. Confirm `v3` exposes enabled
    `Edit revision`, `Activate revision` and `Delete revision` actions, while
    active `v2` cannot be activated again.
22. Select `Activate revision` on `v3` exactly once.
23. While activation is active, confirm the action-ring is visible and all
    competing revision mutations are disabled.
24. Confirm `v3` becomes the only Active Privacy EN revision and `v2` becomes
    inactive. Help, Terms and Explanation active versions remain unchanged.
25. Without refreshing **Kai**, confirm the already-open Privacy popup still
    honestly shows its pre-activation `v2` snapshot; do not treat this static
    surface as a failed persisted activation.
26. In **Riley**, reload exactly once and wait for normal profile/content load.
    Confirm Privacy opens as a required popup at `v3`, shows `Required QA
    notice` and `QA research choice`, and does not show the removed script or
    event-handler attribute.
27. Confirm the required popup cannot be dismissed by its backdrop and offers
    `Approve privacy`. Do not approve it in Riley.
28. Reload **Kai** exactly once. Confirm the required Privacy `v3` popup opens
    and the optional section starts unselected.
29. Select `Approve privacy` exactly once in Kai. Confirm the action shows its
    saving state, the popup closes normally, and it does not immediately reopen.
30. Confirm Riley still requires Privacy `v3`; Kai's action must not approve
    another actor.
31. Report and wait for Codex to prove one activation, one Kai `v3` consent,
    zero Riley `v3` consent, preserved `v1`/`v2` histories and exact audit rows:

    `CONTENT-ADMIN-LIFECYCLE-001 privacy active: v3 public, Kai approved once, Riley still stale`

### 3. Delete an inactive revision, then exercise active fallback

32. After Codex confirms `privacy-active`, in Ava open Content -> Help ->
    Magyar and locate inactive Help `v2`.
33. Select its `Delete revision` action. Confirm the dialog title is
    `Delete v2?`, then select `Delete` exactly once.
34. Confirm Help `v2` disappears once, Help `v1` remains Active, and public
    Help never becomes empty or changes language.
35. Return to Privacy -> English. Confirm Privacy `v3` is Active and Privacy
    `v2` is the newest remaining inactive fallback.
36. Select `Delete revision` on active Privacy `v3`, confirm `Delete v3?`, and
    select `Delete` exactly once.
37. Confirm `v3` disappears and Privacy `v2` automatically becomes the one
    Active revision. An empty Privacy state is a FAIL.
38. Without refreshing Riley, record that its already-open required `v3`
    popup is stale; do not interact with it.
39. Reload Kai and Riley exactly once each. Both must now show Privacy `v2`
    without a new approval requirement because their historical `v2` consents
    remain valid. Kai's historical `v3` consent must not be deleted or rewritten.
40. Close and reopen Ava's Content editor. Confirm Help `v2` and Privacy `v3`
    remain absent, the fallback Active marker survives, and the Terms and
    Explanation inactive controls remain untouched.
41. Report and wait for Codex's delete/fallback/public/consent audit oracle:

    `CONTENT-ADMIN-LIFECYCLE-001 privacy fallback: inactive delete exact, active delete restored v2`

### 4. Move one published article to trash

42. After Codex confirms `privacy-fallback`, in **Kai** open the public landing
    page, scroll to Articles, select `More article`, and leave the list open.
43. Confirm `QA CONTENT-ADMIN-LIFECYCLE-001 Article` appears exactly once with
    the staged title, excerpt and managed image. Record the displayed total.
44. In **Ava**, open `Admin -> Configuration -> Article`, select `English`,
    then the `Published` filter.
45. Confirm the target appears once with `Published` status and actions
    `Read more`, `Edit`, `Unpublish`, `Feature`, and `Delete`; `Restore` and
    `Publish` are absent.
46. Confirm the adjacent Featured Control offers `Unfeature` instead of
    `Feature`. Do not select it.
47. Select `Delete` on the target. In `Move article to trash?`, select
    `Move to trash` exactly once.
48. Confirm the target leaves the already-open Published list without a full
    page reload or duplicate card. Published and All decrement once, Trashed
    increments once, and Featured is unchanged from the staged counts.
49. Select the `Trashed` filter. Confirm the same target identity appears once
    with `Trashed` status and only `Restore`; edit/publish/feature/delete
    actions are absent.
50. In Kai's still-open public Articles list, record whether the old card
    remains; it is an intentionally non-live surface and must not invent a
    write or claim fresh data.
51. In **Riley**, make one fresh landing load and open `More article`. Confirm
    the target is absent, the total is one lower, and the adjacent control is
    unchanged.
52. Report and wait for Codex to prove one soft-delete, unchanged ID/content/
    managed media, cleared publish/feature flags, exact buckets and zero media
    deletion:

    `CONTENT-ADMIN-LIFECYCLE-001 article trashed: fresh public absent, one Trashed row`

### 5. Restore as Draft, then republish separately

53. After Codex confirms `article-trashed`, in Ava's Trashed filter select
    `Restore` once, then confirm `Restore` exactly once.
54. Confirm the target leaves Trashed immediately. Trashed decrements once,
    All and Drafts increment once, while Published and Featured remain
    unchanged.
55. Select `Drafts`. Confirm the same target appears once with `Draft` status
    and actions `Read more`, `Edit`, `Publish`, and `Delete`; `Feature`,
    `Unpublish` and `Restore` are absent.
56. Open `Read more`. Confirm title, excerpt, HTML and image are byte-for-byte
    the staged article content and no image is broken. Close the viewer.
57. Fresh-load Riley's public Articles list once. Confirm the restored Draft is
    still absent: Restore is not Publish.
58. Report and wait for Codex to prove restored-but-unpublished state, cleared
    trash metadata, stable creator/identity/media and no public inclusion:

    `CONTENT-ADMIN-LIFECYCLE-001 article restored: same identity and media, Draft only`

59. After Codex confirms `article-restored`, in Ava select `Publish` on the
    restored Draft, then confirm `Publish` exactly once.
60. Confirm the target leaves the already-open Drafts list, Drafts decrements
    once, Published increments once, Trashed stays unchanged, and no duplicate
    card appears.
61. Select `Published`. Confirm the same target appears once with `Published`
    status and the original published action set, including `Feature` but not
    `Restore` or `Publish`.
62. Before refreshing Kai, record the already-open public list's stale state.
    Then reload Kai exactly once and reopen `More article`.
63. Confirm the target returns exactly once, the public total returns to its
    baseline, the card uses the same managed medium image, and `Read more`
    renders the same body with the same managed large image.
64. Reload Ava and Riley exactly once each. Recheck governed-content Active
    versions, Article admin buckets and fresh public inclusion.
65. Confirm Riley owns no Kai consent, the adjacent Featured Control and the
    pre-stage `ARTICLE-SRC-002` state are unchanged, and no Help/Terms/
    Explanation draft became public accidentally.
66. Report the terminal phrase:

    `CONTENT-ADMIN-LIFECYCLE-001 UI complete: revisions, consent, fallback and article lifecycle persist`

Wait for Codex's final persisted/audit/media/idempotence oracle. Do not reset
or continue to another testcase until Codex records the result and restores
the fixture.
