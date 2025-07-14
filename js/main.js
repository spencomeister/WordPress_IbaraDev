// Modern VTuber Landing Page JavaScript
// IbaraDevilRoze Theme v2.0

// Loading Screen Functionality
function initLoadingScreen() {
    console.log('initLoadingScreen called');
    
    const loadingScreen = document.getElementById('loading-screen');
    const progressFill = document.getElementById('progress-fill');
    const loadingPercentage = document.getElementById('loading-percentage');
    const loadingText = document.getElementById('loading-text');
    const body = document.body;
    
    // Mark that loading has started
    body.classList.add('loading-started');
    
    // Check if loading screen elements exist
    if (!loadingScreen || !progressFill || !loadingPercentage || !loadingText) {
        console.warn('Loading screen elements not found, skipping loading animation');
        console.log('Elements found:', {
            loadingScreen: !!loadingScreen,
            progressFill: !!progressFill,
            loadingPercentage: !!loadingPercentage,
            loadingText: !!loadingText
        });
        // Remove loading class and continue
        body.classList.remove('loading');
        body.classList.add('loaded');
        return;
    }
    
    console.log('Loading screen initialized, starting animation');
    
    let progress = 0;
    const loadingSteps = [
        { percent: 8, text: 'Connecting...' },
        { percent: 15, text: 'Loading fonts...' },
        { percent: 28, text: 'Loading stylesheets...' },
        { percent: 42, text: 'Loading images...' },
        { percent: 58, text: 'Loading assets...' },
        { percent: 72, text: 'Initializing components...' },
        { percent: 85, text: 'Setting up animations...' },
        { percent: 94, text: 'Finalizing...' },
        { percent: 100, text: 'Welcome to my world!' }
    ];
    
    let currentStepIndex = 0;
    
    function updateProgress(targetPercent, text) {
        const duration = 300; // ms
        const steps = 20;
        const increment = (targetPercent - progress) / steps;
        
        if (text) {
            loadingText.style.opacity = '0';
            setTimeout(() => {
                loadingText.textContent = text;
                loadingText.style.opacity = '1';
            }, 150);
        }
        
        const progressInterval = setInterval(() => {
            progress += increment;
            
            if (progress >= targetPercent) {
                progress = targetPercent;
                clearInterval(progressInterval);
                
                if (progress === 100) {
                    setTimeout(completeLoading, 500);
                }
            }
            
            progressFill.style.width = progress + '%';
            loadingPercentage.textContent = Math.round(progress) + '%';
        }, duration / steps);
    }
    
    function nextStep() {
        console.log(`Loading step ${currentStepIndex + 1} of ${loadingSteps.length}: ${loadingSteps[currentStepIndex]?.text || 'Unknown'}`);
        
        if (currentStepIndex < loadingSteps.length) {
            const step = loadingSteps[currentStepIndex];
            updateProgress(step.percent, step.text);
            currentStepIndex++;
            
            if (currentStepIndex < loadingSteps.length) {
                setTimeout(nextStep, 400 + Math.random() * 600);
            }
        }
    }
    
    function completeLoading() {
        console.log('Loading completed, hiding screen');
        
        // Add loaded class to body
        body.classList.add('loaded');
        body.classList.remove('loading');
        
        // Fade out loading screen
        loadingScreen.classList.add('hidden');
        
        // Remove loading screen after animation
        setTimeout(() => {
            if (loadingScreen.parentNode) {
                loadingScreen.parentNode.removeChild(loadingScreen);
            }
        }, 500);
        
        // Trigger any post-load animations
        setTimeout(() => {
            triggerPostLoadAnimations();
        }, 200);
    }
    
    function triggerPostLoadAnimations() {
        // Add entrance animations to main elements
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.style.opacity = '0';
            heroSection.style.transform = 'translateY(30px)';
            setTimeout(() => {
                heroSection.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                heroSection.style.opacity = '1';
                heroSection.style.transform = 'translateY(0)';
            }, 100);
        }
    }
    
    // Initialize loading screen with correct theme
    function initLoadingTheme() {
        const body = document.body;
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        let currentTheme = 'light';
        if (savedTheme) {
            currentTheme = savedTheme;
        } else if (systemPrefersDark) {
            currentTheme = 'dark';
        }
        
        body.setAttribute('data-theme', currentTheme);
        updateLoadingLogo(currentTheme);
    }
    
    // Initialize loading screen with correct theme
    initLoadingTheme();
    
    // Start loading sequence
    console.log('Starting loading sequence in 500ms...');
    setTimeout(() => {
        console.log('Beginning first loading step');
        nextStep();
    }, 500);
    
    // Ensure loading completes within reasonable time
    const timeoutId = setTimeout(() => {
        if (!body.classList.contains('loaded')) {
            console.log('Loading timeout reached, forcing completion');
            updateProgress(100, 'Ready!');
        }
    }, 5000); // Increased timeout to 5 seconds for safety
    
    // Clear timeout if loading completes normally
    const originalCompleteLoading = completeLoading;
    completeLoading = function() {
        clearTimeout(timeoutId);
        originalCompleteLoading();
    };
}

