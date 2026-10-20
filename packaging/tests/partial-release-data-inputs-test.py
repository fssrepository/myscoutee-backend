#!/usr/bin/env python3
"""Check partial-release input rejection before any privileged mutation."""
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]


class PartialReleaseInputs(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.release = self.root / 'release'
        self.marker = self.root / 'mutation-boundary'
        server = self.root / 'server'
        server.mkdir()
        (server / 'docker-compose-prod.yml').touch()
        for directory in ['migrations', 'scripts', 'seeds/production_db', 'seeds/demo_db']:
            (self.release / directory).mkdir(parents=True)
        (self.release / 'migrations/006-release-system-defaults.js').touch()
        selection = (ROOT / 'scripts/release-system-seeds.json').read_text()
        (self.release / 'scripts/release-system-seeds.json').write_text(selection)
        self.selected = [row['collection'] for row in json.loads(selection)]
        names = set(self.selected) | {'deploymentConfigurations', 'helpCenterRevisions',
            'helpCenterGuideFields', 'ideaPosts', 'emailTemplates', 'notificationTemplates'}
        for database in ['production_db', 'demo_db']:
            for name in names:
                (self.release / 'seeds' / database / (name + '.json')).write_text('[]')
        self.script = self.root / 'apply.sh'
        self.script.write_text((ROOT / 'release/apply-partial-release-data.sh').read_text()
            .replace('server=/opt/myscoutee/server', 'server=' + str(server)))
        binaries = self.root / 'bin'
        binaries.mkdir()
        # tar is the first mutation boundary. Never let the harness reach Docker.
        for name, body in [('id', 'echo 0'), ('tar', 'touch "$BOUNDARY"; exit 86'),
                           ('docker', 'exit 87')]:
            path = binaries / name
            path.write_text('#!/bin/sh\n' + body + '\n')
            path.chmod(0o755)
        self.env = {**os.environ, 'PATH': str(binaries) + ':' + os.environ['PATH'],
                    'BOUNDARY': str(self.marker)}

    def run_inputs(self):
        return subprocess.run(['bash', str(self.script), str(self.release)],
                              env=self.env, capture_output=True, text=True).returncode

    def test_complete_shared_selection_reaches_backup(self):
        self.assertEqual(self.run_inputs(), 86)
        self.assertTrue(self.marker.exists())

    def test_every_selected_seed_is_required_in_both_databases(self):
        for database in ['production_db', 'demo_db']:
            for name in self.selected:
                with self.subTest(database=database, collection=name):
                    path = self.release / 'seeds' / database / (name + '.json')
                    path.unlink()
                    self.assertEqual(self.run_inputs(), 1)
                    self.assertFalse(self.marker.exists())
                    path.write_text('[]')

    def test_selected_seed_symlink_is_rejected(self):
        path = self.release / 'seeds/demo_db/communityGroups.json'
        path.unlink()
        path.symlink_to(self.release / 'seeds/production_db/communityGroups.json')
        self.assertEqual(self.run_inputs(), 1)
        self.assertFalse(self.marker.exists())


if __name__ == '__main__':
    unittest.main()
