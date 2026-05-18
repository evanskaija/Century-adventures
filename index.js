// Century Adventures - Premium Safari Interactivity
document.addEventListener('DOMContentLoaded', () => {
    console.log('Century Adventures experience initialized!');
    
    // Theme Switcher Logic
    const initTheme = () => {
        const savedTheme = localStorage.getItem('century-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeToggle(savedTheme);
    };

    const updateThemeToggle = (theme) => {
        const themeBtn = document.querySelector('.theme-toggle');
        if (themeBtn) {
            const icon = themeBtn.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    };

    window.toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('century-theme', newTheme);
        updateThemeToggle(newTheme);
    };

    // Language Switcher Logic
    const initLang = () => {
        const savedLang = localStorage.getItem('century-lang') || 'en';
        applyLang(savedLang);
    };

    window.toggleLang = () => {
        const currentLang = localStorage.getItem('century-lang') || 'en';
        const newLang = currentLang === 'en' ? 'sw' : 'en';
        applyLang(newLang);
    };

    const applyLang = (lang) => {
        localStorage.setItem('century-lang', lang);
        const elements = document.querySelectorAll('[data-en]');
        elements.forEach(el => {
            const translation = el.getAttribute(`data-${lang}`);
            if (translation) {
                el.textContent = translation;
            }
        });
        
        const langBtn = document.querySelector('.lang-toggle');
        if (langBtn) {
            langBtn.textContent = lang === 'en' ? 'SW' : 'EN';
        }
        console.log(`Language applied: ${lang}`);
    };

    initTheme();
    initLang();

    // Header scroll effect
    const header = document.querySelector('.header');
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', () => {
        // Scrolled header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll progress bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + "%";
    });

    // Mobile Menu Toggle
    const nav = document.querySelector('.nav');
    const headerContent = document.querySelector('.header-content');
    const mobileToggle = document.createElement('div');
    mobileToggle.className = 'mobile-toggle';
    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    if (headerContent) {
        headerContent.insertBefore(mobileToggle, document.querySelector('.header-actions'));
    }

    mobileToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        mobileToggle.innerHTML = nav.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Dropdown interactivity for mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Auto-scroll logic for horizontal grids
    const setupAutoScroll = (selector, step) => {
        const grid = document.querySelector(selector);
        if (grid) {
            let scrollAmount = 0;
            setInterval(() => {
                const maxScroll = grid.scrollWidth - grid.clientWidth;
                if (scrollAmount >= maxScroll - 10) {
                    scrollAmount = 0;
                } else {
                    scrollAmount += step;
                }
                grid.scrollTo({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }, 5000); // Move every 5 seconds
        }
    };

    // setupAutoScroll('.safaris-grid', 380); // Disabled for CSS marquee
    setupAutoScroll('.experiences-grid', 530);
});
