// Utility: Scroll Lock Manager
const ScrollLockManager = (function() {
    let lockCount = 0;
    return {
        lock() {
            lockCount++;
            document.body.style.overflow = 'hidden';
        },
        unlock() {
            if (lockCount > 0) lockCount--;
            if (lockCount === 0) {
                document.body.style.overflow = '';
            }
        },
        reset() {
            lockCount = 0;
            document.body.style.overflow = '';
        },
        getCount() {
            return lockCount;
        }
    };
})();
/**
 * IbaraDevilRoze VTuber Theme - Main JavaScript
 * Version 2.1
 * 
 * Features:
 * - Loading screen functionality
 * - Theme toggle functionality
 * - Sidebar menu functionality
 * - Smooth scroll navigation
 * - Intersection Observer animations
 * - Optimized performance
 * - Enhanced accessibility
 */

'use strict';

// Theme constants
const THEME_CONFIG = {
    VERSION: '2.1',
    THEMES: {
        LIGHT: 'light',
        DARK: 'dark'
    }
};

// Animation and timing constants
const ANIMATION_CONFIG = {
    LOADING_MIN_TIME: 800,
    LOADING_HIDE_DELAY: 500,
    LOADING_SHOW_DELAY: 50,
    THEME_TRANSITION_DURATION: 300,
    SIDEBAR_CLOSE_DELAY: 150,
    SCROLL_LOCK_RESET_DELAY: 100,
    SMOOTH_SCROLL_CLEANUP_DELAY: 100,
    CONTACT_FORM_RESET_TIMEOUT: 3000,
    VIDEO_DATA_APPLY_DELAY: 100,
    HERO_ANIMATION_DELAY: 100,
    HEADER_FOCUS_CLEANUP_DELAY: 50,
    LOGO_CLEANUP_DELAY: 100,
    SCROLL_STATE_CHECK_DELAY: 1000
};

// Scroll and layout constants
const SCROLL_CONFIG = {
    HEADER_SCROLLED_THRESHOLD: 100,
    HEADER_HIDE_THRESHOLD: 200,
    SECTION_OFFSET_BUFFER: 100,
    SMOOTH_SCROLL_OFFSET: 20,
    HEADER_HIDDEN_TRANSFORM: 'translateY(-100%)',
    HEADER_VISIBLE_TRANSFORM: 'translateY(0)'
};

// Animation and visual constants
const VISUAL_CONFIG = {
    FADE_IN_THRESHOLD: 0.15,
    FADE_IN_ROOT_MARGIN: '0px 0px -50px 0px',
    STAGGER_DELAY_MULTIPLIER: 0.1,
    SOCIAL_LINK_HOVER_TRANSFORM: 'translateY(-3px) scale(1.05)',
    SOCIAL_LINK_NORMAL_TRANSFORM: 'translateY(0) scale(1)',
    CONTACT_FORM_DISABLED_OPACITY: '0.7',
    CONTACT_FORM_ENABLED_OPACITY: '1',
    IMAGE_ERROR_OPACITY: '0.7',
    AVIF_TEST_HEIGHT: 2
};

// CSS class and selector constants
const CSS_SELECTORS = {
    LOADING_SCREEN: 'loading-screen',
    THEME_TOGGLE: 'theme-toggle',
    LEFT_SIDEBAR: 'left-sidebar',
    MOBILE_MENU_TOGGLE: 'mobile-menu-toggle',
    MAIN_HEADER: 'main-header',
    HIDDEN_CLASS: 'hidden',
    ACTIVE_CLASS: 'active',
    SCROLLED_CLASS: 'scrolled',
    VISIBLE_CLASS: 'visible',
    LOADED_CLASS: 'loaded',
    FOCUSED_CLASS: 'focused'
};

// Debug configuration
const DEBUG_CONFIG = {
    enabled: window.vtuber_ajax?.debug_settings?.enabled || false,
    level: window.vtuber_ajax?.debug_settings?.level || 'basic'
};

// Utility Functions
const DOMUtils = {
    /**
     * Get element by ID with optional error logging
     */
    getElementById(id, required = false) {
        const element = document.getElementById(id);
        if (!element && required) {
            console.warn(`Required element with ID '${id}' not found`);
        }
        return element;
    },

    /**
     * Add/remove classes with validation
     */
    toggleClass(element, className, condition) {
        if (!element || !className) return false;
        if (condition === undefined) {
            element.classList.toggle(className);
        } else {
            element.classList.toggle(className, condition);
        }
        return true;
    },

    /**
     * Set multiple attributes at once
     */
    setAttributes(element, attributes) {
        if (!element || !attributes) return false;
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        return true;
    },

    /**
     * Create delayed function execution
     */
    delay(callback, ms) {
        return setTimeout(callback, ms);
    },

    /**
     * Check if element exists and has specific class
     */
    hasElementWithClass(selector, className) {
        const element = document.querySelector(selector);
        return element && element.classList.contains(className);
    }
};

