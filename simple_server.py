#!/usr/bin/env python3
"""
Simple HTTP server for SCARDUS TECH website
Serves HTML, CSS, JS, and images without any complex Flask setup
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

# Configuration
PORT = 8000
HOST = '0.0.0.0'

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler to serve files with proper MIME types and error pages"""
    
    def end_headers(self):
        # Add CORS headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def guess_type(self, path):
        """Override to set correct MIME types"""
        mimetype, encoding = super().guess_type(path)
        
        # Ensure proper MIME types for common files
        if path.endswith('.css'):
            return 'text/css'
        elif path.endswith('.js'):
            return 'application/javascript'
        elif path.endswith('.svg'):
            return 'image/svg+xml'
        elif path.endswith('.avif'):
            return 'image/avif'
        
        return mimetype
    
    def send_error(self, code, message=None, explain=None):
        """Override to serve custom error pages"""
        try:
            # Try to serve custom error page
            if code == 403 and os.path.exists('403.html'):
                self.send_response(403)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                with open('403.html', 'rb') as f:
                    self.wfile.write(f.read())
                return
            elif code == 404 and os.path.exists('404.html'):
                self.send_response(404)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                with open('404.html', 'rb') as f:
                    self.wfile.write(f.read())
                return
        except:
            pass
        
        # Fall back to default error handling
        super().send_error(code, message, explain)
    
    def do_GET(self):
        """Override GET to handle special routes and restrictions"""
        # Handle special routes
        if self.path == '/admin' or self.path == '/admin/':
            # Simulate 403 for admin access
            self.send_error(403, "Access Denied")
            return
        elif self.path == '/private' or self.path.startswith('/private/'):
            # Simulate 403 for private resources
            self.send_error(403, "Access Denied")
            return
        elif self.path == '/restricted' or self.path.startswith('/restricted/'):
            # Simulate 403 for restricted resources
            self.send_error(403, "Access Denied")
            return
        
        # Default behavior for all other requests
        super().do_GET()

def main():
    """Start the simple HTTP server"""
    # Change to the directory containing the HTML file
    os.chdir(Path(__file__).parent)
    
    # Create handler
    handler = CustomHTTPRequestHandler
    
    try:
        # Start server
        with socketserver.TCPServer((HOST, PORT), handler) as httpd:
            print(f"🚀 SCARDUS TECH Server starting...")
            print(f"📁 Serving files from: {os.getcwd()}")
            print(f"🌐 Server running at: http://localhost:{PORT}")
            print(f"🌐 Network access: http://{HOST}:{PORT}")
            print(f"📄 Main page: http://localhost:{PORT}/index.html")
            print(f"\n💡 Press Ctrl+C to stop the server")
            print("-" * 50)
            
            # Try to open browser automatically
            try:
                webbrowser.open(f'http://localhost:{PORT}/index.html')
                print("🔗 Browser opened automatically")
            except:
                print("⚠️  Could not open browser automatically")
            
            # Start serving
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print(f"\n\n🛑 Server stopped by user")
    except OSError as e:
        if e.errno == 98:  # Address already in use
            print(f"❌ Port {PORT} is already in use. Try a different port or stop the existing server.")
        else:
            print(f"❌ Error starting server: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    main()
