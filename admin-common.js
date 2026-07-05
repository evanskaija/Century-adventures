/**
 * Century Adventures - Admin Common Logic
 * Handles Dark Mode, Swahili Translation, Admin Profile Avatar/Name, and SMS Notification badges
 */

// Translations dictionary
const TRANSLATION_DICTIONARY = {
    sw: {
        "Dashboard": "Dashibodi",
        "Messages": "Ujumbe",
        "Manage Tours": "Simamia Safari",
        "Customers": "Wateja",
        "Settings": "Mipangilio",
        "Logout": "Ondoka",
        "System Settings": "Mipangilio ya Mfumo",
        "Customer Registry": "Sajili ya Wateja",
        "Track safari bookings, revenue, and client communications": "Fuatilia uhifadhi wa safari, mapato, na mawasiliano ya wateja",
        "Manage Registered Clients & Traveler Activities": "Simamia Wateja Waliosajiliwa na Shughuli za Wasafiri",
        "Publish & Edit Safari Packages": "Chapisha na Hariri Vifurushi vya Safari",
        "Configure Security & Management Variables": "Sanidi Usalama na Vigezo vya Usimamizi",
        "Revenue Forecast": "Utabiri wa Mapato",
        "Revenue Forecast & Booking Flow": "Utabiri wa Mapato na Mtiririko wa Uhifadhi",
        "Inquiries by Department": "Maswali kwa Idara",
        "Recent Bookings": "Uhifadhi wa Hivi Karibuni",
        "Active Safari Catalog": "Katalogi ya Safari Amilifu",
        "Add New Tour": "Ongeza Safari Mpya",
        "Registered Accounts & Enquiries": "Akaunti Zilizosajiliwa na Maswali",
        "Reset Registry": "Weka Upya Sajili",
        "Technical Support (support@)": "Msaada wa Kiufundi (support@)",
        "Sales & Custom Quotes (visit@)": "Mauzo na Nukuu Maalum (visit@)",
        "General & Info (infor@)": "Jumla na Habari (infor@)",
        "Safari Bookings (bookings@)": "Uhifadhi wa Safari (bookings@)",
        "Email Routing Setup": "Usanidi wa Kuelekeza Barua Pepe",
        "Change Passcode": "Badilisha Nenosiri",
        "Support Preferences": "Mapendeleo ya Msaada",
        "System Backups": "Hifadhi Nakala za Mfumo",
        "Reset All Databases": "Futa Hifadhidata Zote",
        "Maintenance & Cache": "Matengenezo na Akiba",
        "Update Passcode": "Sasisha Nenosiri",
        "Save Routing Emails": "Hifadhi Njia za Barua Pepe"
    }
};

