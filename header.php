<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#8b5cf6">
    <meta name="description" content="<?php echo esc_attr(get_theme_mod('vtuber_description', 'Individual VTuber - Gaming & Chat Streams')); ?>">
    
    <!-- Preconnect to external domains for performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://cdnjs.cloudflare.com">
    
    <!-- DNS Prefetch for social media platforms -->
    <link rel="dns-prefetch" href="//youtube.com">
    <link rel="dns-prefetch" href="//x.com">
    <link rel="dns-prefetch" href="//discord.com">
    <link rel="dns-prefetch" href="//twitch.tv">
    
    <!-- Critical CSS will be loaded by WordPress -->
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?> data-theme="light">

<!-- Critical Theme Initialization Script -->
<script>
/**
 * Critical theme initialization - runs immediately
 * Prevents FOUC (Flash of Unstyled Content)
 */
(function() {
    'use strict';
    
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Determine initial theme
    let currentTheme = 'light';
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        currentTheme = savedTheme;
    } else if (systemPrefersDark) {
        currentTheme = 'dark';
    }
    
    // Apply theme immediately
    body.setAttribute('data-theme', currentTheme);
    
    // Add loading class for content management
    body.classList.add('loading');
    
    console.log('🎨 Theme initialized:', currentTheme);
})();
</script>

<!-- Skip to main content for accessibility -->
<a class="skip-link" href="#main-content">Skip to main content</a>

<!-- Header -->
<header id="main-header" role="banner">
    <div class="container">
        <nav role="navigation" aria-label="Main navigation">
            <div class="logo">
                <a href="<?php echo esc_url(home_url('/')); ?>" rel="home" aria-label="<?php echo esc_attr(get_bloginfo('name') . ' - Home'); ?>">
                    <?php 
                    if (has_custom_logo()) :
                        the_custom_logo();
                    else :
                        echo esc_html(get_bloginfo('name'));
                    endif;
                    ?>
                </a>
            </div>
            
            <?php
            wp_nav_menu(array(
                'theme_location' => 'primary',
                'menu_class' => 'nav-links',
                'container' => false,
                'fallback_cb' => 'vtuber_fallback_menu',
                'depth' => 1,
                'add_li_class' => 'nav-item'
            ));
            ?>
            
            <button class="theme-toggle" 
                    id="theme-toggle" 
                    type="button"
                    aria-label="Toggle between light and dark mode"
                    title="Toggle Dark Mode">
                <i class="fas fa-moon" aria-hidden="true"></i>
                <span class="sr-only">Toggle theme</span>
            </button>
        </nav>
    </div>
</header>
