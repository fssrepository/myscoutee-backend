#!/usr/bin/env python3
"""Run the packaged gateway probe against deterministic health responses."""
import json
import subprocess
import unittest


class RuntimeStatusTest(unittest.TestCase):
    def probe(self, body, expected, failing=False):
        script = '''set -eu
mkdir -p /tmp/probe-bin
cat > /tmp/probe-bin/wget <<'SH'
#!/bin/sh
while [ "$#" -gt 0 ]; do
 if [ "$1" = -O ]; then shift; output=$1; fi
 shift
done
printf '%s' "$HEALTH_BODY" > "$output"
[ "$HEALTH_FAIL" = false ]
SH
chmod +x /tmp/probe-bin/wget
PATH=/tmp/probe-bin:$PATH /scripts/runtime-status.sh --once
cat /tmp/myscoutee-status/status.json
'''
        result = subprocess.run(['docker', 'run', '--rm', '--network', 'none',
            '--memory', '64m', '--entrypoint', 'sh', '-i',
            '-e', 'HEALTH_BODY=' + body, '-e', 'HEALTH_FAIL=' + str(failing).lower(),
            'myscoutee-service-frontend:msc121'], input=script, text=True,
            capture_output=True, check=True, timeout=30)
        self.assertIs(json.loads(result.stdout)['ready'], expected)

    def test_simple_up(self): self.probe('{"status":"UP"}', True)
    def test_groups_before_status(self): self.probe('{"groups":["liveness","readiness"],"status":"UP"}', True)
    def test_nested_up_does_not_override_down(self): self.probe('{"components":{"db":{"status":"UP"}},"status":"DOWN"}', False)
    def test_invalid_json_is_not_ready(self): self.probe('{"status":"UP",broken}', False)
    def test_http_failure_is_not_ready(self): self.probe('{"status":"UP"}', False, True)


if __name__ == '__main__': unittest.main()
