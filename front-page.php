<?php
/**
 * Front Page Template
 * IbaraDevilRoze VTuber Landing Page
 * 
 * @package VTuberTheme
 * @version 2.1
 */

get_header(); ?>

<!-- Main Content -->
<main id="main-content" role="main">
    <!-- Hero Section -->
    <section class="hero" id="hero">
        <div class="container">
            <div class="hero-content">
                <div class="hero-text">
                    <h1><?php echo esc_html(get_theme_mod('vtuber_name', 'IbaraDevilRoze')); ?></h1>
                    <p class="subtitle"><?php echo esc_html(get_theme_mod('vtuber_subtitle', 'Individual VTuber | Gaming & Chat Streams')); ?></p>
                    <p class="description"><?php echo esc_html(get_theme_mod('vtuber_description', 'Welcome to my world! I\'m a passionate VTuber who loves gaming, chatting with viewers, and creating entertaining content. Join me on this exciting journey!')); ?></p>
                    
                    <div class="social-links" role="list">
                        <?php
                        $social_links = array(
                            'youtube_url' => array('icon' => 'fab fa-youtube', 'title' => 'YouTube'),
                            'x_url' => array('icon' => 'x-svg', 'title' => 'X'),
                            'discord_url' => array('icon' => 'fab fa-discord', 'title' => 'Discord'),
                            'twitch_url' => array('icon' => 'fab fa-twitch', 'title' => 'Twitch'),
                            'booth_url' => array('icon' => 'fa fa-shopping-bag', 'title' => 'BOOTH')
                        );
                        
                        foreach ($social_links as $key => $social) {
                            $url = get_theme_mod($key);
                            if ($url) :
                        ?>
                        <a href="<?php echo esc_url($url); ?>" 
                           class="social-link" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           title="<?php echo esc_attr($social['title']); ?>"
                           role="listitem">
                            <?php if ($key === 'x_url') : ?>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            <?php else : ?>
                                <i class="<?php echo esc_attr($social['icon']); ?>" aria-hidden="true"></i>
                            <?php endif; ?>
                            <span class="sr-only"><?php echo esc_html($social['title']); ?></span>
                        </a>
                        <?php 
                            endif;
                        } 
                        ?>
                    </div>
                </div>
                
                <div class="hero-image">
                    <?php 
                    $hero_image = get_theme_mod('vtuber_hero_image');
                    if ($hero_image) : 
                    ?>
                        <img src="<?php echo esc_url($hero_image); ?>" 
                             alt="<?php echo esc_attr(get_theme_mod('vtuber_name', 'IbaraDevilRoze')); ?>" 
                             loading="lazy"
                             width="600"
                             height="auto">
                    <?php else : ?>
                        <img src="<?php echo esc_url(get_template_directory_uri() . '/images/ibaradevilroze-keyvisual-trans.png'); ?>" 
                             alt="<?php echo esc_attr(get_theme_mod('vtuber_name', 'IbaraDevilRoze')); ?>" 
                             loading="lazy"
                             width="600"
                             height="auto">
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section class="section" id="about">
        <div class="container">
            <h2>ABOUT</h2>
            <div class="about-content">
                <div class="about-image">
                    <img src="<?php echo esc_url(get_template_directory_uri() . '/images/about-icon-trans.png'); ?>" 
                         alt="<?php echo esc_attr(get_theme_mod('vtuber_name', 'IbaraDevilRoze')); ?>"
                         loading="lazy"
                         width="280"
                         height="280">
                </div>
                <div class="about-text">
                    <p><?php echo wp_kses_post(get_theme_mod('about_text_1', 'Hello! I\'m a VTuber who loves connecting with people through gaming and chatting. I started my journey as a content creator because I wanted to bring joy and entertainment to people\'s daily lives.')); ?></p>
                    <p><?php echo wp_kses_post(get_theme_mod('about_text_2', 'I enjoy playing a wide variety of games, from indie titles to popular AAA games. When I\'m not gaming, I love chatting with my community and sharing my thoughts on various topics.')); ?></p>
                    <p><?php echo wp_kses_post(get_theme_mod('about_text_3', 'My goal is to create entertaining content that brings joy to people\'s daily lives. Thank you for being part of this amazing journey!')); ?></p>
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
                        <?php
                        $achievements_data = get_theme_mod('achievements_data', '[]');
                        $achievements = json_decode($achievements_data, true);
                        
                        if (!empty($achievements)) {
                            foreach ($achievements as $index => $achievement) {
                                if (!empty($achievement['title']) || !empty($achievement['desc'])) {
                                    // Use custom icon if available, otherwise use personal default (📺 配信)
                                    $icon = !empty($achievement['icon']) ? $achievement['icon'] : '📺';
                                    ?>
                                    <tr class="achievement-row fade-in">
                                        <td class="achievement-icon"><?php echo $icon; ?></td>
                                        <td class="achievement-date"><?php echo esc_html($achievement['date']); ?></td>
                                        <td class="achievement-title"><?php echo esc_html($achievement['title']); ?></td>
                                        <td class="achievement-description"><?php echo nl2br(esc_html($achievement['desc'])); ?></td>
                                    </tr>
                                    <?php
                                }
                            }
                        } else {
                            // Default achievements if no custom data is set
                            ?>
                            <tr class="achievement-row fade-in">
                                <td class="achievement-icon">📺</td>
                                <td class="achievement-date">2023.06</td>
                                <td class="achievement-title">初配信</td>
                                <td class="achievement-description">生まれて初めての配信で同時接続者数120人＆チャンネル登録300人達成しました！</td>
                            </tr>
                            <tr class="achievement-row fade-in">
                                <td class="achievement-icon">📺</td>
                                <td class="achievement-date">2023.09</td>
                                <td class="achievement-title">登録者数1000人達成<br />初 新衣装公開<br />メンバーシップ開設</td>
                                <td class="achievement-description">チャンネル登録者数1000人達成＆初新衣装公開し、メンバーシップの開設を行いました！</td>
                            </tr>
                            <tr class="achievement-row fade-in">
                                <td class="achievement-icon">👥</td>
                                <td class="achievement-date">2023.12</td>
                                <td class="achievement-title">リスナー限定リアルイベント in 渋谷</td>
                                <td class="achievement-description">初めてのリアルイベントを自身で計画し、開催することが出来ました！</td>
                            </tr>
                            <tr class="achievement-row fade-in">
                                <td class="achievement-icon">⚔️</td>
                                <td class="achievement-date">2024.02</td>
                                <td class="achievement-title">リ虎家コラボカフェ自主開催 in 秋葉原</td>
                                <td class="achievement-description">同じママであるritora.さんのVTuberのみんなを集めてコラボカフェを自主開催しました！</td>
                            </tr>
                            <?php
                        }
                        ?>
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
                        <?php
                        $business_data = get_theme_mod('business_data', '[]');
                        $business_achievements = json_decode($business_data, true);
                        
                        if (!empty($business_achievements)) {
                            foreach ($business_achievements as $index => $achievement) {
                                if (!empty($achievement['title']) || !empty($achievement['desc'])) {
                                    // Use custom icon if available, otherwise use business default (🎮 ゲーム)
                                    $icon = !empty($achievement['icon']) ? $achievement['icon'] : '🎮';
                                    ?>
                                    <tr class="achievement-row fade-in">
                                        <td class="achievement-icon"><?php echo $icon; ?></td>
                                        <td class="achievement-date"><?php echo esc_html($achievement['date']); ?></td>
                                        <td class="achievement-title"><?php echo esc_html($achievement['title']); ?></td>
                                        <td class="achievement-description"><?php echo nl2br(esc_html($achievement['desc'])); ?></td>
                                    </tr>
                                    <?php
                                }
                            }
                        } else {
                            // Default business achievements if no custom data is set
                            ?>
                            <tr class="achievement-row fade-in">
                                <td class="achievement-icon">🎮</td>
                                <td class="achievement-date">2023.08</td>
                                <td class="achievement-title">ゲームタイトルA プロモーション配信</td>
                                <td class="achievement-description">新作ゲームのプロモーション配信を実施。視聴者数やエンゲージメント率が高く評価されました。</td>
                            </tr>
                            <tr class="achievement-row fade-in">
                                <td class="achievement-icon">🛍️</td>
                                <td class="achievement-date">2023.11</td>
                                <td class="achievement-title">アパレルブランドB コラボ商品PR</td>
                                <td class="achievement-description">アパレルブランドとのコラボレーション商品のPR配信を行い、完売に貢献しました。</td>
                            </tr>
                            <tr class="achievement-row fade-in">
                                <td class="achievement-icon">🍔</td>
                                <td class="achievement-date">2024.01</td>
                                <td class="achievement-title">飲食チェーンC メニュー紹介</td>
                                <td class="achievement-description">人気飲食チェーンの新メニュー紹介配信を実施。ターゲット層への効果的なリーチを実現しました。</td>
                            </tr>
                            <?php
                        }
                        ?>
                    </tbody>
                </table>
            </div>
        </div>
    </section>

    <!-- News Section -->
    <section class="section" id="news">
        <div class="container">
            <h2>NEWS</h2>
            <div class="news-grid">
                <?php
                $recent_posts = get_posts(array(
                    'posts_per_page' => 3,
                    'post_status' => 'publish'
                ));
                
                if (!empty($recent_posts)) {
                    foreach ($recent_posts as $post) {
                        setup_postdata($post);
                        $post_date = get_the_date('Y.m.d');
                        $post_title = get_the_title();
                        $post_excerpt = vtuber_get_excerpt(get_the_content(), 50);
                        $post_link = get_permalink();
                        ?>
                        <article class="news-card fade-in">
                            <div class="news-date"><?php echo $post_date; ?></div>
                            <h3 class="news-title"><?php echo $post_title; ?></h3>
                            <p class="news-excerpt"><?php echo $post_excerpt; ?></p>
                            <a href="<?php echo $post_link; ?>" class="read-more">
                                Read More <i class="fas fa-arrow-right"></i>
                            </a>
                        </article>
                        <?php
                    }
                    wp_reset_postdata();
                } else {
                    // Default news if no posts exist
                    ?>
                    <article class="news-card fade-in">
                    <article class="news-card fade-in">
                        <div class="news-date">2024.07.14</div>
                        <h3 class="news-title">ウェブサイトがオープンしました！</h3>
                        <p class="news-excerpt">新しいウェブサイトがオープンしました。最新情報をお届けします…</p>
                        <a href="<?php echo home_url('/blog/'); ?>" class="read-more">
                            Read More <i class="fas fa-arrow-right"></i>
                        </a>
                    </article>
                    <article class="news-card fade-in">
                        <div class="news-date">2024.07.10</div>
                        <h3 class="news-title">新しい配信スケジュール</h3>
                        <p class="news-excerpt">7月の配信スケジュールを更新しました…</p>
                        <a href="<?php echo home_url('/blog/'); ?>" class="read-more">
                            Read More <i class="fas fa-arrow-right"></i>
                        </a>
                    </article>
                    <article class="news-card fade-in">
                        <div class="news-date">2024.07.05</div>
                        <h3 class="news-title">ファンアート募集開始</h3>
                        <p class="news-excerpt">ファンアートの募集を開始しました…</p>
                        <a href="<?php echo home_url('/blog/'); ?>" class="read-more">
                            Read More <i class="fas fa-arrow-right"></i>
                        </a>
                    </article>
                    <?php
                }
                ?>
            </div>
            <div class="news-more">
                <a href="<?php echo home_url('/blog/'); ?>" class="btn btn-primary">
                    <i class="fas fa-newspaper"></i> View All News
                </a>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section class="section" id="contact">
        <div class="container">
            <h2>CONTACT</h2>
            
            <?php display_contact_messages(); ?>
            
            <div class="contact-content">
                <div class="contact-info">
                    <h3>Get in Touch</h3>
                    <p>お仕事のご依頼やコラボレーションのご相談はこちらからお気軽にお問い合わせください。</p>
                </div>
                
                <form class="contact-form" 
                      method="POST" 
                      action="<?php echo esc_url(admin_url('admin-post.php')); ?>"
                      novalidate>
                    <input type="hidden" name="action" value="contact_form_submission">
                    <?php wp_nonce_field('contact_form_nonce', 'contact_nonce'); ?>
                    
                    <div class="form-group">
                        <label for="contact_name">お名前 *</label>
                        <input type="text" 
                               id="contact_name" 
                               name="contact_name" 
                               required 
                               aria-required="true"
                               autocomplete="name">
                    </div>
                    
                    <div class="form-group">
                        <label for="contact_email">メールアドレス *</label>
                        <input type="email" 
                               id="contact_email" 
                               name="contact_email" 
                               required 
                               aria-required="true"
                               autocomplete="email">
                    </div>
                    
                    <div class="form-group">
                        <label for="contact_subject">件名 *</label>
                        <input type="text" 
                               id="contact_subject" 
                               name="contact_subject" 
                               required 
                               aria-required="true">
                    </div>
                    
                    <div class="form-group">
                        <label for="contact_message">メッセージ *</label>
                        <textarea id="contact_message" 
                                  name="contact_message" 
                                  rows="5" 
                                  required 
                                  aria-required="true"
                                  placeholder="お問い合わせ内容をご記入ください..."></textarea>
                    </div>
                    
                    <button type="submit" 
                            name="submit_contact" 
                            class="submit-btn">
                        <span>Send Message</span>
                        <span class="sr-only">フォームを送信</span>
                    </button>
                </form>
            </div>
        </div>
    </section>
</main>

<?php get_footer(); ?>
