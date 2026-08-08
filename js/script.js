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

    // ── Stats Counter (Signature Feature) ──
    function animateCounter(el) {
        const target = +el.dataset.target;
        let count = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
            count += step;
            el.textContent = Math.min(count, target);
            if (count >= target) {
                el.textContent = target;
                clearInterval(timer);
            }
        }, 30);
    }
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-number').forEach(el => statsObserver.observe(el));
});

// ── Appointment Modal Form Validation ──
// Set minimum date to today
document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('apptDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }
});

document.getElementById('appointmentForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const name = document.getElementById('patientName').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const date = document.getElementById('apptDate').value;
  const time = document.getElementById('apptTime').value;
  const service = document.getElementById('serviceType').value;
  
  const phoneOK = /^[0-9+\-\s]{7,15}$/.test(phone);
  const emailOK = /.+@.+\..+/.test(email);
  const errorDiv = document.getElementById('formError');
  const successDiv = document.getElementById('formSuccess');
  
  if (!name || !phoneOK || !emailOK || !date || !time || !service) {
    errorDiv.classList.remove('d-none');
    successDiv.classList.add('d-none');
    if (!phoneOK && phone) errorDiv.textContent = 'Please enter a valid phone number (7-15 digits).';
    else if (!emailOK && email) errorDiv.textContent = 'Please enter a valid email address.';
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
