/**
 * IbaraDevilRoze VTuber Theme - Main JavaScript
 * Version 2.1
 * 
 * Features:
 * - Theme toggle functionality
 * - Smooth scroll navigation
 * - Intersection Observer animations
 * - Optimized performance
 * - Enhanced accessibility
 */

'use strict';

(function() {
    // Global theme utilities
    window.VTuberTheme = {
        version: '2.1',
        initialized: false,
        
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
            
            updateLoadingLogo(theme);
            return true;
        }
    };

    /**
     * Update loading logo based on theme
     */
    function updateLoadingLogo(theme) {
        const logoBlack = document.querySelector('.loading-logo-image.logo-black');
        const logoWhite = document.querySelector('.loading-logo-image.logo-white');
        
        if (!logoBlack || !logoWhite) {
            console.log('Loading logo elements not found');
            return;
        }
        
        if (theme === 'dark') {
            logoBlack.style.display = 'none';
            logoWhite.style.display = 'block';
        } else {
            logoBlack.style.display = 'block';
            logoWhite.style.display = 'none';
        }
    }

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
        updateLoadingLogo(initialTheme);
        
        // Theme toggle click handler
        themeToggle.addEventListener('click', function() {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme, icon);
            updateLoadingLogo(newTheme);
            
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
                updateLoadingLogo(newTheme);
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
            submitBtn.textContent = 'Sending...';
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
                console.log('ESC key pressed');
            }
        });
    }

    /**
     * Preload critical images
     */
    function preloadCriticalImages() {
        const heroImg = document.querySelector('.hero-image img');
        if (heroImg && heroImg.src) {
            const img = new Image();
            img.src = heroImg.src;
            img.onload = () => console.log('Hero image preloaded');
        }
    }

    /**
     * Handle window load events
     */
    function initWindowLoadHandler() {
        window.addEventListener('load', function() {
            console.log('Window load event triggered - content ready');
            
            setTimeout(() => {
                const body = document.body;
                if (body.classList.contains('loaded')) {
                    console.log('Loading screen finished, ensuring content visibility');
                    
                    const mainElements = document.querySelectorAll('main, header, footer');
                    mainElements.forEach(element => {
                        if (element) {
                            element.style.visibility = 'visible';
                            element.style.opacity = '1';
                        }
                    });
                    
                    // Trigger load-dependent animations
                    setTimeout(() => {
                        const heroSection = document.querySelector('.hero');
                        if (heroSection) {
                            heroSection.classList.add('loaded');
                        }
                    }, 100);
                }
            }, 100);
        });
    }

    /**
     * Initialize logo error handling
     */
    function initLogoErrorHandling() {
        const logoImages = document.querySelectorAll('.loading-logo-image');
        
        logoImages.forEach(img => {
            img.addEventListener('error', function() {
                const logoContainer = img.closest('.loading-logo');
                if (logoContainer && !logoContainer.querySelector('.loading-logo-fallback')) {
                    const fallbackText = document.createElement('h1');
                    fallbackText.className = 'loading-logo-fallback';
                    fallbackText.textContent = 'IbaraDevilRoze';
                    fallbackText.style.cssText = `
                        font-size: 2.5rem;
                        font-weight: 800;
                        background: linear-gradient(135deg, var(--accent-purple), var(--accent-purple-light));
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        margin-bottom: 0.5rem;
                        letter-spacing: -1px;
                    `;
                    logoContainer.insertBefore(fallbackText, logoContainer.querySelector('p'));
                }
                
                logoImages.forEach(logoImg => {
                    logoImg.style.display = 'none';
                });
            });
        });
    }

    /**
     * Main initialization function
     */
    function initializeTheme() {
        if (window.VTuberTheme.initialized) {
            console.log('Theme already initialized');
            return;
        }
        
        console.log('Initializing VTuber Theme v2.1');
        
        // Initialize all features
        initThemeSystem();
        initSmoothScroll();
        initFadeInAnimations();
        initHeaderScroll();
        initContactForm();
        initSocialEffects();
        initKeyboardNavigation();
        initWindowLoadHandler();
        initLogoErrorHandling();
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
