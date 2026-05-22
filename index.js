// Century Adventures - Premium Safari Interactivity

// ── Global: Mobile Menu Toggle (called via onclick from HTML) ──
function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    const toggle = document.querySelector('.mobile-toggle');
    const overlay = document.querySelector('.nav-overlay');

    if (!nav || !toggle) return;

    const isOpen = nav.classList.contains('active');

    if (isOpen) {
        // Close menu
        nav.classList.remove('active');
        toggle.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    } else {
        // Open menu
        nav.classList.add('active');
        toggle.classList.add('open');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

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
            // Update button label text
            themeBtn.innerHTML = `<i class="${theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}"></i> ${theme === 'dark' ? 'LIGHT' : 'DARK'}`;
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
    const translationDict = {
        // Common terms
        "Tanzania Travel Tips": "Maujanja ya Kusafiri",
        "Tanzania Safari": "Safari ya Tanzania",
        "Tours & Safaris": "Safari na Ziara",
        "Destinations": "Maeneo",
        "About Us": "Kuhusu Sisi",
        "Contact Us": "Wasiliana Nasi",
        "Home": "Nyumbani",
        "Safari Vehicles": "Magari ya Safari",
        "Volunteer": "Kujitolea",
        "Experiences": "Uzoefu",
        "Gallery": "Picha za Safari",
        "Itinerary": "Ratiba ya Safari",
        "Rates Per Person": "Gharama kwa Mtu",
        "From": "Kuanzia",
        "Included": "Vilivyojumuishwa",
        "Excluded": "Visivyojumuishwa",
        "BOOK YOUR SAFARI": "WEKA NAFASI YA SAFARI",
        "BOOK YOUR MIGRATION SAFARI": "WEKA NAFASI YA SAFARI",
        "GET IN TOUCH TODAY!": "WASILIANA NASI LEO!",
        "ENQUIRE": "ULIZA",
        "VIEW TRIP": "ANGALIA SAFARI",
        
        // Inclusions
        "Park fees": "Kiingilio cha Hifadhi",
        "All activities": "Shughuli zote",
        "All accommodation": "Malazi yote",
        "A professional driver/guide": "Dereva/Mwongozo wa kitaalamu",
        "All transportation": "Usafiri wote",
        "All flights during the tour": "Ndege zote wakati wa safari",
        "All Taxes/VAT": "Kodi zote/VAT",
        "Roundtrip airport transfer": "Usafiri wa kwenda na kurudi uwanja wa ndege",
        "Meals": "Chakula",
        "Water on Safari": "Maji ya kunywa kwenye Safari",
        
        // Exclusions
        "International flights": "Ndege za kimataifa",
        "Additional accommodation before and at the end of the tour": "Malazi ya ziada kabla na baada ya safari",
        "Tips": "Bakshishi (Tips)",
        "Personal items": "Vitu binafsi",
        "Government imposed increase of taxes and/or park fees": "Ongezeko la kodi za serikali na/au viingilio vya mbuga",
        "Drinks": "Vinywaji",
        
        // Day patterns
        "Day 1:": "Siku ya 1:",
        "Day 2:": "Siku ya 2:",
        "Day 3:": "Siku ya 3:",
        "Day 4:": "Siku ya 4:",
        "Day 5:": "Siku ya 5:",
        "Day 6:": "Siku ya 6:",
        "Day 7:": "Siku ya 7:",
        "Day 8:": "Siku ya 8:",
        "Day 9:": "Siku ya 9:",
        "Day 10:": "Siku ya 10:",
        "Day 11:": "Siku ya 11:",
        "Day 12:": "Siku ya 12:",
        "Day 13:": "Siku ya 13:",
        
        "Day 1": "Siku ya 1",
        "Day 2": "Siku ya 2",
        "Day 3": "Siku ya 3",
        "Day 4": "Siku ya 4",
        "Day 5": "Siku ya 5",
        "Day 6": "Siku ya 6",
        "Day 7": "Siku ya 7",
        "Day 8": "Siku ya 8",
        "Day 9": "Siku ya 9",
        "Day 10": "Siku ya 10",
        "Day 11": "Siku ya 11",
        "Day 12": "Siku ya 12",
        "Day 13": "Siku ya 13",
        
        "Day 3-4:": "Siku ya 3-4:",
        "Day 5-6:": "Siku ya 5-6:",
        "Day 7-8:": "Siku ya 7-8:",
        "Day 9-10:": "Siku ya 9-10:",
        "Day 11-12:": "Siku ya 11-12:",
        
        // Destinations
        "Arrival in Arusha": "Kuwasili Arusha",
        "Tarangire National park": "Hifadhi ya Taifa ya Tarangire",
        "Serengeti National park": "Hifadhi ya Taifa ya Serengeti",
        "Ngorongoro crater": "Kikundi cha Ngorongoro",
        "Lake Manyara-Arusha": "Ziwa Manyara-Arusha",
        "Manyara National Park": "Hifadhi ya Manyara",
        "Ruaha National Park": "Hifadhi ya Ruaha",
        "Mikumi National Park": "Hifadhi ya Mikumi",
        "Katavi National Park": "Hifadhi ya Katavi",
        "Gombe Stream National Park": "Hifadhi ya Gombe Stream",
        "Selous Game Reserve": "Pori la Akiba la Selous",
        
        // Itinerary page content phrases (e.g. 6 Day Northern Highlights)
        "Come and experience an unforgettable tour with our exceptional service! Discover the wonders of Northern Tanzania as you visit four renowned wildlife destinations where the African “Big Five” roam. Immerse yourself in the beauty of Manyara, Serengeti, Ngorongoro Crater, and Tarangire, where you will encounter a plethora of wildlife including majestic lions, magnificent elephants, elusive leopards, agile cheetahs, powerful buffaloes, and much more. Don’t miss out on this incredible opportunity to witness swamps, plains, and an abundance of wildlife.": "Kuja na uzoefu wa safari isiyosahaulika na huduma yetu ya kipekee! Gundua maajabu ya Kaskazini mwa Tanzania unapotembelea maeneo manne maarufu ya wanyamapori ambapo \"Tano Kubwa\" za Afrika wanazurura. Jitumbukize katika uzuri wa Manyara, Serengeti, Ngorongoro, na Tarangire, ambapo utakutana na wanyamapori wengi wakiwemo simba, tembo, chui, duma, nyati, na mengi zaidi.",
        
        "Upon arrival in Arusha, you will be transferred to the Arusha Planet Lodge. Enjoy a relaxing evening with dinner and settle in for your first night in Tanzania.": "Baada ya kuwasili Arusha, utapelekwa kwenye Arusha Planet Lodge. Furahia jioni ya utulivu na chakula cha jioni na upumzike kwa usiku wako wa kwanza nchini Tanzania.",
        
        "After breakfast, embark on a road transfer to Tarangire National Park. Enjoy a guided game drive to spot a variety of wildlife in their natural habitat. Later, transfer to Motto Cottages for dinner and overnight stay.": "Baada ya kifungua kinywa, anza safari ya kwenda Hifadhi ya Taifa ya Tarangire. Furahia mchezo wa kuongozwa ili kuona wanyamapori mbalimbali. Baadaye, nenda kwenye Motto Cottages kwa chakula cha jioni na kulala."
    };

    const translateTextNode = (node, lang) => {
        if (node.nodeType === Node.TEXT_NODE) {
            const trimmed = node.textContent.trim();
            if (!trimmed) return;
            
            // Store original text if not already stored
            if (node._originalText === undefined) {
                node._originalText = node.textContent;
            }
            
            if (lang === 'sw') {
                if (translationDict[trimmed]) {
                    node.textContent = node.textContent.replace(trimmed, translationDict[trimmed]);
                } else {
                    let translated = trimmed;
                    let modified = false;
                    for (const [enKey, swVal] of Object.entries(translationDict)) {
                        if (translated.includes(enKey)) {
                            translated = translated.split(enKey).join(swVal);
                            modified = true;
                        }
                    }
                    if (modified) {
                        node.textContent = translated;
                    }
                }
            } else {
                // Restore original English text
                node.textContent = node._originalText;
            }
        } else {
            // Skip script, style tags, and elements that already have data-en
            if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE' && !node.hasAttribute('data-en')) {
                node.childNodes.forEach(child => translateTextNode(child, lang));
            }
        }
    };

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
        document.documentElement.lang = lang === 'sw' ? 'sw' : 'en';

        // Translate explicit data-en elements
        const elements = document.querySelectorAll('[data-en]');
        elements.forEach(el => {
            const translation = el.getAttribute(`data-${lang}`);
            if (translation) {
                if (el.children.length > 0) {
                    // Try to preserve icons (typically <i> or <span>) by replacing only text nodes
                    let textNode = Array.from(el.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);
                    if (textNode) {
                        textNode.textContent = translation;
                    } else {
                        el.innerHTML = translation;
                    }
                } else {
                    el.textContent = translation;
                }
            }
        });

        // Translate other page text dynamically using the dictionary
        translateTextNode(document.body, lang);

        // Update lang toggle button label
        const langBtn = document.querySelectorAll('.lang-toggle');
        langBtn.forEach(btn => {
            btn.textContent = lang === 'en' ? 'SWAHILI' : 'ENGLISH';
        });
        
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

    // ── Mobile Menu Toggle ──
    const nav = document.querySelector('.nav');
    const mobileToggle = document.querySelector('.mobile-toggle');

    // Create dark overlay backdrop
    const navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    document.body.appendChild(navOverlay);

    function openMenu() {
        if (!nav || !mobileToggle) return;
        nav.classList.add('active');
        mobileToggle.classList.add('open');
        navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        if (!nav || !mobileToggle) return;
        nav.classList.remove('active');
        mobileToggle.classList.remove('open');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Hamburger click — stop propagation so document handler doesn't fire immediately
    if (mobileToggle) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            nav.classList.contains('active') ? closeMenu() : openMenu();
        });
    }

    // Click dark overlay to close
    navOverlay.addEventListener('click', () => closeMenu());

    // Click anywhere outside nav to close
    document.addEventListener('click', (e) => {
        if (nav && nav.classList.contains('active')) {
            if (!nav.contains(e.target) && mobileToggle && !mobileToggle.contains(e.target)) {
                closeMenu();
            }
        }
    });

    // Dropdown accordion for mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        if (link) {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });

    // ── Intersection Observer for ALL scroll animations──
    const observerOptions = {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe .animate-in elements (existing)
    document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));

    // Observe scroll-reveal elements
    document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale').forEach(el => observer.observe(el));

    // ── Auto-apply scroll-reveal to key sections ──
    // Section headings animate in
    document.querySelectorAll('.section h2, .section .sub-heading, .section .section-desc').forEach(el => {
        el.classList.add('scroll-reveal');
        observer.observe(el);
    });

    // Why Us items stagger
    document.querySelectorAll('.why-us-item').forEach((el, i) => {
        el.classList.add('scroll-reveal');
        el.style.transitionDelay = `${i * 0.1}s`;
        observer.observe(el);
    });

    // Destination cards
    document.querySelectorAll('.destination-card').forEach((el, i) => {
        el.classList.add('scroll-reveal');
        el.style.transitionDelay = `${i * 0.12}s`;
        observer.observe(el);
    });

    // Tip cards
    document.querySelectorAll('.tip-card').forEach((el, i) => {
        el.classList.add('scroll-reveal');
        el.style.transitionDelay = `${i * 0.1}s`;
        observer.observe(el);
    });

    // Feature cards
    document.querySelectorAll('.feature-card').forEach((el, i) => {
        el.classList.add('scroll-reveal');
        el.style.transitionDelay = `${i * 0.1}s`;
        observer.observe(el);
    });

    // Testimonials
    document.querySelectorAll('.testimonial-card').forEach((el, i) => {
        el.classList.add('scroll-reveal');
        el.style.transitionDelay = `${i * 0.12}s`;
        observer.observe(el);
    });

    // About section
    const aboutImg = document.querySelector('.about-image');
    if (aboutImg) { aboutImg.classList.add('scroll-reveal-left'); observer.observe(aboutImg); }
    const aboutText = document.querySelector('.about-text');
    if (aboutText) { aboutText.classList.add('scroll-reveal-right'); observer.observe(aboutText); }

    // Contact items
    document.querySelectorAll('.contact-item-box').forEach((el, i) => {
        el.classList.add('scroll-reveal');
        el.style.transitionDelay = `${i * 0.1}s`;
        observer.observe(el);
    });

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

    // Marquee Arrow Navigation
    const marqueeContainers = document.querySelectorAll('.marquee-container');
    marqueeContainers.forEach(container => {
        const leftArrow = container.querySelector('.marquee-arrow-left');
        const rightArrow = container.querySelector('.marquee-arrow-right');
        const track = container.querySelector('.marquee-track');

        if (!leftArrow || !rightArrow || !track) return;

        const cardWidth = 380; // card width + gap
        let resumeTimer = null;
        let isAnimating = false;

        const getComputedTranslateX = (el) => {
            const style = window.getComputedStyle(el);
            const transform = style.transform;
            if (!transform || transform === 'none') return 0;
            const matrix = new DOMMatrixReadOnly(transform);
            return matrix.m41;
        };

        const scrollMarquee = (direction) => {
            if (isAnimating) return;
            isAnimating = true;

            // Pause the CSS animation
            track.classList.add('paused');

            requestAnimationFrame(() => {
                let currentX = getComputedTranslateX(track);
                // The track content is duplicated for the CSS marquee loop,
                // so halfWidth = total width of one complete set of cards
                const halfWidth = track.scrollWidth / 2;

                // Kill CSS animation so inline styles take effect
                track.style.animation = 'none';
                track.style.transform = `translateX(${currentX}px)`;
                void track.offsetHeight;

                const shift = direction === 'left' ? cardWidth : -cardWidth;
                let newX = currentX + shift;

                // INFINITE LOOP: wrap around when reaching the boundary
                if (newX > 0) {
                    // Scrolled left past the start → teleport to equivalent position at the end
                    const wrapX = currentX - halfWidth;
                    track.style.transition = 'none';
                    track.style.transform = `translateX(${wrapX}px)`;
                    void track.offsetHeight;
                    newX = wrapX + shift;
                } else if (Math.abs(newX) >= halfWidth) {
                    // Scrolled right past the end → teleport to equivalent position at the start
                    const wrapX = currentX + halfWidth;
                    track.style.transition = 'none';
                    track.style.transform = `translateX(${wrapX}px)`;
                    void track.offsetHeight;
                    newX = wrapX + shift;
                }

                // Smooth transition to the next card
                track.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                track.style.transform = `translateX(${newX}px)`;

                isAnimating = false;

                // Resume auto-scroll after 4 seconds of inactivity
                clearTimeout(resumeTimer);
                resumeTimer = setTimeout(() => {
                    track.style.animation = '';
                    track.style.transition = '';
                    track.style.transform = '';
                    track.classList.remove('paused');
                }, 4000);
            });
        };

        leftArrow.addEventListener('click', () => scrollMarquee('left'));
        rightArrow.addEventListener('click', () => scrollMarquee('right'));
    });

    // Lightbox logic
    const galleryImages = document.querySelectorAll('.gallery-grid img');
    if (galleryImages.length > 0) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <span class="lightbox-close">&times;</span>
            <span class="lightbox-prev">&#10094;</span>
            <span class="lightbox-next">&#10095;</span>
            <img class="lightbox-img" src="">
        `;
        document.body.appendChild(lightbox);

        const lightboxImg = lightbox.querySelector('.lightbox-img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        let currentIndex = 0;

        function showImage(index) {
            if (index < 0) index = galleryImages.length - 1;
            if (index >= galleryImages.length) index = 0;
            currentIndex = index;
            lightboxImg.src = galleryImages[currentIndex].src;
        }

        galleryImages.forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                lightbox.classList.add('active');
                showImage(index);
            });
        });

        closeBtn.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) lightbox.classList.remove('active');
        });

        prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
    }
});