// Initialize loading screen immediately
function startLoading() {
    console.log('Starting loading process...');
    console.log('Document ready state:', document.readyState);
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOM loaded, initializing loading screen');
            setTimeout(initLoadingScreen, 100);
        });
    } else {
        // DOM is already ready
        console.log('DOM already ready, initializing loading screen');
        setTimeout(initLoadingScreen, 50);
    }
    
    // Failsafe: Force initialization if nothing happens within 1 second
    setTimeout(() => {
        if (!document.body.classList.contains('loaded') && !document.body.classList.contains('loading-started')) {
            console.warn('Loading screen not started, forcing initialization');
            initLoadingScreen();
        }
    }, 1000);
}

// Start loading process
startLoading();

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all features
    initThemeToggle();
    initSmoothScroll();
    initFadeInAnimations();
    initHeaderScroll();
    initContactForm();
    
    // Dark Mode Toggle Functionality
    function initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        
        // Check if theme toggle button exists
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
        if (savedTheme) {
            body.setAttribute('data-theme', savedTheme);
            updateThemeIcon(savedTheme, icon);
            updateLoadingLogo(savedTheme);
        } else if (systemPrefersDark) {
            body.setAttribute('data-theme', 'dark');
            updateThemeIcon('dark', icon);
            updateLoadingLogo('dark');
        } else {
            body.setAttribute('data-theme', 'light');
            updateThemeIcon('light', icon);
            updateLoadingLogo('light');
        }
        
        // Theme toggle click handler
        themeToggle.addEventListener('click', function() {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme, icon);
            updateLoadingLogo(newTheme);
            
            // Add animation class for smooth transition
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
    
    // Update loading logo based on theme
    function updateLoadingLogo(theme) {
        const logoBlack = document.querySelector('.loading-logo-image.logo-black');
        const logoWhite = document.querySelector('.loading-logo-image.logo-white');
        
        // Check if logo elements exist
        if (!logoBlack || !logoWhite) {
            return; // Skip if logos not found
        }
        
        if (theme === 'dark') {
            logoBlack.style.display = 'none';
            logoWhite.style.display = 'block';
        } else {
            logoBlack.style.display = 'block';
            logoWhite.style.display = 'none';
        }
    }
    
    // Update theme toggle icon
    function updateThemeIcon(theme, icon) {
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
    
    // Smooth Scroll Navigation
    function initSmoothScroll() {
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.getElementById('main-header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update active nav link
                    updateActiveNavLink(this);
                }
            });
        });
    }
    
    // Update active navigation link
    function updateActiveNavLink(activeLink) {
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }
    
    // Fade-in animations on scroll
    function initFadeInAnimations() {
        const fadeElements = document.querySelectorAll('.fade-in, .achievement-card, .video-card');
        
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
                        entry.target.classList.contains('video-card')) {
                        const siblings = Array.from(entry.target.parentNode.children);
                        const index = siblings.indexOf(entry.target);
                        entry.target.style.transitionDelay = `${index * 0.1}s`;
                    }
                }
            });
        }, observerOptions);
        
        fadeElements.forEach(element => {
            element.classList.add('fade-in');
            observer.observe(element);
        });
    }
    
    // Header scroll effects
    function initHeaderScroll() {
        const header = document.getElementById('main-header');
        let lastScroll = 0;
        
        window.addEventListener('scroll', function() {
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
            
            // Update active section in navigation
            updateActiveSection();
        });
    }
    
    // Update active section in navigation based on scroll position
    function updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        const headerHeight = document.getElementById('main-header').offsetHeight;
        
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
    
    // Contact form handling
    function initContactForm() {
        const contactForm = document.querySelector('.contact-form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                const submitBtn = this.querySelector('.submit-btn');
                const originalText = submitBtn.textContent;
                
                // Show loading state
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';
                
                // Reset button after 3 seconds (in case of slow server response)
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                }, 3000);
            });
            
            // Add input focus effects
            const inputs = contactForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('focus', function() {
                    this.parentNode.classList.add('focused');
                });
                
                input.addEventListener('blur', function() {
                    if (!this.value) {
                        this.parentNode.classList.remove('focused');
                    }
                });
                
                // Check if input has value on load
                if (input.value) {
                    input.parentNode.classList.add('focused');
                }
            });
        }
    }
    
    // Social link hover effects
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
    
    // Initialize social effects
    initSocialEffects();
    
    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Theme toggle with 'T' key
        if (e.key === 't' || e.key === 'T') {
            if (!e.target.matches('input, textarea')) {
                document.getElementById('theme-toggle').click();
            }
        }
        
        // ESC key to close any open modals (future use)
        if (e.key === 'Escape') {
            // Add modal close functionality here if needed
        }
    });
    
    // Performance optimization: Throttle scroll events
    function throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Apply throttling to scroll-heavy functions
    const throttledScroll = throttle(function() {
        updateActiveSection();
    }, 100);
    
    window.addEventListener('scroll', throttledScroll);
    
    // Preload hero image for better performance
    function preloadHeroImage() {
        const heroImg = document.querySelector('.hero-image img');
        if (heroImg && heroImg.src) {
            const img = new Image();
            img.src = heroImg.src;
        }
    }
    
    preloadHeroImage();
    
    // Add loading state management
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Trigger any load-dependent animations
        setTimeout(() => {
            const heroSection = document.querySelector('.hero');
            if (heroSection) {
                heroSection.classList.add('loaded');
            }
        }, 100);
    });
    
    // Console welcome message
    console.log('%c🎮 Welcome to IbaraDevilRoze\'s Landing Page! 🎮', 
                'color: #8b5cf6; font-size: 16px; font-weight: bold;');
    console.log('%cTheme: Modern White/Black + Purple Accent with Dark Mode', 
                'color: #6c757d; font-size: 12px;');
    
});

