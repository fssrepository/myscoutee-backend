import json,pathlib,collections,datetime,csv,hashlib,sys
P=pathlib.Path('/tmp/myscoutee-production-audit-20260912'); R=pathlib.Path('/home/raxim/workspace/myscoutee-backend/guides/story/london/cinema_studio_steps/04_tracking/production_audit');R.mkdir(exist_ok=True)
L=json.load(open(P/'ledger.json'));I=json.load(open(P/'image_assessment.json'));U=json.load(open(P/'users.json'));IDX=json.load(open(P/'session_index.json'))
def stamp(t):return datetime.datetime.fromisoformat(t.replace('Z','+00:00')).timestamp()
def iso(t):return datetime.datetime.fromtimestamp(t,datetime.timezone.utc).isoformat().replace('+00:00','Z')
def union(xs):
 out=[]
 for a,b in sorted(xs):
  if out and a<=out[-1][1]:out[-1][1]=max(out[-1][1],b)
  else:out.append([a,b])
 return out
def dur(xs):return sum(b-a for a,b in union(xs))
def blocks(xs,gap):
 out=[]
 for a,b in union(xs):
  if out and a-out[-1][1]<=gap:out[-1][1]=max(out[-1][1],b)
  else:out.append([a,b])
 return out
def totals(us,ts,points=[]):
 ints=[(t['start'],t['end']) for t in ts];bs15=blocks(ints+points,900);bs30=blocks(ints+points,1800);d={k:sum(x[k] for x in us) for k in ['input_tokens','cached_input_tokens','output_tokens','reasoning_output_tokens','total_tokens']};d.update(automatic_seconds=dur(ints),window15_seconds=dur(bs15),window30_seconds=dur(bs30),residual30_seconds=dur(bs30)-dur(ints),blocks15=len(bs15),blocks30=len(bs30),responses=len(us),turns=len(set(t['id'] for t in ts)));d['uncached_input_tokens']=d['input_tokens']-d['cached_input_tokens'];return d
scopes={}
for name,predicate in [('Festival film incl. local title',lambda x:int(x['phase'][:2])>=9),('Two English books + paired prompts',lambda x:x['phase'].startswith('03')),('Whole measured lineage excl. product campaign',lambda x:not x['phase'].startswith('06')),('Related product campaign only',lambda x:x['phase'].startswith('06'))]:
 ts=[x for x in L['turns'] if predicate(x)];us=[x for x in L['usages'] if predicate(x)];scopes[name]=totals(us,ts)
# Root-linked guardian logs may repeat evidence or aggregate usage; record separately, do not add unverified overhead.
ids={x['session_id'] for x in L['manifest']}; guardians=[]
for i,s in enumerate(IDX):
 if s['meta'].get('thread_source')!='subagent' or s['meta'].get('session_id') not in ids:continue
 es=json.load(open(s['extract']))['events'];tc=[e for e in es if e['kind']=='token_count'];guardians.append({'session_id':s['meta']['id'],'parent_id':s['meta']['session_id'],'file':s['file'],'first':s['first'],'last':s['last'],'counter_records':len(tc),'reported_final_counter':tc[-1]['total'] if tc else {},'accounting':'Excluded from root totals: overlap/aggregation unverified; never count copied user history as new work.'})
