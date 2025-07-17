<!DOCTYPE html>
<!--
IbaraDev VTuber Landing Page Theme v2.0.0
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
    
    console.log('🎨 Theme initialized:', currentTheme);
})();
</script>

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
                    <img src="<?php echo get_template_directory_uri(); ?>/images/logo-black-trans.avif" 
                         alt="<?php echo esc_attr(get_bloginfo('name')); ?>" 
                         class="logo-light">
                    <img src="<?php echo get_template_directory_uri(); ?>/images/logo-white-trans.avif" 
                         alt="<?php echo esc_attr(get_bloginfo('name')); ?>" 
                         class="logo-dark">
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
<aside id="left-sidebar" class="left-sidebar" role="complementary">
    <div class="sidebar-header">
        <div class="sidebar-logo">
            <a href="<?php echo esc_url(home_url('/')); ?>" rel="home">
                <img src="<?php echo get_template_directory_uri(); ?>/images/logo-black-trans.avif" 
                     alt="<?php echo esc_attr(get_bloginfo('name')); ?>" 
                     class="sidebar-logo-light">
                <img src="<?php echo get_template_directory_uri(); ?>/images/logo-white-trans.avif" 
                     alt="<?php echo esc_attr(get_bloginfo('name')); ?>" 
                     class="sidebar-logo-dark">
            </a>
        </div>
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
                    <i class="fas fa-home" aria-hidden="true"></i>
                    <span>ホーム</span>
                </a>
            </li>
            <li class="sidebar-menu-item">
                <a href="<?php echo esc_url(home_url('/#about')); ?>" class="sidebar-menu-link">
                    <i class="fas fa-user" aria-hidden="true"></i>
                    <span>自己紹介</span>
                </a>
            </li>
            <li class="sidebar-menu-item">
                <a href="<?php echo esc_url(home_url('/achievements/')); ?>" class="sidebar-menu-link">
                    <i class="fas fa-trophy" aria-hidden="true"></i>
                    <span>実績</span>
                </a>
            </li>
            <li class="sidebar-menu-item">
                <a href="<?php echo esc_url(home_url('/blog/')); ?>" class="sidebar-menu-link">
                    <i class="fas fa-newspaper" aria-hidden="true"></i>
                    <span>ニュース</span>
                </a>
            </li>
            <li class="sidebar-menu-item">
                <a href="<?php echo esc_url(home_url('/#contact')); ?>" class="sidebar-menu-link">
                    <i class="fas fa-envelope" aria-hidden="true"></i>
                    <span>お問合せ</span>
                </a>
            </li>
            <?php
            // Get custom menu items if they exist (additional items only)
            $menu_items = wp_get_nav_menu_items('primary');
            if ($menu_items) {
                // Get default menu items to avoid duplicates
                $default_items = array('ホーム', '自己紹介', '実績', 'ニュース', 'お問合せ');
                
                foreach ($menu_items as $item) {
                    // Skip items that are already in the default menu
                    if (in_array($item->title, $default_items)) {
                        continue;
                    }
                    
                    $icon_class = 'fas fa-link'; // Default icon
                    
                    // Customize icons based on menu item title
                    switch (strtolower($item->title)) {
                        case 'about':
                        case 'プロフィール':
                            $icon_class = 'fas fa-user';
                            break;
                        case 'contact':
                        case 'お問い合わせ':
                            $icon_class = 'fas fa-envelope';
                            break;
                        case 'stream':
                        case 'ライブ':
                        case 'live':
                            $icon_class = 'fas fa-broadcast-tower';
                            break;
                        case 'schedule':
                        case 'スケジュール':
                            $icon_class = 'fas fa-calendar';
                            break;
                        case 'gallery':
                        case 'ギャラリー':
                            $icon_class = 'fas fa-images';
                            break;
                        case 'shop':
                        case 'ショップ':
                            $icon_class = 'fas fa-shopping-cart';
                            break;
                        case 'videos':
                        case '動画':
                        case 'おすすめ動画':
                            $icon_class = 'fas fa-play';
                            break;
                    }
                    
                    echo '<li class="sidebar-menu-item">';
                    echo '<a href="' . esc_url($item->url) . '" class="sidebar-menu-link">';
                    echo '<i class="' . esc_attr($icon_class) . '" aria-hidden="true"></i>';
                    echo '<span>' . esc_html($item->title) . '</span>';
                    echo '</a>';
                    echo '</li>';
                }
            }
            ?>
        </ul>
    </nav>
</aside>

<!-- Sidebar Overlay -->
<div id="sidebar-overlay" class="sidebar-overlay"></div>
