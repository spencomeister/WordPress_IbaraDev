/**
 * Optimized Loading Screen Script
 * IbaraDevilRoze VTuber Theme v2.1
 * 
 * Features:
 * - Fast, reliable loading animation
 * - Multiple fallback mechanisms
 * - Performance optimized
 * - Dark mode support
 */

'use strict';

(function() {
    console.log('Loading script initialized');
    
    // Mark that loading script is active
    window.loadingScriptActive = true;
    
    // Configuration
    const CONFIG = {
        MINIMUM_DISPLAY_TIME: 2500,
        STEP_DELAYS: [400, 350, 400, 350, 300, 250],
        ANIMATION_INTERVAL: 30,
        SAFETY_TIMEOUTS: {
            QUICK: 3000,
            NORMAL: 5000,
            EMERGENCY: 10000
        }
    };

    /**
     * Main loading screen controller
     */
    function initializeLoadingScreen() {
        console.log('Initializing loading screen');
        
        const elements = {
            loadingScreen: document.getElementById('loading-screen'),
            progressFill: document.getElementById('progress-fill'),
            loadingPercentage: document.getElementById('loading-percentage'),
            loadingText: document.getElementById('loading-text'),
            body: document.body
        };
        
        if (!elements.loadingScreen) {
            console.log('No loading screen found, skipping...');
            window.loadingScriptActive = false;
            return null;
        }
        
        console.log('Loading screen elements found, starting animation');
        return elements;
    }

    /**
     * Enhanced loading animation with optimized timing
     */
    function runLoadingSequence() {
        const elements = initializeLoadingScreen();
        if (!elements) return;
        
        const { loadingScreen, progressFill, loadingPercentage, loadingText, body } = elements;
        
        // Add loading class to body
        body.classList.add('loading');
        
        // Track loading start time
        const loadingStartTime = Date.now();
        let currentStep = 0;
        let currentProgress = 0;
        let loadingCompleted = false;
        
        // Loading steps with optimized messages
        const loadingSteps = [
            { percent: 15, text: 'Connecting...', delay: CONFIG.STEP_DELAYS[0] },
            { percent: 30, text: 'Loading assets...', delay: CONFIG.STEP_DELAYS[1] },
            { percent: 50, text: 'Initializing...', delay: CONFIG.STEP_DELAYS[2] },
            { percent: 75, text: 'Setting up...', delay: CONFIG.STEP_DELAYS[3] },
            { percent: 90, text: 'Finalizing...', delay: CONFIG.STEP_DELAYS[4] },
            { percent: 100, text: 'Welcome!', delay: CONFIG.STEP_DELAYS[5] }
        ];
        
        /**
         * Check if minimum display time has elapsed
         */
        function canFinishLoading() {
            const elapsed = Date.now() - loadingStartTime;
            const canFinish = elapsed >= CONFIG.MINIMUM_DISPLAY_TIME;
            console.log(`Loading time elapsed: ${elapsed}ms, can finish: ${canFinish}`);
            return canFinish;
        }
        
        /**
         * Complete the loading process
         */
        function finishLoading() {
            if (loadingCompleted) {
                console.log('Loading already completed, skipping duplicate call');
                return;
            }
            
            loadingCompleted = true;
            console.log('Loading finished');
            
            // Update body classes
            body.classList.add('loaded');
            body.classList.remove('loading');
            
            // Mark loading script as completed
            window.loadingScriptActive = false;
            
            // Ensure main content is visible
            const mainElements = document.querySelectorAll('main, header, footer');
            mainElements.forEach(element => {
                if (element) {
                    element.style.visibility = 'visible';
                    element.style.opacity = '1';
                }
            });
            
            // Hide loading screen
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.visibility = 'hidden';
                
                setTimeout(() => {
                    if (loadingScreen.parentNode) {
                        loadingScreen.parentNode.removeChild(loadingScreen);
                    }
                }, 500);
            }
            
            console.log('Main content is now visible');
        }
        
        /**
         * Animate progress bar smoothly
         */
        function animateProgress(targetPercent, callback) {
            const animate = () => {
                if (currentProgress < targetPercent) {
                    currentProgress += 2;
                    if (currentProgress > targetPercent) currentProgress = targetPercent;
                    
                    if (progressFill) {
                        progressFill.style.width = currentProgress + '%';
                    }
                    if (loadingPercentage) {
                        loadingPercentage.textContent = currentProgress + '%';
                    }
                    
                    setTimeout(animate, CONFIG.ANIMATION_INTERVAL);
                } else {
                    callback();
                }
            };
            animate();
        }
        
        /**
         * Execute next loading step
         */
        function executeNextStep() {
            if (loadingCompleted) return;
            
            if (currentStep >= loadingSteps.length) {
                if (canFinishLoading()) {
                    finishLoading();
                } else {
                    const remainingTime = CONFIG.MINIMUM_DISPLAY_TIME - (Date.now() - loadingStartTime);
                    console.log(`Waiting ${remainingTime}ms more for minimum display time`);
                    setTimeout(finishLoading, remainingTime);
                }
                return;
            }
            
            const step = loadingSteps[currentStep];
            console.log(`Step ${currentStep + 1}: ${step.text} (${step.percent}%)`);
            
            // Update loading text with fade effect
            if (loadingText) {
                loadingText.style.opacity = '0.5';
                setTimeout(() => {
                    loadingText.textContent = step.text;
                    loadingText.style.opacity = '1';
                }, 100);
            }
            
            // Animate progress bar
            animateProgress(step.percent, () => {
                currentStep++;
                if (currentStep < loadingSteps.length) {
                    setTimeout(executeNextStep, step.delay);
                } else {
                    setTimeout(() => {
                        if (!loadingCompleted && canFinishLoading()) {
                            finishLoading();
                        } else if (!loadingCompleted) {
                            const remainingTime = CONFIG.MINIMUM_DISPLAY_TIME - (Date.now() - loadingStartTime);
                            console.log(`All steps complete, waiting ${remainingTime}ms more for minimum time`);
                            setTimeout(() => {
                                if (!loadingCompleted) finishLoading();
                            }, remainingTime);
                        }
                    }, 300);
                }
            });
        }
        
        // Start loading sequence with slight delay
        setTimeout(executeNextStep, 300);
        
        // Safety timeouts
        setTimeout(() => {
            if (!body.classList.contains('loaded') && !loadingCompleted) {
                console.log('Quick safety timeout - ensuring content visibility');
                finishLoading();
            }
        }, CONFIG.SAFETY_TIMEOUTS.QUICK);
        
        setTimeout(() => {
            if (!body.classList.contains('loaded') && !loadingCompleted) {
                console.log('Normal safety timeout - loading appears slow');
                finishLoading();
            }
        }, CONFIG.SAFETY_TIMEOUTS.NORMAL);
        
        setTimeout(() => {
            if (!body.classList.contains('loaded') && !loadingCompleted) {
                console.log('Emergency safety timeout - loading appears stuck');
                finishLoading();
            }
        }, CONFIG.SAFETY_TIMEOUTS.EMERGENCY);
    }

    /**
     * Force show content (emergency function)
     */
    window.forceShowContent = function() {
        console.log('Force showing content...');
        const body = document.body;
        body.classList.add('loaded');
        body.classList.remove('loading');
        
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        
        const mainElements = document.querySelectorAll('main, header, footer');
        mainElements.forEach(element => {
            if (element) {
                element.style.visibility = 'visible';
                element.style.opacity = '1';
            }
        });
        
        window.loadingScriptActive = false;
        console.log('Content force-shown');
    };

    // Initialize loading screen
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runLoadingSequence);
    } else {
        runLoadingSequence();
    }

    // Emergency fallback
    setTimeout(() => {
        if (!document.body.classList.contains('loaded') && !document.body.classList.contains('loading')) {
            console.log('Emergency fallback triggered');
            runLoadingSequence();
        }
    }, 1000);

    // Auto-trigger force show after 3 seconds if still not loaded
    setTimeout(() => {
        if (!document.body.classList.contains('loaded')) {
            console.log('Auto-triggering force show content after 3 seconds');
            window.forceShowContent();
        }
    }, 3000);

})();
