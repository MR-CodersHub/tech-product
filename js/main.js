/**
 * Cosmo Audio Shared JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
});

function initNavbar() {
    const authDropdown = document.getElementById('auth-dropdown');
    if (!authDropdown) return;

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn) {
        authDropdown.innerHTML = `
             <a href="./user-dashboard.html" class="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                 <span>Dashboard</span>
             </a>
             <div class="h-px bg-white/5 my-1"></div>
             <button onclick="handleLogout()" class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors text-left">
                 <span>Log Out</span>
             </button>
         `;
    } else {
        authDropdown.innerHTML = `
             <a href="./login.html" class="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                 <span>Log In</span>
             </a>
             <a href="./signup.html" class="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                 <span>Sign Up</span>
             </a>
         `;
    }
}

function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    window.location.href = 'index.html';
}
