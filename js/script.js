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

    // ── Animated Stats Counter ──
    // Uses IntersectionObserver; triggers count-up animation once on first view.
    const statsSection = document.getElementById('stats');
    let statsAnimated = false;

    /**
     * Animates all .stat-number[data-target] elements from 0 to their target
     * value over ~1200 ms using an ease-out cubic curve.
     */
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        const duration = 1200; // ms

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const startTime = performance.now();

            function step(timestamp) {
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-out cubic: decelerates toward the end
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.round(eased * target);

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    counter.textContent = target; // ensure exact final value
                }
            }

            requestAnimationFrame(step);
        });
    }

    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    statsAnimated = true;
                    animateCounters();
                    statsObserver.unobserve(statsSection);
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statsSection);
    }

    // ── Before & After Comparison Slider ──
    // Pure vanilla JS — no external library.
    // The .cs-after-wrapper width clips the after image; the after image itself
    // is always as wide as the full slider container so it renders correctly.
    const compSlider  = document.getElementById('comparisonSlider');
    const csHandle    = document.getElementById('csHandle');
    const csAfterWrap = document.getElementById('csAfterWrapper');
    const csAfterImg  = document.getElementById('csAfterImg');

    if (compSlider && csHandle && csAfterWrap && csAfterImg) {
        let isDragging = false;

        /** Sync the after-image pixel width to match the full slider width. */
        function syncAfterImgWidth() {
            csAfterImg.style.width = compSlider.offsetWidth + 'px';
        }

        /**
         * Positions the slider divider at a given clientX coordinate.
         * Clamps result between 2% and 98% to always show a sliver of each side.
         * @param {number} clientX
         */
        function setSliderPosition(clientX) {
            const rect = compSlider.getBoundingClientRect();
            let pct = ((clientX - rect.left) / rect.width) * 100;
            pct = Math.max(2, Math.min(98, pct));

            csAfterWrap.style.width = pct + '%';
            csHandle.style.left     = pct + '%';
            syncAfterImgWidth();                    // keep after-img full-width
            csHandle.setAttribute('aria-valuenow', Math.round(pct));
        }

        // Initialise after-image width and default 50% position
        syncAfterImgWidth();

        // ── Pointer Events (covers mouse, touch, and stylus with a single API) ──
        // setPointerCapture routes all events to compSlider even when the pointer
        // moves outside the element, so no window-level listeners are needed.
        compSlider.addEventListener('pointerdown', (e) => {
            isDragging = true;
            compSlider.setPointerCapture(e.pointerId);
            setSliderPosition(e.clientX);
            e.preventDefault(); // prevent text selection / scroll-hijack
        });

        compSlider.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
            setSliderPosition(e.clientX);
        });

        compSlider.addEventListener('pointerup',     () => { isDragging = false; });
        compSlider.addEventListener('pointercancel', () => { isDragging = false; });

        // ── Keyboard accessibility (arrow keys move handle by 5%) ──
        csHandle.addEventListener('keydown', (e) => {
            const currentPct = parseFloat(csHandle.style.left) || 50;
            const rect = compSlider.getBoundingClientRect();
            if (e.key === 'ArrowLeft') {
                setSliderPosition(rect.left + ((currentPct - 5) / 100) * rect.width);
                e.preventDefault();
            } else if (e.key === 'ArrowRight') {
                setSliderPosition(rect.left + ((currentPct + 5) / 100) * rect.width);
                e.preventDefault();
            }
        });

        // ── Re-sync after-image width on window resize ──
        window.addEventListener('resize', syncAfterImgWidth);
    }

});

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
