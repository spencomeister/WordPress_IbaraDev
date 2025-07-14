<?php get_header(); ?>

<!-- Blog Archive -->
<main class="blog-main" role="main">
    <div class="container">
        <!-- Breadcrumb -->
        <nav class="breadcrumb" aria-label="パンくずリスト">
            <ol class="breadcrumb-list">
                <li><a href="<?php echo esc_url(home_url()); ?>">ホーム</a></li>
                <li aria-current="page">
                    <span class="breadcrumb-separator" aria-hidden="true"><i class="fas fa-chevron-right"></i></span>
                    <span><?php 
                        if (is_category()) {
                            echo 'カテゴリー: ' . esc_html(single_cat_title('', false));
                        } elseif (is_tag()) {
                            echo 'タグ: ' . esc_html(single_tag_title('', false));
                        } elseif (is_search()) {
                            echo '検索結果: ' . esc_html(get_search_query());
                        } elseif (is_date()) {
                            echo 'アーカイブ';
                        } else {
                            echo 'ブログ';
                        }
                    ?></span>
                </li>
            </ol>
        </nav>

        <!-- Page Header -->
        <header class="page-header">
            <h1><?php 
                if (is_category()) {
                    echo 'カテゴリー: ' . esc_html(single_cat_title('', false));
                } elseif (is_tag()) {
                    echo 'タグ: ' . esc_html(single_tag_title('', false));
                } elseif (is_search()) {
                    echo '検索結果';
                    if (get_search_query()) {
                        echo ' "' . esc_html(get_search_query()) . '"';
                    }
                } elseif (is_date()) {
                    if (is_year()) {
                        echo esc_html(get_the_date('Y年')) . 'のアーカイブ';
                    } elseif (is_month()) {
                        echo esc_html(get_the_date('Y年n月')) . 'のアーカイブ';
                    } else {
                        echo 'アーカイブ';
                    }
                } else {
                    echo 'ブログ';
                }
            ?></h1>
            <?php if (is_search()): ?>
                <p><?php echo get_search_query() ? '"' . esc_html(get_search_query()) . '" の検索結果' : '検索結果'; ?></p>
            <?php elseif (is_category()): ?>
                <?php $category_description = category_description(); ?>
                <?php if ($category_description): ?>
                    <p><?php echo wp_kses_post($category_description); ?></p>
                <?php endif; ?>
            <?php else: ?>
                <p>記事一覧</p>
            <?php endif; ?>
        </header>

        <!-- Articles List -->
        <section class="blog-list" aria-label="記事一覧">
            <?php if (have_posts()): ?>
                <?php while (have_posts()): the_post(); ?>
                <?php
                $categories = get_the_category();
                $category_name = !empty($categories) ? $categories[0]->name : 'お知らせ';
                ?>
                
                <article class="blog-list-item">
                    <time class="item-date" datetime="<?php echo esc_attr(get_the_date('c')); ?>">
                        <?php echo esc_html(get_the_date('Y.m.d')); ?>
                    </time>
                    <div class="item-category" aria-label="カテゴリー">
                        <?php echo esc_html($category_name); ?>
                    </div>
                    <h2 class="item-title">
                        <a href="<?php the_permalink(); ?>" aria-describedby="excerpt-<?php the_ID(); ?>">
                            <?php the_title(); ?>
                        </a>
                    </h2>
                    <div class="item-excerpt" id="excerpt-<?php the_ID(); ?>">
                        <?php the_excerpt(); ?>
                    </div>
                    <div class="item-meta">
                        <span class="read-more">
                            <a href="<?php the_permalink(); ?>" aria-label="<?php the_title(); ?>の記事を読む">
                                続きを読む <i class="fas fa-arrow-right" aria-hidden="true"></i>
                            </a>
                        </span>
                    </div>
                </article>
                
                <?php endwhile; ?>
                
                <!-- Pagination -->
                <nav class="pagination" role="navigation" aria-label="ページネーション">
                    <?php 
                    echo paginate_links(array(
                        'prev_text' => '<i class="fas fa-chevron-left" aria-hidden="true"></i> 前のページ',
                        'next_text' => '次のページ <i class="fas fa-chevron-right" aria-hidden="true"></i>',
                        'mid_size' => 2,
                        'type' => 'list'
                    )); 
                    ?>
                </nav>
                
            <?php else: ?>
                <!-- No Posts Found -->
                <section class="no-posts" role="status" aria-live="polite">
                    <div class="no-posts-content">
                        <h2>記事が見つかりませんでした</h2>
                        <?php if (is_search()): ?>
                            <p>検索キーワード「<?php echo esc_html(get_search_query()); ?>」に一致する記事が見つかりませんでした。</p>
                            <p>別のキーワードで検索してみてください。</p>
                            
                            <!-- Search Form -->
                            <div class="search-form-container">
                                <form role="search" method="get" class="search-form" action="<?php echo esc_url(home_url('/')); ?>">
                                    <div class="search-input-group">
                                        <label for="search-field-archive" class="sr-only">記事を検索</label>
                                        <input type="search" 
                                               id="search-field-archive"
                                               class="search-field" 
                                               placeholder="記事を検索..." 
                                               value="<?php echo esc_attr(get_search_query()); ?>" 
                                               name="s" 
                                               required />
                                        <button type="submit" class="search-submit" aria-label="検索実行">
                                            <i class="fas fa-search" aria-hidden="true"></i>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        <?php else: ?>
                            <p>まだ記事が投稿されていません。</p>
                        <?php endif; ?>
                        
                        <div class="no-posts-actions">
                            <a href="<?php echo home_url(); ?>" class="btn btn-primary">ホームに戻る</a>
                        </div>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </div>