# These are evidence-led review windows, not a claim that every token in the window was wasted.
E=[
('B01','2026-08-09T17:33:45Z','2026-08-09T17:40:36Z','technical','Book PDF blank-page and publication-state repair','One blank page removed; regenerated publication and checksums.'),
('F01','2026-08-10T16:18:34Z','2026-08-10T18:05:51Z','technical','Earlier film joins / freeze-frame corrections','Two consecutive local repair conversations; not current festival film.'),
('F02','2026-08-10T18:07:14Z','2026-08-10T22:07:14Z','technical','Earlier film native voice/background repair','Audio continuity and unwanted generated voice required local reconstruction.'),
('N01','2026-09-09T16:21:26Z','2026-09-09T16:50:22Z','workflow','Pilot prompt scope rollback','User reverted unwanted cumulative changes; rebuilt separate test requests.'),
('N02','2026-09-10T12:23:29Z','2026-09-10T12:48:03Z','workflow','Memory detail omitted during prompt restructuring','Restoration/checking after user reported details removed.'),
('N03','2026-09-10T13:28:08Z','2026-09-10T13:41:27Z','platform','Image generation with references failed','Investigated failed reference-bound job and continued memory setup.'),
('N04','2026-09-11T07:16:21Z','2026-09-11T08:29:00Z','technical','End-frame export and continuation displacement','Compared frames, diagnosed separate early export and spatial offset; repaired test join.'),
('N05','2026-09-11T11:48:09Z','2026-09-11T13:35:00Z','platform','Eligibility / 30-reference limit / early replacements','Composer capacity and moderation forced repartition and replacement work.'),
('N06','2026-09-11T14:17:50Z','2026-09-11T15:40:00Z','platform','Further Face/IP replacements and stale eligibility','Distinct blocked references and replacement binding checks.'),
('N07','2026-09-11T18:18:41Z','2026-09-11T19:26:00Z','technical','Statue join / freeze / VLC repair','Local transition and playback correction; includes attempted solutions.'),
('N08','2026-09-11T20:13:06Z','2026-09-11T20:31:00Z','platform','P05 statue NSFW inconsistency','Rejected reference compared with generated content; diagnosis/reporting.'),
('N09','2026-09-12T08:43:00Z','2026-09-12T09:08:04Z','platform','P09 sensitive-output rejection and retry','Restart subsequently completed; exact rejection cause unknown.'),
('N10','2026-09-12T09:27:27Z','2026-09-12T09:56:00Z','technical','P10 failure / page-turn transition review','Prompt correction and safeguards for P11/P12; no claim that all this interval is rerendering.'),
('N11','2026-09-12T10:18:00Z','2026-09-12T10:43:00Z','technical','P11 Parliament/Westminster jump and fixed export','Local statue-style repair and end-frame source correction.'),
('N12','2026-09-12T10:52:56Z','2026-09-12T11:01:00Z','platform','Element image fidelity discrepancy','Bit-depth/pixel/metadata comparison; gateway causal link remains unproved.'),
('N13','2026-09-12T11:35:24Z','2026-09-12T12:11:00Z','technical','P00 original-quality, lettering, audio and VLC correction','Revisited downloaded original, local title repair and playback/audio handling.'),
('C01','2026-09-12T12:23:00Z','2026-09-12T12:59:11Z','creative','Narration meaning and picture-fit rewrite','Creative revision following full-film review; not classified as technical waste.'),
('C02','2026-09-12T13:08:00Z','2026-09-12T13:40:37Z','creative','Dream versus plain transition comparison','User-selected experiment later set aside; not all experimentation is failure.'),
('N14','2026-09-12T14:45:00Z','2026-09-12T14:50:23Z','platform','Qwen incompatible voice preset','Grady voice preset unavailable; attempted model comparison could not start.'),
('N15','2026-09-12T15:45:36Z','2026-09-12T15:56:00Z','workflow','Over-aggressive first compression attempt','CRF 18 attempt stopped after correction; replaced with source-matched CRF 8. Accepted final encode is outside this error window.')]
episodes=[]
for id,start,end,kind,name,note in E:
 a,b=stamp(start),stamp(end);us=[x for x in L['usages'] if a<=stamp(x['ts'])<b];ts=[{**t,'start':max(a,t['start']),'end':min(b,t['end'])} for t in L['turns'] if t['start']<b and t['end']>a];d=totals(us,ts);d.update(id=id,start_utc=start,end_utc=end,category=kind,episode=name,note=note,elapsed_seconds=b-a,evidence=[{'session_id':x['session_id'],'line':x['line'],'ts':x['ts']} for x in U if a<=stamp(x['ts'])<b][:5]);episodes.append(d)
# Coarse campaign/day/session ledgers: epoch unions, not sum of parallel spans.
daily=[]
for day in sorted(set(x['ts'][:10] for x in L['usages'])):
 a=stamp(day+'T00:00:00Z');b=a+86400;ts=[{**t,'start':max(a,t['start']),'end':min(b,t['end'])} for t in L['turns'] if t['start']<b and t['end']>a];us=[x for x in L['usages'] if x['ts'].startswith(day)];daily.append({'date_utc':day,**totals(us,ts)})
