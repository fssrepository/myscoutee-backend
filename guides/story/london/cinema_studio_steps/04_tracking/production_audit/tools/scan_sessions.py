from pathlib import Path
import json,re,collections,time
base=Path('/home/raxim/.codex');out=Path('/tmp/myscoutee-production-audit-20260912');(out/'sessions').mkdir(exist_ok=True)
files=sorted(set(base.glob('sessions/**/*.jsonl'))|set(base.glob('archived_sessions/**/*.jsonl')))
pat=re.compile(r'cinema_studio_steps|guides/story|higgsfield|seedance|nano.?banana|canonical.prompt|prompt.pack|konyv|könyv|amazon|kindle|epub|manuscript|two.volume|the.city.between.us|london.*film',re.I)
index=[];start=time.time()
def clean(t):
 if '## My request:' in t:return t.rsplit('## My request:',1)[1].strip()
 if '# My request:' in t:return t.rsplit('# My request:',1)[1].strip()
 return t.strip()
for fi,p in enumerate(files):
 target=out/'sessions'/(p.stem+'.json')
 if target.exists():
  r=json.loads(target.read_text());index.append(r['summary']);continue
 events=[];meta={};bad=0;hits=[];types=collections.Counter();seen=set()
 for n,line in enumerate(p.open(),1):
  try:r=json.loads(line)
  except (ValueError,UnicodeError):bad+=1;continue
  ty=r.get('type');q=r.get('payload',{});ts=r.get('timestamp');types[ty]+=1
  if ty=='session_meta' and not meta:
   meta={k:q.get(k) for k in ['id','session_id','timestamp','cwd','source','thread_source','originator']}
  elif ty=='event_msg':
   qt=q.get('type')
   if qt in ['task_started','task_complete','turn_aborted']:
    events.append({'line':n,'ts':ts,'kind':qt,**{k:q[k] for k in ['turn_id','started_at','completed_at','duration_ms'] if k in q}})
   elif qt=='token_count' and q.get('info'):
    events.append({'line':n,'ts':ts,'kind':'token_count','total':q['info'].get('total_token_usage'),'last':q['info'].get('last_token_usage')})
  elif ty=='token_usage_record':
   events.append({'line':n,'ts':ts,'kind':'usage',**{k:q.get(k) for k in ['thread_id','turn_id','root_turn_id','response_id','usage']}})
  elif ty=='turn_context':
   events.append({'line':n,'ts':ts,'kind':'context',**{k:q.get(k) for k in ['turn_id','model','cwd','effort']}})
  elif ty=='response_item' and q.get('type')=='message' and q.get('role') in ['user','assistant']:
   raw='\n'.join(c.get('text','') for c in q.get('content',[]) if c.get('type') in ['input_text','output_text','text']);t=clean(raw)
   if not t or t.startswith(('<environment_context>','<recommended_plugins>','# AGENTS.md','<permissions instructions>','<turn_aborted>','<collaboration_mode>')):continue
   if q.get('role')=='assistant' and q.get('channel') not in [None,'final','commentary']:continue
   ident=(ts,q.get('role'),t)
   if ident in seen:continue
   seen.add(ident)
   e={'line':n,'ts':ts,'kind':q['role'],'channel':q.get('channel'),'text':t,'topic_hit':bool(pat.search(t)),'context_hit':bool(pat.search(raw))};events.append(e)
   if e['topic_hit']:hits.append({'ts':ts,'role':q['role'],'text':t[:220]})
  elif ty=='response_item' and q.get('type') in ['function_call','function_call_output','custom_tool_call','custom_tool_call_output']:
   # Keep tool identities and concise diagnostic text, not image bytes or full returned documents.
   k=q.get('type');v=q.get('arguments',q.get('input',q.get('output','')))
   if not isinstance(v,str):v=json.dumps(v)
   events.append({'line':n,'ts':ts,'kind':k,'name':q.get('name'),'call_id':q.get('call_id'),'text':v[:1000]})
 summary={'file':str(p),'extract':str(target),'bytes':p.stat().st_size,'meta':meta,'types':dict(types),'topic_hits':len(hits),'hit_examples':hits[:7],'events':len(events),'first':events[0]['ts'] if events else None,'last':events[-1]['ts'] if events else None,'bad_records':bad}
 target.write_text(json.dumps({'summary':summary,'events':events},ensure_ascii=False));index.append(summary)
 if fi%40==0:print('scanned',fi+1,'/',len(files),'elapsed',round(time.time()-start),flush=True)
(out/'session_index.json').write_text(json.dumps(index,ensure_ascii=False,indent=2));print('DONE',len(index),'elapsed',round(time.time()-start))
