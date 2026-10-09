#!/usr/bin/env python3
"""Read-only compact Kubernetes/containerd snapshot, sent over existing SSH."""
import json
from pathlib import Path
import subprocess


def query(*args):
    result = subprocess.run(['sudo', 'k3s', *args], check=True, capture_output=True, text=True, timeout=10)
    return json.loads(result.stdout)


memory = dict(line.split(':', 1) for line in Path('/proc/meminfo').read_text().splitlines())
print('GUEST RAM    %.0f MiB available / %.0f MiB total' %
      (int(memory['MemAvailable'].split()[0]) / 1024, int(memory['MemTotal'].split()[0]) / 1024))
items = query('kubectl', '--request-timeout=5s', 'get', 'nodes,deployments,pods', '-A', '-o', 'json')['items']
for node in (i for i in items if i['kind'] == 'Node'):
    ready = next((c['status'] for c in node['status']['conditions'] if c['type'] == 'Ready'), 'Unknown')
    print('KUBERNETES   %s | Ready=%s | %s' % (node['metadata']['name'], ready, node['status']['nodeInfo']['kubeletVersion']))
stats = query('crictl', 'stats', '-o', 'json')['stats']
stats = {entry['attributes']['id']: entry for entry in stats}
pods = [i for i in items if i['kind'] == 'Pod']
print('\n%-12s  %-24s  %-6s  %-22s  %6s  %8s' % ('NAMESPACE', 'DEPLOYMENT', 'READY', 'POD STATE', 'CPU %', 'RAM MiB'))
previous_namespace = None
for deploy in sorted((i for i in items if i['kind'] == 'Deployment'), key=lambda i: (i['metadata']['namespace'], i['metadata']['name'])):
    namespace = deploy['metadata']['namespace']
    if previous_namespace and namespace != previous_namespace:
        print()
    previous_namespace = namespace
    selector = deploy['spec']['selector']['matchLabels']
    owned = [p for p in pods if p['metadata']['namespace'] == namespace and
             all(p['metadata'].get('labels', {}).get(k) == v for k, v in selector.items())]
    states = set()
    cpu = used = 0
    samples = 0
    for pod in owned:
        statuses = pod.get('status', {}).get('containerStatuses', [])
        states.add(next((s['state']['waiting']['reason'] for s in statuses if 'waiting' in s.get('state', {})),
                        pod.get('status', {}).get('phase', 'Unknown')))
        for status in statuses:
            entry = stats.get(status.get('containerID', '').removeprefix('containerd://'))
            if entry:
                samples += 1
                cpu += int(entry.get('cpu', {}).get('usageNanoCores', {}).get('value', 0)) / 10 ** 7
                used += int(entry.get('memory', {}).get('workingSetBytes', {}).get('value', 0)) / 1024 ** 2
    ready = str(deploy.get('status', {}).get('readyReplicas', 0)) + '/' + str(deploy['spec'].get('replicas', 1))
    print('%-12s  %-24s  %-6s  %-22s  %6s  %8s' % (
        namespace.removeprefix('myscoutee-'), deploy['metadata']['name'], ready,
        ','.join(sorted(states)) or 'no pods', '%.1f' % cpu if samples else '-', '%.1f' % used if samples else '-'))
