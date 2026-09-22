#!/usr/bin/env python3
"""Read-only verification against the already-running region-enabled HTTP stack."""
import json, urllib.request
from pathlib import Path
root=Path(__file__).resolve().parents[4]
seeds=[json.loads((root/f'server/docker/conf/mongodb/{db}/countryPartitions.json').read_text()) for db in ('demo_db','e2e_db','myscoutee_db')]
germany=[next(c for c in rows if c['countryCode']=='DE') for rows in seeds]
assert germany[0]==germany[1]==germany[2]
assert all(sum(c['countryCode']=='DE' for c in rows)==1 for rows in seeds)
for name,latitude,longitude,expected in [
 ('Berlin',52.52,13.405,'country:de'),('Munich',48.137,11.575,'country:de'),
 ('Hamburg',53.5511,9.9937,'country:de'),('Cologne',50.9375,6.9603,'country:de'),
 ('Prague',50.0755,14.4378,None),('Zurich',47.3769,8.5417,None),
 ('Budapest',47.4979,19.0402,'country:hu'),('London',51.5074,-.1278,'country:gb')]:
    with urllib.request.urlopen(f'http://localhost/api/auth/eligibility?latitude={latitude}&longitude={longitude}',timeout=15) as r:data=json.load(r)
    assert data['securityGateEnabled'], 'Use the existing region-enabled stack; do not alter runtime gates for this check'
    assert data['partitionKey']==expected and data['eligible']==bool(expected),(name,data)
    print(name+': PASS')
with urllib.request.urlopen('http://localhost/api/landing/content?latitude=52.52&longitude=13.405',timeout=15) as r:data=json.load(r)
assert [c['countryCode'] for c in data['supportedCountries']].count('DE')==1
request=urllib.request.Request('http://localhost/api/i18n/bundle',headers={'Accept-Language':'de-DE,de;q=0.9'})
with urllib.request.urlopen(request,timeout=15) as r:data=json.load(r)
assert data['lang']=='en'
print('Canonical seeds, landing country list and German-language English fallback: PASS')
