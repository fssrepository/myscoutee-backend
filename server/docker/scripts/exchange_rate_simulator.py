#!/usr/bin/env python3
"""Development-only ECB-compatible observations. No external requests, no real market data."""
from datetime import date, timedelta
from http.server import BaseHTTPRequestHandler, HTTPServer
import os

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path != '/eurofxref.xml':
            self.send_error(404)
            return
        rates = {'HUF': '400', 'USD': '1.10', 'GBP': '0.85', 'CZK': '25', 'PLN': '4.25', 'CHF': '0.95'}
        days = []
        for offset in range(90):
            day = date.today() - timedelta(days=offset)
            if day.weekday() >= 5:
                continue
            values = ''.join(f'<Cube currency="{currency}" rate="{rate}"/>' for currency, rate in rates.items())
            days.append(f'<Cube time="{day.isoformat()}">{values}</Cube>')
        body = ('<?xml version="1.0"?><Envelope><Cube>' + ''.join(days) + '</Cube></Envelope>').encode()
        self.send_response(200)
        self.send_header('Content-Type', 'application/xml')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

HTTPServer(('0.0.0.0', int(os.getenv('PORT', '18083'))), Handler).serve_forever()
