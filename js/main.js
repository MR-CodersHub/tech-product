/**
 * Cosmo Audio — Shared Navigation & Auth JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    handleActiveLinks();
});

function handleActiveLinks() {
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop() || 'index.html';

    // Select links in desktop nav and mobile menu
    const navLinks = document.querySelectorAll('nav a, #mobile-menu a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || link.querySelector('img')) return;

        // Get the filename from href (e.g., './index.html' -> 'index.html')
        const normalizedHref = href.split('/').pop().split('?')[0].split('#')[0];

        // Exact match or handle root/index cases
        const isMatch = (normalizedHref === pageName) ||
            (pageName === 'index.html' && (normalizedHref === '' || normalizedHref === './')) ||
            ((pageName === '' || pageName === '/') && normalizedHref === 'index.html');

        if (isMatch) {
            link.setAttribute('aria-current', 'page');

            // Styling for Desktop Navigation
            if (link.closest('nav') && !link.closest('#mobile-menu')) {
                // Skip if it's a button or CTA (like "Order Now")
                if (link.classList.contains('bg-blue-600') || link.classList.contains('px-5')) return;

                link.classList.remove('text-gray-400');
                link.classList.add('text-white', 'font-bold');

                // Add a subtle blue underline for desktop active state
                if (link.classList.contains('transition') || link.classList.contains('whitespace-nowrap')) {
                    link.classList.add('border-b-2', 'border-blue-500', 'pb-1');
                }
            }

            // Styling for Mobile Menu
            if (link.closest('#mobile-menu')) {
                link.classList.add('bg-blue-600/5', 'border-blue-500/40');
                link.classList.remove('text-gray-400', 'text-gray-300');
                link.classList.add('text-white', 'font-bold');

                const span = link.querySelector('span:not(.rounded-full)');
                if (span) {
                    span.classList.remove('text-gray-400', 'text-gray-300');
                    span.classList.add('text-blue-400', 'font-bold');
                }

                const iconContainer = link.querySelector('div');
                if (iconContainer && iconContainer.classList.contains('rounded-xl')) {
                    iconContainer.classList.add('ring-2', 'ring-blue-500/30', 'bg-blue-500/20');
                }
            }
        }
    });
}

function initNavbar() {

    // ──────────────────────────────────────────
    // 1. Mobile Menu Toggle
    // ──────────────────────────────────────────
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            mobileMenu.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });

        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                mobileMenu.classList.add('hidden');
                document.body.style.overflow = '';
            });
        }
    }

    // ──────────────────────────────────────────
    // 2. Auth State
    // ──────────────────────────────────────────
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    // Desktop auth dropdown — prefer new ID, fall back to legacy
    const desktopAuthEl = document.getElementById('auth-dropdown-desktop')
        || document.getElementById('auth-dropdown');

    // Mobile auth section
    const mobileAuthEl = document.getElementById('auth-mobile');

    if (desktopAuthEl) renderAuth(desktopAuthEl, isLoggedIn, false);
    if (mobileAuthEl) renderAuth(mobileAuthEl, isLoggedIn, true);

    // ──────────────────────────────────────────
    // 3. Click-based Desktop Auth Dropdown
    // ──────────────────────────────────────────
    if (desktopAuthEl) {
        // The DOM structure is:
        //   div.relative.group            ← outerGroup
        //     button                      ← trigger
        //     div.absolute.opacity-0...   ← dropdownPanel
        //       div#auth-dropdown         ← desktopAuthEl
        const dropdownPanel = desktopAuthEl.parentElement;   // the pt-4 wrapper
        const outerGroup = dropdownPanel?.parentElement;  // the .relative.group div
        const triggerBtn = outerGroup?.querySelector('button');

        if (triggerBtn && dropdownPanel && outerGroup) {
            // Disable CSS hover behaviour by removing Tailwind 'group' class
            outerGroup.classList.remove('group');

            // Hide the panel by default — override the opacity/invisible state
            dropdownPanel.style.opacity = '0';
            dropdownPanel.style.visibility = 'hidden';
            dropdownPanel.style.transform = 'translateY(8px)';
            dropdownPanel.style.transition = 'opacity 0.2s ease, visibility 0.2s ease, transform 0.2s ease';
            dropdownPanel.style.pointerEvents = 'none';

            let isOpen = false;

            function openDropdown() {
                isOpen = true;
                dropdownPanel.style.opacity = '1';
                dropdownPanel.style.visibility = 'visible';
                dropdownPanel.style.transform = 'translateY(0)';
                dropdownPanel.style.pointerEvents = 'auto';
                triggerBtn.classList.add('text-white', 'bg-white/10');
                triggerBtn.classList.remove('text-gray-400');
            }

            function closeDropdown() {
                isOpen = false;
                dropdownPanel.style.opacity = '0';
                dropdownPanel.style.visibility = 'hidden';
                dropdownPanel.style.transform = 'translateY(8px)';
                dropdownPanel.style.pointerEvents = 'none';
                triggerBtn.classList.remove('text-white', 'bg-white/10');
                triggerBtn.classList.add('text-gray-400');
            }

            // Toggle on button click
            triggerBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                isOpen ? closeDropdown() : openDropdown();
            });

            // Close when clicking anywhere outside
            document.addEventListener('click', (e) => {
                if (isOpen && !outerGroup.contains(e.target)) {
                    closeDropdown();
                }
            });

            // Close when pressing Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && isOpen) closeDropdown();
            });
        }
    }

    // ──────────────────────────────────────────
    // 4. Scroll Reveal Animation
    // ──────────────────────────────────────────
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('opacity-0', 'translate-y-8');
                entry.target.classList.add('opacity-100', 'translate-y-0');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

// ──────────────────────────────────────────
// Auth Rendering
// ──────────────────────────────────────────
function renderAuth(container, isLoggedIn, isMobile) {
    if (isMobile) {
        container.innerHTML = `
            <a href="./admin-dashboard.html" class="flex items-center justify-center gap-2 py-3 border border-white/10 rounded-xl text-center text-sm font-bold hover:bg-white/5 transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Admin
            </a>
            <a href="./user-dashboard.html" class="flex items-center justify-center gap-2 py-3 border border-white/10 rounded-xl text-center text-sm font-bold hover:bg-white/5 transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                User
            </a>
            <a href="./login.html" class="flex items-center justify-center gap-2 py-3 border border-white/10 rounded-xl text-center text-sm font-bold hover:bg-white/5 transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login
            </a>
        `;
    } else {
        // Desktop dropdown content
        container.innerHTML = `
            <a href="./admin-dashboard.html" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Admin</span>
            </a>
            <a href="./user-dashboard.html" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>User</span>
            </a>
            <div class="h-px bg-white/5 my-1"></div>
            <a href="./login.html" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Login</span>
            </a>
        `;
    }
}

// ──────────────────────────────────────────
// Logout Handler (global scope)
// ──────────────────────────────────────────
function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    window.location.reload();
}
