#!/usr/bin/env python3
"""Audit all seed inventories, shared definitions and environment boundaries."""
import copy
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SEEDS = ROOT / 'server/docker/conf/mongodb'
SHARED = (
    'accessPolicyDefinitions', 'communityProviders', 'paymentProviders',
    'countryPartitions', 'helpCenterRevisions', 'ideaPosts', 'emailTemplates',
    'emailCampaignRules', 'notificationTemplates', 'i18n_messages', 'i18n_bundles',
    'scheduledMessageTasks',
)
CONFIGURED = (
    'affinityConfigs', 'appSettings', 'deploymentConfigurations',
    'notificationRuleConfigs', 'adminStats', 'adminMonitoring',
    'operatorRegistryEndpoints',
)
RUNTIME = (
    'users', 'userRates', 'userFilterPreferences', 'assets', 'assetRequests',
    'activityMembers', 'activityResources', 'activitySubEventStageRuntime',
    'chats', 'chatMessages', 'events', 'eventFeedbackStates', 'eventFeedbackAnswers',
    'navigatorContacts', 'payments', 'savedPaymentMethods', 'userAffinityEdges',
    'userExperienceProfiles', 'userFeedback', 'userNotifications', 'userReports',
)

def identity(value):
    return value.get('$oid') if isinstance(value, dict) else value

def audit(seeds=SEEDS):
    errors = []
    data = {}
    known = set(SHARED + CONFIGURED + RUNTIME) | {'adminUsers'}
    for mode in ('demo_db', 'myscoutee_db', 'e2e_db'):
        data[mode] = {}
        for path in (seeds / mode).glob('*.json'):
            rows = json.loads(path.read_text())
            if path.stem not in known:
                errors.append(f'{mode}/{path.stem}: unclassified seed; review its ownership')
            if not isinstance(rows, list) or any(not isinstance(r, dict) or '_id' not in r for r in rows):
                errors.append(f'{mode}/{path.stem}: expected document array with identities')
                continue
            ids = [identity(r['_id']) for r in rows]
            if len(set(ids)) != len(ids):
                errors.append(f'{mode}/{path.stem}: duplicate identity')
            data[mode][path.stem] = rows
        for name in SHARED + CONFIGURED + RUNTIME:
            if name not in data[mode]:
                errors.append(f'{mode}/{name}: missing JSON baseline')
    if errors:
        return errors
    demo = data['demo_db']
    for mode in ('myscoutee_db', 'e2e_db'):
        target = data[mode]
        for name in SHARED:
            keyed = lambda rows: {identity(r['_id']): r for r in rows}
            if keyed(target[name]) != keyed(demo[name]):
                errors.append(f'{mode}/{name}: differs from shared catalog')
        for name in ('affinityConfigs', 'appSettings', 'deploymentConfigurations', 'notificationRuleConfigs'):
            reference = copy.deepcopy(demo[name])
            actual = copy.deepcopy(target[name])
            if name == 'affinityConfigs' and mode == 'myscoutee_db':
                reference[0]['_id'] = actual[0]['_id']
            if name == 'appSettings' and mode == 'myscoutee_db':
                reference[0]['adminEmails'] = []
            if name == 'deploymentConfigurations':
                # Explicitly curated, empty deployment contact/social defaults.
                reference[0]['privacyContact'] = actual[0]['privacyContact']
                if mode == 'myscoutee_db':
                    if actual[0]['socialLinks']:
                        errors.append('production social links must not contain demo destinations')
                    reference[0]['socialLinks'] = []
            if name == 'notificationRuleConfigs' and mode == 'e2e_db':
                for row in reference:
                    if row['_id'] == 'notification-rule-event-counter-expiry':
                        timing = next(r['timing'] for r in actual if r['_id'] == row['_id'])
                        if timing.get('intervalSeconds') != 5:
                            errors.append('e2e counter expiry must retain its 5-second fixture timing')
                        row['timing'] = timing
            if actual != reference:
                errors.append(f'{mode}/{name}: unexpected configuration difference')
        for name in ('adminStats', 'adminMonitoring'):
            if mode == 'e2e_db' and target[name] != demo[name]:
                errors.append(f'{mode}/{name}: differs from demo telemetry fixture')
            if not set(demo[name][0]).issubset(target[name][0]):
                errors.append(f'{mode}/{name}: missing top-level telemetry fields')
        if mode == 'myscoutee_db':
            for name in RUNTIME + ('operatorRegistryEndpoints', 'adminUsers'):
                if target.get(name) != []:
                    errors.append(f'{mode}/{name}: must remain empty')
        else:
            if target['operatorRegistryEndpoints'] != demo['operatorRegistryEndpoints']:
                errors.append('e2e Registry fixture differs from demo baseline')
            users = {identity(r['_id']) for r in target['users']}
            for card in target['savedPaymentMethods']:
                if card.get('userId') not in users or not card.get('providerPaymentMethodRef', '').startswith('pm_sim_'):
                    errors.append('e2e saved payment method has missing owner or non-simulator reference')
            if target['savedPaymentMethods'] != demo['savedPaymentMethods']:
                errors.append('e2e simulator payment-method fixture is incomplete')
    return errors

if __name__ == '__main__':
    errors = audit()
    if errors:
        raise SystemExit('\n'.join(errors))
    print(f'PASS: all {len(SHARED + CONFIGURED + RUNTIME)} dev/prod/e2e seed baselines classified; shared definitions, configuration differences, production isolation and simulator-card owners verified.')
