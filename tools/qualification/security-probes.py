#!/usr/bin/env python3
"""Bounded external QA probes. No credentials, raw bodies, destructive actions or scans outside the supplied VM.
Separate from deployment smoke. Negative Registry POSTs contain only {} and no signature.
"""
import argparse, datetime, hashlib, json, socket, ssl, urllib.request, urllib.error
from pathlib import Path
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--app',required=True);p.add_argument('--app-ca',required=True)
p.add_argument('--registry',required=True);p.add_argument('--registry-ca',required=True)
p.add_argument('--vm',required=True);p.add_argument('--output',required=True,type=Path)
a=p.parse_args()
if a.output.exists():p.error('Use a new output file')
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self,*args,**kwargs):return None
results=[]
def probe(id,base,ca,path,allowed,method='GET',headers=None,exposure=False):
    ctx=ssl.create_default_context(cafile=ca)
    opener=urllib.request.build_opener(NoRedirect,urllib.request.HTTPSHandler(context=ctx))
    req=urllib.request.Request(base.rstrip('/')+path,method=method,headers=headers or {},data=b'{}' if method=='POST' else None)
    row={'id':id,'target':base,'path':path,'method':method}
    try:
        try:r=opener.open(req,timeout=8)
        except urllib.error.HTTPError as e:r=e
        with r:
            body=r.read(262145)
            row.update(httpStatus=r.status,bytes=len(body),bodySha256=hashlib.sha256(body).hexdigest(),
                       hsts=bool(r.headers.get('Strict-Transport-Security')),nosniff=r.headers.get('X-Content-Type-Options')=='nosniff')
            if exposure:
                shell=b'<app-root' in body or b'<app-' in body and b'<!doctype html' in body.lower()
                row['status']='PASS' if r.status in (401,403,404) or r.status==200 and shell else 'REVIEW'
                row['scope']='No sensitive file returned; SPA shell200 is not file disclosure'
            else:row['status']='PASS' if r.status in allowed else 'FAIL'
    except Exception as e:row.update(status='ERROR',error=type(e).__name__)
    results.append(row)
for path in ('/api/operator/configuration','/api/operator/configuration/tls','/api/operator/updates'):
    probe('APP-ANON-'+path.rsplit('/',1)[-1],a.app,a.app_ca,path,(401,403))
probe('APP-INVALID-TOKEN',a.app,a.app_ca,'/api/operator/configuration',(401,403),headers={'Authorization':'OperatorBootstrap qualification-invalid'})
for path in ('/.env','/.git/config','/actuator/env','/actuator/heapdump','/api/actuator/env','/api/actuator/heapdump'):
    probe('APP-EXPOSURE-'+path,a.app,a.app_ca,path,(401,403,404),exposure=True)
for path in ('/v1/mau/batches','/v1/revenue/batches','/v1/deployments/register'):
    probe('REG-UNSIGNED-'+path,a.registry,a.registry_ca,path,(400,401,403),method='POST',headers={'Content-Type':'application/json'})
probe('REG-CANONICAL-PATH',a.registry,a.registry_ca,'/v1/deployments/%72egister',(400,),method='POST',headers={'Content-Type':'application/json'})
for path in ('/.env','/.git/config','/debug/pprof/','/metrics'):
    probe('REG-EXPOSURE-'+path,a.registry,a.registry_ca,path,(401,403,404))
ports=[]
for port in (22,80,443,6379,8080,9000,18082,18444,27017):
    try:
        with socket.create_connection((a.vm,port),timeout=1): opened=True
    except OSError: opened=False
    ports.append({'port':port,'reachableFromHost':opened})
a.output.write_text(json.dumps({'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),
    'vantage':'Workstation outside guest; app through localhost tunnel, Registry direct VM. Not public Internet.',
    'results':results,'ports':ports,'notCovered':['authenticated cross-account access','session lifecycle','upload authorization','signed Registry replay','dependency CVEs','public Internet perimeter']},indent=2)+'\n')
print(json.dumps({'output':str(a.output),'counts':{k:sum(r['status']==k for r in results) for k in ('PASS','FAIL','REVIEW','ERROR')}}))