const AnimationUtils = {
    /**
     * Apply smooth transitions with cleanup
     */
    smoothTransition(element, properties, duration, callback) {
        if (!element) return;
        
        const originalTransition = element.style.transition;
        element.style.transition = properties;
        
        DOMUtils.delay(() => {
            element.style.transition = originalTransition;
            if (callback) callback();
        }, duration);
    },

    /**
     * Safe element transform
     */
    setTransform(element, transform) {
        if (element && element.style) {
            element.style.transform = transform;
        }
    },

    /**
     * Safe opacity setting
     */
    setOpacity(element, opacity) {
        if (element && element.style) {
            element.style.opacity = opacity;
        }
    }
};

const ThemeUtils = {
    /**
     * Get current theme from body attribute
     */
    getCurrentTheme() {
        return document.body.getAttribute('data-theme') || THEME_CONFIG.THEMES.LIGHT;
    },

    /**
     * Set theme with validation
     */
    setTheme(theme) {
        if (!Object.values(THEME_CONFIG.THEMES).includes(theme)) {
            return false;
        }
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        return true;
    },

    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        const current = this.getCurrentTheme();
        const newTheme = current === THEME_CONFIG.THEMES.DARK 
            ? THEME_CONFIG.THEMES.LIGHT 
            : THEME_CONFIG.THEMES.DARK;
        return this.setTheme(newTheme) ? newTheme : null;
    }
};

// Debug logging function
function debugLog(message, data = null, level = 'basic') {
    if (!DEBUG_CONFIG.enabled) return;
    
    // Check log level
    const levels = ['minimal', 'basic', 'verbose'];
    const currentLevel = levels.indexOf(DEBUG_CONFIG.level);
    const messageLevel = levels.indexOf(level);
    
    if (messageLevel > currentLevel) return;
    
    if (data) {
        console.log(message, data);
    } else {
        console.log(message);
    }
}

// Loading Screen Manager
class LoadingManager {
    constructor() {
        this.loadingScreen = null;
        this.isLoading = false;
        this.config = window.vtuber_ajax?.loading_config || {
            enabled: true,
            min_loading_time: ANIMATION_CONFIG.LOADING_MIN_TIME,
            enable_transitions: true,
            show_for_external: false
        };
        this.loadStartTime = Date.now();
        
        if (this.config.enabled) {
            this.init();
        }
    }
    
    init() {
        // Show loading screen immediately
        this.show();
        
        // Hide loading screen when page is fully loaded
        if (document.readyState === 'complete') {
            this.hide();
        } else {
            window.addEventListener('load', () => this.hide());
        }
        
        // Handle page transitions
        this.setupPageTransitions();
    }
    
    show() {
        this.loadingScreen = document.getElementById(CSS_SELECTORS.LOADING_SCREEN);
        if (this.loadingScreen) {
            this.loadingScreen.classList.remove(CSS_SELECTORS.HIDDEN_CLASS);
            this.isLoading = true;
            this.loadStartTime = Date.now();
            
            // Prevent scrolling during loading
            ScrollLockManager.lock();
            
            debugLog('🔄 Loading screen shown', null, 'basic');
        }
    }
    
    hide() {
        if (!this.loadingScreen || !this.isLoading || !this.config.enabled) return;
        
        const elapsedTime = Date.now() - this.loadStartTime;
        const remainingTime = Math.max(0, this.config.min_loading_time - elapsedTime);
        
        setTimeout(() => {
            this.loadingScreen.classList.add(CSS_SELECTORS.HIDDEN_CLASS);
            this.isLoading = false;
            
            // Re-enable scrolling
            ScrollLockManager.unlock();
            debugLog('🔄 Loading screen: Re-enabled scrolling', null, 'verbose');
            
            // Remove loading screen from DOM after animation
            setTimeout(() => {
                if (this.loadingScreen && this.loadingScreen.parentNode) {
                    this.loadingScreen.style.display = 'none';
                }
            }, ANIMATION_CONFIG.LOADING_HIDE_DELAY);
            
            debugLog('✅ Loading screen hidden', null, 'basic');
        }, remainingTime);
    }
    
    setupPageTransitions() {
        if (!this.config.enable_transitions) return;
        
        // Show loading screen for internal link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && this.shouldShowLoadingForLink(link)) {
                debugLog('🔄 LoadingManager: Showing loading screen for link:', link.getAttribute('href'), 'verbose');
                // Small delay to show loading screen before navigation
                setTimeout(() => this.show(), ANIMATION_CONFIG.LOADING_SHOW_DELAY);
            } else if (link) {
                debugLog('🚫 LoadingManager: Skipping loading screen for link:', link.getAttribute('href'), 'verbose');
            }
        });
        
        // Handle form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form && this.shouldShowLoadingForForm(form)) {
                debugLog('🔄 LoadingManager: Showing loading screen for form submission', null, 'verbose');
                this.show();
            }
        });
    }
    
    shouldShowLoadingForLink(link) {
        const href = link.getAttribute('href');
        debugLog('🔍 LoadingManager: Checking link:', href, 'verbose');
        
        if (!href) {
            debugLog('🚫 LoadingManager: No href found', null, 'verbose');
            return false;
        }
        
        // Parse URL to handle complex cases
        let url;
        try {
            url = new URL(href, window.location.origin);
        } catch (e) {
            debugLog('🚫 LoadingManager: Invalid URL:', href, 'verbose');
            return false;
        }
        
        // Skip anchor links (any URL with a hash fragment)
        if (url.hash) {
            debugLog('🚫 LoadingManager: Skipping anchor link with hash:', url.hash, 'verbose');
            return false;
        }
        
        // Skip if it's the same page (same pathname)
        if (url.pathname === window.location.pathname && url.origin === window.location.origin) {
            debugLog('🚫 LoadingManager: Skipping same page link', null, 'verbose');
            return false;
        }
        
        // Skip external links
        if (url.origin !== window.location.origin) {
            debugLog('🚫 LoadingManager: Skipping external link:', url.origin, 'verbose');
            return false;
        }
        
        // Skip download links
        if (link.hasAttribute('download')) {
            debugLog('🚫 LoadingManager: Skipping download link', null, 'verbose');
            return false;
        }
        
        // Skip target="_blank" links
        if (link.getAttribute('target') === '_blank') {
            debugLog('🚫 LoadingManager: Skipping _blank link', null, 'verbose');
            return false;
        }
        
        debugLog('✅ LoadingManager: Will show loading screen for:', href, 'verbose');
        return true;
    }
    
    shouldShowLoadingForForm(form) {
        // Skip search forms
        if (form.getAttribute('role') === 'search') return false;
        
        // Skip contact forms that use AJAX
        if (form.classList.contains('ajax-form')) return false;
        
        return true;
    }
}