</main>

<?php get_footer(); ?>
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
                        <?php
                        $achievements_data = get_theme_mod('achievements_data', '[]');
                        $achievements = json_decode($achievements_data, true);
                        $achievement_icons = array('📺', '👥', '🎮', '🏆', '🎯', '📊', '🌟', '🎉', '💫', '🎨');
                        
                        if (!empty($achievements)) {
                            foreach ($achievements as $index => $achievement) {
                                if (!empty($achievement['title']) || !empty($achievement['desc'])) {
                                    $icon = isset($achievement_icons[$index % count($achievement_icons)]) ? $achievement_icons[$index % count($achievement_icons)] : '📺';
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
                        $business_icons = array('🎮', '🛍️', '🍔', '📱', '🎵', '🎬', '💻', '🏢', '🌐', '💼');
                        
                        if (!empty($business_achievements)) {
                            foreach ($business_achievements as $index => $achievement) {
                                if (!empty($achievement['title']) || !empty($achievement['desc'])) {
                                    $icon = isset($business_icons[$index % count($business_icons)]) ? $business_icons[$index % count($business_icons)] : '🎮';
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
                
                if ($recent_posts):
                    foreach ($recent_posts as $post): setup_postdata($post);
                        $categories = get_the_category();
                        $category_name = !empty($categories) ? $categories[0]->name : 'お知らせ';
                ?>
                <div class="news-card fade-in">
                    <div class="news-date"><?php echo get_the_date('Y.m.d'); ?></div>
                    <div class="news-category"><?php echo esc_html($category_name); ?></div>
                    <h3 class="news-title">
                        <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                    </h3>
                    <p class="news-excerpt">
                        <?php
                        if (has_excerpt()) {
                            echo wp_trim_words(get_the_excerpt(), 30, '...');
                        } else {
                            echo wp_trim_words(get_the_content(), 30, '...');
                        }
                        ?>
                    </p>
                    <div class="news-meta">
                        <div class="read-more">
                            <a href="<?php the_permalink(); ?>">続きを読む <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </div>
                </div>
                <?php 
                    endforeach; 
                    wp_reset_postdata();
                else:
                ?>
                <div class="news-card fade-in">
                    <div class="news-date"><?php echo date('Y.m.d'); ?></div>
                    <div class="news-category">お知らせ</div>
                    <h3 class="news-title">
                        <a href="#">ブログ投稿をお待ちください</a>
                    </h3>
                    <p class="news-excerpt">
                        まだ投稿がありません。最新のお知らせや活動報告をお楽しみに！
                    </p>
                </div>
                <?php endif; ?>
            </div>
            
            <?php if (get_option('page_for_posts')): ?>
            <div class="news-more">
                <a href="<?php echo get_permalink(get_option('page_for_posts')); ?>" class="news-more-btn">
                    もっと見る <i class="fas fa-arrow-right"></i>
                </a>
            </div>
            <?php endif; ?>
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

<?php get_footer(); ?>
