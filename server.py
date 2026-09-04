#!/usr/bin/env python3
"""
CanIUse.ai - Zero-Dependency Local Dev Server
Serves static files with correct MIME types and no-cache headers.
"""
import http.server
import socketserver
import os
import sys

PORT = int(os.environ.get("PORT", 8081))
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"\n⚡ [CanIUse.ai] Serving at http://localhost:{PORT}")
        print(f"📁 Root directory: {DIRECTORY}\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nExiting...")
            sys.exit(0)