models=[]
for model,effort in sorted(set((x['model'],x['reasoning_effort']) for x in L['usages'])):
 us=[x for x in L['usages'] if x['model']==model and x['reasoning_effort']==effort];models.append({'model':model,'reasoning_effort':effort,'responses':len(us),**{k:sum(x[k] for x in us) for k in ['input_tokens','cached_input_tokens','output_tokens','reasoning_output_tokens','total_tokens']}})
work=[(t['start'],t['end']) for t in L['turns']]+[(stamp(x['ts']),stamp(x['ts'])) for x in U]
sessions=[]
for n,(a,b) in enumerate(blocks(work,1800),1):
 ts=[{**t,'start':max(a,t['start']),'end':min(b,t['end'])} for t in L['turns'] if t['start']<b and t['end']>a];us=[x for x in L['usages'] if a<=stamp(x['ts'])<=b];sessions.append({'block':n,'start_utc':iso(a),'end_utc':iso(b),'elapsed_hours':(b-a)/3600,**totals(us,ts)})
def csvwrite(name,rows,keys=None):
 if not rows:return
 keys=keys or list(rows[0]);
 with open(R/name,'w') as f:
  w=csv.DictWriter(f,fieldnames=keys,extrasaction='ignore');w.writeheader();w.writerows(rows)
