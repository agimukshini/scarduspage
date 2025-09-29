// Modern Intersection Observer for reveal animations
class AnimationController {
    constructor() {
        this.observerOptions = {
            root: null,
            rootMargin: '-10% 0px -10% 0px',
            threshold: [0, 0.1, 0.5]
        };
        
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            this.observerOptions
        );
        
        this.init();
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('reveal-visible');
                    this.observer.unobserve(entry.target);
                }, delay * 100);
            }
        });
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.observeElements());
        } else {
            this.observeElements();
        }
    }
    
    observeElements() {
        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => this.observer.observe(el));
    }
}

// Initialize animation controller
const animationController = new AnimationController();

// Enhanced parallax effect with performance optimization
class ParallaxController {
    constructor() {
        this.heroSection = document.querySelector('.hero');
        this.ticking = false;
        this.init();
    }
    
    updateParallax() {
        if (!this.heroSection) return;
        
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        const opacity = Math.max(0, 1 - scrolled / (window.innerHeight * 0.8));
        
        this.heroSection.style.transform = `translate3d(0, ${rate}px, 0)`;
        this.heroSection.style.opacity = opacity;
        
        this.ticking = false;
    }
    
    requestTick() {
        if (!this.ticking) {
            requestAnimationFrame(() => this.updateParallax());
            this.ticking = true;
        }
    }
    
    init() {
        window.addEventListener('scroll', () => this.requestTick(), { passive: true });
    }
}

// Initialize parallax controller
const parallaxController = new ParallaxController();

// Enhanced counter animation with easing
class CounterAnimation {
    constructor() {
        this.observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };
        
        this.observer = new IntersectionObserver(
            this.handleCounterIntersection.bind(this),
            this.observerOptions
        );
        
        this.init();
    }
    
    easeOutQuart(t) {
        return 1 - (--t) * t * t * t;
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2500;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = this.easeOutQuart(progress);
            const current = Math.floor(target * easedProgress);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
    
    handleCounterIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.animateCounter(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    }
    
    init() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => this.observer.observe(counter));
    }
}

// Initialize counter animation
const counterAnimation = new CounterAnimation();

// Add smooth scroll behavior for better UX
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const headerHeight = document.querySelector('#header')?.offsetHeight || 0;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Initialize smooth scroll
const smoothScroll = new SmoothScroll();

// Add loading animation
class LoadingController {
    constructor() {
        this.init();
    }
    
    init() {
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            
            // Trigger initial animations
            setTimeout(() => {
                const heroElements = document.querySelectorAll('.hero .reveal');
                heroElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('reveal-visible');
                    }, index * 200);
                });
            }, 300);
        });
    }
}

// Initialize loading controller
const loadingController = new LoadingController();

