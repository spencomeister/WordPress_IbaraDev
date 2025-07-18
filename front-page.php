<?php
/**
 * Front Page Template
 * IbaraDev VTuber Landing Page v2.0.0
 * 
 * @package VTuberTheme
 * @version 2.0.0
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
                    <p class="subtitle"><?php echo esc_html(get_theme_mod('vtuber_subtitle', 'VTuber・配信者として活動中')); ?></p>
                    <p class="description"><?php echo esc_html(get_theme_mod('vtuber_description', 'ようこそ私の世界へ！ゲームが大好きで、視聴者の皆さんとの交流を楽しんでいるVTuberです。楽しくて居心地の良い環境作りを心がけています。')); ?></p>
                    
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
                        <picture>
                            <source srcset="<?php echo esc_url(get_template_directory_uri() . '/images/ibaradevilroze-keyvisual-trans.avif'); ?>" type="image/avif">
                            <img src="<?php echo esc_url(get_template_directory_uri() . '/images/ibaradevilroze-keyvisual-trans.png'); ?>" 
                                 alt="<?php echo esc_attr(get_theme_mod('vtuber_name', 'IbaraDevilRoze')); ?>" 
                                 loading="lazy"
                                 width="600"
                                 height="auto">
                        </picture>
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
                    <?php 
                    $about_image = get_theme_mod('about_image', 'about-icon-trans.avif');
                    $image_name = pathinfo($about_image, PATHINFO_FILENAME);
                    ?>
                    <picture>
                        <source srcset="<?php echo esc_url(get_template_directory_uri() . '/images/' . $image_name . '.avif'); ?>" type="image/avif">
                        <img src="<?php echo esc_url(get_template_directory_uri() . '/images/' . $image_name . '.png'); ?>" 
                             alt="<?php echo esc_attr(get_theme_mod('profile_name', 'IbaraDevilRoze')); ?>"
                             loading="lazy"
                             width="280"
                             height="280">
                    </picture>
                </div>
                <div class="about-profile">
                    <table class="profile-table">
                        <tbody>
                            <tr>
                                <td class="profile-label">名前</td>
                                <td class="profile-value"><?php echo esc_html(get_theme_mod('profile_name', 'IbaraDevilRoze')); ?></td>
                            </tr>
                            <tr>
                                <td class="profile-label">年齢</td>
                                <td class="profile-value"><?php echo esc_html(get_theme_mod('profile_age', '？？歳')); ?></td>
                            </tr>
                            <tr>
                                <td class="profile-label">誕生日</td>
                                <td class="profile-value"><?php echo esc_html(get_theme_mod('profile_birthday', '？月？日')); ?></td>
                            </tr>
                            <tr>
                                <td class="profile-label">身長</td>
                                <td class="profile-value"><?php echo esc_html(get_theme_mod('profile_height', '？？？cm')); ?></td>
                            </tr>
                            <tr>
                                <td class="profile-label">好きな色</td>
                                <td class="profile-value"><?php echo esc_html(get_theme_mod('profile_favorite_color', '紫')); ?></td>
                            </tr>
                            <tr>
                                <td class="profile-label">好きな食べ物</td>
                                <td class="profile-value"><?php echo esc_html(get_theme_mod('profile_favorite_food', 'パンケーキ')); ?></td>
                            </tr>
                            <tr>
                                <td class="profile-label">趣味</td>
                                <td class="profile-value"><?php echo esc_html(get_theme_mod('profile_hobby', 'ゲーム、お絵描き')); ?></td>
                            </tr>
                            <tr>
                                <td class="profile-label">特技</td>
                                <td class="profile-value"><?php echo esc_html(get_theme_mod('profile_skill', 'ゲーム実況、歌')); ?></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>

    <!-- Videos Section -->
    <section class="section" id="videos">
        <div class="container">
            <h2>おすすめ動画</h2>
            <div class="videos-grid">
                <?php
                // Video cards data - can be customized via WordPress Customizer
                $video_cards = array(
                    array(
                        'title' => get_theme_mod('video_1_title', '初配信アーカイブ'),
                        'description' => get_theme_mod('video_1_desc', '記念すべき初回配信のアーカイブです。緊張しながらも楽しく配信できました！'),
                        'url' => get_theme_mod('video_1_url', '#'),
                        'icon' => '🎬'
                    ),
                    array(
                        'title' => get_theme_mod('video_2_title', 'ゲーム実況ハイライト'),
                        'description' => get_theme_mod('video_2_desc', '人気ゲームの実況プレイのハイライトシーンをまとめました。'),
                        'url' => get_theme_mod('video_2_url', '#'),
                        'icon' => '🎮'
                    ),
                    array(
                        'title' => get_theme_mod('video_3_title', '歌ってみた動画'),
                        'description' => get_theme_mod('video_3_desc', 'リクエストいただいた楽曲を歌わせていただきました。'),
                        'url' => get_theme_mod('video_3_url', '#'),
                        'icon' => '🎵'
                    )
                );
                
                foreach ($video_cards as $index => $video): 
                    // 動画情報を取得（サムネイル用）
                    $video_info = null;
                    if (!empty($video['url']) && $video['url'] !== '#') {
                        $video_info = get_youtube_video_info($video['url']);
                    }
                ?>
                <div class="video-card">
                    <div class="video-thumbnail">
                        <?php if ($video_info && !empty($video_info['thumbnail_medium'])): ?>
                            <img src="<?php echo esc_url($video_info['thumbnail_medium']); ?>" 
                                 alt="<?php echo esc_attr($video['title']); ?>" 
                                 class="video-thumbnail-img"
                                 loading="lazy">
                        <?php else: ?>
                            <span class="video-icon"><?php echo esc_html($video['icon']); ?></span>
                        <?php endif; ?>
                        <div class="play-button">
                            <i class="fas fa-play" aria-hidden="true"></i>
                        </div>
                    </div>
                    <div class="video-info">
                        <h3><?php echo esc_html($video['title']); ?></h3>
                        <?php if ($video_info && !empty($video_info['channel_title'])): ?>
                        <p class="video-channel"><?php echo esc_html($video_info['channel_title']); ?></p>
                        <?php endif; ?>
                        <p><?php echo esc_html($video['description']); ?></p>
                        <?php if (!empty($video['url']) && $video['url'] !== '#'): ?>
                        <a href="<?php echo esc_url($video['url']); ?>" 
                           class="video-link" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           aria-label="<?php echo esc_attr($video['title']); ?>を視聴する">
                            <i class="fas fa-external-link-alt"></i> 視聴する
                        </a>
                        <?php endif; ?>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
            
            <!-- YouTube Channel Link -->
            <div class="videos-more" style="text-align: center; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--border-color);">
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
                    その他の動画はYouTubeチャンネルでご覧いただけます
                </p>
                <?php
                $youtube_url = get_theme_mod('youtube_url');
                if ($youtube_url): ?>
                <a href="<?php echo esc_url($youtube_url); ?>" 
                   class="btn btn-primary" 
                   target="_blank" 
                   rel="noopener noreferrer">
                    <i class="fab fa-youtube"></i> YouTubeチャンネルを見る
                </a>
                <?php else: ?>
                <a href="#" class="btn btn-secondary">
                    <i class="fab fa-youtube"></i> YouTubeチャンネルを見る
                </a>
                <?php endif; ?>
            </div>
        </div>
    </section>

    <!-- Achievements Section -->
    <section class="section" id="achievements">
        <div class="container">
            <h2>実績</h2>
            <div style="text-align: center; padding: 3rem 0;">
                <p style="color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 2rem;">
                    これまでの個人で行った活動実績と企業様との様々な案件実績をご覧いただけます！
                </p>
                <a href="<?php echo esc_url(home_url('/achievements/')); ?>" class="btn btn-primary">
                    <i class="fas fa-trophy"></i> 実績を見る
                </a>
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
                                続きを読む <i class="fas fa-arrow-right"></i>
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
                            続きを読む <i class="fas fa-arrow-right"></i>
                        </a>
                    </article>
                    <article class="news-card fade-in">
                        <div class="news-date">2024.07.10</div>
                        <h3 class="news-title">新しい配信スケジュール</h3>
                        <p class="news-excerpt">7月の配信スケジュールを更新しました…</p>
                        <a href="<?php echo home_url('/blog/'); ?>" class="read-more">
                            続きを読む <i class="fas fa-arrow-right"></i>
                        </a>
                    </article>
                    <article class="news-card fade-in">
                        <div class="news-date">2024.07.05</div>
                        <h3 class="news-title">ファンアート募集開始</h3>
                        <p class="news-excerpt">ファンアートの募集を開始しました…</p>
                        <a href="<?php echo home_url('/blog/'); ?>" class="read-more">
                            続きを読む <i class="fas fa-arrow-right"></i>
                        </a>
                    </article>
                    <?php
                }
                ?>
            </div>
            <div class="news-more">
                <a href="<?php echo home_url('/blog/'); ?>" class="btn btn-primary">
                    <i class="fas fa-newspaper"></i> すべてのニュースを見る
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
                        <span>送信</span>
                        <span class="sr-only">フォームを送信</span>
                    </button>
                </form>
            </div>
        </div>
    </section>
</main>

<?php get_footer(); ?>
