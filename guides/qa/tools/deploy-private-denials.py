#!/usr/bin/env python3
"""Reuse a real checkpoint session for direct requests from the workstation.

The existing deployment harness owns preparation and independent DB/cleanup
oracles. This helper does not log credentials or prepare successful results.
"""
import json
import ssl
import sys
import urllib.error
import urllib.request
from pathlib import Path

session_path, actor, recipient, output = sys.argv[1:5]
only = set(sys.argv[5].split(',')) if len(sys.argv) > 5 else None
session = json.loads(Path(session_path).read_text())
event = 'qa-deploy-private-invitation-v1'
origin = 'https://localhost:8443'
headers = {'Authorization': 'Bearer ' + session['token'],
           'X-App-Session-Id': session['sessionId'], 'Content-Type': 'application/json'}
requests = [
    ('detail', 'GET', f'/activities/events/detail?userId={actor}&eventId={event}', None),
    ('members', 'GET', f'/activities/events/members?ownerType=event&ownerId={event}', None),
    ('chat', 'GET', f'/activities/chats/by-id/{event}?userId={actor}', None),
    ('messages', 'GET', f'/activities/chats/{event}/messages?userId={actor}&limit=10', None),
    ('chat-members', 'GET', f'/activities/chats/{event}/members/page?userId={actor}&limit=10', None),
    ('unpublish', 'POST', '/activities/events/unpublish', {'userId': actor, 'sourceId': event}),
    ('remove-member', 'POST', '/activities/events/members/action', {
        'owner': {'ownerType': 'event', 'ownerId': event}, 'actorUserId': actor,
        'targetUserId': recipient, 'action': 'remove'}),
    ('send-message', 'POST', f'/activities/chats/{event}/messages?userId={actor}',
        {'text': 'QA_DEPLOY_DENIED_MESSAGE'})]
results = []
for name, method, route, body in requests:
    if only and name not in only:
        continue
    req = urllib.request.Request(origin + '/api' + route, method=method, headers=headers,
                                 data=json.dumps(body).encode() if body else None)
    try:
        response = urllib.request.urlopen(req, context=ssl._create_unverified_context(), timeout=20)
    except urllib.error.HTTPError as error:
        response = error
    with response:
        raw = response.read().decode()
        data = json.loads(raw) if raw else None
        result = {'name': name, 'status': response.status,
                  'privateMarkerExposed': 'QA_DEPLOY_PRIVATE_CONTENT' in raw}
        # Keep successful bodies in local evidence for review of empty projections.
        if response.status < 300:
            result['body'] = data
        else:
            result['error'] = data.get('error') if isinstance(data, dict) else None
        results.append(result)
        print(json.dumps(result))
Path(output).write_text(json.dumps(results, indent=2))
assert results and all(row['status'] in (403, 404) and not row['privateMarkerExposed']
                       for row in results), 'A private request was not denied as expected'
