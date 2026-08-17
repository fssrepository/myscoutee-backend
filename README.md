# MyScoutee Backend

**The platform behind meetings, not swipes.**

MyScoutee Backend powers group- and event-centred social experiences. It turns
editable 1–10 priorities and mutual affinity into compatible groups, then
supports their journey through chat, events, coordination, and feedback.

Its goal is a **completed, mutually welcomed real-world meeting**—not simply a
match or a message.

## Downloads

### Prerelease installer

A QA prerelease Debian installer, client tools, and their SHA-256 checksum
files are available from [GitHub Releases](https://github.com/fssrepository/myscoutee/releases).
These builds are intended for installation and integration testing while the
remaining qualification work is completed.

## Manual QA status

The current qualification ledger is available as an
[XLSX QA matrix](guides/qa/matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.xlsx).

As of 2026-08-17:

- **Core:** 59 passed, 99 remaining (158 total)
- **External integrations:** 0 passed, 56 remaining (56 total)

The complete matrix contains 214 cases across 13 functional domains. The Chat
coverage audit now contains 20 bounded cases instead of treating the single
authorization checkpoint as the complete chat workflow. `TOURNAMENT-002` through
`TOURNAMENT-004` are PASS/CLOSED after exact grouping, ordered stage
advancement, separate Final Start/room readiness, whole-tournament completion,
personal winner/non-winner results and three-browser recipient verification.
The nested tournament-room visibility and persisted parent current-stage card
checkpoints are PASS/CLOSED, including the in-place Qualifiers `1/2` to Final
`2/2` transition and reload persistence. The active admission checkpoint has
PASS HTTP/Mongo oracles for late Join, existing-invitation acceptance and Admin
approval under the strict first-stage lock; its frontend-local runtime replay
is still NOT EXECUTED. Two separate score-correction checkpoints cover result
revisions and the downstream-stage Reopen guard.

### Official manuals

| Manual | Document version | Applies to | PDF |
|---|---:|---:|---|
| Operations Manual | 1.0.0 | MyScoutee 1.0.0 | [PDF](guides/manuals/MyScoutee_Operations_Manual_v1.0.0_EN.pdf) |
| Administrator Manual | 1.0.0 | MyScoutee 1.0.0 | [PDF](guides/manuals/MyScoutee_Administrator_Manual_v1.0.0_EN.pdf) |
| User Manual | 1.0.0 | MyScoutee 1.0.0 | [PDF](guides/manuals/MyScoutee_User_Manual_v1.0.0_EN.pdf) |

Editable manual sources and PDF build instructions are in
[`guides/manuals`](guides/manuals/README.md).

### Presentations

| Presentation | Version | PDF | PowerPoint |
|---|---:|---|---|
| MyScoutee Network | 1.0.0 | [PDF](guides/pitches/network-output/MyScoutee_Network_Pitch_v1.0.0_EN.pdf) | [PPTX](guides/pitches/network-output/MyScoutee_Network_Pitch_v1.0.0_EN.pptx) |
| MyScoutee Product | 1.0.0 | [PDF](guides/pitches/product-output/MyScoutee_Product_Pitch_v1.0.0_EN.pdf) | [PPTX](guides/pitches/product-output/MyScoutee_Product_Pitch_v1.0.0_EN.pptx) |
