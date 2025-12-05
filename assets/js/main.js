// ============================================
// Mobile Menu Toggle
// ============================================
document.getElementById('mobile-menu-btn').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        const menu = document.getElementById('mobile-menu');
        menu.classList.add('hidden');
    });
});

// ============================================
// Smooth Scrolling for Anchor Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// Project Modal
// ============================================
const projectData = {
    'project1': {
        title: 'Military Installation Network Modernization',
        category: 'DoD Infrastructure',
        description: 'Complete infrastructure overhaul for forward operating base in harsh contingency environment. Delivered secure communications, network segmentation, and 24/7 monitoring with zero mission impact during transition.',
        stats: ['Zero downtime during cutover', '99.99% uptime achieved', 'Secure multi-level network architecture', '24/7 on-site support team'],
        tech: ['Network Security', 'Infrastructure Design', 'Cisco Systems', 'Monitoring & Alerting', 'Contingency Operations']
    },
    'project2': {
        title: 'CMMC Level 2 Certification Program',
        category: 'Compliance & Security',
        description: 'End-to-end NIST SP 800-171 implementation and CMMC Level 2 certification for defense contractor. Conducted comprehensive gap analysis, implemented 110 security controls, and achieved certification on first audit.',
        stats: ['CMMC Level 2 certified', '110 controls implemented', 'First-time audit pass', 'Zero findings during assessment'],
        tech: ['NIST SP 800-171', 'CMMC Level 2', 'Security Controls', 'Compliance Documentation', 'Vulnerability Management']
    },
    'project3': {
        title: 'Secure Hybrid Cloud Infrastructure',
        category: 'Cloud Migration',
        description: 'Migration of classified and unclassified systems to AWS GovCloud with zero downtime. Implemented defense-in-depth security architecture, automated disaster recovery, and continuous compliance monitoring.',
        stats: ['Zero downtime migration', 'FedRAMP compliance achieved', 'Automated DR with 15-min RTO', 'Multi-region redundancy'],
        tech: ['AWS GovCloud', 'Hybrid Cloud', 'Terraform IaC', 'Security Automation', 'Disaster Recovery']
    }
};

function openModal(projectId) {
    const modal = document.getElementById('project-modal');
    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-content');
    
    const project = projectData[projectId];
    if (project) {
        title.textContent = project.title;
        content.innerHTML = `
            <span class="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm mb-4 inline-block">${project.category}</span>
            <p class="text-light-gray mb-6">${project.description}</p>
            <h4 class="font-semibold mb-3">Key Results:</h4>
            <ul class="text-light-gray mb-6 space-y-1">
                ${project.stats.map(stat => `<li>• ${stat}</li>`).join('')}
            </ul>
            <h4 class="font-semibold mb-3">Technologies:</h4>
            <div class="flex flex-wrap gap-2">
                ${project.tech.map(tech => `<span class="bg-dark px-3 py-1 rounded text-sm">${tech}</span>`).join('')}
            </div>
        `;
        modal.classList.remove('hidden');
    }
}

function closeModal() {
    document.getElementById('project-modal').classList.add('hidden');
}

// Close modal on outside click
document.getElementById('project-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});
