# AFFILIATE-INVITATION-001 — Referral and imported-participant counters

New independent regression; INTEGRATION-API-001 and its historical PASS remain unchanged.

## Environment and baseline

Running dev HTTP stack through nginx, demo_db. Two isolated managed browsers:
disposable owner and anonymous visitor. The visitor uses the supported new demo
profile registration UI; this proves onboarding/profile save, not Firebase's
external identity-provider redirect. No referral, token, invite, claim or counter
result is seeded. No device viewport emulation.

```
python3 guides/qa/tools/affiliate-invitation-fixture.py stage
python3 guides/qa/tools/affiliate-invitation-fixture.py status
node guides/qa/tools/open-checkpoint-browser-sessions.mjs AFFILIATE-INVITATION-001
```

## Numbered flow

1. Owner Profile → Affiliate: personal badge `0`, client badge `0 / 0`.
   Record the link. All data comes with the existing settings GET.
2. Open that exact personal link in the anonymous browser. Use Login → Demo →
   New profile and complete onboarding. Track the generated QA identity with
   `affiliate-invitation-fixture.py track USER_ID` before submitting.
3. Reopen owner's Affiliate popup: badge `1`; API badge remains `0 / 0`.
   Confirm exactly one persisted attribution to this owner.
4. Reopen the same link as the registered user, reload and reopen owner popup:
   still `1`; no duplicate attribution.
5. Generate a fresh client key using owner UI. Connect via the public Integration
   API with a fresh client ID. Create a disposable future event and import two
   distinct participant IDs through POST `/events/{id}/invites`.
6. Reopen owner popup: personal `1`, client `0 / 2`. Repeat identical import:
   client still `0 / 2`; returned participant links remain stable.
7. Open the first API invite in the registered visitor browser and complete the
   normal claim flow. Owner popup after reopen shows `1 / 2`, personal still `1`.
   Verify persisted claim and external-ID mapping.
8. Replay the claimed link and import; reload/reopen owner: still `1 / 2`.
   Unclaimed second participant remains unclaimed.
9. Revoke the new key through owner UI; verify subsequent connect returns 401.
   Reopen the popup: personal `1` and client `1 / 2` MUST remain. These counts
   belong to referral/participant records, not the API credential lifecycle.
   Close this checkpoint's browsers, restore launcher session snapshots, and
   reset only this fixture. Do not delete/modify unrelated profiles/resources.

## Results

Execution results belong in the QA ledger and separate evidence files; prior
INTEGRATION-API-001 results are not changed by this checkpoint.

## CDP replay commands

After the baseline/launcher commands above, use the versioned steps below.
Each command performs the named UI action on its managed actor. Wait for the
current UI transition to settle before the next command. The original execution
used these same DOM controls, not component-state mutation. Inspect output with
`node guides/qa/tools/affiliate-invitation-cdp.mjs ACTOR` if a control differs.
The new user's generated ID is read from the onboarding component solely to
register cleanup ownership before Save.

```bash
mkdir -p /tmp/affiliate-invitation-001
qa_cdp() { node guides/qa/tools/affiliate-invitation-cdp.mjs "$@"; }
qa_cdp 0 @owner-open
qa_cdp 0 @affiliate-open /tmp/affiliate-invitation-001/baseline.json
qa_cdp 1 @visit
qa_cdp 1 @login
qa_cdp 1 @new-profile
qa_cdp 1 @fill-profile /tmp/affiliate-invitation-001/visitor.json
python3 - <<'PYCODE'
import json, subprocess
user = json.load(open('/tmp/affiliate-invitation-001/visitor.json'))['userId']
subprocess.run(['python3', 'guides/qa/tools/affiliate-invitation-fixture.py', 'track', user], check=True)
PYCODE
qa_cdp 1 @select-profile
qa_cdp 1 @language
qa_cdp 1 @upload-photo
qa_cdp 1 @photos-finish
qa_cdp 1 @review
qa_cdp 1 @save
qa_cdp 0 @owner-refresh /tmp/affiliate-invitation-001/after-registration.json
qa_cdp 1 @visit
qa_cdp 0 @generate
qa_cdp 0 @confirm-generate /tmp/affiliate-invitation-001/client.json
python3 guides/qa/tools/affiliate-invitation-api.py create
qa_cdp 0 @owner-refresh /tmp/affiliate-invitation-001/after-import.json
python3 guides/qa/tools/affiliate-invitation-api.py repeat
qa_cdp 0 @owner-refresh /tmp/affiliate-invitation-001/after-repeat.json
qa_cdp 1 @claim
qa_cdp 0 @owner-refresh /tmp/affiliate-invitation-001/after-claim.json
qa_cdp 1 @claim
python3 guides/qa/tools/affiliate-invitation-api.py repeat
qa_cdp 0 @owner-refresh /tmp/affiliate-invitation-001/after-claim-repeat.json
qa_cdp 0 @reload
qa_cdp 0 @reopen-after-reload /tmp/affiliate-invitation-001/after-reload.json
qa_cdp 0 @revoke
qa_cdp 0 @confirm-revoke
python3 guides/qa/tools/affiliate-invitation-api.py revoked
qa_cdp 0 @owner-refresh /tmp/affiliate-invitation-001/after-revoke.json
python3 guides/qa/tools/affiliate-invitation-fixture.py status > /tmp/affiliate-invitation-001/persisted-final.json
python3 guides/qa/tools/affiliate-invitation-assert.py
node guides/qa/tools/open-checkpoint-browser-sessions.mjs AFFILIATE-INVITATION-001 --close-only
python3 guides/qa/tools/affiliate-invitation-fixture.py reset
```

The `client.json` output contains the one-time key, is written with mode 0600,
and must stay outside the repository. Delete runtime files after recording
sanitized results. The fixture refuses an existing reserved owner and only
accepts tracking of a new `demo-profile-UUID` before its profile exists. Reset
removes those tracked identities' uploaded image prefixes and domain records;
it does not overwrite other fixture baselines or global telemetry totals.
