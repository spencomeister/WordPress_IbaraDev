<?php
/**
 * IbaraDev VTuber Landing Page Theme Functions
 * YouTube Data API Integration & Modern Responsive Design
 * Version 2.0.0
 * 
 * @package VTuberTheme
 * @author GitHub Copilot AI Assistant
 * @since 2.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define theme constants
define('VTUBER_THEME_VERSION', '2.0.0');
define('VTUBER_THEME_PATH', get_template_directory());
define('VTUBER_THEME_URL', get_template_directory_uri());

/**
 * Theme Setup
 * Initialize theme features and functionality
 */
function vtuber_theme_setup() {
    // Add theme support
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo', array(
        'height'      => 100,
        'width'       => 400,
        'flex-height' => true,
        'flex-width'  => true,
        'header-text' => array('site-title', 'site-description'),
    ));
    
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ));
    
    // Add title tag support
    add_theme_support('title-tag');
    
    // Add custom background support
    add_theme_support('custom-background', array(
        'default-color' => 'ffffff',
        'default-image' => '',
    ));
    
    // Add editor styles
    add_theme_support('editor-styles');
    add_editor_style('style.css');
    
    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('メインメニュー', 'vtuber-theme'),
        'footer'  => __('フッターメニュー', 'vtuber-theme'),
    ));
    
    // Set content width
    if (!isset($content_width)) {
        $content_width = 1200;
    }
    
    // Add theme support for responsive embeds
    add_theme_support('responsive-embeds');
    
    // Add theme support for block styles
    add_theme_support('wp-block-styles');
    
    // Add theme support for wide alignment
    add_theme_support('align-wide');
}
add_action('after_setup_theme', 'vtuber_theme_setup');

/**
 * Set up blog page on theme activation
 * Creates necessary pages for the theme
 */
function vtuber_setup_blog_page() {
    // Create blog page if it doesn't exist
    $blog_page = get_page_by_path('blog');
    if (!$blog_page) {
        $blog_page_id = wp_insert_post(array(
            'post_title' => 'ニュース',
            'post_name' => 'blog',
            'post_content' => '',
            'post_status' => 'publish',
            'post_type' => 'page'
        ));
        
        // Set this page as the posts page
        update_option('page_for_posts', $blog_page_id);
    }
    
    // Create achievements page if it doesn't exist
    $achievements_page = get_page_by_path('achievements');
    if (!$achievements_page) {
        wp_insert_post(array(
            'post_title' => '実績',
            'post_name' => 'achievements',
            'post_content' => '',
            'post_status' => 'publish',
            'post_type' => 'page'
        ));
    }
    
    // Create guidelines page if it doesn't exist
    $guidelines_page = get_page_by_path('guidelines');
    if (!$guidelines_page) {
        wp_insert_post(array(
            'post_title' => 'ガイドライン',
            'post_name' => 'guidelines',
            'post_content' => '',
            'post_status' => 'publish',
            'post_type' => 'page'
        ));
    }
    
    // Ensure front page is set to show a static page (not posts)
    update_option('show_on_front', 'page');
    
    // Set front page to use front-page.php
    $front_page = get_page_by_path('home');
    if (!$front_page) {
        $front_page_id = wp_insert_post(array(
            'post_title' => 'ホーム',
            'post_name' => 'home',
            'post_content' => '',
            'post_status' => 'publish',
            'post_type' => 'page'
        ));
        update_option('page_on_front', $front_page_id);
    }
}
add_action('after_switch_theme', 'vtuber_setup_blog_page');

/**
 * Fallback menu for when no menu is assigned
 * Provides default navigation structure
 */
function vtuber_fallback_menu() {
    $menu_items = array(
        'ホーム' => home_url(),
        '自己紹介' => home_url() . '/#about',
        'おすすめ動画' => home_url() . '/#videos',
        '実績' => home_url() . '/achievements/',
        'ニュース' => home_url() . '/blog/',
        'ガイドライン' => home_url() . '/#guidelines',
        'お問合せ' => home_url() . '/#contact'
    );
    
    echo '<ul class="nav-links">';
    foreach ($menu_items as $title => $url) {
        echo '<li><a href="' . esc_url($url) . '">' . esc_html($title) . '</a></li>';
    }
    echo '</ul>';
}

/**
 * Enqueue scripts and styles
 * Optimized loading order and performance
 */
function vtuber_scripts() {
    $theme_version = VTUBER_THEME_VERSION;
    
    // Main stylesheet
    wp_enqueue_style('vtuber-style', get_stylesheet_uri(), array(), $theme_version);
    
    // Google Fonts with display=swap for performance
    wp_enqueue_style(
        'google-fonts', 
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap', 
        array(), 
        null
    );
    
    // Font Awesome with integrity check
    wp_enqueue_style(
        'font-awesome', 
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', 
        array(), 
        '6.4.0'
    );
    
    // Main JavaScript - Load in footer for performance
    wp_enqueue_script(
        'vtuber-script', 
        get_template_directory_uri() . '/js/main.js', 
        array(), 
        $theme_version, 
        true
    );
    
    // Prepare video data for JavaScript
    $video_data = array();
    for ($i = 1; $i <= 3; $i++) {
        $video_data['video_' . $i] = array(
            'title' => get_theme_mod('video_' . $i . '_title', ''),
            'description' => get_theme_mod('video_' . $i . '_desc', ''),
            'url' => get_theme_mod('video_' . $i . '_url', ''),
        );
    }
    
    // Localize script for AJAX with nonce security
    wp_localize_script('vtuber-script', 'vtuber_ajax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('vtuber_nonce'),
        'theme_url' => get_template_directory_uri(),
        'debug' => defined('WP_DEBUG') && WP_DEBUG,
        'video_data' => $video_data,
        'debug_settings' => array(
            'enabled' => get_theme_mod('debug_logging_enabled', false),
            'level' => get_theme_mod('debug_log_level', 'basic'),
        ),
        'loading_config' => array(
            'enabled' => get_theme_mod('loading_screen_enabled', true),
            'min_loading_time' => get_theme_mod('loading_screen_min_time', 800),
            'enable_transitions' => true,
            'show_for_external' => false,
        ),
        'recaptcha_config' => array(
            'enabled' => get_theme_mod('recaptcha_enabled', false),
            'site_key' => get_theme_mod('recaptcha_site_key', ''),
            'threshold' => get_theme_mod('recaptcha_threshold', 0.5),
        ),
    ));
    
    // Enqueue reCAPTCHA v3 script if enabled
    if (get_theme_mod('recaptcha_enabled', false) && !empty(get_theme_mod('recaptcha_site_key', ''))) {
        $site_key = get_theme_mod('recaptcha_site_key', '');
        wp_enqueue_script(
            'google-recaptcha', 
            "https://www.google.com/recaptcha/api.js?render={$site_key}",
            array(),
            null,
            true
        );
    }
    
    // Add AVIF detection and fallback functionality
    enqueue_avif_detection_script();
}
add_action('wp_enqueue_scripts', 'vtuber_scripts');

// Contact form handling with WP Mail SMTP support
function handle_contact_form_submission() {
    // Verify nonce
    if (!isset($_POST['contact_nonce']) || !wp_verify_nonce($_POST['contact_nonce'], 'contact_form_nonce')) {
        wp_die('Security check failed');
    }
    
    // Sanitize form data
    $name = sanitize_text_field($_POST['contact_name']);
    $email = sanitize_email($_POST['contact_email']);
    $subject = sanitize_text_field($_POST['contact_subject']);
    $message = sanitize_textarea_field($_POST['contact_message']);
    
    // Validate required fields
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        vtuber_log_contact_error('必須フィールドが不足しています', array(
            'name' => $name,
            'email' => $email,
            'subject' => $subject,
            'message_length' => strlen($message)
        ));
        wp_redirect(home_url('/?contact=error&reason=required_fields'));
        exit;
    }
    
    // Validate email format
    if (!is_email($email)) {
        vtuber_log_contact_error('無効なメールアドレス形式', array('email' => $email));
        wp_redirect(home_url('/?contact=error&reason=invalid_email'));
        exit;
    }
    
    // Get recipient email from customizer or use admin email as fallback
    $to = get_theme_mod('contact_recipient_email', get_option('admin_email'));
    
    // Prepare email with enhanced formatting
    $email_subject = '[' . get_bloginfo('name') . '] ' . $subject;
    $email_message = "━━━ お問い合わせ内容 ━━━\n\n";
    $email_message .= "お名前: {$name}\n";
    $email_message .= "メールアドレス: {$email}\n";
    $email_message .= "件名: {$subject}\n";
    $email_message .= "送信日時: " . current_time('Y-m-d H:i:s') . "\n\n";
    $email_message .= "メッセージ:\n" . str_repeat('-', 40) . "\n";
    $email_message .= $message . "\n";
    $email_message .= str_repeat('-', 40) . "\n\n";
    $email_message .= "━━━ 送信情報 ━━━\n";
    $email_message .= "送信者IP: " . $_SERVER['REMOTE_ADDR'] . "\n";
    $email_message .= "ユーザーエージェント: " . $_SERVER['HTTP_USER_AGENT'] . "\n";
    
    $headers = array(
        'Content-Type: text/plain; charset=UTF-8',
        'From: ' . get_bloginfo('name') . ' <' . $to . '>',
        'Reply-To: ' . $name . ' <' . $email . '>'
    );
    
    // Log attempt if debug mode is enabled
    if (get_theme_mod('debug_logging_enabled', false)) {
        vtuber_log_contact_info('メール送信を試行中', array(
            'to' => $to,
            'subject' => $email_subject,
            'from_name' => $name,
            'from_email' => $email,
            'wp_mail_smtp_active' => is_plugin_active('wp-mail-smtp/wp_mail_smtp.php')
        ));
    }
    
    // Send email with error capturing
    $sent = wp_mail($to, $email_subject, $email_message, $headers);
    
    if ($sent) {
        vtuber_log_contact_info('メール送信成功', array(
            'to' => $to,
            'from' => $email,
            'subject' => $subject
        ));
        wp_redirect(home_url('/?contact=success'));
    } else {
        // Capture detailed error information
        $error_info = array(
            'to' => $to,
            'from' => $email,
            'subject' => $subject,
            'wp_mail_smtp_active' => is_plugin_active('wp-mail-smtp/wp_mail_smtp.php'),
            'admin_email' => get_option('admin_email'),
            'bloginfo_name' => get_bloginfo('name')
        );
        
        // Check for common issues
        if (!is_plugin_active('wp-mail-smtp/wp_mail_smtp.php')) {
            $error_info['recommendation'] = 'WP Mail SMTPプラグインのインストールを推奨します';
        }
        
        vtuber_log_contact_error('メール送信失敗', $error_info);
        wp_redirect(home_url('/?contact=error&reason=send_failed'));
    }
    exit;
}
add_action('admin_post_contact_form_submission', 'handle_contact_form_submission');
add_action('admin_post_nopriv_contact_form_submission', 'handle_contact_form_submission');