// ==========================
// Hero Neural Network Visual
// ==========================
(function initHeroNetwork() {
    const svg = document.getElementById('heroNetwork');
    if (!svg) return;

    // SVG namespace
    const NS = 'http://www.w3.org/2000/svg';

    // Create groups
    const linksGroup = document.createElementNS(NS, 'g');
    const nodesGroup = document.createElementNS(NS, 'g');
    svg.appendChild(linksGroup);
    svg.appendChild(nodesGroup);

    const width = 1200;
    const height = 600;

    // Generate nodes with clustered positions for a neural-net feel
    const NODE_COUNT = 36;
    // Center clusters more toward the middle of the hero
    const clusters = [
        { cx: width * 0.38, cy: height * 0.42 },
        { cx: width * 0.50, cy: height * 0.50 },
        { cx: width * 0.62, cy: height * 0.42 }
    ];

    const nodes = Array.from({ length: NODE_COUNT }, (_, i) => {
        const c = clusters[i % clusters.length];
        // Reduced jitter to keep nodes near center
        const jitterX = (Math.random() - 0.5) * 120;
        const jitterY = (Math.random() - 0.5) * 100;
        return {
            id: i,
            x: Math.max(width * 0.2, Math.min(width * 0.8, c.cx + jitterX)),
            y: Math.max(height * 0.2, Math.min(height * 0.8, c.cy + jitterY))
        };
    });

    // Create edges by linking each node to a few nearest neighbors
    function distance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    const links = [];
    nodes.forEach((n, idx) => {
        const neighbors = nodes
            .map((m, j) => ({ node: m, j, d: idx === j ? Infinity : distance(n, m) }))
            .sort((a, b) => a.d - b.d)
            .slice(0, 3 + Math.floor(Math.random() * 2));
        neighbors.forEach(nb => {
            if (idx < nb.j) {
                links.push({ a: idx, b: nb.j });
            }
        });
    });

    // Draw links
    const linkEls = links.map(({ a, b }) => {
        const la = nodes[a], lb = nodes[b];
        const line = document.createElementNS(NS, 'line');
        line.setAttribute('x1', la.x);
        line.setAttribute('y1', la.y);
        line.setAttribute('x2', lb.x);
        line.setAttribute('y2', lb.y);
        line.setAttribute('class', 'link');
        linksGroup.appendChild(line);
        return line;
    });

    // Draw nodes
    const nodeEls = nodes.map(n => {
        const c = document.createElementNS(NS, 'circle');
        c.setAttribute('cx', n.x);
        c.setAttribute('cy', n.y);
        c.setAttribute('r', 4);
        c.setAttribute('class', 'node');
        nodesGroup.appendChild(c);
        return c;
    });

    // Animate: highlight paths to simulate signal flow
    function animateSignal() {
        if (!document.body.contains(svg)) return; // safety if navigated away
        // deactivate previous
        linkEls.forEach(l => l.classList.remove('active'));
        nodeEls.forEach(n => n.classList.remove('glow'));

        // pick a random start node and follow 4-6 random hops via nearest links
        let index = Math.floor(Math.random() * nodes.length);
        nodeEls[index].classList.add('glow');
        let hops = 4 + Math.floor(Math.random() * 3);

        for (let h = 0; h < hops; h++) {
            // find candidate links connected to current index
            const candidates = links
                .map((lk, i) => ({ i, lk }))
                .filter(({ lk }) => lk.a === index || lk.b === index);
            if (candidates.length === 0) break;
            const choice = candidates[Math.floor(Math.random() * candidates.length)];
            const nextIndex = choice.lk.a === index ? choice.lk.b : choice.lk.a;

            // activate link and node with slight delay for cascading effect
            setTimeout(() => {
                linkEls[choice.i].classList.add('active');
                nodeEls[nextIndex].classList.add('glow');
            }, h * 120);

            index = nextIndex;
        }

        // schedule next run
        setTimeout(animateSignal, 1600 + Math.random() * 1200);
    }

    // subtle node pulsing
    function pulseNodes() {
        nodeEls.forEach((n, i) => {
            const delay = (i % 7) * 150;
            setTimeout(() => n.classList.toggle('glow'), delay);
        });
        setTimeout(() => {
            nodeEls.forEach(n => n.classList.remove('glow'));
        }, 1200);
        setTimeout(pulseNodes, 5000);
    }

    animateSignal();
    setTimeout(pulseNodes, 2200);
})();

