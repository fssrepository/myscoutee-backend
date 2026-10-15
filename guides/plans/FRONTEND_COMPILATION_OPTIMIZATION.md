# Frontend compilation optimization

This is a separate engineering optimization workstream, outside MSC-115 QA.
Its investigation, implementation and measurements are not prerequisites for
closing MSC-115. Application defects and the verification of their fixes remain
with the campaign that exposed them.

## Collected items

| Item | Evidence / current state | Next optimization work |
| --- | --- | --- |
| Time spent rebuilding components and the application | The existing frontend-sync batch on 2026-10-15 reported 23.112 s for the Angular package and 76.407 s for application bundle generation; nginx sync completed at 08:43:04 Europe/Bratislava. These are one observed batch, not a comparative benchmark. | Measure which changes invalidate each stage, then assess unnecessary repeated work using the existing pipeline. |
| CPU and RAM during compilation | Resource checks were taken during the same batch; no second compiler was started. Earlier host crashes do not establish the cause without process evidence. | Compare the same change, cache state and running services before and after a candidate optimization; capture elapsed time, peak memory, CPU and swap activity. |

Batching related fixes and reusing the existing watcher remain execution rules,
not new MSC-115 acceptance checks. Do not introduce a second watcher, build owner,
cache or server to investigate this workstream.

No compilation optimization has been claimed complete by this record. Guide
animation, positioning and context correctness are application behavior and are
tracked separately in their QA evidence.