// Initialize loading manager
const loadingManager = new LoadingManager();

/**
 * Initialize scroll lock management for browser navigation
 */
function initScrollLockManagement() {
    // Reset scroll lock on page load/refresh
    ScrollLockManager.reset();
    
    // Handle browser back/forward navigation
    window.addEventListener('pageshow', function(event) {
        // This event fires when page is loaded from browser cache (back/forward)
        if (event.persisted) {
            debugLog('🔄 Page loaded from cache, resetting scroll lock', null, 'basic');
            ScrollLockManager.reset();
        }
    });
    
    // Handle popstate (browser back/forward buttons)
    window.addEventListener('popstate', function(event) {
        debugLog('🔄 Browser navigation detected, resetting scroll lock', null, 'basic');
        ScrollLockManager.reset();
    });
    
    // Additional safeguard: reset scroll lock when focus returns to window
    window.addEventListener('focus', function() {
        // Small delay to ensure any other scroll lock operations complete first
        setTimeout(() => {
            if (ScrollLockManager.getCount() > 0) {
                debugLog('🔄 Window focus detected with active scroll lock, resetting', null, 'basic');
                ScrollLockManager.reset();
            }
        }, ANIMATION_CONFIG.SCROLL_LOCK_RESET_DELAY);
    });
    
    // Reset scroll lock on visibility change (when tab becomes visible again)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            setTimeout(() => {
                if (ScrollLockManager.getCount() > 0) {
                    debugLog('🔄 Tab became visible with active scroll lock, resetting', null, 'basic');
                    ScrollLockManager.reset();
                }
            }, ANIMATION_CONFIG.SCROLL_LOCK_RESET_DELAY);
        }
    });
}

// Initialize scroll lock management immediately
initScrollLockManagement();