// Frontend AJAX contact form submission with reCAPTCHA v3 support
function handle_ajax_contact_form_submission() {
    // Verify nonce
    if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'vtuber_nonce')) {
        wp_send_json_error(array(
            'message' => 'セキュリティチェックに失敗しました。',
            'code' => 'SECURITY_ERROR'
        ));
    }
    
    // Sanitize form data
    $name = sanitize_text_field($_POST['name'] ?? '');
    $email = sanitize_email($_POST['email'] ?? '');
    $subject = sanitize_text_field($_POST['subject'] ?? '');
    $message = sanitize_textarea_field($_POST['message'] ?? '');
    $recaptcha_token = sanitize_text_field($_POST['recaptcha_token'] ?? '');
    
    // Validate required fields
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        wp_send_json_error(array(
            'message' => '必須フィールドに入力してください。',
            'code' => 'VALIDATION_ERROR'
        ));
    }
    
    // Validate email format
    if (!is_email($email)) {
        wp_send_json_error(array(
            'message' => '有効なメールアドレスを入力してください。',
            'code' => 'EMAIL_VALIDATION_ERROR'
        ));
    }
    
    // reCAPTCHA v3 verification if enabled
    if (get_theme_mod('recaptcha_enabled', false)) {
        if (empty($recaptcha_token)) {
            wp_send_json_error(array(
                'message' => 'reCAPTCHA認証が必要です。',
                'code' => 'RECAPTCHA_TOKEN_MISSING'
            ));
        }
        
        $recaptcha_result = verify_recaptcha_token($recaptcha_token);
        if (!$recaptcha_result['success']) {
            vtuber_log_contact_error('reCAPTCHA認証失敗', array(
                'error' => $recaptcha_result['error'],
                'score' => $recaptcha_result['score'] ?? 'N/A'
            ));
            
            wp_send_json_error(array(
                'message' => 'スパム防止認証に失敗しました。再度お試しください。',
                'code' => 'RECAPTCHA_VERIFICATION_FAILED'
            ));
        }
        
        vtuber_log_contact_info('reCAPTCHA認証成功', array(
            'score' => $recaptcha_result['score']
        ));
    }
    
    // Get recipient email from customizer or use admin email as fallback
    $to = get_theme_mod('contact_recipient_email', get_option('admin_email'));
    
    // Prepare email with enhanced formatting
    $email_subject = '[' . get_bloginfo('name') . '] ' . $subject;
    $email_message = "━━━ お問い合わせ内容 ━━━\n\n";
    $email_message .= "お名前: {$name}\n";
    $email_message .= "メールアドレス: {$email}\n";
    $email_message .= "件名: {$subject}\n";
    $email_message .= "送信日時: " . current_time('Y-m-d H:i:s') . "\n\n";
    $email_message .= "メッセージ:\n" . str_repeat('-', 40) . "\n";
    $email_message .= $message . "\n";
    $email_message .= str_repeat('-', 40) . "\n\n";
    $email_message .= "━━━ 送信情報 ━━━\n";
    $email_message .= "送信者IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . "\n";
    $email_message .= "ユーザーエージェント: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'unknown') . "\n";
    
    if (get_theme_mod('recaptcha_enabled', false) && isset($recaptcha_result['score'])) {
        $email_message .= "reCAPTCHA スコア: " . $recaptcha_result['score'] . "\n";
    }
    
    $headers = array(
        'Content-Type: text/plain; charset=UTF-8',
        'From: ' . get_bloginfo('name') . ' <' . $to . '>',
        'Reply-To: ' . $name . ' <' . $email . '>'
    );
    
    // Log attempt if debug mode is enabled
    if (get_theme_mod('debug_logging_enabled', false)) {
        vtuber_log_contact_info('AJAX メール送信を試行中', array(
            'to' => $to,
            'subject' => $email_subject,
            'from_name' => $name,
            'from_email' => $email,
            'wp_mail_smtp_active' => is_plugin_active('wp-mail-smtp/wp_mail_smtp.php')
        ));
    }
    
    // Send email with error capturing
    $sent = wp_mail($to, $email_subject, $email_message, $headers);
    
    if ($sent) {
        vtuber_log_contact_info('AJAX メール送信成功', array(
            'to' => $to,
            'from' => $email,
            'subject' => $subject
        ));
        
        wp_send_json_success(array(
            'message' => 'お問い合わせを送信しました。ありがとうございます。'
        ));
    } else {
        // Capture detailed error information
        $error_info = array(
            'to' => $to,
            'from' => $email,
            'subject' => $subject,
            'wp_mail_smtp_active' => is_plugin_active('wp-mail-smtp/wp_mail_smtp.php'),
            'admin_email' => get_option('admin_email'),
            'bloginfo_name' => get_bloginfo('name')
        );
        
        vtuber_log_contact_error('AJAX メール送信失敗', $error_info);
        
        wp_send_json_error(array(
            'message' => 'メール送信に失敗しました。しばらく時間を置いてから再度お試しください。',
            'code' => 'EMAIL_SEND_FAILED'
        ));
    }
}

// reCAPTCHA v3 token verification
function verify_recaptcha_token($token) {
    $secret_key = get_theme_mod('recaptcha_secret_key', '');
    $threshold = get_theme_mod('recaptcha_threshold', 0.5);
    
    if (empty($secret_key)) {
        return array(
            'success' => false,
            'error' => 'reCAPTCHA secret key not configured'
        );
    }
    
    $response = wp_remote_post('https://www.google.com/recaptcha/api/siteverify', array(
        'body' => array(
            'secret' => $secret_key,
            'response' => $token,
            'remoteip' => $_SERVER['REMOTE_ADDR'] ?? ''
        ),
        'timeout' => 30
    ));
    
    if (is_wp_error($response)) {
        return array(
            'success' => false,
            'error' => 'reCAPTCHA API request failed: ' . $response->get_error_message()
        );
    }
    
    $body = wp_remote_retrieve_body($response);
    $result = json_decode($body, true);
    
    if (!$result) {
        return array(
            'success' => false,
            'error' => 'Invalid reCAPTCHA API response'
        );
    }
    
    if (!$result['success']) {
        return array(
            'success' => false,
            'error' => 'reCAPTCHA verification failed',
            'error_codes' => $result['error-codes'] ?? array()
        );
    }
    
    // Check action (should be 'contact_form')
    if (isset($result['action']) && $result['action'] !== 'contact_form') {
        return array(
            'success' => false,
            'error' => 'Invalid reCAPTCHA action: ' . $result['action']
        );
    }
    
    // Check score against threshold
    $score = $result['score'] ?? 0.0;
    if ($score < $threshold) {
        return array(
            'success' => false,
            'error' => 'reCAPTCHA score too low',
            'score' => $score,
            'threshold' => $threshold
        );
    }
    
    return array(
        'success' => true,
        'score' => $score
    );
}

// Register AJAX handlers
add_action('wp_ajax_contact_form_submission', 'handle_ajax_contact_form_submission');
add_action('wp_ajax_nopriv_contact_form_submission', 'handle_ajax_contact_form_submission');

// Contact form logging functions
function vtuber_log_contact_info($message, $data = array()) {
    if (!get_theme_mod('debug_logging_enabled', false)) {
        return;
    }
    
    $log_entry = array(
        'timestamp' => current_time('c'),
        'level' => 'INFO',
        'category' => 'CONTACT',
        'message' => $message,
        'data' => $data,
        'user_ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
    );
    
    error_log('[VTUBER CONTACT INFO] ' . json_encode($log_entry, JSON_UNESCAPED_UNICODE));
}

function vtuber_log_contact_error($message, $data = array()) {
    $log_entry = array(
        'timestamp' => current_time('c'),
        'level' => 'ERROR',
        'category' => 'CONTACT',
        'message' => $message,
        'data' => $data,
        'user_ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
    );
    
    // Always log errors regardless of debug setting
    error_log('[VTUBER CONTACT ERROR] ' . json_encode($log_entry, JSON_UNESCAPED_UNICODE));
}

