#!/usr/bin/env python3
"""Read-only dev paging/sync oracle. Reuses an existing demo session; no login/reset."""
import json
import subprocess
import sys
import urllib.parse
import urllib.request

actor = sys.argv[1] if len(sys.argv) > 1 else '1b1c70be2349b3359a8f6f94'
code = ('const s=db.userSessionStates.findOne({_id:' + json.dumps(actor)
        + '});print(JSON.stringify(s?.activeSessions?.[0]?.sessionId??null));')
session = json.loads(subprocess.check_output([
    'docker', 'exec', 'mongodb', 'sh', '-c',
    'exec mongosh --quiet --username "$MONGO_APP_USERNAME" --password "$MONGO_APP_PASSWORD" '
    '--authenticationDatabase demo_db demo_db --eval "$1"', 'main-groups-read', code
], text=True))
assert session, 'Requires an already active demo session; this check does not create one.'


def call(path, body=None):
    request = urllib.request.Request('http://localhost/api' + path,
        headers={'X-App-Session-Kind': 'demo', 'X-Demo-User-Id': actor,
                 'X-App-Session-Id': session, 'Content-Type': 'application/json'},
        data=None if body is None else json.dumps(body).encode())
    with urllib.request.urlopen(request, timeout=20) as response:
        return json.load(response)


main_ids = {'myscoutee-work', 'myscoutee-community'}
checks = []
for sort in ['distance', 'updated']:
    def page(size, cursor=None, category=None):
        query = dict(userId=actor, bucket='participation', pageSize=size, sort=sort)
        if cursor is not None:
            query['cursor'] = cursor
        if category is not None:
            query['category'] = category
        return call('/groups?' + urllib.parse.urlencode(query))

    baseline = page(50)
    assert baseline['nextCursor'] is None, 'Select a demo actor with at most 50 groups.'
    expected = [row['id'] for row in baseline['items']]
    assert set(expected[:2]) == main_ids and len(expected) > 2, 'Fixture needs both main and private groups.'
    ordinary = baseline['items'][2:]
    keys = [(row['distanceKm'] if row['distanceKm'] is not None else float('inf'))
            if sort == 'distance' else row['updatedAtIso'] for row in ordinary]
    assert keys == sorted(keys, reverse=sort == 'updated'), 'Ordinary sort remains intact.'
    for size in [1, 2, 3]:
        seen, cursor = [], None
        for _ in range(baseline['total'] + 1):
            result = page(size, cursor)
            assert result['total'] == baseline['total']
            assert result['context'] == baseline['context']
            seen.extend(row['id'] for row in result['items'])
            cursor = result['nextCursor']
            if cursor is None:
                break
        else:
            raise AssertionError('Pagination did not terminate.')
        assert seen == expected and len(set(seen)) == len(seen), 'No repeated main groups or missing private groups.'
    first = page(2)['items']
    sync = dict(userId=actor, bucket='participation', category=None, sort=sort, limit=2,
                knownItems=[dict(id=row['id'], revision=row['revision']) for row in first], tailId=first[-1]['id'])
    unchanged = call('/groups/sync', sync)
    assert unchanged == dict(upserts=[], removedIds=[], total=baseline['total'])
    initial = call('/groups/sync', dict(sync, knownItems=[], tailId=None))
    assert [row['id'] for row in initial['upserts']] == expected[:2], 'Initial sync uses the same global order.'
    filtered = page(50, category='work')
    assert filtered['items'][0]['id'] == 'myscoutee-work'
    assert all(row['category'] == 'work' for row in filtered['items'])
    checks.append(dict(sort=sort, total=baseline['total'], pageSizes=[1, 2, 3],
                       unique=True, mainGroupsOnce=True, syncStable=True, categoryFilter=True))
print(json.dumps(dict(status='PASS', checks=checks, mutations=0), indent=2))
