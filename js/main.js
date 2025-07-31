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

/**
 * Unified Theme Configuration
 * Centralizes all theme settings for better maintainability
 */
const THEME_CONFIG = Object.freeze({
    // Basic theme information
    VERSION: '2.1',
    THEMES: {
        LIGHT: 'light',
        DARK: 'dark'
    },
    
    // Animation and timing settings
    ANIMATION: {
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
    },
    
    // Scroll and layout settings
    SCROLL: {
        HEADER_SCROLLED_THRESHOLD: 100,
        HEADER_HIDE_THRESHOLD: 200,
        SECTION_OFFSET_BUFFER: 100,
        SMOOTH_SCROLL_OFFSET: 20,
        HEADER_HIDDEN_TRANSFORM: 'translateY(-100%)',
        HEADER_VISIBLE_TRANSFORM: 'translateY(0)'
    },
    
    // Visual and animation settings
    VISUAL: {
        FADE_IN_THRESHOLD: 0.15,
        FADE_IN_ROOT_MARGIN: '0px 0px -50px 0px',
        STAGGER_DELAY_MULTIPLIER: 0.1,
        SOCIAL_LINK_HOVER_TRANSFORM: 'translateY(-3px) scale(1.05)',
        SOCIAL_LINK_NORMAL_TRANSFORM: 'translateY(0) scale(1)',
        CONTACT_FORM_DISABLED_OPACITY: '0.7',
        CONTACT_FORM_ENABLED_OPACITY: '1',
        IMAGE_ERROR_OPACITY: '0.7',
        AVIF_TEST_HEIGHT: 2
    },
    
    // CSS selectors and classes
    SELECTORS: {
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
    },
    
    // Debug configuration
    DEBUG: {
        enabled: window.vtuber_ajax?.debug_settings?.enabled || false,
        level: window.vtuber_ajax?.debug_settings?.level || 'basic'
    }
});

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

/**
 * Application State Manager
 * Centralizes theme state and provides clean APIs for state management
 */
class ApplicationState {
    constructor() {
        this.isInitialized = false;
        this.loadingManager = null;
        this.observers = new Map();
        this.components = new Map();
    }

    /**
     * Initialize application state
     */
    initialize() {
        if (this.isInitialized) {
            console.warn('Application already initialized');
            return false;
        }

        this.loadingManager = new LoadingManager();
        this.isInitialized = true;
        
        debugLog('🚀 Application state initialized', null, 'basic');
        return true;
    }

    /**
     * Register a component with the application
     */
    registerComponent(name, component) {
        if (this.components.has(name)) {
            console.warn(`Component '${name}' already registered`);
            return false;
        }
        
        this.components.set(name, component);
        debugLog(`📦 Component registered: ${name}`, null, 'verbose');
        return true;
    }

    /**
     * Get a registered component
     */
    getComponent(name) {
        return this.components.get(name);
    }

    /**
     * Check if application is fully initialized
     */
    isReady() {
        return this.isInitialized && this.loadingManager !== null;
    }

    /**
     * Clean shutdown of application state
     */
    shutdown() {
        this.observers.clear();
        this.components.clear();
        this.isInitialized = false;
        debugLog('🛑 Application state shutdown', null, 'basic');
    }
}

/**
 * Initialization Manager
 * Handles the sequential initialization of theme components
 */
class InitializationManager {
    constructor(appState) {
        this.appState = appState;
        this.initializationQueue = [];
        this.initialized = new Set();
        this.dependencies = new Map();
    }

    /**
     * Add an initialization task with optional dependencies
     */
    addTask(name, initFunction, dependencies = []) {
        this.initializationQueue.push({ name, initFunction, dependencies });
        this.dependencies.set(name, dependencies);
    }

    /**
     * Execute all initialization tasks in dependency order
     */
    async execute() {
        debugLog('🔧 Starting theme initialization...', null, 'basic');
        
        // Sort tasks by dependencies
        const sortedTasks = this.topologicalSort();
        
        for (const task of sortedTasks) {
            try {
                await this.executeTask(task);
            } catch (error) {
                console.error(`Failed to initialize ${task.name}:`, error);
            }
        }
        
        debugLog('✅ Theme initialization completed', null, 'basic');
    }

