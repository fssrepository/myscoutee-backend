#!/usr/bin/env python3
"""Loopback-only protocol failure fixture. No credentials or message contents logged."""
import json,time,threading
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
state={'delay':0,'status':200,'redirect':False,'unread':0,'version':'','requests':[],'active':0,'maxActive':0,'trapRequests':0}
lock=threading.Lock()
class Handler(BaseHTTPRequestHandler):
 def log_message(self,*args):pass
 def reply(self,status,body):
  data=json.dumps(body).encode();self.send_response(status);self.send_header('Content-Type','application/json');self.send_header('Content-Length',str(len(data)));self.end_headers()
  try:self.wfile.write(data)
  except (BrokenPipeError,ConnectionResetError):pass
 def do_POST(self):
  if self.path!='/configure':return self.reply(404,{})
  patch=json.loads(self.rfile.read(int(self.headers.get('Content-Length','0'))))
  with lock:
   for key in ('delay','status','redirect','unread','version'):
    if key in patch:state[key]=patch[key]
  self.reply(200,{'configured':True})
 def do_GET(self):
  if self.path=='/state':
   with lock:snapshot=dict(state)
   return self.reply(200,snapshot)
  if self.path=='/credential-trap':
   with lock:state['trapRequests']+=1
   return self.reply(200,{})
  if self.path!='/api/overview':return self.reply(404,{})
  with lock:
   state['active']+=1;state['maxActive']=max(state['active'],state['maxActive']);settings=dict(state)
   state['requests'].append({'at':time.time(),'hasCredential':bool(self.headers.get('Authorization'))})
  try:
   time.sleep(settings['delay'])
   if settings['redirect']:
    self.send_response(302);self.send_header('Location','http://127.0.0.1:18992/credential-trap');self.send_header('Content-Length','0');self.end_headers();return
   self.reply(settings['status'],{'statistics':{'ready':True,'generatedAtIso':'2026-09-23T16:00:00Z','activeProfiles':2,'genders':{'female':1,'male':1},'registrations7Days':0,'registrations30Days':0},'attention':{'unreadMessages':settings['unread'],'unreadVersion':settings['version'],'unresolvedReports':0,'unresolvedFeedback':0,'supportCases':0,'failedJobs':0}})
  finally:
   with lock:state['active']-=1
print('{"ready":true,"port":18992}',flush=True)
ThreadingHTTPServer(('127.0.0.1',18992),Handler).serve_forever()
