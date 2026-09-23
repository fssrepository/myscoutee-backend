# OPERATOR-EMAIL-WARNING-001 — 2026-09-23 preparation

Status: full Operator/backend Job flow NOT RUN; queued after gallery QA.

The standalone email stub's readiness marker preceded binding the HTTP socket. A real immediate HTTP request failed with ConnectionRefusedError. Fixed by binding before readiness; port 0 now reports the actual allocated port.

`python3 guides/qa/tools/test_email_provider_stub.py -v`: PASS (one test with 202 and 401 subcases). Real loopback HTTP verifies acceptance/error status, X-Message-Id, missing-fields 400, wrong-path 404, exact saved body, absence of Authorization/key data, and evidence-file mode 0600. Temporary servers terminated and files removed. No actual email sent.

This proves only the fixture receiver. Operator configuration, backend adapter, persisted warning outcomes and periodic Job have not run yet. Set the backend's dev-only EMAIL_SENDGRID_ENDPOINT to a reachable stub before enabling delivery.
