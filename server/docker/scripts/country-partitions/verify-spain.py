#!/usr/bin/env python3
"""Read-only verification against the already-running region-enabled HTTP stack."""
import json, urllib.request
from pathlib import Path
root=Path(__file__).resolve().parents[4]
seeds=[json.loads((root/f'server/docker/conf/mongodb/{db}/countryPartitions.json').read_text()) for db in ('demo_db','e2e_db','myscoutee_db')]
spain=[next(c for c in rows if c['countryCode']=='ES') for rows in seeds]
assert spain[0]==spain[1]==spain[2]
assert all(sum(c['countryCode']=='ES' for c in rows)==1 for rows in seeds)
for name,latitude,longitude,expected in [
 ('Madrid',40.4168,-3.7038,'country:es'),('Barcelona',41.3874,2.1686,'country:es'),
 ('Seville',37.3891,-5.9845,'country:es'),('Palma',39.5696,2.6502,'country:es'),
 ('Santa Cruz de Tenerife',28.4636,-16.2518,'country:es'),
 ('Lisbon',38.7223,-9.1393,None),('Andorra la Vella',42.5063,1.5218,None),
 ('Marseille',43.2965,5.3698,None),('Berlin',52.52,13.405,'country:de'),
 ('Budapest',47.4979,19.0402,'country:hu'),('London',51.5074,-.1278,'country:gb')]:
    with urllib.request.urlopen(f'http://localhost/api/auth/eligibility?latitude={latitude}&longitude={longitude}',timeout=15) as r:data=json.load(r)
    assert data['securityGateEnabled'], 'Use the existing region-enabled stack; do not alter runtime gates for this check'
    assert data['partitionKey']==expected and data['eligible']==bool(expected),(name,data)
    print(name+': PASS')
with urllib.request.urlopen('http://localhost/api/landing/content?latitude=40.4168&longitude=-3.7038',timeout=15) as r:data=json.load(r)
assert [c['countryCode'] for c in data['supportedCountries']].count('ES')==1
request=urllib.request.Request('http://localhost/api/i18n/bundle',headers={'Accept-Language':'es-ES,es;q=0.9'})
with urllib.request.urlopen(request,timeout=15) as r:data=json.load(r)
assert data['lang']=='en'
print('Canonical seeds, landing country list and Spanish-language English fallback: PASS')
