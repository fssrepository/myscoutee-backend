import json,re,collections,datetime,pathlib,csv
P=pathlib.Path('/tmp/myscoutee-production-audit-20260912'); IDX=json.load(open(P/'session_index.json'))
SEL=[399,402,406,413,414,415,416,419,420,422,427,428,429,430,431,436,443,449,484,485,486,487,488,489,594]
CUT='2026-09-12T16:48:54.304Z'
KEYS=['input_tokens','cached_input_tokens','output_tokens','reasoning_output_tokens','total_tokens']
def stamp(t):return datetime.datetime.fromisoformat(t.replace('Z','+00:00')).timestamp()
def iso(t):return datetime.datetime.fromtimestamp(t,datetime.timezone.utc).isoformat().replace('+00:00','Z')
def phase(i,t):
 if i in [399,402]:return '01 Storyboard and source-film preparation (mixed in 402)'
 if i==406:
  if t<'2026-08-07T09:05:16':return '02 Early Flow tests and source story'
  if t<'2026-08-08T15:30' or '2026-08-09T07:00'<=t<'2026-08-09T19:44':return '03 Two English books, illustrations and paired prompts'
  return '04 Earlier Part I/II films and experiments'
 if i in [413,414,415,416,419,420,422,429]:return '04 Earlier Part I/II films and experiments'
 if i in [427,428]:return '05 Hungarian books, subtitles and release copy'
 if i==430:
  return '06 Related product campaign (separate)' if t<'2026-08-14T22:18:56' else '07 Book audiobook preparation and Kindle packaging'
 if i in [431,436]:return '07 Book audiobook preparation and Kindle packaging'
 if i==443:return '08 Paperback correction and packaging'
 if i==449:return '09 Festival title / master-prompt-era local work'
 if t<'2026-09-09T11:30':return '10 Festival master-prompt review and adaptation'
 if t<'2026-09-11T04:15':return '11 Image library, prompts, imports and pilot tests'
 if t<'2026-09-12T11:10':return '12 Festival video production and continuity repairs'
 if t<'2026-09-12T15:42':return '13 Assembly, narration, voice tests and local repairs'
 return '14 Source-matched final delivery and compression'
def union(xs):
 out=[]
 for a,b in sorted(xs):
  if b<a:continue
  if out and a<=out[-1][1]:out[-1][1]=max(out[-1][1],b)
  else:out.append([a,b])
 return out
def duration(xs):return sum(b-a for a,b in union(xs))
def blocks(xs,gap):
 out=[]
 for a,b in union(xs):
  if out and a-out[-1][1]<=gap:out[-1][1]=max(out[-1][1],b)
  else:out.append([a,b])
 return out
turns=[]; usages=[]; users=[]; diagnostics=[]; manifests=[]; seenresp=set(); seenus=set(); models={}; efforts={}
for i in SEL:
 s=IDX[i];sid=s['meta']['id'];es=[x for x in json.load(open(s['extract']))['events'] if x['ts']<CUT]; modern=any(x['kind']=='usage' for x in es); active=None; curmodel='unknown'; cureffort='unknown'; prev=None; finalts=None
 manifests.append({'index':i,'session_id':sid,'file':s['file'],'bytes':s['bytes'],'first':s['first'],'last':min(s['last'],CUT),'method':'response_id' if modern else 'cumulative_delta'})
 for e in es:
  t=e['ts'];k=e['kind']
  if k=='context':curmodel=e.get('model') or curmodel;models[e.get('turn_id')]=curmodel; cureffort=e.get('effort') or cureffort; efforts[e.get('turn_id')]=cureffort
  if k=='task_started':
   if active:active['end']=stamp(t);active['end_reason']='next_start';turns.append(active)
   active={'id':e.get('turn_id'),'session_id':sid,'index':i,'start':stamp(t),'end':stamp(t),'start_line':e['line'],'end_reason':'last_activity','phase':phase(i,t)}
  if active:active['end']=stamp(t)
  if k in ['task_complete','turn_aborted'] and active:
   active['end_reason']=k;active['end_line']=e['line'];turns.append(active);active=None
  if k=='user':
   txt=re.split(r'##? My request(?: for Codex)?:',e['text'])[-1]; ident=(sid,t,txt)
   if ident not in seenus:users.append({'session_id':sid,'index':i,'ts':t,'line':e['line'],'text':txt});seenus.add(ident)
  usage=None
  if modern and k=='usage':
   rid=e.get('response_id')
   if rid in seenresp:continue
   seenresp.add(rid);usage=e['usage'];tid=e.get('turn_id');method='response_id'
  elif not modern and k=='token_count' and e.get('total'):
   tot=e['total']
   if prev is None or tot['total_tokens']<prev['total_tokens']:usage=e.get('last') or tot
   else:usage={key:max(0,tot.get(key,0)-prev.get(key,0)) for key in KEYS}
   prev=tot;tid=active['id'] if active else None;method='cumulative_delta'
   if not usage.get('total_tokens'):continue
  if usage:
   usages.append({'session_id':sid,'index':i,'ts':t,'line':e['line'],'turn_id':tid,'model':models.get(tid,curmodel),'reasoning_effort':efforts.get(tid,cureffort),'phase':phase(i,t),'method':method,**{key:usage.get(key,0) for key in KEYS}})
 if active:turns.append(active)
