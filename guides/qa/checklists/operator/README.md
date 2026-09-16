# Operator tests

The existing four consolidated Operator tests, in QA matrix order:

| Test | Scope | Blocks |
| --- | --- | --- |
| [Configuration](OPERATOR-CONFIGURATION-LIFECYCLE-001.md) | Firebase save/test/activation and restoration; reuse proven public/payment and sign-in evidence | C01–C03 |
| [Registry](OPERATOR-REGISTRY-LIFECYCLE-001.md) | Registration, claim/link, community/leaderboard, measurements, deactivation and recovery | 1–4; 18 steps |
| [Updates](OPERATOR-UPDATE-LIFECYCLE-001.md) | Verified update, cache-miss rollback, failed-update recovery and managed HTTPS | 1–6; 24 steps |
| [Revenue](OPERATOR-REVENUE-LIFECYCLE-001.md) | Prepared payments, one synchronization and one settlement | 1–3; 11 steps |

Results and previously verified branches belong in the QA pack and CSV/XLSX
matrix. These guides do not imply execution or PASS. Dedicated fixtures and
browser startup are prepared when each test starts. Use fixtures for already
verified prerequisite journeys instead of repeating their manual steps.

Each guide maps its detailed assertions back to the original QA matrix.
Fixture prerequisites remove repeated journeys, not unproven result checks.