// Initialize settings on script load
(function() {
    const isDark = localStorage.getItem('century-admin-dark-mode') === 'true';
    if (isDark) {
        document.documentElement.classList.add('dark-mode');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // Sync dark-mode class to body on load
    if (document.documentElement.classList.contains('dark-mode')) {
        document.body.classList.add('dark-mode');
    }

    // 1. Setup layout elements
    setupSidebarActions();
    setupHeaderAvatar();
    
    // 2. Load theme & lang preferences
    initThemeState();
    initLanguageState();
    
    // 3. Load admin profile (avatar, name)
    updateAdminProfile();
    
    // 4. Update live notification badges
    updateUnreadSmsBadge();
    
    // Listen to changes in localStorage from other tabs
    window.addEventListener('storage', (e) => {
        if (e.key === 'century-admin-avatar' || e.key === 'century-admin-name') {
            updateAdminProfile();
        } else if (e.key === 'century-conversations') {
            updateUnreadSmsBadge();
        }
    });

    // 5. Sync localStorage data with the PHP/SQLite database
    syncWithDatabase();
});

// ── Database Sync ─────────────────────────────────────────────────────────────
/**
 * Pushes localStorage conversations & bookings to sync-data.php,
 * then pulls the latest DB conversations back into localStorage
 * so all admin panels reflect real submissions.
 */
async function syncWithDatabase() {
    const PASSCODE = 'centuryadmin';
    const SYNC_URL = 'sync-data.php';

    // --- 1. Pull latest conversations from DB back into localStorage ---
    try {
        const res  = await fetch(SYNC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ passcode: PASSCODE, action: 'pull_conversations' }),
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.conversations)) {
            // Server database conversations is the absolute source of truth
            localStorage.setItem('century-conversations', JSON.stringify(data.conversations));
            
            // Refresh unread badge
            updateUnreadSmsBadge();
            
            // Dispatch update event for active message panels
            window.dispatchEvent(new CustomEvent('century-conversations-updated'));
        }
    } catch (e) {
        console.warn('[AdminSync] pull_conversations failed:', e);
    }

    // --- 2. Pull latest bookings/submissions from DB back into localStorage ---
    try {
        const res = await fetch(`get-submissions.php?type=bookings&passcode=${PASSCODE}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
            localStorage.setItem('century-bookings', JSON.stringify(data.data));
            
            // Dispatch update event for active dashboards
            window.dispatchEvent(new CustomEvent('century-bookings-updated'));
        }
    } catch (e) {
        console.warn('[AdminSync] pull_bookings failed:', e);
    }
}

// Setup sidebar layout: theme and language toggle buttons
function setupSidebarActions() {
    const bottomDiv = document.querySelector('.dashboard-sidebar > div:last-child');
    if (!bottomDiv) return;

    // Theme Toggle Btn
    if (!document.getElementById('themeToggleBtn')) {
        const themeBtn = document.createElement('a');
        themeBtn.id = 'themeToggleBtn';
        themeBtn.href = '#';
        themeBtn.style = 'width: 48px; height: 48px; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: var(--admin-text-muted); font-size: 18px; transition: all 0.2s;';
        themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        themeBtn.onclick = (e) => {
            e.preventDefault();
            toggleTheme();
        };
        bottomDiv.insertBefore(themeBtn, bottomDiv.firstChild);
    }

    // Language Switcher Btn
    if (!document.getElementById('langToggleBtn')) {
        const langBtn = document.createElement('a');
        langBtn.id = 'langToggleBtn';
        langBtn.href = '#';
        langBtn.style = 'width: 48px; height: 48px; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: var(--admin-text-muted); font-size: 13px; transition: all 0.2s;';
        langBtn.innerHTML = '<span style="font-weight: 700;">EN</span>';
        langBtn.onclick = (e) => {
            e.preventDefault();
            toggleLanguage();
        };
        bottomDiv.insertBefore(langBtn, bottomDiv.firstChild);
    }
}

// Injects admin avatar image element inside headers if missing
function setupHeaderAvatar() {
    const headerRight = document.querySelector('.dash-header-card > div:last-child');
    if (!headerRight) return;

    let img = headerRight.querySelector('img');
    if (!img) {
        img = document.createElement('img');
        img.className = 'admin-avatar-img';
        img.style = 'width: 42px; height: 42px; border-radius: 50%; object-fit: cover; border: 2px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.05); margin-left: 15px;';
        headerRight.appendChild(img);
    } else {
        img.className = 'admin-avatar-img';
    }

    const nameEl = headerRight.querySelector('strong');
    if (nameEl) {
        nameEl.className = 'admin-profile-name';
    }
}

// Setup active theme icons
function initThemeState() {
    const isDark = document.body.classList.contains('dark-mode');
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
        themeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        themeBtn.title = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }
}

// Toggle active theme class
function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    if (isDark) {
        document.documentElement.classList.add('dark-mode');
    } else {
        document.documentElement.classList.remove('dark-mode');
    }
    localStorage.setItem('century-admin-dark-mode', isDark ? 'true' : 'false');
    initThemeState();
}

// Setup active language string replacements
function initLanguageState() {
    applyTranslations();
}

// Toggle language code
function toggleLanguage() {
    const current = localStorage.getItem('century-admin-lang') || 'en';
    const target = current === 'en' ? 'sw' : 'en';
    localStorage.setItem('century-admin-lang', target);
    
    // Simple page reload ensures full dictionary mapping is applied cleanly
    window.location.reload();
}

// Translate page contents
function applyTranslations() {
    const lang = localStorage.getItem('century-admin-lang') || 'en';
    const langBtn = document.getElementById('langToggleBtn');
    if (langBtn) {
        langBtn.innerHTML = `<span style="font-weight: 700; font-size: 13px;">${lang.toUpperCase()}</span>`;
        langBtn.title = lang === 'en' ? 'Switch to Swahili' : 'Badili kwenda Kiingereza';
    }

    const dict = TRANSLATION_DICTIONARY[lang];
    if (!dict) return;

    // 1. Data attributes
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (dict[key]) el.textContent = dict[key];
    });

    // 2. Generic tag text mapping fallback
    document.querySelectorAll('h1, h2, h3, h4, p, strong, button, label, span, a').forEach(el => {
        if (el.children.length === 0) {
            const txt = el.textContent.trim();
            if (dict[txt]) el.textContent = dict[txt];
        }
    });

    // 3. Tooltip titles
    document.querySelectorAll('.dash-nav a, .dashboard-sidebar a').forEach(el => {
        const title = el.getAttribute('title');
        if (title && dict[title]) {
            el.setAttribute('title', dict[title]);
        }
    });
}

// Refresh dynamic user details
function updateAdminProfile() {
    const avatar = localStorage.getItem('century-admin-avatar') || 'assets/user1.jpg';
    const name = localStorage.getItem('century-admin-name') || 'Administrator';

    document.querySelectorAll('.admin-avatar-img').forEach(img => {
        img.src = avatar;
    });
    document.querySelectorAll('.admin-profile-name').forEach(el => {
        el.textContent = name;
    });
}

// Calculates and updates unread live chats/sms badge
function updateUnreadSmsBadge() {
    const msgLink = document.querySelector('.dash-nav a[href="admin-messages.html"]');
    if (!msgLink) return;

    msgLink.style.position = 'relative';
    let badge = document.getElementById('unreadSmsBadge');
    if (!badge) {
        badge = document.createElement('span');
        badge.id = 'unreadSmsBadge';
        badge.className = 'nav-badge';
        badge.style.display = 'none';
        msgLink.appendChild(badge);
    }

    let conversations = [];
    try {
        conversations = JSON.parse(localStorage.getItem('century-conversations')) || [];
    } catch(e) {}

    const unreadCount = conversations.filter(c => c.status === 'open').length;
    if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }

    // Dashboard Warning
    const dashWarning = document.getElementById('unreadSmsDashboardWarning');
    if (dashWarning) {
        if (unreadCount > 0) {
            dashWarning.style.display = 'flex';
            const countEl = document.getElementById('unreadSmsDashboardCount');
            if (countEl) countEl.textContent = unreadCount;
        } else {
            dashWarning.style.display = 'none';
        }
    }
}
