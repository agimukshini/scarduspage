#!/usr/bin/env python3
"""
Ultra-simple HTTP server for SCARDUS TECH website
Only serves index.html and 403.html - nothing else
"""

import http.server
import socketserver
import os
from pathlib import Path

# Configuration
PORT = 8000
HOST = '0.0.0.0'

class SimpleHandler(http.server.SimpleHTTPRequestHandler):
    """Ultra-simple handler that only serves index.html and 403.html"""
    
    def do_GET(self):
        """Handle GET requests"""
        # Handle 403 errors for restricted paths
        if self.path in ['/admin', '/admin/', '/private', '/private/', '/restricted', '/restricted/']:
            self.send_error(403)
            return
        
        # Serve index.html for root path
        if self.path == '/' or self.path == '/index.html':
            self.path = '/index.html'
        
        # Serve 403.html for 403 errors
        if self.path == '/403.html':
            self.path = '/403.html'
        
        # Block everything else except allowed files
        allowed_files = ['index.html', '403.html', 'ScardusLogo.png', 'AgimUkshini.jpg', 'AvniAdemi.jpg', 'project1.jpg', 'project2.jpg', 'project3.jpg']
        
        if self.path.startswith('/'):
            filename = self.path[1:]  # Remove leading slash
            if filename not in allowed_files:
                self.send_error(404)
                return
        
        # Call parent method to serve the file
        super().do_GET()
    
    def send_error(self, code, message=None, explain=None):
        """Override to serve custom 403 page for both 403 and 404 errors"""
        if code in [403, 404]:
            try:
                self.send_response(code)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                with open('403.html', 'rb') as f:
                    self.wfile.write(f.read())
                return
            except:
                pass
        
        # Fall back to default error handling
        super().send_error(code, message, explain)

def main():
    """Start the ultra-simple server"""
    # Change to the directory containing the files
    os.chdir(Path(__file__).parent)
    
    try:
        with socketserver.TCPServer((HOST, PORT), SimpleHandler) as httpd:
            print(f"🚀 SCARDUS TECH Simple Server")
            print(f"📁 Serving: index.html, 403.html, and images only")
            print(f"🌐 Server: http://localhost:{PORT}")
            print(f"📄 Main page: http://localhost:{PORT}/")
            print(f"❌ 403 test: http://localhost:{PORT}/admin")
            print(f"\n💡 Press Ctrl+C to stop")
            print("-" * 50)
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print(f"\n🛑 Server stopped")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
