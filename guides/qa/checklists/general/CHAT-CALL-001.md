# MSC-117 — ordered automatic remaining WebRTC QA

Prepared on2026-10-15. Execute only after the user starts this campaign.
Once delegated, proceed in numbered order, repair observed defects and retest
affected behavior. Report progress by block/step and record results at block end.
No other checklist is required to perform these development steps.

## Accepted evidence and scope

Credit October6 WASM MLS/FFT, live signaling/authority/coordinator and own-STUN
checks. Credit October12 template browser evidence for the shared call owner:
two-way real RTP audio/video, non-relay ICE, mute/camera-off/track cleanup,
immediate second call, ten successive calls, and35-second KVM media/socket
continuity across delegation expiry. These used synthetic media, not physical
microphone quality. Source and template call service/MLS/detector/popup files
are currently identical; later shared error presentation still needs its own
targeted check. Do not repeat the accepted call series.

The former nonreproduced CALL-01 observation was explicitly removed from the
open list by the user after successful tests. Do not reopen it as a closure gate.
Three-/seven-party media, real viewport RTP suppression, remaining controls,
call guides and source-specific integration are not proved by two-party calls.

Template execution stays in the existing template QA. Physical microphone,
camera, external-network/NAT and installed/deployed-client qualification stay
in the separate live checks outside the development QA ledger. Local-only mode
has no call transport; unavailable calling there is expected, not a missing test.

## Preparation

Baseline: Existing MyScoutee monolith, owned STUN and disposable chat-call actors.
Keep other retained fixtures untouched; KVM and monolith never run together.

1. Record source revisions, current call-owner differences from the credited evidence, running database/profile, health, CPU and memory. Reuse the running watchers; no second compiler or application stack.

2. Inspect the existing chat-call fixture. If absent, stage once with `bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh stage chat-call CHAT-CALL-001`. Verify with `bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh ready chat-call CHAT-CALL-001`: Alice admin, Bob/Carol ordinary members, WebRTC test chat and zero persisted messages. A previous ready result is insufficient after restart/reset.

3. Launch `node guides/qa/tools/open-checkpoint-browser-sessions.mjs CHAT-CALL-001-GROUP`. Use its three distinct profiles and synthetic media. Attach bounded getStats/track/socket/error capture to actual browser transports; never fabricate connected state, media counters or successful signaling.

4. For later paging, extend the existing fixture/launcher owner to seven distinct disposable authorized actors with retained cleanup if no larger baseline exists. The current owner provides three only. Do not duplicate an identity or pretend three actors prove a full mobile/laptop page. A missing larger baseline blocks only that block; prepare it during execution under the same fixture owner.

## MSC117-SOURCE — Source integration and untested controls

Baseline: Alice/Bob/Carol in Activities → Chats → WebRTC test chat.

5. Verify the green phone sits in the second header row before avatars, not beside Close. Open it: the lazy call popup starts audio without a second Start control or camera prompt. Check chat-sized geometry, self tile during permission pending, bottom controls and no spare participant, waiting badge or verification-code button.

6. Use one short source call to establish the current integration baseline and exercise the new shared popup error presentation. Bob declines a separate attempt: no live media tracks and Alice receives decline state. Deny microphone permission, verify translated readable error, close, restore permission and retry. Closing during permission/connection pending releases late tracks and cannot reopen the popup. Do not repeat the accepted ten-call campaign.

7. Check own tile microphone/camera icons and Me panel camera reuse the bottom controls. Camera-off shows avatar/red crossed camera below the microphone; re-enable restores video. Remote tile mute/video icons and the named panel controls stay synchronized. No All videos control exists.

8. Open the compact upward volume popup: the grid does not jump. Me controls local playback, named full-name sections control individual peers; desktop two columns, mobile one, scrollable when needed. Change master and per-peer percentages, mute/unmute and verify retained levels. Local speaker mute leaves outgoing microphone/audio to others unaffected.

9. Verify muted tile red border/crossed microphone, speaking green microphone/border and camera-off marker placement, including fullscreen. Fullscreen/restore stays light with a dark icon. Browser autoplay rejection uses the existing audio-unlock control and recovers normally.

## MSC117-GROUP — Three-party media and authority

Baseline: Three distinct actors in one call, real browser media and getStats.

10. Alice starts; Bob and Carol join. Each receives audio/video from both others, exactly three tiles, no duplicate audio. Zoom a participant and restore; the others' audio continues. Departure of the focused participant restores the grid.

11. Alice admin-mutes Bob. All recipients stop hearing him, his microphone controls are disabled and admin-mute text appears. Bob leaving/rejoining the same call cannot bypass it. Release does not enable his microphone automatically; Bob enables it. Bob/Carol cannot admin-mute.

12. Alice hangs up; Bob becomes oldest surviving coordinator and retains the call with Carol without gaining admin authority. Repeat with Alice's browser closing. Rejoin Alice through the phone: three unique peers, no duplicate sound. Credit existing MLS epoch/authority tests; inspect actual roster/key-transition events for this browser flow.

