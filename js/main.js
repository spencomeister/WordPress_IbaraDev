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

// Loading Screen Manager
class LoadingManager {
    constructor() {
        this.loadingScreen = null;
        this.isLoading = false;
        this.config = window.vtuber_ajax?.loading_config || {
            enabled: true,
            min_loading_time: 800,
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
        this.loadingScreen = document.getElementById('loading-screen');
        if (this.loadingScreen) {
            this.loadingScreen.classList.remove('hidden');
            this.isLoading = true;
            this.loadStartTime = Date.now();
            
            // Prevent scrolling during loading
            document.body.style.overflow = 'hidden';
            
            console.log('🔄 Loading screen shown');
        }
    }
    
    hide() {
        if (!this.loadingScreen || !this.isLoading || !this.config.enabled) return;
        
        const elapsedTime = Date.now() - this.loadStartTime;
        const remainingTime = Math.max(0, this.config.min_loading_time - elapsedTime);
        
        setTimeout(() => {
            this.loadingScreen.classList.add('hidden');
            this.isLoading = false;
            
            // Re-enable scrolling
            document.body.style.overflow = '';
            
            // Remove loading screen from DOM after animation
            setTimeout(() => {
                if (this.loadingScreen && this.loadingScreen.parentNode) {
                    this.loadingScreen.style.display = 'none';
                }
            }, 500);
            
            console.log('✅ Loading screen hidden');
        }, remainingTime);
    }
    
    setupPageTransitions() {
        if (!this.config.enable_transitions) return;
        
        // Show loading screen for internal link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && this.shouldShowLoadingForLink(link)) {
                // Small delay to show loading screen before navigation
                setTimeout(() => this.show(), 50);
            }
        });
        
        // Handle form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form && this.shouldShowLoadingForForm(form)) {
                this.show();
            }
        });
    }
    
    shouldShowLoadingForLink(link) {
        const href = link.getAttribute('href');
        if (!href) return false;
        
        // Skip external links
        if (href.startsWith('http') && !href.includes(window.location.hostname)) {
            return false;
        }
        
        // Skip anchor links
        if (href.startsWith('#')) return false;
        
        // Skip mailto, tel, etc.
        if (href.includes(':') && !href.startsWith('/') && !href.startsWith(window.location.origin)) {
            return false;
        }
        
        // Skip download links
        if (link.hasAttribute('download')) return false;
        
        // Skip target="_blank" links
        if (link.getAttribute('target') === '_blank') return false;
        
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

(function() {
    // Global theme utilities
    window.VTuberTheme = {
        version: '2.1',
        initialized: false,
        loadingManager: loadingManager,
        
        toggleTheme() {
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                themeToggle.click();
            }
        },
        
        getCurrentTheme() {
            return document.body.getAttribute('data-theme') || 'light';
        },
        
        setTheme(theme) {
            if (!['light', 'dark'].includes(theme)) return false;
            
            const body = document.body;
            const themeToggle = document.getElementById('theme-toggle');
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
            const sidebar = document.getElementById('left-sidebar');
            const overlay = document.getElementById('sidebar-overlay');
            const isOpen = sidebar.classList.contains('active');
            
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
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    /**
     * Open sidebar menu
     */
    function openSidebar() {
        const sidebar = document.getElementById('left-sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const menuToggle = document.getElementById('mobile-menu-toggle');
        const body = document.body;
        
        if (sidebar && overlay) {
            sidebar.classList.add('active');
            overlay.classList.add('active');
            body.style.overflow = 'hidden';
            
            // Add active class to hamburger menu
            if (menuToggle) {
                menuToggle.classList.add('active');
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
        const sidebar = document.getElementById('left-sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const menuToggle = document.getElementById('mobile-menu-toggle');
        const body = document.body;
        
        if (sidebar && overlay) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
            
            // Remove active class from hamburger menu
            if (menuToggle) {
                menuToggle.classList.remove('active');
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
    function initSidebar() {
        const menuToggle = document.getElementById('mobile-menu-toggle');
        const sidebarClose = document.getElementById('sidebar-close');
        const overlay = document.getElementById('sidebar-overlay');
        
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
        
        // Overlay click handler
        if (overlay) {
            overlay.addEventListener('click', function() {
                closeSidebar();
            });
        }
        
        // Escape key handler
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const sidebar = document.getElementById('left-sidebar');
                if (sidebar && sidebar.classList.contains('active')) {
                    closeSidebar();
                }
            }
        });
    }

    /**
     * Initialize theme system
     */
    function initThemeSystem() {
        const themeToggle = document.getElementById('theme-toggle');
        
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
        let initialTheme = 'light';
        if (savedTheme) {
            initialTheme = savedTheme;
        } else if (systemPrefersDark) {
            initialTheme = 'dark';
        }
        
        body.setAttribute('data-theme', initialTheme);
        updateThemeIcon(initialTheme, icon);
        
        // Theme toggle click handler
        themeToggle.addEventListener('click', function() {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme, icon);
            
            // Smooth transition
            body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
            setTimeout(() => {
                body.style.transition = '';
            }, 300);
        });
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
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
                
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const header = document.getElementById('main-header');
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    updateActiveNavLink(this);
                }
            });
        });
    }

    /**
     * Update active navigation link
     */
    function updateActiveNavLink(activeLink) {
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    /**
     * Initialize fade-in animations using Intersection Observer
     */
    function initFadeInAnimations() {
        const fadeElements = document.querySelectorAll('.fade-in, .achievement-card, .video-card, .news-card');
        
        if (!fadeElements.length) return;
        
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Add staggered delay for grid items
                    if (entry.target.classList.contains('achievement-card') || 
                        entry.target.classList.contains('video-card') ||
                        entry.target.classList.contains('news-card')) {
                        const siblings = Array.from(entry.target.parentNode.children);
                        const index = siblings.indexOf(entry.target);
                        entry.target.style.transitionDelay = `${index * 0.1}s`;
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
        const header = document.getElementById('main-header');
        if (!header) return;
        
        let lastScroll = 0;
        let ticking = false;
        
        function updateHeader() {
            const currentScroll = window.pageYOffset;
            
            // Add/remove scrolled class for styling
            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Hide/show header on scroll
            if (currentScroll > lastScroll && currentScroll > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
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
        const header = document.getElementById('main-header');
        const headerHeight = header ? header.offsetHeight : 0;
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
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
            submitBtn.style.opacity = '0.7';
            
            // Reset button after response (or timeout)
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }, 3000);
        });
        
        // Enhanced input focus effects
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentNode.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    this.parentNode.classList.remove('focused');
                }
            });
            
            // Check if input has value on load
            if (input.value.trim()) {
                input.parentNode.classList.add('focused');
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
                this.style.transform = 'translateY(-3px) scale(1.05)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
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
                        console.log(`Applied title "${data.title}" to video card ${index + 1}`);
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
                        console.log(`Applied description "${data.description}" to video card ${index + 1}`);
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
                        console.log(`Applied URL "${data.url}" to video card ${index + 1}`);
                    }
                }
            }
        });
        
        // Debug information
        console.log('Video data from customizer:', videoData);
        console.log('Found video cards:', videoCards.length);
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
            console.log('Video data available:', vtuber_ajax.video_data);
        } else {
            console.warn('Video data not available in vtuber_ajax');
        }
        
        // Legacy check for video titles
        if (typeof vtuber_ajax !== 'undefined' && vtuber_ajax.video_titles) {
            console.log('Video titles available:', vtuber_ajax.video_titles);
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
        
        window.VTuberTheme.initialized = true;
        
        console.log('%c🎮 Welcome to IbaraDevilRoze\'s Landing Page! 🎮', 
                    'color: #8b5cf6; font-size: 16px; font-weight: bold;');
        console.log('%cTheme: Modern White/Black + Purple Accent with Dark Mode', 
                    'color: #6c757d; font-size: 12px;');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTheme);
    } else {
        initializeTheme();
    }

})();
