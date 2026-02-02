// Theme Switcher Utility - Include this in every page
// Add this script to all HTML pages

(function() {
    // CSS variables for both themes
    const themes = {
        dark: {
            '--primary': '#6366f1',
            '--primary-dark': '#4f46e5',
            '--secondary': '#ec4899',
            '--success': '#10b981',
            '--warning': '#f59e0b',
            '--danger': '#ef4444',
            '--bg-dark': '#0f172a',
            '--bg-card': '#1e293b',
            '--bg-hover': '#334155',
            '--text-primary': '#f1f5f9',
            '--text-secondary': '#94a3b8',
            '--border': '#334155'
        },
        light: {
            '--primary': '#6366f1',
            '--primary-dark': '#4f46e5',
            '--secondary': '#ec4899',
            '--success': '#10b981',
            '--warning': '#f59e0b',
            '--danger': '#ef4444',
            '--bg-dark': '#ffffff',
            '--bg-card': '#f8fafc',
            '--bg-hover': '#f1f5f9',
            '--text-primary': '#0f172a',
            '--text-secondary': '#64748b',
            '--border': '#e2e8f0'
        }
    };

    // Get saved theme or default to dark
    let currentTheme = localStorage.getItem('theme') || 'dark';

    // Apply theme
    function applyTheme(theme) {
        const root = document.documentElement;
        const colors = themes[theme];
        
        // Apply smooth transition
        root.style.transition = 'all 0.3s ease';
        
        // Apply each color variable
        Object.keys(colors).forEach(key => {
            root.style.setProperty(key, colors[key]);
        });

        // Update body background
        if (theme === 'light') {
            document.body.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)';
        } else {
            document.body.style.background = 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)';
        }

        currentTheme = theme;
        localStorage.setItem('theme', theme);

        // Update toggle button if it exists
        updateToggleButton();
    }

    // Create theme toggle button
    function createToggleButton() {
        // Check if button already exists
        if (document.getElementById('themeToggle')) return;

        const button = document.createElement('button');
        button.id = 'themeToggle';
        button.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
        button.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: none;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            font-size: 1.8em;
            cursor: pointer;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1) rotate(15deg)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1) rotate(0deg)';
        });

        button.addEventListener('click', toggleTheme);

        document.body.appendChild(button);
    }

    // Update toggle button icon
    function updateToggleButton() {
        const button = document.getElementById('themeToggle');
        if (button) {
            button.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
        }
    }

    // Toggle between themes
    function toggleTheme() {
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);

        // Save to Firebase if user is logged in
        if (window.auth && window.auth.currentUser) {
            const userId = window.auth.currentUser.uid;
            window.database.ref(`users/${userId}/settings/theme`).set(newTheme);
        }

        // Add fun animation
        const button = document.getElementById('themeToggle');
        button.style.animation = 'spin 0.5s ease';
        setTimeout(() => {
            button.style.animation = '';
        }, 500);
    }

    // Add spin animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(1.2); }
            100% { transform: rotate(360deg) scale(1); }
        }

        /* Smooth transitions for theme changes */
        * {
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
        }
    `;
    document.head.appendChild(style);

    // Initialize theme on page load
    document.addEventListener('DOMContentLoaded', () => {
        applyTheme(currentTheme);
        createToggleButton();

        // Load theme from Firebase if available
        if (window.auth) {
            window.auth.onAuthStateChanged(async (user) => {
                if (user && window.database) {
                    const themeSnapshot = await window.database.ref(`users/${user.uid}/settings/theme`).once('value');
                    const savedTheme = themeSnapshot.val();
                    if (savedTheme) {
                        applyTheme(savedTheme);
                    }
                }
            });
        }
    });

    // Export functions for manual use
    window.themeUtils = {
        toggle: toggleTheme,
        setTheme: applyTheme,
        getCurrentTheme: () => currentTheme
    };
})();
