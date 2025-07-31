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
    
    // Debug configuration (lazy evaluation)
    get DEBUG() {
        return {
            enabled: window.vtuber_ajax?.debug_settings?.enabled || false,
            level: window.vtuber_ajax?.debug_settings?.level || 'basic'
        };
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
     * Utility for DOM ready checking
     */
    onReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
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

// Debug logging function - moved early to avoid forward reference issues
function debugLog(message, data = null, level = 'basic') {
    // Validate that THEME_CONFIG and DEBUG exist
    if (typeof THEME_CONFIG === 'undefined' || !THEME_CONFIG.DEBUG) {
        return;
    }
    
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
    constructor(themeAppState) {
        this.themeAppState = themeAppState;
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
            this.themeAppState.registerComponent(task.name, result);
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

// Create global application state instance after class definitions
const themeAppState = new ApplicationState();

/**
 * Enhanced Global Theme API
 * Provides a clean, documented interface for theme functionality
 */
window.VTuberTheme = Object.freeze({
        // Basic information
        version: THEME_CONFIG.VERSION,
        
        // State accessors
        get initialized() {
            return themeAppState.isInitialized;
        },
        
        get config() {
            return THEME_CONFIG;
        },
        
        get state() {
            return {
                initialized: themeAppState.isInitialized,
                components: Array.from(themeAppState.components.keys()),
                loadingActive: themeAppState.loadingManager?.isLoading || false
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
                themeAppState.loadingManager?.show();
            },
            
            hide() {
                themeAppState.loadingManager?.hide();
            },
            
            get isActive() {
                return themeAppState.loadingManager?.isLoading || false;
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
            return themeAppState.getComponent(name);
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
                    appState: themeAppState.isReady(),
                    components: Array.from(themeAppState.components.keys()),
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
        
        // Log page and DOM timing for correlation with Turnstile behavior
        const pageTimingInfo = {
            performanceOrigin: performance.timeOrigin,
            domContentLoaded: performance.getEntriesByType('navigation')[0]?.domContentLoadedEventEnd || 'unknown',
            loadComplete: performance.getEntriesByType('navigation')[0]?.loadEventEnd || 'unknown',
            currentTime: Date.now(),
            domReady: document.readyState,
            resourcesLoaded: document.readyState === 'complete'
        };
        
        debugLog('📄 Page timing context for Turnstile correlation', pageTimingInfo, 'basic');
        
        // Check for contact status in URL and scroll to contact section
        checkContactStatus();
        
        // Initialize Turnstile validation state (only if widget exists)
        const hasTurnstileWidget = contactForm.querySelector('.cf-turnstile');
        if (hasTurnstileWidget) {
            debugLog('🔒 Turnstile widget detected - initializing validation', null, 'basic');
            initTurnstileValidation(contactForm);
        } else {
            debugLog('📝 No Turnstile widget found - form will work normally', null, 'basic');
        }
        
        contactForm.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (!submitBtn) return;
            
            // Check if Turnstile is enabled and verified
            const turnstileWidget = this.querySelector('.cf-turnstile');
            if (turnstileWidget) {
                if (turnstileWidget.dataset.verified !== 'true') {
                    e.preventDefault();
                    debugLog('🚫 Form submission blocked: Turnstile verification required', {
                        verified: turnstileWidget.dataset.verified,
                        hasToken: !!turnstileWidget.dataset.token
                    }, 'basic');
                    
                    // Show visual feedback
                    turnstileWidget.style.border = '2px solid #ef4444';
                    turnstileWidget.style.borderRadius = '8px';
                    setTimeout(() => {
                        turnstileWidget.style.border = '';
                        turnstileWidget.style.borderRadius = '';
                    }, 3000);
                    return;
                } else {
                    debugLog('✅ Form submission allowed: Turnstile verification confirmed', {
                        verified: turnstileWidget.dataset.verified,
                        hasToken: !!turnstileWidget.dataset.token
                    }, 'basic');
                }
            } else {
                debugLog('📝 Form submission allowed: No Turnstile widget present', null, 'basic');
            }
            
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = '送信中...';
            submitBtn.disabled = true;
            AnimationUtils.setOpacity(submitBtn, THEME_CONFIG.VISUAL.CONTACT_FORM_DISABLED_OPACITY);
            
            // Add visual feedback
            const form = this;
            form.style.opacity = '0.8';
            
            // Add timeout fallback to reset form state
            const resetTimeout = DOMUtils.delay(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                AnimationUtils.setOpacity(submitBtn, THEME_CONFIG.VISUAL.CONTACT_FORM_ENABLED_OPACITY);
                form.style.opacity = '';
                debugLog('📧 Contact form reset due to timeout', null, 'basic');
            }, 10000); // 10 second timeout
            
            // Clear timeout if page navigates (form submission successful)
            window.addEventListener('beforeunload', () => {
                clearTimeout(resetTimeout);
            }, { once: true });
            
            // Form will submit normally to current page (frontend processing)
            // PHP handler processes the form and redirects back with status
            debugLog('📧 Contact form submitted via frontend processing (Cloudflare Access compatible)', {
                action: form.action || 'current page',
                method: form.method,
                vtuber_contact_form: form.querySelector('input[name="vtuber_contact_form"]')?.value,
                frontend_contact_form: form.querySelector('input[name="frontend_contact_form"]')?.value,
                turnstile_verified: turnstileWidget ? turnstileWidget.dataset.verified : 'not_applicable'
            }, 'basic');
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
     * Classify Turnstile error for appropriate user feedback
     */
    function classifyTurnstileError(errorCode) {
        // Network-related errors
        if (errorCode === 'network-error' || errorCode === 'timeout' || errorCode === 'fetch-error') {
            return {
                type: 'network',
                title: 'ネットワークエラー',
                message: 'インターネット接続に問題があります。',
                recommendation: '• ネットワーク接続を確認してください<br>• ページを更新してお試しください'
            };
        }
        
        // Authentication/Authorization errors
        if (errorCode === 401 || errorCode === 'unauthorized' || errorCode === 'forbidden' ||
            (typeof errorCode === 'string' && errorCode.toLowerCase().includes('auth'))) {
            return {
                type: 'auth',
                title: '認証エラー',
                message: 'セキュリティ認証で問題が発生しました。',
                recommendation: '• ページを更新してお試しください<br>• ブラウザのキャッシュをクリアしてください<br>• 別のブラウザでお試しください'
            };
        }
        
        // Rate limiting
        if (errorCode === 'rate-limited' || errorCode === 'too-many-requests') {
            return {
                type: 'rate_limit',
                title: 'アクセス制限',
                message: '短時間に多くのリクエストが送信されました。',
                recommendation: '• しばらく待ってからお試しください<br>• ページを更新してお試しください'
            };
        }
        
        // Generic errors
        return {
            type: 'generic',
            title: 'セキュリティ確認エラー',
            message: '認証システムで予期しないエラーが発生しました。',
            recommendation: '• ページを更新してお試しください<br>• 問題が続く場合は別の方法でお問い合わせください'
        };
    }

    /**
     * Initialize Turnstile validation handling with strict security enforcement
     */
    function initTurnstileValidation(contactForm) {
        const turnstileWidget = contactForm.querySelector('.cf-turnstile');
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        
        // Comprehensive timing tracking
        const timingData = {
            initStart: Date.now(),
            domReady: document.readyState,
            pageLoadState: document.readyState === 'complete' ? 'complete' : 'loading'
        };
        
        debugLog('🕐 Turnstile initialization timing', {
            timestamp: new Date().toISOString(),
            timingData,
            domReadyState: document.readyState,
            windowLoaded: document.readyState === 'complete',
            documentTime: Date.now() - performance.timeOrigin
        }, 'basic');
        
        // Only initialize if Turnstile widget exists
        if (!turnstileWidget || !submitBtn) {
            debugLog('🔒 Turnstile widget not found - button remains enabled', {
                hasWidget: !!turnstileWidget,
                hasSubmitBtn: !!submitBtn,
                timing: timingData
            }, 'basic');
            return;
        }
        
        // Check if already initialized to prevent double initialization
        if (turnstileWidget.dataset.initialized === 'true') {
            debugLog('⚠️ Turnstile already initialized, skipping', {
                timing: timingData,
                existingTimestamp: turnstileWidget.dataset.initTimestamp
            }, 'basic');
            return;
        }
        
        // Mark as initialized with timestamp
        turnstileWidget.dataset.initialized = 'true';
        turnstileWidget.dataset.initTimestamp = Date.now();
        
        // Initially disable submit button if Turnstile is present
        submitBtn.disabled = true;
        AnimationUtils.setOpacity(submitBtn, THEME_CONFIG.VISUAL.CONTACT_FORM_DISABLED_OPACITY);
        debugLog('🔒 Submit button disabled - waiting for Turnstile verification', {
            timing: timingData,
            buttonDisabledAt: Date.now()
        }, 'basic');
        
        // Set up callbacks immediately (don't wait for API)
        setupTurnstileCallbacks(contactForm, turnstileWidget, submitBtn);
        
        // Enhanced API monitoring with detailed timing
        let apiCheckInterval;
        let apiCheckCount = 0;
        const maxApiChecks = 30; // Check for 15 seconds (500ms * 30)
        const apiMonitorStart = Date.now();
        
        debugLog('🔍 Starting Turnstile API monitoring', {
            monitorStartTime: apiMonitorStart,
            checkInterval: '500ms',
            maxChecks: maxApiChecks,
            expectedDuration: '15s'
        }, 'basic');
        
        apiCheckInterval = setInterval(() => {
            apiCheckCount++;
            const currentTime = Date.now();
            const elapsedMs = currentTime - apiMonitorStart;
            
            // Check if Turnstile API is available
            if (typeof window.turnstile !== 'undefined') {
                clearInterval(apiCheckInterval);
                const loadTime = elapsedMs / 1000;
                debugLog('🔒 Turnstile API loaded successfully', {
                    timeToLoad: `${loadTime}s`,
                    apiAvailable: true,
                    checksPerformed: apiCheckCount,
                    loadTimestamp: currentTime,
                    relativeToInit: `+${(currentTime - timingData.initStart) / 1000}s`,
                    apiObject: typeof window.turnstile
                }, 'basic');
                
                // Monitor widget rendering after API load
                monitorWidgetRendering(turnstileWidget, currentTime);
                return;
            }
            
            // Periodic progress logging
            if (apiCheckCount % 10 === 0) {
                debugLog('🔍 Turnstile API check progress', {
                    checksPerformed: apiCheckCount,
                    elapsedTime: `${(elapsedMs / 1000).toFixed(1)}s`,
                    stillWaiting: true
                }, 'basic');
            }
            
            // Stop checking after max attempts
            if (apiCheckCount >= maxApiChecks) {
                clearInterval(apiCheckInterval);
                debugLog('⚠️ Turnstile API not loaded after 15s', {
                    checksPerformed: apiCheckCount,
                    elapsedTime: `${(elapsedMs / 1000).toFixed(1)}s`,
                    apiAvailable: false,
                    reason: 'API loading timeout or blocked',
                    timing: timingData
                }, 'basic');
            }
        }, 500); // Check every 500ms
        
        // Set up secure waiting system (no automatic fallback)
        let challengeAttempts = 0;
        const maxChallengeWaitTime = 60000; // 60 seconds max wait
        let challengeStartTime = Date.now();
        
        // Stage 1: Information message at 8 seconds
        const infoTimeout = setTimeout(() => {
            if (turnstileWidget.dataset.verified !== 'true') {
                challengeAttempts++;
                debugLog('🔐 Turnstile info: Challenge in progress, waiting for completion', {
                    timeElapsed: '8s',
                    challengeAttempts,
                    status: 'waiting_for_challenge_completion'
                }, 'basic');
                turnstileWidget.style.border = '2px solid #3b82f6';
                turnstileWidget.style.borderRadius = '8px';
                turnstileWidget.innerHTML = `
                    <div style="padding: 12px; text-align: center; color: #3b82f6; font-size: 12px; line-height: 1.4;">
                        <div style="font-weight: bold; margin-bottom: 4px;">🔐 セキュリティ確認処理中...</div>
                        <div style="opacity: 0.8;">Cloudflareの認証プロセスが実行されています。完了までお待ちください。</div>
                    </div>
                `;
            }
        }, 8000);
        
        // Stage 2: Extended waiting message at 30 seconds
        const extendedWaitTimeout = setTimeout(() => {
            if (turnstileWidget.dataset.verified !== 'true') {
                challengeAttempts++;
                debugLog('🔐 Turnstile extended wait: Still processing challenge', {
                    timeElapsed: '30s',
                    challengeAttempts,
                    status: 'extended_challenge_processing',
                    possibleCause: 'Complex Private Access Token challenge'
                }, 'basic');
                turnstileWidget.style.border = '2px solid #f59e0b';
                turnstileWidget.style.borderRadius = '8px';
                turnstileWidget.innerHTML = `
                    <div style="padding: 12px; text-align: center; color: #f59e0b; font-size: 12px; line-height: 1.4;">
                        <div style="font-weight: bold; margin-bottom: 4px;">⏳ 認証処理が継続中です</div>
                        <div style="opacity: 0.8;">高度なセキュリティ確認のため、通常より時間がかかっています。</div>
                        <div style="margin-top: 4px; font-style: italic;">ページの更新はお控えください。</div>
                    </div>
                `;
            }
        }, 30000);
        
        // Final timeout: Security requirement enforcement
        const securityTimeout = setTimeout(() => {
            if (turnstileWidget.dataset.verified !== 'true') {
                challengeAttempts++;
                debugLog('🚨 Turnstile security timeout: Authentication required but not completed', {
                    timeElapsed: '60s',
                    challengeAttempts,
                    status: 'authentication_timeout',
                    securityEnforced: true,
                    recommendation: 'page_refresh_or_network_check'
                }, 'basic');
                
                turnstileWidget.style.border = '2px solid #ef4444';
                turnstileWidget.style.borderRadius = '8px';
                turnstileWidget.innerHTML = `
                    <div style="padding: 12px; text-align: center; color: #ef4444; font-size: 12px; line-height: 1.4;">
                        <div style="font-weight: bold; margin-bottom: 6px;">🚨 セキュリティ認証が必要です</div>
                        <div style="opacity: 0.9; margin-bottom: 6px;">認証が完了しませんでした。フォーム送信にはセキュリティ確認が必須です。</div>
                        <div style="background: rgba(239, 68, 68, 0.1); padding: 6px; border-radius: 4px; margin-top: 6px;">
                            <strong>対処方法:</strong><br>
                            • ページを更新してもう一度お試しください<br>
                            • ネットワーク接続を確認してください<br>
                            • 別のブラウザでお試しください
                        </div>
                    </div>
                `;
                
                // Keep button disabled - security requirement
                submitBtn.disabled = true;
                AnimationUtils.setOpacity(submitBtn, THEME_CONFIG.VISUAL.CONTACT_FORM_DISABLED_OPACITY);
            }
        }, maxChallengeWaitTime);
        
        // Store timeout IDs for cleanup
        turnstileWidget.dataset.infoTimeout = infoTimeout;
        turnstileWidget.dataset.extendedWaitTimeout = extendedWaitTimeout;
        turnstileWidget.dataset.securityTimeout = securityTimeout;
        
        debugLog('🔒 Secure Turnstile validation initialized - authentication required', {
            hasWidget: !!turnstileWidget,
            hasSubmitBtn: !!submitBtn,
            siteKey: turnstileWidget?.dataset?.sitekey || 'not found',
            infoAt: '8s',
            extendedWaitAt: '30s',
            maxWaitTime: '60s',
            securityEnforced: true,
            noFallback: true,
            initializationComplete: Date.now(),
            totalInitTime: `${(Date.now() - timingData.initStart) / 1000}s`
        }, 'basic');
    }
    
    /**
     * Monitor Turnstile widget rendering and interaction timing
     */
    function monitorWidgetRendering(turnstileWidget, apiLoadTime) {
        const renderingStart = Date.now();
        let renderCheckCount = 0;
        const maxRenderChecks = 20; // 10 seconds of checking
        
        debugLog('🎨 Starting Turnstile widget rendering monitor', {
            apiLoadedAt: apiLoadTime,
            renderingStarted: renderingStart,
            widgetElement: !!turnstileWidget,
            initialContent: turnstileWidget.innerHTML.substring(0, 100)
        }, 'basic');
        
        // Start monitoring console logs for Cloudflare challenge responses
        monitorCloudflareResponses(turnstileWidget, renderingStart);
        
        const renderCheckInterval = setInterval(() => {
            renderCheckCount++;
            const currentTime = Date.now();
            const renderElapsed = currentTime - renderingStart;
            const totalElapsed = currentTime - apiLoadTime;
            
            // Check for iframe (widget rendered)
            const iframe = turnstileWidget.querySelector('iframe');
            const hasVisibleContent = turnstileWidget.offsetHeight > 20; // Widget has some height
            const challengeState = turnstileWidget.dataset.verified || 'unknown';
            
            if (iframe) {
                clearInterval(renderCheckInterval);
                debugLog('🎨 Turnstile widget rendered successfully', {
                    renderTime: `${(renderElapsed / 1000).toFixed(1)}s`,
                    totalFromApiLoad: `${(totalElapsed / 1000).toFixed(1)}s`,
                    hasIframe: true,
                    iframeSize: `${iframe.offsetWidth}x${iframe.offsetHeight}`,
                    widgetHeight: turnstileWidget.offsetHeight,
                    challengeState
                }, 'basic');
                
                // Monitor for challenge completion
                monitorChallengeCompletion(turnstileWidget, currentTime);
                return;
            }
            
            // Periodic progress for rendering
            if (renderCheckCount % 5 === 0) {
                debugLog('🎨 Widget rendering progress', {
                    renderChecks: renderCheckCount,
                    renderElapsed: `${(renderElapsed / 1000).toFixed(1)}s`,
                    hasVisibleContent,
                    challengeState,
                    widgetContent: turnstileWidget.innerHTML.substring(0, 50) + '...'
                }, 'basic');
            }
            
            // Stop monitoring after timeout
            if (renderCheckCount >= maxRenderChecks) {
                clearInterval(renderCheckInterval);
                debugLog('⚠️ Turnstile widget rendering timeout', {
                    renderChecks: renderCheckCount,
                    renderElapsed: `${(renderElapsed / 1000).toFixed(1)}s`,
                    hasIframe: !!iframe,
                    hasVisibleContent,
                    finalContent: turnstileWidget.innerHTML
                }, 'basic');
            }
        }, 500);
    }
    
    /**
     * Monitor Cloudflare challenge responses for early problem detection
     */
    function monitorCloudflareResponses(turnstileWidget, monitorStart) {
        // Store original console methods
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        
        let challengeResponseDetected = false;
        let monitoringActive = true;
        
        debugLog('🔍 Starting Cloudflare response monitoring', {
            monitorStart,
            target: 'Private Access Token challenge patterns'
        }, 'basic');
        
        // Monitor console outputs for challenge patterns
        const logPattern = /(?:v1[?:]|challenges\.cloudflare\.com.*?v1[?:])[\w=&-]*.*[?:]?[\d\w-]*.*(?:Request for the Private Access Token challenge|lang=auto)/i;
        
        // Intercept console.log
        console.log = function(...args) {
            if (monitoringActive) {
                const logText = args.join(' ');
                
                if (logPattern.test(logText)) {
                    challengeResponseDetected = true;
                    const responseTime = Date.now();
                    const elapsed = responseTime - monitorStart;
                    
                    // Analyze response pattern
                    const analysisResult = analyzeCloudflareResponse(logText, elapsed);
                    
                    debugLog('🔍 Cloudflare challenge response detected', {
                        responseText: logText,
                        pattern: analysisResult.pattern,
                        prediction: analysisResult.prediction,
                        confidence: analysisResult.confidence,
                        timeFromStart: `${elapsed}ms`,
                        analysis: analysisResult
                    }, 'basic');
                    
                    // Apply predictive handling based on pattern
                    if (analysisResult.prediction === 'likely_failure') {
                        handlePredictedFailure(turnstileWidget, analysisResult);
                    } else if (analysisResult.prediction === 'likely_success') {
                        handlePredictedSuccess(turnstileWidget, analysisResult);
                    } else if (analysisResult.prediction === 'uncertain') {
                        handleUncertainPattern(turnstileWidget, analysisResult);
                    }
                }
            }
            
            // Call original console.log
            originalLog.apply(console, arguments);
        };
        
        // Stop monitoring after 30 seconds or when challenge completes
        setTimeout(() => {
            if (monitoringActive) {
                monitoringActive = false;
                console.log = originalLog;
                console.error = originalError;
                console.warn = originalWarn;
                
                debugLog('🔍 Cloudflare response monitoring ended', {
                    duration: '30s',
                    responseDetected: challengeResponseDetected,
                    reason: 'timeout'
                }, 'basic');
            }
        }, 30000);
        
        // Store cleanup function on widget for early termination
        turnstileWidget.dataset.cleanupMonitoring = function() {
            if (monitoringActive) {
                monitoringActive = false;
                console.log = originalLog;
                console.error = originalError;
                console.warn = originalWarn;
                
                debugLog('🔍 Cloudflare response monitoring ended', {
                    duration: `${Date.now() - monitorStart}ms`,
                    responseDetected: challengeResponseDetected,
                    reason: 'challenge_completed'
                }, 'basic');
            }
        };
    }
    
    /**
     * Analyze Cloudflare response pattern to predict success/failure
     */
    function analyzeCloudflareResponse(responseText, elapsed) {
        const analysis = {
            hasParameters: false,
            hasRayId: false,
            hasLangAuto: false,
            isShortForm: false,
            isFullUrl: false,
            hasOrchestrateApi: false,
            pattern: 'unknown',
            prediction: 'unknown',
            confidence: 0,
            responseText: responseText.substring(0, 300) // Increased limit for full URLs
        };
        
        // Check for URL format indicators
        if (responseText.includes('challenges.cloudflare.com')) {
            analysis.isFullUrl = true;
            if (responseText.includes('/orchestrate/chl_api/')) {
                analysis.hasOrchestrateApi = true;
            }
        } else if (responseText.includes('v1?') || responseText.includes('v1:')) {
            analysis.isShortForm = true;
        }
        
        // Check for success indicators
        if (responseText.includes('ray=') && responseText.includes('&')) {
            analysis.hasRayId = true;
            analysis.hasParameters = true;
        }
        
        if (responseText.includes('lang=auto')) {
            analysis.hasLangAuto = true;
        }
        
        // Enhanced pattern determination with new URL patterns
        if (analysis.isShortForm && analysis.hasRayId && analysis.hasLangAuto) {
            // v1?ray=...&lang=auto (short form with parameters)
            analysis.pattern = 'success_pattern_short';
            analysis.prediction = 'likely_success';
            analysis.confidence = 0.95; // High confidence for short form
        } else if (analysis.isFullUrl && analysis.hasOrchestrateApi && analysis.hasRayId && analysis.hasLangAuto) {
            // challenges.cloudflare.com/.../orchestrate/chl_api/v1?ray=...&lang=auto (complex orchestration)
            analysis.pattern = 'failure_pattern_orchestrate';
            analysis.prediction = 'likely_failure';
            analysis.confidence = 0.9; // High confidence for orchestrate API failures
        } else if (analysis.isFullUrl && analysis.hasRayId && analysis.hasLangAuto) {
            // challenges.cloudflare.com/.../v1?ray=...&lang=auto (full URL but not orchestrate)
            analysis.pattern = 'mixed_pattern_full_url';
            analysis.prediction = 'uncertain';
            analysis.confidence = 0.6; // Medium confidence - could go either way
        } else if (responseText.includes('v1:1') && !analysis.hasParameters) {
            // v1:1 (original failure pattern)
            analysis.pattern = 'failure_pattern_simple';
            analysis.prediction = 'likely_failure';
            analysis.confidence = 0.85;
        } else if (responseText.includes('Request for the Private Access Token challenge')) {
            if (analysis.hasParameters && analysis.isShortForm) {
                analysis.pattern = 'challenge_with_params_short';
                analysis.prediction = 'likely_success';
                analysis.confidence = 0.8;
            } else if (analysis.hasParameters && analysis.isFullUrl) {
                analysis.pattern = 'challenge_with_params_full';
                analysis.prediction = 'likely_failure';
                analysis.confidence = 0.75;
            } else {
                analysis.pattern = 'challenge_without_params';
                analysis.prediction = 'likely_failure';
                analysis.confidence = 0.8;
            }
        }
        
        // Time factor (early responses are typically better)
        if (elapsed < 2000) {
            analysis.confidence = Math.min(analysis.confidence + 0.05, 1.0);
        } else if (elapsed > 5000) {
            analysis.confidence = Math.max(analysis.confidence - 0.05, 0.1);
        }
        
        return analysis;
    }
    
    /**
     * Handle predicted failure case
     */
    function handlePredictedFailure(turnstileWidget, analysis) {
        debugLog('⚠️ Predicted Turnstile failure detected', {
            pattern: analysis.pattern,
            confidence: analysis.confidence,
            action: 'early_intervention',
            urlFormat: analysis.isFullUrl ? 'full_url' : 'short_form',
            orchestrateApi: analysis.hasOrchestrateApi || false
        }, 'basic');
        
        // Mark for early intervention but don't enable button (maintain security)
        turnstileWidget.dataset.predictedFailure = 'true';
        turnstileWidget.dataset.failureReason = analysis.pattern;
        turnstileWidget.dataset.failureConfidence = analysis.confidence;
        
        // Enhanced UI message based on failure type
        let warningMessage = '⚠️ 認証で問題が検出されました';
        let detailMessage = 'Cloudflareの認証プロセスで問題が発生している可能性があります。';
        
        if (analysis.hasOrchestrateApi) {
            warningMessage = '⚠️ 複雑な認証プロセスが検出されました';
            detailMessage = 'より高度なセキュリティ確認が必要になっています。完了までしばらくお待ちください。';
        }
        
        // Update UI to reflect early problem detection
        turnstileWidget.style.border = '2px solid #f59e0b';
        turnstileWidget.style.borderRadius = '8px';
        turnstileWidget.innerHTML = `
            <div style="padding: 12px; text-align: center; color: #f59e0b; font-size: 12px; line-height: 1.4;">
                <div style="font-weight: bold; margin-bottom: 4px;">${warningMessage}</div>
                <div style="opacity: 0.8;">${detailMessage}</div>
                <div style="margin-top: 4px; font-style: italic;">ページの更新をお試しください。</div>
            </div>
        `;
        
        // Adjust timeout based on failure type
        const timeoutDuration = analysis.hasOrchestrateApi ? 30000 : 20000; // 30s for orchestrate, 20s for others
        
        // Reduce timeout periods since failure is predicted
        const infoTimeout = turnstileWidget.dataset.infoTimeout;
        const extendedTimeout = turnstileWidget.dataset.extendedWaitTimeout;
        const securityTimeout = turnstileWidget.dataset.securityTimeout;
        
        // Clear existing long timeouts and set shorter ones
        if (infoTimeout) clearTimeout(parseInt(infoTimeout));
        if (extendedTimeout) clearTimeout(parseInt(extendedTimeout));
        if (securityTimeout) clearTimeout(parseInt(securityTimeout));
        
        // Adjusted timeout for predicted failures
        const shorterTimeout = setTimeout(() => {
            if (turnstileWidget.dataset.verified !== 'true') {
                debugLog('🚨 Predicted failure confirmed: Early timeout', {
                    originalPrediction: analysis.pattern,
                    confidence: analysis.confidence,
                    timeoutDuration: `${timeoutDuration}ms`,
                    failureType: analysis.hasOrchestrateApi ? 'orchestrate_timeout' : 'standard_timeout',
                    earlyTimeout: true
                }, 'basic');
                
                turnstileWidget.style.border = '2px solid #ef4444';
                
                let errorTitle = '🚨 認証エラーが確認されました';
                let errorDetail = '予測された認証問題が確認されました。';
                
                if (analysis.hasOrchestrateApi) {
                    errorTitle = '🚨 高度なセキュリティ認証でエラー';
                    errorDetail = 'Orchestrate APIによる複雑な認証プロセスが失敗しました。';
                }
                
                turnstileWidget.innerHTML = `
                    <div style="padding: 12px; text-align: center; color: #ef4444; font-size: 12px; line-height: 1.4;">
                        <div style="font-weight: bold; margin-bottom: 6px;">${errorTitle}</div>
                        <div style="opacity: 0.9; margin-bottom: 6px;">${errorDetail}</div>
                        <div style="background: rgba(239, 68, 68, 0.1); padding: 6px; border-radius: 4px; margin-top: 6px;">
                            <strong>推奨対応:</strong><br>
                            • ページを更新してお試しください<br>
                            • 別のブラウザでお試しください<br>
                            ${analysis.hasOrchestrateApi ? '• VPN接続を確認してください<br>' : ''}
                            • しばらく時間をおいてお試しください
                        </div>
                    </div>
                `;
            }
        }, timeoutDuration);
        
        turnstileWidget.dataset.shorterTimeout = shorterTimeout;
    }
    
    /**
     * Handle predicted success case
     */
    function handlePredictedSuccess(turnstileWidget, analysis) {
        debugLog('✅ Predicted Turnstile success detected', {
            pattern: analysis.pattern,
            confidence: analysis.confidence,
            action: 'optimistic_monitoring',
            urlFormat: analysis.isShortForm ? 'short_form' : 'full_url'
        }, 'basic');
        
        // Mark for success tracking
        turnstileWidget.dataset.predictedSuccess = 'true';
        turnstileWidget.dataset.successPattern = analysis.pattern;
        turnstileWidget.dataset.successConfidence = analysis.confidence;
        
        // Enhanced optimistic message based on pattern confidence
        let successMessage = '🔄 認証処理が順調に進行中';
        let detailMessage = 'Cloudflareの認証が正常に処理されています。まもなく完了予定です。';
        
        if (analysis.confidence >= 0.9) {
            successMessage = '🚀 高速認証プロセスを検出';
            detailMessage = '最適化された認証パスが検出されました。まもなく完了します。';
        }
        
        // Show optimistic message
        turnstileWidget.style.border = '2px solid #10b981';
        turnstileWidget.style.borderRadius = '8px';
        turnstileWidget.innerHTML = `
            <div style="padding: 12px; text-align: center; color: #10b981; font-size: 12px; line-height: 1.4;">
                <div style="font-weight: bold; margin-bottom: 4px;">${successMessage}</div>
                <div style="opacity: 0.8;">${detailMessage}</div>
                <div style="margin-top: 4px; font-size: 10px; opacity: 0.7;">信頼度: ${Math.round(analysis.confidence * 100)}%</div>
            </div>
        `;
    }
    
    /**
     * Handle uncertain pattern case
     */
    function handleUncertainPattern(turnstileWidget, analysis) {
        debugLog('🤔 Uncertain Turnstile pattern detected', {
            pattern: analysis.pattern,
            confidence: analysis.confidence,
            action: 'cautious_monitoring',
            urlFormat: analysis.isFullUrl ? 'full_url' : 'short_form'
        }, 'basic');
        
        // Mark for uncertain tracking
        turnstileWidget.dataset.predictedUncertain = 'true';
        turnstileWidget.dataset.uncertainPattern = analysis.pattern;
        turnstileWidget.dataset.uncertainConfidence = analysis.confidence;
        
        // Show neutral monitoring message
        turnstileWidget.style.border = '2px solid #6b7280';
        turnstileWidget.style.borderRadius = '8px';
        turnstileWidget.innerHTML = `
            <div style="padding: 12px; text-align: center; color: #6b7280; font-size: 12px; line-height: 1.4;">
                <div style="font-weight: bold; margin-bottom: 4px;">🔍 認証パターンを分析中</div>
                <div style="opacity: 0.8;">複雑な認証プロセスが検出されました。結果は変動する可能性があります。</div>
                <div style="margin-top: 4px; font-size: 10px; opacity: 0.7;">不確実性: ${Math.round((1 - analysis.confidence) * 100)}%</div>
            </div>
        `;
        
        // Use standard timeouts for uncertain patterns (no early intervention)
        debugLog('🕐 Using standard timeouts for uncertain pattern', {
            pattern: analysis.pattern,
            confidence: analysis.confidence,
            intervention: 'none'
        }, 'basic');
    }
    
    /**
     * Clear all Turnstile-related timeouts
     */
    function clearAllTurnstileTimeouts(turnstileWidget) {
        const timeoutIds = [
            'infoTimeout',
            'extendedWaitTimeout', 
            'securityTimeout',
            'shorterTimeout'
        ];
        
        timeoutIds.forEach(timeoutId => {
            const timeoutValue = turnstileWidget.dataset[timeoutId];
            if (timeoutValue) {
                clearTimeout(parseInt(timeoutValue));
                delete turnstileWidget.dataset[timeoutId];
            }
        });
        
        debugLog('🧹 All Turnstile timeouts cleared', {
            clearedTimeouts: timeoutIds.length
        }, 'basic');
    }
    
    /**
     * Monitor challenge completion timing
     */
    function monitorChallengeCompletion(turnstileWidget, renderTime) {
        const challengeStart = Date.now();
        let challengeCheckCount = 0;
        const maxChallengeChecks = 120; // 60 seconds of monitoring
        
        debugLog('🔐 Starting challenge completion monitor', {
            challengeStarted: challengeStart,
            widgetRenderedAt: renderTime,
            initialState: turnstileWidget.dataset.verified || 'unknown'
        }, 'basic');
        
        const challengeCheckInterval = setInterval(() => {
            challengeCheckCount++;
            const currentTime = Date.now();
            const challengeElapsed = currentTime - challengeStart;
            const totalElapsed = currentTime - renderTime;
            
            const challengeState = turnstileWidget.dataset.verified;
            const hasToken = !!turnstileWidget.dataset.token;
            
            // Check if challenge completed
            if (challengeState === 'true' && hasToken) {
                clearInterval(challengeCheckInterval);
                debugLog('✅ Challenge completed successfully', {
                    challengeTime: `${(challengeElapsed / 1000).toFixed(1)}s`,
                    totalFromRender: `${(totalElapsed / 1000).toFixed(1)}s`,
                    challengeState,
                    hasToken,
                    tokenLength: turnstileWidget.dataset.token?.length || 0
                }, 'basic');
                return;
            }
            
            // Detect errors or failures
            if (challengeState === 'false') {
                clearInterval(challengeCheckInterval);
                debugLog('❌ Challenge failed or errored', {
                    challengeTime: `${(challengeElapsed / 1000).toFixed(1)}s`,
                    totalFromRender: `${(totalElapsed / 1000).toFixed(1)}s`,
                    challengeState,
                    hasToken
                }, 'basic');
                return;
            }
            
            // Periodic progress for challenge
            if (challengeCheckCount % 20 === 0) {
                debugLog('🔐 Challenge progress', {
                    challengeChecks: challengeCheckCount,
                    challengeElapsed: `${(challengeElapsed / 1000).toFixed(1)}s`,
                    challengeState: challengeState || 'waiting',
                    hasToken
                }, 'basic');
            }
            
            // Challenge timeout
            if (challengeCheckCount >= maxChallengeChecks) {
                clearInterval(challengeCheckInterval);
                debugLog('⏰ Challenge monitoring timeout', {
                    challengeChecks: challengeCheckCount,
                    challengeElapsed: `${(challengeElapsed / 1000).toFixed(1)}s`,
                    finalState: challengeState || 'unknown',
                    hasToken
                }, 'basic');
            }
        }, 500);
    }
    
    /**
     * Set up Turnstile callbacks
     */
    function setupTurnstileCallbacks(contactForm, turnstileWidget, submitBtn) {
        debugLog('🔧 Setting up Turnstile callbacks', null, 'basic');
        
        // CRITICAL: Prevent infinite loops with safer check
        if (window.turnstileSafelyConfigured === true) {
            debugLog('⚠️ Turnstile already safely configured globally, skipping', null, 'basic');
            return;
        }
        
        // Mark as safely configured IMMEDIATELY
        window.turnstileSafelyConfigured = true;
        
        // Clear any existing problematic callbacks first
        delete window.turnstileOnSuccess;
        delete window.turnstileOnError;
        delete window.turnstileOnExpired;
        
        // Set up minimal, safe global callbacks with recursion protection
        window.turnstileOnSuccess = function(token) {
            // Prevent recursive calls
            if (window.turnstileProcessing === true) {
                debugLog('⚠️ Turnstile already processing, skipping', null, 'basic');
                return;
            }
            
            window.turnstileProcessing = true;
            
            try {
                const successTime = Date.now();
                const initTime = turnstileWidget.dataset.initTimestamp ? parseInt(turnstileWidget.dataset.initTimestamp) : null;
                
                // Clean up monitoring if active
                if (turnstileWidget.dataset.cleanupMonitoring) {
                    try {
                        const cleanup = new Function('return ' + turnstileWidget.dataset.cleanupMonitoring)();
                        if (typeof cleanup === 'function') cleanup();
                    } catch (e) {
                        debugLog('⚠️ Cleanup function execution failed', e.message, 'basic');
                    }
                }
                
                // Clear all timeouts (including predicted failure timeouts)
                clearAllTurnstileTimeouts(turnstileWidget);
                
                // Success correlation with prediction analysis
                const wasPredicted = turnstileWidget.dataset.predictedSuccess === 'true';
                const predictionPattern = turnstileWidget.dataset.successPattern || 'none';
                const predictionConfidence = parseFloat(turnstileWidget.dataset.successConfidence) || 0;
                const failurePredicted = turnstileWidget.dataset.predictedFailure === 'true';
                const uncertainPredicted = turnstileWidget.dataset.predictedUncertain === 'true';
                const uncertainPattern = turnstileWidget.dataset.uncertainPattern || 'none';
                
                const timingInfo = {
                    successTimestamp: successTime,
                    successTime: new Date(successTime).toISOString(),
                    totalTimeFromInit: initTime ? `${(successTime - initTime) / 1000}s` : 'unknown',
                    tokenReceived: !!token,
                    tokenType: typeof token,
                    tokenLength: token?.length || 0,
                    predictionAccuracy: {
                        successPredicted: wasPredicted,
                        failurePredicted: failurePredicted,
                        uncertainPredicted: uncertainPredicted,
                        pattern: predictionPattern,
                        uncertainPattern: uncertainPattern,
                        confidence: predictionConfidence,
                        correlationResult: wasPredicted ? 'prediction_confirmed' : 
                                         failurePredicted ? 'prediction_incorrect' : 
                                         uncertainPredicted ? 'uncertain_resolved_success' : 'no_prediction'
                    }
                };
                
                debugLog('✅ SAFE Turnstile SUCCESS with correlation analysis', {
                    hasToken: !!token,
                    timing: timingInfo
                }, 'basic');
                
                if (token && typeof token === 'string' && turnstileWidget && submitBtn) {
                    turnstileWidget.dataset.verified = 'true';
                    turnstileWidget.dataset.token = token;
                    
                    // Show enhanced success state with prediction accuracy
                    turnstileWidget.style.border = '2px solid #10b981';
                    turnstileWidget.style.borderRadius = '8px';
                    
                    // Add success message with prediction feedback
                    const successDiv = document.createElement('div');
                    successDiv.style.cssText = 'padding: 8px; text-align: center; color: #10b981; font-size: 12px; font-weight: bold; background: rgba(16, 185, 129, 0.1); border-radius: 4px; margin-top: 4px;';
                    
                    let successMessage = '✅ セキュリティ認証が完了しました';
                    if (wasPredicted) {
                        successMessage += '<div style="font-size: 10px; opacity: 0.7; margin-top: 2px;">(予測システムで事前検出済み)</div>';
                    } else if (failurePredicted) {
                        successMessage += '<div style="font-size: 10px; opacity: 0.7; margin-top: 2px;">(予測システムの予想に反して成功)</div>';
                    } else if (uncertainPredicted) {
                        successMessage += '<div style="font-size: 10px; opacity: 0.7; margin-top: 2px;">(不確実パターンから成功に転換)</div>';
                    }
                    
                    successDiv.innerHTML = successMessage;
                    
                    // Find existing success message and replace or add
                    const existingSuccess = turnstileWidget.querySelector('[data-success-message]');
                    if (existingSuccess) {
                        existingSuccess.replaceWith(successDiv);
                    } else {
                        successDiv.dataset.successMessage = 'true';
                        turnstileWidget.appendChild(successDiv);
                    }
                    
                    // Handle hidden input
                    let tokenInput = contactForm.querySelector('input[name="cf-turnstile-response"]');
                    if (!tokenInput) {
                        tokenInput = document.createElement('input');
                        tokenInput.type = 'hidden';
                        tokenInput.name = 'cf-turnstile-response';
                        contactForm.appendChild(tokenInput);
                    }
                    tokenInput.value = token;
                    
                    // Enable submit button
                    submitBtn.disabled = false;
                    AnimationUtils.setOpacity(submitBtn, THEME_CONFIG.VISUAL.CONTACT_FORM_ENABLED_OPACITY);
                    debugLog('✅ Submit button ENABLED safely after verification', null, 'basic');
                }
            } catch (error) {
                console.error('Error in turnstileOnSuccess:', error);
            } finally {
                setTimeout(() => {
                    window.turnstileProcessing = false;
                }, 100);
            }
        };
        
        window.turnstileOnError = function(errorCode) {
            if (window.turnstileProcessing === true) return;
            window.turnstileProcessing = true;
            
            try {
                const errorTime = Date.now();
                const initTime = turnstileWidget.dataset.initTimestamp ? parseInt(turnstileWidget.dataset.initTimestamp) : null;
                
                // Clean up monitoring if active
                if (turnstileWidget.dataset.cleanupMonitoring) {
                    try {
                        const cleanup = new Function('return ' + turnstileWidget.dataset.cleanupMonitoring)();
                        if (typeof cleanup === 'function') cleanup();
                    } catch (e) {
                        debugLog('⚠️ Cleanup function execution failed in error handler', e.message, 'basic');
                    }
                }
                
                // Clear all timeouts
                clearAllTurnstileTimeouts(turnstileWidget);
                
                // Error correlation with prediction analysis
                const failurePredicted = turnstileWidget.dataset.predictedFailure === 'true';
                const predictedReason = turnstileWidget.dataset.failureReason || 'none';
                const predictionConfidence = parseFloat(turnstileWidget.dataset.failureConfidence) || 0;
                const successPredicted = turnstileWidget.dataset.predictedSuccess === 'true';
                const uncertainPredicted = turnstileWidget.dataset.predictedUncertain === 'true';
                const uncertainPattern = turnstileWidget.dataset.uncertainPattern || 'none';
                
                const timingInfo = {
                    errorTimestamp: errorTime,
                    errorTime: new Date(errorTime).toISOString(),
                    totalTimeFromInit: initTime ? `${(errorTime - initTime) / 1000}s` : 'unknown',
                    errorCode,
                    errorType: typeof errorCode,
                    predictionAccuracy: {
                        failurePredicted: failurePredicted,
                        successPredicted: successPredicted,
                        uncertainPredicted: uncertainPredicted,
                        predictedReason: predictedReason,
                        uncertainPattern: uncertainPattern,
                        confidence: predictionConfidence,
                        correlationResult: failurePredicted ? 'prediction_confirmed' : 
                                         successPredicted ? 'prediction_incorrect' : 
                                         uncertainPredicted ? 'uncertain_resolved_failure' : 'no_prediction'
                    }
                };
                
                debugLog('❌ Turnstile ERROR with correlation analysis', { 
                    errorCode,
                    timing: timingInfo,
                    securityMaintained: true,
                    formAccessible: false
                }, 'basic');
                
                if (turnstileWidget && submitBtn) {
                    turnstileWidget.dataset.verified = 'false';
                    delete turnstileWidget.dataset.token;
                    
                    const tokenInput = contactForm.querySelector('input[name="cf-turnstile-response"]');
                    if (tokenInput) {
                        tokenInput.value = '';
                    }
                    
                    // Classify error type for user feedback
                    const errorInfo = classifyTurnstileError(errorCode);
                    
                    debugLog('🔐 Turnstile error classified with prediction correlation', { 
                        errorCode,
                        classification: errorInfo.type,
                        userMessage: errorInfo.message,
                        recommendation: errorInfo.recommendation,
                        predictionAccuracy: timingInfo.predictionAccuracy
                    }, 'basic');
                    
                    // Always keep button disabled for security
                    submitBtn.disabled = true;
                    AnimationUtils.setOpacity(submitBtn, THEME_CONFIG.VISUAL.CONTACT_FORM_DISABLED_OPACITY);
                    
                    // Show enhanced error message with prediction feedback
                    turnstileWidget.style.border = '2px solid #ef4444';
                    turnstileWidget.style.borderRadius = '8px';
                    
                    let errorMessage = `
                        <div style="padding: 12px; text-align: center; color: #ef4444; font-size: 12px; line-height: 1.4;">
                            <div style="font-weight: bold; margin-bottom: 6px;">🚨 ${errorInfo.title}</div>
                            <div style="opacity: 0.9; margin-bottom: 6px;">${errorInfo.message}</div>
                            <div style="background: rgba(239, 68, 68, 0.1); padding: 6px; border-radius: 4px; margin-top: 6px; font-size: 11px;">
                                ${errorInfo.recommendation}
                            </div>`;
                    
                    // Add prediction feedback if available
                    if (failurePredicted) {
                        errorMessage += `<div style="font-size: 10px; opacity: 0.7; margin-top: 4px; font-style: italic;">(予測システムで事前検出済み)</div>`;
                    } else if (successPredicted) {
                        errorMessage += `<div style="font-size: 10px; opacity: 0.7; margin-top: 4px; font-style: italic;">(予測システムの予想に反してエラー)</div>`;
                    } else if (uncertainPredicted) {
                        errorMessage += `<div style="font-size: 10px; opacity: 0.7; margin-top: 4px; font-style: italic;">(不確実パターンからエラーに転換)</div>`;
                    }
                    
                    errorMessage += `</div>`;
                    
                    turnstileWidget.innerHTML = errorMessage;
                    turnstileWidget.innerHTML = `
                        <div style="padding: 12px; text-align: center; color: #ef4444; font-size: 12px; line-height: 1.4;">
                            <div style="font-weight: bold; margin-bottom: 6px;">🚨 ${errorInfo.title}</div>
                            <div style="opacity: 0.9; margin-bottom: 6px;">${errorInfo.message}</div>
                            <div style="background: rgba(239, 68, 68, 0.1); padding: 6px; border-radius: 4px; margin-top: 6px;">
                                <strong>推奨対応:</strong><br>
                                ${errorInfo.recommendation}
                            </div>
                        </div>
                    `;
                    
                    debugLog('❌ Submit button DISABLED due to security requirement', { 
                        errorCode,
                        securityEnforced: true 
                    }, 'basic');
                }
            } catch (error) {
                console.error('Error in secure turnstileOnError:', error);
                debugLog('❌ Critical error in Turnstile error handler', { error: error.message }, 'basic');
            } finally {
                setTimeout(() => {
                    window.turnstileProcessing = false;
                }, 200);
            }
        };
        
        window.turnstileOnExpired = function() {
            if (window.turnstileProcessing === true) return;
            window.turnstileProcessing = true;
            
            try {
                const expiredTime = Date.now();
                const initTime = turnstileWidget.dataset.initTimestamp ? parseInt(turnstileWidget.dataset.initTimestamp) : null;
                const timingInfo = {
                    expiredTimestamp: expiredTime,
                    expiredTime: new Date(expiredTime).toISOString(),
                    totalTimeFromInit: initTime ? `${(expiredTime - initTime) / 1000}s` : 'unknown'
                };
                
                debugLog('⏰ Turnstile EXPIRED with detailed timing', {
                    timing: timingInfo,
                    securityMaintained: true
                }, 'basic');
                
                if (turnstileWidget && submitBtn) {
                    turnstileWidget.dataset.verified = 'false';
                    delete turnstileWidget.dataset.token;
                    
                    const tokenInput = contactForm.querySelector('input[name="cf-turnstile-response"]');
                    if (tokenInput) {
                        tokenInput.value = '';
                    }
                    
                    // Keep security enforcement
                    submitBtn.disabled = true;
                    AnimationUtils.setOpacity(submitBtn, THEME_CONFIG.VISUAL.CONTACT_FORM_DISABLED_OPACITY);
                    
                    // Show expiration message
                    turnstileWidget.style.border = '2px solid #f59e0b';
                    turnstileWidget.style.borderRadius = '8px';
                    turnstileWidget.innerHTML = `
                        <div style="padding: 12px; text-align: center; color: #f59e0b; font-size: 12px; line-height: 1.4;">
                            <div style="font-weight: bold; margin-bottom: 6px;">⏰ セキュリティ認証の有効期限切れ</div>
                            <div style="opacity: 0.9;">認証の有効期限が切れました。再度確認が必要です。</div>
                            <div style="margin-top: 6px;">ページを更新してもう一度お試しください。</div>
                        </div>
                    `;
                    
                    debugLog('⏰ Submit button DISABLED due to expiration', null, 'basic');
                }
            } catch (error) {
                console.error('Error in turnstileOnExpired:', error);
            } finally {
                setTimeout(() => {
                    window.turnstileProcessing = false;
                }, 100);
            }
        };
        
        debugLog('🔒 Secure Turnstile callbacks configured', null, 'basic');
    }

    /**
     * Check contact status from URL parameters and scroll to contact section
     */
    function checkContactStatus() {
        const urlParams = new URLSearchParams(window.location.search);
        const contactStatus = urlParams.get('contact');
        
        // Check if contact parameter exists with any value (including empty)
        if (contactStatus !== null) {
            // Delay to ensure page is fully loaded
            DOMUtils.delay(() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    debugLog('📧 Contact form status detected, scrolling to contact section...', null, 'basic');
                    
                    // Get header height for proper offset calculation
                    const header = DOMUtils.getElementById(THEME_CONFIG.SELECTORS.MAIN_HEADER);
                    const headerHeight = header ? header.offsetHeight : 0;
                    
                    // Calculate position with proper offset
                    const targetPosition = contactSection.offsetTop - headerHeight - THEME_CONFIG.SCROLL.SMOOTH_SCROLL_OFFSET;
                    
                    // Smooth scroll to contact section with proper offset
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Focus on the first input field for better UX
                    DOMUtils.delay(() => {
                        const firstInput = contactSection.querySelector('input[type="text"], input[type="email"], textarea');
                        if (firstInput) {
                            firstInput.focus();
                            // Add visual indication that the form is ready
                            firstInput.style.boxShadow = '0 0 8px rgba(139, 92, 246, 0.3)';
                            setTimeout(() => {
                                firstInput.style.boxShadow = '';
                            }, 2000);
                        }
                    }, 1000); // Wait for scroll animation to complete
                }
            }, 500); // Initial delay for page load
        }
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
        if (themeAppState.isInitialized) {
            console.warn('Theme already initialized');
            return;
        }
        
        // Initialize application state
        themeAppState.initialize();
        
        // Create initialization manager
        const initManager = new InitializationManager(themeAppState);
        
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
        
        // Note: Initialization status is managed through getter that references themeAppState.isInitialized
        
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
    DOMUtils.onReady(initializeTheme);

// Phase 4: Refactored ImageLoadingManager with encapsulation, naming, error handling, and performance improvements
class ThemeImageLoader {
    #loadedImages = new Set();
    #totalImages = 0;
    #observer = null;

    constructor() {
        this.#init();
    }

    #init() {
        DOMUtils.onReady(() => this.#setup());
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
DOMUtils.onReady(() => {
    themeImageLoader = new ThemeImageLoader();
});
