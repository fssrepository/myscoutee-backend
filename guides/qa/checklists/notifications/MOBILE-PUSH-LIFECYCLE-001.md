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

To start, tell Codex:

`Prepare MOBILE-PUSH-LIFECYCLE-001 device preflight only.`

Begin after Codex confirms ADB transport/tunnel, package/build identity,
Firebase revision, Riley identity, one opaque device registration, zero target
message rows and the current Android notification permission.

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

Codex verifies all five message IDs, per-phase delivery results, target-only
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
