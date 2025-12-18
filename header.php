<!DOCTYPE html>
<!--
IbaraDev VTuber Landing Page Theme v2.1.0
WordPress Theme for Content Creators
-->
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
    
    // Store theme for later debug logging
    window.initialTheme = currentTheme;
})();
</script>

<!-- Loading Screen -->
<?php if (get_theme_mod('loading_screen_enabled', true)) : ?>
<div id="loading-screen" class="loading-screen">
    <div class="loading-content">
        <div class="loading-logo">
            <picture class="loading-logo-light">
                <source srcset="<?php echo get_template_directory_uri(); ?>/images/logo-black-trans.avif" type="image/avif">
                <img src="<?php echo get_template_directory_uri(); ?>/images/logo-black-trans.png" 
                     alt="<?php echo esc_attr(get_bloginfo('name')); ?>" 
                     loading="lazy">
            </picture>
            <picture class="loading-logo-dark">
                <source srcset="<?php echo get_template_directory_uri(); ?>/images/logo-white-trans.avif" type="image/avif">
                <img src="<?php echo get_template_directory_uri(); ?>/images/logo-white-trans.png" 
                     alt="<?php echo esc_attr(get_bloginfo('name')); ?>" 
                     loading="lazy">
            </picture>
        </div>
        <div class="loading-spinner">
            <div class="spinner"></div>
        </div>
        <p class="loading-text">読み込み中...</p>
    </div>
</div>
<?php endif; ?>

<!-- Header -->
<header id="main-header" role="banner">
    <div class="container">
        <nav role="navigation" aria-label="Main navigation">
            <!-- Mobile Menu Toggle -->
            <button class="mobile-menu-toggle" 
                    id="mobile-menu-toggle" 
                    type="button"
                    aria-label="メニューを開く"
                    title="メニューを開く">
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            </button>

            <div class="logo">
                <a href="<?php echo esc_url(home_url('/')); ?>" rel="home" aria-label="<?php echo esc_attr(get_bloginfo('name') . ' - Home'); ?>">
                    <picture class="logo-light">
                        <source srcset="<?php echo get_template_directory_uri(); ?>/images/logo-black-trans.avif" type="image/avif">
                        <img src="<?php echo get_template_directory_uri(); ?>/images/logo-black-trans.png" 
                             alt="<?php echo esc_attr(get_bloginfo('name')); ?>" 
                             loading="lazy">
                    </picture>
                    <picture class="logo-dark">
                        <source srcset="<?php echo get_template_directory_uri(); ?>/images/logo-white-trans.avif" type="image/avif">
                        <img src="<?php echo get_template_directory_uri(); ?>/images/logo-white-trans.png" 
                             alt="<?php echo esc_attr(get_bloginfo('name')); ?>" 
                             loading="lazy">
                    </picture>
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

<!-- Left Sidebar Menu -->
<?php 
$sidebar_bg_image = get_theme_mod('sidebar_background_image', get_template_directory_uri() . '/images/ibaradevilroze-keyvisual-trans.png');
$sidebar_bg_position = get_theme_mod('sidebar_background_position', 'center center');
$sidebar_bg_size = get_theme_mod('sidebar_background_size', 'cover');
?>
<aside id="left-sidebar" class="left-sidebar" role="complementary" 
       style="background-image: url('<?php echo esc_url($sidebar_bg_image); ?>'); background-position: <?php echo esc_attr($sidebar_bg_position); ?>; background-size: <?php echo esc_attr($sidebar_bg_size); ?>;"
       data-bg-image="<?php echo esc_url($sidebar_bg_image); ?>"
       data-bg-position="<?php echo esc_attr($sidebar_bg_position); ?>"
       data-bg-size="<?php echo esc_attr($sidebar_bg_size); ?>">
    <div class="sidebar-header">
        <button class="sidebar-close" 
                id="sidebar-close" 
                type="button"
                aria-label="メニューを閉じる"
                title="メニューを閉じる">
            <i class="fas fa-times" aria-hidden="true"></i>
        </button>
    </div>
    
    <nav class="sidebar-nav" role="navigation" aria-label="サイドバーナビゲーション">
        <ul class="sidebar-menu">
            <li class="sidebar-menu-item">
                <a href="<?php echo esc_url(home_url('/')); ?>" class="sidebar-menu-link">
                    <span>HOME</span>
                </a>
            </li>
            <li class="sidebar-menu-item">
                <a href="<?php echo esc_url(home_url('/#about')); ?>" class="sidebar-menu-link">
                    <span>ABOUT</span>
                </a>
            </li>
            <li class="sidebar-menu-item">
                <a href="<?php echo esc_url(home_url('/#videos')); ?>" class="sidebar-menu-link">
                    <span>RECOMMENDED</span>
                </a>
            </li>
            <li class="sidebar-menu-item">
                <a href="<?php echo esc_url(home_url('/achievements/')); ?>" class="sidebar-menu-link">
                    <span>ACHIEVEMENTS</span>
                </a>
            </li>
            <li class="sidebar-menu-item">
                <a href="<?php echo esc_url(home_url('/blog/')); ?>" class="sidebar-menu-link">
                    <span>NEWS</span>
                </a>
            </li>
            <li class="sidebar-menu-item">
                <a href="<?php echo esc_url(home_url('/#guidelines')); ?>" class="sidebar-menu-link">
                    <span>GUIDELINES</span>
                </a>
            </li>
            <?php if (function_exists('vtuber_is_contact_enabled') && vtuber_is_contact_enabled()) : ?>
            <li class="sidebar-menu-item">
                <a href="<?php echo esc_url(home_url('/#contact')); ?>" class="sidebar-menu-link">
                    <span>CONTACT</span>
                </a>
            </li>
            <?php endif; ?>
        </ul>
    </nav>
</aside>