// Monitor actual resource loading
function monitorResourceLoading() {
    const images = document.querySelectorAll('img');
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    let resourcesLoaded = 0;
    let totalResources = images.length + links.length + 1; // +1 for fonts
    
    function onResourceLoad() {
        resourcesLoaded++;
        const realProgress = Math.min(90, (resourcesLoaded / totalResources) * 90);
        
        // Update loading if real progress is faster than simulated progress
        if (realProgress > progress && currentStepIndex < loadingSteps.length - 1) {
            const nextStep = loadingSteps.find(step => step.percent > realProgress);
            if (nextStep && realProgress > progress) {
                updateProgress(realProgress, nextStep.text);
            }
        }
    }
    
    // Monitor image loading
    images.forEach(img => {
        if (img.complete) {
            onResourceLoad();
        } else {
            img.addEventListener('load', onResourceLoad);
            img.addEventListener('error', onResourceLoad);
        }
    });
    
    // Monitor CSS loading
    links.forEach(link => {
        if (link.sheet) {
            onResourceLoad();
        } else {
            link.addEventListener('load', onResourceLoad);
            link.addEventListener('error', onResourceLoad);
        }
    });
    
    // Font loading detection
    if (document.fonts) {
        document.fonts.ready.then(onResourceLoad);
    } else {
        setTimeout(onResourceLoad, 1000);
    }
}

// Start monitoring resources
monitorResourceLoading();

// Emergency fallback - force loading completion after 2 seconds
setTimeout(function() {
    const body = document.body;
    const loadingScreen = document.getElementById('loading-screen');
    
    if (loadingScreen && !body.classList.contains('loaded')) {
        console.log('Emergency fallback: forcing loading completion');
        
        // Force completion
        body.classList.add('loaded');
        body.classList.remove('loading');
        loadingScreen.classList.add('hidden');
        
        // Remove loading screen
        setTimeout(() => {
            if (loadingScreen.parentNode) {
                loadingScreen.parentNode.removeChild(loadingScreen);
            }
        }, 500);
    }
}, 2000);

// Export functions for potential external use
window.VTuberTheme = {
    toggleTheme: function() {
        document.getElementById('theme-toggle').click();
    },
    getCurrentTheme: function() {
        return document.body.getAttribute('data-theme');
    }
};

// Handle logo image loading errors
function initLogoErrorHandling() {
    const logoImages = document.querySelectorAll('.loading-logo-image');
    
    logoImages.forEach(img => {
        img.addEventListener('error', function() {
            // If image fails to load, show fallback text
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
            
            // Hide all logo images
            logoImages.forEach(logoImg => {
                logoImg.style.display = 'none';
            });
        });
    });
}

// Initialize logo error handling
initLogoErrorHandling();

// Initialize loading screen with correct theme
initLoadingTheme();
