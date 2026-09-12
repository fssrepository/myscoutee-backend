import json,pathlib,re,hashlib
from PIL import Image
P=pathlib.Path('/tmp/myscoutee-production-audit-20260912'); a=json.load(open(P/'image_sample.json'))
# Explicit selected criteria: score 1 visible, .5 partial, 0 absent/replaced. No motion inference from stills.
reviews=[
('Front/back/headshot layout|Single consistent identity|Restrained professional casting|Specified suit and studio',[1,1,1,1],'Full bodies and shoes|Natural age texture|Unadorned neutral backdrop|No drawn panel dividers',[1,1,1,1],'Three consistent lawyer views; no evident major content failure.'),
('Front/back/headshot layout|Single consistent identity|Ordinary office appearance|Neutral studio',[1,1,1,1],'Full bodies and shoes|Natural skin|Wardrobe consistency|No drawn panel dividers',[1,1,1,0],'Correct casting sheet; thin black vertical separator lines contradict the borderless request.'),
('Exactly six people|One shared table|Conversational interaction|Direct card-free memory',[1,1,1,1],'Six distinct positions|Natural hand positions|Furniture floor support|Depth and rear room',[1,1,.5,1],'Six separate people and useful conversational geometry; some support is naturally cropped/occluded.'),
('File retrieval|Two separate records|Protagonist on call|Specified three-person cast',[1,1,1,.5],'Drawer and hanging files|Distinct supported hands|Unreadable labels|Visible storage runners',[1,1,1,.5],'Action follows the brief. Admin A differs conspicuously from the bound C23 identity; protagonist and B are closer.'),
('Cairo taxi setting|One falling bag plus one supported bag|Practical human reaction|Specified protagonist identity',[1,1,1,0],'Rack origin|Strap path|Road and body support|Ordinary rather than exaggerated reaction',[1,1,1,.5],'Bag/rack incident is clear. Protagonist follows the dark-haired companion-scene figure more than the primary C01 identity.'),
('Red double-decker and separate black cab|London source street|No Hungarian destination|Requested complete transport composition',[1,1,1,0],'Bus at 15–25% frame width|Complete bus roof/decks/wheels|Every pedestrian has own card|Fractional score tints',[0,0,.5,0],'Bus fills roughly half the frame and is cropped. Many people lack cards; 6.2 is pink instead of yellow-green.'),
('Ordinary glass door|Real handle and wet threshold|City reflection|No clinical reveal',[1,1,1,1],'Handle fixings|Oblique jamb/paving depth|Open reflection intervals|Warm-neutral interior depth',[1,1,.5,0],'Solid threshold and handle read well; city reflection dominates and warm interior depth is weak.'),
('Quiet London street|Pest ornate block|Cultural ground-floor frontage|15–25 spaced pedestrians',[1,1,1,.5],'Grounded architectural depth|Owner-linked cards|Compact card dimensions|Score-specific tints',[1,1,.5,0],'Main street assignment reads; cards are repetitive and pale nearly white instead of consistently score-tinted.'),
('Four separate coverage views|Same restaurant encounter|Woman seated/man by restroom doors|Small spontaneous smile',[1,1,1,.5],'Cup contact detail|Two-door room structure|Consistent man|No nested panels or city cards',[1,1,1,1],'Useful four-view coverage. Subtle smile is weak. Submitted text still includes UNBOUND_T01_DETAILS, an input-setup defect, not a proven model failure.'),
('Westminster source|Hungarian Parliament destination|Two distinct unfinished states|Solid architectural volumes',[1,1,1,1],'Traceable specified wear marks|Stable camera and ground|All pedestrians/cards stable|No umbrellas',[0,.5,.5,0],'Large-scale endpoints/states succeed; specified per-stone correspondence cannot be traced. Small umbrellas and inconsistent card ownership remain.'),
('Rectangular brick source|Carved pale arch target|Two distinct intermediates|Solid opening and support',[1,1,1,1],'Consistent oblique angle|Chipped brick continuity|Compact score-card dimensions|No visible grid separator',[.5,1,0,0],'Brick chip is recognisable and arch has volume; viewpoint is nearly frontal, cards oversized, black grid lines visible.'),
('Exact six-letter COFFEE source|Exact KÁVÉ target|Four substantially distinct states|Raised solid lettering',[0,1,.5,1],'Specified stroke-to-stroke mapping|Tracked wear marks|Connected intermediate accents|Two visible metal board fixings',[0,0,.5,0],'Source reads COFFE, missing an O. First intermediate largely retains a word; target spelling is correct but detailed stroke mapping is not established.')]
common='Photographic reference image. Keep natural anatomy, solid material depth, contact shadows and useful spatial focus. No printed IDs, labels, captions or invented extra panels. '
records=[]
for x,r in zip(a,reviews):
 p=x['prompt']; refs=re.findall(r'<<<[^>]+>>>[^\n]*|@UNBOUND_[^\n]*',p)
 if x['group']=='character':
  body=p.split('CHARACTER:',1)[1].split('VIEW-S',1)[0]
  short='One 16:9 4K identity sheet: three equal edge-to-edge vertical photographs, full-body front, full-body back, frontal headshot. Same exact person and clothing. Mid-grey seamless studio, soft even light, full shoes in the body views. No gutters, rating cards, umbrellas or accessories beyond the specified wardrobe.\n\n'+body.strip()
 elif x['group']=='memory':
  body=p.split('ASSIGNED COMPOSITION',1)[1].split('FINAL CHECK:',1)[0]
  short='One 2K 16:9 uninterrupted direct memory scene, without city overlays, rating cards or umbrellas. '+common+'Retain the bound people, room and wardrobe; use references for identity/space, never copy their sheet layout. Show furniture support, a near corner and a rear plane.\n\n'+'\n'.join(refs)+'\n\nASSIGNED COMPOSITION'+body.strip()
 elif x['group']=='world':
  body=p.split('ASSIGNED COMPOSITION',1)[1]
  short='One 2K 16:9 full-frame photographic London/Pest world reference; use only the assigned state and viewpoint below. '+common+'Damp paving after rain, clear air, restrained practical light. For views containing current people, every person has one compact landscape card above their bare crown: 0.8 head-width by 0.35 head-height, quarter-head gap. Dark decimal digits on pale fractional-score tints; 6.2 yellow-green, 9.2 mint. Others vary; keep owner/value stable. Protagonist stays neutral/unreadable before Block 06. No umbrellas. Do not add people/cards to the expressly person-free detail.\n\nASSIGNED COMPOSITION'+body.strip()
 elif x['asset'].startswith('T01'):
  body=p.split('ONE ESTABLISHED ROOM AND ENCOUNTER:',1)[1].split('FINAL CHECK:',1)[0]
  short='One 4K 16:9 photographic 2×2 sheet, four equal edge-to-edge complete coverage views. '+common+'Same people, wardrobe and room throughout, no cards or umbrellas. The missing T01 room binding must be resolved before any future generation.\n\n'+'\n'.join(refs)+'\n\nONE ESTABLISHED ROOM AND ENCOUNTER:\n'+body
 else:
  # Keep source-specific material text and the exact four assigned configurations; remove repeated generic sections.
  sections=re.split(r'\n(?=[A-Z][A-Z0-9 /—×():,–-]{8,}:\n|At (?:top|bottom) )',p)
  keep=[]
  for s in sections:
   h=s.split('\n',1)[0]
   if re.match(r'(SUBJECT|TYPE AND MATERIAL|At (top|bottom)|TOP LEFT|TOP RIGHT|BOTTOM LEFT|BOTTOM RIGHT|PANEL [1-4]|CELL [1-4])',h):keep.append(s)
  if not keep:keep=[p[:3000]]
  short='One 4K 16:9 photographic 2×2 sheet: source, first unfinished material state, different second unfinished state, finished destination. Four equal edge-to-edge cells, no separator lines. Same comparison viewpoint, light and ground anchor. '+common+'Track source material into the destination through thick side faces, joints and wear marks; middle shapes must differ. No opacity fades or flat replacements. For city views preserve each pedestrian and compact decimal card (6.2 yellow-green, 9.2 mint); no umbrellas. Person-free lettering detail stays person-free.\n\n'+'\n\n'.join(keep)
 rec={'asset':x['asset'],'job_id':x['job'],'model':'nano_banana_2','stratum':x['group'],'created_at':x['createdAt'],'source_prompt_sha256':hashlib.sha256(p.encode()).hexdigest(),'source_prompt_chars':len(p),'shortened_candidate_chars':len(short),'shortened_candidate':short,'source_image_sha256':hashlib.sha256((P/'images'/f"{x['asset']}.png").read_bytes()).hexdigest(),'dimensions':Image.open(P/'images'/f"{x['asset']}.png").size,'core':list(zip(r[0].split('|'),r[1])),'detail':list(zip(r[2].split('|'),r[3])),'observation':r[4]}
 records.append(rec)