// ======================================
// Global Background Network (site-wide)
// ======================================
(function initGlobalNetwork() {
    const svg = document.getElementById('globalNetwork');
    if (!svg) return;

    const NS = 'http://www.w3.org/2000/svg';

    // container groups
    const linksGroup = document.createElementNS(NS, 'g');
    const nodesGroup = document.createElementNS(NS, 'g');
    svg.appendChild(linksGroup);
    svg.appendChild(nodesGroup);

    function buildNetwork() {
        // cleanup previous
        while (linksGroup.firstChild) linksGroup.removeChild(linksGroup.firstChild);
        while (nodesGroup.firstChild) nodesGroup.removeChild(nodesGroup.firstChild);

        const width = svg.viewBox.baseVal.width || 1200;
        const height = Math.max(document.body.scrollHeight, window.innerHeight);
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

        // Sparser nodes per vertical slice
        const sliceCount = Math.ceil(height / 600);
        const nodesPerSlice = 18; // keep subtle
        const nodes = [];

        for (let s = 0; s < sliceCount; s++) {
            const yStart = s * (height / sliceCount);
            for (let i = 0; i < nodesPerSlice; i++) {
                const x = width * 0.2 + Math.random() * (width * 0.6);
                const y = yStart + Math.random() * (height / sliceCount);
                nodes.push({ id: nodes.length, x, y });
            }
        }

        // connect to nearest neighbors
        function distance(a, b) {
            const dx = a.x - b.x; const dy = a.y - b.y; return Math.hypot(dx, dy);
        }
        const links = [];
        nodes.forEach((n, idx) => {
            const neighbors = nodes
                .map((m, j) => ({ j, d: idx === j ? Infinity : distance(n, m) }))
                .sort((a, b) => a.d - b.d)
                .slice(0, 2 + Math.floor(Math.random() * 2));
            neighbors.forEach(nb => { if (idx < nb.j) links.push({ a: idx, b: nb.j }); });
        });

        const linkEls = links.map(({ a, b }) => {
            const la = nodes[a], lb = nodes[b];
            const line = document.createElementNS(NS, 'line');
            line.setAttribute('x1', la.x);
            line.setAttribute('y1', la.y);
            line.setAttribute('x2', lb.x);
            line.setAttribute('y2', lb.y);
            line.setAttribute('class', 'link');
            linksGroup.appendChild(line);
            return line;
        });

        const nodeEls = nodes.map(n => {
            const c = document.createElementNS(NS, 'circle');
            c.setAttribute('cx', n.x);
            c.setAttribute('cy', n.y);
            c.setAttribute('r', 3);
            c.setAttribute('class', 'node');
            nodesGroup.appendChild(c);
            return c;
        });

        // soft cascading activation
        function animateSignal() {
            if (!document.body.contains(svg)) return;
            linkEls.forEach(l => l.classList.remove('active'));
            let i = Math.floor(Math.random() * linkEls.length);
            for (let h = 0; h < 10; h++) {
                setTimeout(() => linkEls[(i + h) % linkEls.length].classList.add('active'), h * 100);
            }
            setTimeout(animateSignal, 2400 + Math.random() * 1200);
        }

        animateSignal();
    }

    // build once and on resize/route height changes
    buildNetwork();
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(buildNetwork, 250);
    }, { passive: true });
})();
// =============================
// Additional Hero Tech Animations
// - Circuit board traces (pulsing paths)
// - Processor chips (subtle glow)
// - AI brain waves (oscillating lines)
// =============================
(function initHeroTechLayers() {
    const svg = document.getElementById('heroNetwork');
    if (!svg) return;
    const NS = 'http://www.w3.org/2000/svg';

    // Layers
    const tracesLayer = document.createElementNS(NS, 'g');
    const chipsLayer = document.createElementNS(NS, 'g');
    const brainLayer = document.createElementNS(NS, 'g');
    tracesLayer.setAttribute('class', 'traces');
    chipsLayer.setAttribute('class', 'chips');
    brainLayer.setAttribute('class', 'brain');
    // Insert behind nodes: append before last child
    svg.insertBefore(tracesLayer, svg.firstChild);
    svg.appendChild(brainLayer);
    svg.appendChild(chipsLayer);

    const width = 1200;
    const height = 600;

    // Helper to create a smooth path between points
    function pathFrom(points) {
        if (points.length < 2) return '';
        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            const p = points[i];
            d += ` L ${p.x} ${p.y}`;
        }
        return d;
    }

    // Generate circuit traces
    const TRACE_COUNT = 10;
    const traceEls = [];
    for (let i = 0; i < TRACE_COUNT; i++) {
        // Centralize traces within a middle band
        const yBase = height * 0.3 + Math.random() * (height * 0.4);
        const segments = 6 + Math.floor(Math.random() * 4);
        const pts = [];
        let x = width * 0.28 + Math.random() * (width * 0.12); // start near center-left
        let y = yBase;
        pts.push({ x, y });
        for (let s = 0; s < segments; s++) {
            // horizontal segment
            x += 80 + Math.random() * 90; // shorter runs to keep within center band
            if (x > width * 0.78) x = width * 0.78; // cap near center-right
            pts.push({ x, y });
            // small jog
            y += (Math.random() - 0.5) * 30;
            y = Math.max(height * 0.28, Math.min(height * 0.72, y));
            pts.push({ x, y });
        }
        const path = document.createElementNS(NS, 'path');
        path.setAttribute('d', pathFrom(pts));
        path.setAttribute('class', 'trace');
        tracesLayer.appendChild(path);
        traceEls.push(path);
    }

    // Animate traces with dash offset
    function animateTraces() {
        traceEls.forEach((p, idx) => {
            // Compute path length
            const len = p.getTotalLength();
            p.style.strokeDasharray = len;
            p.style.strokeDashoffset = len;
            const delay = (idx % 5) * 300 + Math.random() * 400;
            setTimeout(() => {
                p.classList.add('trace-active');
                p.style.transition = 'stroke-dashoffset 2.2s ease-out';
                p.style.strokeDashoffset = '0';
                // reset after a while
                setTimeout(() => {
                    p.classList.remove('trace-active');
                    p.style.transition = 'none';
                    p.style.strokeDashoffset = len;
                }, 2800 + Math.random() * 1200);
            }, delay);
        });
        setTimeout(animateTraces, 4500);
    }

    // Draw a few processor chips
    const CHIP_COUNT = 4;
    for (let i = 0; i < CHIP_COUNT; i++) {
        const cx = 160 + i * 240 + (Math.random() * 40 - 20);
        const cy = 140 + ((i % 2) * 180) + (Math.random() * 30 - 15);
        const chip = document.createElementNS(NS, 'rect');
        const size = 36;
        chip.setAttribute('x', cx - size / 2);
        chip.setAttribute('y', cy - size / 2);
        chip.setAttribute('rx', 6);
        chip.setAttribute('ry', 6);
        chip.setAttribute('width', size);
        chip.setAttribute('height', size);
        chip.setAttribute('class', 'chip');
        chipsLayer.appendChild(chip);
        // pins
        for (let p = -3; p <= 3; p++) {
            const pinTop = document.createElementNS(NS, 'rect');
            pinTop.setAttribute('x', cx - 2 + p * 5);
            pinTop.setAttribute('y', cy - size / 2 - 6);
            pinTop.setAttribute('width', 2);
            pinTop.setAttribute('height', 6);
            pinTop.setAttribute('class', 'pin');
            chipsLayer.appendChild(pinTop);

            const pinBottom = document.createElementNS(NS, 'rect');
            pinBottom.setAttribute('x', cx - 2 + p * 5);
            pinBottom.setAttribute('y', cy + size / 2);
            pinBottom.setAttribute('width', 2);
            pinBottom.setAttribute('height', 6);
            pinBottom.setAttribute('class', 'pin');
            chipsLayer.appendChild(pinBottom);
        }
    }

    // AI brain waves: oscillating paths in the top-right quadrant
    const waves = [];
    const waveCount = 3;
    for (let i = 0; i < waveCount; i++) {
        const path = document.createElementNS(NS, 'path');
        path.setAttribute('class', 'brain-wave');
        brainLayer.appendChild(path);
        waves.push({ path, amp: 10 + i * 5, speed: 0.002 + i * 0.0008, phase: Math.random() * Math.PI * 2 });
    }

    function drawWaves(t) {
        const baseX = width * 0.48; // move waves closer to center
        const baseY = height * 0.22;
        const w = 360; // slightly narrower
        waves.forEach((wobj, idx) => {
            const pts = [];
            for (let x = 0; x <= w; x += 12) {
                const y = baseY + Math.sin((x * 0.02) + t * wobj.speed + wobj.phase) * wobj.amp;
                pts.push({ x: baseX + x, y });
            }
            wobj.path.setAttribute('d', pathFrom(pts));
        });
        requestAnimationFrame((ts) => drawWaves(ts));
    }

    // Kick off animations
    animateTraces();
    requestAnimationFrame((ts) => drawWaves(ts));
})();