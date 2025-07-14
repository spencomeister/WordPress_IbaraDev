<?php
/**
 * IbaraDevilRoze VTuber Landing Page Theme Functions
 * Modern White/Black + Purple Accent with Dark Mode
 * Version 2.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Theme Setup
function vtuber_theme_setup() {
    // Add theme support
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));
    
    // Add title tag support
    add_theme_support('title-tag');
    
    // Add custom background support
    add_theme_support('custom-background', array(
        'default-color' => 'ffffff',
    ));
    
    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'vtuber-theme'),
    ));
    
    // Set content width
    if (!isset($content_width)) {
        $content_width = 1200;
    }
}
add_action('after_setup_theme', 'vtuber_theme_setup');

// Enqueue scripts and styles
function vtuber_scripts() {
    // Main stylesheet
    wp_enqueue_style('vtuber-style', get_stylesheet_uri(), array(), '2.0.0');
    
    // Google Fonts
    wp_enqueue_style('google-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap', array(), null);
    
    // Font Awesome
    wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', array(), '6.4.0');
    
    // Main JavaScript
    wp_enqueue_script('vtuber-script', get_template_directory_uri() . '/js/main.js', array(), '2.0.0', true);
    
    // Localize script for AJAX
    wp_localize_script('vtuber-script', 'vtuber_ajax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('vtuber_nonce'),
        'theme_url' => get_template_directory_uri(),
    ));
}
add_action('wp_enqueue_scripts', 'vtuber_scripts');

// Theme Customizer
function vtuber_customize_register($wp_customize) {
    
    // VTuber Information Section
    $wp_customize->add_section('vtuber_info', array(
        'title' => __('VTuber Information', 'vtuber-theme'),
        'priority' => 30,
    ));
    
    // VTuber Name
    $wp_customize->add_setting('vtuber_name', array(
        'default' => 'IbaraDevilRoze',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('vtuber_name', array(
        'label' => __('VTuber Name', 'vtuber-theme'),
        'section' => 'vtuber_info',
        'type' => 'text',
    ));
    
    // VTuber Subtitle
    $wp_customize->add_setting('vtuber_subtitle', array(
        'default' => 'Individual VTuber | Gaming & Chat Streams',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('vtuber_subtitle', array(
        'label' => __('VTuber Subtitle', 'vtuber-theme'),
        'section' => 'vtuber_info',
        'type' => 'text',
    ));
    
    // VTuber Description
    $wp_customize->add_setting('vtuber_description', array(
        'default' => 'Welcome to my world! I\'m a passionate VTuber who loves gaming, chatting with viewers, and creating entertaining content. Join me on this exciting journey!',
        'sanitize_callback' => 'sanitize_textarea_field',
    ));
    $wp_customize->add_control('vtuber_description', array(
        'label' => __('VTuber Description', 'vtuber-theme'),
        'section' => 'vtuber_info',
        'type' => 'textarea',
    ));
    
    // Social Links Section
    $wp_customize->add_section('social_links', array(
        'title' => __('Social Links', 'vtuber-theme'),
        'priority' => 31,
    ));
    
    // Social Media URLs
    $social_platforms = array(
        'youtube' => 'YouTube',
        'twitter' => 'Twitter',
        'discord' => 'Discord',
        'twitch' => 'Twitch',
        'niconico' => 'Niconico',
    );
    
    foreach ($social_platforms as $platform => $label) {
        $wp_customize->add_setting($platform . '_url', array(
            'default' => '',
            'sanitize_callback' => 'esc_url_raw',
        ));
        $wp_customize->add_control($platform . '_url', array(
            'label' => $label . ' URL',
            'section' => 'social_links',
            'type' => 'url',
        ));
    }
    
    // About Section
    $wp_customize->add_section('about_section', array(
        'title' => __('About Section', 'vtuber-theme'),
        'priority' => 32,
    ));
    
    // About texts
    for ($i = 1; $i <= 3; $i++) {
        $wp_customize->add_setting('about_text_' . $i, array(
            'default' => '',
            'sanitize_callback' => 'sanitize_textarea_field',
        ));
        $wp_customize->add_control('about_text_' . $i, array(
            'label' => __('About Text ' . $i, 'vtuber-theme'),
            'section' => 'about_section',
            'type' => 'textarea',
        ));
    }
    
    // About image
    $wp_customize->add_setting('about_image', array(
        'default' => 'about-icon-trans.png',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('about_image', array(
        'label' => __('About Image Filename', 'vtuber-theme'),
        'section' => 'about_section',
        'type' => 'text',
        'description' => __('Enter the filename of the image in the /images/ folder', 'vtuber-theme'),
    ));
    
    // Achievements Section
    $wp_customize->add_section('achievements_section', array(
        'title' => __('Achievements Section', 'vtuber-theme'),
        'priority' => 33,
    ));
    
    // Achievement cards
    for ($i = 1; $i <= 4; $i++) {
        $wp_customize->add_setting('achievement_' . $i . '_title', array(
            'default' => '',
            'sanitize_callback' => 'sanitize_text_field',
        ));
        $wp_customize->add_control('achievement_' . $i . '_title', array(
            'label' => __('Achievement ' . $i . ' Title', 'vtuber-theme'),
            'section' => 'achievements_section',
            'type' => 'text',
        ));
        
        $wp_customize->add_setting('achievement_' . $i . '_desc', array(
            'default' => '',
            'sanitize_callback' => 'sanitize_textarea_field',
        ));
        $wp_customize->add_control('achievement_' . $i . '_desc', array(
            'label' => __('Achievement ' . $i . ' Description', 'vtuber-theme'),
            'section' => 'achievements_section',
            'type' => 'textarea',
        ));
    }
    
    // Achievement date fields
    for ($i = 1; $i <= 4; $i++) {
        $wp_customize->add_setting('achievement_' . $i . '_date', array(
            'default' => '',
            'sanitize_callback' => 'sanitize_text_field',
        ));
        $wp_customize->add_control('achievement_' . $i . '_date', array(
            'label' => __('Achievement ' . $i . ' Date', 'vtuber-theme'),
            'section' => 'achievements_section',
            'type' => 'text',
        ));
    }
    
    // Business Achievements Section
    $wp_customize->add_section('business_section', array(
        'title' => __('Business Achievements Section', 'vtuber-theme'),
        'priority' => 34,
    ));
    
    // Business achievement entries
    for ($i = 1; $i <= 3; $i++) {
        $wp_customize->add_setting('business_' . $i . '_date', array(
            'default' => '',
            'sanitize_callback' => 'sanitize_text_field',
        ));
        $wp_customize->add_control('business_' . $i . '_date', array(
            'label' => __('Business ' . $i . ' Date', 'vtuber-theme'),
            'section' => 'business_section',
            'type' => 'text',
        ));
        
        $wp_customize->add_setting('business_' . $i . '_title', array(
            'default' => '',
            'sanitize_callback' => 'sanitize_text_field',
        ));
        $wp_customize->add_control('business_' . $i . '_title', array(
            'label' => __('Business ' . $i . ' Title', 'vtuber-theme'),
            'section' => 'business_section',
            'type' => 'text',
        ));
        
        $wp_customize->add_setting('business_' . $i . '_desc', array(
            'default' => '',
            'sanitize_callback' => 'sanitize_textarea_field',
        ));
        $wp_customize->add_control('business_' . $i . '_desc', array(
            'label' => __('Business ' . $i . ' Description', 'vtuber-theme'),
            'section' => 'business_section',
            'type' => 'textarea',
        ));
    }
    
    // Videos Section
    $wp_customize->add_section('videos_section', array(
        'title' => __('Videos Section', 'vtuber-theme'),
        'priority' => 35,
    ));
    
    // Video cards
    for ($i = 1; $i <= 3; $i++) {
        $wp_customize->add_setting('video_' . $i . '_title', array(
            'default' => '',
            'sanitize_callback' => 'sanitize_text_field',
        ));
        $wp_customize->add_control('video_' . $i . '_title', array(
            'label' => __('Video ' . $i . ' Title', 'vtuber-theme'),
            'section' => 'videos_section',
            'type' => 'text',
        ));
        
        $wp_customize->add_setting('video_' . $i . '_desc', array(
            'default' => '',
            'sanitize_callback' => 'sanitize_textarea_field',
        ));
        $wp_customize->add_control('video_' . $i . '_desc', array(
            'label' => __('Video ' . $i . ' Description', 'vtuber-theme'),
            'section' => 'videos_section',
            'type' => 'textarea',
        ));
    }
}
add_action('customize_register', 'vtuber_customize_register');

// Contact Form Handler
function handle_contact_form_submission() {
    // Verify nonce
    if (!wp_verify_nonce($_POST['contact_nonce'], 'contact_form_nonce')) {
        wp_die(__('Security check failed.', 'vtuber-theme'));
    }
    
    // Sanitize and validate input
    $name = sanitize_text_field($_POST['contact_name']);
    $email = sanitize_email($_POST['contact_email']);
    $subject = sanitize_text_field($_POST['contact_subject']);
    $message = sanitize_textarea_field($_POST['contact_message']);
    
    // Validation
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        wp_die(__('Please fill in all required fields.', 'vtuber-theme'));
    }
    
    if (!is_email($email)) {
        wp_die(__('Please enter a valid email address.', 'vtuber-theme'));
    }
    
    // Prepare email
    $to = get_option('admin_email');
    $email_subject = '[VTuber Contact] ' . $subject;
    $email_message = "Name: {$name}\n";
    $email_message .= "Email: {$email}\n";
    $email_message .= "Subject: {$subject}\n\n";
    $email_message .= "Message:\n{$message}";
    
    $headers = array(
        'Content-Type: text/plain; charset=UTF-8',
        'From: ' . $name . ' <' . $email . '>',
        'Reply-To: ' . $email,
    );
    
    // Send email
    $sent = wp_mail($to, $email_subject, $email_message, $headers);
    
    if ($sent) {
        // Redirect with success message
        wp_redirect(add_query_arg('contact', 'success', home_url('/#contact')));
    } else {
        // Redirect with error message
        wp_redirect(add_query_arg('contact', 'error', home_url('/#contact')));
    }
    exit;
}
add_action('admin_post_contact_form_submission', 'handle_contact_form_submission');
add_action('admin_post_nopriv_contact_form_submission', 'handle_contact_form_submission');

// Add contact form messages
function display_contact_messages() {
    if (isset($_GET['contact'])) {
        if ($_GET['contact'] === 'success') {
            echo '<div class="contact-message success">Thank you for your message! I\'ll get back to you soon.</div>';
        } elseif ($_GET['contact'] === 'error') {
            echo '<div class="contact-message error">Sorry, there was an error sending your message. Please try again.</div>';
        }
    }
}

// Security enhancements
function vtuber_security_headers() {
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: SAMEORIGIN');
    header('X-XSS-Protection: 1; mode=block');
}
add_action('send_headers', 'vtuber_security_headers');

// Performance optimizations
function vtuber_optimize_performance() {
    // Remove unnecessary WordPress features
    remove_action('wp_head', 'wp_generator');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wp_shortlink_wp_head');
    
    // Disable emojis
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');
    
    // Remove version numbers from CSS and JS
    add_filter('style_loader_src', 'remove_version_query_strings');
    add_filter('script_loader_src', 'remove_version_query_strings');
}
add_action('init', 'vtuber_optimize_performance');

function remove_version_query_strings($src) {
    if (strpos($src, '?ver=')) {
        $src = remove_query_arg('ver', $src);
    }
    return $src;
}

// Custom admin styles
function vtuber_admin_styles() {
    echo '<style>
        .customize-control-description {
            font-style: italic;
            color: #666;
        }
        #customize-theme-controls .customize-section-title {
            color: #8b5cf6;
        }
    </style>';
}
add_action('customize_controls_print_styles', 'vtuber_admin_styles');

// Add theme-specific body classes
function vtuber_body_classes($classes) {
    $classes[] = 'vtuber-theme';
    $classes[] = 'modern-design';
    
    // Add dark mode class based on system preference (for initial load)
    if (!isset($_COOKIE['theme']) && !get_user_meta(get_current_user_id(), 'theme_preference', true)) {
        $classes[] = 'system-theme';
    }
    
    return $classes;
}
add_filter('body_class', 'vtuber_body_classes');

// AJAX handler for theme switching (optional future feature)
function vtuber_ajax_theme_switch() {
    check_ajax_referer('vtuber_nonce', 'nonce');
    
    $theme = sanitize_text_field($_POST['theme']);
    
    if (in_array($theme, array('light', 'dark'))) {
        // Save user preference if logged in
        if (is_user_logged_in()) {
            update_user_meta(get_current_user_id(), 'theme_preference', $theme);
        }
        
        wp_send_json_success(array('theme' => $theme));
    } else {
        wp_send_json_error('Invalid theme');
    }
}
add_action('wp_ajax_theme_switch', 'vtuber_ajax_theme_switch');
add_action('wp_ajax_nopriv_theme_switch', 'vtuber_ajax_theme_switch');

// Add theme version to WordPress admin
function vtuber_theme_version_footer($text) {
    if (current_user_can('manage_options')) {
        $text .= ' | VTuber Theme v2.0';
    }
    return $text;
}
add_filter('admin_footer_text', 'vtuber_theme_version_footer');

?>
