# Operator tests

The existing four consolidated Operator tests, in QA matrix order:

| Test | Scope | Blocks |
| --- | --- | --- |
| [Configuration](OPERATOR-CONFIGURATION-LIFECYCLE-001.md) | Public settings, HTTPS, payment provider, Firebase and restoration; reuse proven WebView/Push evidence | C01–C08 |
| [Registry](OPERATOR-REGISTRY-LIFECYCLE-001.md) | Registration, claim/link, community/leaderboard, measurements, deactivation and recovery | 1–4; 13 steps |
| [Updates](OPERATOR-UPDATE-LIFECYCLE-001.md) | Apply a compatible QA release, observe progress and verify installed version | 1–3; 9 steps |
| [Revenue](OPERATOR-REVENUE-LIFECYCLE-001.md) | Prepared payments, one synchronization and one settlement | 1–3; 8 steps |

Results and previously verified branches belong in the QA pack and CSV/XLSX
matrix. These guides do not imply execution or PASS. Dedicated fixtures and
browser startup are prepared when each test starts. Use fixtures for already
verified prerequisite journeys instead of repeating their manual steps.
