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
| New demo profile | Open Explore, choose new demo profile, complete registration and upload a profile image; verify the saved profile | Pending |
| Profile update | Edit the new profile, replace its image, save, reopen and verify persisted values and image | Pending |
| Event | Create an Event with an image as the new profile; verify its list and detail views and reopen it | Pending |
| Asset | Create an Asset with an image as the same profile; verify its list and detail views and reopen it | Pending |
| Retention | Keep the UI-created profile, Event, Asset and media for the final package reinstall check | Pending |
| Package reinstall | After the single final `1.0.0` build is installed on Netcup, check the retained records and images before publishing release metadata | Pending |

Use the versioned `NETCUP-DEMO-SMOKE` browser launcher documented in
[the deployment guide](../NETCUP_DEPLOYMENT.md). Keep the browser visible to the
owner. Record actual observed results; HTTP health checks alone do not prove
these UI steps.

Firebase login and push delivery are outside this demo journey and remain
unverified until Firebase is configured. This checklist is separate from the
VMware normal-account deployment smoke and the manual-QA campaign.