    /**
     * Execute a single initialization task
     */
    async executeTask(task) {
        if (this.initialized.has(task.name)) {
            return;
        }

        debugLog(`🔧 Initializing: ${task.name}`, null, 'verbose');
        
        const result = await task.initFunction();
        this.initialized.add(task.name);
        
        if (result && typeof result === 'object') {
            this.appState.registerComponent(task.name, result);
        }
    }

    /**
     * Simple topological sort for dependency resolution
     */
    topologicalSort() {
        const sorted = [];
        const visited = new Set();
        const visiting = new Set();

        const visit = (task) => {
            if (visiting.has(task.name)) {
                throw new Error(`Circular dependency detected: ${task.name}`);
            }
            if (visited.has(task.name)) {
                return;
            }

            visiting.add(task.name);
            
            for (const depName of task.dependencies) {
                const depTask = this.initializationQueue.find(t => t.name === depName);
                if (depTask) {
                    visit(depTask);
                }
            }
            
            visiting.delete(task.name);
            visited.add(task.name);
            sorted.push(task);
        };

        for (const task of this.initializationQueue) {
            visit(task);
        }

        return sorted;
    }
}

// Create global application state instance
const appState = new ApplicationState();

// Debug logging function
function debugLog(message, data = null, level = 'basic') {
    if (!THEME_CONFIG.DEBUG.enabled) return;
    
    // Check log level
    const levels = ['minimal', 'basic', 'verbose'];
    const currentLevel = levels.indexOf(THEME_CONFIG.DEBUG.level);
    const messageLevel = levels.indexOf(level);
    
    if (messageLevel > currentLevel) return;
    
    if (data) {
        console.log(message, data);
    } else {
        console.log(message);
    }
}

// Enhanced Loading Screen Manager
class LoadingManager {
    constructor(config = {}) {
        this.loadingScreen = null;
        this.isLoading = false;
        this.config = {
            enabled: true,
            min_loading_time: THEME_CONFIG.ANIMATION.LOADING_MIN_TIME,
            enable_transitions: true,
            show_for_external: false,
            ...window.vtuber_ajax?.loading_config,
            ...config
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
        this.loadingScreen = DOMUtils.getElementById(THEME_CONFIG.SELECTORS.LOADING_SCREEN);
        if (this.loadingScreen) {
            this.loadingScreen.classList.remove(THEME_CONFIG.SELECTORS.HIDDEN_CLASS);
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
        
        DOMUtils.delay(() => {
            this.loadingScreen.classList.add(THEME_CONFIG.SELECTORS.HIDDEN_CLASS);
            this.isLoading = false;
            
            // Re-enable scrolling
            ScrollLockManager.unlock();
            debugLog('🔄 Loading screen: Re-enabled scrolling', null, 'verbose');
            
            // Remove loading screen from DOM after animation
            DOMUtils.delay(() => {
                if (this.loadingScreen && this.loadingScreen.parentNode) {
                    this.loadingScreen.style.display = 'none';
                }
            }, THEME_CONFIG.ANIMATION.LOADING_HIDE_DELAY);
            
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
                DOMUtils.delay(() => this.show(), THEME_CONFIG.ANIMATION.LOADING_SHOW_DELAY);
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
        }, THEME_CONFIG.ANIMATION.SCROLL_LOCK_RESET_DELAY);
    });
    
    // Reset scroll lock on visibility change (when tab becomes visible again)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            setTimeout(() => {
                if (ScrollLockManager.getCount() > 0) {
                    debugLog('🔄 Tab became visible with active scroll lock, resetting', null, 'basic');
                    ScrollLockManager.reset();
                }
            }, THEME_CONFIG.ANIMATION.SCROLL_LOCK_RESET_DELAY);
        }
    });
}

// Initialize scroll lock management immediately
initScrollLockManagement();

