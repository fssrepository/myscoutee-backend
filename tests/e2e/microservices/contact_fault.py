"""Owned, temporary L7 fault for the existing contact recovery check.

Pass reads through to the recorded communication pod; reject only permission
saves. No product hook, credentials, payload logging or application data edits.
The durable receipt restores the Service even after an interrupted check.
"""

import os as _context_os
import sys as _context_sys
from pathlib import Path as _ContextPath
_context_root = _ContextPath(__file__).resolve().parents[3]
_context_os.environ.setdefault('MYSCOUTEE_BACKEND_SOURCE', str(_context_root))
_context_sys.path.insert(0, str(_ContextPath(_context_os.environ.get('MYSCOUTEE_MICROSERVICES_SOURCE', _context_root.parent / 'myscoutee-microservices')) / 'tools'))
import json
import re
import workloads as w


def receipt_path(run_id):
    if not re.fullmatch('[a-f0-9]{32}', run_id):
        raise ValueError('Invalid fault run ID')
    return w.vm.VM / ('contact-fault-' + run_id + '.json')


def install(run_id, namespace_uid):
    path = receipt_path(run_id)
    if path.exists():
        raise RuntimeError('Restore the existing fault receipt before starting another')
    service = w.kube_json('-n', w.NAMESPACE, 'get', 'service/communication')
    original = {'app.kubernetes.io/name': 'communication'}
    if service['spec']['selector'] != original:
        raise RuntimeError('Communication selector is not the normal deployment')
    pods = w.kube_json('-n', w.NAMESPACE, 'get', 'pods', '-l', 'app.kubernetes.io/name=communication')['items']
    pods = [p for p in pods if not p['metadata'].get('deletionTimestamp')]
    if len(pods) != 1 or not any(c['type'] == 'Ready' and c['status'] == 'True' for c in pods[0]['status']['conditions']):
        raise RuntimeError('Expected one Ready communication pod')
    upstream = pods[0]['status']['podIP']
    name = 'contact-fault-' + run_id[:12]
    selector = {'myscoutee-contact-fault': run_id}
    metadata = {'name': name, 'namespace': w.NAMESPACE, 'labels': {**w.LABEL, **selector}}
    saved = {'namespaceUid': namespace_uid, 'serviceUid': service['metadata']['uid'],
             'original': original, 'selector': selector, 'name': name}
    path.write_text(json.dumps(saved))
    config = '''pid /tmp/nginx.pid;
error_log /dev/stderr warn;
events { worker_connections 128; }
http {
 access_log off;
 client_body_temp_path /tmp/client;
 proxy_temp_path /tmp/proxy;
 fastcgi_temp_path /tmp/fastcgi;
 uwsgi_temp_path /tmp/uwsgi;
 scgi_temp_path /tmp/scgi;
 server {
  listen 8080;
  location = /ready { return 200; }
  location = /_internal/v1/chat/contact-permissions/save {
   default_type application/json;
   return 503 '{"code":"QUALIFICATION_FAULT"}';
  }
  location / { proxy_pass http://%s:8080; }
 }
 server { listen 8081; location / { proxy_pass http://%s:8081; } }
}
''' % (upstream, upstream)
    objects = [{'apiVersion': 'v1', 'kind': 'ConfigMap', 'metadata': metadata, 'data': {'nginx.conf': config}},
      {'apiVersion': 'v1', 'kind': 'Pod', 'metadata': metadata, 'spec': {
        'automountServiceAccountToken': False, 'restartPolicy': 'Never',
        'securityContext': {'runAsUser': 101, 'runAsGroup': 101, 'runAsNonRoot': True},
        'containers': [{'name': 'fault', 'image': w.image_lock()['frontend']['reference'],
          'imagePullPolicy': 'IfNotPresent', 'command': ['nginx', '-c', '/config/nginx.conf', '-g', 'daemon off;'],
          'resources': {'requests': {'cpu': '10m', 'memory': '8Mi'}, 'limits': {'cpu': '200m', 'memory': '32Mi'}},
          'securityContext': {'readOnlyRootFilesystem': True, 'allowPrivilegeEscalation': False, 'capabilities': {'drop': ['ALL']}},
          'readinessProbe': {'httpGet': {'path': '/ready', 'port': 8080}, 'periodSeconds': 1},
          'volumeMounts': [{'name': 'config', 'mountPath': '/config', 'readOnly': True}, {'name': 'tmp', 'mountPath': '/tmp'}]}],  # NOSONAR - python:S5443: /tmp is this disposable pod's private emptyDir, not shared host storage.
        'volumes': [{'name': 'config', 'configMap': {'name': name}}, {'name': 'tmp', 'emptyDir': {}}]}}]
    w.kube('create', '-f', '-', data=json.dumps({'apiVersion': 'v1', 'kind': 'List', 'items': objects}))
    try:
        w.kube('-n', w.NAMESPACE, 'wait', 'pod/' + name, '--for=condition=Ready', '--timeout=60s')
    except Exception:
        print(w.kube('-n', w.NAMESPACE, 'logs', name, check=False).stdout, flush=True)
        raise
    patch = [{'op': 'test', 'path': '/spec/selector', 'value': original},
             {'op': 'replace', 'path': '/spec/selector', 'value': selector}]
    w.kube('-n', w.NAMESPACE, 'patch', 'service/communication', '--type=json', '-p', json.dumps(patch))


def restore(run_id, namespace_uid):
    path = receipt_path(run_id)
    if not path.exists():
        return
    saved = json.loads(path.read_text())
    service = w.kube_json('-n', w.NAMESPACE, 'get', 'service/communication')
    if saved['namespaceUid'] != namespace_uid or service['metadata']['uid'] != saved['serviceUid']:
        raise RuntimeError('Fault receipt ownership changed; refusing restoration')
    current = service['spec']['selector']
    if current == saved['selector']:
        patch = [{'op': 'test', 'path': '/spec/selector', 'value': current},
                 {'op': 'replace', 'path': '/spec/selector', 'value': saved['original']}]
        w.kube('-n', w.NAMESPACE, 'patch', 'service/communication', '--type=json', '-p', json.dumps(patch))
    elif current != saved['original']:
        raise RuntimeError('Service selector changed outside this check')
    for kind in ('pod', 'configmap'):
        result = w.kube('-n', w.NAMESPACE, 'get', kind + '/' + saved['name'], '--ignore-not-found', '-o', 'json')
        if result.stdout.strip():
            obj = json.loads(result.stdout)
            if obj['metadata'].get('labels', {}).get('myscoutee-contact-fault') != run_id:
                raise RuntimeError('Fault object ownership changed')
            w.kube('-n', w.NAMESPACE, 'delete', kind + '/' + saved['name'], '--wait=true', '--timeout=30s')
    path.unlink()
