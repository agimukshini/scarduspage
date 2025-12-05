#!/usr/bin/env python3
"""
Simple HTTP server for SCARDUS TECH website
Serves only whitelisted files for security
"""

import http.server
import socketserver
import os
from pathlib import Path

# Configuration
PORT = 8000
HOST = '0.0.0.0'

# Whitelisted files and directories that can be served
ALLOWED_FILES = {
    'index.html',
    '403.html',
    'assets/css/styles.css',
    'assets/js/main.js',
    'assets/js/animations.js',
    'assets/images/logo/ScardusLogo.png',
    'assets/images/team/AgimUkshini.jpg',
    'assets/images/team/AvniAdemi.jpg',
    'assets/images/team/AdiMcMeti.jpg',
    'assets/images/team/adnanhaliti.jpg',
    'assets/images/projects/project1.jpg',
    'assets/images/projects/project2.jpg',
    'assets/images/projects/project3.jpg'
}

# Restricted paths that return 403
RESTRICTED_PATHS = {
    '/admin', '/admin/',
    '/private', '/private/',
    '/restricted', '/restricted/'
}


class SecureHandler(http.server.SimpleHTTPRequestHandler):
    """Secure handler with file whitelist and custom error pages"""
    
    def log_message(self, format, *args):
        """Override to provide cleaner log messages"""
        print(f"[{self.log_date_time_string()}] {format % args}")
    
    def do_GET(self):
        """Handle GET requests with security checks"""
        # Check for restricted paths
        if self.path in RESTRICTED_PATHS:
            self.send_error(403)
            return
        
        # Normalize path
        if self.path == '/':
            self.path = '/index.html'
        
        # Extract filename from path
        filename = self.path.lstrip('/')
        
        # Security check: only allow whitelisted files
        if filename not in ALLOWED_FILES and not any(filename.startswith(f'{prefix}/') for prefix in ['assets/css', 'assets/js', 'assets/images']):
            self.send_error(404)
            return
        
        # Serve the file
        try:
            super().do_GET()
        except Exception as e:
            print(f"Error serving file: {e}")
            self.send_error(500)
    
    def send_error(self, code, message=None, explain=None):
        """Serve custom error page for 403 and 404 errors"""
        if code in [403, 404]:
            try:
                error_file = Path('403.html')
                if error_file.exists():
                    self.send_response(code)
                    self.send_header('Content-type', 'text/html; charset=utf-8')
                    self.send_header('Content-Length', error_file.stat().st_size)
                    self.end_headers()
                    self.wfile.write(error_file.read_bytes())
                    return
            except Exception as e:
                print(f"Error serving custom error page: {e}")
        
        # Fall back to default error handling
        super().send_error(code, message, explain)


def main():
    """Start the secure web server"""
    # Change to the directory containing the files
    server_dir = Path(__file__).parent
    os.chdir(server_dir)
    
    # Verify required files exist
    if not Path('index.html').exists():
        print("❌ Error: index.html not found!")
        return
    
    try:
        # Create server with address reuse enabled
        socketserver.TCPServer.allow_reuse_address = True
        
        with socketserver.TCPServer((HOST, PORT), SecureHandler) as httpd:
            print("=" * 50)
            print("🚀 SCARDUS TECH Web Server")
            print("=" * 50)
            print(f"📁 Directory: {server_dir}")
            print(f"🔒 Security: Whitelist mode enabled")
            print(f"📄 Serving: {len(ALLOWED_FILES)} files")
            print(f"🌐 URL: http://localhost:{PORT}")
            print(f"\n💡 Press Ctrl+C to stop the server")
            print("=" * 50)
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped gracefully")
    except OSError as e:
        if e.errno == 98 or 'address already in use' in str(e).lower():
            print(f"❌ Error: Port {PORT} is already in use")
            print(f"   Try stopping the existing server or use a different port")
        else:
            print(f"❌ Error: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")


if __name__ == "__main__":
    main()
