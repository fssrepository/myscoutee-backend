# MSC-117/118 — separate live and physical-device qualification

Status: NOT RUN. Reconciled2026-10-15. These are the physical/provider/deployed
boundaries removed from the development QA checklists. Their execution requires
the actual configured environment and consenting disposable test identities;
this document does not start production changes, real payments or installations.
No synthetic-media, in-app inbox or unit-test PASS substitutes for these results.

Run in order when the prerequisites are available. Record deployment/revision,
device/OS/browser/network, observation and evidence per item. Development and
template campaigns remain independently closable for their demonstrated scope.

1. **MSC117-LIVE-01 — Physical audio/video. NOT RUN.** Use two separate devices
   with headphones, actual microphones/cameras and the same authorized chat.
   Check bidirectional audio/video, camera changes, normal/quiet/noisy speech,
   delay, echo/distortion and48-band speech/silence indication. In a self-only
   call, microphone activity must not play back locally; camera preview is muted.
   Two browsers sharing one physical microphone can receive each other's audio:
   mute the second browser's mic/playback for any single-device diagnosis.
   Verify local versus admin mute and level restoration through real playback.

2. **MSC117-LIVE-02 — External-network ICE. NOT RUN.** Put the devices on distinct
   networks and use the deployment's own STUN3478. Record public UDP reachability,
   selected non-relay candidate pair and actual media. When direct ICE cannot
   connect, expect an honest failure without TURN/SFU/external-STUN fallback.
   Synthetic localhost and template KVM calls do not prove NAT interoperability.

3. **MSC118-LIVE-01 — Real role/security delivery. NOT RUN.** On a configured
   deployment use approved disposable registration/report/feedback/login events
   and a physical device with notification permission. Verify the intended
   account/role receives actual provider delivery and the correct workspace or
   Updates/Reports/Feedback/Statistics destination in foreground, background and
   reopen. Record provider/device evidence, not merely persisted outbox rows.
   Reuse any matching existing physical notification result instead of repeating
   it. Keep app-only producer/count/route proof in development QA.

4. **MSC118-LIVE-02 — Scheduled release discovery. NOT RUN.** With a valid
   installed version and configured signing key, observe startup discovery and
   a real six-hour scheduled cycle against controlled signed release metadata.
   Updates may also trigger the existing check. An eligible newer release creates
   one notification; repeated discovery does not duplicate it or install a
   package automatically. Record actual timestamps and final inbox identity.
   No accelerated clock or service test is a six-hour observation.

Restore test-owned preferences/accounts/provider registrations through their
own lifecycle; retain unrelated deployment state. A discovered product defect
returns to its owning development task, not to a hidden live-only exception.
