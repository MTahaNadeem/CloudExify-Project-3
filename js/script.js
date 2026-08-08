'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const navbarCollapse = document.getElementById('navbarNav');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: false
                });
                bsCollapse.hide();
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });



    // ── Appointment Modal Form Validation ──
    // Set minimum date to today
    const dateInput = document.getElementById('apptDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    document.getElementById('appointmentForm')?.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('patientName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const location = document.getElementById('location').value;
        const date = document.getElementById('apptDate').value;
        const service = document.getElementById('serviceType').value;

        const phoneOK = /^[0-9+\-\s]{7,15}$/.test(phone);
        const errorDiv = document.getElementById('formError');
        const successDiv = document.getElementById('formSuccess');

        if (!name || !phoneOK || !location || !date || !service) {
            errorDiv.classList.remove('d-none');
            successDiv.classList.add('d-none');
            if (!phoneOK && phone) errorDiv.textContent = 'Please enter a valid phone number (7-15 digits).';
            else errorDiv.textContent = 'Please fill in all required fields correctly.';
            return;
        }

        errorDiv.classList.add('d-none');
        successDiv.classList.remove('d-none');
        this.reset();

        // Close modal after 3 seconds
        setTimeout(() => {
            const modal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
            if (modal) modal.hide();
            successDiv.classList.add('d-none');
        }, 3000);
    });

    // ── Scroll to Top Button ──
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollTopBtn?.classList.add('visible');
        } else {
            scrollTopBtn?.classList.remove('visible');
        }
    });
    scrollTopBtn?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ── Active Nav Link on Scroll ──
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, { threshold: 0.4 });
    sections.forEach(section => navObserver.observe(section));
});

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
