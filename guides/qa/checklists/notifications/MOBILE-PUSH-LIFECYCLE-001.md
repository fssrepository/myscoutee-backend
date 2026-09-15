# MOBILE-PUSH-LIFECYCLE-001 user test guide

This is the one physical-device notification journey. It covers foreground,
background, closed-app cold start, permission denial and token replacement with
ordinary Chat messages. It does not test Operator Firebase configuration; a
tested active Firebase revision is a prerequisite.

## Required environment and actors

- Run only in the disposable QA environment with an Operator-tested active
  Firebase revision and populated public client configuration.
- Use one disposable Android phone installation as **Riley**, one isolated
  desktop sender as **Casey**, and **Nova** in a foreground desktop session as
  the no-system-push control. Codex prepares their exact controlled Group Chat.
- Riley starts with exactly one current registered device. No second Riley
  phone, browser push registration or stale test token may be active.
- Raw registration tokens, authorization data and notification payload secrets
  must never appear in screenshots, logs, filenames or the QA ledger.
- Do not clear app data, reinstall, rotate a token or change permission except
  at the exact step that requests it.

Codex prepares the versioned fixture and confirms ADB transport/tunnel, package/build identity,
Firebase revision, Riley identity, one opaque device registration, zero target
message rows and the current Android notification permission. If the user has
delegated this checkpoint, Codex also performs its browser and device actions.

## Fixture and device-registration baseline

Reuse the completed [WebView evidence](MOBILE-WEBVIEW-LIFECYCLE-001.md).
Do not repeat its permission-popup, off/on/reload, installation, clipboard,
consent, login or cache journeys. Do not replay the Operator configuration
journey to reach this test.

Codex loads the QA Firebase configuration and controlled actors/Chat through
the versioned fixture. Retain the provenance of the previously tested provider
configuration. If Riley has no current real device registration, register this
one browser/device through its normal registration path, including only the
native permission decision required for that setup. This is baseline
preparation, not another WebView or Operator test or a new PASS for either.

Require exactly one current Riley provider registration and zero controlled
Chat messages before section 1. Fixture state or an opaque placeholder cannot
substitute for a genuine browser-issued FCM token. Do not count a mocked
provider or a later poll refresh as FCM delivery. Permission denial and token
replacement are exercised only in their Push sections below.

## Execution order and recovery

Follow this order once: fixture/device baseline → foreground → background
(Home, Settings, Chrome) → fully closed/cold start → permission denial → token
replacement → final oracle and cleanup. Report the current section, its result
and the next action at each boundary. Before each browser/device action,
Codex announces the checklist section number/title, current step and immediate
action so the user can follow the same block and assist. Reinspect the
current UI and persisted message state before acting; skip an action already
completed by the user, especially a send. Record any user-supplied message
text against its exact phase/message ID instead of sending a duplicate marker.

After a defect, repair its owner and resume from the nearest valid fixture
savepoint. Replay only the affected action and its necessary causal tail.
Repeat an earlier passed section only if the defect contaminated its baseline
or the repair changed the behavior that section proved; record that reason
before replaying it. Keep passed evidence and avoid full checkpoint restarts,
adjacent journeys and redundant checks. Elapsed time is part of execution
planning; it never turns an unobserved result into a PASS.

## 1. Foreground delivery

1. On Riley's phone, keep the app visible but keep the controlled Chat and
   Notifications popups closed.
2. In Casey's desktop Chat, send exactly once:

   `MOBILE-PUSH-LIFECYCLE-001 foreground`

3. Riley receives one in-app notification/counter update. Android must not show
   a duplicate system notification while the app is foregrounded. Nova gets
   the same eligible in-app Group notification but no system push; Casey
   receives no self-notification.
4. Open Riley's Notifications New list without opening the row. Confirm one
   unread item with Casey and the controlled Chat context. Report:

   `MOBILE-PUSH-LIFECYCLE-001 foreground complete`

Codex verifies one message, logical outbox, inbox row and current-token delivery
attempt with matching unread count.

## 2. Background and fully closed delivery

The resident-background branch also covers **several different Android
applications open at the same time**. This means switching between MyScoutee,
Android Settings and Chrome on a non-QA page; it does not mean opening more
MyScoutee instances or registering another push client.

Repeat steps 5–8 with Settings foregrounded and then with the non-QA Chrome
page foregrounded, keeping the other applications in Recents. Use one fresh
message per variant, with `background-settings` or `background-chrome` in place
of `background`, and retain each message ID in the same testcase's evidence.
Apply the existing background oracle in both variants: exactly one Android
notification, one persisted inbox/counter delta, and the same row after return
without duplication. Record whether Android retained or recreated MyScoutee.
The fully closed branch at step 9 remains a separate observation.

