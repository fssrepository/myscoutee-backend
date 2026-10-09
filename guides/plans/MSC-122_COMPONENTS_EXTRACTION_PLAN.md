# MSC-122 — Components Extraction Inventory and Execution Plan

Status date: **2026-10-09**.
Related task: [MSC-122](https://github.com/fssrepository/myscoutee-roadmap/issues/160).
This document tracks the generalization of the frontend and its separation into
three layers: **components/core, template/extended, and MyScoutee-only**.
It does not replace the plan for the full template/backend/operator/registry scope of MSC-122.

## 1. Current Work Point

- **Completed:** P00 — initial source review, component inventory, and this plan.
- **Active implementation:** none. Only source review and planning have taken place.
- **Next execution point:** P01 — identify capability and dependency boundaries,
  recording the generalizations required.
- **Components moved:** 0.
- **Library build / npm package / integration evidence:** none yet.
- **Classification in this plan does not mean migration has been completed.**

Source state at the time of review:

| Repository | Commit | State |
| --- | --- | --- |
| myscoutee-backend | `117c92284f92005f55b33b9197e263a221bc4438` | Clean working tree before creating the plan. |
| frontend / myscoutee | `54a3f7d06e5f709c486a4a4b142c53b4331bf20a` | Clean working tree; the source of this inventory. |
| myscoutee-components | `21a458f002b167e66e6de52dbafe02819cdf43d3` | Documentation and the standard CC BY 4.0 license; no library implementation yet. |
| myscoutee-template | `51858b9d14007b549e3d86570361227ea74eaade` | Clean working tree; documentation only, with no extended implementation yet. |

## 2. Recorded Decisions

1. **Keep a single implementation.** Source moved into components must not leave
   a second, separately maintained copy in the frontend or template.
2. **Resolve dependencies in the working frontend first.** Move a unit into its
   destination repository once its extraction boundary is clear.
3. **Components/core:** general components, inputs, UI services, and behavior.
   The components repository is their single source owner. An optional capability
   alone is not a reason to split a component.
4. **DateInput stays in core together with its hideable horoscope capability.**
   The general date and horoscope data it needs can move with it.
5. **The general guide engine and rendering are core candidates.** The application
   supplies its own content, surface list, data source, and entry rules.
6. **Template/extended:** general application compositions, complex fields,
   workflows, and data source integrations built on core. This is a layer of the
   template project, not a mandatory second package in the components repository.
7. **MyScoutee-only:** its own business rules, models, and workflows. The complete
   MyScoutee behavior of the current pricing, policies, and event slot wizards
   belongs here; their generalizable internals may still be shared.
8. The shared FormFlow engine belongs in core. General inputs can also belong
   in core; extended and application inputs use the same extension point.
   Adding a business input must not require changing core.
9. The components source will be available **as a locally editable Git submodule**
   in the consuming frontend and later in the template. The development cycle
   must not require npm publication or a release installed from a registry.
10. npm is a later distribution format built from the same source. Local
    development and the published package use the same public API.
11. Dependency analysis determines the final directory location. If moving it
    would affect many consumer imports, the existing core import paths may remain
    as thin re-exports. They must contain no separate behavior or duplicated state.
12. The current `shared/core` also contains business services; it is not equivalent
    to the future UI core and must not be moved as an entire directory.
13. **Source code may be refactored to make it general.** Extraction is not limited
    to components that are already independent: a current MyScoutee component may
    be split into a shared engine, a template composition, and its own business rules.
14. The unit of classification is a **capability and responsibility**, not necessarily
    an existing file or class. The inventory records provisional destinations,
    not irreversible decisions.
15. Preserve working capabilities and required lazy loading. If generalization
    requires an API change, update its callers and tests in the same work point
    and demonstrate that user-facing behavior remains equivalent.
16. Abstract the dependency boundary only as far as needed, starting from existing
    behavior. Do not copy a component to create a separate “generic” version.

## 3. Component Inventory

Tables 3.1–3.3 cover all **41 components** currently under
`frontend/src/app/shared/ui/components/core`.
This tree contains 97 non-test TypeScript files and 13 `.spec.ts` files.
The counts and classifications come from static inspection, not portability tests.

Notation: **components/core / template/extended / MyScoutee** identifies the
provisional destination owner. The extraction column describes work still required.
A row may be split across multiple layers based on the evidence gathered in P01.

### 3.1. General Elements — Core

| ID | Current element and source | Count | Required extraction / behavior to preserve |
| --- | --- | --- | --- |
| C01 | [Indicator](../../frontend/src/app/shared/ui/components/core/indicator/) | 1 | General progress and status indication; preserve timing behavior and tests. |
| C02 | [Prompt](../../frontend/src/app/shared/ui/components/core/prompt/) | 1 | Model-driven rendering and events; the existing component can move. |
| C03 | [CopyLink](../../frontend/src/app/shared/ui/components/core/copy-link/), [OnOffToggle](../../frontend/src/app/shared/ui/components/core/on-off-toggle/) | 2 | Access translation through the shared UI contract. |
| C04 | [Menu, MenuTrigger, MenuOutlet, Rate](../../frontend/src/app/shared/ui/components/core/menu/) | 4 | Keep the dispatcher, menu models, and general rating behavior together. The application supplies the specific dating/work/service criteria. |
| C05 | [Popup](../../frontend/src/app/shared/ui/components/core/popup/), [Dialog](../../frontend/src/app/shared/ui/components/core/dialog/) | 2 | Keep overlay, Back/Escape, presence, stacking, and guide integration together; the general stores move as well. |
| C06 | [Accordion](../../frontend/src/app/shared/ui/components/core/accordion/) | 1 | Model-driven groups, selection, badges, and menus, together with the shared menu dependency. |
| C07 | [FloatingLauncher](../../frontend/src/app/shared/ui/components/core/floating-launcher/) | 1 | Move with the shared launcher registry; preserve positioning and events. |
| C08 | [SmartList](../../frontend/src/app/shared/ui/components/core/smart-list/smart-list.component.ts) | 1 | List, month/week/timeline, grouping, pagination, scrolling, and card templates. The application supplies the `loadPage` callback and business data. |
| C09 | [CalendarCard, HeaderCard, ImageCard, InfoCard, PairCard, SingleCard, SingleRow, TextCard, WarpImageCard](../../frontend/src/app/shared/ui/components/core/smart-list/card/) | 9 | Renderers and their general models belong in core. Business data converters stay in the application; detach the hardcoded MyScoutee image fallback. |
| C10 | [DateInput](../../frontend/src/app/shared/ui/components/core/form/inputs/date-input/) | 1 | Keep date/time/range and the optional horoscope together. Extract the general adapter, formatting, and horoscope data from application utility collections. |
| C11 | [LinkInput](../../frontend/src/app/shared/ui/components/core/form/inputs/link-input/), [LocationInput](../../frontend/src/app/shared/ui/components/core/form/inputs/location-input/) | 2 | General inputs; preserve value handling, validation, configurable labels, and map links. |
| C12 | [TextCardsInput](../../frontend/src/app/shared/ui/components/core/form/inputs/text-cards-input/text-cards-input.component.ts) | 1 | General card-based field, together with the existing form and menu elements. |
| C13 | [FormFlow](../../frontend/src/app/shared/ui/components/core/form/flow/) | 1 | Shared steps, field shell, validation, summary, state, and events. Separate business input types and concrete imports. |
| C14 | [ImageCarousel](../../frontend/src/app/shared/ui/components/core/image-carousel/), [ImageGallery and ImageGalleryPopup](../../frontend/src/app/shared/ui/components/core/image-gallery/) | 3 | General image viewing and editing. Upload operations, URL variants, and business event associations are wired by the consuming application. |
| C15 | [DeploymentBrand](../../frontend/src/app/shared/ui/components/core/deployment-brand/) | 1 | General branding renderer, already exposing a `branding` input. Move the concrete `DeploymentConfigurationService` fallback to the consumer. |

Initial core candidates: **31 current components**. This does not mean moving
these components unchanged, nor does it define the final library component count.
Boundaries may change while dependencies and responsibilities are resolved,
following the recorded decisions.

### 3.2. Reusable Compositions — Template/Extended Candidates

| ID | Current element and source | Count | Rationale and boundary |
| --- | --- | --- | --- |
| E01 | [RouteInput and RouteInputPopup](../../frontend/src/app/shared/ui/components/core/form/inputs/route-input/) | 2 | Configurable stop list and reordering, with a `string[]` value. No direct dependency on an event DTO; FormFlow popup handling needs separation. |
| E02 | [PaymentCard](../../frontend/src/app/shared/ui/components/core/smart-list/card/payment-card/) | 1 | Card rendering and menu events are reusable. Payment/tokenization services and business permissions do not move into the library with the view. |

Initial template/extended candidates: **3 current components**. P01 determines
which parts are general core capabilities and which are application compositions.
No separate parallel base engine will be created for them.

### 3.3. MyScoutee Business Units — Review Their Internals for Shared Capabilities

| ID | Current element and source | Count | Remaining business dependency |
| --- | --- | --- | --- |
| M01 | [PricingEditorInput, PricingEditorPopup, PricingSlotPanel](../../frontend/src/app/shared/ui/components/core/form/inputs/pricing-editor/) | 3 | MyScoutee pricing model and `PricingBuilder`; these become consumers of the shared FormFlow/input contract. |
| M02 | [PoliciesInput and PoliciesInputPopup](../../frontend/src/app/shared/ui/components/core/form/inputs/policies-input/) | 2 | `EventPolicyDTO`, event rules, and a dedicated converter; integrate as application inputs. |
| M03 | [SlotsInput](../../frontend/src/app/shared/ui/components/core/form/inputs/slots-input/) | 1 | Event slot wizard, `EventSlotTemplateDTO`, and `ActivityEventDetailDTO` normalization. The `scheduleOnly` option alone does not make the whole implementation general. |
| M04 | [ProfileExperienceManager](../../frontend/src/app/shared/ui/components/core/form/popups/profile-experience-manager/) | 1 | Business models and services for profile experiences; continues to use shared UI elements. |

Initially identified as business units: **7 current components**. The complete
business workflow stays in MyScoutee, while general internal parts may be extracted.
The initial source inventory totals **31 + 3 + 7 = 41**; these counts do not
prescribe the final physical distribution across layers.

### 3.4. Shared Dependencies Outside the Core Directory

| ID | Current source | Destination and extraction task |
| --- | --- | --- |
| S01 | [ExplanationGuideService](../../frontend/src/app/shared/core/base/services/explanation-guide.service.ts), [guide UI](../../frontend/src/app/shared/ui/components/explanation-popup/) | The guide engine, launcher, overlay, and general document rendering are core candidates. Reuse the existing `ExplanationGuideOptions.loadState`; separate the surface list, general view of help DTOs, storage/consent rules, and content-specific exceptions. |
| S02 | [Landing guide provider](../../frontend/src/app/shared/core/base/services/landing-explanation-guide.ts), [guide directive](../../frontend/src/app/shared/ui/directives/landing-guide-surface.directive.ts) | The landing page already uses the same engine with another data source. Surface registration can be generalized; the landing data source and entry rules stay with the consumer. |
| S03 | [I18nPipe](../../frontend/src/app/shared/ui/pipes/i18n.pipe.ts), [I18nService](../../frontend/src/app/shared/core/base/services/i18n.service.ts) | General translation engine/contract and shared labels in core. Reusable data source wiring in template/extended; concrete MyScoutee session/scope rules in the application. Adapt the existing behavior without creating a second translation engine. |
| S04 | [DialogStore](../../frontend/src/app/shared/ui/context/stores/dialog.store.ts), [PopupPresenceStore](../../frontend/src/app/shared/ui/context/stores/popup-presence.store.ts), [OverlayNavigationStore](../../frontend/src/app/shared/ui/context/stores/overlay-navigation.store.ts), [FloatingLauncherRegistry](../../frontend/src/app/shared/ui/context/stores/floating-launcher-registry.service.ts) | General UI state in core; make the Angular Router integration dependency explicit. A consumer must not instantiate two separate sets of overlay/guide state. |
| S05 | [ImageGalleryStore](../../frontend/src/app/shared/ui/context/stores/image-gallery.store.ts), [image metadata](../../frontend/src/app/shared/core/contracts/image-gallery.interface.ts) | Gallery state belongs in core. General image metadata and MyScoutee event references need separate contracts. |
| S06 | [UI scheduler](../../frontend/src/app/shared/ui/scheduler/), [directives](../../frontend/src/app/shared/ui/directives/), [CounterBadgePipe](../../frontend/src/app/shared/ui/pipes/counter-badge.pipe.ts) | Move existing scheduling, viewport, and lazy image handling with their actual UI dependencies; detach the seeded help-image path. |
| S07 | [ListQuery/PageResult](../../frontend/src/app/shared/core/contracts/list.interface.ts), [converter contracts](../../frontend/src/app/shared/ui/converters/converter.types.ts), [SmartList helpers](../../frontend/src/app/shared/ui/components/core/smart-list/) | General types and stepper/calendar/timeline behavior receive a shared owner. The application imports the same types instead of copying them. |
| S08 | [AppUtils](../../frontend/src/app/shared/app-utils.ts), [AppCalendarDateAdapter](../../frontend/src/app/shared/app-calendar-date-adapter.ts), [AppStaticData](../../frontend/src/app/shared/app-static-data.ts), [rating helpers](../../frontend/src/app/shared/core/contracts/rating-snapshot.ts) | Extract genuinely general date, number, horoscope, and rating operations and data. Do not move the entire mixed collection; dating/work/service criteria and business rules belong to the application. |
| S09 | [UI SCSS](../../frontend/src/app/shared/ui/styles/), [global styles](../../frontend/src/_styles/styles.scss), [theme](../../frontend/src/_styles/_deployment-themes.scss) | Package general styles, mixins, and required global UI rules. Keep application root/layout and business page selectors separate. |
| S10 | [DocumentViewer](../../frontend/src/app/shared/ui/components/document-viewer/) | The general renderer is a core candidate; a configured document surface is a template/extended candidate. Currently coupled to routes, help center, deployment, and privacy content; establish boundaries by refactoring the existing component. |
| S11 | [DocumentAttachments](../../frontend/src/app/shared/ui/components/core/form/flow/document-attachments.ts) | Currently coupled to announcement/campaign labels, concrete `MediaService`, and a file limit. Use caller analysis to distinguish general attachment handling, template wiring, and specific announcement/campaign rules. |

### 3.5. Further Application and Template Boundaries

- The general contract of [UI converters](../../frontend/src/app/shared/ui/converters/)
  may be shared; event/profile/asset/campaign/community converters transform
  business data into UI models and therefore stay in MyScoutee.
- Among the [UI stores](../../frontend/src/app/shared/ui/context/stores/), the
  general state identified in S04–S06 is an initial core candidate.
  Complete operator, profile, payment, event, and community business state belongs
  to MyScoutee; general internal state handling can be reviewed for reuse.
- The payment, campaign, community, photo-feed, notification, and service-offering
  workflows in [shared popups](../../frontend/src/app/shared/ui/components/)
  do not move merely because they reside under `shared`.
- The [current chat](../../frontend/src/app/activity/components/event-chat-popup/)
  handles events, contacts, resources, and community concerns. As a whole, it is
  outside this UI core extraction; general chat requires a separate later review.
- Application services for login, session, demo selection, MCP, and communication,
  along with admin/operator roles and job management, belong to **later template
  work**. Components supplies only their shared UI needs.
- Operator/registry microservice extraction, moderation, content management, and
  the final template landing composition are outside this plan's execution scope.

## 4. Finding the Boundaries Between the Three Layers

```text
MyScoutee application composition and business rules
  ├── use general capabilities from components/core
  └── use reusable template/extended behavior where needed

template/extended: general application compositions and integrations
  └── components/core: components, inputs, engines, and shared UI behavior
```

- **Core must not depend on** template/extended or MyScoutee implementations.
- **Template/extended must not depend on** MyScoutee business DTOs, services,
  seeds, or acceptance rules. It receives the data it needs through its own
  general contracts.
- MyScoutee may consume core directly; an extended wrapper is not mandatory
  for every component.
- Physical placement follows dependency boundaries. If template and MyScoutee
  jointly maintain the same extended behavior, P01 must record its single source
  owner and consumption mechanism; do not create two maintained copies.
- Use the existing SmartList loader/template API and guide options, extending
  them where necessary. Add a missing contract to the existing owner rather than
  creating a parallel engine.
- FormFlow's fixed control types and the popup store's concrete dynamic imports
  are real dependency boundaries. General inputs may stay directly in core;
  template and MyScoutee inputs use the shared extension point.

### 4.1. Decision Questions for Each Capability

1. What is its concrete responsibility, and what data, state, or operation does it need?
2. Would another project use it in the same way? If so, is it a core capability
   or a general application composition built on core?
3. Does the current MyScoutee dependency represent a real business rule, or does
   it exist only because of a concrete import, data source, default, label, type,
   or provider?
4. What is the smallest code change that makes it general: passing data/configuration,
   extending an existing callback/provider, or extracting a type or responsibility?
5. What stays in MyScoutee, what moves to template/extended, and what becomes core?
6. How do we demonstrate that existing behavior is preserved without creating
   a source copy or a reverse dependency?

### 4.2. Boundary Inventory — To Be Detailed in P01

| ID | Current unit | Potential components/core part | Potential template/extended part | Part remaining in MyScoutee |
| --- | --- | --- | --- | --- |
| H01 | DateInput and its static data | Complete date/time input with optional horoscope, adapter, and general data. | A general form composition, if needed. | Profile field persistence rules and business usage. |
| H02 | FormFlow and its business inputs | Step and input engine, general fields, and value/validation/event/guide contracts. | Reusable complex fields and wizard compositions. | Specific pricing/policies/event/profile fields and business rules. |
| H03 | Guide | State, steps, context, overlay, and general rendering. | General landing/authenticated application wiring and data loading. | Application content, surface list, consent integration, and content-specific exceptions. |
| H04 | SmartList and cards | Existing list/calendar/timeline engine, cards, loader contracts, and template contracts. | General sample views and shared compositions. | Event/asset/campaign/community loaders and converters. |
| H05 | Images and attachments | General rendering, editing, state, and operation contracts. | General upload/attachment composition and data source wiring. | Event/organizer associations, announcement/campaign fields, and business limits. |
| H06 | Translation | General translation behavior, pipe, change notifications, and shared labels. | Reusable language/data source wiring. | MyScoutee-specific session/scope and business translation content. |
| H07 | Pricing/policies/slot wizards | General field, panel, date, or list builder behavior supported by caller analysis. | Only general editing compositions that do not require MyScoutee rules. | Current pricing, event policy, and slot models, plus their business operations. |
| H08 | DocumentViewer and DeploymentBrand | General renderer and branding display. | General configured document/help surface. | MyScoutee content and concrete deployment/privacy integration. |
| H09 | RouteInput, PaymentCard | Demonstrably general rendering and editing foundations. | Complete input/card compositions reusable across projects, where justified. | Transport/event or payment business integration. |

The H rows are **hypotheses to investigate**. There is no requirement to create
code in all three layers for every row. If an entire existing unit is general,
it may move into core intact; if a dependency is an essential business rule,
the affected part stays in MyScoutee. Record the concrete import/caller,
refactoring, and verification supporting each final decision.

## 5. Duplication Inventory

| ID | Observation | Evidence / next check | Status |
| --- | --- | --- | --- |
| D01 | Repeated owner/state/open/update/close/action handling in route/pricing/policy popups. | [FormFlowPopupStore](../../frontend/src/app/shared/ui/components/core/form/flow/form-flow-popup.store.ts). Structural repetition is visible; compare differences in state cloning and action semantics before consolidation. | Structural repetition identified; not fixed. |
| D02 | Scattered use of general date, number, rating, and image helpers. | S08 and its callers. Misplaced general code is confirmed; a complete inventory of additional duplicate implementations has not yet been produced. | To investigate. |
| D03 | Overlap between shared styles and application global rules. | S09, component SCSS, and global selectors. Consolidate only where responsibility and behavior match. | To investigate. |
| D04 | Other working but duplicated parts reported by the user. | Targeted source and caller review in P01; assign each finding its own stable D identifier. | Not yet fully surveyed. |

Consolidation starts from the existing implementation. Merging apparently similar
code must not override distinct persistence, lifecycle, or permission rules.

## 6. Numbered Execution Tracker

Statuses: **PLANNED**, **IN PROGRESS**, **AWAITING VERIFICATION**, **DONE**,
**BLOCKED**. Keep one primary work point IN PROGRESS at a time.
Mark a row DONE only after recording its required verification and evidence.
This plan describes later execution; it does not start that execution automatically.

| Point | Task | Dependency | Completion criteria | Status |
| --- | --- | --- | --- | --- |
| P00 | Initial source review, classification of 41 components, and recording decisions and tracking rules. | — | This plan contains the component inventory, source links, and user clarifications. | **DONE** |
| P01 | Inventory capabilities, imports, and callers by C/E/M/S/H identifier; identify duplication and boundaries between the three layers. | P00 | Each H row includes concrete evidence, core/template-extended/MyScoutee destinations, and required refactoring. Classify runtime/type/dynamic imports, templates, SCSS, assets, providers, and test dependencies. Record the D inventory and single source owners. | PLANNED |
| P02 | Separate general types, helpers, data, and the translation contract within the existing frontend. | P01 | Shared S03/S07/S08 parts have a single owner; the template/extended data source contract is separate from MyScoutee wiring. DateInput and its optional horoscope retain their behavior. | PLANNED |
| P03 | Resolve dependencies of the guide, overlays, and shared UI state. | P02 | S01/S02/S04/S06: the same guide engine works in landing and authenticated contexts, with differences supplied by the application provider. No reverse dependency on the help center backend or MyScoutee surface list. | PLANNED |
| P04 | Generalize the existing FormFlow and inputs; separate core, template/extended, and M01–M04 business parts. | P02–P03 | Core imports no MyScoutee pricing/policies/slot/profile implementation; proven general internals may receive a shared owner. Application fields preserve value, validation, and event behavior. The confirmed shared part of D01 has one owner. | PLANNED |
| P05 | Generalize SmartList, cards, images, branding, and styles; finalize boundaries of template/extended compositions. | P02–P04 | C08–C09/C14–C15/E01–E02/S05/S09/S10: no concrete application configuration or asset assumptions; consumer callbacks and models supply the required data. | PLANNED |
| P06 | Move the cleaned core into components; place selected extended units in template and wire local consumption. | P05 | One implementation and defined public exports per layer; only re-exports at old locations where necessary. MyScoutee and the relevant template parts consume locally editable components source; the development pipeline tracks changes without an npm release. | PLANNED |
| P07 | Verify independent library and npm packaging from the same source. | P06 | Verify Angular library format, peer dependencies, exports, styles, and actual package contents. The independent build does not read MyScoutee source. npm publication is outside this point's scope. | PLANNED |
| P08 | Run MyScoutee regression and separate consumer verification; complete the duplication and dependency audit. | P06–P07 | Applicable checks from section 7 have evidence; no source copies or core → app/extended dependencies. Verify selected template/extended parts and MyScoutee integration; separately prove core independence with an isolated consumer. Completing a full template application is not required. | PLANNED |
| P09 | Finalize documentation, repository/submodule commits, and continuation state. | P08 | Document the component API, local development, and packaging. Make the components commit available before updating the frontend pointer, and the frontend commit before updating the backend pointer. Keep unfinished template work separate. | PLANNED |

### 6.1. Required Updates During Execution

1. When starting a work point, update the **current point in section 1** and the
   P row's status. Do not renumber C/E/M/S/H/D identifiers.
2. For each point, record the actual units and files affected, investigation
   results, and the next concrete action.
3. Larger subtasks may be added as `P04.1`, `P04.2`, etc., each with its own status
   and verification. The parent point is complete only after all its subtasks.
4. Update the evidence log before completing or interrupting an active point.
   On failure, record the failure and the missing condition needed to continue.
5. Mark tests/builds/behavior PASS only with actual execution results. Identify
   static source inspection and checks that were not run separately.

### 6.2. Evidence Log

| Date | Point | Affected units / files | Result | Next step |
| --- | --- | --- | --- | --- |
| 2026-10-09 | P00 | C01–C15, E01–E02, M01–M04, S01–S11, H01–H09; this plan | Initial static inventory: 41 components under the core directory. Abstraction plan across three layers: components/core, template/extended, MyScoutee. Refactoring may be planned to enable generalization; implementation, library builds, and runtime regression checks have not started. | P01, beginning with a fresh check of source state. |

P00 documentation verification: all 58 local source references exist; comparison
with the source tree confirms that all 41 components appear exactly once in the
C/E/M inventory; P00–P09 and H01–H09 identifiers are consecutive. The modified
existing document passes `git diff --check`.

## 7. Verification Requirements

### 7.1. Behavior and Ownership Boundaries

- Move existing tests with their canonical source; do not copy separately tested
  implementations into consumers. Add tests only for actual new boundaries.
- SmartList: preserve list/month/week/timeline views, empty and error states,
  pagination, refresh, selection, scroll position, and required lazy behavior.
- FormFlow and inputs: value entry, `ControlValueAccessor`, disabled/readOnly,
  validation, summary, save events, and popup opening/closing must work for core,
  extended, and application inputs.
- DateInput: preserve date/time/range behavior and visible/hidden horoscope states.
- Guide: landing and authenticated usage, language changes, nested popups, guide
  steps, closing and reopening, missing content, and loading errors.
- Images: preserve rendering, upload callbacks, reordering, deletion, and metadata;
  verify MyScoutee event associations in the application integration.
- Overlay: Back/Escape, focus, mobile overflow, stacking, and shared store instances.
- Regression coverage includes the required open → edit → save → reopen checks
  for MyScoutee-specific pricing/policies/slots/profile editors.
- Separate consumer: a minimal composition with SmartList, a general input,
  FormFlow, the guide, and a registered custom input. It must not rely on
  MyScoutee DTOs, seeds, global imports, or storage keys.
- Packaging checks must also confirm the presence of the standard `LICENSE`,
  public types, exports, styles, and required assets.

### 7.2. Running Development Environment

- The repository's [resource and QA rules](../../AGENTS.md) apply. Identify the
  running frontend build/watch owner first; do not duplicate its work with a
  separate npm/build/test process alongside it.
- Local library build/watch integration will be part of the existing development
  pipeline. Modified submodule source must not silently leave a stale library build.
- Browser full-flow testing requires user delegation for the relevant scope.
  Creating this plan does not delegate control of application browsers.
- Without runtime evidence, a point remains AWAITING VERIFICATION; successful
  compilation alone does not establish behavioral equivalence.

## 8. Local Development and Later npm Distribution

The submodule records the editable source and its commit. The Angular library
build produces the consumed code from that source; npm distributes a publishable
version of the same library. Source fixes happen locally in components and become
visible in MyScoutee/template through the development build.

Angular's official library workflow uses a public API, a library build, and peer
dependencies for the Angular packages used. Local TypeScript resolution points to
the built library; the concrete integration belongs to P06 and must follow the
running pipeline and the requirement to minimize rewiring.

- [Angular — Creating libraries](https://angular.dev/tools/libraries/creating-libraries)
- [Angular — Angular Package Format](https://angular.dev/tools/libraries/angular-package-format)
- [Git — Submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules)

Later template integration will consume this components source. Completing this
plan does not mean the entire template application has been completed.