(function() {
    /**
     * Enhanced Global Theme API
     * Provides a clean, documented interface for theme functionality
     */
    window.VTuberTheme = Object.freeze({
        // Basic information
        version: THEME_CONFIG.VERSION,
        
        // State accessors
        get initialized() {
            return appState.isInitialized;
        },
        
        get config() {
            return THEME_CONFIG;
        },
        
        get state() {
            return {
                initialized: appState.isInitialized,
                components: Array.from(appState.components.keys()),
                loadingActive: appState.loadingManager?.isLoading || false
            };
        },
        
        // Theme management
        theme: {
            toggle() {
                const themeToggle = DOMUtils.getElementById(THEME_CONFIG.SELECTORS.THEME_TOGGLE);
                if (themeToggle) {
                    themeToggle.click();
                }
            },
            
            getCurrent() {
                return ThemeUtils.getCurrentTheme();
            },
            
            set(theme) {
                return ThemeUtils.setTheme(theme);
            }
        },
        
        // Loading management
        loading: {
            show() {
                appState.loadingManager?.show();
            },
            
            hide() {
                appState.loadingManager?.hide();
            },
            
            get isActive() {
                return appState.loadingManager?.isLoading || false;
            }
        },
        
        // Sidebar management
        sidebar: {
            toggle() {
                const sidebar = DOMUtils.getElementById(THEME_CONFIG.SELECTORS.LEFT_SIDEBAR);
                const isOpen = sidebar?.classList.contains(THEME_CONFIG.SELECTORS.ACTIVE_CLASS);
                
                if (isOpen) {
                    closeSidebar();
                } else {
                    openSidebar();
                }
            },
            
            open() {
                openSidebar();
            },
            
            close() {
                closeSidebar();
            },
            
            get isOpen() {
                const sidebar = DOMUtils.getElementById(THEME_CONFIG.SELECTORS.LEFT_SIDEBAR);
                return sidebar?.classList.contains(THEME_CONFIG.SELECTORS.ACTIVE_CLASS) || false;
            }
        },
        
        // Video management
        video: {
            refreshTitles() {
                if (typeof applyVideoTitles === 'function') {
                    applyVideoTitles();
                }
            },
            
            refreshData() {
                if (typeof applyVideoData === 'function') {
                    applyVideoData();
                }
            }
        },
        
        // Component access
        getComponent(name) {
            return appState.getComponent(name);
        },
        
        // Debug utilities
        debug: {
            get enabled() {
                return THEME_CONFIG.DEBUG.enabled;
            },
            
            log(message, data = null, level = 'basic') {
                debugLog(message, data, level);
            },
            
            getState() {
                return {
                    appState: appState.isReady(),
                    components: Array.from(appState.components.keys()),
                    config: THEME_CONFIG
                };
            }
        }
    });

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
        const sidebar = DOMUtils.getElementById(THEME_CONFIG.SELECTORS.LEFT_SIDEBAR);
        const menuToggle = DOMUtils.getElementById(THEME_CONFIG.SELECTORS.MOBILE_MENU_TOGGLE);
        const body = document.body;
        
        if (sidebar) {
            sidebar.classList.add(THEME_CONFIG.SELECTORS.ACTIVE_CLASS);
            ScrollLockManager.lock();
            
            // Add active class to hamburger menu
            if (menuToggle) {
                menuToggle.classList.add(THEME_CONFIG.SELECTORS.ACTIVE_CLASS);
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
        const sidebar = DOMUtils.getElementById(THEME_CONFIG.SELECTORS.LEFT_SIDEBAR);
        const menuToggle = DOMUtils.getElementById(THEME_CONFIG.SELECTORS.MOBILE_MENU_TOGGLE);
        const body = document.body;
        
        if (sidebar) {
            sidebar.classList.remove(THEME_CONFIG.SELECTORS.ACTIVE_CLASS);
            ScrollLockManager.unlock();
            debugLog('🔄 Sidebar closed: Re-enabled scrolling', null, 'verbose');
            
            // Remove active class from hamburger menu
            if (menuToggle) {
                menuToggle.classList.remove(THEME_CONFIG.SELECTORS.ACTIVE_CLASS);
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
        const menuToggle = DOMUtils.getElementById(THEME_CONFIG.SELECTORS.MOBILE_MENU_TOGGLE);
        const sidebarClose = document.getElementById('sidebar-close');
        const sidebar = DOMUtils.getElementById(THEME_CONFIG.SELECTORS.LEFT_SIDEBAR);
        
        // Set background image with proper format detection
        if (sidebar) {
            await setSidebarBackground(sidebar);
        }
        
        // Menu toggle click handler
        if (menuToggle) {
            menuToggle.addEventListener('click', function() {
                window.VTuberTheme.sidebar.toggle();
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
                }, THEME_CONFIG.ANIMATION.SIDEBAR_CLOSE_DELAY);
            });
        });
        
        // Escape key handler
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const sidebar = DOMUtils.getElementById(THEME_CONFIG.SELECTORS.LEFT_SIDEBAR);
                if (sidebar && sidebar.classList.contains(THEME_CONFIG.SELECTORS.ACTIVE_CLASS)) {
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
            avif.onload = avif.onerror = () => resolve(avif.height === THEME_CONFIG.VISUAL.AVIF_TEST_HEIGHT);
            avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
        });
    }

    /**
     * Initialize theme system
     */
    function initThemeSystem() {
        const themeToggle = DOMUtils.getElementById(THEME_CONFIG.SELECTORS.THEME_TOGGLE);
        
        if (!themeToggle) {
            console.warn('Theme toggle button not found');
            return null;
        }
        
        const body = document.body;
        const icon = themeToggle.querySelector('i');
        
        if (!icon) {
            console.warn('Theme toggle icon not found');
            return null;
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
            AnimationUtils.smoothTransition(body, 'background-color 0.3s ease, color 0.3s ease', THEME_CONFIG.ANIMATION.THEME_TRANSITION_DURATION, () => {
                // Ensure scrolling remains enabled and remove focus
                document.body.style.overflow = '';
                themeToggle.blur();
                debugLog('🎨 Theme toggle cleanup completed', null, 'verbose');
            });
        });
        
        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemThemeChange = (e) => {
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? THEME_CONFIG.THEMES.DARK : THEME_CONFIG.THEMES.LIGHT;
                body.setAttribute('data-theme', newTheme);
                updateThemeIcon(newTheme, icon);
            }
        };
        
        mediaQuery.addEventListener('change', handleSystemThemeChange);
        
        // Return component interface
        return {
            name: 'themeSystem',
            element: themeToggle,
            getCurrentTheme: () => body.getAttribute('data-theme'),
            setTheme: (theme) => ThemeUtils.setTheme(theme),
            destroy: () => {
                mediaQuery.removeEventListener('change', handleSystemThemeChange);
            }
        };
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
                    const header = DOMUtils.getElementById(THEME_CONFIG.SELECTORS.MAIN_HEADER);
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = targetElement.offsetTop - headerHeight - THEME_CONFIG.SCROLL.SMOOTH_SCROLL_OFFSET;
                    
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
                }, THEME_CONFIG.ANIMATION.SMOOTH_SCROLL_CLEANUP_DELAY);
            });
        });
    }

    /**
     * Update active navigation link
     */
    function updateActiveNavLink(activeLink) {
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => link.classList.remove(THEME_CONFIG.SELECTORS.ACTIVE_CLASS));
        activeLink.classList.add(THEME_CONFIG.SELECTORS.ACTIVE_CLASS);
    }

    /**
     * Initialize fade-in animations using Intersection Observer
     */
    function initFadeInAnimations() {
        const fadeElements = document.querySelectorAll('.fade-in, .achievement-card, .video-card, .news-card');
        
        if (!fadeElements.length) return;
        
        const observerOptions = {
            threshold: THEME_CONFIG.VISUAL.FADE_IN_THRESHOLD,
            rootMargin: THEME_CONFIG.VISUAL.FADE_IN_ROOT_MARGIN
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    DOMUtils.toggleClass(entry.target, THEME_CONFIG.SELECTORS.VISIBLE_CLASS, true);
                    
                    // Add staggered delay for grid items
                    if (entry.target.classList.contains('achievement-card') || 
                        entry.target.classList.contains('video-card') ||
                        entry.target.classList.contains('news-card')) {
                        const siblings = Array.from(entry.target.parentNode.children);
                        const index = siblings.indexOf(entry.target);
                        entry.target.style.transitionDelay = `${index * THEME_CONFIG.VISUAL.STAGGER_DELAY_MULTIPLIER}s`;
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
        const header = DOMUtils.getElementById(THEME_CONFIG.SELECTORS.MAIN_HEADER);
        if (!header) return;
        
        let lastScroll = 0;
        let ticking = false;
        
        function updateHeader() {
            const currentScroll = window.pageYOffset;
            
            // Add/remove scrolled class for styling
            DOMUtils.toggleClass(header, THEME_CONFIG.SELECTORS.SCROLLED_CLASS, currentScroll > THEME_CONFIG.SCROLL.HEADER_SCROLLED_THRESHOLD);
            
            // Hide/show header on scroll
            if (currentScroll > lastScroll && currentScroll > THEME_CONFIG.SCROLL.HEADER_HIDE_THRESHOLD) {
                AnimationUtils.setTransform(header, THEME_CONFIG.SCROLL.HEADER_HIDDEN_TRANSFORM);
            } else {
                AnimationUtils.setTransform(header, THEME_CONFIG.SCROLL.HEADER_VISIBLE_TRANSFORM);
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
        const header = DOMUtils.getElementById(THEME_CONFIG.SELECTORS.MAIN_HEADER);
        const headerHeight = header ? header.offsetHeight : 0;
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - THEME_CONFIG.SCROLL.SECTION_OFFSET_BUFFER;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${currentSection}`;
            DOMUtils.toggleClass(link, THEME_CONFIG.SELECTORS.ACTIVE_CLASS, isActive);
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
            AnimationUtils.setOpacity(submitBtn, THEME_CONFIG.VISUAL.CONTACT_FORM_DISABLED_OPACITY);
            
            // Reset button after response (or timeout)
            DOMUtils.delay(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                AnimationUtils.setOpacity(submitBtn, THEME_CONFIG.VISUAL.CONTACT_FORM_ENABLED_OPACITY);
            }, THEME_CONFIG.ANIMATION.CONTACT_FORM_RESET_TIMEOUT);
        });
        
        // Enhanced input focus effects
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                DOMUtils.toggleClass(this.parentNode, THEME_CONFIG.SELECTORS.FOCUSED_CLASS, true);
            });
            
            input.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    DOMUtils.toggleClass(this.parentNode, THEME_CONFIG.SELECTORS.FOCUSED_CLASS, false);
                }
            });
            
            // Check if input has value on load
            if (input.value.trim()) {
                DOMUtils.toggleClass(input.parentNode, THEME_CONFIG.SELECTORS.FOCUSED_CLASS, true);
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
                AnimationUtils.setTransform(this, THEME_CONFIG.VISUAL.SOCIAL_LINK_HOVER_TRANSFORM);
            });
            
            link.addEventListener('mouseleave', function() {
                AnimationUtils.setTransform(this, THEME_CONFIG.VISUAL.SOCIAL_LINK_NORMAL_TRANSFORM);
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
                window.VTuberTheme.theme.toggle();
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
        
        // Make video cards clickable and accessible
        const videoCards = document.querySelectorAll('.video-card');
        videoCards.forEach(card => {
            card.addEventListener('click', function(e) {
                if (!e.target.closest('.play-button') && !e.target.closest('a')) {
                    const watchLink = this.querySelector('a[href*="youtube.com"], a[href*="youtu.be"], a[href*="twitch.tv"], a[href*="watch"], .btn-primary');
                    if (watchLink) {
                        try {
                            window.open(watchLink.href, '_blank', 'noopener,noreferrer');
                        } catch (err) {
                            console.error('[VideoSection] Failed to open video link:', err);
                        }
                    } else {
                        console.warn('[VideoSection] No watch link found in video card.');
                    }
                }
            });
            card.style.cursor = 'pointer';
        });

        // Apply video data from customizer (with error handling)
        try {
            applyVideoData();
            setTimeout(() => {
                try { applyVideoData(); } catch (err) { console.error('[VideoSection] applyVideoData error (delayed):', err); }
            }, THEME_CONFIG.ANIMATION.VIDEO_DATA_APPLY_DELAY);
        } catch (err) {
            console.error('[VideoSection] applyVideoData error:', err);
        }
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
     * Modern Theme Initialization System
     * Uses dependency injection and modular initialization
     */
    async function initializeTheme() {
        if (appState.isInitialized) {
            console.warn('Theme already initialized');
            return;
        }
        
        // Initialize application state
        appState.initialize();
        
        // Create initialization manager
        const initManager = new InitializationManager(appState);
        
        // Register initialization tasks with dependencies
        initManager.addTask('themeSystem', initThemeSystem, []);
        initManager.addTask('scrollLockManagement', initScrollLockManagement, []);
        initManager.addTask('sidebar', initSidebar, ['themeSystem']);
        initManager.addTask('smoothScroll', initSmoothScroll, ['themeSystem']);
        initManager.addTask('headerScroll', initHeaderScroll, ['themeSystem']);
        initManager.addTask('fadeInAnimations', initFadeInAnimations, []);
        initManager.addTask('contactForm', initContactForm, []);
        initManager.addTask('socialEffects', initSocialEffects, []);
        initManager.addTask('keyboardNavigation', initKeyboardNavigation, ['themeSystem']);
        initManager.addTask('videoSection', initVideoSection, []);
        initManager.addTask('windowLoadHandler', initWindowLoadHandler, []);
        initManager.addTask('imagePreloading', preloadCriticalImages, []);
        initManager.addTask('headerFocusManagement', initHeaderFocusManagement, ['sidebar']);
        
        // Execute initialization
        await initManager.execute();
        
        // Mark as complete
        window.VTuberTheme.initialized = true;
        
        // Debug information
        debugLog('%c🎮 Welcome to IbaraDevilRoze\'s Landing Page! 🎮', 
                    'color: #8b5cf6; font-size: 16px; font-weight: bold;', 'basic');
        debugLog('%cTheme: Modern White/Black + Purple Accent with Dark Mode', 
                    'color: #6c757d; font-size: 12px;', 'basic');
        
        // Legacy compatibility check
        if (typeof vtuber_ajax !== 'undefined') {
            if (vtuber_ajax.video_data) {
                debugLog('Video data available:', vtuber_ajax.video_data, 'verbose');
            }
            if (vtuber_ajax.video_titles) {
                debugLog('Video titles available:', vtuber_ajax.video_titles, 'verbose');
            }
        }
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
        setTimeout(checkScrollState, THEME_CONFIG.ANIMATION.SCROLL_STATE_CHECK_DELAY);
        
        debugLog('✅ Header focus management initialized', null, 'basic');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTheme);
    } else {
        initializeTheme();
    }

})();

// Phase 4: Refactored ImageLoadingManager with encapsulation, naming, error handling, and performance improvements
class ThemeImageLoader {
    #loadedImages = new Set();
    #totalImages = 0;
    #observer = null;

    constructor() {
        this.#init();
    }

    #init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.#setup());
        } else {
            this.#setup();
        }
    }

    #setup() {
        const images = document.querySelectorAll('img[loading="lazy"], picture img');
        this.#totalImages = images.length;
        images.forEach((img, idx) => this.#observeImage(img, idx));
        this.#setupLazyObserver();
    }

    #observeImage(img, idx) {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease-in-out';
        const onLoad = () => {
            this.#loadedImages.add(idx);
            img.style.opacity = '1';
            img.classList.add('loaded');
            img.dispatchEvent(new CustomEvent('imageLoaded', {
                detail: {
                    index: idx,
                    total: this.#totalImages,
                    loaded: this.#loadedImages.size
                }
            }));
        };
        const onError = () => {
            console.warn('[ThemeImageLoader] Image failed to load:', img.src);
            img.style.opacity = THEME_CONFIG.VISUAL.IMAGE_ERROR_OPACITY;
            img.classList.add('load-error');
        };
        if (img.complete && img.naturalHeight !== 0) {
            onLoad();
        } else {
            img.addEventListener('load', onLoad, { once: true });
            img.addEventListener('error', onError, { once: true });
        }
    }

    #setupLazyObserver() {
        if (this.#observer) {
            this.#observer.disconnect();
        }
        this.#observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        delete img.dataset.src;
                    }
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
        document.querySelectorAll('img[data-src], img[data-avif-src]').forEach(img => {
            this.#observer.observe(img);
        });
    }

    getLoadedStatus() {
        return {
            loaded: this.#loadedImages.size,
            total: this.#totalImages,
            percentage: this.#totalImages > 0 ? (this.#loadedImages.size / this.#totalImages) * 100 : 100
        };
    }
}

// Phase 4: Use new ThemeImageLoader
let themeImageLoader;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        themeImageLoader = new ThemeImageLoader();
    });
} else {
    themeImageLoader = new ThemeImageLoader();
}
