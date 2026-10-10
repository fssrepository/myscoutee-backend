# MSC-122 — Components Extraction Inventory and Execution Plan

Status date: **2026-10-10**.
Related task: [MSC-122](https://github.com/fssrepository/myscoutee-roadmap/issues/160).
This document tracks the generalization of the frontend and its separation into
three layers: **components/core, template/extended, and MyScoutee-only**.
It does not replace the plan for the full template/backend/operator/registry scope of MSC-122.

## 1. Current Work Point

- **Current implementation:** shared types/helpers, translation contract, guide engine, overlay stores, all C01–C15 core components and the presentational PaymentCard live in `myscoutee-components`.
- **Source owner:** `/home/raxim/workspace/myscoutee-components`; the frontend consumes that repository as its `components` Git submodule.
- **Current user corrections:** independently buildable source, Git submodule integration, GitHub Packages publication requested in the release follow-up, no proxy/wrapper classes and no one-line forwarding files in the application. Consumers import public TypeScript and Sass APIs directly. Generated `dist/` and `node_modules/` stay ignored. Both components checkouts remain on `master`; updates use fast-forward merges, not detached checkout.
- **Remaining in the application:** concrete pricing/policy/profile controls, event slot metadata and asset assignment rules, guide visual content/renderers, route/privacy document composition. No template application is being created in this work point.
- **Verified:** independent build in the sibling checkout; after test ownership cleanup, **114 component tests in 23 files** pass there (`npm test`, `/tmp/msc122-components-tests.log`), and **14 application integration tests in 4 files** pass in the frontend (`/tmp/msc122-app-integration-tests.log`). Generic specs use the library source API and its own Angular test runner; app-specific translation scanning, media URL rules and event eligibility remain in the application. Removed 36 empty application source directories.
- **Runtime:** monolith dev stack started successfully. CDP checks passed for entry branding/cards, demo selection, event list/calendar, profile date control, image gallery, and direct pricing/policies form controls including draft value propagation. Desktop and 390px mobile layouts checked; drafts discarded. No browser page errors or failed requests recorded during the latter checks. Library-source watch verification passed through components compilation, application rebuild and nginx sync. The temporary exported probe was removed and the clean source rebuilt. The user authorized this browser testing; the manual-QA campaign is not activated.
- **Follow-up cleanup:** OnOffToggle is now the existing AppMenu toggle kind with `toggleStyle: on-off`; the separate component was removed. FormFlow headers and policies consume AppMenu directly. CalendarCardConverter moved beside CalendarCard and is exported from the components API; no application forwarding export remains. Library regression: **121 PASS in 25 files** (`/tmp/msc122-toggle-calendar-tests.log`). Dev watch build and CDP verification passed: policies toggle and FormFlow group header both switch off → on → off; mobile button size remains 82×38, with no browser page errors or failed requests. Drafts were discarded without saving. Components commit: `04e5fd3` (both checkouts on `master`).
- **Route/slots follow-up:** both actual controls now live in the components submodule. No wrappers or application source imports remain in those controls. Shared normalization retains consumer metadata; MyScoutee normalizes event subdefinitions in its existing DTO adapter. Independent component tests: **132 passed / 28 files** (`/tmp/msc122-grouped-components-tests.log`). Route tests exercise the real lazy popup save/cancel and read-only behavior; schedule-only tests exercise monthly/quarterly/yearly confirmation. Application event DTO/mapper checks: **9 passed / 2 files** (`/tmp/msc122-route-app-tests.log`).
- **Folder cleanup:** 127 application store/converter/spec files grouped by responsibility; eight shared store/spec files grouped into `overlay` and `media`. Existing barrels and direct/dynamic imports point to the new owners; no old-path forwarding files. Grouped application checks: **261 passed, 1 failed / 40 files** (`/tmp/msc122-grouped-app-tests.log`). The operator workspace payment expectation omits `exchangeRateUrl`; its test and production bodies are unchanged by this move. This unrelated mismatch remains open.
- **Small-folder cleanup:** 16 UI/configuration/data/spec files colocated with their existing owners. Removed the residual `ui/models` and `ui/directives` folders and their aggregation barrel; consumers use the actual owners. Updated the Angular test provider path. No logic changed in the 16 moved files. The existing `frontend-sync` watcher compiled the complete application after these moves; no separate npm build was run.
- **Browser correction:** mobile testing had left a fixed 1280×900 viewport in the managed browser. Disconnecting that test attachment restored the native 1850-pixel viewport, with equal 345-pixel margins around the 1160-pixel home panel. No page alignment CSS was changed. Route/slots unit and adapter tests are proven; the complete event-runtime assignment flow was not exercised in the browser in this follow-up.
- **Components release:** `@fssrepository/myscoutee-components@0.1.0` published locally to GitHub Packages; source tag `v0.1.0`. The [README](../../frontend/components/README.md) documents 33 components in tables. The frontend submodule and npm workspace path are `components`, both checkouts remain on `master`, and all imports use the published package name. Existing `frontend-sync` compiled the library and complete application after the rename and synchronized nginx output. No separate local build/test was started. The archive contains 20 files, 444261 compressed bytes; SHA-256 `68c07a79e6507c797035fa12ef51f173182de5ba75719abb3dd0dd81633a0e71`. Registry integrity matches the local archive. Publication reuses the existing Docker/GHCR publisher credential; no new login or GitHub Action is required. GitHub Packages currently gives the package private visibility.
- **Completion boundary:** this work proves the independently buildable components submodule and MyScoutee integration, not the entire template/backend/operator scope of MSC-122.

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
10. The current deliverable is an independent build and Git submodule consumption.
    Registry publication and a separate example application are outside this task.
11. **Updated user decision:** remove forwarding files and wrapper classes.
    Update consumers to the public TypeScript/Sass API directly; application code
    must not know the library internal source or generated directory layout.
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
| C01 | [Indicator](../../frontend/components/src/lib/components/indicator/) | 1 | General progress and status indication; preserve timing behavior and tests. |
| C02 | [Prompt](../../frontend/components/src/lib/components/prompt/) | 1 | Model-driven rendering and events; the existing component can move. |
| C03 | [CopyLink](../../frontend/components/src/lib/ui/components/core/copy-link/), [OnOffToggle (now AppMenu configuration)](../../frontend/components/src/lib/ui/components/core/menu/) | 2 | Access translation through the shared UI contract. |
| C04 | [Menu, MenuTrigger, MenuOutlet, Rate](../../frontend/components/src/lib/ui/components/core/menu/) | 4 | Keep the dispatcher, menu models, and general rating behavior together. The application supplies the specific dating/work/service criteria. |
| C05 | [Popup](../../frontend/components/src/lib/ui/components/core/popup/), [Dialog](../../frontend/components/src/lib/ui/components/core/dialog/) | 2 | Keep overlay, Back/Escape, presence, stacking, and guide integration together; the general stores move as well. |
| C06 | [Accordion](../../frontend/components/src/lib/ui/components/core/accordion/) | 1 | Model-driven groups, selection, badges, and menus, together with the shared menu dependency. |
| C07 | [FloatingLauncher](../../frontend/components/src/lib/ui/components/core/floating-launcher/) | 1 | Move with the shared launcher registry; preserve positioning and events. |
| C08 | [SmartList](../../frontend/components/src/lib/ui/components/core/smart-list/smart-list.component.ts) | 1 | List, month/week/timeline, grouping, pagination, scrolling, and card templates. The application supplies the `loadPage` callback and business data. |
| C09 | [CalendarCard, HeaderCard, ImageCard, InfoCard, PairCard, SingleCard, SingleRow, TextCard, WarpImageCard](../../frontend/components/src/lib/ui/components/core/smart-list/card/) | 9 | Renderers and their general models belong in core. Business data converters stay in the application; detach the hardcoded MyScoutee image fallback. |
| C10 | [DateInput](../../frontend/components/src/lib/components/date-input/) | 1 | Keep date/time/range and the optional horoscope together. Extract the general adapter, formatting, and horoscope data from application utility collections. |
| C11 | [LinkInput](../../frontend/components/src/lib/ui/components/core/form/inputs/link-input/), [LocationInput](../../frontend/components/src/lib/ui/components/core/form/inputs/location-input/) | 2 | General inputs; preserve value handling, validation, configurable labels, and map links. |
| C12 | [TextCardsInput](../../frontend/components/src/lib/ui/components/core/form/inputs/text-cards-input/text-cards-input.component.ts) | 1 | General card-based field, together with the existing form and menu elements. |
| C13 | [FormFlow](../../frontend/src/app/shared/ui/components/core/form/flow/) | 1 | Shared steps, field shell, validation, summary, state, and events. Separate business input types and concrete imports. |
| C14 | [ImageCarousel](../../frontend/components/src/lib/ui/components/core/image-carousel/), [ImageGallery and ImageGalleryPopup](../../frontend/components/src/lib/ui/components/core/image-gallery/) | 3 | General image viewing and editing. Upload operations, URL variants, and business event associations are wired by the consuming application. |
| C15 | [DeploymentBrand](../../frontend/components/src/lib/ui/components/core/deployment-brand/) | 1 | General branding renderer, already exposing a `branding` input. Move the concrete `DeploymentConfigurationService` fallback to the consumer. |

Initial core candidates: **31 current components**. This does not mean moving
these components unchanged, nor does it define the final library component count.
Boundaries may change while dependencies and responsibilities are resolved,
following the recorded decisions.

### 3.2. Reusable Compositions — Template/Extended Candidates

| ID | Current element and source | Count | Rationale and boundary |
| --- | --- | --- | --- |
| E01 | [RouteInput and RouteInputPopup](../../frontend/components/src/lib/ui/components/core/form/inputs/route-input/) | 2 | **Moved to components/core.** Ordered stops, lazy popup and per-control editor state; the existing FormFlow renderer registry includes route by default. Application supplies asset labels and rules. |
| E02 | [PaymentCard](../../frontend/components/src/lib/ui/components/core/smart-list/card/payment-card/) | 1 | Card rendering and menu events are reusable. Payment/tokenization services and business permissions do not move into the library with the view. |

Initial template/extended candidates: **3 current components**. P01 determines
which parts are general core capabilities and which are application compositions.
No separate parallel base engine will be created for them.

### 3.3. MyScoutee Business Units — Review Their Internals for Shared Capabilities

| ID | Current element and source | Count | Remaining business dependency |
| --- | --- | --- | --- |
| M01 | [PricingEditorInput, PricingEditorPopup, PricingSlotPanel](../../frontend/src/app/shared/ui/components/core/form/inputs/pricing-editor/) | 3 | MyScoutee pricing model and `PricingBuilder`; these become consumers of the shared FormFlow/input contract. |
| M02 | [PoliciesInput and PoliciesInputPopup](../../frontend/src/app/shared/ui/components/core/form/inputs/policies-input/) | 2 | `EventPolicyDTO`, event rules, and a dedicated converter; integrate as application inputs. |
| M03 | [SlotsInput](../../frontend/components/src/lib/ui/components/core/form/inputs/slots-input/) | 1 | **Common editor moved to components/core.** Shared slot fields, recurrence, date overrides and schedule-only editing. Event subdefinitions stay in the application normalizer configured through the input; labels remain application configuration. |
| M04 | [ProfileExperienceManager](../../frontend/src/app/shared/ui/components/core/form/popups/profile-experience-manager/) | 1 | Business models and services for profile experiences; continues to use shared UI elements. |

Initially identified as business units: **7 current components**. The complete
business workflow stays in MyScoutee, while general internal parts may be extracted.
The initial source inventory totals **31 + 3 + 7 = 41**; these counts do not
prescribe the final physical distribution across layers.

### 3.4. Shared Dependencies Outside the Core Directory

| ID | Current source | Destination and extraction task |
| --- | --- | --- |
| S01 | [ExplanationGuideService](../../frontend/components/src/lib/guide/explanation-guide.service.ts), [guide UI](../../frontend/src/app/shared/ui/components/explanation-popup/) | The guide engine, launcher, overlay, and general document rendering are core candidates. Reuse the existing `ExplanationGuideOptions.loadState`; separate the surface list, general view of help DTOs, storage/consent rules, and content-specific exceptions. |
| S02 | [Landing guide provider](../../frontend/src/app/shared/core/base/services/landing-explanation-guide.ts), [guide directive](../../frontend/src/app/entry/components/entry-landing/landing-guide-surface.directive.ts) | The landing page already uses the same engine with another data source. Surface registration can be generalized; the landing data source and entry rules stay with the consumer. |
| S03 | [I18nPipe](../../frontend/components/src/lib/pipes/i18n.pipe.ts), [I18nService](../../frontend/src/app/shared/core/base/services/i18n.service.ts) | General translation engine/contract and shared labels in core. Reusable data source wiring in template/extended; concrete MyScoutee session/scope rules in the application. Adapt the existing behavior without creating a second translation engine. |
| S04 | [DialogStore](../../frontend/components/src/lib/ui/context/stores/dialog.store.ts), [PopupPresenceStore](../../frontend/components/src/lib/ui/context/stores/popup-presence.store.ts), [OverlayNavigationStore](../../frontend/components/src/lib/ui/context/stores/overlay-navigation.store.ts), [FloatingLauncherRegistry](../../frontend/components/src/lib/ui/context/stores/floating-launcher-registry.service.ts) | General UI state in core; make the Angular Router integration dependency explicit. A consumer must not instantiate two separate sets of overlay/guide state. |
| S05 | [ImageGalleryStore](../../frontend/components/src/lib/ui/context/stores/image-gallery.store.ts), [image metadata](../../frontend/src/app/shared/core/contracts/image-gallery.interface.ts) | Gallery state belongs in core. General image metadata and MyScoutee event references need separate contracts. |
| S06 | [UI scheduler](../../frontend/components/src/lib/ui/scheduler/), [directives](../../frontend/components/src/lib/directives/), [CounterBadgePipe](https://github.com/fssrepository/myscoutee/blob/54a3f7d06e5f709c486a4a4b142c53b4331bf20a/src/app/shared/ui/pipes/counter-badge.pipe.ts) | Move existing scheduling, viewport, and lazy image handling with their actual UI dependencies; detach the seeded help-image path. |
| S07 | [ListQuery/PageResult](../../frontend/components/src/lib/foundation/list.types.ts), [converter contracts](../../frontend/components/src/lib/foundation/converter.types.ts), [SmartList helpers](../../frontend/components/src/lib/ui/components/core/smart-list/) | General types and stepper/calendar/timeline behavior receive a shared owner. The application imports the same types instead of copying them. |
| S08 | [AppUtils](../../frontend/src/app/shared/core/base/app-utils.ts), [AppCalendarDateAdapter](../../frontend/components/src/lib/foundation/calendar-date-adapter.ts), [AppStaticData](../../frontend/src/app/shared/core/common/app-static-data.ts), [rating helpers](../../frontend/src/app/shared/core/contracts/rating-snapshot.ts) | Extract genuinely general date, number, horoscope, and rating operations and data. Do not move the entire mixed collection; dating/work/service criteria and business rules belong to the application. |
| S09 | [UI SCSS](../../frontend/components/styles/), [global styles](../../frontend/src/_styles/styles.scss), [theme](../../frontend/src/_styles/_deployment-themes.scss) | Package general styles, mixins, and required global UI rules. Keep application root/layout and business page selectors separate. |
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

### 4.3. P01 dependency decisions — 2026-10-10

Fresh baseline: backend `0941aac8a700b7c2c6cc7aef2b4dda61fbd44d99`,
frontend `3601abd40a05c4746c2d57c62e0d15cc7392bba6`; both clean before this work.
Components and template are also clean, documentation-only repositories.
No frontend watcher, Gradle process, or running Docker container was found;
10 GiB available memory permits a serial focused Angular check. Trust: standard.

| Boundary | Concrete imports / callers and decision | Required verification |
| --- | --- | --- |
| H01 / C10 / S08 | DateInput uses only four AppUtils date methods, AppCalendarDateAdapter/Formats, DateRangeDto, and `APP_STATIC_DATA.profileHoroscopeMetaBySign`. Profile filters also read that same sign table. Move general date operations, adapter, DTO and sign metadata to one portable UI owner; keep compatibility exports/references at existing app paths. | Existing date-adapter regression plus CVA single/range/time, disabled and optional horoscope tests. |
| H02 / C13 / M01–M04 | FormFlow's TS and template import pricing/policies/route components and concrete config types. `FormFlowPopupStore.ensure*Loaded` owns three dynamic imports. Use one registration boundary for application controls and lazy popup loaders; preserve the engine's existing values, validation, summaries and events. PricingBuilder, EventPolicyDTO, ActivityEventDetailDTO and profile services remain application-owned. | Existing FormFlow tests, registered external field and save/reopen of each business editor. |
| H03 / S01–S02 | `EXPLANATION_GUIDE_OPTIONS.loadState` already separates landing and authenticated data. Its default factory still imports HelpCenterService/storage keys; the engine imports HelpCenter DTOs, I18nService and APP_STATIC_DATA. Extract the view contracts and engine, supply the surface predicate, persistence/entry rules and loaders from app providers. Overlay/popup renderers additionally import product constants. | Same engine/provider identity; context stack, language changes, missing/error content and popup reopening. |
| H04 / C08–C09 / S07 | SmartList already accepts `loadPage`, converters and templates. Its runtime app imports are AppUtils, ROUTE_CONFIG and ExplanationGuideService; models import RatingSnapshot, ListQuery/PageResult and converter types. Keep loader/stepper semantics; lift generic types/helpers, supply timing/guide configuration from app. Nine card renderers use media URL rewriting; branded fallbacks also occur in LazyBgImageDirective. | Calendar adapters, stepper and empty-state tests; list/month/week/timeline behavior, selection and scroll preservation. |
| H05 / C14 / S05 / S11 | ImageCarousel imports concrete core services and media URL helpers. ImageGalleryStore validates `detailsConfig.eventRequired` against `details.event.id`. Document attachments import MediaService and announcement/campaign labels. Rendering/state may move only after upload/URL/metadata validation callbacks are explicit; event associations and document limits remain with app consumers. | Gallery token ownership, concurrent save/upload, edit/reorder/delete, caller-owned metadata validation and persisted event links. |
| H06 / S03 | I18nPipe and menu/link/route inputs need translation/revision methods. I18nService additionally owns SessionService, environment routing, bundle repository, HTTP and DOM translation. First define the narrow shared translation contract; preserve the current engine and app scope/cache behavior. Do not clone a second translation implementation or move the session service into UI. | Existing I18nService tests and shared UI using the same revision/language source. |
| H07 / M01–M03 | PricingSlotPanel directly uses PricingBuilder and pricing DTOs; SlotsInput normalizes event templates; PoliciesInput imports event contracts/converters. No independently proven generic wizard is extracted in this step. They register with the common FormFlow boundary and retain their domain behavior. | Business input value/validation regression and open/edit/save/reopen evidence. |
| H08 / C15 / S10 | DeploymentBrand already accepts `branding`, but injects DeploymentConfigurationService for its fallback. DocumentViewer combines rendering with route/help/privacy token resolution and APP_STATIC_DATA palettes. App providers/composition retain configuration, routes and privacy substitution; renderer receives the resulting model. | Explicit branding vs configured default, document/menu rendering and current document tests. |
| H09 / E01–E02 | RouteInput has general string-list value/reordering but product translation defaults and a FormFlowPopupStore cycle. PaymentCard is presentational (translation/menu/image directive); do not import payment services with it. Resolve those boundaries before choosing final extended placement; no second copied composition. | Route ownership/action cloning and card output/menu tests, no reverse app imports. |

Dependency classes: Angular/Common/Forms/Material/CDK/Router and RxJS are runtime
peers. Date/rating/list/converter view types are shared type dependencies; event,
pricing, profile and help persistence DTOs are not UI ownership merely because
an import is type-only. Popup loader `import()` calls must remain lazy. Component
HTML/SCSS stay with their components; shared `@use` mixins must move with their
users. Application global page/layout selectors, theme/deployment wiring,
MyScoutee logo and seeded help assets are consumer responsibilities. Overlay,
presence, launcher and scheduler providers require a single instance per existing
injector scope. Existing tests move with their owners; their app mocks must be
replaced by the corresponding public boundary when the source moves.

D01 remains intentionally unconsolidated until action/clone semantics are covered:
route state clones two arrays while pricing/policies retain shallow object copies.
D02: generic date arithmetic lives in AppUtils beside media and business methods;
rating averaging/shifting lives beside product domain criteria. Split responsibility,
retain old references, and do not alter algorithms. D03: shared SCSS mixins are
imported by core components, while application globals also target component DOM;
package required UI rules without migrating application layout. D04: no additional
behavioral duplicate is established by this static audit; similar business flows
are not automatically duplicates.

Baseline command: `NG_BUILD_MAX_WORKERS=2 npm test -- --watch=false
--include='src/app/shared/ui/components/core/**/*.spec.ts'
--include='src/app/shared/app-calendar-date-adapter.spec.ts'
--include='src/app/shared/core/base/app-utils.spec.ts'
--include='src/app/shared/core/base/services/i18n.service.spec.ts'`.
Result before source edits: **77 passed, 24 failed, 16 files**. Failures include
missing `window.matchMedia` in test fixtures, a popup translation mock without
`currentLanguage`, and the WarpImageCard loader assertion. This is a recorded
pre-existing baseline, not extraction regression or passing runtime evidence.

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
| P01 | Inventory capabilities, imports, and callers by C/E/M/S/H identifier; identify duplication and boundaries between the three layers. | P00 | Each H row includes concrete evidence, core/template-extended/MyScoutee destinations, and required refactoring. Classify runtime/type/dynamic imports, templates, SCSS, assets, providers, and test dependencies. Record the D inventory and single source owners. | **DONE** |
| P02 | Separate general types, helpers, data, and the translation contract within the existing frontend. | P01 | Shared S03/S07/S08 parts have a single owner; the template/extended data source contract is separate from MyScoutee wiring. DateInput and its optional horoscope retain their behavior. | **DONE** |
| P03 | Resolve dependencies of the guide, overlays, and shared UI state. | P02 | S01/S02/S04/S06: the same guide engine works in landing and authenticated contexts, with differences supplied by the application provider. No reverse dependency on the help center backend or MyScoutee surface list. | **DONE** |
| P04 | Generalize the existing FormFlow and inputs; separate core, template/extended, and M01–M04 business parts. | P02–P03 | Core imports no MyScoutee pricing/policies/slot/profile implementation; proven general internals may receive a shared owner. Application fields preserve value, validation, and event behavior. The confirmed shared part of D01 has one owner. | **DONE** |
| P05 | Generalize SmartList, cards, images, branding, and styles; finalize boundaries of template/extended compositions. | P02–P04 | C08–C09/C14–C15/E01–E02/S05/S09/S10: no concrete application configuration or asset assumptions; consumer callbacks and models supply the required data. | **DONE** |
| P06 | Move the cleaned core into components; place selected extended units in template and wire local consumption. | P05 | One implementation and defined public exports per layer; direct public API imports, without old-path forwarding files or wrapper classes. MyScoutee and the relevant template parts consume locally editable components source; the development pipeline tracks changes without an npm release. | **AWAITING VERIFICATION** — core/submodule portion verified; template/extended portion remains outside this delivery. |
| P07 | Verify the independent build from the same Git source. | P06 | Verify Angular compilation, dependencies, public exports and styles. The independent build does not read MyScoutee source. npm publication is outside this point's scope. | **DONE** |
| P08 | Run MyScoutee regression and separate consumer verification; complete the duplication and dependency audit. | P06–P07 | Applicable checks from section 7 have evidence; no source copies or core → app/extended dependencies. Verify selected template/extended parts and MyScoutee integration; separately prove core independence with an isolated consumer. Completing a full template application is not required. | **AWAITING VERIFICATION** — core/submodule portion verified; template/extended portion remains outside this delivery. |
| P09 | Finalize documentation, repository/submodule commits, and continuation state. | P08 | Document the component API, standalone build and submodule development. Make the components commit available before updating the frontend pointer, and the frontend commit before updating the backend pointer. Keep unfinished template work separate. | **DONE** — current components/submodule delivery; broader template items remain recorded above. |

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

Current delivery evidence (2026-10-10):

- Components source commits: `835cf21` extraction, `daad46d` direct APIs/no wrappers,
  `42f9e8f` co-located independent tests. Frontend integration commit: `da249bf0`.
  Both components checkouts remain on `master`; frontend also remains on `master`.
  These commits are local; no push was performed.
- Library tests: 114 PASS; application integration: 14 PASS. Test assertions
  remain with their owning behavior; app-specific cases were split out, not dropped.
- Independent compilation: `/tmp/msc122-public-build.log`. Frontend consumer build
  and tests: `/tmp/msc122-app-integration-tests.log`. No publication or example app.
- Dev watch: temporary source export triggered library rebuild at 08:21:23 UTC,
  application rebuild at 08:21:42 and nginx sync at 10:21:44 local time.
  Probe removal triggered the same pipeline; source is clean afterward.
- Monolith startup: existing seed baseline completed, MongoDB/backend healthy,
  localhost served HTTP 200. The retained Mongo volume needed the already-saved
  root credentials from `.env.secrets` supplied to that existing service via a
  temporary Compose override; committed credentials/config were not changed.
  A future plain Compose recreation still needs the matching local override.
- Browser: versioned `MSC122-COMPONENTS-SUBMODULE` launcher, seeded Alex Turner,
  entry/privacy → login → events/day-month → profile/date → image gallery;
  transport draft → pricing setup (12 returned to summary) → policy create
  (returned to summary) → discard. No asset or profile was saved.
  Screenshots: `/tmp/msc122-events-desktop.png`, `/tmp/msc122-asset-mobile.png`.
  At 390px, visible popup widths and scroll widths matched (390px).
- Limitations: this was targeted regression, not the full manual-QA campaign.
  Event-runtime route editing, upload/save persistence, every business workflow,
  template consumers and guide renderer extraction were not comprehensively tested.
  Existing guide launcher overlaps the gallery right arrow in the narrow desktop
  window; gallery page controls remain accessible. No claim of fixing that layout.


| Date | Point | Affected units / files | Result | Next step |
| --- | --- | --- | --- | --- |
| 2026-10-10 | P01 | H01–H09; C/E/M/S and D dependency boundaries, section 4.3 | Static ownership audit complete; serial baseline: 77 PASS / 24 pre-existing FAIL. No browser actions. | P02 general contracts/helpers. |
| 2026-10-09 | P00 | C01–C15, E01–E02, M01–M04, S01–S11, H01–H09; this plan | Initial static inventory: 41 components under the core directory. Abstraction plan across three layers: components/core, template/extended, MyScoutee. Refactoring may be planned to enable generalization; implementation, library builds, and runtime regression checks have not started. | P01, beginning with a fresh check of source state. |

Historical P00 documentation verification: all 58 local source references existed; comparison
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

## 8. Independent Build and Git Submodule Integration

The components repository builds with `npm ci && npm run build`. MyScoutee
records it as a Git submodule and an npm workspace dependency. The consuming
application imports `@fssrepository/myscoutee-components` and `@fssrepository/myscoutee-components/styles`
(with public style submodules where needed). Components owns its build layout;
no application TS path alias or Sass forwarding file exposes internal paths.
The frontend pipeline invokes the components workspace's own build/watch script.

Edits in the separately opened components checkout must be committed before the
frontend submodule is advanced to that commit. Local development needs no npm
publication. `dist/`, caches and dependencies are ignored in both checkouts.

- [Angular — Creating libraries](https://angular.dev/tools/libraries/creating-libraries)
- [Angular — Angular Package Format](https://angular.dev/tools/libraries/angular-package-format)
- [Git — Submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules)

Later template integration will consume this components source. Completing this
plan does not mean the entire template application has been completed.
