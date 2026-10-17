"""MyScoutee seed ownership and expected environment differences."""
import copy

SHARED = (
    'accessPolicyDefinitions', 'communityProviders', 'paymentProviders',
    'countryPartitions', 'helpCenterRevisions', 'ideaPosts', 'emailTemplates',
    'emailCampaignRules', 'notificationTemplates', 'i18n_messages', 'i18n_bundles',
    'scheduledMessageTasks', 'exchangeRates',
    'landingSlides', 'helpCenterGuideFields',
    # Shared zero-revision inputs, inserted once; live worker revisions are retained.
    'adminWorkerSignals', 'affinityAdminSignalOutbox',
    'eventAdminSignalOutbox', 'notificationAdminSignalOutbox',
)
CONFIGURED = (
    'affinityConfigs', 'appSettings', 'deploymentConfigurations',
    'notificationRuleConfigs', 'adminStats', 'adminMonitoring',
    'operatorRegistryEndpoints',
)
RUNTIME = (
    'users', 'userRates', 'userFilterPreferences', 'assets', 'assetRequests',
    'activityMembers', 'activityResources', 'activitySubEventStageRuntime', 'communityGroups',
    'chats', 'chatMessages', 'events', 'feedbackStates', 'feedbackAnswers',
    'navigatorContacts', 'payments', 'savedPaymentMethods', 'userAffinityEdges',
    'userExperienceProfiles', 'userFeedback', 'userNotifications', 'userReports',
    'affinityAdminSignalOutboxRetries', 'eventAdminSignalOutboxRetries',
    'notificationAdminSignalOutboxRetries', 'integrationWebhookRetries',
    'mediaDeletionRetries', 'mediaDeletions',
)
# These product scenarios have DEMO/E2E fixtures and no production seed file.
DEMO_ONLY_RUNTIME = (
    'communityAnnouncements', 'campaigns', 'serviceOfferings', 'serviceCases',
    'communityScheduledTasks',
)


def identity(value):
    return value.get('$oid') if isinstance(value, dict) else value


def audit_project(data, errors):
    demo = data['demo_db']
    for name in ('adminWorkerSignals', 'affinityAdminSignalOutbox',
                 'eventAdminSignalOutbox', 'notificationAdminSignalOutbox'):
        ids = ('affinity', 'events', 'notifications') if name == 'adminWorkerSignals' else ('inputs',)
        fields = ('derivedRevision', 'queuesRevision') + (() if name == 'adminWorkerSignals'
                  else ('deliveredDerivedRevision', 'deliveredQueuesRevision'))
        expected = [{'_id': key, **dict.fromkeys(fields, 0)} for key in ids]
        if demo[name] != expected:
            errors.append(f'{name}: worker bootstrap must contain only canonical zero revisions')
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
                # Public brand links are shared; deployment contacts are curated.
                reference[0]['privacyContact'] = actual[0]['privacyContact']
                if mode == 'myscoutee_db':
                    if actual[0].get('integration', {}).get('publicBaseUrl') is not None:
                        errors.append('production integration URL must be operator-configured')
                    reference[0]['integration'] = {'publicBaseUrl': None}
                    if actual[0]['payment'].get('exchangeRateUrl') != 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml':
                        errors.append('production exchange-rate source must default to public ECB HTTPS')
                    reference[0]['payment']['exchangeRateUrl'] = 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml'
            if name == 'notificationRuleConfigs' and mode == 'e2e_db':
                for row in reference:
                    if row.get('ruleKey') == 'event-counter-expiry':
                        row['timing'].update(intervalMinutes=1, intervalSeconds=5,
                                             intervalAmount=5, intervalUnit='seconds',
                                             cronExpression='0/5 * * * * ?')
            if name == 'notificationRuleConfigs':
                actual = sorted(actual, key=lambda row: row['_id'])
                reference = sorted(reference, key=lambda row: row['_id'])
            if actual != reference:
                errors.append(f'{mode}/{name}: unexpected configuration difference')
        for name in ('adminStats', 'adminMonitoring'):
            if mode == 'e2e_db' and target[name] != demo[name]:
                errors.append(f'{mode}/{name}: differs from demo telemetry fixture')
            if not set(demo[name][0]).issubset(target[name][0]):
                errors.append(f'{mode}/{name}: missing top-level telemetry fields')
        if mode == 'myscoutee_db':
            # MSC-115 introduced these two system-owned root workspaces. They
            # are product catalogs, not DEMO members or user-created groups.
            groups = target['communityGroups']
            if {identity(row['_id']) for row in groups} != {'myscoutee-work', 'myscoutee-community'} or any(
                    row.get('ownerUserId') != 'system' or row.get('visibility') != 'public'
                    or row.get('policy') != {'workspace': True, 'enabled': False, 'requiredFields': []}
                    for row in groups):
                errors.append('production community groups must contain only the two public system workspaces')
            for name in RUNTIME + DEMO_ONLY_RUNTIME + ('operatorRegistryEndpoints', 'adminUsers'):
                if name == 'communityGroups':
                    continue
                if target.get(name, []) != []:
                    errors.append(f'{mode}/{name}: must remain empty')
        else:
            for name in DEMO_ONLY_RUNTIME:
                if target[name] != demo[name]:
                    errors.append(f'e2e_db/{name}: differs from the product demo fixture')
            if target['operatorRegistryEndpoints'] != demo['operatorRegistryEndpoints']:
                errors.append('e2e Registry fixture differs from demo baseline')
            users = {identity(r['_id']) for r in target['users']}
            for card in target['savedPaymentMethods']:
                if card.get('userId') not in users or not card.get('providerPaymentMethodRef', '').startswith('pm_sim_'):
                    errors.append('e2e saved payment method has missing owner or non-simulator reference')
            if target['savedPaymentMethods'] != demo['savedPaymentMethods']:
                errors.append('e2e simulator payment-method fixture is incomplete')
