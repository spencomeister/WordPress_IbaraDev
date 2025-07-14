<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php wp_title('|', true, 'right'); ?><?php bloginfo('name'); ?></title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <?php wp_head(); ?>
</head>
<body <?php body_class('loading'); ?>>

<!-- Loading Screen -->
<div class="loading-screen" id="loading-screen">
    <div class="loading-logo">
        <img src="<?php echo get_template_directory_uri(); ?>/images/logo-black-trans.png" 
             alt="IbaraDevilRoze Logo" 
             class="loading-logo-image logo-black"
             loading="eager">
        <img src="<?php echo get_template_directory_uri(); ?>/images/logo-white-trans.png" 
             alt="IbaraDevilRoze Logo" 
             class="loading-logo-image logo-white"
             loading="eager">
        <p>Individual VTuber</p>
    </div>
    
    <div class="loading-container">
        <div class="loading-progress">
            <div class="progress-bar">
                <div class="progress-fill" id="progress-fill"></div>
            </div>
            <div class="loading-percentage" id="loading-percentage">0%</div>
            <div class="loading-text" id="loading-text">Initializing...</div>
        </div>
        
        <div class="loading-dots">
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
        </div>
    </div>
</div>

<!-- Header -->
<header id="main-header">
    <div class="container">
        <nav>
            <div class="logo">IbaraDevilRoze</div>
            <ul class="nav-links">
                <li><a href="#about">自己紹介</a></li>
                <li><a href="#achievements">個人実績</a></li>
                <li><a href="#business">案件実績</a></li>
                <li><a href="#videos">おすすめ動画</a></li>
                <li><a href="#contact">お問合せ</a></li>
            </ul>
            <button class="theme-toggle" id="theme-toggle" title="Toggle Dark Mode">
                <i class="fas fa-moon"></i>
            </button>
        </nav>
    </div>
</header>