ref=[('MW06_B_04','C01',1),('MW03_C_03','C01',1),('MW03_C_03','C23',0),('MW03_C_03','C24',1),('MW02_A_04','C01',0),('T01_SOHO_RESTAURANT_SOURCE_B','C01',1)]
summary={'sample_size':len(records),'population_completed_image_jobs':286,'model':'nano_banana_2','sampling':'Fixed seed 20260912; latest job per parsed asset key; 2 character, 3 memory, 3 world, 3 material/source, 1 typography. Material/source yielded 2 morph sheets and 1 restaurant coverage sheet. Not population-weighted.','original_chars':sum(x['source_prompt_chars'] for x in records),'candidate_chars':sum(x['shortened_candidate_chars'] for x in records),'core_score':sum(sum(v for k,v in x['core']) for x in records),'core_denominator':48,'detail_score':sum(sum(v for k,v in x['detail']) for x in records),'detail_denominator':48,'reference_score':sum(x[2] for x in ref),'reference_denominator':len(ref),'reference_checks':ref,'warning':'Retrospective untested simplification candidates, not evidence of equivalent generation. Selected rubric, one reviewer, no inferential population confidence interval. Resolution mismatch is recorded separately, not attributed to model instruction-following.'}
summary['reduction_percent']=100*(1-summary['candidate_chars']/summary['original_chars'])
json.dump({'summary':summary,'evidence':records},open(P/'image_assessment.json','w'),indent=2,ensure_ascii=False)
print(json.dumps(summary,indent=2))
for x in records:print(x['asset'],x['source_prompt_chars'],x['shortened_candidate_chars'])
