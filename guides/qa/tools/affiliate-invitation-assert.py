#!/usr/bin/env python3
"""Assert saved CDP badges and independent Mongo observations; no mutations."""
import json, os
from pathlib import Path
root=Path(os.environ.get('AFFILIATE_QA_RUNTIME','/tmp/affiliate-invitation-001'))
expected={
 'baseline':['0','0 / 0'], 'after-registration':['1','0 / 0'],
 'after-import':['1','0 / 2'], 'after-repeat':['1','0 / 2'],
 'after-claim':['1','1 / 2'], 'after-claim-repeat':['1','1 / 2'],
 'after-reload':['1','1 / 2'], 'after-revoke':['1','1 / 2']}
for name, badges in expected.items():
    data=json.loads((root/(name+'.json')).read_text())
    assert data['badges'][:2]==badges,(name,data['badges'])
    assert not data.get('otherAffiliateRequests'),name
    print(name+': PASS '+', '.join(badges))
assert json.loads((root/'after-reload.json').read_text())['settingsRequests']==1
state=json.loads((root/'persisted-final.json').read_text())
assert state['referrals']==1 and state['tokens']==0
assert len(state['imports'])==2 and len(state['mappings'])==1
claimed=[item['claimedUserId'] for item in state['imports'] if item.get('claimedUserId')]
assert len(claimed)==1 and state['mappings'][0]['internalId']==claimed[0]
print('Persisted attribution, participant mapping and key-independent counts: PASS')
