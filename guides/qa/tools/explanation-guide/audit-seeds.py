import json,pathlib,re
r=pathlib.Path(__file__).resolve().parents[4];inv=json.loads((r/'frontend/src/app/shared/core/local/seed/data/help-center-guide-fields.json').read_text());bundles={l:json.loads((r/f'frontend/src/assets/i18n/{l}.json').read_text())['messages'] for l in ['en','hu']}
for c,fs in inv.items():
 assert len({f['id'] for f in fs})==len(fs),c
 for f in fs:
  assert f['screenKey']==c
  for l,b in bundles.items():
   for k in ['label','description']:assert b.get(f['i18nKey']+'.'+k),(c,l,f)
for db in ['demo_db','e2e_db','myscoutee_db']:
 d=r/f'server/docker/conf/mongodb/{db}';revs=json.loads((d/'helpCenterRevisions.json').read_text());fields=json.loads((d/'helpCenterGuideFields.json').read_text());assert len(fields)==sum(map(len,inv.values()))
 for c,fs in inv.items():
  for l in bundles:
   active=[x for x in revs if x.get('documentType')=='explanation' and x.get('contextKey')==c and x.get('lang')==l and x.get('active')]
   assert len(active)==1,(db,c,l,len(active))
   a=active[0];assert a['presentation']=='tour' and a['version']==4
   assert [x['guideStepId'] for x in a['sections']]==[f['id'] for f in fs]
   assert len({x['id'] for x in a['sections']})==len(fs),(c,'duplicate section')
 print(db, len(inv)*2,'active compact v4 guides passed')
print(len(inv),'contexts',sum(map(len,inv.values())),'fields; EN/HU parity passed')
