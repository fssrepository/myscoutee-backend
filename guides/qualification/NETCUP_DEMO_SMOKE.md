# Netcup demo smoke test

Target: `https://myscoutee.com`, installed application version `1.0.0`.
The owner authorized visible CDP execution on 2026-09-18.

## Required journey

Use the Explore/demo application and create a **new demo profile through the
browser UI**. Continue every step below as that same newly created profile.
A login using a pre-existing seeded demo user is not a substitute. Do not
inject a completed profile, Event or Asset through an API or database fixture.

| Step | Required check | Status |
| --- | --- | --- |
| New demo profile | Open Explore and create a new demo profile through registration | Completed by owner; `csyy` was observed signed in |
| Profile update | Edit the new profile, replace its image, save, reopen and verify persisted values and image | Not independently verified; owner ended the smoke test |
| Event | Create an Event as the new profile; check its saved details and image | Creation confirmed by owner; image persistence not independently verified |
| Asset | Create an Asset as the same profile; check its saved details and image | Creation confirmed by owner; the `vcx` transport asset was also observed in the UI |
| Package reinstall | After the single final `1.0.0` build is installed on Netcup, check host qualification and public HTTPS before publishing release metadata | Passed on 2026-09-18: host qualification, seven healthy containers and 13/13 public checks; normal TLS trust with the current server IP explicitly selected because local DNS was stale |

The owner declared this smoke test complete on 2026-09-18. No further browser
actions were performed after that instruction. This is user-confirmed smoke
completion, not a claim that Codex independently verified every image workflow.

The package's existing reinstall contract refreshes the demo database from its
packaged seed. Demo test records are not production upgrade-preservation
controls. Back up the current state before reinstalling; do not change the
installer's demo reset contract to retain this test profile.

Use the versioned `NETCUP-DEMO-SMOKE` browser launcher documented in
[the deployment guide](../NETCUP_DEPLOYMENT.md). Keep the browser visible to the
owner. Record actual observed results; HTTP health checks alone do not prove
these UI steps.

Firebase login and push delivery are outside this demo journey. Firebase was
subsequently activated after its Authentication and browser Messaging readiness
tests passed; personal Google login and ordinary application push delivery
are not claimed by this demo checklist. This checklist is separate from the
VMware normal-account deployment smoke and the manual-QA campaign.