<!-- Hero Section -->
<main>
    <section class="hero" id="hero">
        <div class="container">
            <div class="hero-content">
                <div class="hero-text">
                    <h1><?php echo get_theme_mod('vtuber_name', 'IbaraDevilRoze'); ?></h1>
                    <p class="subtitle"><?php echo get_theme_mod('vtuber_subtitle', 'Individual VTuber | Gaming & Chat Streams'); ?></p>
                    <p class="description"><?php echo get_theme_mod('vtuber_description', 'Welcome to my world! I\'m a passionate VTuber who loves gaming, chatting with viewers, and creating entertaining content. Join me on this exciting journey!'); ?></p>
                    
                    <div class="social-links">
                        <?php if (get_theme_mod('youtube_url')): ?>
                        <a href="<?php echo esc_url(get_theme_mod('youtube_url')); ?>" class="social-link" target="_blank" title="YouTube">
                            <i class="fab fa-youtube"></i>
                        </a>
                        <?php endif; ?>
                        
                        <?php if (get_theme_mod('twitter_url')): ?>
                        <a href="<?php echo esc_url(get_theme_mod('twitter_url')); ?>" class="social-link" target="_blank" title="Twitter">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <?php endif; ?>
                        
                        <?php if (get_theme_mod('discord_url')): ?>
                        <a href="<?php echo esc_url(get_theme_mod('discord_url')); ?>" class="social-link" target="_blank" title="Discord">
                            <i class="fab fa-discord"></i>
                        </a>
                        <?php endif; ?>
                        
                        <?php if (get_theme_mod('twitch_url')): ?>
                        <a href="<?php echo esc_url(get_theme_mod('twitch_url')); ?>" class="social-link" target="_blank" title="Twitch">
                            <i class="fab fa-twitch"></i>
                        </a>
                        <?php endif; ?>
                        
                        <?php if (get_theme_mod('niconico_url')): ?>
                        <a href="<?php echo esc_url(get_theme_mod('niconico_url')); ?>" class="social-link" target="_blank" title="Niconico">
                            <i class="fas fa-tv"></i>
                        </a>
                        <?php endif; ?>
                    </div>
                </div>
                
                <div class="hero-image">
                    <img src="<?php echo get_template_directory_uri(); ?>/images/ibaradevilroze-keyvisual-trans.png" 
                         alt="<?php echo get_theme_mod('vtuber_name', 'IbaraDevilRoze'); ?>" 
                         loading="lazy">
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section class="section" id="about">
        <div class="container">
            <h2>自己紹介</h2>
            <div class="about-content">
                <div class="about-image">
                    <img src="<?php echo get_template_directory_uri(); ?>/images/<?php echo get_theme_mod('about_image', 'about-icon-trans.png'); ?>" 
                         alt="About <?php echo get_theme_mod('vtuber_name', 'IbaraDevilRoze'); ?>" 
                         loading="lazy">
                </div>
                <div class="about-text">
                    <p><?php echo get_theme_mod('about_text_1', 'Hello! I\'m an individual VTuber who streams various games and loves interacting with my viewers. My content focuses on creating a fun and welcoming environment for everyone.'); ?></p>
                    <p><?php echo get_theme_mod('about_text_2', 'I enjoy playing a wide variety of games, from indie titles to popular AAA games. When I\'m not gaming, I love chatting with my community and sharing my thoughts on various topics.'); ?></p>
                    <p><?php echo get_theme_mod('about_text_3', 'My goal is to create entertaining content that brings joy to people\'s daily lives. Thank you for being part of this amazing journey!'); ?></p>
                </div>
            </div>
        </div>
    </section>

    <!-- Achievements Section -->
    <section class="section" id="achievements">
        <div class="container">
            <h2>個人実績</h2>
            <div class="achievements-table-container">
                <table class="achievements-table">
                    <thead>
                        <tr>
                            <th class="icon-col"></th>
                            <th class="date-col">年月</th>
                            <th class="title-col">実績</th>
                            <th class="description-col">説明</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="achievement-row fade-in">
                            <td class="achievement-icon">📺</td>
                            <td class="achievement-date"><?php echo get_theme_mod('achievement_1_date', '2023.06'); ?></td>
                            <td class="achievement-title"><?php echo get_theme_mod('achievement_1_title', '初配信'); ?></td>
                            <td class="achievement-description"><?php echo get_theme_mod('achievement_1_desc', '生まれて初めての配信で同時接続者数120人＆チャンネル登録300人達成しました！'); ?></td>
                        </tr>
                        <tr class="achievement-row fade-in">
                            <td class="achievement-icon">📺</td>
                            <td class="achievement-date"><?php echo get_theme_mod('achievement_2_date', '2023.09'); ?></td>
                            <td class="achievement-title"><?php echo get_theme_mod('achievement_2_title', '登録者数1000人達成<br />初 新衣装公開<br />メンバーシップ開設'); ?></td>
                            <td class="achievement-description"><?php echo get_theme_mod('achievement_2_desc', 'チャンネル登録者数1000人達成＆初新衣装公開し、メンバーシップの開設を行いました！'); ?></td>
                        </tr>
                        <tr class="achievement-row fade-in">
                            <td class="achievement-icon">👥</td>
                            <td class="achievement-date"><?php echo get_theme_mod('achievement_3_date', '2023.12'); ?></td>
                            <td class="achievement-title"><?php echo get_theme_mod('achievement_3_title', 'リスナー限定リアルイベント in 渋谷'); ?></td>
                            <td class="achievement-description"><?php echo get_theme_mod('achievement_3_desc', '初めてのリアルイベントを自身で計画し、開催することが出来ました！'); ?></td>
                        </tr>
                        <tr class="achievement-row fade-in">
                            <td class="achievement-icon">�</td>
                            <td class="achievement-date"><?php echo get_theme_mod('achievement_4_date', '2024.02'); ?></td>
                            <td class="achievement-title"><?php echo get_theme_mod('achievement_4_title', 'リ虎家コラボカフェ自主開催 in 秋葉原'); ?></td>
                            <td class="achievement-description"><?php echo get_theme_mod('achievement_4_desc', '同じママであるritora.さんのVTuberのみんなを集めてコラボカフェを自主開催しました！'); ?></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>

    <!-- Business Achievements Section -->
    <section class="section" id="business">
        <div class="container">
            <h2>案件実績</h2>
            <div class="achievements-table-container">
                <table class="achievements-table">
                    <thead>
                        <tr>
                            <th class="icon-col"></th>
                            <th class="date-col">年月</th>
                            <th class="title-col">案件名</th>
                            <th class="description-col">詳細</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="achievement-row fade-in">
                            <td class="achievement-icon">🎮</td>
                            <td class="achievement-date"><?php echo get_theme_mod('business_1_date', '2023.08'); ?></td>
                            <td class="achievement-title"><?php echo get_theme_mod('business_1_title', 'ゲームタイトルA プロモーション配信'); ?></td>
                            <td class="achievement-description"><?php echo get_theme_mod('business_1_desc', '新作ゲームのプロモーション配信を実施。視聴者数やエンゲージメント率が高く評価されました。'); ?></td>
                        </tr>
                        <tr class="achievement-row fade-in">
                            <td class="achievement-icon">🛍️</td>
                            <td class="achievement-date"><?php echo get_theme_mod('business_2_date', '2023.11'); ?></td>
                            <td class="achievement-title"><?php echo get_theme_mod('business_2_title', 'アパレルブランドB コラボ商品PR'); ?></td>
                            <td class="achievement-description"><?php echo get_theme_mod('business_2_desc', 'アパレルブランドとのコラボレーション商品のPR配信を行い、完売に貢献しました。'); ?></td>
                        </tr>
                        <tr class="achievement-row fade-in">
                            <td class="achievement-icon">🍔</td>
                            <td class="achievement-date"><?php echo get_theme_mod('business_3_date', '2024.01'); ?></td>
                            <td class="achievement-title"><?php echo get_theme_mod('business_3_title', '飲食チェーンC メニュー紹介'); ?></td>
                            <td class="achievement-description"><?php echo get_theme_mod('business_3_desc', '人気飲食チェーンの新メニュー紹介配信を実施。ターゲット層への効果的なリーチを実現しました。'); ?></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>

    <!-- Recommended Videos Section -->
    <section class="section" id="videos">
        <div class="container">
            <h2>おすすめ動画</h2>
            <div class="videos-grid">
                <div class="video-card fade-in">
                    <div class="video-thumbnail">
                        <i class="fas fa-play"></i>
                    </div>
                    <div class="video-info">
                        <h3><?php echo get_theme_mod('video_1_title', 'First Gaming Stream'); ?></h3>
                        <p><?php echo get_theme_mod('video_1_desc', 'My very first gaming stream where I introduced myself and played my favorite indie game. A perfect starting point for new viewers!'); ?></p>
                    </div>
                </div>
                
                <div class="video-card fade-in">
                    <div class="video-thumbnail">
                        <i class="fas fa-play"></i>
                    </div>
                    <div class="video-info">
                        <h3><?php echo get_theme_mod('video_2_title', 'Chat & Chill Session'); ?></h3>
                        <p><?php echo get_theme_mod('video_2_desc', 'A relaxing chat session where I talk about various topics and interact with my amazing community members.'); ?></p>
                    </div>
                </div>
                
                <div class="video-card fade-in">
                    <div class="video-thumbnail">
                        <i class="fas fa-play"></i>
                    </div>
                    <div class="video-info">
                        <h3><?php echo get_theme_mod('video_3_title', 'Special Collaboration'); ?></h3>
                        <p><?php echo get_theme_mod('video_3_desc', 'An exciting collaboration stream with fellow VTubers featuring fun games and lots of laughs.'); ?></p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section class="section" id="contact">
        <div class="container">
            <h2>お問合せ</h2>
            <div class="contact-content">
                <p>ご質問、コラボレーションのご提案、またはお気軽にご挨拶したい方は、ぜひお声がけください！</p>
                
                <form class="contact-form" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" method="post">
                    <input type="hidden" name="action" value="contact_form_submission">
                    <?php wp_nonce_field('contact_form_nonce', 'contact_nonce'); ?>
                    
                    <div class="form-group">
                        <label for="contact-name">お名前</label>
                        <input type="text" id="contact-name" name="contact_name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="contact-email">メールアドレス</label>
                        <input type="email" id="contact-email" name="contact_email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="contact-subject">件名</label>
                        <input type="text" id="contact-subject" name="contact_subject" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="contact-message">メッセージ</label>
                        <textarea id="contact-message" name="contact_message" rows="6" required></textarea>
                    </div>
                    
                    <button type="submit" class="submit-btn">送信</button>
                </form>
            </div>
        </div>
    </section>
</main>

<!-- Footer -->
<footer>
    <div class="container">
        <p>&copy; <?php echo date('Y'); ?> <?php echo get_theme_mod('vtuber_name', 'IbaraDevilRoze'); ?>. All rights reserved.</p>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