(function() {
    // Global theme utilities
    window.VTuberTheme = {
        version: THEME_CONFIG.VERSION,
        initialized: false,
        loadingManager: loadingManager,
        
        toggleTheme() {
            const themeToggle = document.getElementById(CSS_SELECTORS.THEME_TOGGLE);
            if (themeToggle) {
                themeToggle.click();
            }
        },
        
        getCurrentTheme() {
            return document.body.getAttribute('data-theme') || THEME_CONFIG.THEMES.LIGHT;
        },
        
        setTheme(theme) {
            if (![THEME_CONFIG.THEMES.LIGHT, THEME_CONFIG.THEMES.DARK].includes(theme)) return false;
            
            const body = document.body;
            const themeToggle = document.getElementById(CSS_SELECTORS.THEME_TOGGLE);
            const icon = themeToggle?.querySelector('i');
            
            body.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            
            if (icon) {
                updateThemeIcon(theme, icon);
            }
            
            return true;
        },
        
        showLoading() {
            loadingManager.show();
        },
        
        hideLoading() {
            loadingManager.hide();
        },
        
        toggleSidebar() {
            const sidebar = document.getElementById(CSS_SELECTORS.LEFT_SIDEBAR);
            const overlay = document.getElementById('sidebar-overlay');
            const isOpen = sidebar.classList.contains(CSS_SELECTORS.ACTIVE_CLASS);
            
            if (isOpen) {
                closeSidebar();
            } else {
                openSidebar();
            }
        },
        
        // Helper function to refresh video titles
        refreshVideoTitles() {
            if (typeof applyVideoTitles === 'function') {
                applyVideoTitles();
            }
        },
        
        // Helper function to refresh all video data
        refreshVideoData() {
            if (typeof applyVideoData === 'function') {
                applyVideoData();
            }
        }
    };

    /**
     * Update theme toggle icon
     */
    function updateThemeIcon(theme, icon) {
        if (theme === THEME_CONFIG.THEMES.DARK) {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    /**
     * Open sidebar menu
     */
    function openSidebar() {
        const sidebar = document.getElementById(CSS_SELECTORS.LEFT_SIDEBAR);
        const menuToggle = document.getElementById(CSS_SELECTORS.MOBILE_MENU_TOGGLE);
        const body = document.body;
        
        if (sidebar) {
            sidebar.classList.add(CSS_SELECTORS.ACTIVE_CLASS);
            ScrollLockManager.lock();
            
            // Add active class to hamburger menu
            if (menuToggle) {
                menuToggle.classList.add(CSS_SELECTORS.ACTIVE_CLASS);
                menuToggle.setAttribute('aria-label', 'メニューを閉じる');
                menuToggle.setAttribute('title', 'メニューを閉じる');
            }
            
            // Focus management for accessibility
            const firstFocusable = sidebar.querySelector('a, button');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }
    }

    /**
     * Close sidebar menu
     */
    function closeSidebar() {
        const sidebar = document.getElementById(CSS_SELECTORS.LEFT_SIDEBAR);
        const menuToggle = document.getElementById(CSS_SELECTORS.MOBILE_MENU_TOGGLE);
        const body = document.body;
        
        if (sidebar) {
            sidebar.classList.remove(CSS_SELECTORS.ACTIVE_CLASS);
            ScrollLockManager.unlock();
            debugLog('🔄 Sidebar closed: Re-enabled scrolling', null, 'verbose');
            
            // Remove active class from hamburger menu
            if (menuToggle) {
                menuToggle.classList.remove(CSS_SELECTORS.ACTIVE_CLASS);
                menuToggle.setAttribute('aria-label', 'メニューを開く');
                menuToggle.setAttribute('title', 'メニューを開く');
            }
            
            // Return focus to menu toggle button
            if (menuToggle) {
                menuToggle.focus();
            }
        }
    }

    /**
     * Initialize sidebar functionality
     */
    async function initSidebar() {
        const menuToggle = document.getElementById(CSS_SELECTORS.MOBILE_MENU_TOGGLE);
        const sidebarClose = document.getElementById('sidebar-close');
        const sidebar = document.getElementById(CSS_SELECTORS.LEFT_SIDEBAR);
        
        // Set background image with proper format detection
        if (sidebar) {
            await setSidebarBackground(sidebar);
        }
        
        // Menu toggle click handler
        if (menuToggle) {
            menuToggle.addEventListener('click', function() {
                window.VTuberTheme.toggleSidebar();
            });
        }
        
        // Sidebar close button handler
        if (sidebarClose) {
            sidebarClose.addEventListener('click', function() {
                closeSidebar();
            });
        }
        
        // Auto-close sidebar when menu item is clicked
        const sidebarMenuLinks = document.querySelectorAll('.sidebar-menu-link');
        sidebarMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Close sidebar after a short delay to allow the navigation to start
                setTimeout(() => {
                    closeSidebar();
                }, ANIMATION_CONFIG.SIDEBAR_CLOSE_DELAY);
            });
        });
        
        // Escape key handler
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const sidebar = document.getElementById(CSS_SELECTORS.LEFT_SIDEBAR);
                if (sidebar && sidebar.classList.contains(CSS_SELECTORS.ACTIVE_CLASS)) {
                    closeSidebar();
                }
            }
        });
    }

    /**
     * Set sidebar background image with format detection
     */
    async function setSidebarBackground(sidebar) {
        debugLog('Setting sidebar background...', null, 'verbose');
        
        // Get settings from data attributes (set by PHP)
        const bgImage = sidebar.dataset.bgImage;
        const bgPosition = sidebar.dataset.bgPosition || 'center center';
        const bgSize = sidebar.dataset.bgSize || 'cover';

        if (bgImage) {
            debugLog('Using customizer background image:', bgImage, 'basic');
            
            // Check if browser supports AVIF and if AVIF version exists
            const avifSupported = await checkAVIFSupport();
            
            if (avifSupported && bgImage.includes('.png')) {
                const avifImage = bgImage.replace('.png', '.avif');
                debugLog('Testing AVIF version:', avifImage, 'verbose');
                
                const img = new Image();
                img.onload = function() {
                    debugLog('✅ AVIF image loaded successfully:', avifImage, 'basic');
                    sidebar.style.backgroundImage = `url('${avifImage}')`;
                    sidebar.style.backgroundPosition = bgPosition;
                    sidebar.style.backgroundSize = bgSize;
                };
                img.onerror = function() {
                    debugLog('AVIF not available, using original:', bgImage, 'basic');
                    sidebar.style.backgroundImage = `url('${bgImage}')`;
                    sidebar.style.backgroundPosition = bgPosition;
                    sidebar.style.backgroundSize = bgSize;
                };
                img.src = avifImage;
            } else {
                sidebar.style.backgroundImage = `url('${bgImage}')`;
                sidebar.style.backgroundPosition = bgPosition;
                sidebar.style.backgroundSize = bgSize;
                debugLog('✅ Using background image:', bgImage, 'basic');
            }
        } else {
            console.warn('No background image set in customizer, using fallback');
            // Fallback to original logic if no customizer image is set
            if (typeof vtuber_ajax !== 'undefined' && vtuber_ajax.theme_url) {
                const baseUrl = vtuber_ajax.theme_url + '/images/';
                const avifSupported = await checkAVIFSupport();
                
                let imageUrl;
                if (avifSupported) {
                    imageUrl = `${baseUrl}ibaradevilroze-keyvisual-trans.avif`;
                } else {
                    imageUrl = `${baseUrl}ibaradevilroze-keyvisual-trans.png`;
                }
                
                const img = new Image();
                img.onload = () => {
                    sidebar.style.backgroundImage = `url('${imageUrl}')`;
                    debugLog('✅ Successfully loaded fallback image:', imageUrl, 'basic');
                };
                img.onerror = () => {
                    console.error('❌ Failed to load fallback image:', imageUrl);
                };
                img.src = imageUrl;
            } else {
                sidebar.style.backgroundImage = "url('../images/ibaradevilroze-keyvisual-trans.png')";
            }
        }
    }

    /**
     * Check AVIF support
     */
    function checkAVIFSupport() {
        return new Promise((resolve) => {
            const avif = new Image();
            avif.onload = avif.onerror = () => resolve(avif.height === VISUAL_CONFIG.AVIF_TEST_HEIGHT);
            avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
        });
    }

    /**
     * Initialize theme system
     */
    function initThemeSystem() {
        const themeToggle = document.getElementById(CSS_SELECTORS.THEME_TOGGLE);
        
        if (!themeToggle) {
            console.warn('Theme toggle button not found');
            return;
        }
        
        const body = document.body;
        const icon = themeToggle.querySelector('i');
        
        if (!icon) {
            console.warn('Theme toggle icon not found');
            return;
        }
        
        // Check for saved theme preference or default to system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Set initial theme
        let initialTheme = THEME_CONFIG.THEMES.LIGHT;
        if (savedTheme) {
            initialTheme = savedTheme;
        } else if (systemPrefersDark) {
            initialTheme = THEME_CONFIG.THEMES.DARK;
        }
        
        body.setAttribute('data-theme', initialTheme);
        updateThemeIcon(initialTheme, icon);
        
        // Theme toggle click handler
        themeToggle.addEventListener('click', function() {
            debugLog('🎨 Theme toggle clicked', null, 'verbose');
            
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === THEME_CONFIG.THEMES.DARK ? THEME_CONFIG.THEMES.LIGHT : THEME_CONFIG.THEMES.DARK;
            
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme, icon);
            
            debugLog(`🎨 Theme changed: ${currentTheme} → ${newTheme}`, null, 'basic');
            
            // Smooth transition
            body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
            setTimeout(() => {
                body.style.transition = '';
                // Ensure scrolling remains enabled and remove focus
                document.body.style.overflow = '';
                this.blur();
                debugLog('🎨 Theme toggle cleanup completed', null, 'verbose');
            }, ANIMATION_CONFIG.THEME_TRANSITION_DURATION);
        });
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? THEME_CONFIG.THEMES.DARK : THEME_CONFIG.THEMES.LIGHT;
                body.setAttribute('data-theme', newTheme);
                updateThemeIcon(newTheme, icon);
            }
        });
    }

    /**
     * Initialize smooth scroll navigation
     */
    function initSmoothScroll() {
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                debugLog('🎯 Smooth scroll: Navigation to', this.getAttribute('href'), 'verbose');
                
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = DOMUtils.getElementById(targetId);
                
                if (targetElement) {
                    const header = DOMUtils.getElementById(CSS_SELECTORS.MAIN_HEADER);
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = targetElement.offsetTop - headerHeight - SCROLL_CONFIG.SMOOTH_SCROLL_OFFSET;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    updateActiveNavLink(this);
                }
                
                // Ensure page remains scrollable after navigation
                DOMUtils.delay(() => {
                    document.body.style.overflow = '';
                    this.blur(); // Remove focus from the clicked link
                    debugLog('🎯 Smooth scroll: Cleanup completed', null, 'verbose');
                }, ANIMATION_CONFIG.SMOOTH_SCROLL_CLEANUP_DELAY);
            });
        });
    }

    /**
     * Update active navigation link
     */
    function updateActiveNavLink(activeLink) {
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => link.classList.remove(CSS_SELECTORS.ACTIVE_CLASS));
        activeLink.classList.add(CSS_SELECTORS.ACTIVE_CLASS);
    }

    /**
     * Initialize fade-in animations using Intersection Observer
     */
    function initFadeInAnimations() {
        const fadeElements = document.querySelectorAll('.fade-in, .achievement-card, .video-card, .news-card');
        
        if (!fadeElements.length) return;
        
        const observerOptions = {
            threshold: VISUAL_CONFIG.FADE_IN_THRESHOLD,
            rootMargin: VISUAL_CONFIG.FADE_IN_ROOT_MARGIN
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    DOMUtils.toggleClass(entry.target, CSS_SELECTORS.VISIBLE_CLASS, true);
                    
                    // Add staggered delay for grid items
                    if (entry.target.classList.contains('achievement-card') || 
                        entry.target.classList.contains('video-card') ||
                        entry.target.classList.contains('news-card')) {
                        const siblings = Array.from(entry.target.parentNode.children);
                        const index = siblings.indexOf(entry.target);
                        entry.target.style.transitionDelay = `${index * VISUAL_CONFIG.STAGGER_DELAY_MULTIPLIER}s`;
                    }
                    
                    // Unobserve after animation to improve performance
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        fadeElements.forEach(element => {
            element.classList.add('fade-in');
            observer.observe(element);
        });
    }

    /**
     * Initialize header scroll effects
     */
    function initHeaderScroll() {
        const header = DOMUtils.getElementById(CSS_SELECTORS.MAIN_HEADER);
        if (!header) return;
        
        let lastScroll = 0;
        let ticking = false;
        
        function updateHeader() {
            const currentScroll = window.pageYOffset;
            
            // Add/remove scrolled class for styling
            DOMUtils.toggleClass(header, CSS_SELECTORS.SCROLLED_CLASS, currentScroll > SCROLL_CONFIG.HEADER_SCROLLED_THRESHOLD);
            
            // Hide/show header on scroll
            if (currentScroll > lastScroll && currentScroll > SCROLL_CONFIG.HEADER_HIDE_THRESHOLD) {
                AnimationUtils.setTransform(header, SCROLL_CONFIG.HEADER_HIDDEN_TRANSFORM);
            } else {
                AnimationUtils.setTransform(header, SCROLL_CONFIG.HEADER_VISIBLE_TRANSFORM);
            }
            
            lastScroll = currentScroll;
            updateActiveSection();
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }

    /**
     * Update active section in navigation based on scroll position
     */
    function updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        const header = DOMUtils.getElementById(CSS_SELECTORS.MAIN_HEADER);
        const headerHeight = header ? header.offsetHeight : 0;
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - SCROLL_CONFIG.SECTION_OFFSET_BUFFER;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${currentSection}`;
            DOMUtils.toggleClass(link, CSS_SELECTORS.ACTIVE_CLASS, isActive);
        });
    }

    /**
     * Initialize contact form handling
     */
    function initContactForm() {
        const contactForm = document.querySelector('.contact-form');
        
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (!submitBtn) return;
            
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = '送信中...';
            submitBtn.disabled = true;
            AnimationUtils.setOpacity(submitBtn, VISUAL_CONFIG.CONTACT_FORM_DISABLED_OPACITY);
            
            // Reset button after response (or timeout)
            DOMUtils.delay(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                AnimationUtils.setOpacity(submitBtn, VISUAL_CONFIG.CONTACT_FORM_ENABLED_OPACITY);
            }, ANIMATION_CONFIG.CONTACT_FORM_RESET_TIMEOUT);
        });
        
        // Enhanced input focus effects
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                DOMUtils.toggleClass(this.parentNode, CSS_SELECTORS.FOCUSED_CLASS, true);
            });
            
            input.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    DOMUtils.toggleClass(this.parentNode, CSS_SELECTORS.FOCUSED_CLASS, false);
                }
            });
            
            // Check if input has value on load
            if (input.value.trim()) {
                DOMUtils.toggleClass(input.parentNode, CSS_SELECTORS.FOCUSED_CLASS, true);
            }
        });
    }

    /**
     * Initialize social link effects
     */
    function initSocialEffects() {
        const socialLinks = document.querySelectorAll('.social-link');
        
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                AnimationUtils.setTransform(this, VISUAL_CONFIG.SOCIAL_LINK_HOVER_TRANSFORM);
            });
            
            link.addEventListener('mouseleave', function() {
                AnimationUtils.setTransform(this, VISUAL_CONFIG.SOCIAL_LINK_NORMAL_TRANSFORM);
            });
        });
    }

    /**
     * Initialize keyboard navigation
     */
    function initKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            // Theme toggle with 'T' key
            if ((e.key === 't' || e.key === 'T') && !e.target.matches('input, textarea')) {
                e.preventDefault();
                window.VTuberTheme.toggleTheme();
            }
            
            // ESC key to close any open modals
            if (e.key === 'Escape') {
                // Add modal close functionality here if needed
            }
        });
    }

    /**
     * Initialize video section functionality
     */
    function initVideoSection() {
        const playButtons = document.querySelectorAll('.play-button');
        
        playButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Find the corresponding "視聴する" link in the same video card
                const videoCard = this.closest('.video-card');
                const watchLink = videoCard?.querySelector('a[href*="youtube.com"], a[href*="youtu.be"], a[href*="twitch.tv"], a[href*="watch"], .btn-primary');
                
                if (watchLink) {
                    // Open the video link
                    window.open(watchLink.href, '_blank', 'noopener,noreferrer');
                } else {
                    console.warn('Watch link not found for this video card');
                }
            });
            
            // Add keyboard accessibility
            button.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
        
        // Make video cards clickable (optional)
        const videoCards = document.querySelectorAll('.video-card');
        videoCards.forEach(card => {
            card.addEventListener('click', function(e) {
                // Only trigger if not clicking on the play button or watch link
                if (!e.target.closest('.play-button') && !e.target.closest('a')) {
                    const watchLink = this.querySelector('a[href*="youtube.com"], a[href*="youtu.be"], a[href*="twitch.tv"], a[href*="watch"], .btn-primary');
                    if (watchLink) {
                        window.open(watchLink.href, '_blank', 'noopener,noreferrer');
                    }
                }
            });
            
            // Add hover effect for better UX
            card.style.cursor = 'pointer';
        });
        
        // Apply video data from customizer
        applyVideoData();
        
        // Also apply data after a short delay to ensure DOM is fully loaded
        setTimeout(() => {
            applyVideoData();
        }, 100);
    }

    /**
     * Apply video data from WordPress customizer
     */
    function applyVideoData() {
        // Check if vtuber_ajax and video_data are available
        if (typeof vtuber_ajax === 'undefined' || !vtuber_ajax.video_data) {
            console.warn('Video data not available');
            return;
        }
        
        const videoData = vtuber_ajax.video_data;
        
        // Get all video cards
        const videoCards = document.querySelectorAll('.video-card');
        
        // Apply data to video cards
        Object.keys(videoData).forEach((videoKey, index) => {
            const data = videoData[videoKey];
            if (videoCards[index]) {
                const videoCard = videoCards[index];
                
                // Apply title
                if (data.title && data.title.trim() !== '') {
                    const titleElement = videoCard.querySelector('.video-info h3');
                    if (titleElement) {
                        // Store original title as fallback
                        if (!titleElement.hasAttribute('data-original-title')) {
                            titleElement.setAttribute('data-original-title', titleElement.textContent);
                        }
                        titleElement.textContent = data.title;
                        debugLog(`Applied title "${data.title}" to video card ${index + 1}`, null, 'verbose');
                    }
                }
                
                // Apply description
                if (data.description && data.description.trim() !== '') {
                    const descElement = videoCard.querySelector('.video-info p:not(.video-channel)');
                    if (descElement) {
                        // Store original description as fallback
                        if (!descElement.hasAttribute('data-original-desc')) {
                            descElement.setAttribute('data-original-desc', descElement.textContent);
                        }
                        descElement.textContent = data.description;
                        debugLog(`Applied description "${data.description}" to video card ${index + 1}`, null, 'verbose');
                    }
                }
                
                // Apply URL
                if (data.url && data.url.trim() !== '' && data.url !== '#') {
                    const linkElement = videoCard.querySelector('.video-link, .btn-primary');
                    if (linkElement) {
                        // Store original URL as fallback
                        if (!linkElement.hasAttribute('data-original-url')) {
                            linkElement.setAttribute('data-original-url', linkElement.href);
                        }
                        linkElement.href = data.url;
                        debugLog(`Applied URL "${data.url}" to video card ${index + 1}`, null, 'verbose');
                    }
                }
            }
        });
        
        // Debug information
        debugLog('Video data from customizer:', videoData, 'verbose');
        debugLog('Found video cards:', videoCards.length, 'verbose');
    }

    /**
     * Apply video titles from WordPress customizer (legacy support)
     */
    function applyVideoTitles() {
        // Call the new comprehensive function
        applyVideoData();
    }

    /**
     * Preload critical images
     */
    function preloadCriticalImages() {
        const heroImg = document.querySelector('.hero-image img');
        if (heroImg && heroImg.src) {
            const img = new Image();
            img.src = heroImg.src;
        }
    }

    /**
     * Handle window load events
     */
    function initWindowLoadHandler() {
        window.addEventListener('load', function() {
            // Trigger load-dependent animations
            setTimeout(() => {
                const heroSection = document.querySelector('.hero');
                if (heroSection) {
                    heroSection.classList.add('loaded');
                }
            }, 100);
        });
    }

    /**
     * Main initialization function
     */
    function initializeTheme() {
        if (window.VTuberTheme.initialized) {
            return;
        }
        
        // Debug: Check if video data is available
        if (typeof vtuber_ajax !== 'undefined' && vtuber_ajax.video_data) {
            debugLog('Video data available:', vtuber_ajax.video_data, 'verbose');
        } else {
            console.warn('Video data not available in vtuber_ajax');
        }
        
        // Legacy check for video titles
        if (typeof vtuber_ajax !== 'undefined' && vtuber_ajax.video_titles) {
            debugLog('Video titles available:', vtuber_ajax.video_titles, 'verbose');
        }
        
        // Initialize all features
        initThemeSystem();
        initSidebar();
        initSmoothScroll();
        initFadeInAnimations();
        initHeaderScroll();
        initContactForm();
        initSocialEffects();
        initKeyboardNavigation();
        initVideoSection();
        initWindowLoadHandler();
        preloadCriticalImages();
        initHeaderFocusManagement();
        
        window.VTuberTheme.initialized = true;
        
        debugLog('%c🎮 Welcome to IbaraDevilRoze\'s Landing Page! 🎮', 
                    'color: #8b5cf6; font-size: 16px; font-weight: bold;', 'basic');
        debugLog('%cTheme: Modern White/Black + Purple Accent with Dark Mode', 
                    'color: #6c757d; font-size: 12px;', 'basic');
    }

    /**
     * Initialize header focus management to prevent scroll issues
     */
    function initHeaderFocusManagement() {
        const header = document.getElementById('main-header');
        if (!header) return;

        debugLog('🔧 Initializing header focus management...', null, 'basic');

        // Global scroll state monitoring
        let scrollDisabled = false;
        
        function checkScrollState() {
            const bodyOverflow = getComputedStyle(document.body).overflow;
            const htmlOverflow = getComputedStyle(document.documentElement).overflow;
            debugLog('📊 Scroll state check:', {
                bodyOverflow,
                htmlOverflow,
                scrollDisabled,
                bodyStyleOverflow: document.body.style.overflow,
                documentHeight: document.documentElement.scrollHeight,
                windowHeight: window.innerHeight
            }, 'verbose');
        }

        // Monitor scroll events
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            debugLog('🖱️ Scroll event:', {
                from: lastScrollY,
                to: currentScrollY,
                delta: currentScrollY - lastScrollY
            }, 'verbose');
            lastScrollY = currentScrollY;
        });

        // Monitor wheel events specifically
        window.addEventListener('wheel', (e) => {
            debugLog('🎡 Wheel event:', {
                deltaY: e.deltaY,
                deltaX: e.deltaX,
                ctrlKey: e.ctrlKey,
                prevented: e.defaultPrevented,
                target: e.target.tagName,
                targetClass: e.target.className
            }, 'verbose');
        });

        // Handle all clickable elements in header
        const headerElements = header.querySelectorAll('a, button');
        debugLog(`🎯 Found ${headerElements.length} clickable elements in header`, null, 'verbose');
        
        headerElements.forEach((element, index) => {
            debugLog(`📍 Element ${index}:`, {
                tag: element.tagName,
                class: element.className,
                id: element.id,
                text: element.textContent?.trim()
            }, 'verbose');

            element.addEventListener('click', function(e) {
                debugLog('🖱️ Header element clicked:', {
                    tag: this.tagName,
                    class: this.className,
                    id: this.id,
                    text: this.textContent?.trim(),
                    href: this.getAttribute('href'),
                    currentBodyOverflow: document.body.style.overflow,
                    timestamp: Date.now()
                }, 'basic');

                // Check scroll state before and after
                checkScrollState();
                
                // Ensure scrolling remains enabled after any header interaction
                setTimeout(() => {
                    document.body.style.overflow = '';
                    debugLog('🔄 Reset body overflow after header click', null, 'verbose');
                    checkScrollState();
                    
                    // Remove focus to prevent keyboard event capture issues
                    if (!this.classList.contains('mobile-menu-toggle')) {
                        this.blur();
                        debugLog('👁️ Removed focus from element', null, 'verbose');
                    }
                }, 50);
            });
        });

        // Specific handling for logo links
        const logoLinks = header.querySelectorAll('.logo a');
        logoLinks.forEach((logoLink, index) => {
            logoLink.addEventListener('click', function(e) {
                debugLog('🏠 Logo clicked:', {
                    index,
                    href: this.getAttribute('href'),
                    beforeBodyOverflow: document.body.style.overflow
                }, 'verbose');
                
                checkScrollState();
                
                // Ensure page scrollability after logo click
                setTimeout(() => {
                    document.body.style.overflow = '';
                    this.blur();
                    debugLog('🏠 Logo click cleanup completed', null, 'verbose');
                    checkScrollState();
                }, 100);
            });
        });

        // Initial scroll state check
        setTimeout(checkScrollState, 1000);
        
        debugLog('✅ Header focus management initialized', null, 'basic');
        
        // Log initial theme if available
        if (window.initialTheme) {
            debugLog('🎨 Theme initialized:', window.initialTheme, 'basic');
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTheme);
    } else {
        initializeTheme();
    }

})();

// Initialize Image Loading Manager
let themeImageManager;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        themeImageManager = new ImageLoadingManager();
    });
} else {
    themeImageManager = new ImageLoadingManager();
}

// Enhanced Image Loading Manager for AVIF/PNG fallback
class ImageLoadingManager {
    constructor() {
        this.loadedImages = new Set();
        this.totalImages = 0;
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupImageLoading());
        } else {
            this.setupImageLoading();
        }
    }
    
    setupImageLoading() {
        // Handle all images with lazy loading
        const images = document.querySelectorAll('img[loading="lazy"], picture img');
        this.totalImages = images.length;
        
        images.forEach((img, index) => {
            this.handleImageLoad(img, index);
        });
        
        // Setup intersection observer for lazy loaded images
        this.setupLazyLoading();
    }
    
    handleImageLoad(img, index) {
        // Add loading state
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease-in-out';
        
        const loadHandler = () => {
            this.loadedImages.add(index);
            img.style.opacity = '1';
            img.classList.add('loaded');
            
            // Trigger custom event
            img.dispatchEvent(new CustomEvent('imageLoaded', {
                detail: { 
                    index: index, 
                    total: this.totalImages,
                    loaded: this.loadedImages.size
                }
            }));
        };
        
        const errorHandler = () => {
            // Handle image load error
            console.warn('Image failed to load:', img.src);
            img.style.opacity = '0.7';
            img.classList.add('load-error');
        };
        
        if (img.complete && img.naturalHeight !== 0) {
            // Image already loaded
            loadHandler();
        } else {
            img.addEventListener('load', loadHandler, { once: true });
            img.addEventListener('error', errorHandler, { once: true });
        }
    }
    
    setupLazyLoading() {
        // Enhanced intersection observer for better performance
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Handle data-src attributes if present
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        delete img.dataset.src;
                    }
                    
                    // Handle AVIF fallback data attributes
                    if (img.dataset.avifSrc && !document.body.classList.contains('no-avif')) {
                        img.src = img.dataset.avifSrc;
                        delete img.dataset.avifSrc;
                    }
                    
                    observer.unobserve(img);
                }
            });
        }, {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        });
        
        // Observe all images that aren't already loaded
        document.querySelectorAll('img[data-src], img[data-avif-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    getAllLoadedStatus() {
        return {
            loaded: this.loadedImages.size,
            total: this.totalImages,
            percentage: this.totalImages > 0 ? (this.loadedImages.size / this.totalImages) * 100 : 100
        };
    }
}
