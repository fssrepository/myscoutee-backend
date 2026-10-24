#!/usr/bin/env python3
"""Check supporting prod images, ingress and native data initialization.

The optional restart flag replaces only registry/simulator pods to check PVC state.
"""

import os as _context_os
import sys as _context_sys
from pathlib import Path as _ContextPath
_context_root = _ContextPath(__file__).resolve().parents[3]
_context_os.environ.setdefault('MYSCOUTEE_BACKEND_SOURCE', str(_context_root))
_context_sys.path.insert(0, str(_ContextPath(_context_os.environ.get('MYSCOUTEE_MICROSERVICES_SOURCE', _context_root.parent / 'myscoutee-microservices')) / 'tools'))
import argparse
import fcntl
import json
import os
from pathlib import Path
import socket
import subprocess
import time
import urllib.error
import urllib.request

import workloads as w
from runtime_probes import transport_scopes, stun_probe, check_stun_image

SUPPORT_CONFIG = json.loads((w.SHELL / 'checks/support.json').read_text())


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--data', action='store_true', help='Verify native registry seed and simulator configuration')
    parser.add_argument('--transport-scopes', action='store_true', help='Verify deployed service capabilities and actor-signing key scope without printing secrets')
    parser.add_argument('--restart-data-services', action='store_true', help='Also verify registry/simulator PVC state after pod replacement')
    parser.add_argument('--stun-image', help='Check an already-built STUN image in a disposable local container, without starting the VM')
    args = parser.parse_args()
    if args.stun_image:
        check_stun_image(args.stun_image)
        return
    with (w.vm.VM / 'lock').open('a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        if not w.namespace_owned():
            raise RuntimeError('Owned workload namespace is absent.')
        if args.transport_scopes:
            transport_scopes()
        for name, command in [('mcp', ['/myscoutee-mcp', 'healthcheck']),
                              ('registry', ['/registry', 'healthcheck']),
                              ('payment-simulator', ['/payment-simulator', 'healthcheck']),
                              ('stun', ['turnutils_stunclient', '-p', '3478', '127.0.0.1'])]:
            obj = w.kube_json('-n', w.NAMESPACE, 'get', 'deployment', name)
            if any(obj['metadata'].get('labels', {}).get(key) != value for key, value in w.LABEL.items()):
                raise RuntimeError('Refusing unowned deployment: ' + name)
            w.kube('-n', w.NAMESPACE, 'rollout', 'status', 'deployment/' + name, '--timeout=45s', timeout=55)
            w.kube('-n', w.NAMESPACE, 'exec', 'deployment/' + name, '--', *command)
            print('PASS: ' + name + ' canonical image healthcheck', flush=True)
        stun_probe(socket.SOCK_DGRAM)
        stun_probe(socket.SOCK_STREAM)
        origin = 'http://127.0.0.1:' + str(w.CONFIG['localPort'])
        # No OAuth token and no database fixture mutations. This must reach MCP's
        # private endpoint and retain its challenge, not fall through to the SPA.
        try:
            with urllib.request.urlopen(origin + '/mcp/private', timeout=5) as response:
                status, headers = response.status, response.headers
        except urllib.error.HTTPError as error:
            status, headers = error.code, error.headers
        if status != 401 or 'resource_metadata=' not in headers.get('WWW-Authenticate', ''):
            raise RuntimeError('MCP private ingress lost its authentication challenge.')
        print('PASS: localhost MCP private route preserves 401 / OAuth challenge')
        with urllib.request.urlopen(origin + '/simulator-ui/stripe.svg', timeout=5) as response:
            if response.status != 200 or 'image/svg+xml' not in response.headers.get('Content-Type', ''):
                raise RuntimeError('Simulator browser assets did not reach the canonical provider.')
        print('PASS: simulator browser asset served through localhost ingress')
        for path in ['/_internal/v1/events/members/all', '/api/_internal/v1/events/members/all', '/health']:
            try:
                with urllib.request.urlopen(origin + path, timeout=5) as response:
                    status = response.status
            except urllib.error.HTTPError as error:
                status = error.code
            if status != 404:
                raise RuntimeError('Internal/management path exposed at public ingress: ' + path)
        print('PASS: internal reads and management paths remain private')
        result = w.vm.run('docker', 'exec', SUPPORT_CONFIG['prometheusContainer'],
                          'wget', '-T', '4', '-S', '-O', '/dev/null',
                          'http://' + w.vm.IP + ':' + str(w.CONFIG['metricsNodePort']) + '/forbidden', check=False)  # NOSONAR - python:S5332: lab-bridge metrics denial probe; no credentials or business data.
        if result.returncode != 1 or 'HTTP/1.1 404' not in result.stderr:
            raise RuntimeError('Prometheus cannot reach the restricted guest metrics gateway.')
        print('PASS: Prometheus reaches guest metrics listener; non-metric paths denied')
        if args.data or args.restart_data_services:
            def registry_seed():
                output = w.kube('-n', w.NAMESPACE, 'logs', 'deployment/registry').stdout
                records = []
                for line in output.splitlines():
                    try:
                        record = json.loads(line)
                    except ValueError:
                        continue
                    if record.get('msg') == 'isolated demo registry is ready':
                        records.append(record)
                if not records or records[-1].get('registry_scope') != SUPPORT_CONFIG['registryScope'] or not records[-1].get('seed_version'):
                    raise RuntimeError('Registry canonical DEMO seed did not report successful startup.')
                return records[-1]

            def simulator_configuration():
                # Keep the private control API private. The existing pod-local
                # wget uses a credential supplied over stdin, never a host argv.
                script = 'IFS= read -r token; wget -qO- --header "Authorization: Bearer $token" http://payment-simulator:18082/myscoutee/v1/configuration'
                token = w.secrets_data()['paymentSimulatorApiKey']
                result = w.kube('-n', w.NAMESPACE, 'exec', '-i', 'deployment/frontend', '--',
                                '/bin/sh', '-c', script, data=token + '\n')
                configuration = json.loads(result.stdout)
                if configuration.get('provider') not in ('none', 'stripe', 'barion'):
                    raise RuntimeError('Simulator native configuration was not loaded.')
                if configuration['provider'] != 'none' and not configuration.get('connected'):
                    raise RuntimeError('Simulator provider initialization is incomplete.')
                return configuration

            def registry_identity():
                result = w.kube('-n', w.NAMESPACE, 'exec', 'deployment/frontend', '--',
                                'wget', '-qO-', 'http://registry:8080/v1/registry/identity')
                identity = json.loads(result.stdout)
                if identity.get('registry_scope') != SUPPORT_CONFIG['registryScope'] or not identity.get('registry_public_key'):
                    raise RuntimeError('Registry public identity is unavailable.')
                return identity

            registry_before = registry_seed()
            identity_before = registry_identity()
            simulator_before = simulator_configuration()
            print('PASS: registry canonical seed ' + registry_before['seed_version'])
            print('PASS: simulator native provider configuration: ' + simulator_before['provider'])
            if args.restart_data_services:
                for name in ('registry', 'payment-simulator'):
                    w.kube('-n', w.NAMESPACE, 'rollout', 'restart', 'deployment/' + name)
                    w.kube('-n', w.NAMESPACE, 'rollout', 'status', 'deployment/' + name, '--timeout=90s', timeout=100)
                registry_after = registry_seed()
                if not registry_after.get('already_seeded') or registry_after['seed_version'] != registry_before['seed_version']:
                    raise RuntimeError('Registry failed to retain its seeded state.')
                if registry_identity() != identity_before:
                    raise RuntimeError('Registry signing identity changed during pod replacement.')
                if simulator_configuration() != simulator_before:
                    raise RuntimeError('Simulator configuration/credential did not survive pod replacement.')
                print('PASS: registry retains seeded state and signing identity; simulator retains provider configuration and credential after pod replacement')


if __name__ == '__main__':
    try:
        main()
    except subprocess.CalledProcessError:
        raise SystemExit('Support check failed; inspect owned workload status/logs.') from None
