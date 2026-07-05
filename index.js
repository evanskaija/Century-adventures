// Century Adventures - Premium Safari Interactivity

// Force clear service worker and cache for development updates
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
        for (let registration of registrations) {
            registration.unregister();
        }
    });
}
if ('caches' in window) {
    caches.keys().then(names => {
        for (let name of names) {
            caches.delete(name);
        }
    });
}

// ── Global: Mobile Menu Toggle (called via onclick from HTML) ──
function toggleMobileMenu() {
    // Rely on DOM click event listener to prevent double-trigger issues
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Century Adventures experience initialized!');
    
    // Standard Header Injection for Unified Navigation & Toggles
    const injectHeader = () => {
        const header = document.querySelector('header.header');
        if (!header) return;

        header.innerHTML = `
            <div class="header-main-nav">
                <div class="container header-content">
                    <div class="logo">
                        <a href="index.html" class="logo-wrap">
                            <img src="assets/logo.png" alt="Century Adventures Logo">
                            <span class="brand-name">CENTURY<span class="brand-subname"> ADVENTURES</span><span class="brand-slogan" data-en="Discover. Explore. Experience." data-sw="Gundua. Chunguza. Shuhudia.">Discover. Explore. Experience.</span></span>
                        </a>
                    </div>
                    <nav class="nav">
                        <button class="nav-close-btn" id="nav-close-btn" aria-label="Close navigation menu"><i class="fas fa-times"></i> <span data-en="Close" data-sw="Funga">Close</span></button>
                        <ul>
                            <li class="mobile-only-action mobile-menu-title"><i class="fas fa-bars"></i> MENU</li>
                            <li class="mobile-only-action mobile-menu-controls">
                                <button class="toggle-btn lang-toggle" onclick="toggleLang(event)">SWAHILI</button>
                                <button class="toggle-btn theme-toggle" onclick="toggleTheme(event)"><i class="fas fa-moon"></i> <span class="toggle-text">DARK</span></button>
                            </li>
                            <li><a href="index.html" id="nav-home" data-en="Home" data-sw="Nyumbani">Home</a></li>
                            <li class="dropdown">
                                <a href="safaris.html" id="nav-safaris" data-en="Safaris" data-sw="Safari">Safaris <i class="fas fa-chevron-down"></i></a>
                                <span class="mobile-dropdown-toggle"><i class="fas fa-chevron-down"></i></span>
                                <ul class="dropdown-menu">
                                    <li><a href="safaris.html" data-en="All Tours &amp; Safaris" data-sw="Safari na Ziara Zote">All Tours &amp; Safaris</a></li>
                                    <li><a href="3-day-serengeti-safari.html" data-en="3-Day Serengeti Safari" data-sw="Safari ya Siku 3 Serengeti">3-Day Serengeti Safari</a></li>
                                    <li><a href="6-day-northern-tanzania-highlights.html" data-en="6-Day Northern Highlights" data-sw="Siku 6 Vivutio vya Kaskazini">6-Day Northern Highlights</a></li>
                                    <li><a href="10-days-luxury-safari-zanzibar.html" data-en="10-Day Luxury &amp; Zanzibar" data-sw="Siku 10 Anasa na Zanzibar">10-Day Luxury &amp; Zanzibar</a></li>
                                    <li><a href="12-days-best-of-south-and-north.html" data-en="12-Day South &amp; North" data-sw="Siku 12 Kusini na Kaskazini">12-Day South &amp; North</a></li>
                                    <li><a href="13-days-tanzania-safari-beach.html" data-en="13-Day Safari &amp; Beach" data-sw="Siku 13 Safari na Pwani">13-Day Safari &amp; Beach</a></li>
                                </ul>
                            </li>
                            <li class="dropdown">
                                <a href="destinations.html" id="nav-destinations" data-en="Destinations" data-sw="Maeneo">Destinations <i class="fas fa-chevron-down"></i></a>
                                <span class="mobile-dropdown-toggle"><i class="fas fa-chevron-down"></i></span>
                                <ul class="dropdown-menu">
                                    <li><a href="serengeti.html" data-en="Serengeti National Park" data-sw="Hifadhi ya Serengeti">Serengeti National Park</a></li>
                                    <li><a href="ngorongoro.html" data-en="Ngorongoro Conservation Area" data-sw="Ngorongoro">Ngorongoro Conservation Area</a></li>
                                    <li><a href="tarangire.html" data-en="Tarangire National Park" data-sw="Hifadhi ya Tarangire">Tarangire National Park</a></li>
                                    <li><a href="manyara.html" data-en="Lake Manyara National Park" data-sw="Hifadhi ya Manyara">Lake Manyara National Park</a></li>
                                    <li><a href="ruaha.html" data-en="Ruaha National Park" data-sw="Hifadhi ya Ruaha">Ruaha National Park</a></li>
                                    <li><a href="selous.html" data-en="Selous Game Reserve" data-sw="Hifadhi ya Selous">Selous Game Reserve</a></li>
                                    <li><a href="mikumi.html" data-en="Mikumi National Park" data-sw="Hifadhi ya Mikumi">Mikumi National Park</a></li>
                                    <li><a href="katavi.html" data-en="Katavi National Park" data-sw="Hifadhi ya Katavi">Katavi National Park</a></li>
                                    <li><a href="gombe.html" data-en="Gombe Stream National Park" data-sw="Hifadhi ya Gombe">Gombe Stream National Park</a></li>
                                </ul>
                            </li>
                            <li class="dropdown">
                                <a href="experiences.html" id="nav-experiences" data-en="Experiences" data-sw="Uzoefu">Experiences <i class="fas fa-chevron-down"></i></a>
                                <span class="mobile-dropdown-toggle"><i class="fas fa-chevron-down"></i></span>
                                <ul class="dropdown-menu">
                                    <li><a href="family-safaris.html" data-en="Family Safaris" data-sw="Safari za Familia">Family Safaris</a></li>
                                    <li><a href="migration-safaris.html" data-en="Migration Safaris" data-sw="Safari za Uhamiaji">Migration Safaris</a></li>
                                    <li><a href="honeymoon-safaris.html" data-en="Honeymoon Safaris" data-sw="Safari za Fungate">Honeymoon Safaris</a></li>
                                    <li><a href="volunteer.html" data-en="Volunteer Programs" data-sw="Mipango ya Kujitolea">Volunteer Programs</a></li>
                                    <li><a href="vehicles.html" data-en="Safari Vehicles" data-sw="Magari ya Safari">Safari Vehicles</a></li>
                                </ul>
                            </li>
                            <li><a href="about.html" id="nav-about" data-en="About Us" data-sw="Kuhusu Sisi">About Us</a></li>
                            <li class="dropdown">
                                <a href="#" id="nav-resources" data-en="Travel Guide" data-sw="Mwongozo wa Safari">Travel Guide <i class="fas fa-chevron-down"></i></a>
                                <span class="mobile-dropdown-toggle"><i class="fas fa-chevron-down"></i></span>
                                <ul class="dropdown-menu">
                                    <li><a href="blog.html" data-en="Travel Blog" data-sw="Blogu yetu">Travel Blog</a></li>
                                    <li><a href="faq.html" data-en="FAQs" data-sw="Maswali ya Kawaida">FAQs</a></li>
                                    <li><a href="gallery.html" data-en="Photo Gallery" data-sw="Picha za Safari">Photo Gallery</a></li>
                                    <li><a href="testimonials.html" data-en="Testimonials" data-sw="Shuhuda">Testimonials</a></li>
                                    <li><a href="best-time-to-visit-tanzania.html" data-en="Best Time to Visit" data-sw="Wakati Bora wa Kuja">Best Time to Visit</a></li>
                                    <li><a href="health-safety-tanzania.html" data-en="Health &amp; Safety" data-sw="Afya na Usalama">Health &amp; Safety</a></li>
                                    <li><a href="obtaining-visa-tanzania.html" data-en="Visa Information" data-sw="Visa ya Safari">Visa Information</a></li>
                                    <li><a href="what-to-wear-safari.html" data-en="Safari Packing Guide" data-sw="Nguo za Safari">Safari Packing Guide</a></li>
                                </ul>
                            </li>
                            <li><a href="contact.html" id="nav-contact" data-en="Contact Us" data-sw="Wasiliana Nasi">Contact Us</a></li>
                            <li class="mobile-only-action book-now-item"><a href="book.html" class="btn btn-primary enquire-btn" data-en="BOOK NOW" data-sw="WEKA NAFASI">BOOK NOW</a></li>
                        </ul>
                    </nav>

                    <!-- Mobile Hamburger Menu Button (Three Lines) -->
                    <button class="mobile-toggle" id="mobile-toggle" aria-label="Open navigation menu">
                        <span class="bar"></span>
                        <span class="bar"></span>
                        <span class="bar"></span>
                    </button>

                    <div class="header-actions">
                        <div class="header-toggles">
                            <button class="toggle-btn lang-toggle" onclick="toggleLang(event)">SWAHILI</button>
                            <button class="toggle-btn theme-toggle" onclick="toggleTheme(event)"><i class="fas fa-moon"></i> <span class="toggle-text">DARK</span></button>
                        </div>
                        <a href="book.html" class="btn btn-primary enquire-btn" data-en="BOOK NOW" data-sw="WEKA NAFASI">BOOK NOW</a>
                    </div>
                </div>
            </div>
        `;

        // Highlight active page
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';

        const homeLinks = ['index.html', ''];
        const destinations = ['katavi.html', 'selous.html', 'ruaha.html', 'mikumi.html', 'serengeti.html', 'gombe.html', 'ngorongoro.html', 'manyara.html', 'tarangire.html'];

        if (homeLinks.includes(page)) {
            const el = document.getElementById('nav-home');
            if (el) el.classList.add('active');
        } else if (page === 'about.html') {
            const el = document.getElementById('nav-about');
            if (el) el.classList.add('active');
        } else if (destinations.includes(page)) {
            const el = document.getElementById('nav-destinations');
            if (el) el.classList.add('active');
        } else if (page === 'safaris.html') {
            const el = document.getElementById('nav-safaris');
            if (el) el.classList.add('active');
        } else if (['experiences.html', 'activities.html', 'accommodations.html', 'planner.html', 'family-safaris.html', 'migration-safaris.html', 'zanzibar-beach.html'].includes(page)) {
            const el = document.getElementById('nav-experiences');
            if (el) el.classList.add('active');
        } else if (['blog.html', 'faq.html', 'gallery.html', 'testimonials.html', 'best-time-to-visit-tanzania.html', 'health-safety-tanzania.html', 'obtaining-visa-tanzania.html', 'solo-female-travel-tanzania.html', 'what-to-wear-safari.html', 'dar-es-salaam-highlights.html', 'advice-template.html'].includes(page)) {
            const el = document.getElementById('nav-resources');
            if (el) el.classList.add('active');
        } else if (page === 'volunteer.html') {
            const el = document.getElementById('nav-volunteer');
            if (el) el.classList.add('active');
        } else if (page === 'vehicles.html') {
            const el = document.getElementById('nav-vehicles');
            if (el) el.classList.add('active');
        } else if (page === 'contact.html') {
            const el = document.getElementById('nav-contact');
            if (el) el.classList.add('active');
        }
    };

    injectHeader();

    // Theme Switcher Logic
    const initTheme = () => {
        const savedTheme = localStorage.getItem('century-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeToggle(savedTheme);
    };

    const updateThemeToggle = (theme) => {
        const themeBtns = document.querySelectorAll('.theme-toggle');
        themeBtns.forEach(themeBtn => {
            if (themeBtn) {
                // Update button label text
                themeBtn.innerHTML = `<i class="${theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}"></i> <span class="toggle-text">${theme === 'dark' ? 'LIGHT' : 'DARK'}</span>`;
            }
        });
    };

    window.toggleTheme = (e) => {
        if (e && typeof e.stopPropagation === 'function') {
            e.stopPropagation();
        } else if (window.event && typeof window.event.stopPropagation === 'function') {
            window.event.stopPropagation();
        }
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('century-theme', newTheme);
        updateThemeToggle(newTheme);
    };

    // Language Switcher Logic
    // Language Switcher Logic
    const translationDict = {
        // Common terms & Form placeholders
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
        "Duration": "Muda",
        "Guests": "Wageni",
        "Lodging Level": "Kiwango cha Malazi",
        "Destinations selected": "Mbuga zilizochaguliwa",
        "Activities added": "Shughuli zilizoongezwa",
        "Design Your Dream Safari": "Tengeneza Safari Yako ya Ndoto",
        "Tailor your destinations, activities, lodging level, and check estimated costs in real-time.": "Binafsisha maeneo yako, shughuli, kiwango cha malazi, na uangalie makadirio ya gharama kwa wakati halisi.",
        "Estimated Cost Range": "Makadirio ya Gharama",
        "Submit Enquiry": "Tuma Ombi",
        "WhatsApp Expert": "Mtaalamu wa WhatsApp",
        "Adults": "Watu Wazima",
        "Children": "Watoto",
        "Travel Date": "Tarehe ya Safari",
        "Special Requests": "Maombi Maalum",
        "BOOK THIS TRIP": "WEKA NAFASI YA SAFARI HII",
        "SIMILAR TRIPS": "SAFARI ZINAZOFANANA",
        "Book This Trip": "Weka Nafasi ya Safari Hii",
        "Email": "Barua Pepe",
        "Phone": "Simu",
        "Country": "Nchi",
        "What's Included": "Vilivyojumuishwa",
        "Not Included": "Visivyojumuishwa",
        "Need assistance?": "Je, unahitaji usaidizi?",
        "Office: Ohio St, Dar es Salaam": "Ofisi: Ohio St, Dar es Salaam",
        "Daily": "Kila Siku",
        "All National Parks": "Hifadhi zote za Taifa",
        "Sunrise": "Jua Kuchomoza",
        "Preferred Date": "Tarehe Inayopendekezwa",
        "Arrival Date": "Tarehe ya Kuwasili",
        "Submit Request": "Tuma Ombi",
        "Inquire Now": "Uliza Sasa",
        "SEND INQUIRY": "TUMA OMBI",
        "Inquire Today": "Uliza Leo",
        "Inquire About This Trip": "Uliza Kuhusu Safari Hii",
        "Preferred Vehicle Type": "Aina ya Gari Inayopendekezwa",
        "Optional Add-ons": "Viongezo vya Hiari",
        "Total Estimated Cost": "Jumla ya Makadirio ya Gharama",
        "Previous Step": "Hatua ya Nyuma",
        "Next Step": "Hatua inayofuata",
        "Submit Custom Enquiry": "Tuma Ombi la Safari Maalum",
        "Choose destinations": "Chagua maeneo",
        "Choose activities": "Chagua shughuli",
        "Choose accommodation level": "Chagua kiwango cha malazi",
        "Your contact details": "Maelezo yako ya mawasiliano",
        "Full Name": "Jina Kamili",
        "Email Address": "Anwani ya Barua Pepe",
        "Phone Number": "Namba ya Simu",
        "Your Country": "Nchi Yako",
        "Tell us more...": "Tuambie zaidi...",
        
        // Secure checkout flow (payment.html)
        "Payment Successful!": "Malipo Yamefanikiwa!",
        "Booking Ref:": "Kumbukumbu ya Weka Nafasi:",
        "Trip:": "Safari:",
        "Amount Paid:": "Kiasi Kilicholipwa:",
        "Status:": "Hali:",
        "CONFIRMED": "IMETHIBITISHWA",
        "Print Receipt": "Chapa Stakabadhi",
        "Order Summary": "Muhtasari wa Agizo",
        "Traveler:": "Msafiri:",
        "Select Payment Option": "Chagua Chaguo la Malipo",
        "Full Payment": "Malipo Kamili",
        "30% Deposit": "Amana ya 30%",
        "Total Amount": "Jumla ya Kiasi",
        "256-bit SSL Secure Payment": "Malipo Salama ya 256-bit SSL",
        "Choose Payment Method": "Chagua Njia ya Malipo",
        "Card": "Kadi",
        "Mobile Money": "Pesa ya Kwenye Simu",
        "Cardholder Name": "Jina la Mwenye Kadi",
        "Card Number": "Namba ya Kadi",
        "Expiry Date": "Tarehe ya Mwisho",
        "CVV": "CVV",
        "PAY": "LIPIA",
        "REQUEST PROMPT": "OMBA PROMPT",
        "Enter your phone number to receive a payment prompt.": "Weka namba yako ya simu ili kupokea ujumbe wa malipo ya simu.",
        "You will be redirected to PayPal to complete your purchase securely.": "Utapelekwa kwenye PayPal ili kukamilisha ununuzi wako kwa usalama.",
        "PayPal Checkout": "Malipo ya PayPal",
        "Back to Home": "Rudi Nyumbani",
        
        // Zanzibar beachfront
        "Zanzibar Island Beach Holiday": "Likizo ya Fukwe za Kisiwa cha Zanzibar",
        "Flexible (Min 4 Days)": "Inayobadilika (Kima cha Chini Siku 4)",
        "Type": "Aina",
        "Beach & Relaxation": "Pwani na Kupumzika",
        "Transfers": "Usafiri",
        "PARADISE AWAITS": "PEPONI PANAKUSUBIRI",
        "Zanzibar is a dream destination that offers the ultimate beach holiday experience. Pristine white sandy beaches, crystal-clear turquoise waters, and a vibrant culture that will captivate your senses. From the popular Nungwi Beach to the historic Stone Town.": "Zanzibar ni eneo la ndoto ambalo hutoa uzoefu wa kipekee wa likizo ya pwani. Fukwe safi za mchanga mweupe, maji ya bluu ya kioo, na utamaduni mzuri utakaovutia hisia zako. Kutoka pwani maarufu ya Nungwi hadi mji wa kihistoria wa Stone Town.",
        "EXPERIENCES": "UZOEFU",
        "Private Island": "Kisiwa cha Binafsi",
        "Snorkeling": "Kupiga Mbizi na Mrija",
        "Dhow Cruise": "Safari ya Dau",
        "Spice Tour": "Ziara ya Viungo",
        "Prison Island": "Kisiwa cha Prison",
        "Sunset Lounge": "Mkahawa wa Machweo",
        "Luxe Beachfront Resort": "Resort ya Kifahari ya Fukweni",
        "Historic Stone Town Tour": "Ziara ya Mji Mkongwe wa Kihistoria",
        "Daily Breakfast & Dinner": "Kifungua Kinywa na Chakula cha Jioni cha Kila Siku",
        "Snorkeling Gear": "Vifaa vya Snorkeling",
        "Hotel Type": "Aina ya Hoteli",
        "5-Star Luxury": "Anasa ya Nyota 5",
        "Boutique": "Boutique",
        "SEND REQUEST": "TUMA OMBI",

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
        "Nyerere National Park (Selous)": "Hifadhi ya Nyerere (Selous)",
        
        // Safari Detail Itineraries (3-Day Serengeti, etc.)
        "Experience the magic of Africa's most famous wilderness. Our 3-day Serengeti safari takes you deep into the heart of the endless plains, where predators roam and the Great Migration unfolds. Guided by professionals, you'll witness the circle of life in its rawest form.": "Pata uzoefu wa maajabu ya nyika maarufu zaidi barani Afrika. Safari yetu ya siku 3 ya Serengeti inakupeleka ndani ya moyo wa nyanda zisizo na mwisho, ambapo wawindaji huwinda na Uhamiaji Mkuu hutokea. Ukiongozwa na wataalamu, utashuhudia mzunguko wa maisha katika hali yake halisi.",
        "Pickup & Drive to Serengeti": "Kuchukuliwa na Kusafiri kwenda Serengeti",
        "Scenic drive through the Ngorongoro Conservation Area": "Safari ya mandhari nzuri kupitia Eneo la Hifadhi la Ngorongoro",
        "Afternoon game drive in Central Serengeti": "Mchezo ya alasiri katika Serengeti ya Kati",
        "Dinner and overnight at a luxury tented camp": "Chakula cha jioni na kulala katika kambi ya kifahari ya hema",
        "Full-Day Safari in Serengeti": "Safari ya Siku Nzima Serengeti",
        "Dawn game drive to catch predators in action": "Mchezo wa alfajiri kuona wawindaji wakifanya kazi",
        "Lion and Cheetah viewing at Sametu Kopjes": "Kuangalia Simba na Duma huko Sametu Kopjes",
        "Afternoon drive following the Great Migration herds": "Mchezo wa alasiri kufuata makundi ya Uhamiaji Mkuu",
        "Sunset photography over the Serengeti plains": "Kupiga picha za machweo kwenye nyanda za Serengeti",
        "Morning Game Drive & Return": "Mchezo wa Asubuhi na Kurudi",
        "Final morning game drive at sunrise": "Mchezo wa mwisho wa asubuhi wakati wa jua kuchomoza",
        "Breakfast in the bush": "Kifungua kinywa porini",
        "Leisurely drive back to Arusha": "Safari ya polepole ya kurudi Arusha",
        "Drop-off at your hotel or airport": "Kushushwa kwenye hoteli yako au uwanja wa ndege",
        "Amazing safari experience. The guide was incredibly knowledgeable and we saw the Big Five in two days!": "Uzoefu wa kushangaza wa safari. Mwongozo alikuwa na ujuzi wa ajabu na tuliona watano wakubwa kwa siku mbili!",
        "Professional guide and excellent service. The tented camp was surprisingly luxurious.": "Mwongozo wa kitaalamu na huduma bora. Kambi ya hema ilikuwa ya anasa ya kushangaza.",
        
        // 7-Day Ruaha & Mikumi
        "7-Day Great Ruaha & Mikumi Safari": "Siku 7 Safari ya Ruaha Kuu na Mikumi",
        "7 Days / 6 Nights": "Siku 7 / Usiku 6",
        "Best For": "Bora Kwa",
        "Big Cat Tracking": "Ufuatiliaji wa Paka Wakubwa",
        "Parks": "Mbuga",
        "Southern Circuit": "Mzunguko wa Kusini",
        "THE SOUTHERN LOOP": "MZUNGUKO WA KUSINI",
        "A perfect week-long immersive safari. Experience the diversity of Mikumi's plains and the wild, predator-rich riverine landscapes of the Great Ruaha. A balanced mix of scenery and wildlife.": "Safari kamili ya wiki moja ya kuzama. Pata uzoefu wa anuwai ya nyanda za Mikumi na mandhari ya pori yenye wawindaji wengi ya Mto Ruaha Mkuu. Mchanganyiko mzuri wa mandhari na wanyamapori.",
        
        // 10-Day Mikumi, Ruaha, Matema
        "10-Day Mikumi, Ruaha & Matema Wildlife Safari": "Siku 10 Safari ya Wanyamapori ya Mikumi, Ruaha na Matema",
        "Southern Tanzania": "Kusini mwa Tanzania",
        "1 - 12 People": "Watu 1 - 12",
        "Tiered Pricing": "Bei ya Ngazi",
        "Welcome to Tanzania! Transfer from Julius Nyerere International Airport to your hotel.": "Karibu Tanzania! Usafiri kutoka Uwanja wa Ndege wa Kimataifa wa Julius Nyerere kwenda kwenye hoteli yako.",
        "Airport pickup and transfer": "Kuchukuliwa uwanja wa ndege na usafiri",
        "Hotel check-in at Hotel Slipway": "Kuingia katika Hotel Slipway",
        "Evening briefing and dinner": "Maelezo ya jioni na chakula cha jioni",
        "Drive to Mikumi for an intensive wildlife experience. Known as \"Little Serengeti,\" it offers incredible sightings.": "Safari ya kwenda Mikumi kwa uzoefu mkubwa wa wanyamapori. Inajulikana kama \"Serengeti Ndogo\", inatoa maono ya ajabu.",
        "Morning drive through picturesque landscapes": "Safari ya asubuhi kupitia mandhari nzuri",
        "Afternoon game drives": "Safari za alasiri za kuongozwa",
        "Elephant and Lion sightings": "Kuona Tembo na Simba",
        "Overnight at Vuma Hills Tented Camp": "Kulala Vuma Hills Tented Camp",
        "Head to the rugged Ruaha, Tanzania's largest park, famous for its massive elephant herds and predators.": "Nenda kwenye Hifadhi ya Ruaha, mbuga kubwa zaidi nchini Tanzania, inayojulikana kwa makundi makubwa ya tembo na wawindaji.",
        "Walking Safaris": "Safari za Kutembea kwa Miguu",
        "Sunset over the Great Ruaha River": "Machweo juu ya Mto Ruaha Mkuu",
        "Leopard and Wild Dog tracking": "Ufuatiliaji wa Chui na Mbwa Mwitu",
        "Relax at Lake Nyasa's Matema Beach before heading back to Mbeya for your flight.": "Pumzika kwenye Fukwe ya Matema ya Ziwa Nyasa kabla ya kuelekea Mbeya kwa ndege yako.",
        "Lakeside relaxation": "Kupumzika kando ya ziwa",
        "Local cultural tours": "Ziara za kitamaduni za ndani",
        "Return to Dar es Salaam": "Kurudi Dar es Salaam",
        "The Mikumi to Ruaha loop was sensational. Highly professional guides and seamless logistics! Highly recommend Century Adventures.": "Mzunguko wa Mikumi kwenda Ruaha ulikuwa wa kusisimua. Waongozaji wa kitaalamu sana na vifaa vya kisasa! Pendekeza sana Century Adventures.",
        "Matema Beach was the perfect hidden gem to end the trip. We saw lions every single day in Ruaha. Incredible service.": "Fukwe ya Matema ilikuwa vito vya siri vilivyofichwa kumaliza safari. Tuliona simba kila siku huko Ruaha. Huduma ya kushangaza.",
        
        // 8-Day Best of Tanzania Luxury
        "8-Day Best of Tanzania Luxury": "Siku 8 Safari ya Anasa Bora ya Tanzania",
        "8 Days / 7 Nights": "Siku 8 / Usiku 7",
        "Elite Luxury": "Anasa ya Hali ya Juu",
        "ELITE SAFARI EXPERIENCE": "UZOEFU WA SAFARI YA ANASA",
        "The 8-day Best of Tanzania Luxury safari is designed for those who demand the finest. Fly between parks in private charters, stay in award-winning lodges, and enjoy private guides who cater to your every interest.": "Safari ya siku 8 ya anasa ya juu ya Tanzania imeundwa kwa wale wanaotaka kilicho bora zaidi. Safiri kati ya mbuga kwa ndege za kukodi za kibinafsi, lala kwenye nyumba zilizoshinda tuzo, na ufurahie waongozaji binafsi wanaokidhi kila maslahi yako.",
        
        // 13-Day Tanzania Safari & Beach
        "13 Days / 12 Nights": "Siku 13 / Usiku 12",
        "THE ULTIMATE COMBO": "MCHANGANYIKO WA KIPEKEE",
        "Experience the raw power of the African savannah followed by the tranquil beauty of the Indian Ocean. This 13-day journey combines Tanzania's premier wildlife parks with the exotic charm of Zanzibar island.": "Pata nguvu ya kweli ya savana ya Afrika ikifuatiwa na uzuri wa utulivu wa Bahari ya Hindi. Safari hii ya siku 13 inachanganya mbuga kuu za wanyamapori za Tanzania na haiba ya kigeni ya kisiwa cha Zanzibar.",
        "Arusha, Tarangire, Ngorongoro, and the mighty Serengeti.": "Arusha, Tarangire, Ngorongoro, na Serengeti kuu.",
        "Transfer to Arusha airport for your flight to the Spice Island.": "Usafiri kwenda uwanja wa ndege wa Arusha kwa ndege ya kwenda kisiwa cha Viungo.",
        "Relaxation, spice tours, and turquoise waters.": "Kupumzika, ziara za viungo, na maji ya bluu ya kioo.",
        
        // 11-Day Best of Northern Parks & Zanzibar
        "11-Day Best of Northern Parks & Zanzibar": "Siku 11 Kaskazini mwa Mbuga Bora na Zanzibar",
        "11 Days / 10 Nights": "Siku 11 / Usiku 10",
        "Zanzibar Extension": "Kuongeza Zanzibar",
        "ITINERARY HIGHLIGHTS": "RATIBA MAHUSUSI",
        "Arusha to Serengeti": "Arusha kwenda Serengeti",
        "Deep dive into the heart of the savannah.": "Kuzama ndani ya moyo wa savana.",
        "The garden of eden, home to the black rhino.": "Bustani ya Edeni, nyumba ya kifaru mweusi.",
        "Zanzibar Island": "Kisiwa cha Zanzibar",
        "Turquoise waters and white sandy beaches.": "Maji ya bluu na fukwe za mchanga mweupe.",
        
        // 10-Day Bush to Beach
        "10-Day Bush to Beach: Ruaha, Mikumi & Zanzibar": "Siku 10 Nyikani hadi Pwani: Ruaha, Mikumi na Zanzibar",
        "THE PERFECT BALANCE": "MWELEKEO SAHIHI",
        "Experience the best of both worlds. Start with an intensive wildlife safari in Tanzania's wild south and conclude with professional relaxation on the spice island of Zanzibar.": "Pata uzoefu wa ulimwengu wote wawili. Anza na safari kubwa ya wanyamapori kusini mwa Tanzania na umalizie kwa kupumzika kwenye kisiwa cha viungo cha Zanzibar.",
        
        // 10-Day Great Migration
        "10-Day Great Migration Expedition": "Siku 10 Safari ya Uhamiaji Mkuu",
        "Witness the world's greatest wildlife show. Follow over 1.5 million wildebeest and zebras as they traverse the Serengeti ecosystem. This carefully timed safari ensures you're in the heart of the action.": "Shuhudia onyesho kubwa zaidi la wanyamapori duniani. Fuata zaidi ya nyumbu na punda milia milioni 1.5 wanapopita kwenye mfumo wa ikolojia wa Serengeti. Safari hii inahakikisha uko katikati ya tukio.",
        "All-inclusive luxury camps": "Kambi za kifahari zinazojumuisha kila kitu",
        "Expert predator tracking": "Ufuatiliaji wa wataalamu wa wanyama wawindaji",
        "Inquire Today": "Uliza Leo",
        
        // 12-Day Wildlife & Cultural
        "12-Day Wildlife & Cultural Highlights Safari": "Siku 12 Safari ya Wanyamapori na Utamaduni",
        "12 Days / 11 Nights": "Siku 12 / Usiku 11",
        "1 - 10 People": "Watu 1 - 10",
        "Join our 12-day Wildlife Expedition with Cultural Highlights. This thrilling journey will take you through iconic savannahs and meeting Maasai warriors. Discover the magic of Tanzania's wilderness and its people.": "Jiunge na safari yetu ya siku 12 ya Wanyamapori na Utamaduni. Safari hii ya kusisimua itakupeleka kupitia savana za asili na kukutana na wapiganaji wa Kimaasai. Gundua maajabu ya nyika ya Tanzania na watu wake.",
        "Arrival and immersion into Maasai culture at the foot of Kilimanjaro.": "Kuwasili na kuingia katika utamaduni wa Kimaasai chini ya Mlima Kilimanjaro.",
        "Maasai cultural dance and story-telling": "Ngoma ya kitamaduni ya Kimaasai na hadithi",
        "Spear throwing competition": "Mashindano ya kutupa mkuki",
        "Overnight at Kambi Ya Tembo": "Kulala Kambi Ya Tembo",
        "Swimming in Chemka Hot Springs": "Kuogelea kwenye Chemka Hot Springs",
        "Game drives in Tarangire National Park": "Mchezo wa kuongozwa katika Hifadhi ya Tarangire",
        "Tree-climbing lions of Lake Manyara": "Simba wanaopanda miti wa Ziwa Manyara",
        "The ultimate wildlife experience in the world's most famous crater and plains.": "Uzoefu mkubwa zaidi wa wanyamapori katika kasoko na nyanda maarufu zaidi duniani.",
        "Great Migration tracking in Serengeti": "Kufuata Uhamiaji Mkuu katika Serengeti",
        "Big Five sightings in Ngorongoro Crater": "Kuona Watano Kubwa katika Ngorongoro Crater",
        "Visit to Olduvai Gorge": "Kutembelea Bonde la Olduvai",
        "Witness the base of the holy mountain Ol Doinyo Lengai and thousands of flamingos.": "Shuhudia chini ya mlima mtakatifu wa Ol Doinyo Lengai na maafelfu ya ndege aina ya flamingo.",
        "Lake Natron flamingo viewing": "Kuangalia flamingo wa Ziwa Natron",
        "Return to Arusha for your outbound flight": "Kurudi Arusha kwa ndege yako ya kwenda nje ya nchi",
        "This ultimate 12-day safari connects the wild, untouched landscapes of Southern Tanzania with the world-famous iconic parks of the North. Experience the massive elephants of Nyerere, the waterfalls of Mikumi, and the legendary migration of the Serengeti.": "Safari hii ya kipekee ya siku 12 inaunganisha mandhari ya pori ya Kusini mwa Tanzania na mbuga maarufu za Kaskazini. Pata uzoefu wa tembo wengi wa Nyerere, maporomoko ya maji ya Mikumi, na uhamiaji wa kihistoria wa Serengeti.",
        "Boat safaris and walking tours in Africa's largest protected area.": "Safari za boti na ziara za kutembea katika eneo kubwa zaidi la ulinzi barani Afrika.",
        "Explore the 'Little Serengeti' and trek the Sanje Waterfalls.": "Chunguza 'Serengeti Ndogo' na upande Maporomoko ya Maji ya Sanje.",
        "Witness the Great Migration and the 'Big Five' in action.": "Shuhudia Uhamiaji Mkuu na 'Watano Kubwa' wakifanya kazi.",
        "Descend into the world's largest volcanic caldera.": "Shuka kwenye kasoko kubwa zaidi ya volkeno duniani (Ngorongoro).",
        "Professional multi-lingual guide": "Mwongozo wa kitaalamu wa lugha nyingi",
        "All park entrance fees": "Kiingilio chote cha hifadhi",
        "Unlimited bottled water in vehicle": "Maji ya chupa yasiyo na kikomo kwenye gari",
        
        // 11-Day Fly-in Southern
        "LUXURY IN THE AIR": "ANASA ANGA LA JUU",
        "Skip the long drives and soar over the majestic Tanzanian landscapes. Our fly-in safari maximizes your time in the wilderness, landing you directly in the heart of Selous and Ruaha for immediate wildlife viewing.": "Epuka safari ndefu za barabarani na uruke juu ya mandhari nzuri ya Tanzania. Safari yetu ya ndege inaongeza muda wako nyikani, ikikutua moja kwa moja katika moyo wa Selous na Ruaha kwa ajili ya kuona wanyamapori mara moja.",
        "VIP Booking": "Weka Nafasi ya VIP",
        "INQUIRE NOW": "ULIZA SASA",
        
        // 11-Day Serengeti & Zanzibar
        "11 Days Serengeti & Zanzibar": "Siku 11 Serengeti na Zanzibar",
        "A Match Made in Heaven": "Mchanganyiko Sahihi Kabisa",
        "Embark on the ultimate adventure with an 11-day Serengeti Safari and Zanzibar Beach getaway. Experience the thrill of spotting majestic wildlife in the Serengeti National Park, followed by a relaxing and rejuvenating stay on the pristine beaches of Zanzibar. This combination of safari excitement and beach bliss is truly a match made in heaven for any traveler seeking a well-rounded and unforgettable African experience.": "Anza safari ya kipekee ya siku 11 ya Serengeti na pwani ya Zanzibar. Pata msisimko wa kuona wanyamapori wa ajabu katika Hifadhi ya Taifa ya Serengeti, ukifuatiwa na kupumzika kwenye fukwe safi za Zanzibar. Mchanganyiko huu wa safari na pwani ni mechi kamili kwa msafiri yeyote.",
        "You will arrive at the airport and be transferred by road to Nungwi beach resort by Turaco. Enjoy dinner and spend the night at the resort.": "Utawasili kwenye uwanja wa ndege na kupelekwa kwa barabara hadi Nungwi beach resort by Turaco. Furahia chakula cha jioni na kulala kwenye resort.",
        "After breakfast, spend the day relaxing at the beach resort. Enjoy dinner and another overnight stay at Nungwi beach resort.": "Baada ya kifungua kinywa, tumia siku nzima kupumzika kwenye resort ya fukweni. Furahia chakula cha jioni na kulala tena katika Nungwi beach resort.",
        
        "June - October (Best game viewing & river crossings)": "Juni - Oktoba (Kuangalia vizuri wanyamapori na kuvuka mto)",
        "January - February (Thousands of newborn wildebeests)": "Januari - Februari (Maelfu ya nyumbu wachanga)",
        "April - May (Lush green landscapes, low rates)": "Aprili - Mei (Mandhari ya kijani kibichi, bei nafuu)",
        "November - April (Migratory species present)": "Novemba - Aprili (Ndege wanaohama wapo)",
        
        "Come and experience an unforgettable tour with our exceptional service! Discover the wonders of Northern Tanzania as you visit four renowned wildlife destinations where the African “Big Five” roam. Immerse yourself in the beauty of Manyara, Serengeti, Ngorongoro Crater, and Tarangire, where you will encounter a plethora of wildlife including majestic lions, magnificent elephants, elusive leopards, agile cheetahs, powerful buffaloes, and much more. Don’t miss out on this incredible opportunity to witness swamps, plains, and an abundance of wildlife.": "Kuja na uzoefu wa safari isiyosahaulika na huduma yetu ya kipekee! Gundua maajabu ya Kaskazini mwa Tanzania unapotembelea maeneo manne maarufu ya wanyamapori ambapo \"Tano Kubwa\" za Afrika wanazurura. Jitumbukize katika uzuri wa Manyara, Serengeti, Ngorongoro, na Tarangire, ambapo utakutana na wanyamapori wengi wakiwemo simba, tembo, chui, duma, nyati, na mengi zaidi.",
        "Upon arrival in Arusha, you will be transferred to the Arusha Planet Lodge. Enjoy a relaxing evening with dinner and settle in for your first night in Tanzania.": "Baada ya kuwasili Arusha, utapelekwa kwenye Arusha Planet Lodge. Furahia jioni ya utulivu na chakula cha jioni na upumzike kwa usiku wako wa kwanza nchini Tanzania.",
        "After breakfast, embark on a road transfer to Tarangire National Park. Enjoy a guided game drive to spot a variety of wildlife in their natural habitat. Later, transfer to Motto Cottages for dinner and overnight stay.": "Baada ya kifungua kinywa, anza safari ya kwenda Hifadhi ya Taifa ya Tarangire. Furahia mchezo wa kuongozwa ili kuona wanyamapori mbalimbali. Baadaye, nenda kwenye Motto Cottages kwa chakula cha jioni na kulala.",

        // Extra dynamic strings & UI tags
        "Safaris": "Safari",
        "Contact": "Mawasiliano",
        "BOOK NOW": "WEKA NAFASI",
        "FAQ": "Maswali Yanayoulizwa Sana",
        "Pool": "Dimbwi la Kuogelea",
        "Free Wifi": "Wifi ya Bure",
        "AC": "Kiyoyozi",
        "Lounge Bar": "Baa ya Mapumziko",
        "Tub Bath": "Bafu la Kuogea",
        "Exclusive Game Reserve": "Pori la Akiba la Kipekee",
        "Infinity Pool": "Dimbwi la Infinity",
        "Butler": "Mhudumu wa Ndani",
        "All Inclusive": "Kila Kitu Kimejumuishwa",
        "Budget Camping": "Kambi ya Bajeti",
        "Elephants": "Tembo",
        "Lions": "Simba",
        "Giraffes": "Twiga",
        "Zebras": "Punda Milia",
        "Leopards": "Chui",
        "Buffaloes": "Nyati",
        "Hippos": "Kiboko",
        "Crocodiles": "Mamba",
        "Personal Expenses": "Gharama Binafsi",
        "Travel Insurance": "Bima ya Safari",
        "Tourist Visa": "Visa ya Watalii",
        "Alcoholic Beverages": "Vinywaji vya Pombe",
        "Laundry Service": "Huduma ya Kufuliwa Nguo",
        "Visas": "Visa",
        "Personal Travel Insurance": "Bima ya Safari Binafsi",
        "Full Board Accommodation": "Malazi ya Bodi Kamili",
        "Bottled Drinking Water": "Maji ya Kunywa ya Chupa",
        "Airport Transfers": "Usafiri wa Uwanja wa Ndege",
        "All Park Fees & VAT": "Ada Zote za Hifadhi na VAT",
        "4x4 Custom Safari Jeep": "Jeep Maalum ya Safari ya 4x4",
        "Professional English Guide": "Mwongozo wa Kiingereza wa Kitaalamu",
        "READ MORE &rarr;": "SOMA ZAIDI &rarr;",
        "Tours": "Ziara",
        "DARK": "GIZA",
        "SCROLL": "TEMBEA",
        "Book This Safari": "Weka Nafasi ya Safari Hii",
        "and Zanzibar Beach Retreat": "na Mapumziko ya Fukwe za Zanzibar",
        "Upon your arrival in Arusha, you will check into the luxurious Gran Melia Arusha. Enjoy a welcome dinner and take some time to relax and unwind at the hotel after your journey.": "Baada ya kuwasili kwako Arusha, utajiandikisha katika Gran Melia Arusha ya kifahari. Furahia chakula cha jioni cha kukaribisha na uchukue muda kupumzika kwenye hoteli baada ya safari yako.",
        "10-Day Southern Safari & Udzungwa Trek": "Siku 10 Safari ya Kusini na Kupanda Udzungwa",
        "Safari & Trekking": "Safari na Kupanda Mlima",
        "Sanje Waterfalls": "Maporomoko ya Maji ya Sanje",
        "6 Days / 5 Nights": "Siku 6 / Usiku 5",
        "Two days of intensive wildlife tracking in the endless plains.": "Siku mbili za ufuatiliaji mkubwa wa wanyamapori kwenye nyanda zisizo na mwisho.",
        "Final game drive and transfer back to Arusha.": "Mchezo wa mwisho na usafiri wa kurudi Arusha.",
        "10 Days Southern Safari": "Siku 10 Safari ya Kusini",
        "3 Days Serengeti": "Siku 3 Serengeti",
        "Coastal Air Flights": "Ndege za Coastal Air",
        "9 Days / 8 Nights": "Siku 9 / Usiku 8",
        "Remote & Untamed": "Ya Mbali na Isiyofugwa",
        "Northern Circuit": "Mzunguko wa Kaskazini",
        "Highlights": "Mambo Muhimu",
        "Focus": "Lengo",
        "Half Day": "Nusu Siku",
        "5.0 Rating": "Ukadiriaji 5.0",
        "3 Hours": "Saa 3",
        "Great Migration": "Uhamiaji Mkuu",
        "2-3 Hours": "Saa 2-3",
        "Travelers": "Wasafiri",
        "SUBMIT INQUIRY": "TUMA OMBI",
        "WILDLIFE": "WANYAMAPORI",
        "About": "Kuhusu",
        "Essential tips for your Tanzania safari": "Miongozo muhimu ya safari yako ya Tanzania",
        "Everything you need to know about Africa's most iconic animals: Lion, Leopard, Elephant, Rhino, and Buffalo.": "Kila kitu unachohitaji kujua kuhusu wanyama mashuhuri zaidi barani Afrika: Simba, Chui, Tembo, Kifaru, na Nyati.",
        "After your exhilarating wildlife encounters, it's time to relax and unwind on the pristine beaches of Zanzibar. Known for its turquoise waters, palm-fringed shores, and vibrant coral reefs, Zanzibar offers the perfect setting for a blissful beach getaway. Spend your days lounging on white sandy beaches, swimming in crystal-clear waters, and indulging in delicious seafood delicacies.": "Baada ya kukutana na wanyamapori wa kusisimua, ni wakati wa kupumzika na kuburudika kwenye ufuo safi wa Zanzibar. Inajulikana kwa maji yake ya bluu, ufuo wenye mitende, na miamba ya matumbawe iliyojaa uhai, Zanzibar inatoa mazingira bora kwa mapumziko ya pwani. Tumia siku zako kupumzika kwenye mchanga mweupe, kuogelea kwenye maji safi ya kioo, na kufurahia vyakula vitamu vya baharini.",
        "Need more help?": "Unahitaji usaidizi zaidi?",
        "Wild Landscapes": "Mandhari ya Pori",
        "THE WILD SOUTH": "KUSINI MWENYE MWITU",
        "A month-by-month breakdown of where the massive herds of wildebeest and zebra are throughout the year.": "Mchanganuo wa mwezi baada ya mwezi wa wapi makundi makubwa ya nyumbu na punda milia yalipo kwa mwaka mzima.",
        "ADVENTURE AWAITS": "ADVENTURE INASUBIRI",
        "Unlimited": "Bila Kikomo",
        "Pristine Beaches": "Ufuo wa Asili",
        "Activity": "Shughuli",
        "Categories": "Kategoria",
        "VIEW ON TRIPADVISOR": "ANGALIA TRIPADVISOR",
        "Discover Zanzibar": "Gundua Zanzibar",
        "Imagine witnessing a pride of lions lazing in the sun, a herd of elephants taking a cooling bath, or a leopard stealthily making its way through the grass. These are the kinds of experiences that await you during your safari adventure.": "Fikiria kushuhudia kundi la simba wakipumzika kwenye jua, kundi la tembo wakichukua bafu la kupoza, au chui akipita kwa siri kwenye majani. Haya ni aina ya mambo yanayokungoja wakati wa safari yako.",
        "Total Reviews: 524 | Average Rating: 5.0": "Jumla ya Maoni: 524 | Wastani wa Ukadiriaji: 5.0",
        "Other / Not Sure": "Nyingine / Sina Hakika",
        "Book a Journey": "Weka Nafasi ya Safari",
        "Wildlife Safari": "Safari ya Wanyamapori",
        "Beach Holiday": "Likizo ya Fukwe",
        "Romantic Choice": "Chaguo la Kimapenzi",
        "10-Day Best of Tanzania Honeymoon": "Siku 10 Fungate Bora ya Tanzania",
        "10 Days / 9 Nights": "Siku 10 / Usiku 9",
        "Style": "Mtindo",
        "Ultra Luxury": "Anasa Kubwa",
        "Experience": "Uzoefu",
        "Romantic Private Dinners": "Chakula cha Jioni cha Kimapenzi cha Kibinafsi",
        "A ROMANTIC JOURNEY": "SAFARI YA KIMAPENZI",
        "Inquire with an Expert": "Uliza na Mtaalamu",
        "Name": "Jina",
        "Date": "Tarehe",
        "START PLANNING": "ANZA KUPANGA",
        "4.9 Rating": "Ukadiriaji 4.9",
        "3-Day Serengeti Wildlife Safari": "Siku 3 Safari ya Wanyamapori Serengeti",
        "3 Days / 2 Nights": "Siku 3 / Usiku 2",
        "Location": "Eneo",
        "Group Size": "Ukubwa wa Kikundi",
        "1 - 20 People": "Watu 1 - 20",
        "TRIP OVERVIEW": "MAELEZO YA SAFARI",
        "Pricing Tier": "Kiwango cha Bei",
        "1 Person": "Mtu 1",
        "2 People": "Watu 2",
        "$550 Per Person": "$550 kwa Mtu",
        "4 People": "Watu 4",
        "$500 Per Person": "$500 kwa Mtu",
        "6+ People": "Watu 6+",
        "$450 Per Person": "$450 kwa Mtu",
        "DAY-BY-DAY ITINERARY": "RATIBA YA KILA SIKU",
        "Early morning pickup from your hotel in Arusha": "Kuchukuliwa asubuhi na mapema kutoka hoteli yako Arusha",
        "4x4 Safari Transport": "Usafiri wa Safari wa 4x4",
        "All Park Entry Fees": "Ada Zote za Kuingia Hifadhini",
        "Luxury Accommodation": "Malazi ya Kifahari",
        "Professional Tour Guide": "Mwongozo wa Kitaalamu wa Safari",
        "Unlimited Drinking Water": "Maji ya Kunywa Yasiyo na Kikomo",
        "International Flights": "Ndege za Kimataifa",
        "Personal Expenses": "Gharama Binafsi",
        "Travel Insurance": "Bima ya Safari",
        "WILDLIFE YOU MAY SEE": "WANYAMAPORI UNAOWEZA KUWAONA",
        "Elephants": "Tembo",
        "Lions": "Simba",
        "Giraffes": "Twiga",
        "Zebras": "Punda Milia",
        "Leopards": "Chui",
        "Buffaloes": "Nyati",
        "SAFARI ROUTE MAP": "RAMANI YA NJIA YA SAFARI",
        "REVIEWS": "MAONI",
        "2 Days Mikumi Safari": "Siku 2 Safari ya Mikumi",
        "Ngorongoro Day Trip": "Safari ya Siku Moja Ngorongoro",
        "Zanzibar Beach Holiday": "Likizo ya Pwani ya Zanzibar",
        "Tours": "Ziara",
        "DARK": "GIZA",
        "SCROLL": "TEMBEA",
        "Pool": "Dimbwi la Kuogelea",
        "Book This Safari": "Weka Nafasi ya Safari Hii",
        "Northern Circuit": "Mzunguko wa Kaskazini",
        "Highlights": "Mambo Muhimu",
        "Focus": "Lengo",
        "Half Day": "Nusu Siku",
        "5.0 Rating": "Ukadiriaji 5.0",
        "3 Hours": "Saa 3",
        "Great Migration": "Uhamiaji Mkuu",
        "2-3 Hours": "Saa 2-3",
        "Travelers": "Wasafiri",
        "SUBMIT INQUIRY": "TUMA OMBI",
        "WILDLIFE": "WANYAMAPORI",
        "About": "Kuhusu",
        "By car:": "Kwa gari:",
        "By air:": "Kwa ndege:",
        "By train:": "Kwa treni:"
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
                if (node._originalText !== undefined) {
                    node.textContent = node._originalText;
                }
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
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

    window.toggleLang = (e) => {
        if (e && typeof e.stopPropagation === 'function') {
            e.stopPropagation();
        } else if (window.event && typeof window.event.stopPropagation === 'function') {
            window.event.stopPropagation();
        }
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
                if (translation.includes('<') && translation.includes('>')) {
                    el.innerHTML = translation;
                } else if (el.children.length > 0) {
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

        // Translate placeholders
        const inputs = document.querySelectorAll('[placeholder]');
        inputs.forEach(input => {
            const ph = input.getAttribute('placeholder');
            if (ph) {
                if (input._originalPlaceholder === undefined) {
                    input._originalPlaceholder = ph;
                }
                if (lang === 'sw') {
                    const cleaned = ph.trim().replace(/^[.,;:!?()*\-&|•"' \t\n\r]+|[.,;:!?()*\-&|•"' \t\n\r]+$/g, "");
                    if (translationDict[ph]) {
                        input.setAttribute('placeholder', translationDict[ph]);
                    } else if (translationDict[cleaned]) {
                        input.setAttribute('placeholder', translationDict[cleaned]);
                    }
                } else {
                    input.setAttribute('placeholder', input._originalPlaceholder);
                }
            }
        });

        // Translate other page text dynamically using the dictionary
        translateTextNode(document.body, lang);

        // Update lang toggle button label
        const langBtns = document.querySelectorAll('.lang-toggle');
        langBtns.forEach(btn => {
            btn.innerHTML = lang === 'en'
                ? '<span class="lang-label active">EN</span><span class="lang-divider">/</span><span class="lang-label">SW</span>'
                : '<span class="lang-label">EN</span><span class="lang-divider">/</span><span class="lang-label active">SW</span>';
        });

        // Update Read More button labels to match current language
        document.querySelectorAll('.read-more-btn').forEach(btn => {
            const isExpanded = btn.classList.contains('expanded-state');
            const span = btn.querySelector('span');
            if (span) {
                if (isExpanded) {
                    span.textContent = lang === 'sw' ? 'Funga' : 'Read Less';
                    span.setAttribute('data-en', 'Read Less');
                    span.setAttribute('data-sw', 'Funga');
                } else {
                    span.textContent = lang === 'sw' ? 'Soma Zaidi' : 'Read More';
                    span.setAttribute('data-en', 'Read More');
                    span.setAttribute('data-sw', 'Soma Zaidi');
                }
            }
        });
        
        console.log(`Language applied: ${lang}`);
    };

    // Real-time tab synchronization event listener
    window.addEventListener('storage', (e) => {
        if (e.key === 'century-theme') {
            const newTheme = e.newValue || 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateThemeToggle(newTheme);
        } else if (e.key === 'century-lang') {
            const newLang = e.newValue || 'en';
            applyLang(newLang);
        }
    });

    initTheme();
    initLang();

    // Header scroll effect
    const header = document.querySelector('.header');
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', () => {
        // Scrolled header
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
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

    // Close button click handler inside menu drawer
    const closeBtn = document.getElementById('nav-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeMenu();
        });
    }

    // Click dark overlay to close
    navOverlay.addEventListener('click', () => closeMenu());

    // Click anywhere outside nav to close
    document.addEventListener('click', (e) => {
        if (nav && nav.classList.contains('active')) {
            if (!e.target.isConnected) return;
            if (!nav.contains(e.target) && mobileToggle && !mobileToggle.contains(e.target)) {
                closeMenu();
            }
        }
    });

    // Global delegation for mobile accordion dropdowns
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
            const dropdownToggle = e.target.closest('.mobile-dropdown-toggle');
            if (dropdownToggle) {
                e.preventDefault();
                e.stopPropagation();
                const dropdown = dropdownToggle.parentElement;
                dropdown.classList.toggle('active');
            }
        }
    });

    // Close mobile menu when any normal navigation link inside `.nav` is clicked
    if (nav) {
        nav.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link) {
                closeMenu();
            }
        });
    }

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

    // ── Auto-apply scroll-reveal to all elements across the entire website ──
    document.querySelectorAll('section, .section, .itinerary-day, .info-col, .link-col, .tripadvisor-card, .footer-col, .about-content, .contact-grid > div, .form-container, .safari-card, .package-card, .blog-card, .detail-card, .faq-item, .gallery-item, .card, .container > p, .container > img').forEach((el) => {
        if (!el.classList.contains('scroll-reveal') && !el.classList.contains('scroll-reveal-left') && !el.classList.contains('scroll-reveal-right') && !el.classList.contains('scroll-reveal-scale')) {
            el.classList.add('scroll-reveal');
        }
        observer.observe(el);
    });

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

    const setupDestinationCarousel = () => {
        const container = document.querySelector('.destinations-slider-container');
        if (!container) return;

        const wrapper = container.querySelector('.destinations-slider-wrapper');
        const track = container.querySelector('.destinations-slider-track');
        const prev = container.querySelector('.dest-arrow-left');
        const next = container.querySelector('.dest-arrow-right');
        if (!wrapper || !track) return;

        const getStep = () => {
            const card = track.querySelector('.destination-card');
            const gap = parseFloat(getComputedStyle(track).gap) || 0;
            return card ? card.getBoundingClientRect().width + gap : wrapper.clientWidth;
        };

        const move = (direction = 1) => {
            const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
            const nextLeft = wrapper.scrollLeft + (getStep() * direction);
            if (nextLeft > maxScroll - 8) {
                wrapper.scrollTo({ left: 0, behavior: 'smooth' });
            } else if (nextLeft < 0) {
                wrapper.scrollTo({ left: maxScroll, behavior: 'smooth' });
            } else {
                wrapper.scrollTo({ left: nextLeft, behavior: 'smooth' });
            }
        };

        prev?.addEventListener('click', () => move(-1));
        next?.addEventListener('click', () => move(1));

        let timer = setInterval(() => move(1), 4000);
        const pause = () => clearInterval(timer);
        const resume = () => {
            clearInterval(timer);
            timer = setInterval(() => move(1), 4000);
        };

        container.addEventListener('mouseenter', pause);
        container.addEventListener('mouseleave', resume);
        container.addEventListener('touchstart', pause, { passive: true });
        container.addEventListener('touchend', resume, { passive: true });
    };

    const setupDragScroll = (selector) => {
        document.querySelectorAll(selector).forEach(wrapper => {
            if (wrapper.dataset.dragScrollReady) return;
            wrapper.dataset.dragScrollReady = 'true';

            let isDragging = false;
            let startX = 0;
            let scrollLeft = 0;

            wrapper.addEventListener('pointerdown', (event) => {
                if (event.pointerType === 'mouse' && event.button !== 0) return;
                isDragging = true;
                startX = event.clientX;
                scrollLeft = wrapper.scrollLeft;
                wrapper.classList.add('dragging');
                wrapper.setPointerCapture?.(event.pointerId);
            });

            wrapper.addEventListener('pointermove', (event) => {
                if (!isDragging) return;
                wrapper.scrollLeft = scrollLeft - (event.clientX - startX);
            });

            ['pointerup', 'pointercancel', 'pointerleave'].forEach(type => {
                wrapper.addEventListener(type, (event) => {
                    if (!isDragging) return;
                    isDragging = false;
                    wrapper.classList.remove('dragging');
                    wrapper.releasePointerCapture?.(event.pointerId);
                });
            });
        });
    };

    setupDestinationCarousel();
    setupDragScroll('.destinations-slider-wrapper');

    // ── Unified Infinite Marquee Slider Engine ──
    const initInfiniteMarquees = () => {
        const wrappers = document.querySelectorAll('.marquee-wrapper');
        wrappers.forEach(wrapper => {
            const track = wrapper.querySelector('.marquee-track');
            if (!track) return;

            // Kill CSS animation to let JS inline translation take absolute control
            track.style.animation = 'none';
            track.style.webkitAnimation = 'none';

            const container = wrapper.closest('.marquee-container');
            const leftArrow = container ? container.querySelector('.marquee-arrow-left') : null;
            const rightArrow = container ? container.querySelector('.marquee-arrow-right') : null;

            // Find dynamic width of a card (card width + gap)
            const firstCard = track.querySelector('.safari-card, .experience-card, .tip-card, .team-card');
            
            const getCardWidth = () => {
                const currentGap = window.innerWidth <= 768 ? 14 : 30;
                return firstCard ? (firstCard.offsetWidth + currentGap) : 380;
            };

            let cardWidth = getCardWidth();
            let halfWidth = track.scrollWidth / 2;

            // Recalculate track geometry when sizes change
            const recomputeGeometry = () => {
                cardWidth = getCardWidth();
                halfWidth = track.scrollWidth / 2;
            };

            window.addEventListener('resize', recomputeGeometry);

            // Recompute once images are fully loaded
            const images = track.querySelectorAll('img');
            images.forEach(img => {
                if (img.complete) {
                    recomputeGeometry();
                } else {
                    img.addEventListener('load', recomputeGeometry);
                }
            });

            // Direction configuration: marquee-right moves to the right, others move to the left
            const isRightMarquee = track.classList.contains('marquee-right');
            const baseSpeed = isRightMarquee ? 0.7 : -0.7; // pixels per frame at 60fps

            let posX = isRightMarquee ? -halfWidth : 0;
            let targetX = null;
            let isDragging = false;
            let isAnimating = false;
            let startX = 0;
            let startTranslateX = 0;
            let lastX = 0;
            let velocity = 0;
            let paused = false;
            let resumeTimeout = null;

            const setPosition = (x) => {
                posX = x;
                // Infinite seamless loop logic:
                if (posX > 0) {
                    // Scrolled left past origin -> teleport back equivalent position
                    posX -= halfWidth;
                    if (targetX !== null) targetX -= halfWidth;
                    if (isDragging) {
                        startX += halfWidth;
                    }
                } else if (Math.abs(posX) >= halfWidth) {
                    // Scrolled right past width limit -> teleport forward equivalent position
                    posX += halfWidth;
                    if (targetX !== null) targetX += halfWidth;
                    if (isDragging) {
                        startX -= halfWidth;
                    }
                }
                track.style.transform = `translateX(${posX}px)`;
            };

            // Setup initial position
            setPosition(posX);

            // Frame animation loop
            let lastTime = performance.now();
            const animateLoop = (time) => {
                // Determine delta time to guarantee constant speed across different refresh rates (60hz vs 120hz)
                const dt = Math.min((time - lastTime) / 16.666, 3);
                lastTime = time;

                if (isDragging) {
                    // Decay velocity for drag release inertia
                    velocity *= 0.95;
                } else if (isAnimating && targetX !== null) {
                    const dx = targetX - posX;
                    if (Math.abs(dx) < 0.5) {
                        setPosition(targetX);
                        isAnimating = false;
                        targetX = null;
                    } else {
                        // Smooth cubic-like interpolation
                        setPosition(posX + dx * 0.15 * dt);
                    }
                } else if (!paused) {
                    // Standard smooth auto-scrolling
                    setPosition(posX + baseSpeed * dt);
                }

                requestAnimationFrame(animateLoop);
            };
            requestAnimationFrame(animateLoop);

            // Touch / Mouse Drag handlers
            const startDrag = (clientX) => {
                isDragging = true;
                paused = true;
                isAnimating = false;
                targetX = null;
                clearTimeout(resumeTimeout);

                startX = clientX;
                startTranslateX = posX;
                lastX = clientX;
                velocity = 0;
                wrapper.classList.add('dragging');
            };

            const onDrag = (clientX) => {
                if (!isDragging) return;
                const deltaX = clientX - startX;
                velocity = clientX - lastX;
                lastX = clientX;
                setPosition(startTranslateX + deltaX);
            };

            const endDrag = () => {
                if (!isDragging) return;
                isDragging = false;
                wrapper.classList.remove('dragging');

                // Apply scroll momentum inertia
                if (Math.abs(velocity) > 1.5) {
                    isAnimating = true;
                    const momentum = velocity * 12;
                    targetX = posX + momentum;
                    
                    // Align position to card layout boundaries
                    const currentCardWidth = getCardWidth();
                    targetX = Math.round(targetX / currentCardWidth) * currentCardWidth;
                }

                // Smoothly transition back to auto-scrolling after 4 seconds of user inactivity
                resumeTimeout = setTimeout(() => {
                    isAnimating = false;
                    targetX = null;
                    paused = false;
                }, 4000);
            };

            // Drag Mouse Listeners
            wrapper.addEventListener('mousedown', (e) => {
                e.preventDefault();
                startDrag(e.clientX);
            });
            window.addEventListener('mousemove', (e) => {
                onDrag(e.clientX);
            });
            window.addEventListener('mouseup', () => {
                endDrag();
            });

            // Drag Touch Listeners (Mobile compatibility)
            wrapper.addEventListener('touchstart', (e) => {
                startDrag(e.touches[0].clientX);
            }, { passive: true });
            wrapper.addEventListener('touchmove', (e) => {
                onDrag(e.touches[0].clientX);
            }, { passive: true });
            wrapper.addEventListener('touchend', () => {
                endDrag();
            }, { passive: true });

            // Arrow control actions
            const scrollMarquee = (direction) => {
                paused = true;
                isAnimating = true;
                clearTimeout(resumeTimeout);

                const currentCardWidth = getCardWidth();
                // Find index based on current offset
                const currentCardIndex = Math.round(posX / currentCardWidth);
                const shift = direction === 'left' ? 1 : -1;
                targetX = (currentCardIndex + shift) * currentCardWidth;

                // Resume auto-scroll after 4s
                resumeTimeout = setTimeout(() => {
                    isAnimating = false;
                    targetX = null;
                    paused = false;
                }, 4000);
            };

            if (leftArrow) {
                leftArrow.addEventListener('click', (e) => {
                    e.preventDefault();
                    scrollMarquee('left');
                });
            }
            if (rightArrow) {
                rightArrow.addEventListener('click', (e) => {
                    e.preventDefault();
                    scrollMarquee('right');
                });
            }

            // Hover control (Pause on hover for desktop)
            wrapper.addEventListener('mouseenter', () => {
                if (!isDragging) paused = true;
            });
            wrapper.addEventListener('mouseleave', () => {
                if (!isDragging && !isAnimating && targetX === null) {
                    paused = false;
                }
            });
        });
    };

    // Initialize the infinite marquee engine
    initInfiniteMarquees();

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
    // ── Statistics Counting Animation ──
    const statsSection = document.querySelector('.stats-section');
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    if (statsSection && statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !animated) {
                statNumbers.forEach(num => {
                    const targetAttr = num.getAttribute('data-target');
                    if (!targetAttr) return;
                    const target = parseInt(targetAttr);
                    const duration = 2000;
                    const startTime = performance.now();

                    const update = (now) => {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const current = Math.floor(progress * target);
                        
                        let suffix = "";
                        if(num.textContent.includes('+')) suffix = "+";
                        if(num.textContent.includes('%')) suffix = "%";
                        if(num.textContent.includes('k')) suffix = "k+";
                        
                        num.textContent = current + suffix;

                        if (progress < 1) {
                            requestAnimationFrame(update);
                        } else {
                            num.textContent = target + suffix;
                        }
                    };
                    requestAnimationFrame(update);
                });
                animated = true;
            }
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    // ── Inject Floating WhatsApp Button ──
    if (!document.querySelector('.whatsapp-float')) {
        const whatsappBtn = document.createElement('a');
        whatsappBtn.href = "https://wa.me/255747115390"; 
        whatsappBtn.target = "_blank";
        whatsappBtn.className = "whatsapp-float";
        whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i><span>Chat with us</span>';
        document.body.appendChild(whatsappBtn);
    }
    // ── Inject Tawk.to Live Chat ──
    var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
    (function(){
    var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
    s1.async=true;
    s1.src='https://embed.tawk.to/YOUR_PROPERTY_ID/default';
    s1.charset='UTF-8';
    s1.setAttribute('crossorigin','*');
    s0.parentNode.insertBefore(s1,s0);
    })();

    // ── Exceptional Feature: Currency Converter ──
    const exchangeRates = { USD: 1, TZS: 2600, EUR: 0.92, GBP: 0.79 };
    window.convertCurrency = (amount, to) => {
        return (amount * exchangeRates[to]).toLocaleString();
    };

    // ── Exceptional Feature: Weather Mock ──
    const locations = ["Serengeti", "Zanzibar", "Ngorongoro"];
    const weatherSection = document.createElement('div');
    weatherSection.className = 'weather-widget';
    weatherSection.innerHTML = `
        <div class="weather-item">
            <i class="fas fa-sun"></i>
            <span>Serengeti: 28°C</span>
        </div>
    `;
    // ── Global Form Submission Handler ──
    document.addEventListener('submit', (e) => {
        // Prevent actual page navigation/reload
        e.preventDefault();
        
        const form = e.target;
        
        // Skip assistant widget forms as they are handled by their own listeners
        if (form.id === 'quoteForm' || form.id === 'reportForm' || form.id === 'supportForm') {
            return;
        }
        
        const lang = localStorage.getItem('century-lang') || 'en';
        
        let name = '';
        let email = '';
        let phone = '';
        let message = '';
        let text = '';
        let categoryId = 'general';
        
        const isContactForm = form.querySelector('#safari_type') || window.location.pathname.includes('contact.html') || form.id === 'contactForm';
        const isBookForm = window.location.pathname.includes('book.html') && form.id === 'mainBookingForm';
        const isEnquireForm = window.location.pathname.includes('enquire.html') && form.id === 'mainBookingForm';
        const isSafariPageBookingForm = form.classList.contains('booking-form') && !isBookForm && !isContactForm;
        const isCustomExperienceForm = form.classList.contains('custom-experience-form') || form.id === 'customExperienceForm';
        
        if (isContactForm) {
            name = form.querySelector('#name')?.value || '';
            email = form.querySelector('#email')?.value || '';
            phone = form.querySelector('#phone')?.value || '';
            const safariType = form.querySelector('#safari_type')?.value || '';
            const travelDate = form.querySelector('#travel_date')?.value || '';
            const travelers = form.querySelector('#travelers')?.value || '';
            message = form.querySelector('#message')?.value || '';
            
            categoryId = (safariType === 'wildlife' || safariType === 'custom') ? 'safari' : 'travel';
            
            text = `📬 Contact Us Form Inquiry:\n` +
                   `• Name: ${name}\n` +
                   `• Email: ${email}\n` +
                   `• Phone: ${phone}\n` +
                   `• Safari Type: ${safariType}\n` +
                   `• Travel Date: ${travelDate}\n` +
                   `• Guests: ${travelers}\n` +
                   `• Message: ${message}`;
        } else if (isCustomExperienceForm) {
            name = form.querySelector('[name="name"]')?.value || '';
            email = form.querySelector('[name="email"]')?.value || '';
            phone = form.querySelector('[name="phone"]')?.value || '';
            const style = form.querySelector('[name="experience_style"]')?.value || '';
            message = form.querySelector('[name="message"]')?.value || '';
            
            categoryId = 'sales';
            text = `✨ Custom Experience Request:\n` +
                   `• Name: ${name}\n` +
                   `• Email: ${email}\n` +
                   `• Phone: ${phone}\n` +
                   `• Experience Style: ${style}\n` +
                   `• Message: ${message}`;
        } else if (isBookForm) {
            // Text inputs
            const textInputs = Array.from(form.querySelectorAll('input[type="text"]'));
            name = textInputs[0]?.value || '';
            email = form.querySelector('input[type="email"]')?.value || '';
            phone = form.querySelector('input[type="tel"]')?.value || '';
            const country = textInputs[1]?.value || '';
            
            // Checked checkboxes
            const destinations = Array.from(form.querySelectorAll('input[name="destinations"]:checked')).map(cb => cb.value);
            const travelTypes = Array.from(form.querySelectorAll('input[name="travel_type"]:checked')).map(cb => cb.value);
            
            // Numbers
            const numInputs = Array.from(form.querySelectorAll('input[type="number"]'));
            const adults = parseInt(numInputs[0]?.value) || 1;
            const children = parseInt(numInputs[1]?.value) || 0;
            
            // Dates
            const dateInputs = Array.from(form.querySelectorAll('input[type="date"]'));
            const arrival = dateInputs[0]?.value || '';
            const departure = dateInputs[1]?.value || '';
            
            // Radios
            const flexibleDates = form.querySelector('input[name="flexible_dates"]:checked')?.value || 'Yes';
            const travelStyle = form.querySelector('input[name="travel_style"]:checked')?.value || 'Budget';
            
            // Preferences & Special
            const preferences = Array.from(form.querySelectorAll('input[name="preferences"]:checked')).map(cb => cb.value);
            const specials = Array.from(form.querySelectorAll('input[name="special"]:checked')).map(cb => cb.value);
            
            message = form.querySelector('textarea')?.value || '';
            
            categoryId = 'safari';
            
            text = `⚡ Safari Booking Request:\n` +
                   `• Name: ${name}\n` +
                   `• Email: ${email}\n` +
                   `• Phone: ${phone}\n` +
                   `• Country: ${country}\n` +
                   `• Destinations: ${destinations.join(', ') || 'Not specified'}\n` +
                   `• Travel Type: ${travelTypes.join(', ') || 'Not specified'}\n` +
                   `• Travelers: ${adults} Adults, ${children} Children\n` +
                   `• Dates: ${arrival} to ${departure} (Flexible: ${flexibleDates})\n` +
                   `• Comfort Level: ${travelStyle}\n` +
                   `• Preferences: ${preferences.join(', ') || 'None'}\n` +
                   `• Special Requests: ${specials.join(', ') || 'None'}\n` +
                   `• Notes: ${message}`;
                   
            // Save to century-bookings too!
            let duration = 7;
            if (arrival && departure) {
                const diffTime = Math.abs(new Date(departure) - new Date(arrival));
                duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
            }
            const guests = adults + children;
            let dailyRate = 150;
            if (travelStyle === 'Mid-Range') dailyRate = 300;
            else if (travelStyle === 'Luxury') dailyRate = 650;
            else if (travelStyle === 'Ultra-Luxury') dailyRate = 1200;
            
            const estimatePrice = dailyRate * duration * guests;
            
            const booking = {
                id: 'BK-' + Date.now(),
                name: name,
                email: email,
                duration: duration,
                guests: guests,
                lodging: travelStyle.toLowerCase(),
                destinations: destinations.length > 0 ? destinations : ['custom'],
                activities: [],
                notes: message,
                estimatePrice: estimatePrice,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: 'PENDING'
            };
            
            let bookings = [];
            try {
                bookings = JSON.parse(localStorage.getItem('century-bookings')) || [];
            } catch(err) {
                bookings = [];
            }
            bookings.push(booking);
            localStorage.setItem('century-bookings', JSON.stringify(bookings));
        } else if (isEnquireForm) {
            name = form.querySelector('[name="name"]')?.value || '';
            email = form.querySelector('[name="email"]')?.value || '';
            phone = form.querySelector('[name="phone"]')?.value || '';
            const guests = form.querySelector('[name="guests"]')?.value || '';
            const travelDate = form.querySelector('[name="travel_date"]')?.value || '';
            const destination = form.querySelector('[name="destination"]')?.value || '';
            const experience = form.querySelector('[name="experience_type"]')?.value || '';
            const budget = form.querySelector('[name="budget"]')?.value || '';
            message = form.querySelector('[name="message"]')?.value || '';
            
            categoryId = 'pricing';
            
            text = `📋 Quote Enquiry:\n` +
                   `• Name: ${name}\n` +
                   `• Email: ${email}\n` +
                   `• Phone: ${phone}\n` +
                   `• Guests: ${guests}\n` +
                   `• Travel Date: ${travelDate}\n` +
                   `• Destination: ${destination}\n` +
                   `• Experience: ${experience}\n` +
                   `• Budget: ${budget}\n` +
                   `• Message: ${message}`;
        } else if (isSafariPageBookingForm) {
            name = form.querySelector('input[placeholder*="Name"], input[type="text"]:first-of-type')?.value || '';
            email = form.querySelector('input[type="email"]')?.value || '';
            phone = form.querySelector('input[type="tel"]')?.value || '';
            const country = form.querySelector('input[placeholder*="Country"], input[placeholder*="Your Country"]')?.value || '';
            const numInputs = Array.from(form.querySelectorAll('input[type="number"]'));
            const adults = parseInt(numInputs[0]?.value) || 1;
            const children = parseInt(numInputs[1]?.value) || 0;
            const travelDate = form.querySelector('input[type="date"]')?.value || '';
            message = form.querySelector('textarea')?.value || '';
            
            const packageName = document.querySelector('.trip-hero h1')?.textContent || document.title.split('|')[0].trim() || 'Safari Package';
            
            categoryId = 'safari';
            
            text = `🦁 Safari Booking Request:\n` +
                   `• Package: ${packageName}\n` +
                   `• Name: ${name}\n` +
                   `• Email: ${email}\n` +
                   `• Phone: ${phone}\n` +
                   `• Country: ${country}\n` +
                   `• Travelers: ${adults} Adults, ${children} Children\n` +
                   `• Travel Date: ${travelDate}\n` +
                   `• Special Requests: ${message}`;
                    
            const durationMatch = packageName.match(/(\d+)-Day/i);
            const duration = durationMatch ? parseInt(durationMatch[1]) : 7;
            const guests = adults + children;
            const estimatePrice = 250 * duration * guests;
            
            const booking = {
                id: 'BK-' + Date.now(),
                name: name,
                email: email,
                duration: duration,
                guests: guests,
                lodging: 'midrange',
                destinations: [packageName.toLowerCase().includes('zanzibar') ? 'zanzibar' : 'serengeti'],
                activities: [],
                notes: `Package: ${packageName}. Special requests: ${message}`,
                estimatePrice: estimatePrice,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: 'PENDING'
            };
            
            let bookings = [];
            try {
                bookings = JSON.parse(localStorage.getItem('century-bookings')) || [];
            } catch(err) {
                bookings = [];
            }
            bookings.push(booking);
            localStorage.setItem('century-bookings', JSON.stringify(bookings));
        } else {
            // General forms fallback
            email = form.querySelector('input[type="email"]')?.value || '';
            name = form.querySelector('input[type="text"]')?.value || '';
            message = form.querySelector('textarea')?.value || '';
            
            if (email || name || message) {
                text = `💬 General Form Submission:\n` +
                       `• Name: ${name || 'N/A'}\n` +
                       `• Email: ${email || 'N/A'}\n` +
                       `• Message: ${message || 'N/A'}`;
            }
        }
        
        // Save conversation if text was generated
        if (text) {
            let conversations = [];
            try {
                conversations = JSON.parse(localStorage.getItem('century-conversations')) || [];
            } catch(err) {
                conversations = [];
            }
            
            const visitorIdVal = name && email ? `${name} (${email})` : (localStorage.getItem('century-visitor-id') || 'visitor-' + Date.now());
            
            let department = 'info';
            if (categoryId === 'safari') department = 'booking';
            else if (categoryId === 'pricing' || categoryId === 'sales') department = 'sales';
            else if (categoryId === 'problem' || categoryId === 'support') department = 'support';
 
            const conv = {
                id: 'conv-' + Date.now(),
                visitorId: visitorIdVal,
                categoryId: categoryId,
                department: department,
                messages: [{
                    id: 'msg-' + Date.now(),
                    sender: 'visitor',
                    text: text,
                    timestamp: Date.now()
                }],
                createdAt: Date.now(),
                updatedAt: Date.now(),
                status: 'open',
                unreadByStaff: true
            };
            conversations.push(conv);
            localStorage.setItem('century-conversations', JSON.stringify(conversations));
 
            // Trigger mailto route to configured department email address
            const getRouteEmail = () => {
                const defaults = {
                    info: 'info@century-adventures.com',
                    booking: 'bookings@century-adventures.com',
                    support: 'admin@century-adventures.com',
                    sales: 'visit@century-adventures.com',
                    visit: 'visit@century-adventures.com'
                };
                try {
                    const saved = JSON.parse(localStorage.getItem('century-routing-emails')) || defaults;
                    if (isBookForm || isSafariPageBookingForm) return saved.booking || defaults.booking;
                    if (isEnquireForm || isCustomExperienceForm) return saved.sales || defaults.sales;
                    return saved.info || defaults.info;
                } catch(e) {
                    if (isBookForm || isSafariPageBookingForm) return defaults.booking;
                    if (isEnquireForm || isCustomExperienceForm) return defaults.sales;
                    return defaults.info;
                }
            };
            const routeEmail = getRouteEmail();
            const ccEmail = 'admin@century-adventures.com';
            const subjectPrefix = isBookForm || isSafariPageBookingForm ? 'Safari Booking Request' : (isEnquireForm ? 'Quote Inquiry' : (isCustomExperienceForm ? 'Custom Experience Request' : 'Contact Inquiry'));
            const mailSubject = `${subjectPrefix} - Century Adventures`;
            const mailBody = `${text}\n\nVisitor ID: ${visitorIdVal}`;
            
            window.open(`mailto:${routeEmail}?cc=${ccEmail}&subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`, '_self');
        }
        
        // Show alerts
        let alertMsg = '';
        if (isBookForm || isSafariPageBookingForm || isEnquireForm || form.classList.contains('booking-form') || form.id === 'mainBookingForm') {
            alertMsg = lang === 'sw' 
                ? 'Asante kwa ombi lako! Ombi lako limepokelewa. Wataalamu wetu wa safari watawasiliana nawe ndani ya saa 24 ili kukusaidia kupanga safari yako.'
                : 'Thank you for your enquiry! Your request has been received. Our safari experts will contact you within 24 hours to help plan your adventure.';
            alert(alertMsg);
            form.reset();
        } else if (isCustomExperienceForm) {
            alertMsg = lang === 'sw'
                ? 'Asante! Ombi lako la uzoefu maalum limepokelewa. Washauri wetu watawasiliana nawe ndani ya saa 24.'
                : 'Thank you! Your custom experience request has been received. Our travel planners will contact you within 24 hours.';
            alert(alertMsg);
            form.reset();
        } else if (form.classList.contains('pay-form')) {
            alertMsg = lang === 'sw'
                ? 'Asante! Maelezo yako salama ya malipo yamewasilishwa kwa uhakiki. Tutashughulikia uhifadhi wako mara moja na kukutumia barua pepe ya uthibitisho.'
                : 'Thank you! Your secure payment details have been submitted for verification. We will process your booking immediately and send a confirmation email.';
            alert(alertMsg);
            form.reset();
        } else {
            alertMsg = lang === 'sw'
                ? 'Asante! Ujumbe wako umetumwa kwa mafanikio. Washauri wetu watawasiliana nawe hivi karibuni.'
                : 'Thank you! Your inquiry has been sent successfully. Our consultants will contact you shortly.';
            alert(alertMsg);
            form.reset();
        }
    });

    // ── Global Hero Section Dynamic Slideshow ──
    const initHeroSlideshow = () => {
        // Match any common hero container classes
        const hero = document.querySelector('.hero, .trip-hero, .vol-hero, .fleet-hero, .safaris-page-hero, .about-hero');
        if (!hero) return;

        // Ensure relative positioning for absolute positioning of slide layers
        if (window.getComputedStyle(hero).position === 'static') {
            hero.style.position = 'relative';
        }
        // List of premium, high-resolution slideshow images
        const slideshowImages = [
            'assets/kilimanjalo.png',
            'assets/lion5.jpeg',
            'assets/zanzibar1.jpg',
            'assets/three-giraffe.jpg'
        ];

        // Try to extract original background image
        let originalBg = '';
        const bgStyle = hero.style.backgroundImage || window.getComputedStyle(hero).backgroundImage;
        if (bgStyle && bgStyle !== 'none') {
            const match = bgStyle.match(/url\(['"]?([^'")]+)['"]?\)/);
            if (match) {
                originalBg = match[1];
            }
        }

        // Build unique list with original background first
        const images = [originalBg, ...slideshowImages].filter((img, idx, self) => img && self.indexOf(img) === idx);

        if (images.length <= 1) return; // No need to cycle if only 1 image or none

        // Create slide elements
        const bgWrapper = document.createElement('div');
        bgWrapper.className = 'hero-bg-slideshow';

        const slide1 = document.createElement('div');
        slide1.className = 'hero-bg-slide active';
        slide1.style.backgroundImage = `url('${images[0]}')`;

        const slide2 = document.createElement('div');
        slide2.className = 'hero-bg-slide';

        const overlay = document.createElement('div');
        overlay.className = 'hero-bg-overlay';

        bgWrapper.appendChild(slide1);
        bgWrapper.appendChild(slide2);
        bgWrapper.appendChild(overlay);

        // Prepend inside hero container so it sits behind the actual content
        hero.insertBefore(bgWrapper, hero.firstChild);

        // Preload the rest of the images
        images.slice(1).forEach(url => {
            const img = new Image();
            img.src = url;
        });

        // Slideshow transition logic
        let currentSlide = slide1;
        let nextSlide = slide2;
        let imageIndex = 0;

        setInterval(() => {
            imageIndex = (imageIndex + 1) % images.length;
            const nextImgUrl = images[imageIndex];

            // Set background of the next slide and fade it in
            nextSlide.style.backgroundImage = `url('${nextImgUrl}')`;
            
            // Toggle active classes to trigger CSS opacity transitions
            nextSlide.classList.add('active');
            currentSlide.classList.remove('active');

            // Swap slide references
            const temp = currentSlide;
            currentSlide = nextSlide;
            nextSlide = temp;
        }, 6000); // Transitions every 6 seconds
    };

    // ── Global Image Optimization: Ensure all images are lazy-loaded ──
    const optimizeImages = () => {
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('loading') && !img.classList.contains('lightbox-img')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    };

    // ── Wishlist & Tour Compare Engine ──
    const initWishlistAndCompare = () => {
        const wishlistFloat = document.createElement('div');
        wishlistFloat.className = 'wishlist-float';
        wishlistFloat.innerHTML = '<i class="fas fa-heart"></i><span class="count">0</span>';
        document.body.appendChild(wishlistFloat);

        const wishlistDrawer = document.createElement('div');
        wishlistDrawer.className = 'wishlist-drawer';
        wishlistDrawer.id = 'wishlistDrawer';
        wishlistDrawer.innerHTML = `
            <div class="wishlist-drawer-header">
                <h3 data-en="Saved Safaris" data-sw="Safari Zilizohifadhiwa"><i class="fas fa-heart"></i> Saved Safaris</h3>
                <button class="close-wishlist">&times;</button>
            </div>
            <div class="wishlist-drawer-content" id="wishlistItems"></div>
        `;
        document.body.appendChild(wishlistDrawer);

        const compareBar = document.createElement('div');
        compareBar.className = 'compare-bar';
        compareBar.id = 'compareBar';
        compareBar.innerHTML = `
            <span id="compareBarText" data-en="Select tours to compare" data-sw="Chagua safari za kulinganisha">Select tours to compare</span>
            <button class="btn btn-primary" id="compareBarBtn" disabled data-en="Compare Now" data-sw="Linganisha Sasa">Compare Now</button>
        `;
        document.body.appendChild(compareBar);

        const compareModal = document.createElement('div');
        compareModal.className = 'compare-modal';
        compareModal.id = 'compareModal';
        compareModal.innerHTML = `
            <div class="compare-modal-content">
                <button class="close-compare">&times;</button>
                <h3 data-en="Tour Comparison" data-sw="Ulinganisho wa Safari"><i class="fas fa-columns"></i> Tour Comparison</h3>
                <div class="compare-table-wrapper">
                    <table class="compare-table" id="compareTable"></table>
                </div>
            </div>
        `;
        document.body.appendChild(compareModal);

        let wishlist = JSON.parse(localStorage.getItem('century-wishlist')) || [];
        let compareList = [];

        const updateWishlistUI = () => {
            wishlistFloat.querySelector('.count').textContent = wishlist.length;
            wishlistFloat.style.display = wishlist.length > 0 ? 'flex' : 'none';

            const container = document.getElementById('wishlistItems');
            if (wishlist.length === 0) {
                container.innerHTML = '<p class="empty-msg" style="color:var(--text-muted); font-size:0.9rem; text-align:center; margin-top:30px;" data-en="No saved safaris yet. Heart a safari card to save it!" data-sw="Hakuna safari zilizohifadhiwa bado. Bofya alama ya moyo kwenye kadi ya safari ili kuihifadhi!">No saved safaris yet. Heart a safari card to save it!</p>';
                return;
            }

            container.innerHTML = wishlist.map((item, idx) => `
                <div class="wishlist-item" style="display:flex; gap:15px; margin-bottom:20px; padding-bottom:15px; border-bottom:1px solid var(--border-color); position:relative;">
                    <img src="${item.img}" style="width:80px; height:60px; object-fit:cover; border-radius:8px;">
                    <div style="flex:1;">
                        <h4 style="margin:0 0 5px 0; font-size:0.95rem;"><a href="${item.link}" style="color:var(--text-main); font-weight:700;">${item.title}</a></h4>
                        <p style="margin:0; font-size:0.85rem; color:var(--accent-gold); font-weight:700;">${item.price}</p>
                    </div>
                    <button class="remove-wishlist-item" onclick="removeWishlistItem('${item.title.replace(/'/g, "\\'")}')" style="background:transparent; border:none; font-size:1.4rem; cursor:pointer; color:var(--text-muted); align-self:flex-start;">&times;</button>
                </div>
            `).join('');
        };

        window.removeWishlistItem = (title) => {
            wishlist = wishlist.filter(item => item.title !== title);
            localStorage.setItem('century-wishlist', JSON.stringify(wishlist));
            updateWishlistUI();
            
            document.querySelectorAll('.safari-card, .package-card, .mini-card').forEach(card => {
                const cardTitleEl = card.querySelector('h3');
                if (cardTitleEl && cardTitleEl.textContent.trim() === title) {
                    const heart = card.querySelector('.wishlist-heart-btn i');
                    if (heart) {
                        heart.className = 'far fa-heart';
                    }
                }
            });
        };

        const toggleWishlistDrawer = (show) => {
            wishlistDrawer.classList.toggle('active', show);
        };

        wishlistFloat.addEventListener('click', () => toggleWishlistDrawer(true));
        wishlistDrawer.querySelector('.close-wishlist').addEventListener('click', () => toggleWishlistDrawer(false));

        const cards = document.querySelectorAll('.safari-card, .package-card, .mini-card');
        cards.forEach((card, idx) => {
            const h3 = card.querySelector('h3');
            const linkEl = card.querySelector('a.btn-primary, a.btn-card, a');
            const imgEl = card.querySelector('img');
            if (!h3 || !imgEl) return;

            const title = h3.textContent.trim();
            const link = linkEl ? linkEl.getAttribute('href') : '#';
            const img = imgEl.getAttribute('src');
            
            const priceEl = card.querySelector('.price');
            const price = priceEl ? priceEl.textContent.trim() : 'Custom Enquiry';

            if (window.getComputedStyle(card).position === 'static') {
                card.style.position = 'relative';
            }

            const heartBtn = document.createElement('button');
            heartBtn.type = 'button';
            heartBtn.className = 'wishlist-heart-btn';
            
            const isSaved = wishlist.some(item => item.title === title);
            heartBtn.innerHTML = `<i class="${isSaved ? 'fas fa-heart' : 'far fa-heart'}"></i>`;
            
            heartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const heart = heartBtn.querySelector('i');
                const idxSaved = wishlist.findIndex(item => item.title === title);
                
                if (idxSaved > -1) {
                    wishlist.splice(idxSaved, 1);
                    heart.className = 'far fa-heart';
                } else {
                    wishlist.push({ title, link, img, price });
                    heart.className = 'fas fa-heart';
                }
                
                localStorage.setItem('century-wishlist', JSON.stringify(wishlist));
                updateWishlistUI();
            });
            card.appendChild(heartBtn);

            // Compare Tour logic removed
        });

        const updateCompareBar = () => {
            const btn = document.getElementById('compareBarBtn');
            const bar = document.getElementById('compareBar');
            const text = document.getElementById('compareBarText');

            const assistantBtn = document.getElementById('assistantFloatBtn');
            if (compareList.length > 0) {
                bar.classList.add('active');
                // Shift the assistant float up so compare bar does not overlap it
                if (assistantBtn) assistantBtn.classList.add('shifted-up');
                const lang = localStorage.getItem('century-lang') || 'en';
                if (lang === 'sw') {
                    text.textContent = `${compareList.length} safari zilizochaguliwa kwa ajili ya kulinganisha`;
                } else {
                    text.textContent = `${compareList.length} tour${compareList.length > 1 ? 's' : ''} selected for comparison`;
                }
                btn.disabled = compareList.length < 2;
            } else {
                bar.classList.remove('active');
                // Restore assistant float position
                if (assistantBtn) assistantBtn.classList.remove('shifted-up');
            }
        };

        const openCompareModal = () => {
            const table = document.getElementById('compareTable');
            compareModal.classList.add('active');
            const lang = localStorage.getItem('century-lang') || 'en';

            const labels = {
                feature: lang === 'sw' ? 'Kipengele' : 'Feature',
                photo: lang === 'sw' ? 'Picha' : 'Photo',
                price: lang === 'sw' ? 'Makadirio ya Bei' : 'Price Estimate',
                inclusions: lang === 'sw' ? 'Vilivyojumuishwa' : 'Inclusions',
                exclusions: lang === 'sw' ? 'Visivyojumuishwa' : 'Exclusions',
                action: lang === 'sw' ? 'Hatua' : 'Action',
                viewDetails: lang === 'sw' ? 'Angalia Maelezo' : 'View Details',
                incDetail: lang === 'sw' ? 'Ada za Hifadhi, Malazi, Gari la 4x4, Mwongozo Binafsi, Chakula' : 'Park Fees, Accommodation, 4x4 Vehicle, Private Guide, Chef Meals',
                excDetail: lang === 'sw' ? 'Ndege, Bakshishi, Visa, Vitu Binafsi' : 'Flights, Tips, Visas, Personal Items'
            };

            let html = `
                <tr>
                    <th style="font-weight:700;">${labels.feature}</th>
                    ${compareList.map(item => `<th style="font-weight:700;">${item.title}</th>`).join('')}
                </tr>
                <tr>
                    <td style="font-weight:600;">${labels.photo}</td>
                    ${compareList.map(item => `<td><img src="${item.img}" style="width:120px; height:80px; object-fit:cover; border-radius:8px;"></td>`).join('')}
                </tr>
                <tr>
                    <td style="font-weight:600;">${labels.price}</td>
                    ${compareList.map(item => `<td><strong style="color:var(--accent-gold);">${item.price}</strong></td>`).join('')}
                </tr>
                <tr>
                    <td style="font-weight:600;">${labels.inclusions}</td>
                    ${compareList.map(item => `<td style="font-size:0.82rem; color:var(--text-muted);">${labels.incDetail}</td>`).join('')}
                </tr>
                <tr>
                    <td style="font-weight:600;">${labels.exclusions}</td>
                    ${compareList.map(item => `<td style="font-size:0.82rem; color:var(--text-muted);">${labels.excDetail}</td>`).join('')}
                </tr>
                <tr>
                    <td style="font-weight:600;">${labels.action}</td>
                    ${compareList.map(item => `<td><a href="${item.link}" class="btn btn-primary" style="padding:8px 18px; font-size:0.75rem;">${labels.viewDetails}</a></td>`).join('')}
                </tr>
            `;
            table.innerHTML = html;
        };

        const closeCompareModal = () => {
            compareModal.classList.remove('active');
        };

        document.getElementById('compareBarBtn').addEventListener('click', openCompareModal);
        compareModal.querySelector('.close-compare').addEventListener('click', closeCompareModal);

        updateWishlistUI();
    };



    // ── Read More: Auto-collapse long descriptive text sections ──
    const initReadMore = () => {
        // Target containers that hold descriptive paragraphs
        const targets = [
            '.experts-text',
            '.about-text',
            '.guide-text',
            '.trip-overview-text',
            '.day-content'
        ];

        const MIN_HEIGHT = 130; // px – collapse threshold

        targets.forEach(selector => {
            document.querySelectorAll(selector).forEach(container => {
                // Only collapse if taller than threshold
                if (container.scrollHeight <= MIN_HEIGHT + 20) return;

                // Wrap content
                const wrapper = document.createElement('div');
                wrapper.className = 'read-more-wrapper';

                const contentDiv = document.createElement('div');
                contentDiv.className = 'read-more-content collapsed';

                // Move children into contentDiv
                while (container.firstChild) {
                    contentDiv.appendChild(container.firstChild);
                }

                // Fade overlay
                const fade = document.createElement('div');
                fade.className = 'read-more-fade';

                // Button
                const btn = document.createElement('button');
                const lang = localStorage.getItem('century-lang') || 'en';
                btn.className = 'read-more-btn';
                btn.innerHTML = `<span data-en="Read More" data-sw="Soma Zaidi">${lang === 'sw' ? 'Soma Zaidi' : 'Read More'}</span> <i class="fas fa-chevron-down"></i>`;

                wrapper.appendChild(contentDiv);
                wrapper.appendChild(fade);
                container.appendChild(wrapper);
                container.appendChild(btn);

                btn.addEventListener('click', () => {
                    const isExpanded = contentDiv.classList.contains('expanded');
                    const span = btn.querySelector('span');
                    if (isExpanded) {
                        contentDiv.classList.remove('expanded');
                        contentDiv.classList.add('collapsed');
                        fade.style.opacity = '1';
                        btn.classList.remove('expanded-state');
                        const currentLang = localStorage.getItem('century-lang') || 'en';
                        if (span) {
                            span.textContent = currentLang === 'sw' ? 'Soma Zaidi' : 'Read More';
                            span.setAttribute('data-en', 'Read More');
                            span.setAttribute('data-sw', 'Soma Zaidi');
                        }
                    } else {
                        contentDiv.classList.remove('collapsed');
                        contentDiv.classList.add('expanded');
                        fade.style.opacity = '0';
                        btn.classList.add('expanded-state');
                        const currentLang = localStorage.getItem('century-lang') || 'en';
                        if (span) {
                            span.textContent = currentLang === 'sw' ? 'Funga' : 'Read Less';
                            span.setAttribute('data-en', 'Read Less');
                            span.setAttribute('data-sw', 'Funga');
                        }
                    }
                });
            });
        });
    };

    // Custom mobile optimization logic
    const initMobileOptimizations = () => {
        // Who We Are Read More toggle
        const btnAboutReadMore = document.getElementById('btn-about-read-more');
        const aboutTextMore = document.querySelector('.about-text-more');
        if (btnAboutReadMore && aboutTextMore) {
            btnAboutReadMore.addEventListener('click', function() {
                const isExpanded = aboutTextMore.classList.toggle('expanded');
                const lang = localStorage.getItem('century-lang') || 'en';
                if (isExpanded) {
                    this.textContent = lang === 'sw' ? 'Soma Kidogo' : 'Read Less';
                    this.setAttribute('data-en', 'Read Less');
                    this.setAttribute('data-sw', 'Soma Kidogo');
                } else {
                    this.textContent = lang === 'sw' ? 'Soma Zaidi' : 'Read More';
                    this.setAttribute('data-en', 'Read More');
                    this.setAttribute('data-sw', 'Soma Zaidi');
                }
            });
        }

        // Why Choose Us "Read More" toggles
        document.querySelectorAll('.choose-card').forEach(card => {
            const textEl = card.querySelector('.choose-text');
            if (!textEl || card.querySelector('.choose-read-more')) return;
            
            const link = document.createElement('span');
            link.className = 'choose-read-more';
            link.setAttribute('data-en', 'Read More');
            link.setAttribute('data-sw', 'Soma Zaidi');
            
            const currentLang = localStorage.getItem('century-lang') || 'en';
            link.textContent = currentLang === 'sw' ? 'Soma Zaidi' : 'Read More';
            
            link.addEventListener('click', (e) => {
                e.stopPropagation();
                const isExpanded = textEl.classList.toggle('expanded');
                const lang = localStorage.getItem('century-lang') || 'en';
                if (isExpanded) {
                    link.textContent = lang === 'sw' ? 'Soma Kidogo' : 'Read Less';
                    link.setAttribute('data-en', 'Read Less');
                    link.setAttribute('data-sw', 'Soma Kidogo');
                } else {
                    link.textContent = lang === 'sw' ? 'Soma Zaidi' : 'Read More';
                    link.setAttribute('data-en', 'Read More');
                    link.setAttribute('data-sw', 'Soma Zaidi');
                }
            });
            
            const contentEl = card.querySelector('.choose-content');
            if (contentEl) {
                contentEl.appendChild(link);
            } else {
                card.appendChild(link);
            }
        });

        // Expert Guides "Read More" toggles
        document.querySelectorAll('.wildlife-item').forEach(card => {
            const textEl = card.querySelector('.guide-desc');
            if (!textEl || card.querySelector('.guide-read-more')) return;
            
            const link = document.createElement('span');
            link.className = 'guide-read-more';
            link.setAttribute('data-en', 'Read More');
            link.setAttribute('data-sw', 'Soma Zaidi');
            
            const currentLang = localStorage.getItem('century-lang') || 'en';
            link.textContent = currentLang === 'sw' ? 'Soma Zaidi' : 'Read More';
            
            link.addEventListener('click', (e) => {
                e.stopPropagation();
                const isExpanded = textEl.classList.toggle('expanded');
                const lang = localStorage.getItem('century-lang') || 'en';
                if (isExpanded) {
                    link.textContent = lang === 'sw' ? 'Soma Kidogo' : 'Read Less';
                    link.setAttribute('data-en', 'Read Less');
                    link.setAttribute('data-sw', 'Soma Kidogo');
                } else {
                    link.textContent = lang === 'sw' ? 'Soma Zaidi' : 'Read More';
                    link.setAttribute('data-en', 'Read More');
                    link.setAttribute('data-sw', 'Soma Zaidi');
                }
            });
            
            const contentEl = card.querySelector('.wildlife-item-content');
            if (contentEl) {
                contentEl.appendChild(link);
            } else {
                card.appendChild(link);
            }
        });

        // Tip Cards "Read More" toggles (for Destination Pages)
        document.querySelectorAll('.tip-card').forEach(card => {
            const textEl = card.querySelector('.tip-text');
            if (!textEl || card.querySelector('.tip-read-more')) return;
            
            const link = document.createElement('span');
            link.className = 'tip-read-more';
            link.setAttribute('data-en', 'Read More');
            link.setAttribute('data-sw', 'Soma Zaidi');
            
            const currentLang = localStorage.getItem('century-lang') || 'en';
            link.textContent = currentLang === 'sw' ? 'Soma Zaidi' : 'Read More';
            
            link.addEventListener('click', (e) => {
                e.stopPropagation();
                const isExpanded = textEl.classList.toggle('expanded');
                const lang = localStorage.getItem('century-lang') || 'en';
                if (isExpanded) {
                    link.textContent = lang === 'sw' ? 'Soma Kidogo' : 'Read Less';
                    link.setAttribute('data-en', 'Read Less');
                    link.setAttribute('data-sw', 'Soma Kidogo');
                } else {
                    link.textContent = lang === 'sw' ? 'Soma Zaidi' : 'Read More';
                    link.setAttribute('data-en', 'Read More');
                    link.setAttribute('data-sw', 'Soma Zaidi');
                }
            });
            
            card.appendChild(link);
        });

        // Collapsible Footer Sections on Mobile
        document.querySelectorAll('.footer-col.collapsible h3').forEach(header => {
            if (header.dataset.hasCollapsibleListener) return;
            header.dataset.hasCollapsibleListener = "true";
            header.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    const parent = header.parentElement;
                    parent.classList.toggle('active');
                }
            });
        });
    };

    // Initialize additions
    initHeroSlideshow();
    optimizeImages();
    initWishlistAndCompare();

    initReadMore();
    initMobileOptimizations();

    // Final sweep to translate dynamically loaded elements on initial pageload
    const currentLang = localStorage.getItem('century-lang') || 'en';
    applyLang(currentLang);

    // PWA Service Worker Registration suspended for development cache clearance

    console.log("Century Adventures Exceptional Features: Weather, Currency, Wishlist & Comparison Engines Ready.");
});
