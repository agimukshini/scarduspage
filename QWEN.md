# SCARDUS TECH Website - Project Context

## Project Overview

SCARDUS TECH is a professional IT services company website featuring a futuristic, tech-forward design with advanced animations and interactive elements. The site showcases services for government, defense, and regulated enterprises with a focus on cybersecurity, infrastructure, and custom software development.

The project consists of a single-page application built with HTML, CSS, JavaScript, and a lightweight Python server. It features cutting-edge visual effects including neural network animations, matrix digital rain, and glassmorphism design elements.

## Architecture & Technologies

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS with custom CSS animations
- **Backend**: Python HTTP server (using http.server module)
- **Deployment**: Docker containerization with docker-compose
- **Design**: Futuristic tech aesthetic with glassmorphism, gradients, and interactive animations

## Key Features

### Visual Design
- **Neural Network Animation**: Interactive particle system responding to mouse movement
- **Matrix Digital Rain**: Animated background effect in the hero section
- **Glassmorphism**: Modern translucent UI elements with blur effects
- **Gradient Text**: Animated cyan-to-purple gradients
- **Geometric Accents**: Corner bracket decorations throughout
- **Scan Line Effect**: Animated line for "active system" feel
- **Smooth Reveal Animations**: Staggered content entrance

### Functional Components
- **Responsive Navigation**: Mobile-friendly hamburger menu
- **Project Modals**: Detailed project showcase with interactive cards
- **Smooth Scrolling**: Anchor links with smooth transitions
- **Security Layer**: Whitelist-based file serving in Python server

## File Structure

```
scarduspage/
├── index.html           # Main website page with all sections
├── 403.html            # Custom error page
├── server.py           # Secure Python HTTP server
├── Dockerfile          # Containerization configuration
├── docker-compose.yml  # Multi-container orchestration
├── assets/
│   ├── css/
│   │   └── styles.css  # Custom animations and styling
│   ├── js/
│   │   ├── main.js     # Core functionality (modals, navigation)
│   │   └── animations.js # Neural network and matrix effects
│   └── images/
│       ├── logo/       # Company logo
│       ├── projects/   # Project showcase images
│       └── team/       # Team member photos
├── *.md                # Documentation files
```

## Building and Running

### Local Development
```bash
# Method 1: Using Python server
python server.py
# Visit http://localhost:8000

# Method 2: Using Docker
docker build -t scardus-site .
docker run -p 8000:8000 scardus-site

# Method 3: Using Docker Compose
docker-compose up -d
# Site available at http://localhost:8080
# Nginx Proxy Manager admin at http://localhost:81
```

### Server Configuration
The Python server implements security through:
- File whitelist system (only specific files can be accessed)
- Restricted path blocking (admin, private, restricted paths)
- Custom error pages (403, 404)
- Address reuse for easier restarts

## Development Conventions

### Code Organization
- HTML follows semantic structure with proper accessibility attributes
- CSS uses utility-first Tailwind approach with custom animations
- JavaScript is organized by functionality sections with clear comments
- Python server uses secure file serving with whitelist validation

### Design Principles
- Maintain professional appearance suitable for government/defense clients
- Use consistent color palette (cyan primary, purple accents, dark backgrounds)
- Implement smooth animations that enhance rather than distract
- Ensure responsive design works across all device sizes
- Follow accessibility best practices (contrast, semantic HTML)

### Security Practices
- Server-side file access control through whitelisting
- Input validation and sanitization
- Secure headers and response handling
- Restricted path access prevention

## Special Features

### Cultural Elements
- Golden eagle animation representing Albanian heritage
- Named after Sharr Mountains (SCARDUS) for local connection
- Balances cultural pride with technological excellence

### Technical Showcase
- Interactive neural network visualization
- Real-time particle physics simulation
- Advanced CSS animations and transitions
- Performance-optimized canvas rendering

## Maintenance Notes

### Updating Content
- Project details are stored in JavaScript objects in main.js
- Team information is hardcoded in HTML but can be abstracted if needed
- Service offerings are in HTML but could be moved to data files

### Extending Functionality
- New CSS animations should follow GPU-accelerated patterns
- Additional security measures can be added to the Python server
- New sections should follow existing HTML structure and CSS classes

### Performance Considerations
- All animations use transform and opacity for GPU acceleration
- Canvas animations are optimized for 60 FPS
- Images should be optimized for web delivery
- JavaScript event listeners are properly attached/detached

## Deployment Strategy

The project supports multiple deployment methods:
- Standalone Python server for development
- Docker container for consistent environments
- Docker Compose with Nginx Proxy Manager for production-ready setup
- Cloud deployment ready with proper security configurations