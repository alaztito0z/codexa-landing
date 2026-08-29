document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.getElementById('preloader');
    const preloaderStatus = document.getElementById('preloaderStatus');
    const header = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('backToTop');
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const serviceRows = document.querySelectorAll('.service-row');
    const aboutContent = document.querySelector('.about-content');
    const aboutVisual = document.querySelector('.about-visual');
    const contactHeader = document.querySelector('.contact-header');
    const contactFormElement = document.querySelector('.contact-form');
    const counters = document.querySelectorAll('.stat-value');
    const logoFrame = document.querySelector('.about-logo-frame');
    let countersAnimated = false;

    const statusMessages = ['INITIALIZING', 'LOADING MODULES', 'CONNECTING SYSTEMS', 'READY'];
    let statusIndex = 0;

    const statusInterval = setInterval(function() {
        statusIndex++;
        if (statusIndex < statusMessages.length) {
            preloaderStatus.textContent = statusMessages[statusIndex];
        } else {
            clearInterval(statusInterval);
        }
    }, 550);

    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.classList.add('hidden');
        }, 2300);
    });

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        const activeSection = getActiveSection();
        navLinks.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + activeSection) {
                link.classList.add('active');
            }
        });

        if (!countersAnimated && window.scrollY > 500) {
            animateCounters();
            countersAnimated = true;
        }
    });

    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    serviceRows.forEach(function(row, index) {
        row.style.transitionDelay = (index * 0.08) + 's';
        observer.observe(row);
    });

    observer.observe(aboutContent);
    observer.observe(aboutVisual);
    observer.observe(contactHeader);
    observer.observe(contactFormElement);

    if (logoFrame) {
        const logoObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    logoFrame.classList.add('animate');
                    logoObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        });

        logoObserver.observe(logoFrame);
    }

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const servicio = document.getElementById('servicio').value;
        const mensaje = document.getElementById('mensaje').value;

        if (nombre && email && servicio && mensaje) {
            formSuccess.classList.add('show');
            contactForm.reset();

            setTimeout(function() {
                formSuccess.classList.remove('show');
            }, 5000);
        }
    });

    function getActiveSection() {
        const sections = ['inicio', 'servicios', 'nosotros', 'contacto'];
        let current = 'inicio';

        sections.forEach(function(sectionId) {
            const section = document.getElementById(sectionId);
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 120 && rect.bottom >= 120) {
                    current = sectionId;
                }
            }
        });

        return current;
    }

    function animateCounters() {
        counters.forEach(function(counter) {
            const target = parseInt(counter.getAttribute('data-counter'));
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.floor(eased * target);

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    serviceRows.forEach(function(row) {
        row.addEventListener('mouseenter', function() {
            const tag = row.querySelector('.service-tag');
            if (tag) {
                tag.style.background = 'rgba(0, 212, 224, 0.15)';
                tag.style.color = 'var(--cyan)';
            }
        });

        row.addEventListener('mouseleave', function() {
            const tag = row.querySelector('.service-tag');
            if (tag) {
                tag.style.background = '';
                tag.style.color = '';
            }
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    const formFields = document.querySelectorAll('.form-field input, .form-field select, .form-field textarea');
    formFields.forEach(function(field) {
        field.addEventListener('focus', function() {
            const border = this.parentElement.querySelector('.field-border');
            if (border) {
                border.style.width = '100%';
            }
        });

        field.addEventListener('blur', function() {
            if (!this.value) {
                const border = this.parentElement.querySelector('.field-border');
                if (border) {
                    border.style.width = '0';
                }
            }
        });
    });
});