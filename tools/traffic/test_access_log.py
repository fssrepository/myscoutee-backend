"""Focused regressions for misleading journey inferences, without a server."""

import importlib.util
import json
from pathlib import Path
import sys
import tempfile
import unittest


SPEC = importlib.util.spec_from_file_location('access_log', Path(__file__).with_name('analyze-access-log.py'))
MODULE = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = MODULE
SPEC.loader.exec_module(MODULE)
WV = 'Mozilla/5.0 (Linux; Android 15; device; wv) AppleWebKit/537.36 Version/4.0 Chrome/155.0 Mobile Safari/537.36'
IG = WV + ' Instagram 451.0 Android'
CHROME = 'Mozilla/5.0 (Linux; Android 15; device) AppleWebKit/537.36 Chrome/155.0 Mobile Safari/537.36'


def request(path='/', second=0, ua=IG, method='GET', status=200, ip='192.0.2.1'):
    line = (f'{ip} - - [20/Oct/2026:07:23:{second:02d} +0200] '
            f'"{method} {path} HTTP/2.0" {status} 123 "-" "{ua}" "198.51.100.7"')
    return MODULE.parse_line(line)


def kinds(sessions):
    return [item['kind'] for session in sessions for item in session['events']]


class JourneyTests(unittest.TestCase):
    def setUp(self):
        self.catalog = MODULE.Catalog()
        self.catalog.labels = {'/demo.js': 'Demóprofil-választó'}
        self.catalog.precache = {'/'} | {f'/chunk-{n}.js' for n in range(30)}
        self.catalog.known = set(self.catalog.labels) | self.catalog.precache

    def test_combined_and_docker_timestamps_and_untrusted_forwarded_for(self):
        row = request('/api/landing/articles?page=2&pageSize=10&userId=secret&token=secret')
        self.assertEqual(row.ip, '192.0.2.1')
        self.assertEqual(row.params, {'page': 2, 'pageSize': 10})
        self.assertEqual(MODULE.parse_line('2026-10-20T05:23:00.123Z 192.0.2.1 - - '
                                          '[20/Oct/2026:07:23:00 +0200] "GET / HTTP/1.1" 200 1 "-" "Mozilla/5.0"').path, '/')
        self.assertIsNone(MODULE.parse_line('2026/10/20 [error] unrelated nginx error'))

    def test_more_article_has_api_evidence_but_no_claim_of_reading_an_article(self):
        sessions = MODULE.analyze([request('/api/landing/articles?page=1&cursor=secret')], self.catalog)
        item = sessions[0]['events'][0]
        self.assertEqual(item['kind'], 'articles')
        self.assertEqual(item['confidence'], 'valószínű')
        self.assertIn('page=1', item['evidence'])
        self.assertNotIn('secret', json.dumps(sessions))

    def test_landing_and_firebase_configuration_are_background_signals(self):
        sessions = MODULE.analyze([request('/api/landing/content'), request('/api/deployment/configuration/firebase-config')], self.catalog)
        self.assertEqual(kinds(sessions), ['background', 'background'])

    def test_bulk_precache_never_becomes_thirty_page_or_popup_clicks(self):
        self.catalog.labels.update({f'/chunk-{n}.js': 'Popup' for n in range(30)})
        rows = [request('/', ua=IG)] + [request(f'/chunk-{n}.js', second=2, ua=WV) for n in range(30)]
        sessions = MODULE.analyze(rows, self.catalog)
        self.assertEqual(len(sessions), 1)
        self.assertEqual(kinds(sessions), ['precache'])

    def test_precache_does_not_hide_real_article_api_requests(self):
        rows = [request(f'/chunk-{n}.js', second=2, ua=WV) for n in range(30)]
        rows += [request('/api/landing/articles', second=3)]
        self.assertIn('articles', kinds(MODULE.analyze(rows, self.catalog)))

    def test_isolated_lazy_component_is_possible_not_confirmed_click(self):
        sessions = MODULE.analyze([request('/demo.js')], self.catalog)
        self.assertEqual(kinds(sessions), ['lazy_surface'])
        self.assertEqual(sessions[0]['events'][0]['confidence'], 'lehetséges')

    def test_unknown_chunk_from_another_build_has_no_surface_claim(self):
        sessions = MODULE.analyze([request('/chunk-OTHERBUILD.js')], self.catalog)
        self.assertEqual(kinds(sessions), [])
        self.assertEqual(sessions[0]['unknownJsRequests'], 1)

    def test_entry_static_dependency_cannot_be_a_lazy_click(self):
        self.catalog.initial.add('/demo.js')
        self.assertNotIn('lazy_surface', kinds(MODULE.analyze([request('/demo.js')], self.catalog)))

    def test_bare_webview_is_not_external_chrome(self):
        sessions = MODULE.analyze([request('/', ua=IG), request('/', ua=WV, second=3)], self.catalog)
        self.assertNotIn('browser_handoff', kinds(sessions))
        self.assertFalse(MODULE.external_browser(WV))

    def test_external_chrome_document_is_only_possible_handoff(self):
        sessions = MODULE.analyze([request('/', ua=IG), request('/', ua=CHROME, second=3)], self.catalog)
        handoffs = [item for session in sessions for item in session['events'] if item['kind'] == 'browser_handoff']
        self.assertEqual(len(handoffs), 1)
        self.assertEqual(handoffs[0]['confidence'], 'lehetséges')

    def test_external_asset_only_or_other_ip_is_not_handoff(self):
        sessions = MODULE.analyze([request('/', ua=IG), request('/demo.js', ua=CHROME, second=3),
                                   request('/', ua=CHROME, second=3, ip='192.0.2.2')], self.catalog)
        self.assertNotIn('browser_handoff', kinds(sessions))

    def test_failed_request_never_implies_success(self):
        sessions = MODULE.analyze([request('/api/auth/session/login', method='POST', status=401)], self.catalog)
        self.assertIn('Sikertelen kérés', sessions[0]['events'][0]['description'])
        self.assertEqual(sessions[0]['events'][0]['confidence'], 'megfigyelt')

    def test_repeated_calls_keep_count_and_different_status(self):
        sessions = MODULE.analyze([request('/api/auth/me', second=0), request('/api/auth/me', second=2),
                                   request('/api/auth/me', second=3, status=401)], self.catalog)
        self.assertEqual(len(sessions[0]['events']), 2)
        self.assertEqual(sessions[0]['events'][0]['count'], 2)

    def test_gap_splits_visits_and_not_people(self):
        first, last = request('/'), request('/')
        last.time += MODULE.timedelta(minutes=31)
        sessions = MODULE.analyze([last, first], self.catalog)
        self.assertEqual(len(sessions), 2)
        self.assertEqual(sessions[0]['client'], sessions[1]['client'])

    def test_reports_do_not_expose_ip_user_agent_tokens_or_unrecognized_paths(self):
        rows = [request('/api/landing/articles?token=SECRET_TOKEN&userId=PRIVATE_USER'),
                request('/api/users/PRIVATE_USER'), request('/admin/help/SECRET_TOKEN')]
        report = {'assetBuildId': 'test', 'parsedRequests': 3, 'automatedRequests': 0,
                  'warnings': [], 'sessions': MODULE.analyze(rows, self.catalog),
                  'coverage': MODULE.COVERAGE, 'limits': MODULE.LIMITS}
        for output in (json.dumps(report), MODULE.render(report, 'Europe/Prague')):
            for sensitive in ('192.0.2.1', 'SECRET_TOKEN', 'PRIVATE_USER', IG):
                self.assertNotIn(sensitive, output)

    def test_catalog_uses_emitted_dynamic_selectors_static_graph_and_worker(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'app-version.json').write_text('{"buildId":"test-build"}')
            (root / 'app-sw.js').write_text("const PRECACHE_CORE_URLS = ['./'];\nconst PRECACHE_BUILD_URLS = [\"./demo.js\"];")
            (root / 'index.html').write_text('<script type="module" src="main.js"></script>')
            (root / 'main.js').write_text('import{a}from"./shared.js";import("./demo.js");import("./entry.js");')
            (root / 'shared.js').write_text('export{};')
            (root / 'demo.js').write_text('selectors:[["app-demo-bootstrap-selector"]]')
            (root / 'entry.js').write_text('selectors:[["app-entry-page"]]')
            catalog = MODULE.Catalog(root)
            self.assertEqual(catalog.initial, {'/main.js', '/shared.js'})
            self.assertEqual(catalog.labels, {'/demo.js': 'Demóprofil-választó'})
            self.assertEqual(catalog.precache, {'/', '/demo.js'})


if __name__ == '__main__':
    unittest.main()
