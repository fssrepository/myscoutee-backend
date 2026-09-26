#!/usr/bin/env python3
"""Catalog compatibility: preserve old releases, require the new worker for seven images."""
import importlib.util
from pathlib import Path
import unittest
spec = importlib.util.spec_from_file_location('sign_update', Path(__file__).parents[1] / 'release/sign-update-manifest.py')
signing = importlib.util.module_from_spec(spec)
spec.loader.exec_module(signing)

class Compatibility(unittest.TestCase):
    def check(self, version, minimum, maximum):
        signing.validate_compatibility(dict(release_version=version, minimum_compatible_version=minimum, maximum_compatible_version=maximum))
    def test_old_release_unchanged(self):
        self.check('1.0.2', '1.0.0', '1.0.1')
    def test_old_worker_cannot_be_advertised_for_mcp_release(self):
        for version in ['1.3.0-qa.1', '1.3.0', '1.3.1']:
            with self.assertRaisesRegex(ValueError, 'signed client installer'):
                self.check(version, '1.0.2', '1.3.0')
    def test_new_worker_can_update(self):
        self.check('1.3.0', '1.3.0-qa.1', '1.3.0')
        self.check('1.3.1', '1.3.0', '1.3.0')
    def test_malformed_and_inverted_ranges_fail(self):
        for minimum, maximum in [('1.3', '1.3.0'), ('1.3.1','1.3.0'), ('01.3.0','1.3.0')]:
            with self.assertRaises(ValueError): self.check('1.3.1',minimum,maximum)
if __name__ == '__main__': unittest.main()
