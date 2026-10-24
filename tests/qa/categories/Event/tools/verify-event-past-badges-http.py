#!/usr/bin/env python3
"""Exercise normal counter writes on the prepared end-boundary Admin Job fixture."""
import argparse
import json
import os
import subprocess
import urllib.request
import uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parents[5]
HARNESS = ROOT / "server/docker/scripts/admin-job-fixtures/admin-job-fixtures.sh"
ACTOR = "admin-job-fixture:v1:event-counter-expiry:user"
CONTROL = "admin-job-fixture:v1:event-counter-expiry:watch-control"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("phase", choices=["before", "after"])
    args = parser.parse_args()
    state = json.loads(subprocess.check_output(
        ["bash", str(HARNESS), "status", "event-counter-expiry"],
        env={**os.environ, "ADMIN_FIXTURE_MONGO_MODE": "container"}, text=True))
    assert state["prepared"] and state["variation"] == "end-boundary", state
    if args.phase == "after":
        assert state["current"]["validation"]["firstPassComplete"], state
    else:
        assert not state["current"]["event"]["expired"], state
    session = str(uuid.uuid4())

    def post(path, body):
        request = urllib.request.Request("http://localhost/api" + path,
            headers={"X-App-Session-Kind": "demo", "X-Demo-User-Id": ACTOR,
                     "X-App-Session-Id": session, "Content-Type": "application/json"},
            data=json.dumps(body).encode())
        with urllib.request.urlopen(request, timeout=20) as response:
            return json.load(response)

    login = post("/auth/session/login", {"attemptId": str(uuid.uuid4()), "provider": "demo"})
    assert login["accepted"], "Fixture login rejected"
    payload = {"userId": ACTOR, "sourceId": CONTROL}
    watch = post("/activities/events/watch", payload)
    try:
        assert watch["changed"] and watch["watched"], watch
    finally:
        unwatch = post("/activities/events/unwatch", payload)
    assert unwatch["changed"] and not unwatch["watched"], unwatch
    expected = 2 if args.phase == "before" else 1
    counters = unwatch["eventCounters"]
    assert counters["all"] == expected and counters["hosting"] == expected, counters
    assert counters["watchlist"] == 0, counters
    print(json.dumps({"phase": args.phase, "status": "PASS",
                      "watch": watch, "unwatch": unwatch}, indent=2))


if __name__ == "__main__":
    main()
