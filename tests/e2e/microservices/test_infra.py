"""Safety gates with disposable state; these tests do not claim a provisioned VM."""

import os as _context_os
import sys as _context_sys
from pathlib import Path as _ContextPath
_context_root = _ContextPath(__file__).resolve().parents[3]
_context_os.environ.setdefault('MYSCOUTEE_BACKEND_SOURCE', str(_context_root))
_context_sys.path.insert(0, str(_ContextPath(_context_os.environ.get('MYSCOUTEE_MICROSERVICES_SOURCE', _context_root.parent / 'myscoutee-microservices')) / 'tools'))
import json
from pathlib import Path
import tempfile
import seed_retry_catalog
import unittest
from unittest.mock import patch
import workloads


class WorkloadCompositionTest(unittest.TestCase):
    def test_current_workers_receive_their_declared_notification_jobs_capability(self):
        scoped = workloads.transport_credentials_by_service(workloads.SERVICES, workloads.BACKEND)
        key = 'MYSCOUTEE_REMOTE_NOTIFICATION_JOBS_COMMAND_TOKEN'
        for domain in ('media', 'community'):
            owner = next(name for name, service in workloads.SERVICES.items() if domain in service['domains'])
            self.assertEqual('notificationJobsToken', scoped[owner][key])

    def test_current_assembly_consumers_have_authorized_producer_scopes(self):
        # Exercise the real composition: synthetic bindings alone cannot detect
        # a canonical service moving to another domain with a stale allowlist.
        scoped = workloads.transport_credentials_by_service(workloads.SERVICES, workloads.BACKEND)
        self.assertEqual(set(workloads.SERVICES), set(scoped))
        role_key = 'MYSCOUTEE_REMOTE_ROLE_NOTIFICATIONS_COMMAND_TOKEN'
        self.assertIn(role_key, scoped['identity'])
        self.assertIn(role_key, scoped['communication'])
        self.assertNotIn(role_key, scoped['network'])

    def test_regrouping_a_domain_moves_its_remote_target_without_changing_other_targets(self):
        services = json.loads(json.dumps(workloads.SERVICES))
        original, credentials = workloads.transport_settings(services)
        services['community']['domains'].remove('groups')
        services['separate-groups'] = {'domains': ['groups']}
        regrouped, new_credentials = workloads.transport_settings(services)
        self.assertEqual('http://separate-groups:8080', regrouped['MYSCOUTEE_REMOTE_GROUPS_MEDIA_URL'])
        self.assertEqual('http://community:8080', regrouped['MYSCOUTEE_REMOTE_COMMUNITY_MEDIA_URL'])
        self.assertEqual(credentials, new_credentials)
        # Moving a domain moves every API it owns, including administration.
        moved = {'MYSCOUTEE_REMOTE_GROUPS_MEDIA_URL', 'MYSCOUTEE_REMOTE_GROUP_DIRECTORY_URL',
                 'MYSCOUTEE_REMOTE_GROUP_ADMINISTRATION_URL', 'MYSCOUTEE_REMOTE_PROFILE_WORKSPACE_URL',
                 'MYSCOUTEE_REMOTE_INTEGRATION_GROUPS_URL'}
        self.assertEqual(moved, {key for key in original if original[key] != regrouped[key]})
        for key in moved:
            self.assertEqual('http://separate-groups:8080', regrouped[key])

    def test_missing_or_duplicate_transport_owner_is_rejected(self):
        services = json.loads(json.dumps(workloads.SERVICES))
        services['community']['domains'].remove('groups')
        with self.assertRaisesRegex(RuntimeError, 'exactly one owner'):
            workloads.transport_settings(services)
        services['community']['domains'].append('groups')
        services['duplicate'] = {'domains': ['groups']}
        with self.assertRaisesRegex(RuntimeError, 'exactly one owner'):
            workloads.transport_settings(services)


class SeedCatalogPolicyTest(unittest.TestCase):
    def test_retry_delta_keeps_only_new_catalog_rows(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            old = root / 'old.json'; new = root / 'new.json'
            old.write_text('[{"_id":"old","enabled":false}]')
            new.write_text('[{"_id":"old","enabled":false},{"_id":"new","ruleKey":"events-admin-signals"}]')
            name = 'demo_db/notificationRuleConfigs.json'
            self.assertEqual(seed_retry_catalog.retry_catalog_delta({name:new}, {name:old}),
                             {name:[{'_id':'new','ruleKey':'events-admin-signals'}]})
            new.write_text('[{"_id":"old","enabled":true}]')
            with self.assertRaisesRegex(RuntimeError, 'existing catalog'):
                seed_retry_catalog.retry_catalog_delta({name:new}, {name:old})

    def test_retry_delta_rejects_unrelated_data_and_catalog_changes(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'rows.json'; path.write_text('[]')
            with self.assertRaisesRegex(RuntimeError, 'Unrelated seed'):
                seed_retry_catalog.retry_catalog_delta({'demo_db/users.json':path}, {})
            with self.assertRaisesRegex(RuntimeError, 'remove seed'):
                seed_retry_catalog.retry_catalog_delta({}, {'demo_db/users.json':path})
            old = Path(directory) / 'old.json'; old.write_text('[]')
            path.write_text('[{"_id":"new","ruleKey":"other-job"}]')
            with self.assertRaisesRegex(RuntimeError, 'Unrelated catalog'):
                seed_retry_catalog.retry_catalog_delta({'demo_db/notificationRuleConfigs.json':path},
                                             {'demo_db/notificationRuleConfigs.json':old})



class DeploymentCredentialsTest(unittest.TestCase):
    def test_new_transport_tokens_preserve_existing_credentials_and_repeat_without_rewrite(self):
        with tempfile.TemporaryDirectory() as directory:
            secret_file = Path(directory) / 'workload-secrets.json'
            original = {'mongoPassword': 'fixture-mongo', 'mongoRootPassword': 'fixture-root',
                        'localizationToken': 'fixture-localization'}
            secret_file.write_text(json.dumps(original))
            secret_file.chmod(0o600)
            with patch.object(workloads, 'SECRET_FILE', secret_file):
                first = workloads.secrets_data()
                saved = secret_file.read_bytes()
                timestamp = secret_file.stat().st_mtime_ns
                second = workloads.secrets_data()
            self.assertEqual(original, {key: first[key] for key in original})
            self.assertRegex(first['minioRootPassword'], r'^[A-Za-z0-9_-]{43}$')
            self.assertRegex(first['configurationMasterKey'], r'^[0-9a-f]{64}$')
            self.assertRegex(first['paymentSimulatorApiKey'], r'^sk_test_[A-Za-z0-9_-]{43}$')
            self.assertRegex(first['paymentSimulatorWebhookSecret'], r'^whsec_[A-Za-z0-9_-]{43}$')
            self.assertEqual(36, len(first['paymentSimulatorPosKey']))
            for key in (binding['credential'] for binding in workloads.TRANSPORTS if binding['credential'] != 'localizationToken'):
                self.assertRegex(first[key], r'^[A-Za-z0-9_-]{43}$')
            self.assertEqual(first, second)
            self.assertEqual(saved, secret_file.read_bytes())
            self.assertEqual(timestamp, secret_file.stat().st_mtime_ns)
            self.assertEqual(0o600, secret_file.stat().st_mode & 0o777)



if __name__ == '__main__':
    unittest.main()