Attribute the delivery path as well as the visible result. While another
Android application is foregrounded, prove that the system notification came
through the real Firebase Messaging delivery and the service worker, rather
than inferring push success from a later WebSocket/poll refresh. On resume,
reconcile the same notification identity with server truth once. Firebase
handles background notification delivery; it does not replace the application's
ordinary HTTP data reads. Retain the active/tested Firebase revision and opaque
registration/delivery identities, without logging the token or payload secrets.

5. Return to the app's normal screen and press Android Home so the app is in
   the background. Do not swipe it away yet.
6. Casey sends exactly once:

   `MOBILE-PUSH-LIFECYCLE-001 background`

7. Android shows exactly one system notification for Riley. Do not tap it yet;
   record that the persisted unread count increased once. Nova receives only
   the eligible in-app row, never a desktop/system push duplicate.
8. Bring the app forward from Recents without tapping the notification. The
   in-app list reconciles the same row once; it must not create a second row.
9. Leave the controlled Chat, then fully close the app by swiping it away from
   Recents. Wait for Codex to confirm the process is absent.
10. Casey sends exactly once:

    `MOBILE-PUSH-LIFECYCLE-001 cold-start`

11. With the app closed, Android shows exactly one new system notification.
    The backend row remains unread until the notification is intentionally
    opened.
12. Tap that cold-start notification. The WebView opens once as Riley and
    routes directly to the exact Chat/message context. It must not open Home,
    another Chat, a duplicate popup or a login screen.
13. Confirm only the tapped notification becomes read. Back and a later normal
    relaunch do not repeat the deep-link action. Report:

    `MOBILE-PUSH-LIFECYCLE-001 cold-start route complete`

Codex compares message, push tag/deep link, recipient inbox/outbox, read
timestamp and counter identities. Opening the cold-start notification must not
silently read the separate background row; Casey remains excluded and Nova
remains the foreground no-system-push control.

## 3. Permission denial

14. In Android system settings, deny notification permission for the app and
    return normally. The app remains usable and must not loop, block navigation
    or repeatedly force Settings.
15. Casey sends exactly once:

    `MOBILE-PUSH-LIFECYCLE-001 permission-denied`

16. Android shows no system notification. After Riley opens the app normally,
    the pulled in-app row appears once with the correct unread counter. The
    delivery result records the permission/token condition without deleting
    the in-app inbox row.
17. Report:

    `MOBILE-PUSH-LIFECYCLE-001 denial complete`

## 4. Revoke, replace and re-register

18. Wait while Codex captures the old opaque device-registration identity and
    performs the checkpoint's supported revoke/rotation boundary. The token
    value itself is never displayed.
19. Grant Android notification permission when the app requests it and bring
    the app to the foreground once so registration can finish. Codex confirms
    exactly one different current opaque registration and that the old one is
    retired; do not continue while both are eligible.
20. Background the app. Casey sends exactly once:

    `MOBILE-PUSH-LIFECYCLE-001 replacement-token`

21. Android shows exactly one system notification delivered through the new
    registration. There is no attempt that successfully targets the retired
    registration and no duplicate inbox row.
22. Tap it and confirm the exact Chat route, one read transition and stable
    result after back/relaunch.
23. Report:

    `MOBILE-PUSH-LIFECYCLE-001 user steps complete`

Codex verifies the five main message IDs plus the two other-application
background variant IDs, per-phase delivery results, target-only
audience, dedupe, token retirement/replacement and terminal counters, then
resets the disposable Chat/device fixture without printing token material.

## Expected effort

| Work | Clean run | With one device/reconnect replay |
| --- | ---: | ---: |
| Device/Firebase/ADB preflight | 20 min | 50 min |
| Foreground/background/closed delivery | 35 min | 75 min |
| Cold-start route and read reconciliation | 15 min | 35 min |
| Permission and token replacement | 20 min | 50 min |
| Evidence and cleanup | 10 min | 25 min |
| **Total** | **100 min** | **235 min** |

### Device persistence and transport preflight

Use the normal configured PWA/Firebase deployment, without query or browser-
storage test switches. Reuse the completed shared popup/local-device persistence
evidence from MOBILE-WEBVIEW-LIFECYCLE-001; prepare only the current Push baseline.
Local registrations
contain no Firebase token and cannot count as a provider-delivery result.
The phone transport fixture may shape the PWA and its same-origin worker; it
must leave phone radios/tethering intact. This does not disconnect Android's
FCM system transport, so it cannot prove provider behavior during a physical
whole-device internet outage.