# Split task intervals at explicit production-phase boundaries before grouping.
B=[stamp(x+'Z') for x in ['2026-08-07T09:05:16','2026-08-08T15:30:00','2026-08-09T07:00:00','2026-08-09T19:44:00','2026-08-14T22:18:56','2026-09-09T11:30:00','2026-09-11T04:15:00','2026-09-12T11:10:00','2026-09-12T15:42:00']]
parts=[]
for x in turns:
 cuts=[x['start']]+[b for b in B if x['start']<b<x['end']]+[x['end']]
 for l,r in zip(cuts,cuts[1:]):parts.append({**x,'start':l,'end':r,'phase':phase(x['index'],iso(l+0.001))})
turns=parts
# Long tasks are retained only to their recorded completion/last activity, never across unlogged idle time.
points=[(stamp(x['ts']),stamp(x['ts'])) for x in users]
activeints=[(x['start'],x['end']) for x in turns]; work=activeints+points
summary=[]
for group in sorted(set(x['phase'] for x in usages)|set(x['phase'] for x in turns)):
 ts=[x for x in turns if x['phase']==group];us=[x for x in usages if x['phase']==group];ints=[(x['start'],x['end']) for x in ts];pts=[(stamp(x['ts']),stamp(x['ts'])) for x in users if phase(x['index'],x['ts'])==group]
 auto=duration(ints); b15=blocks(ints+pts,900); b30=blocks(ints+pts,1800)
 summary.append({'phase':group,'model_reasoning':'; '.join(sorted({x['model']+'/'+x['reasoning_effort'] for x in us})),'turns':len(set(x['id'] for x in ts)),'responses':len(us),'automatic_seconds':auto,'window15_seconds':duration(b15),'window30_seconds':duration(b30),'residual30_seconds':duration(b30)-auto,'blocks15':len(b15),'blocks30':len(b30),**{key:sum(x[key] for x in us) for key in KEYS}})
total={key:sum(x[key] for x in usages) for key in KEYS};total.update({'automatic_seconds':duration(activeints),'window15_seconds':duration(blocks(work,900)),'window30_seconds':duration(blocks(work,1800)),'blocks15':len(blocks(work,900)),'blocks30':len(blocks(work,1800)),'turns':len(turns),'responses':len(usages),'user_messages':len(users)})
json.dump({'cutoff':CUT,'manifest':manifests,'turns':turns,'usages':usages,'phase_summary':summary,'totals':total,'blocks15':blocks(work,900),'blocks30':blocks(work,1800)},open(P/'ledger.json','w'),indent=2)
json.dump(users,open(P/'users.json','w'),ensure_ascii=False)
for x in summary:print(x['phase'], 'hours',*[round(x[k]/3600,2) for k in ['automatic_seconds','window15_seconds','window30_seconds']],'tokensM',round(x['total_tokens']/1e6,3))
print('TOTAL',total)
print('LONG TURNS',[(x['index'],iso(x['start']),round((x['end']-x['start'])/3600,2),x['end_reason']) for x in turns if x['end']-x['start']>3600])
