#!/usr/bin/env python3
"""Exercise the actual nginx health sampler with disposable loopback backends."""
import http.server
import json
import os
from pathlib import Path
import subprocess
import tempfile
import threading
import time
import unittest

ROOT = Path(__file__).resolve().parents[2]
IMAGE = os.environ.get('NGINX_TEST_BASE_IMAGE', 'myscoutee-nginx:1.3.0-base')


class Health(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/slow':
            time.sleep(2)
        body = {'status': 'UP'}
        if self.path == '/down':
            body = {'status': 'DOWN', 'components': {'one': {'status': 'UP'}}}
        if self.path == '/details':
            body['components'] = {'private': {'status': 'UP', 'details': {'secret': 'not-public'}}}
        self.send_response(503 if self.path == '/error' else 200)
        self.end_headers()
        try:
            self.wfile.write(json.dumps(body).encode())
        except BrokenPipeError:
            pass

    def log_message(self, *_):
        pass


class RuntimeStatusTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), Health)
        threading.Thread(target=cls.server.serve_forever, daemon=True).start()

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()

    def sample(self, paths):
        with tempfile.TemporaryDirectory(prefix='myscoutee-status-test-') as directory:
            Path(directory).chmod(0o777)
            name = f'myscoutee-status-test-{os.getpid()}'
            command = ['docker', 'run', '--rm', '--name', name, '--network', 'host',
                       '--memory=32m', '--user=101:101', '--read-only',
                       '-v', f'{directory}:/tmp/myscoutee-status',
                       '-v', f'{ROOT}/server/docker/images/nginx/runtime-status.sh:/runtime-status.sh:ro',
                       '-e', 'MYSCOUTEE_HEALTH_URLS=' + ' '.join(
                           f'http://127.0.0.1:{self.server.server_port}{path}' for path in paths),
                       '--entrypoint', 'sh', IMAGE, '/runtime-status.sh', '--once']
            start = time.monotonic()
            try:
                subprocess.run(command, check=True, capture_output=True, text=True, timeout=8)
            finally:
                subprocess.run(['docker', 'rm', '-f', name], capture_output=True)
            status = json.loads((Path(directory) / 'status.json').read_text())
            self.assertEqual(set(status), {'ready', 'checkedAt'})
            self.assertLess(abs(time.time() - status['checkedAt']), 5)
            return status['ready'], time.monotonic() - start

    def test_monolith_ready_without_disclosing_details(self):
        self.assertTrue(self.sample(['/details'])[0])

    def test_six_services_require_all_groups_ready(self):
        self.assertTrue(self.sample(['/up'] * 6)[0])
        self.assertFalse(self.sample(['/up'] * 5 + ['/down'])[0])

    def test_http_failure_is_unavailable(self):
        self.assertFalse(self.sample(['/error'])[0])

    def test_six_slow_services_are_sampled_in_parallel_with_bounded_timeout(self):
        ready, elapsed = self.sample(['/slow'] * 6)
        self.assertFalse(ready)
        self.assertLess(elapsed, 4)


if __name__ == '__main__':
    unittest.main()
