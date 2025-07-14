// Simple and Reliable Loading Screen
// This is a simplified version that should always work

console.log('Loading script started');

// Simple loading function that works with minimal dependencies
function simpleLoadingScreen() {
    console.log('Simple loading screen function called');
    
    const loadingScreen = document.getElementById('loading-screen');
    const progressFill = document.getElementById('progress-fill');
    const loadingPercentage = document.getElementById('loading-percentage');
    const loadingText = document.getElementById('loading-text');
    const body = document.body;
    
    if (!loadingScreen) {
        console.log('No loading screen found, skipping...');
        return;
    }
    
    console.log('Loading screen elements found, starting animation');
    
    let progress = 0;
    const targetProgress = 100;
    const duration = 2500; // 2.5 seconds total
    const steps = 50;
    const increment = targetProgress / steps;
    const stepDelay = duration / steps;
    
    const messages = [
        'Initializing...',
        'Loading assets...',
        'Setting up interface...',
        'Almost ready...',
        'Welcome!'
    ];
    
    let messageIndex = 0;
    
    function updateProgress() {
        progress += increment;
        
        if (progress > 100) progress = 100;
        
        // Update progress bar
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
        
        // Update percentage
        if (loadingPercentage) {
            loadingPercentage.textContent = Math.round(progress) + '%';
        }
        
        // Update message
        if (loadingText && messageIndex < messages.length) {
            const messageThreshold = (100 / messages.length) * (messageIndex + 1);
            if (progress >= messageThreshold) {
                loadingText.textContent = messages[messageIndex];
                messageIndex++;
            }
        }
        
        // Check if complete
        if (progress >= 100) {
            setTimeout(completeLoading, 300);
        } else {
            setTimeout(updateProgress, stepDelay);
        }
    }
    
    function completeLoading() {
        console.log('Loading complete, hiding screen');
        
        body.classList.add('loaded');
        body.classList.remove('loading');
        
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.visibility = 'hidden';
            
            setTimeout(() => {
                if (loadingScreen.parentNode) {
                    loadingScreen.parentNode.removeChild(loadingScreen);
                }
            }, 500);
        }
        
        // Show main content
        const mainContent = document.querySelector('main');
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        
        [mainContent, header, footer].forEach(element => {
            if (element) {
                element.style.visibility = 'visible';
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 100);
            }
        });
    }
    
    // Start loading animation
    setTimeout(updateProgress, 200);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', simpleLoadingScreen);
} else {
    simpleLoadingScreen();
}

// Failsafe timeout
setTimeout(function() {
    const body = document.body;
    const loadingScreen = document.getElementById('loading-screen');
    
    if (loadingScreen && !body.classList.contains('loaded')) {
        console.log('Failsafe activated: forcing loading completion');
        body.classList.add('loaded');
        body.classList.remove('loading');
        
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        
        // Show all content
        const elements = document.querySelectorAll('main, header, footer');
        elements.forEach(el => {
            if (el) el.style.visibility = 'visible';
        });
    }
}, 3000);

console.log('Loading script setup complete');
