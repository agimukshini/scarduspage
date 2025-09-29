import os
import time
from flask import Flask, render_template, send_from_directory, abort, request
from werkzeug.middleware.proxy_fix import ProxyFix
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_talisman import Talisman

# App factory
app = Flask(__name__, static_folder='static', template_folder='templates')

# Trust proxy headers if behind a reverse proxy
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)

# Rate limiting (IP-based)
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per hour", "60 per minute"],
    storage_uri=os.environ.get("RATELIMIT_STORAGE_URI", "memory://"),
)

# Security headers via Talisman
csp = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'"],  # keep simple; tighten if needed
    'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    'img-src': ["'self'", 'data:'],
    'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'],
    'connect-src': ["'self'"],
}
Talisman(
    app,
    content_security_policy=csp,
    content_security_policy_nonce_in=['script-src'],
    frame_options='DENY',
    force_https=False,  # Disable HTTPS enforcement for HTTP mode
    strict_transport_security=False,  # Disable HSTS for HTTP mode
    referrer_policy='no-referrer',
    session_cookie_secure=False,  # Allow non-secure cookies for HTTP
    session_cookie_http_only=True,
    session_cookie_samesite='Lax'
)

# Uniform response timing to reduce enumeration signals
UNIFORM_DELAY_SEC = float(os.environ.get('UNIFORM_DELAY_SEC', '0.12'))

def _uniform_delay():
    if UNIFORM_DELAY_SEC > 0:
        time.sleep(UNIFORM_DELAY_SEC)

@app.after_request
def remove_server_header(response):
    # Minimize information leakage
    if 'Server' in response.headers:
        del response.headers['Server']
    return response

@app.route('/')
@limiter.exempt  # Homepage should be accessible
def home():
    # Render static homepage template; no dependency on Indexnew.html
    return render_template('index.html')

# Example of a denied resource to demonstrate 403 handling
@app.route('/admin')
def no_admin():
    _uniform_delay()
    abort(403)

# Serve static files (logo, css)
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory(app.static_folder, filename)

# Back-compat: serve logo from project root as /static/logo.png
@app.route('/static/logo.png')
def static_logo():
    return send_from_directory(app.root_path, 'ScardusLogo.png')

# Liveness/readiness probe
@app.route('/health')
@limiter.exempt
def health():
    _uniform_delay()
    return {"status": "ok"}, 200

# Error handlers with consistent messaging
@app.errorhandler(403)
def handle_403(e):
    _uniform_delay()
    return render_template('403.html'), 403

@app.errorhandler(404)
def handle_404(e):
    _uniform_delay()
    # Same tone as 403 to avoid revealing existence of resources
    return render_template('403.html'), 404

@app.errorhandler(429)
def handle_429(e):
    _uniform_delay()
    return render_template('403.html'), 429

if __name__ == '__main__':
    port = int(os.environ.get('PORT', '8000'))
    app.run(host='0.0.0.0', port=port)