csvwrite('phases.csv',L['phase_summary']);csvwrite('days.csv',daily);csvwrite('continuous_sessions_30min.csv',sessions);csvwrite('models.csv',models);csvwrite('responses.csv',L['usages']);csvwrite('task_intervals.csv',L['turns']);csvwrite('repair_windows.csv',episodes,[k for k in episodes[0] if k!='evidence'])
summary={'cutoff_utc':L['cutoff'],'scan':{'files':len(IDX),'bytes':sum(x['bytes'] for x in IDX),'selected_root_segments':len(L['manifest']),'selected_root_threads':len(ids),'root_linked_guardian_logs':len(guardians)},'scope_totals':scopes,'all_selected_root_totals':L['totals'],'phases':L['phase_summary'],'models':models,'episodes':episodes,'manifest':L['manifest'],'unreconciled_guardian_counters':guardians,'image_summary':I['summary']}
(R/'summary.json').write_text(json.dumps(summary,indent=2,ensure_ascii=False)+'\n');(R/'image_evidence.json').write_text(json.dumps(I,indent=2,ensure_ascii=False)+'\n')
# Audit snapshots of the actual submitted prompts; exclude private transcripts and raw media from the repository.
(R/'sample_prompts').mkdir(exist_ok=True);a=json.load(open(P/'image_sample.json'))
for x in a:(R/'sample_prompts'/f"{x['asset']}.txt").write_text(x['prompt'])
def h(s):return f'{s/3600:.2f}'
def m(n):return f'{n/1e6:.3f}'
def row_scope(name,d):return f"| {name} | {h(d['window15_seconds'])}–{h(d['window30_seconds'])} | {h(d['automatic_seconds'])} | {h(d['residual30_seconds'])} | {m(d['total_tokens'])} | {m(d['uncached_input_tokens'])} | {m(d['cached_input_tokens'])} | {m(d['output_tokens'])} |"
lines=['# MyScoutee production effort and image-adherence audit — 12 September 2026','',
'Production cutoff: **2026-09-12 16:48:54 UTC (18:48:54 CEST)**, immediately before this audit request. Audit work itself is excluded. The creator reports both final deliverables uploaded; upload/publication status was not rechecked.','',
'## What the records support','',
'Primary festival scope is the August 27 local title plus September 9–12 preparation, library, pilots, generation, narration, editing and final export. Earlier books and Part I/II film work are shown separately. The related August 14 product campaign is excluded from the whole-lineage headline. No new image, video or voice generation was run for this audit.','',
'| Scope | Joint window, 15–30 min rule (h) | Codex task intervals (h) | Residual at 30 min (h) | Total tokens (M) | Uncached input (M) | Cached input (M) | Output (M) |',
'| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |']
lines += [row_scope(k,d) for k,d in scopes.items()]
lines += ['', '**These are reconstructed workload measures, not person-hour timesheets or a bill.** Total tokens include repeatedly processed cached context. Cached input is a subset of input; reasoning output is a subset of output. Neither is added twice. An input/output token sum does not equal the amount of original writing produced. Subscription multipliers, Higgsfield credits and provider-internal image/video/TTS tokens are not derivable from these Codex records.','',
'## Method and uncertainty','',
'- Scanned 595 active/archived JSONL files (17.02 GB); selected 25 root segments from 21 distinct root conversation IDs. Unrelated application QA, Navier–Stokes and demo-asset work were excluded. Older IDE request wrappers were stripped before topic review. Scope decisions use actual requests and task dates, not every occurrence of “book” inside a quoted history.',
'- September usage uses unique `response_id` records. Older logs use positive differences in cumulative `token_count`; repeated unchanged totals contribute zero. At an initial partial counter or counter reset only the recorded last response is counted. This avoids charging a carried-in cumulative balance again, but any earlier unrecorded usage remains missing.',
'- Twenty-nine root-linked guardian/approval logs are inventoried separately in `summary.json`. Their copied histories are not extra production sessions. Their counters are not added to root totals because cross-log aggregation/overlap has not been reconciled; the root ledger is not an assertion of a complete platform bill.',
'- Automatic time is the union of recorded `task_started` to `task_complete` / `turn_aborted` intervals; incomplete intervals stop at last activity or next start. It includes tool execution, rendering, network waits and human messages arriving while a task is active. It is not pure GPU/LLM compute time.',
'- Joint-work windows merge task intervals and real user-message timestamps when the gap is at most 15 or 30 minutes. The displayed range is sensitivity to that rule, not a statistical confidence interval. A long actively logged render remains included; unlogged overnight gaps do not. Parallel intervals are unioned, never summed twice.',
'- Residual = joint window minus Codex task intervals. It is a proxy for manual interaction, checking/copying/uploading and platform waiting. It cannot distinguish those activities, and excludes manual work overlapping active Codex turns. Therefore it is neither an exact manual-labor figure nor a lower/upper bound on human labor.',
'- Phase assignment uses documented date boundaries and the dominant task. Book drafting, illustration and paired prompt work were intertwined; some later book corrections are embedded in the earlier-film phase. August 5 also includes a short Navier handoff alongside the story work, so its mixed phase is not a pure film-only cost. No invented second-by-second allocation is used.',
'- Per-phase joint-window totals need not sum to the all-work union: a short gap across a phase boundary is included globally but not necessarily inside either phase. Tokens do partition exactly. Daily/session/model exports retain full precision; report hours/tokens are rounded.',
'', '## Books and the original master prompt','',
'The first explicit book request is logged on **August 7 at 09:05 UTC**. Part II begins on **August 8 at 06:51 UTC**; a two-book closeout with 52/106 pages and synchronized film materials is recorded on **August 9 at 19:43 UTC**. That is about **58 h 38 min of calendar span**, with the joint-work estimate above restricted to the book-dominant phases. Later translations, Kindle/EPUB preparation, paperback fixes and book corrections during earlier film work are separate rows. “Roughly two days” describes the rapid initial production, not all subsequent publishing labor.',
'',
'The canonical festival master prompt existed before the September Codex review. The creator confirms GPT-5.6 Sol / Extra High for the books, matching logged `gpt-5.6-sol` / `xhigh`. For the original master prompt the creator recalls either that model or GPT-6 Astra / High, over roughly one additional day; Git first records the pack on August 27. **Its original ChatGPT writing session and token usage were not found in the 595 local Codex files.** That reported day is not silently converted to 24 work-hours or assigned invented tokens. Only the local title and later Codex adaptation are measured here. Work done in other ChatGPT/Claude chats or manually in generation UIs outside these joint windows is likewise unobserved.','',
'## Phase ledger','',
'| Dominant phase | Model / reasoning | Codex h | Joint h, 15 min | Joint h, 30 min | Residual h, 30 min | Total tokens M | Cached input M | Output M |',
'| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |']
for x in L['phase_summary']:lines.append(f"| {x['phase']} | {x['model_reasoning']} | {h(x['automatic_seconds'])} | {h(x['window15_seconds'])} | {h(x['window30_seconds'])} | {h(x['residual30_seconds'])} | {m(x['total_tokens'])} | {m(x['cached_input_tokens'])} | {m(x['output_tokens'])} |")
lines += ['', '## Model token ledger — all selected roots, including the separate product row','', '| Logged model | Usage records / deltas | Uncached input M | Cached input M | Output M | Reasoning within output M | Total M |','| --- | ---: | ---: | ---: | ---: | ---: | ---: |']
for x in models:lines.append(f"| {x['model']} / {x['reasoning_effort']} | {x['responses']} | {m(x['input_tokens']-x['cached_input_tokens'])} | {m(x['cached_input_tokens'])} | {m(x['output_tokens'])} | {m(x['reasoning_output_tokens'])} | {m(x['total_tokens'])} |")
lines += ['', '## Daily ledger — UTC, all selected roots','', '| Day | Joint h, 15–30 min | Codex h | Residual h, 30 min | Total tokens M | Output M |','| --- | ---: | ---: | ---: | ---: | ---: |']
for x in daily:lines.append(f"| {x['date_utc']} | {h(x['window15_seconds'])}–{h(x['window30_seconds'])} | {h(x['automatic_seconds'])} | {h(x['residual30_seconds'])} | {m(x['total_tokens'])} | {m(x['output_tokens'])} |")
lines += ['', '## Continuous collaboration blocks — 30-minute rule, UTC','', '| Block | Start UTC | End UTC | Elapsed h | Codex h | Residual h | Tokens M |','| --- | --- | --- | ---: | ---: | ---: | ---: |']
for x in sessions:lines.append(f"| {x['block']} | {x['start_utc'][:19].replace('T',' ')} | {x['end_utc'][:19].replace('T',' ')} | {x['elapsed_hours']:.2f} | {h(x['automatic_seconds'])} | {h(x['residual30_seconds'])} | {m(x['total_tokens'])} |")
lines += ['', '## Failure, correction and discarded-experiment windows','',
'These are selected evidence-backed incident windows, **not an exhaustive count of all failures**. Time/tokens measure gross logged work inside each window: diagnosis, retry preparation, generation waiting, validation and sometimes concurrent progress. Resolution may continue outside a window. Successful salvage is not “wasted” work. The exact avoidable-loss fraction cannot be recovered from chat logs; do not publish the sum as a proven waste bill. Creative iterations are explicitly separated. Evidence line pointers and timestamps are in `summary.json`; no private conversation text is copied into this report.','',
'| ID / type | UTC window | Incident | Window min | Codex min | Tokens M incl. cache | Uncached input + output M | Outcome / limit |','| --- | --- | --- | ---: | ---: | ---: | ---: | --- |']
for x in episodes:lines.append(f"| {x['id']} / {x['category']} | {x['start_utc'][5:16].replace('T',' ')}–{x['end_utc'][11:16]} | {x['episode']} | {x['elapsed_seconds']/60:.1f} | {x['automatic_seconds']/60:.1f} | {m(x['total_tokens'])} | {m(x['total_tokens']-x['cached_input_tokens'])} | {x['note']} |")
tech=[x for x in episodes if x['category']!='creative'];fresh=[x for x in tech if x['id'].startswith('N')];
lines += ['',f"The {len(fresh)} selected festival technical/platform/workflow windows contain **{sum(x['automatic_seconds'] for x in fresh)/3600:.2f} h of Codex task intervals** and **{m(sum(x['total_tokens'] for x in fresh))} M tokens including cache** ({m(sum(x['total_tokens']-x['cached_input_tokens'] for x in fresh))} M uncached input + output). Their {sum(x['elapsed_seconds'] for x in fresh)/3600:.2f} h gross clock windows include manual/platform gaps. They do not overlap, but are still only selected incident envelopes, not a causal loss estimate.",'',
'Credits: existing `../credit_ledger.csv` and rejection trackers remain the source for reported charges/refunds. A completed retry is not proof that the preceding job consumed credits; a refund notice is not a verified settled account transaction. No token/credit conversion is applied.','',
'## One aggregate image metric','',
'All 286 completed image jobs returned by the current Higgsfield history identify the model as **`nano_banana_2`**, not Nano Banana Pro. The creator previously used both names/tools; this audit cannot label this sample a Pro benchmark. Twelve actual raw outputs were downloaded and inspected against their **submitted job prompts**, not later edited local prompts. The sample is stratified: two casting sheets, three memories, three worlds, two morph sheets, one restaurant coverage sheet and one typography sheet. Fixed sampling seed 20260912, latest available job per parsed asset key. This deliberately small sample is not population-weighted.',
'', '| Sample/model | Untested candidate text reduction | Main content match | Detail loss | Visible identity-reference match |','| --- | ---: | ---: | ---: | ---: |',f"| 12 images / Nano Banana 2 | ~74% | ~90% | ~40% | ~65% on 6 inspected identity comparisons |",'',
'Core content: 43/48; retained detail: 30/48, hence 37.5% detail loss; identity correspondence: 4/6. Full/partial/absent = 1/0.5/0. Each image has four selected core and four detail criteria. Display percentages round to 5 percentage points, with a half-step rounded upward. Identity checks cover four sampled scene outputs and three bound character sheets; they are a smaller subset, not a score for all input references or internal model use. Whole outputs and selected anchor sheets were reviewed, not every pixel of every image in the library.','',
'Clear failures include **COFFE instead of COFFEE**, a bus cropped and much larger than the requested 15–25% frame width, oversized/missing/wrongly tinted rating cards, a substituted admin colleague, and weak correspondence between specified intermediate letter strokes. The main room/action and broad material endpoints usually survive. A restaurant job still contained `UNBOUND_T01_DETAILS`: that is a prompt/binding workflow defect, not proof of model disobedience. Actual outputs were 2752×1536 or 5504×3072, despite literal 3840×2160/16:9 instructions; this delivery-setting mismatch is logged separately from visual content scoring.','',
'Image prompts total **108,342 characters**. Unexecuted simplification candidates total **28,196 characters (73.98% shorter)** by consolidating repeated layout/material/rating rules, removing irrelevant scene-wide context and keeping the assigned scene, people, stages and reference bindings. These candidates are audit artifacts in `image_evidence.json`; they do not replace production prompts. This is a concrete shortening hypothesis, **not proof that 74% was unnecessary or that the same images would result**. A paid controlled A/B generation would be needed to test equivalence, and none was authorized or run.','',
'## Reproduction and continuation','',
'- `summary.json`: exact scopes, selected source manifest, phase/model totals, incident evidence pointers and unresolved overhead.',
'- `responses.csv`: 15,061 counted response records/cumulative deltas, model, phase, source line and exact token components. No message bodies.',
'- `task_intervals.csv`, `phases.csv`, `days.csv`, `continuous_sessions_30min.csv`, `models.csv`, `repair_windows.csv`: full-precision derived ledgers.',
'- `image_evidence.json`: job IDs, source hashes/dimensions, selected rubric and unexecuted shortened candidates; `sample_prompts/` snapshots the actual submitted prompts. It is supporting evidence, not an additional public image-by-image table.',
'- `tools/`: local extraction/calculation/export scripts. They consume `.codex` logs and the private cache; no paid API call is part of reproduction. Raw session extracts and media remain in `/tmp/myscoutee-production-audit-20260912`, outside the repository. Keep the cutoff fixed when rerunning so the audit does not count itself.',
'- Current finished film/narration remain the source-matched v4 final exports documented in `../../03_film/production/README.md`. This audit changes documentation only.']
(R/'README.md').write_text('\n'.join(lines)+'\n')
print(json.dumps(scopes,indent=2));print('guardians',len(guardians),'reportlines',len(lines),'episodes',len(episodes))
