/**
 * Cosmo Audio Shared JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
});

function initNavbar() {
    console.log('initNavbar called');

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');

    console.log('Mobile menu elements:', {
        btn: mobileMenuBtn,
        close: mobileMenuClose,
        menu: mobileMenu,
        menuClasses: mobileMenu?.className,
        menuDisplay: mobileMenu ? window.getComputedStyle(mobileMenu).display : 'N/A',
        menuZIndex: mobileMenu ? window.getComputedStyle(mobileMenu).zIndex : 'N/A'
    });

    if (mobileMenuBtn && mobileMenu) {
        console.log('Adding click listener to hamburger button');
        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Hamburger clicked! Current classes:', mobileMenu.className);

            mobileMenu.classList.remove('hidden');
            mobileMenu.style.display = ''; // Clear inline display to let CSS classes take over

            console.log('After removing hidden:', mobileMenu.className);
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        });

        // Close button handler
        if (mobileMenuClose) {
            console.log('Adding click listener to close button');
            mobileMenuClose.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Close button clicked!');
                mobileMenu.classList.add('hidden');
                mobileMenu.style.display = ''; // Clear inline display
                document.body.style.overflow = ''; // Restore scroll
            });
        }
    } else {
        console.error('Mobile menu elements not found!', { mobileMenuBtn, mobileMenu });
    }

    // Auth Logic
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const desktopAuth = document.getElementById('auth-dropdown-desktop');
    const mobileAuth = document.getElementById('auth-mobile');
    const oldAuth = document.getElementById('auth-dropdown'); // For backward compatibility if needed

    // Render Desktop Auth
    if (desktopAuth) {
        renderAuth(desktopAuth, isLoggedIn, false);
    } else if (oldAuth) {
        renderAuth(oldAuth, isLoggedIn, false);
    }

    // Render Mobile Auth
    if (mobileAuth) {
        renderAuth(mobileAuth, isLoggedIn, true);
    }
}

function renderAuth(container, isLoggedIn, isMobile) {
    if (isMobile) {
        if (isLoggedIn) {
            container.innerHTML = `
                <div class="flex items-center gap-4 mb-4">
                    <div class="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-sm font-bold text-white">Welcome Back</p>
                        <a href="./user-dashboard.html" class="text-xs text-blue-400 hover:underline">Go to Dashboard</a>
                    </div>
                </div>
                <button onclick="handleLogout()" class="text-sm text-red-400 hover:text-red-300 transition-colors">
                    Log Out
                </button>
            `;
        } else {
            container.innerHTML = `
                <div class="grid grid-cols-2 gap-4">
                    <a href="./login.html" class="py-3 items-center justify-center border border-white/10 rounded-xl text-center text-sm font-bold hover:bg-white/5 transition flex gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Log In
                    </a>
                    <a href="./signup.html" class="py-3 items-center justify-center border border-white/10 rounded-xl text-center text-sm font-bold hover:bg-white/5 transition flex gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Sign Up
                    </a>
                </div>
            `;
        }
    } else {
        // Desktop / Default
        if (isLoggedIn) {
            container.innerHTML = `
                 <a href="./user-dashboard.html" class="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                     <span>Dashboard</span>
                 </a>
                 <div class="h-px bg-white/5 my-1"></div>
                 <button onclick="handleLogout()" class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors text-left">
                     <span>Log Out</span>
                 </button>
             `;
        } else {
            container.innerHTML = `
                 <a href="./login.html" class="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                     <span>Log In</span>
                 </a>
                 <a href="./signup.html" class="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                     <span>Sign Up</span>
                 </a>
             `;
        }
    }
}

function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    window.location.reload();
}
