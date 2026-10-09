#!/usr/bin/env python3
"""Exercise packaged push-only readiness over HTTP, including receiver restart."""
import json
import os
import subprocess
import time
import unittest

IMAGE = os.environ.get('NGINX_TEST_BASE_IMAGE', 'myscoutee-frontend-runtime-base:msc121')
TOKEN_A, TOKEN_B = 'a' * 32, 'b' * 32

class RuntimeStatusTest(unittest.TestCase):
    def test_compose_credential_is_readable_by_backend_user_and_survives_restart(self):
        name = f'myscoutee-status-volume-test-{os.getpid()}'
        volume = name + '-credentials'
        def run(*args):
            return subprocess.run(args, check=True, capture_output=True, text=True, timeout=15).stdout
        try:
            run('docker', 'volume', 'create', volume)
            run('docker', 'run', '-d', '--name', name, '--network', 'none', '--memory', '64m',
                '--read-only', '-v', volume + ':/run/myscoutee-runtime-status',
                '-e', 'MYSCOUTEE_RUNTIME_STATUS_TOKEN_FILE=/run/myscoutee-runtime-status/token',
                '--entrypoint', '/scripts/runtime-status-receiver', IMAGE)
            for _ in range(30):
                try:
                    token = run('docker', 'exec', '--user', '10001:10001', name,
                                'cat', '/run/myscoutee-runtime-status/token')
                    if len(token) == 64: break
                except subprocess.CalledProcessError: pass
                time.sleep(.1)
            else: self.fail('backend user cannot read the generated credential')
            # Keep credential contents out of test output and host-side command arguments.
            run('docker', 'exec', '--user', '10001:10001', name, 'sh', '-c',
                'wget -qO- --header="Authorization: Bearer $(cat /run/myscoutee-runtime-status/token)" '
                '--header="X-MyScoutee-Service: profilemanagement" '
                '--post-data=\'{"instance":"backend","ready":true}\' '
                'http://127.0.0.1:9081/internal/runtime-status')
            run('docker', 'restart', name)
            self.assertEqual(token, run('docker', 'exec', '--user', '10001:10001', name,
                                       'cat', '/run/myscoutee-runtime-status/token'))
        finally:
            subprocess.run(['docker', 'rm', '-f', name], capture_output=True)
            subprocess.run(['docker', 'volume', 'rm', volume], capture_output=True)

    def test_push_auth_all_services_expiry_and_restart(self):
        name = f'myscoutee-status-test-{os.getpid()}'
        def run(*args):
            return subprocess.run(args, check=True, capture_output=True, text=True, timeout=15).stdout
        def status():
            return json.loads(run('docker','exec',name,'wget','-qO-','http://127.0.0.1:9080/api/runtime-status'))
        def push(service, token, ready=True):
            return subprocess.run(['docker','exec',name,'wget','-qO-',
                '--header=Authorization: Bearer '+token, '--header=X-MyScoutee-Service: '+service,
                '--header=Content-Type: application/json',
                '--post-data='+json.dumps({'instance':'test-one','ready':ready}),
                'http://127.0.0.1:9081/internal/runtime-status'],capture_output=True,text=True,timeout=5)
        try:
            run('docker','run','-d','--name',name,'--network','none','--memory','64m',
                '--read-only','--user','101:101','-e','MYSCOUTEE_RUNTIME_STATUS_TOKENS_JSON='+json.dumps({'a':TOKEN_A,'b':TOKEN_B}),
                '--entrypoint','/scripts/runtime-status-receiver',IMAGE)
            for _ in range(30):
                try: initial=status();break
                except subprocess.CalledProcessError: time.sleep(.1)
            else: self.fail('receiver did not start')
            self.assertFalse(initial['ready'])
            self.assertEqual(set(initial),{'ready','known','checkedAt'})
            self.assertNotEqual(push('a',TOKEN_B).returncode,0)
            self.assertEqual(push('a',TOKEN_A).returncode,0)
            self.assertFalse(status()['ready'])
            self.assertEqual(push('b',TOKEN_B).returncode,0)
            self.assertTrue(status()['ready'])
            self.assertEqual(push('b',TOKEN_B,False).returncode,0)
            self.assertFalse(status()['ready'])
            push('b',TOKEN_B)
            time.sleep(20.2)
            self.assertFalse(status()['ready'])
            push('a',TOKEN_A);push('b',TOKEN_B);self.assertTrue(status()['ready'])
            run('docker','restart',name)
            time.sleep(.2)
            self.assertFalse(status()['ready'])
        finally:
            subprocess.run(['docker','rm','-f',name],capture_output=True)

if __name__ == '__main__': unittest.main()