// Theme Customizer
function vtuber_customize_register($wp_customize) {
    
    // メインページ設定セクション
    $wp_customize->add_section('main_page_settings', array(
        'title' => __('メインページ設定', 'vtuber-theme'),
        'priority' => 25,
        'description' => __('メインページのコンテンツと表示設定を管理します', 'vtuber-theme'),
    ));
    
    // ページタイトル設定
    $wp_customize->add_setting('main_page_title', array(
        'default' => 'IbaraDevilRoze',
        'sanitize_callback' => 'sanitize_text_field',
        'transport' => 'refresh',
    ));
    $wp_customize->add_control('main_page_title', array(
        'label' => __('メインページタイトル', 'vtuber-theme'),
        'section' => 'main_page_settings',
        'type' => 'text',
        'description' => __('ヘッダーに表示されるメインタイトルです', 'vtuber-theme'),
    ));
    
    // ヒーローセクション設定
    $wp_customize->add_setting('hero_title', array(
        'default' => '私の世界へようこそ',
        'sanitize_callback' => 'sanitize_text_field',
        'transport' => 'refresh',
    ));
    $wp_customize->add_control('hero_title', array(
        'label' => __('ヒーローセクションタイトル', 'vtuber-theme'),
        'section' => 'main_page_settings',
        'type' => 'text',
        'description' => __('メインビジュアル部分のタイトルです', 'vtuber-theme'),
    ));
    
    $wp_customize->add_setting('hero_subtitle', array(
        'default' => 'VTuber・配信者として活動中',
        'sanitize_callback' => 'sanitize_text_field',
        'transport' => 'refresh',
    ));
    $wp_customize->add_control('hero_subtitle', array(
        'label' => __('ヒーローセクションサブタイトル', 'vtuber-theme'),
        'section' => 'main_page_settings',
        'type' => 'text',
        'description' => __('メインビジュアル部分のサブタイトルです', 'vtuber-theme'),
    ));
    
    // キービジュアル画像設定
    $wp_customize->add_setting('hero_image', array(
        'default' => 'ibaradevilroze-keyvisual-trans.avif',
        'sanitize_callback' => 'sanitize_text_field',
        'transport' => 'refresh',
    ));
    $wp_customize->add_control('hero_image', array(
        'label' => __('キービジュアル画像', 'vtuber-theme'),
        'section' => 'main_page_settings',
        'type' => 'text',
        'description' => __('/images/フォルダ内の画像ファイル名を入力してください', 'vtuber-theme'),
    ));
    
    // メインナビゲーション設定
    $wp_customize->add_setting('nav_menu_enabled', array(
        'default' => true,
        'sanitize_callback' => 'wp_validate_boolean',
        'transport' => 'refresh',
    ));
    $wp_customize->add_control('nav_menu_enabled', array(
        'label' => __('ナビゲーションメニューを表示', 'vtuber-theme'),
        'section' => 'main_page_settings',
        'type' => 'checkbox',
        'description' => __('ヘッダーにナビゲーションメニューを表示するかどうか', 'vtuber-theme'),
    ));
    
    // ダークモード設定
    $wp_customize->add_setting('dark_mode_enabled', array(
        'default' => true,
        'sanitize_callback' => 'wp_validate_boolean',
        'transport' => 'refresh',
    ));
    $wp_customize->add_control('dark_mode_enabled', array(
        'label' => __('ダークモード切替ボタンを表示', 'vtuber-theme'),
        'section' => 'main_page_settings',
        'type' => 'checkbox',
        'description' => __('ヘッダーにダークモード切替ボタンを表示するかどうか', 'vtuber-theme'),
    ));
    
    // ローディング画面設定
    $wp_customize->add_setting('loading_screen_enabled', array(
        'default' => true,
        'sanitize_callback' => 'wp_validate_boolean',
        'transport' => 'refresh',
    ));
    $wp_customize->add_control('loading_screen_enabled', array(
        'label' => __('ローディング画面を有効にする', 'vtuber-theme'),
        'section' => 'main_page_settings',
        'type' => 'checkbox',
        'description' => __('ページ読み込み時とページ遷移時にローディング画面を表示', 'vtuber-theme'),
    ));
    
    $wp_customize->add_setting('loading_screen_min_time', array(
        'default' => 800,
        'sanitize_callback' => 'absint',
        'transport' => 'refresh',
    ));
    $wp_customize->add_control('loading_screen_min_time', array(
        'label' => __('最小表示時間（ミリ秒）', 'vtuber-theme'),
        'section' => 'main_page_settings',
        'type' => 'number',
        'description' => __('ローディング画面の最小表示時間（800-3000推奨）', 'vtuber-theme'),
        'input_attrs' => array(
            'min' => 300,
            'max' => 5000,
            'step' => 100,
        ),
    ));
    
    // VTuber情報セクション
    $wp_customize->add_section('vtuber_info', array(
        'title' => __('VTuber情報', 'vtuber-theme'),
        'priority' => 30,
    ));
    
    // VTuber名
    $wp_customize->add_setting('vtuber_name', array(
        'default' => 'IbaraDevilRoze',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('vtuber_name', array(
        'label' => __('VTuber名', 'vtuber-theme'),
        'section' => 'vtuber_info',
        'type' => 'text',
    ));
    
    // VTuberサブタイトル
    $wp_customize->add_setting('vtuber_subtitle', array(
        'default' => 'VTuber・配信者として活動中',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('vtuber_subtitle', array(
        'label' => __('VTuberサブタイトル', 'vtuber-theme'),
        'section' => 'vtuber_info',
        'type' => 'text',
    ));
    
    // VTuber説明文
    $wp_customize->add_setting('vtuber_description', array(
        'default' => 'ようこそ私の世界へ！ゲームが大好きで、視聴者の皆さんとの交流を楽しんでいるVTuberです。楽しくて居心地の良い環境作りを心がけています。',
        'sanitize_callback' => 'sanitize_textarea_field',
    ));
    $wp_customize->add_control('vtuber_description', array(
        'label' => __('VTuber説明文', 'vtuber-theme'),
        'section' => 'vtuber_info',
        'type' => 'textarea',
    ));
    
    // ソーシャルリンクセクション
    $wp_customize->add_section('social_links', array(
        'title' => __('ソーシャルリンク', 'vtuber-theme'),
        'priority' => 31,
    ));
    
    // ソーシャルメディアURL（X、BOOTH対応）
    $social_platforms = array(
        'youtube' => 'YouTube',
        'x' => 'X (旧Twitter)',
        'discord' => 'Discord',
        'twitch' => 'Twitch',
        'booth' => 'BOOTH',
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
    
    // 自己紹介セクション
    $wp_customize->add_section('about_section', array(
        'title' => __('自己紹介セクション', 'vtuber-theme'),
        'priority' => 32,
        'description' => __('プロフィール情報をテーブル形式で管理します', 'vtuber-theme'),
    ));
    
    // 動的なプロフィールテーブル設定
    $wp_customize->add_setting('profile_table_data', array(
        'default' => json_encode(array(
            array('label' => '名前', 'value' => 'IbaraDevilRoze'),
            array('label' => '年齢', 'value' => '？？歳'),
            array('label' => '誕生日', 'value' => '？月？日'),
            array('label' => '身長', 'value' => '？？？cm'),
            array('label' => '好きな色', 'value' => '紫'),
            array('label' => '好きな食べ物', 'value' => 'パンケーキ'),
            array('label' => '趣味', 'value' => 'ゲーム、お絵描き'),
            array('label' => '特技', 'value' => 'ゲーム実況、歌')
        )),
        'sanitize_callback' => 'sanitize_profile_table_data',
        'transport' => 'refresh',
    ));
    
    $profile_control = new Profile_Table_Repeater_Control($wp_customize, 'profile_table_data', array(
        'label' => __('プロフィール情報', 'vtuber-theme'),
        'section' => 'about_section',
        'description' => __('プロフィールテーブルの項目を追加・編集・削除できます。項目名（ラベル）と値を設定してください。', 'vtuber-theme'),
    ));
    $wp_customize->add_control($profile_control);
    
    // 自己紹介画像
    $wp_customize->add_setting('about_image', array(
        'default' => 'about-icon-trans.avif',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('about_image', array(
        'label' => __('自己紹介画像ファイル名', 'vtuber-theme'),
        'section' => 'about_section',
        'type' => 'text',
        'description' => __('/images/フォルダ内の画像ファイル名を入力してください', 'vtuber-theme'),
    ));
    
    // 個人実績セクション
    $wp_customize->add_section('achievements_section', array(
        'title' => __('個人実績セクション', 'vtuber-theme'),
        'priority' => 33,
    ));
    
    // 動的な個人実績設定
    $wp_customize->add_setting('achievements_data', array(
        'default' => json_encode(array()),
        'sanitize_callback' => 'sanitize_achievements_data',
        'transport' => 'refresh',
    ));
    
    $achievements_control = new Achievements_Repeater_Control($wp_customize, 'achievements_data', array(
        'label' => __('個人実績', 'vtuber-theme'),
        'section' => 'achievements_section',
        'description' => __('個人実績の項目を追加・編集・削除できます。日付は「年.月」形式の文字列で入力してください（例：2024.01）', 'vtuber-theme'),
    ));
    $achievements_control->emoji_type = 'personal';
    $wp_customize->add_control($achievements_control);
    
    // 案件実績セクション
    $wp_customize->add_section('business_section', array(
        'title' => __('案件実績セクション', 'vtuber-theme'),
        'priority' => 34,
    ));
    
    // 動的な案件実績設定
    $wp_customize->add_setting('business_data', array(
        'default' => json_encode(array()),
        'sanitize_callback' => 'sanitize_achievements_data',
        'transport' => 'refresh',
    ));
    
    $business_control = new Achievements_Repeater_Control($wp_customize, 'business_data', array(
        'label' => __('案件実績', 'vtuber-theme'),
        'section' => 'business_section',
        'description' => __('案件実績の項目を追加・編集・削除できます。日付は「年.月」形式の文字列で入力してください（例：2024.01）', 'vtuber-theme'),
    ));
    $business_control->emoji_type = 'business';
    $wp_customize->add_control($business_control);
    
    // 動画セクション
    $wp_customize->add_section('videos_section', array(
        'title' => __('動画セクション', 'vtuber-theme'),
        'description' => __('おすすめ動画の設定を行います。YouTube Data APIを使用してタイトルとサムネイルを自動取得します。', 'vtuber-theme'),
        'priority' => 35,
    ));
    
    // YouTube Data API設定
    $wp_customize->add_setting('youtube_api_key', array(
        'default' => '',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('youtube_api_key', array(
        'label' => __('YouTube Data API キー', 'vtuber-theme'),
        'description' => __('YouTube Data APIキーを入力してください。<a href="https://console.developers.google.com/" target="_blank">Google Cloud Console</a>で取得できます。', 'vtuber-theme'),
        'section' => 'videos_section',
        'type' => 'text',
        'priority' => 10,
    ));
    
    // 動画カード
    for ($i = 1; $i <= 3; $i++) {
        $wp_customize->add_setting('video_' . $i . '_title', array(
            'default' => '',
            'sanitize_callback' => 'sanitize_text_field',
        ));
        $wp_customize->add_control('video_' . $i . '_title', array(
            'label' => __('動画 ' . $i . ' タイトル', 'vtuber-theme'),
            'description' => __('YouTube URLを入力すると自動で取得されます', 'vtuber-theme'),
            'section' => 'videos_section',
            'type' => 'text',
            'priority' => 20 + ($i * 10),
        ));
        
        $wp_customize->add_setting('video_' . $i . '_desc', array(
            'default' => '',
            'sanitize_callback' => 'sanitize_textarea_field',
        ));
        $wp_customize->add_control('video_' . $i . '_desc', array(
            'label' => __('動画 ' . $i . ' 説明', 'vtuber-theme'),
            'section' => 'videos_section',
            'type' => 'textarea',
            'priority' => 21 + ($i * 10),
        ));
        
        $wp_customize->add_setting('video_' . $i . '_url', array(
            'default' => '',
            'sanitize_callback' => 'esc_url_raw',
        ));
        $wp_customize->add_control('video_' . $i . '_url', array(
            'label' => __('動画 ' . $i . ' URL', 'vtuber-theme'),
            'description' => __('YouTube動画のURLを入力してください', 'vtuber-theme'),
            'section' => 'videos_section',
            'type' => 'url',
            'priority' => 22 + ($i * 10),
        ));
    }
    
    // モバイルサイドバー設定セクション
    $wp_customize->add_section('mobile_sidebar_settings', array(
        'title' => __('モバイルサイドバー設定', 'vtuber-theme'),
        'description' => __('モバイル表示時のサイドバーの背景画像を設定します', 'vtuber-theme'),
        'priority' => 36,
    ));
    
    // サイドバー背景画像設定
    $wp_customize->add_setting('sidebar_background_image', array(
        'default' => get_template_directory_uri() . '/images/ibaradevilroze-keyvisual-trans.png',
        'sanitize_callback' => 'esc_url_raw',
        'transport' => 'refresh',
    ));
    
    $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'sidebar_background_image', array(
        'label' => __('サイドバー背景画像', 'vtuber-theme'),
        'description' => __('モバイルサイドバーの背景に表示される画像を設定します。推奨サイズ: 1080x1920px', 'vtuber-theme'),
        'section' => 'mobile_sidebar_settings',
        'priority' => 10,
    )));
    
    // サイドバー背景画像のポジション設定
    $wp_customize->add_setting('sidebar_background_position', array(
        'default' => 'center center',
        'sanitize_callback' => 'sanitize_text_field',
        'transport' => 'refresh',
    ));
    
    $wp_customize->add_control('sidebar_background_position', array(
        'label' => __('背景画像の位置', 'vtuber-theme'),
        'description' => __('背景画像の表示位置を調整します', 'vtuber-theme'),
        'section' => 'mobile_sidebar_settings',
        'type' => 'select',
        'choices' => array(
            'center center' => __('中央', 'vtuber-theme'),
            'top center' => __('上部中央', 'vtuber-theme'),
            'bottom center' => __('下部中央', 'vtuber-theme'),
            'center left' => __('左中央', 'vtuber-theme'),
            'center right' => __('右中央', 'vtuber-theme'),
            'top left' => __('左上', 'vtuber-theme'),
            'top right' => __('右上', 'vtuber-theme'),
            'bottom left' => __('左下', 'vtuber-theme'),
            'bottom right' => __('右下', 'vtuber-theme'),
        ),
        'priority' => 20,
    ));
    
    // サイドバー背景画像のサイズ設定
    $wp_customize->add_setting('sidebar_background_size', array(
        'default' => 'cover',
        'sanitize_callback' => 'sanitize_text_field',
        'transport' => 'refresh',
    ));
    
    $wp_customize->add_control('sidebar_background_size', array(
        'label' => __('背景画像のサイズ', 'vtuber-theme'),
        'description' => __('背景画像の表示サイズを調整します', 'vtuber-theme'),
        'section' => 'mobile_sidebar_settings',
        'type' => 'select',
        'choices' => array(
            'cover' => __('カバー（画面全体に表示）', 'vtuber-theme'),
            'contain' => __('コンテイン（画像全体を表示）', 'vtuber-theme'),
            'auto' => __('オリジナルサイズ', 'vtuber-theme'),
        ),
        'priority' => 30,
    ));

    // Developer Settings Section
    $wp_customize->add_section('developer_settings', array(
        'title'       => __('開発者設定', 'vtuber-theme'),
        'priority'    => 200,
        'description' => __('開発およびデバッグ用の設定です。本番環境では慎重に設定してください。', 'vtuber-theme'),
    ));

    // Debug Logging
    $wp_customize->add_setting('debug_logging_enabled', array(
        'default'           => false,
        'sanitize_callback' => 'wp_validate_boolean',
        'transport'         => 'refresh',
    ));

    $wp_customize->add_control('debug_logging_enabled', array(
        'label'       => __('デバッグログを表示', 'vtuber-theme'),
        'description' => __('ブラウザのコンソールにデバッグ情報を表示します。本番環境では無効にしてください。', 'vtuber-theme'),
        'section'     => 'developer_settings',
        'type'        => 'checkbox',
        'priority'    => 10,
    ));

    // Console Log Level
    $wp_customize->add_setting('debug_log_level', array(
        'default'           => 'basic',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'refresh',
    ));

    $wp_customize->add_control('debug_log_level', array(
        'label'       => __('ログレベル', 'vtuber-theme'),
        'description' => __('表示するデバッグ情報の詳細度を選択してください。', 'vtuber-theme'),
        'section'     => 'developer_settings',
        'type'        => 'select',
        'choices'     => array(
            'minimal' => __('最小限（エラーのみ）', 'vtuber-theme'),
            'basic'   => __('基本（重要な情報のみ）', 'vtuber-theme'),
            'verbose' => __('詳細（すべての情報）', 'vtuber-theme'),
        ),
        'priority'    => 20,
        'active_callback' => function() {
            return get_theme_mod('debug_logging_enabled', false);
        },
    ));
    
    // Contact Settings Section
    $wp_customize->add_section('contact_settings', array(
        'title'    => __('お問い合わせ設定', 'vtuber-theme'),
        'description' => __('Contactフォームの送信先メールアドレスやWP Mail SMTP連携設定を管理します。', 'vtuber-theme'),
        'priority' => 140,
    ));
    
    // Contact recipient email setting
    $wp_customize->add_setting('contact_recipient_email', array(
        'default'    => get_option('admin_email'),
        'sanitize_callback' => 'sanitize_email',
        'transport'  => 'refresh',
    ));
    
    $wp_customize->add_control('contact_recipient_email', array(
        'label'       => __('送信先メールアドレス', 'vtuber-theme'),
        'description' => __('お問い合わせフォームからのメールを受信するメールアドレスを設定してください。空の場合は管理者メールアドレスが使用されます。', 'vtuber-theme'),
        'section'     => 'contact_settings',
        'type'        => 'email',
        'priority'    => 10,
    ));
    
    // WP Mail SMTP status info (read-only)
    $wp_customize->add_setting('wp_mail_smtp_status', array(
        'default'    => '',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'  => 'postMessage',
    ));
    
    $wp_mail_smtp_active = is_plugin_active('wp-mail-smtp/wp_mail_smtp.php');
    $status_text = $wp_mail_smtp_active ? 
        __('✓ WP Mail SMTPプラグインが有効です', 'vtuber-theme') : 
        __('⚠ WP Mail SMTPプラグインが無効です。メール送信の信頼性向上のため、インストールを推奨します。', 'vtuber-theme');
    
    $wp_customize->add_control('wp_mail_smtp_status', array(
        'label'       => __('WP Mail SMTP 状態', 'vtuber-theme'),
        'description' => $status_text,
        'section'     => 'contact_settings',
        'type'        => 'text',
        'priority'    => 20,
        'input_attrs' => array(
            'readonly' => 'readonly',
            'style' => 'background-color: #f1f1f1; cursor: not-allowed;'
        ),
    ));
    
    // Contact form test setting
    $wp_customize->add_setting('contact_test_mode', array(
        'default'    => false,
        'sanitize_callback' => 'rest_sanitize_boolean',
        'transport'  => 'refresh',
    ));
    
    $wp_customize->add_control('contact_test_mode', array(
        'label'       => __('テストモード', 'vtuber-theme'),
        'description' => __('有効にすると、お問い合わせフォームの送信時に詳細なデバッグ情報がログに記録されます。', 'vtuber-theme'),
        'section'     => 'contact_settings',
        'type'        => 'checkbox',
        'priority'    => 30,
    ));
    
    // reCAPTCHA v3 Settings
    $wp_customize->add_setting('recaptcha_enabled', array(
        'default'    => false,
        'sanitize_callback' => 'rest_sanitize_boolean',
        'transport'  => 'refresh',
    ));
    
    $wp_customize->add_control('recaptcha_enabled', array(
        'label'       => __('reCAPTCHA v3を有効にする', 'vtuber-theme'),
        'description' => __('お問い合わせフォームでreCAPTCHA v3による認証を行います。', 'vtuber-theme'),
        'section'     => 'contact_settings',
        'type'        => 'checkbox',
        'priority'    => 40,
    ));
    
    $wp_customize->add_setting('recaptcha_site_key', array(
        'default'    => '',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'  => 'refresh',
    ));
    
    $wp_customize->add_control('recaptcha_site_key', array(
        'label'       => __('reCAPTCHA サイトキー', 'vtuber-theme'),
        'description' => __('Google reCAPTCHA v3のサイトキーを入力してください。<a href="https://www.google.com/recaptcha/admin" target="_blank">reCAPTCHA管理コンソール</a>で取得できます。', 'vtuber-theme'),
        'section'     => 'contact_settings',
        'type'        => 'text',
        'priority'    => 50,
        'active_callback' => function() {
            return get_theme_mod('recaptcha_enabled', false);
        },
    ));
    
    $wp_customize->add_setting('recaptcha_secret_key', array(
        'default'    => '',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'  => 'refresh',
    ));
    
    $wp_customize->add_control('recaptcha_secret_key', array(
        'label'       => __('reCAPTCHA シークレットキー', 'vtuber-theme'),
        'description' => __('Google reCAPTCHA v3のシークレットキーを入力してください。', 'vtuber-theme'),
        'section'     => 'contact_settings',
        'type'        => 'text',
        'priority'    => 60,
        'active_callback' => function() {
            return get_theme_mod('recaptcha_enabled', false);
        },
    ));
    
    $wp_customize->add_setting('recaptcha_threshold', array(
        'default'    => 0.5,
        'sanitize_callback' => function($value) {
            $value = floatval($value);
            return max(0.0, min(1.0, $value));
        },
        'transport'  => 'refresh',
    ));
    
    $wp_customize->add_control('recaptcha_threshold', array(
        'label'       => __('reCAPTCHA 閾値', 'vtuber-theme'),
        'description' => __('スパム判定の閾値を設定してください（0.0-1.0）。低いほど厳しくなります。推奨: 0.5', 'vtuber-theme'),
        'section'     => 'contact_settings',
        'type'        => 'number',
        'priority'    => 70,
        'input_attrs' => array(
            'min' => '0.0',
            'max' => '1.0',
            'step' => '0.1',
        ),
        'active_callback' => function() {
            return get_theme_mod('recaptcha_enabled', false);
        },
    ));
}

// Register the customizer function
add_action('customize_register', 'vtuber_customize_register');

// Define custom control class before customize_register
add_action('customize_register', 'vtuber_define_custom_controls', 1);
function vtuber_define_custom_controls() {
    // Custom Repeater Control for Achievements
    class Achievements_Repeater_Control extends WP_Customize_Control {
        public $type = 'achievements_repeater';
        public $emoji_type = 'personal'; // 'personal' or 'business'
        
        public function render_content() {
            $value = $this->value() ? json_decode($this->value(), true) : array();
            
            // Define emoji options based on type
            $emoji_options = array();
            if ($this->emoji_type === 'business') {
                $emoji_options = array(
                    '🎮' => '🎮 ゲーム',
                    '🛍️' => '🛍️ ショッピング',
                    '🍔' => '🍔 食品・飲食',
                    '📱' => '📱 アプリ・IT',
                    '🎵' => '🎵 音楽',
                    '🎬' => '🎬 映画・動画',
                    '💻' => '💻 テクノロジー',
                    '🏢' => '🏢 企業・ビジネス',
                    '🌐' => '🌐 ウェブサービス',
                    '💼' => '💼 プロモーション',
                    '👕' => '👕 ファッション',
                    '🎭' => '🎭 イベント',
                    '🎁' => '🎁 ギフト・キャンペーン'
                );
            } else {
                $emoji_options = array(
                    '📺' => '📺 配信',
                    '👥' => '👥 コラボ',
                    '🎮' => '🎮 ゲーム',
                    '🏆' => '🏆 達成',
                    '🎯' => '🎯 目標',
                    '📊' => '📊 成果',
                    '🌟' => '🌟 特別',
                    '🎉' => '🎉 記念',
                    '💫' => '💫 成長',
                    '🎨' => '🎨 創作',
                    '🎤' => '🎤 歌・ライブ',
                    '⚔️' => '⚔️ 対戦',
                    '🥊' => '🥊 格闘ゲーム'
                );
            }
            
            ?>
            <label>
                <span class="customize-control-title"><?php echo esc_html($this->label); ?></span>
                <?php if (!empty($this->description)) : ?>
                    <span class="description customize-control-description"><?php echo $this->description; ?></span>
                <?php endif; ?>
            </label>
            
            <div class="achievements-repeater-container">
                <div class="achievements-items" data-setting="<?php echo esc_attr($this->id); ?>">
                    <?php if (!empty($value)) : ?>
                        <?php foreach ($value as $index => $item) : ?>
                            <div class="achievement-item" data-index="<?php echo $index; ?>">
                                <div class="achievement-header">
                                    <h4>実績項目 #<?php echo ($index + 1); ?></h4>
                                    <button type="button" class="button remove-achievement">削除</button>
                                </div>
                                <div class="achievement-fields">
                                    <p>
                                        <label>絵文字:</label>
                                        <select class="achievement-icon">
                                            <?php foreach ($emoji_options as $emoji => $label): ?>
                                            <option value="<?php echo esc_attr($emoji); ?>" <?php selected(isset($item['icon']) ? $item['icon'] : '', $emoji); ?>><?php echo esc_html($label); ?></option>
                                            <?php endforeach; ?>
                                        </select>
                                    </p>
                                    <p>
                                        <label>日付 (年.月 形式):</label>
                                        <input type="text" class="achievement-date" value="<?php echo esc_attr(isset($item['date']) ? $item['date'] : ''); ?>" placeholder="2024.01">
                                        <small>例: 2024.01, 2023.12</small>
                                    </p>
                                    <p>
                                        <label>タイトル:</label>
                                        <input type="text" class="achievement-title" value="<?php echo esc_attr(isset($item['title']) ? $item['title'] : ''); ?>" placeholder="実績のタイトル">
                                    </p>
                                    <p>
                                        <label>説明:</label>
                                        <textarea class="achievement-desc" placeholder="実績の詳細説明"><?php echo esc_textarea(isset($item['desc']) ? $item['desc'] : ''); ?></textarea>
                                    </p>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
                <button type="button" class="button button-primary add-achievement">新しい実績を追加</button>
            </div>
            
            <style>
            .achievements-repeater-container {
                margin-top: 10px;
            }
            .achievement-item {
                border: 1px solid #ddd;
                margin-bottom: 15px;
                padding: 15px;
                background: #f9f9f9;
            }
            .achievement-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                border-bottom: 1px solid #ddd;
                padding-bottom: 10px;
            }
            .achievement-header h4 {
                margin: 0;
                font-size: 14px;
            }
            .achievement-fields p {
                margin-bottom: 10px;
            }
            .achievement-fields label {
                display: block;
                font-weight: bold;
                margin-bottom: 5px;
            }
            .achievement-fields input,
            .achievement-fields textarea {
                width: 100%;
                padding: 5px;
            }
            .achievement-fields textarea {
                height: 60px;
                resize: vertical;
            }
            .add-achievement {
                margin-top: 10px;
            }
            .remove-achievement {
                background: #dc3232;
                color: white;
                border: none;
                padding: 5px 10px;
                cursor: pointer;
                font-size: 12px;
            }
            </style>
            
            <script type="text/javascript">
            jQuery(document).ready(function($) {
                var controlId = '<?php echo esc_js($this->id); ?>';
                var container = $('[data-setting="' + controlId + '"]').closest('.achievements-repeater-container');
                
                // Emoji options for this specific control type
                var emojiOptions = <?php echo json_encode($emoji_options); ?>;
                
                // Generate emoji select options HTML
                function generateEmojiSelect() {
                    var html = '';
                    $.each(emojiOptions, function(emoji, label) {
                        html += '<option value="' + emoji + '">' + label + '</option>';
                    });
                    return html;
                }
                
                // Add new achievement (only for this specific control)
                container.on('click', '.add-achievement', function() {
                    var itemsContainer = $(this).siblings('.achievements-items');
                    var index = itemsContainer.children().length;
                    var emojiSelectHtml = generateEmojiSelect();
                    var newItem = `
                        <div class="achievement-item" data-index="${index}">
                            <div class="achievement-header">
                                <h4>実績項目 #${index + 1}</h4>
                                <button type="button" class="button remove-achievement">削除</button>
                            </div>
                            <div class="achievement-fields">
                                <p>
                                    <label>絵文字:</label>
                                    <select class="achievement-icon">
                                        ${emojiSelectHtml}
                                    </select>
                                </p>
                                <p>
                                    <label>日付 (年.月 形式):</label>
                                    <input type="text" class="achievement-date" value="" placeholder="2024.01">
                                    <small>例: 2024.01, 2023.12</small>
                                </p>
                                <p>
                                    <label>タイトル:</label>
                                    <input type="text" class="achievement-title" value="" placeholder="実績のタイトル">
                                </p>
                                <p>
                                    <label>説明:</label>
                                    <textarea class="achievement-desc" placeholder="実績の詳細説明"></textarea>
                                </p>
                            </div>
                        </div>
                    `;
                    itemsContainer.append(newItem);
                    // Set default emoji to first option
                    var newlyAdded = itemsContainer.children().last();
                    newlyAdded.find('.achievement-icon').val(Object.keys(emojiOptions)[0]);
                    updateAchievementsData(itemsContainer);
                });
                
                // Remove achievement
                container.on('click', '.remove-achievement', function() {
                    var itemsContainer = $(this).closest('.achievements-items');
                    $(this).closest('.achievement-item').remove();
                    // Re-index items
                    itemsContainer.children('.achievement-item').each(function(index) {
                        $(this).attr('data-index', index);
                        $(this).find('h4').text('実績項目 #' + (index + 1));
                    });
                    updateAchievementsData(itemsContainer);
                });
                
                // Update data when fields change
                container.on('input change', '.achievement-icon, .achievement-date, .achievement-title, .achievement-desc', function() {
                    var itemsContainer = $(this).closest('.achievements-items');
                    updateAchievementsData(itemsContainer);
                });
                
                function updateAchievementsData(itemsContainer) {
                    var data = [];
                    itemsContainer.children('.achievement-item').each(function() {
                        var item = {
                            icon: $(this).find('.achievement-icon').val(),
                            date: $(this).find('.achievement-date').val(),
                            title: $(this).find('.achievement-title').val(),
                            desc: $(this).find('.achievement-desc').val()
                        };
                        data.push(item);
                    });
                    
                    var settingId = itemsContainer.data('setting');
                    wp.customize(settingId).set(JSON.stringify(data));
                }
            });
            </script>
            <?php
        }
    }
}

// Sanitize achievements data
function sanitize_achievements_data($input) {
    $data = json_decode($input, true);
    if (!is_array($data)) {
        return json_encode(array());
    }
    
    $sanitized = array();
    foreach ($data as $item) {
        if (is_array($item)) {
            $sanitized[] = array(
                'icon' => sanitize_text_field(isset($item['icon']) ? $item['icon'] : ''),
                'date' => sanitize_text_field(isset($item['date']) ? $item['date'] : ''),
                'title' => sanitize_text_field(isset($item['title']) ? $item['title'] : ''),
                'desc' => sanitize_textarea_field(isset($item['desc']) ? $item['desc'] : ''),
            );
        }
    }
    
    return json_encode($sanitized);
}

// Sanitize profile table data
function sanitize_profile_table_data($input) {
    $data = json_decode($input, true);
    if (!is_array($data)) {
        return json_encode(array());
    }
    
    $sanitized = array();
    foreach ($data as $item) {
        if (is_array($item)) {
            $sanitized[] = array(
                'label' => sanitize_text_field(isset($item['label']) ? $item['label'] : ''),
                'value' => sanitize_textarea_field(isset($item['value']) ? $item['value'] : ''),
            );
        }
    }
    
    return json_encode($sanitized);
}

// Profile Table Repeater Control Class
if (class_exists('WP_Customize_Control')) {
    class Profile_Table_Repeater_Control extends WP_Customize_Control {
        public $type = 'profile_table_repeater';
        
        public function render_content() {
            $value = $this->value() ? json_decode($this->value(), true) : array();
            
            ?>
            <label>
                <span class="customize-control-title"><?php echo esc_html($this->label); ?></span>
                <?php if (!empty($this->description)) : ?>
                    <span class="description customize-control-description"><?php echo $this->description; ?></span>
                <?php endif; ?>
            </label>
            
            <div class="profile-table-repeater-container">
                <div class="profile-table-items" data-setting="<?php echo esc_attr($this->id); ?>">
                    <?php if (!empty($value)) : ?>
                        <?php foreach ($value as $index => $item) : ?>
                            <div class="profile-table-item" data-index="<?php echo $index; ?>">
                                <div class="profile-table-header">
                                    <h4>項目 #<?php echo ($index + 1); ?></h4>
                                    <button type="button" class="button remove-profile-item">削除</button>
                                </div>
                                <div class="profile-table-fields">
                                    <p>
                                        <label>項目名（ラベル）:</label>
                                        <input type="text" class="profile-item-label" value="<?php echo esc_attr(isset($item['label']) ? $item['label'] : ''); ?>" placeholder="例: 名前、年齢、趣味など">
                                    </p>
                                    <p>
                                        <label>値:</label>
                                        <textarea class="profile-item-value" placeholder="項目の値を入力してください"><?php echo esc_textarea(isset($item['value']) ? $item['value'] : ''); ?></textarea>
                                    </p>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
                <button type="button" class="button button-primary add-profile-item">新しい項目を追加</button>
            </div>
            
            <style>
            .profile-table-repeater-container {
                margin-top: 10px;
            }
            .profile-table-item {
                border: 1px solid #ddd;
                margin-bottom: 15px;
                padding: 15px;
                background: #f9f9f9;
            }
            .profile-table-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                border-bottom: 1px solid #ddd;
                padding-bottom: 10px;
            }
            .profile-table-header h4 {
                margin: 0;
                font-size: 14px;
            }
            .profile-table-fields p {
                margin-bottom: 10px;
            }
            .profile-table-fields label {
                display: block;
                font-weight: bold;
                margin-bottom: 5px;
            }
            .profile-table-fields input,
            .profile-table-fields textarea {
                width: 100%;
                padding: 5px;
            }
            .profile-table-fields textarea {
                height: 60px;
                resize: vertical;
            }
            .add-profile-item {
                margin-top: 10px;
            }
            .remove-profile-item {
                background: #dc3232;
                color: white;
                border: none;
                padding: 5px 10px;
                cursor: pointer;
                font-size: 12px;
            }
            </style>
            
            <script type="text/javascript">
            jQuery(document).ready(function($) {
                var controlId = '<?php echo esc_js($this->id); ?>';
                var container = $('[data-setting="' + controlId + '"]').closest('.profile-table-repeater-container');
                
                // Add new profile item (only for this specific control)
                container.on('click', '.add-profile-item', function() {
                    var itemsContainer = $(this).siblings('.profile-table-items');
                    var index = itemsContainer.children().length;
                    var newItem = `
                        <div class="profile-table-item" data-index="${index}">
                            <div class="profile-table-header">
                                <h4>項目 #${index + 1}</h4>
                                <button type="button" class="button remove-profile-item">削除</button>
                            </div>
                            <div class="profile-table-fields">
                                <p>
                                    <label>項目名（ラベル）:</label>
                                    <input type="text" class="profile-item-label" value="" placeholder="例: 名前、年齢、趣味など">
                                </p>
                                <p>
                                    <label>値:</label>
                                    <textarea class="profile-item-value" placeholder="項目の値を入力してください"></textarea>
                                </p>
                            </div>
                        </div>
                    `;
                    itemsContainer.append(newItem);
                    updateProfileTableData(itemsContainer);
                });
                
                // Remove profile item
                container.on('click', '.remove-profile-item', function() {
                    var itemsContainer = $(this).closest('.profile-table-items');
                    $(this).closest('.profile-table-item').remove();
                    // Re-index items
                    itemsContainer.children('.profile-table-item').each(function(index) {
                        $(this).attr('data-index', index);
                        $(this).find('h4').text('項目 #' + (index + 1));
                    });
                    updateProfileTableData(itemsContainer);
                });
                
                // Update data when fields change
                container.on('input change', '.profile-item-label, .profile-item-value', function() {
                    var itemsContainer = $(this).closest('.profile-table-items');
                    updateProfileTableData(itemsContainer);
                });
                
                function updateProfileTableData(itemsContainer) {
                    var data = [];
                    itemsContainer.children('.profile-table-item').each(function() {
                        var item = {
                            label: $(this).find('.profile-item-label').val(),
                            value: $(this).find('.profile-item-value').val()
                        };
                        data.push(item);
                    });
                    
                    var settingId = itemsContainer.data('setting');
                    wp.customize(settingId).set(JSON.stringify(data));
                }
            });
            </script>
            <?php
        }
    }
}

// Add contact form messages with enhanced error handling
function display_contact_messages() {
    if (isset($_GET['contact'])) {
        if ($_GET['contact'] === 'success') {
            echo '<div class="contact-message success">';
            echo '<i class="fas fa-check-circle"></i> ';
            echo 'お問い合わせありがとうございます！近日中にお返事いたします。';
            echo '</div>';
        } elseif ($_GET['contact'] === 'error') {
            $error_reason = isset($_GET['reason']) ? sanitize_text_field($_GET['reason']) : '';
            
            echo '<div class="contact-message error">';
            echo '<i class="fas fa-exclamation-triangle"></i> ';
            
            switch ($error_reason) {
                case 'required_fields':
                    echo '必須フィールドがすべて入力されていません。お名前、メールアドレス、件名、メッセージをすべて入力してください。';
                    break;
                case 'invalid_email':
                    echo 'メールアドレスの形式が正しくありません。正しいメールアドレスを入力してください。';
                    break;
                case 'send_failed':
                    echo 'メッセージの送信でエラーが発生しました。';
                    if (!is_plugin_active('wp-mail-smtp/wp_mail_smtp.php')) {
                        echo '<br><small>※ メール送信の信頼性向上のため、WP Mail SMTPプラグインのご利用を推奨いたします。</small>';
                    }
                    echo '<br><small>問題が続く場合は、しばらく時間をおいてから再度お試しください。</small>';
                    break;
                default:
                    echo '申し訳ございません。メッセージの送信でエラーが発生しました。もう一度お試しください。';
                    break;
            }
            
            echo '</div>';
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

// WP Mail SMTP integration notice for administrators
function vtuber_wp_mail_smtp_admin_notice() {
    // Only show to administrators
    if (!current_user_can('manage_options')) {
        return;
    }
    
    // Only show if WP Mail SMTP is not active
    if (is_plugin_active('wp-mail-smtp/wp_mail_smtp.php')) {
        return;
    }
    
    // Check if notice was dismissed
    if (get_user_meta(get_current_user_id(), 'vtuber_wp_mail_smtp_notice_dismissed', true)) {
        return;
    }
    
    ?>
    <div class="notice notice-warning is-dismissible" id="vtuber-wp-mail-smtp-notice">
        <h3>📧 お問い合わせフォームの信頼性向上について</h3>
        <p>
            <strong>VTuberテーマ</strong>のお問い合わせフォームをより確実に動作させるため、
            <strong>WP Mail SMTP</strong>プラグインのインストールを推奨いたします。
        </p>
        <p>
            <strong>WP Mail SMTP</strong>を使用することで：
        </p>
        <ul>
            <li>✅ メール送信の信頼性が大幅に向上します</li>
            <li>✅ Gmail、Outlook、SendGridなど様々なメールサービスに対応</li>
            <li>✅ 送信ログで問題を素早く特定できます</li>
            <li>✅ SPFやDKIMでメールの認証が向上します</li>
        </ul>
        <p>
            <a href="<?php echo admin_url('plugin-install.php?s=wp+mail+smtp&tab=search&type=term'); ?>" class="button button-primary">
                WP Mail SMTPをインストール
            </a>
            <a href="#" class="button" onclick="vtuberDismissWpMailSmtpNotice()">
                後で確認する
            </a>
        </p>
    </div>
    
    <script>
    function vtuberDismissWpMailSmtpNotice() {
        document.getElementById('vtuber-wp-mail-smtp-notice').style.display = 'none';
        
        // Send AJAX request to dismiss notice
        var xhr = new XMLHttpRequest();
        xhr.open('POST', ajaxurl);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('action=vtuber_dismiss_wp_mail_smtp_notice&nonce=<?php echo wp_create_nonce('vtuber_dismiss_notice'); ?>');
    }
    </script>
    <?php
}
add_action('admin_notices', 'vtuber_wp_mail_smtp_admin_notice');

// Handle notice dismissal
function vtuber_handle_dismiss_wp_mail_smtp_notice() {
    if (!wp_verify_nonce($_POST['nonce'], 'vtuber_dismiss_notice')) {
        wp_die('Security check failed');
    }
    
    update_user_meta(get_current_user_id(), 'vtuber_wp_mail_smtp_notice_dismissed', true);
    wp_die('OK');
}
add_action('wp_ajax_vtuber_dismiss_wp_mail_smtp_notice', 'vtuber_handle_dismiss_wp_mail_smtp_notice');

// Contact form test functionality for administrators
function vtuber_contact_form_test_page() {
    if (!current_user_can('manage_options')) {
        wp_die('権限がありません');
    }
    
    if (isset($_POST['test_contact_form'])) {
        $test_email = sanitize_email($_POST['test_email']);
        if (empty($test_email)) {
            $test_email = get_option('admin_email');
        }
        
        $subject = '[テスト送信] ' . get_bloginfo('name') . ' お問い合わせフォーム';
        $message = "これはお問い合わせフォームのテスト送信です。\n\n";
        $message .= "送信日時: " . current_time('Y-m-d H:i:s') . "\n";
        $message .= "WordPress管理者: " . wp_get_current_user()->display_name . "\n";
        $message .= "WP Mail SMTP有効: " . (is_plugin_active('wp-mail-smtp/wp_mail_smtp.php') ? 'はい' : 'いいえ') . "\n";
        $message .= "PHPバージョン: " . PHP_VERSION . "\n";
        $message .= "WordPressバージョン: " . get_bloginfo('version') . "\n\n";
        $message .= "このメールが届いた場合、お問い合わせフォームは正常に動作しています。";
        
        $headers = array(
            'Content-Type: text/plain; charset=UTF-8',
            'From: ' . get_bloginfo('name') . ' <' . get_option('admin_email') . '>'
        );
        
        $sent = wp_mail($test_email, $subject, $message, $headers);
        
        if ($sent) {
            echo '<div class="notice notice-success"><p>✅ テストメールを送信しました: ' . esc_html($test_email) . '</p></div>';
        } else {
            echo '<div class="notice notice-error"><p>❌ テストメールの送信に失敗しました。WP Mail SMTPプラグインの設定を確認してください。</p></div>';
        }
    }
    
    ?>
    <div class="wrap">
        <h1>📧 お問い合わせフォーム テスト送信</h1>
        <div class="card">
            <h2>メール送信テスト</h2>
            <p>お問い合わせフォームが正常に動作するかテストできます。</p>
            
            <form method="post">
                <table class="form-table">
                    <tr>
                        <th scope="row">送信先メールアドレス</th>
                        <td>
                            <input type="email" name="test_email" value="<?php echo esc_attr(get_option('admin_email')); ?>" class="regular-text" />
                            <p class="description">テストメールを送信するメールアドレスを入力してください。</p>
                        </td>
                    </tr>
                </table>
                
                <p class="submit">
                    <input type="submit" name="test_contact_form" class="button-primary" value="テストメールを送信" />
                </p>
            </form>
        </div>
        
        <div class="card">
            <h2>📊 現在の設定</h2>
            <table class="widefat">
                <tr>
                    <th>WP Mail SMTP</th>
                    <td><?php echo is_plugin_active('wp-mail-smtp/wp_mail_smtp.php') ? '✅ 有効' : '❌ 無効'; ?></td>
                </tr>
                <tr>
                    <th>管理者メール</th>
                    <td><?php echo esc_html(get_option('admin_email')); ?></td>
                </tr>
                <tr>
                    <th>Contact送信先</th>
                    <td><?php echo esc_html(get_theme_mod('contact_recipient_email', get_option('admin_email'))); ?></td>
                </tr>
                <tr>
                    <th>デバッグログ</th>
                    <td><?php echo get_theme_mod('debug_logging_enabled', false) ? '✅ 有効' : '❌ 無効'; ?></td>
                </tr>
                <tr>
                    <th>Contactテストモード</th>
                    <td><?php echo get_theme_mod('contact_test_mode', false) ? '✅ 有効' : '❌ 無効'; ?></td>
                </tr>
            </table>
        </div>
    </div>
    <?php
}

// Add menu item for contact test
function vtuber_add_contact_test_menu() {
    add_management_page(
        'お問い合わせテスト',
        'お問い合わせテスト',
        'manage_options',
        'vtuber-contact-test',
        'vtuber_contact_form_test_page'
    );
}
add_action('admin_menu', 'vtuber_add_contact_test_menu');

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

/**
 * Add theme version to WordPress admin footer
 */
function vtuber_theme_version_footer($text) {
    if (current_user_can('manage_options')) {
        $text .= ' | <strong>VTuber Theme v' . VTUBER_THEME_VERSION . '</strong>';
    }
    return $text;
}
add_filter('admin_footer_text', 'vtuber_theme_version_footer');

/**
 * Optimize WordPress queries for better performance
 */
function vtuber_optimize_queries() {
    // Remove unnecessary post meta queries
    remove_action('wp_head', 'adjacent_posts_rel_link_wp_head');
    
    // Limit post revisions
    if (!defined('WP_POST_REVISIONS')) {
        define('WP_POST_REVISIONS', 3);
    }
    
    // Optimize heartbeat
    add_filter('heartbeat_settings', function($settings) {
        $settings['interval'] = 60; // 60 seconds
        return $settings;
    });
}
add_action('init', 'vtuber_optimize_queries');

/**
 * Add structured data for SEO
 */
function vtuber_add_structured_data() {
    if (is_front_page()) {
        $vtuber_name = get_theme_mod('vtuber_name', 'IbaraDevilRoze');
        $vtuber_description = get_theme_mod('vtuber_description', 'Individual VTuber');
        
        $structured_data = array(
            '@context' => 'https://schema.org',
            '@type' => 'Person',
            'name' => $vtuber_name,
            'description' => $vtuber_description,
            'url' => home_url(),
            'sameAs' => array_filter(array(
                get_theme_mod('youtube_url'),
                get_theme_mod('x_url'),
                get_theme_mod('discord_url'),
                get_theme_mod('twitch_url'),
                get_theme_mod('booth_url'),
            ))
        );
        
        echo '<script type="application/ld+json">' . json_encode($structured_data, JSON_UNESCAPED_SLASHES) . '</script>';
    }
}
add_action('wp_head', 'vtuber_add_structured_data');

/**
 * Theme cleanup on deactivation
 */
function vtuber_theme_deactivation() {
    // Clean up theme options if needed
    delete_option('vtuber_theme_version');
    
    // Clear any cached data
    wp_cache_flush();
}
register_deactivation_hook(__FILE__, 'vtuber_theme_deactivation');

/**
 * Customize excerpt length and more text
 * 投稿抜粋の長さとmore textをカスタマイズ
 */
function vtuber_custom_excerpt_length($length) {
    return 20; // 20 words for excerpt
}
add_filter('excerpt_length', 'vtuber_custom_excerpt_length');

function vtuber_custom_excerpt_more($more) {
    return '…';
}
add_filter('excerpt_more', 'vtuber_custom_excerpt_more');

/**
 * Japanese-friendly excerpt function
 * 日本語対応の抜粋関数（文字数制限）
 */
function vtuber_get_excerpt($content, $length = 50) {
    // HTMLタグを除去
    $content = strip_tags($content);
    // ショートコードを除去
    $content = strip_shortcodes($content);
    // 改行や余分な空白を除去
    $content = preg_replace('/\s+/', ' ', $content);
    $content = trim($content);
    
    // 文字数制限
    if (mb_strlen($content) > $length) {
        $content = mb_substr($content, 0, $length) . '…';
    }
    
    return $content;
}

/**
 * YouTube Data APIで動画情報を取得
 */
function get_youtube_video_info($url) {
    if (empty($url)) {
        return false;
    }
    
    // YouTube動画IDを抽出
    $video_id = extract_youtube_video_id($url);
    if (!$video_id) {
        return false;
    }
    
    // APIキーを取得
    $api_key = get_theme_mod('youtube_api_key');
    if (empty($api_key)) {
        return false;
    }
    
    // キャッシュキーを生成
    $cache_key = 'youtube_data_api_' . $video_id;
    $cached_info = get_transient($cache_key);
    
    if ($cached_info !== false) {
        return $cached_info;
    }
    
    // YouTube Data API v3を呼び出し
    $api_url = 'https://www.googleapis.com/youtube/v3/videos?' . http_build_query(array(
        'id' => $video_id,
        'part' => 'snippet',
        'key' => $api_key,
        'fields' => 'items(snippet(title,description,channelTitle,thumbnails))'
    ));
    
    $response = wp_remote_get($api_url, array(
        'timeout' => 15,
        'user-agent' => 'WordPress/' . get_bloginfo('version'),
        'headers' => array(
            'Accept' => 'application/json',
        ),
    ));
    
    if (is_wp_error($response)) {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('YouTube Data API Error: ' . $response->get_error_message());
        }
        return false;
    }
    
    $response_code = wp_remote_retrieve_response_code($response);
    if ($response_code !== 200) {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('YouTube Data API HTTP Error: ' . $response_code);
        }
        return false;
    }
    
    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);
    
    // デバッグ: YouTube Data APIのレスポンスをログに記録（開発時のみ）
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('YouTube Data API Response: ' . $body);
    }
    
    if (!$data || !isset($data['items']) || empty($data['items'])) {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('YouTube Data API Parse Error: ' . print_r($data, true));
        }
        return false;
    }
    
    $video_data = $data['items'][0]['snippet'];
    
    // タイトルのUnicodeとHTMLエンティティをデコード
    $title = decode_youtube_title($video_data['title']);
    $channel_title = isset($video_data['channelTitle']) ? decode_youtube_title($video_data['channelTitle']) : '';
    
    // サムネイル画像のURLを取得（高解像度優先）
    $thumbnail_url = '';
    $thumbnail_medium_url = '';
    
    if (isset($video_data['thumbnails'])) {
        $thumbnails = $video_data['thumbnails'];
        
        // 高解像度サムネイル
        if (isset($thumbnails['maxres']['url'])) {
            $thumbnail_url = $thumbnails['maxres']['url'];
        } elseif (isset($thumbnails['high']['url'])) {
            $thumbnail_url = $thumbnails['high']['url'];
        } elseif (isset($thumbnails['medium']['url'])) {
            $thumbnail_url = $thumbnails['medium']['url'];
        }
        
        // 中解像度サムネイル
        if (isset($thumbnails['medium']['url'])) {
            $thumbnail_medium_url = $thumbnails['medium']['url'];
        } elseif (isset($thumbnails['default']['url'])) {
            $thumbnail_medium_url = $thumbnails['default']['url'];
        }
    }
    
    // フォールバック用のサムネイル
    if (empty($thumbnail_url)) {
        $thumbnail_url = 'https://img.youtube.com/vi/' . $video_id . '/maxresdefault.jpg';
    }
    if (empty($thumbnail_medium_url)) {
        $thumbnail_medium_url = 'https://img.youtube.com/vi/' . $video_id . '/hqdefault.jpg';
    }
    
    $video_info = array(
        'title' => sanitize_text_field($title),
        'thumbnail' => esc_url_raw($thumbnail_url),
        'thumbnail_medium' => esc_url_raw($thumbnail_medium_url),
        'channel_title' => sanitize_text_field($channel_title),
        'video_id' => $video_id,
    );
    
    // キャッシュに24時間保存
    set_transient($cache_key, $video_info, 24 * HOUR_IN_SECONDS);
    
    return $video_info;
}

/**
 * YouTube URLから動画IDを抽出
 */
function extract_youtube_video_id($url) {
    $pattern = '/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/';
    preg_match($pattern, $url, $matches);
    return isset($matches[1]) ? $matches[1] : false;
}

/**
 * AJAX: YouTube Data APIで動画情報を取得
 */
function ajax_get_video_info() {
    // セキュリティチェック
    if (!check_ajax_referer('video_info_nonce', 'nonce', false)) {
        wp_send_json_error(array(
            'message' => 'セキュリティチェックに失敗しました。',
            'debug' => 'Invalid nonce'
        ));
        return;
    }
    
    if (!current_user_can('customize')) {
        wp_send_json_error(array(
            'message' => '権限がありません。',
            'debug' => 'No customize capability'
        ));
        return;
    }
    
    $url = isset($_POST['url']) ? sanitize_url($_POST['url']) : '';
    
    if (empty($url)) {
        wp_send_json_error(array(
            'message' => 'URLが指定されていません。',
            'debug' => 'Empty URL parameter'
        ));
        return;
    }
    
    // YouTube URLかチェック
    if (!preg_match('/(?:youtube\.com|youtu\.be)/', $url)) {
        wp_send_json_error(array(
            'message' => 'YouTube URLではありません。',
            'debug' => 'URL: ' . $url,
            'url' => $url
        ));
        return;
    }
    
    // APIキーの存在チェック
    $api_key = get_theme_mod('youtube_api_key');
    if (empty($api_key)) {
        wp_send_json_error(array(
            'message' => 'YouTube Data APIキーが設定されていません。',
            'debug' => 'API key not configured',
            'setup_url' => admin_url('customize.php?autofocus[section]=videos_section')
        ));
        return;
    }
    
    // 動画情報を取得
    $video_info = get_youtube_video_info($url);
    
    if ($video_info && !empty($video_info['title'])) {
        wp_send_json_success(array_merge($video_info, array(
            'debug' => 'Successfully retrieved video info via YouTube Data API',
            'original_url' => $url
        )));
    } else {
        wp_send_json_error(array(
            'message' => '動画情報を取得できませんでした。APIキーが正しいか、動画が公開されているか確認してください。',
            'debug' => 'get_youtube_video_info returned: ' . print_r($video_info, true),
            'url' => $url,
            'api_key_configured' => !empty($api_key)
        ));
    }
}
add_action('wp_ajax_get_video_info', 'ajax_get_video_info');

/**
 * カスタマイザー用JavaScript
 */
function enqueue_customizer_scripts() {
    // jQueryと依存関係を確実に読み込み
    wp_enqueue_script('jquery');
    wp_enqueue_script('customize-controls');
    
    wp_enqueue_script(
        'vtuber-customizer',
        get_template_directory_uri() . '/js/customizer.js',
        array('jquery', 'customize-controls'),
        filemtime(get_template_directory() . '/js/customizer.js'),
        true
    );
    
    wp_localize_script('vtuber-customizer', 'vtuberAjax', array(
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('video_info_nonce'),
        'debug' => defined('WP_DEBUG') && WP_DEBUG,
    ));
}
add_action('customize_controls_enqueue_scripts', 'enqueue_customizer_scripts');

/**
 * Unicode対応の文字列処理
 * YouTube APIから返されるタイトルの文字化けを解決
 */
function decode_youtube_title($title) {
    if (empty($title)) {
        return '';
    }
    
    // Unicodeエスケープをデコード
    $title = preg_replace_callback('/\\\\u([0-9a-fA-F]{4})/', function($match) {
        return mb_convert_encoding(pack('H*', $match[1]), 'UTF-8', 'UCS-2BE');
    }, $title);
    
    // HTMLエンティティをデコード
    $title = html_entity_decode($title, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    
    // 特殊な文字の処理
    $title = str_replace(array('&amp;', '&lt;', '&gt;', '&quot;', '&#039;'), array('&', '<', '>', '"', "'"), $title);
    
    // 余分な空白を削除
    $title = trim($title);
    
    return $title;
}

/**
 * Render achievements table (Legacy function - now redirects to yearly grouped)
 * 実績テーブルを出力する関数（レガシー - 年別グループ表示にリダイレクト）
 * 
 * @param array $achievements 実績データの配列
 * @param string $default_icon デフォルトアイコン
 * @param string $no_data_message データがない場合のメッセージ
 */
function render_achievements_table($achievements, $default_icon = '📺', $no_data_message = 'データがありません。') {
    // 既存の関数呼び出しを年別グループ表示にリダイレクト
    render_yearly_grouped_achievements($achievements, $default_icon, $no_data_message, '実績名');
}

/**
 * Render achievements table header
 * 実績テーブルのヘッダーを出力する共通関数
 * 
 * @param string $title_column タイトルカラムの見出し
 */
function render_achievements_table_header($title_column = '実績名') {
    echo '<thead>';
    echo '<tr>';
    echo '<th class="icon-col" scope="col" aria-label="種別"><span class="sr-only">種別</span></th>';
    echo '<th class="date-col" scope="col">時期</th>';
    echo '<th class="title-col" scope="col">' . esc_html($title_column) . '</th>';
    echo '<th class="description-col" scope="col">詳細</th>';
    echo '</tr>';
    echo '</thead>';
}

/**
 * Render achievements grouped by year
 * 実績データを年別にグループ化して表示する関数
 * 
 * @param array $achievements 実績データの配列
 * @param string $default_icon デフォルトアイコン
 * @param string $no_data_message データがない場合のメッセージ
 * @param string $title_column タイトルカラムの見出し
 */
function render_yearly_grouped_achievements($achievements, $default_icon = '📺', $no_data_message = 'データがありません。', $title_column = '実績名') {
    if (empty($achievements) || !is_array($achievements)) {
        echo '<div class="yearly-achievements-container">';
        echo '<div class="no-data-message">' . esc_html($no_data_message) . '</div>';
        echo '</div>';
        return;
    }

    // 年別にグループ化
    $grouped_by_year = array();
    foreach ($achievements as $achievement) {
        if (!empty($achievement['title']) && !empty($achievement['date'])) {
            // 日付から年を抽出
            $year = extract_year_from_date($achievement['date']);
            if (!isset($grouped_by_year[$year])) {
                $grouped_by_year[$year] = array();
            }
            $grouped_by_year[$year][] = $achievement;
        }
    }

    // 年順でソート（新しい年が上に）
    krsort($grouped_by_year);

    // 各年のデータ内で日付順ソート（参照を使わずに処理）
    foreach ($grouped_by_year as $year => $year_achievements) {
        usort($year_achievements, function($a, $b) {
            $dateA = isset($a['date']) ? $a['date'] : '';
            $dateB = isset($b['date']) ? $b['date'] : '';
            return strcmp($dateB, $dateA);
        });
        // ソート後の配列を再代入
        $grouped_by_year[$year] = $year_achievements;
    }

    echo '<div class="yearly-achievements-container">';
    
    foreach ($grouped_by_year as $year => $year_achievements) {
        echo '<div class="yearly-accordion">';
        echo '<div class="yearly-accordion-header" role="button" tabindex="0" aria-expanded="false">';
        echo '<h3 class="yearly-title">';
        echo '<span class="year">' . esc_html($year) . '年</span>';
        echo '</h3>';
        echo '<i class="fas fa-chevron-down accordion-icon" aria-hidden="true"></i>';
        echo '</div>';
        
        echo '<div class="yearly-accordion-content" style="display: none;">';
        echo '<div class="achievements-table-container">';
        echo '<table class="achievements-table" role="table" aria-label="' . esc_attr($year) . '年の' . esc_attr($title_column) . '一覧">';
        
        // テーブルヘッダー
        render_achievements_table_header($title_column);
        
        echo '<tbody>';
        foreach ($year_achievements as $achievement) {
            echo '<tr class="achievement-row">';
            echo '<td class="achievement-icon" role="gridcell">';
            echo '<span aria-label="' . esc_attr($achievement['title']) . 'の種別">';
            echo isset($achievement['icon']) ? esc_html($achievement['icon']) : esc_html($default_icon);
            echo '</span>';
            echo '</td>';
            echo '<td class="achievement-date" role="gridcell">';
            echo '<time>' . esc_html(isset($achievement['date']) ? $achievement['date'] : '') . '</time>';
            echo '</td>';
            echo '<td class="achievement-title" role="gridcell">';
            echo esc_html($achievement['title']);
            echo '</td>';
            echo '<td class="achievement-description" role="gridcell">';
            echo esc_html(isset($achievement['desc']) ? $achievement['desc'] : '');
            echo '</td>';
            echo '</tr>';
        }
        echo '</tbody>';
        echo '</table>';
        echo '</div>';
        echo '</div>';
        echo '</div>';
    }
    
    echo '</div>';
}

/**
 * Extract year from date string - Enhanced version with diagnostics
 * 日付文字列から年を抽出する関数（診断機能付き強化版）
 * 
 * @param string $date_string 日付文字列
 * @return string 年（4桁）
 */
function extract_year_from_date($date_string) {
    if (empty($date_string)) {
        return date('Y'); // 現在の年をフォールバック
    }
    
    // 文字列をトリムして余分な空白を除去
    $date_string = trim($date_string);
    
    // 様々な日付形式に対応（優先順位順）
    $patterns = array(
        '/^(\d{4})\.\d{1,2}$/' => 'YYYY.MM',                    // 2024.11
        '/^(\d{4})\.\d{1,2}\.\d{1,2}$/' => 'YYYY.MM.DD',        // 2024.11.01
        '/^(\d{4})-\d{1,2}-\d{1,2}$/' => 'YYYY-MM-DD',          // 2024-11-01
        '/^(\d{4})\/\d{1,2}\/\d{1,2}$/' => 'YYYY/MM/DD',        // 2024/11/01
        '/^(\d{4})年\d{1,2}月\d{1,2}日$/' => 'YYYY年MM月DD日',   // 2024年11月01日
        '/^(\d{4})年\d{1,2}月$/' => 'YYYY年MM月',               // 2024年11月
        '/^(\d{4})年$/' => 'YYYY年',                           // 2024年
        '/^(\d{4})$/' => 'YYYY',                               // 2024
    );
    
    foreach ($patterns as $pattern => $format_name) {
        if (preg_match($pattern, $date_string, $matches)) {
            $year = intval($matches[1]);
            // 妥当な年の範囲チェック（1900-2099）
            if ($year >= 1900 && $year <= 2099) {
                return strval($year);
            }
        }
    }
    
    // フォールバック：現在の年を返す
    $current_year = date('Y');
    return $current_year;
}

/**
 * AVIF Image Support and Fallback Functions
 * Provides automatic fallback from AVIF to PNG for unsupported browsers
 * Version 2.0.1: パフォーマンス向上のためAVIF形式に変更、フォールバック機能追加
 */

/**
 * Get theme image with AVIF fallback
 * Automatically serves AVIF or PNG based on browser support
 * 
 * @param string $image_name The base image name (without extension)
 * @param string $alt_text Alternative text for the image
 * @param string $classes CSS classes to apply
 * @param array $attributes Additional HTML attributes
 * @return string HTML picture element with AVIF and PNG sources
 */
function get_theme_image_with_fallback($image_name, $alt_text = '', $classes = '', $attributes = array()) {
    $base_url = get_template_directory_uri() . '/images/';
    $avif_url = $base_url . $image_name . '.avif';
    $png_url = $base_url . $image_name . '.png';
    
    // Build attributes string
    $attr_string = '';
    if (!empty($classes)) {
        $attr_string .= ' class="' . esc_attr($classes) . '"';
    }
    
    foreach ($attributes as $key => $value) {
        $attr_string .= ' ' . esc_attr($key) . '="' . esc_attr($value) . '"';
    }
    
    // Return picture element with AVIF and PNG sources
    return sprintf(
        '<picture>
            <source srcset="%s" type="image/avif">
            <img src="%s" alt="%s"%s loading="lazy">
        </picture>',
        esc_url($avif_url),
        esc_url($png_url),
        esc_attr($alt_text),
        $attr_string
    );
}

/**
 * Get theme image URL with fallback
 * Returns AVIF URL with client-side fallback detection
 * 
 * @param string $image_name The base image name (without extension)
 * @return string AVIF image URL
 */
function get_theme_image_url($image_name) {
    return get_template_directory_uri() . '/images/' . $image_name . '.avif';
}

/**
 * Get theme image fallback URL
 * Returns PNG fallback URL
 * 
 * @param string $image_name The base image name (without extension)  
 * @return string PNG image URL
 */
function get_theme_image_fallback_url($image_name) {
    return get_template_directory_uri() . '/images/' . $image_name . '.png';
}

/**
 * Enqueue AVIF detection script
 * Adds client-side AVIF support detection with enhanced fallback
 */
function enqueue_avif_detection_script() {
    wp_add_inline_script('vtuber-theme-main', '
        // Enhanced AVIF Support Detection and Image Fallback
        (function() {
            function supportsAVIF() {
                return new Promise((resolve) => {
                    const avif = new Image();
                    avif.onload = () => resolve(avif.height === 1);
                    avif.onerror = () => resolve(false);
                    avif.src = "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=";
                });
            }

            function applyImageFallback() {
                // Handle standard img elements with AVIF sources
                const avifImages = document.querySelectorAll("img[src$=\'.avif\']");
                avifImages.forEach(img => {
                    img.src = img.src.replace(/\.avif$/, ".png");
                    if (img.srcset) {
                        img.srcset = img.srcset.replace(/\.avif/g, ".png");
                    }
                });

                // Handle picture elements - remove AVIF sources
                const avifSources = document.querySelectorAll("source[type=\'image/avif\']");
                avifSources.forEach(source => {
                    source.remove();
                });

                // Handle CSS background images (if any)
                const elementsWithBgImages = document.querySelectorAll("[style*=\'.avif\']");
                elementsWithBgImages.forEach(el => {
                    const style = el.getAttribute("style");
                    if (style) {
                        el.setAttribute("style", style.replace(/\.avif/g, ".png"));
                    }
                });
            }

            // Quick browser-based detection first
            const isOlderBrowser = !window.createImageBitmap || 
                                   /Android\s[1-6]/.test(navigator.userAgent) ||
                                   /iPhone\sOS\s(1[0-3]|[1-9])_/.test(navigator.userAgent);

            if (isOlderBrowser) {
                document.body.classList.add("no-avif");
                document.addEventListener("DOMContentLoaded", applyImageFallback);
            } else {
                // More thorough AVIF support detection
                supportsAVIF().then((supported) => {
                    if (!supported) {
                        document.body.classList.add("no-avif");
                        applyImageFallback();
                    }
                }).catch(() => {
                    // Fallback if detection fails
                    document.body.classList.add("no-avif");
                    applyImageFallback();
                });
            }
        })();
    ');
}
add_action('wp_enqueue_scripts', 'enqueue_avif_detection_script');

/**
 * Smart image output with automatic AVIF/PNG fallback
 * This function provides a simple way to output images with fallback support
 * 
 * @param string $image_name The base image name (without extension)
 * @param string $alt_text Alt text for the image
 * @param string $classes CSS classes to apply
 * @param array $attributes Additional HTML attributes
 * @param bool $use_picture_element Whether to use picture element (recommended)
 * @return void Echoes the HTML directly
 */
function the_theme_image($image_name, $alt_text = '', $classes = '', $attributes = array(), $use_picture_element = true) {
    if ($use_picture_element) {
        echo get_theme_image_with_fallback($image_name, $alt_text, $classes, $attributes);
    } else {
        // Fallback to simple img with JavaScript detection
        $png_url = get_template_directory_uri() . '/images/' . $image_name . '.png';
        $avif_url = get_template_directory_uri() . '/images/' . $image_name . '.avif';
        
        $attr_string = '';
        if (!empty($classes)) {
            $attr_string .= ' class="' . esc_attr($classes) . '"';
        }
        
        foreach ($attributes as $key => $value) {
            $attr_string .= ' ' . esc_attr($key) . '="' . esc_attr($value) . '"';
        }
        
        printf(
            '<img src="%s" data-avif-src="%s" alt="%s"%s loading="lazy">',
            esc_url($png_url),
            esc_url($avif_url),
            esc_attr($alt_text),
            $attr_string
        );
    }
}

/**
 * Check if browser supports AVIF format
 * Server-side basic detection based on User-Agent
 * 
 * @return bool True if likely to support AVIF
 */
function browser_supports_avif() {
    if (!isset($_SERVER['HTTP_USER_AGENT'])) {
        return false;
    }
    
    $user_agent = $_SERVER['HTTP_USER_AGENT'];
    
    // Known browsers with AVIF support
    if (preg_match('/Chrome\/([0-9]+)/', $user_agent, $matches)) {
        return intval($matches[1]) >= 85; // Chrome 85+
    }
    
    if (preg_match('/Firefox\/([0-9]+)/', $user_agent, $matches)) {
        return intval($matches[1]) >= 93; // Firefox 93+
    }
    
    if (preg_match('/Safari\/([0-9]+)/', $user_agent, $matches) && strpos($user_agent, 'Chrome') === false) {
        // Safari support started in version 16 (iOS 16, macOS Ventura)
        return preg_match('/Version\/1[6-9]\./', $user_agent);
    }
    
    // Default to client-side detection
    return false;
}

/**
 * Generate responsive image sizes for AVIF/PNG images
 * 
 * @param string $image_name Base image name
 * @param array $sizes Array of sizes like ['320w', '640w', '1024w']
 * @return array Array with AVIF and PNG srcset strings
 */
function get_responsive_image_srcset($image_name, $sizes = array()) {
    if (empty($sizes)) {
        $sizes = ['320w', '640w', '1024w'];
    }
    
    $base_url = get_template_directory_uri() . '/images/';
    $avif_srcset = array();
    $png_srcset = array();
    
    foreach ($sizes as $size) {
        $width = str_replace('w', '', $size);
        $avif_srcset[] = $base_url . $image_name . '-' . $width . 'w.avif ' . $size;
        $png_srcset[] = $base_url . $image_name . '-' . $width . 'w.png ' . $width . 'w';
    }
    
    return array(
        'avif' => implode(', ', $avif_srcset),
        'png' => implode(', ', $png_srcset)
    );
}