import html
import json
import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[5]
DATA = ROOT / 'myscoutee-frontend/src/app/shared/core/local/seed/data'


def read(path):
    return json.loads(path.read_text())


inventory = read(DATA / 'help-center-guide-fields.json')
versions = read(DATA / 'help-center-guide-versions.json')
bundles = {lang: read(ROOT / f'myscoutee-frontend/src/assets/i18n/{lang}.json')['messages']
           for lang in ['en', 'hu']}
field_count = sum(map(len, inventory.values()))
parser = argparse.ArgumentParser(description='Audit the complete guide catalog or selected contexts.')
parser.add_argument('--context', action='append', choices=sorted(inventory))
contexts = parser.parse_args().context or list(inventory)
for context, fields in inventory.items():
    assert len({field['id'] for field in fields}) == len(fields), context
    for field in fields:
        assert field['screenKey'] == context
        for lang, bundle in bundles.items():
            for suffix in ['label', 'description']:
                assert bundle.get(field['i18nKey'] + '.' + suffix), (context, lang, field)


def check_revision(revision, context, lang):
    fields = inventory[context]
    assert revision['presentation'] == 'tour', (context, lang)
    assert revision['version'] == versions.get(context, 4), (context, lang, revision['version'])
    sections = revision['sections']
    assert [section['guideStepId'] for section in sections] == [field['id'] for field in fields], (context, lang)
    assert len({section['id'] for section in sections}) == len(fields), (context, 'duplicate section')
    for section, field in zip(sections, fields):
        assert section['title'] == bundles[lang][field['i18nKey'] + '.label'], (context, lang, field['id'])
        description = html.escape(bundles[lang][field['i18nKey'] + '.description']).replace('&#x27;', '&#39;')
        assert section['contentHtml'] == '<p>' + description + '</p>', (context, lang, field['id'])


for database in ['demo_db', 'e2e_db', 'myscoutee_db']:
    directory = ROOT / f'server/docker/conf/mongodb/{database}'
    revisions = read(directory / 'helpCenterRevisions.json')
    assert len({row['_id'] for row in revisions}) == len(revisions), (database, 'duplicate revision ID')
    seeded_fields = read(directory / 'helpCenterGuideFields.json')
    assert len(seeded_fields) == field_count
    assert {row['_id']: {key: value for key, value in row.items() if key != '_id'} for row in seeded_fields} == {
        f"{context}--{field['id']}": field for context, fields in inventory.items() for field in fields
    }, (database, 'guide field parity')
    for context in contexts:
        for lang in bundles:
            active = [row for row in revisions if row.get('documentType') == 'explanation'
                      and row.get('contextKey') == context and row.get('lang') == lang
                      and row.get('active') and not row.get('baseGroupId')]
            assert len(active) == 1, (database, context, lang, len(active))
            check_revision(active[0], context, lang)
    # Each workspace owns its help revisions; it does not fall back to Dating.
    for group in ['myscoutee-work', 'myscoutee-community']:
        for context in ['chats', 'event.chat', 'chat.call', 'chat.call.volume', 'landing.guide', 'landing.consent',
                        'profile.integrations', 'profile.integration-access']:
            if context not in contexts:
                continue
            for lang in bundles:
                active = [row for row in revisions if row.get('documentType') == 'explanation'
                          and row.get('baseGroupId') == group and row.get('contextKey') == context
                          and row.get('lang') == lang and row.get('active')]
                assert len(active) == 1, (database, group, context, lang)
                check_revision(active[0], context, lang)
    print(database, len(contexts) * 2, 'selected active default guides and scoped follow-up guides passed')
print(len(inventory), 'contexts', field_count, 'catalog fields; EN/HU catalog and seed-field parity passed')
print('Revision/section parity passed for:', ', '.join(contexts))
