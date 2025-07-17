<?php
/**
 * IbaraDevilRoze VTuber Landing Page Theme Functions
 * Modern White/Black + Purple Accent with Dark Mode
 * Version 2.1
 * 
 * @package VTuberTheme
 * @author IbaraDev
 * @since 2.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define theme constants
define('VTUBER_THEME_VERSION', '2.1');
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
        '実績' => home_url() . '/achievements/',
        'ニュース' => home_url() . '/blog/',
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
    ));
}
add_action('wp_enqueue_scripts', 'vtuber_scripts');

// Contact form handling
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
        wp_redirect(home_url('/?contact=error'));
        exit;
    }
    
    // Prepare email
    $to = get_option('admin_email');
    $email_subject = '[' . get_bloginfo('name') . '] ' . $subject;
    $email_message = "お名前: {$name}\n";
    $email_message .= "メールアドレス: {$email}\n\n";
    $email_message .= "メッセージ:\n{$message}";
    
    $headers = array(
        'Content-Type: text/plain; charset=UTF-8',
        'From: ' . get_bloginfo('name') . ' <' . get_option('admin_email') . '>',
        'Reply-To: ' . $name . ' <' . $email . '>'
    );
    
    // Send email
    $sent = wp_mail($to, $email_subject, $email_message, $headers);
    
    if ($sent) {
        wp_redirect(home_url('/?contact=success'));
    } else {
        wp_redirect(home_url('/?contact=error'));
    }
    exit;
}
add_action('admin_post_contact_form_submission', 'handle_contact_form_submission');
add_action('admin_post_nopriv_contact_form_submission', 'handle_contact_form_submission');

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
        'default' => 'ibaradevilroze-keyvisual-trans.png',
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
    
    // プロフィール情報の設定項目
    $profile_fields = array(
        'name' => array('label' => '名前', 'default' => 'IbaraDevilRoze'),
        'age' => array('label' => '年齢', 'default' => '？？歳'),
        'birthday' => array('label' => '誕生日', 'default' => '？月？日'),
        'height' => array('label' => '身長', 'default' => '？？？cm'),
        'favorite_color' => array('label' => '好きな色', 'default' => '紫'),
        'favorite_food' => array('label' => '好きな食べ物', 'default' => 'パンケーキ'),
        'hobby' => array('label' => '趣味', 'default' => 'ゲーム、お絵描き'),
        'skill' => array('label' => '特技', 'default' => 'ゲーム実況、歌')
    );
    
    foreach ($profile_fields as $key => $field) {
        $wp_customize->add_setting('profile_' . $key, array(
            'default' => $field['default'],
            'sanitize_callback' => 'sanitize_text_field',
            'transport' => 'refresh',
        ));
        $wp_customize->add_control('profile_' . $key, array(
            'label' => __($field['label'], 'vtuber-theme'),
            'section' => 'about_section',
            'type' => 'text',
            'description' => __($field['label'] . 'を入力してください', 'vtuber-theme'),
        ));
    }
    
    // 自己紹介画像
    $wp_customize->add_setting('about_image', array(
        'default' => 'about-icon-trans.png',
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

// Add contact form messages
function display_contact_messages() {
    if (isset($_GET['contact'])) {
        if ($_GET['contact'] === 'success') {
            echo '<div class="contact-message success">お問い合わせありがとうございます！近日中にお返事いたします。</div>';
        } elseif ($_GET['contact'] === 'error') {
            echo '<div class="contact-message error">申し訳ございません。メッセージの送信でエラーが発生しました。もう一度お試しください。</div>';
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
    wp_enqueue_script(
        'vtuber-customizer',
        get_template_directory_uri() . '/js/customizer.js',
        array('jquery', 'customize-controls'),
        '1.0.0',
        true
    );
    
    wp_localize_script('vtuber-customizer', 'vtuberAjax', array(
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('video_info_nonce'),
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
 * Render achievements table
 * 実績テーブルを出力する共通関数
 * 
 * @param array $achievements 実績データの配列
 * @param string $default_icon デフォルトアイコン
 * @param string $no_data_message データがない場合のメッセージ
 */
function render_achievements_table($achievements, $default_icon = '📺', $no_data_message = 'データがありません。') {
    if (!empty($achievements) && is_array($achievements)) {
        // Sort by date in descending order (newest first)
        usort($achievements, function($a, $b) {
            $dateA = isset($a['date']) ? $a['date'] : '';
            $dateB = isset($b['date']) ? $b['date'] : '';
            return strcmp($dateB, $dateA);
        });
        
        foreach ($achievements as $achievement) {
            if (!empty($achievement['title'])) {
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
        }
    } else {
        echo '<tr>';
        echo '<td colspan="4" class="no-data-message">';
        echo esc_html($no_data_message);
        echo '</td>';
        echo '</tr>';
    }
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