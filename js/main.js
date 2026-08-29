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
    const digitalTitle = document.querySelector('.title-line-accent');
    const rainContainer = document.querySelector('.rain-container');
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

    document.body.classList.add('intro-pending');

    let introStarted = false;

    function startIntro() {
        if (introStarted) return;
        introStarted = true;
        document.body.classList.remove('intro-pending');
        document.body.classList.add('intro-ready');
        drawDigitalTitle();
    }

    function hidePreloader() {
        if (!preloader) {
            startIntro();
            return;
        }

        preloader.addEventListener('transitionend', function(event) {
            if (event.target === preloader && event.propertyName === 'opacity') {
                startIntro();
            }
        }, { once: true });

        preloader.classList.add('hidden');
        window.setTimeout(startIntro, 850);
    }

    window.addEventListener('load', function() {
        window.setTimeout(hidePreloader, 2300);
    });

    function drawDigitalTitle() {
        if (!digitalTitle) return;

        const text = digitalTitle.dataset.drawText || digitalTitle.textContent.trim();
        digitalTitle.textContent = '';

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            digitalTitle.textContent = text;
            digitalTitle.classList.add('draw-complete');
            return;
        }

        digitalTitle.classList.add('is-drawing');

        Array.from(text).forEach(function(character, index) {
            const letter = document.createElement('span');
            letter.className = 'draw-letter';
            letter.textContent = character;
            letter.style.setProperty('--letter-index', index);
            digitalTitle.appendChild(letter);
        });

        window.setTimeout(function() {
            digitalTitle.classList.remove('is-drawing');
            digitalTitle.classList.add('draw-complete');
        }, text.length * 150 + 500);
    }

    function createColorRain() {
        if (!rainContainer) return;

        const colors = ['#00d4e0', '#5b8fdd', '#4dd7c8', '#a78bfa', '#f4d186'];
        const dropCount = window.matchMedia('(max-width: 700px)').matches ? 26 : 48;

        for (let index = 0; index < dropCount; index++) {
            const drop = document.createElement('span');
            drop.className = 'rain-drop';
            drop.style.setProperty('--drop-left', (Math.random() * 100).toFixed(2) + '%');
            drop.style.setProperty('--drop-delay', (-Math.random() * 10).toFixed(2) + 's');
            drop.style.setProperty('--drop-duration', (5.5 + Math.random() * 5).toFixed(2) + 's');
            drop.style.setProperty('--drop-color', colors[index % colors.length]);
            drop.style.setProperty('--drop-height', (28 + Math.random() * 72).toFixed(0) + 'px');
            rainContainer.appendChild(drop);
        }
    }

    createColorRain();

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('./service-worker.js', { scope: './' }).catch(function() {
                // The page continues to work normally when opened outside an HTTPS server.
            });
        });
    }

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
