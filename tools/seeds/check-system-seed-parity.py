#!/usr/bin/env python3
"""Check environment-independent catalogs; never copy synthetic runtime data."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SEEDS = ROOT / 'server/docker/conf/mongodb'
# Mutable defaults and scenario timings have deliberately different contracts.
SHARED = (
    'accessPolicyDefinitions', 'communityProviders', 'paymentProviders',
    'countryPartitions', 'helpCenterRevisions', 'ideaPosts', 'emailTemplates',
    'emailCampaignRules', 'notificationTemplates', 'i18n_messages', 'i18n_bundles',
)

def check():
    errors = []
    for name in SHARED:
        reference = None
        for mode in ('demo_db', 'myscoutee_db', 'e2e_db'):
            path = SEEDS / mode / (name + '.json')
            if not path.is_file():
                errors.append(f'{mode}/{name}: missing catalog')
                continue
            rows = json.loads(path.read_text())
            keyed = {json.dumps(row['_id'], sort_keys=True): row for row in rows}
            if len(keyed) != len(rows):
                errors.append(f'{mode}/{name}: duplicate identity')
            if reference is None:
                reference = keyed
            elif keyed != reference:
                errors.append(f'{mode}/{name}: differs from shared demo catalog')
    # Production may not acquire demo identities or business records.
    for name in ('users', 'adminUsers', 'assets', 'events', 'chats', 'chatMessages',
                 'activityMembers', 'activityResources', 'operatorRegistryEndpoints'):
        if json.loads((SEEDS / 'myscoutee_db' / (name + '.json')).read_text()):
            errors.append(f'myscoutee_db/{name}: must remain empty')
    if errors:
        raise SystemExit('\n'.join(errors))
    print(f'PASS: {len(SHARED)} shared catalogs match across dev, production and e2e; production fixture isolation retained.')

if __name__ == '__main__':
    check()
