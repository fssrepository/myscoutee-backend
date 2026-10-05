# Login/logout transition diagnosis — 2026-10-06

Scope explicitly delegated by the user: login and logout in the already-open managed CDP browser. No wider MSC115 business flow was executed.

## Observed defect

The first trace showed `logout.question` replacing the translated confirmation during session teardown. The old shell also changed before the destination route committed. After the first correction, the new page could spend about 8 ms with the previous shell class; the intermediate trace is retained separately.

## Changes

- One application-owned DialogStore outlet and one lazy demo-selector outlet survive route transitions; route components no longer instantiate duplicates.
- The existing application shell changes when the destination outlet activates. Pending/cancelled navigation leaves the current shell intact; the activation renders shell and page together.
- I18n retains its displayed dictionaries while a new session scope loads. Existing generation checks reject stale responses. No temporary English/key-only redraw.
- The action-ring SVG is hidden until its real geometry is available, avoiding the guessed initial button dimensions.
- Landing slideshow autoplay respects a covering modal; this is distinct from the route defect.

## Verification

[Final CDP trace](AUTH-TRANSITION-20261006.json): Community demo member Evan Reed, normal Login → demo selector → member → `/game`, then Settings → Logout → confirmation → `/entry`.

Assertions passed: exactly one NavigationStart/NavigationEnd pair for each destination; no NavigationCancel/NavigationError or route bounce; every observed Home/Entry page has its matching shell; confirmation never shows the translation key; at most one confirmation outlet. Same-URL NavigationSkipped events caused by overlay history are recorded and do not activate another route. The diagnostic observers were disconnected. Browser left signed out at `/entry`.

The final replay used normal controls after their rendered state settled. A preliminary overly fast selector script did not open the demo dialog and was retried after inspecting the actual DOM; it is not a product or lifecycle PASS. No unrelated forms or records were changed.

This evidence covers the successful member flow in desktop Chrome. Slow-network failure/cancel/retry, other roles, mobile and native WebView remain separate QA oracles; no claim of those results is made.