13. Disable only Bob's incoming video at Alice. After buffered frames drain, Alice's Bob video RTP bytes/frames stop materially increasing while Bob audio continues; Carol still receives Bob video. Re-enable restores Alice's video. Bob camera OFF/ON and a joining peer cannot override Alice's explicit receive prohibition.

## MSC117-PAGING — Visible video and continuous audio

Baseline: Prepared seven-actor call. Use actual viewport geometry and RTP deltas;
a vanished picture is insufficient proof that network video stopped.

14. With speaker following OFF, constrain the three-actor grid to two visible tiles and page both ways. No narrow/collapsed video column; all participants remain reachable.

15. In the seven-actor call, mobile shows2×2 with later peers on another page; laptop fits up to3×2 according to available space. Native horizontal swipe and shared SmartList navigation work both ways. During partial-page swipe, partially visible tiles may still receive video.

16. Measure before/after RTP at settled pages: fully offscreen peer video pauses, visible video resumes, audio counters continue for all joined peers. Repeat resize and fullscreen/restore. Teardown closes actual peer connections and tracks.

17. Disable Bob video, page away/back and toggle Follow speakers. The prohibition survives; Carol remains unaffected. Re-enable Bob while offscreen: video resumes only once visible. Panel and tile icons agree.

18. Set volume/mute for an offscreen peer through their named panel section. Only that peer's playback changes; returning to the page preserves indicator and percentage. Use controlled synthetic source levels for measurable playback behavior, not a claim of physical audio quality.

19. Enable Follow speakers through the standard icon/label/switch menu control. Active blue palette needs no hover. Controlled alternating speech brings current/recent speakers to the visible page, preserves recent order during gaps and respects explicit video prohibition. OFF restores participant order and manual paging. Verify48-band/40px FFT and speech indication with actual analyser input; mute/admin-mute suppress it.

## MSC117-TRANSPORT — Availability and cleanup

Baseline: Record original owned STUN/container state; preserve active unrelated work.

20. With no call active, stop only `myscoutee-stun`. The phone becomes mirrored red/crossed/disabled on the next availability signal. Restart that same container; green/enabled returns without reload. Restore it even on failure. Already established direct media must survive a brief STUN outage.

21. Break one actor's signaling WebSocket at the transport boundary. Their call and tracks close; peers remove them. Reconnect and start/join normally. Check selected ICE is host/srflx/prflx, never relay, and uses owned application-host STUN3478; no external STUN/TURN/SFU.

22. Verify fixture chat-message count remains zero after call signaling and that all ended calls release tracks/peers. Run current focused MLS/signaling/runtime checks only for missing current-source proof or a related fix; do not substitute mocks for browser RTP.

## MSC117-GUIDES — Remaining call Help and layout

Baseline: Prepared waiting/self-only, incoming, joined, paged and focused states.
Use EN/HU at1280×900,390×844 and short390×560; only rendered controls count.

23. In ordinary and event chat, Guide includes the visible phone target and explains available/unavailable state. Check Dating/Work/Community revisions; Next does not start a call. Carry forward MSC-115 chat-category and case Tasks-navigation evidence; missing source-specific variants receive only targeted checks.

24. Open call Guide in each prepared state. Cover participant grid, Follow speakers, own microphone/camera, peer mute/video, fullscreen, spectrum, bottom controls and Close. Omit absent accept/decline/admin/audio-unlock controls. Guide navigation never joins, declines, toggles media, moderates or hangs up.

25. Open volume then Guide: context becomes chat.call.volume, Me explains incoming playback rather than microphone gain, peer highlights stay in their own visible block. Close Guide only, then volume; call remains and its context returns. End the functional call normally; parent chat guide returns without registrations/load loops.

26. In paged/fullscreen states highlight only visible tiles, never the hidden page/chat. Run Next/Back/picker/Done; text fits five lines, no clipped controls/raw keys. Verify local/Mongo EN/HU field parity separately; offline local mode cannot supply a working call.

## Closure

Baseline: New development evidence plus precisely credited prior checks.

27. Repair existing owners and retest affected boundaries. Route template impacts/revisions to the existing template regression record; no template execution in this campaign. If backend behavior changes, verify monolith/KVM serially with a focused sample, then restore original owners. No unrelated stress campaign.

28. Restore STUN and only chat-call-owned records/sessions, then close both CHAT-CALL-001 and CHAT-CALL-001-GROUP launcher sessions with --close-only. Reset using `bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh reset chat-call CHAT-CALL-001`; verify only owned fixture records disappeared and no new process remains.

29. Record each block with actor count, viewport/language, source/runtime, actual audio/video RTP deltas, track cleanup and limitations. Reconcile CHAT-CALL-001 and the guide umbrella once. Close development only when remaining development blocks pass; physical/live checks and template QA keep their independent status.
