#!/usr/bin/env python3
"""SendGrid-compatible QA receiver. Does not forward mail or retain Authorization headers."""
import argparse
import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from uuid import uuid4

parser = argparse.ArgumentParser()
parser.add_argument('--host', default='127.0.0.1')
parser.add_argument('--port', type=int, default=18991)
parser.add_argument('--output', type=Path, required=True)
parser.add_argument('--status', type=int, default=202)
args = parser.parse_args()
args.output.parent.mkdir(parents=True, exist_ok=True)
class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path != '/v3/mail/send':
            self.send_error(404); return
        length = int(self.headers.get('Content-Length', '0'))
        if length < 1 or length > 1048576:
            self.send_error(413); return
        try:
            body = json.loads(self.rfile.read(length))
            assert body['from']['email'] and body['personalizations'][0]['to'][0]['email'] and body['content']
        except (ValueError, KeyError, IndexError, AssertionError):
            self.send_error(400); return
        message_id = 'qa-' + str(uuid4())
        # No key, cookie or authorization header is written to evidence.
        with args.output.open('a', encoding='utf-8') as output:
            output.write(json.dumps({'messageId': message_id, 'status': args.status, 'payload': body}) + '\n')
        args.output.chmod(0o600)
        self.send_response(args.status); self.send_header('X-Message-Id', message_id); self.send_header('Content-Length', '0'); self.end_headers()
    def log_message(self, *_):
        pass
print(json.dumps({'ready': True, 'host': args.host, 'port': args.port}), flush=True)
ThreadingHTTPServer((args.host, args.port), Handler).serve_forever()
