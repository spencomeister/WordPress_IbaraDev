<?php get_header(); ?>

<!-- Blog Article -->
<main class="blog-main" role="main">
    <div class="container">
        <?php if (have_posts()): ?>
            <?php while (have_posts()): the_post(); ?>
            
            <!-- Breadcrumb -->
            <nav class="breadcrumb" aria-label="パンくずリスト">
                <ol class="breadcrumb-list">
                    <li><a href="<?php echo esc_url(home_url()); ?>">ホーム</a></li>
                    <li>
                        <span class="breadcrumb-separator" aria-hidden="true"><i class="fas fa-chevron-right"></i></span>
                    </li>
                    <li><a href="<?php echo esc_url(get_permalink(get_option('page_for_posts'))); ?>">NEWS</a></li>
                    <li>
                        <span class="breadcrumb-separator" aria-hidden="true"><i class="fas fa-chevron-right"></i></span>
                    </li>
                    <li aria-current="page">
                        <span><?php the_title(); ?></span>
                    </li>
                </ol>
            </nav>

            <article class="blog-article">
                <!-- Article Header -->
                <header class="article-header">
                    <div class="article-meta">
                        <time class="article-date" datetime="<?php echo esc_attr(get_the_date('c')); ?>">
                            <?php echo esc_html(get_the_date('Y.m.d')); ?>
                        </time>
                        <?php
                        $categories = get_the_category();
                        if (!empty($categories)):
                        ?>
                        <span class="article-category" aria-label="カテゴリー">
                            <?php echo esc_html($categories[0]->name); ?>
                        </span>
                        <?php endif; ?>
                    </div>
                    <h1 class="article-title"><?php the_title(); ?></h1>
                </header>

                <!-- Article Content -->
                <div class="article-content">
                    <?php if (has_post_thumbnail()): ?>
                    <figure class="article-image">
                        <?php the_post_thumbnail('large', array(
                            'loading' => 'lazy',
                            'alt' => get_the_title()
                        )); ?>
                    </figure>
                    <?php endif; ?>

                    <?php the_content(); ?>

                    <?php
                    $tags = get_the_tags();
                    if ($tags): ?>
                    <div class="article-tags" role="list" aria-label="タグ">
                        <?php foreach ($tags as $tag): ?>
                        <span class="tag" role="listitem"><?php echo esc_html($tag->name); ?></span>
                        <?php endforeach; ?>
                    </div>
                    <?php endif; ?>
                </div>

                <!-- Share Buttons -->
                <aside class="article-share" role="complementary" aria-labelledby="share-heading">
                    <h3 id="share-heading">この記事をシェア</h3>
                    <div class="share-buttons" role="list">
                        <a href="https://x.com/intent/tweet?text=<?php echo urlencode(get_the_title()); ?>&url=<?php echo urlencode(get_permalink()); ?>" 
                           class="share-btn x" 
                           aria-label="Xでシェア" 
                           target="_blank"
                           rel="noopener noreferrer"
                           role="listitem">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                        </a>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=<?php echo urlencode(get_permalink()); ?>" 
                           class="share-btn facebook" 
                           aria-label="Facebookでシェア" 
                           target="_blank"
                           rel="noopener noreferrer"
                           role="listitem">
                            <i class="fab fa-facebook-f" aria-hidden="true"></i>
                        </a>
                        <a href="https://social-plugins.line.me/lineit/share?url=<?php echo urlencode(get_permalink()); ?>" 
                           class="share-btn line" 
                           aria-label="LINEでシェア" 
                           target="_blank"
                           rel="noopener noreferrer"
                           role="listitem">
                            <i class="fab fa-line" aria-hidden="true"></i>
                        </a>
                        <button type="button" 
                                class="share-btn copy" 
                                aria-label="URLをコピー" 
                                onclick="copyToClipboard('<?php echo esc_js(get_permalink()); ?>')"
                                role="listitem">
                            <i class="fas fa-link" aria-hidden="true"></i>
                        </button>
                    </div>
                </aside>

                <!-- Navigation -->
                <nav class="article-nav" role="navigation" aria-label="記事ナビゲーション">
                    <?php 
                    $prev_post = get_previous_post();
                    $next_post = get_next_post();
                    ?>
                    
                    <?php if ($prev_post): ?>
                    <a href="<?php echo get_permalink($prev_post); ?>" class="nav-prev">
                        <span class="nav-label">前の記事</span>
                        <span class="nav-title"><?php echo esc_html($prev_post->post_title); ?></span>
                    </a>
                    <?php endif; ?>
                    
                    <?php if ($next_post): ?>
                    <a href="<?php echo get_permalink($next_post); ?>" class="nav-next">
                        <span class="nav-label">次の記事</span>
                        <span class="nav-title"><?php echo esc_html($next_post->post_title); ?></span>
                    </a>
                    <?php endif; ?>
                </nav>
            </article>

            <!-- Related Articles -->
            <?php
            $categories = get_the_category();
            if ($categories) {
                $category_ids = array();
                foreach ($categories as $category) {
                    $category_ids[] = $category->term_id;
                }
                
                $related_posts = get_posts(array(
                    'category__in' => $category_ids,
                    'post__not_in' => array(get_the_ID()),
                    'posts_per_page' => 3,
                    'orderby' => 'rand'
                ));
                
                if ($related_posts): ?>
                <section class="related-articles">
                    <h2>関連記事</h2>
                    <div class="related-grid">
                        <?php foreach ($related_posts as $post): setup_postdata($post); ?>
                        <article class="related-card">
                            <a href="<?php the_permalink(); ?>">
                                <h3><?php the_title(); ?></h3>
                                <time><?php echo get_the_date('Y.m.d'); ?></time>
                            </a>
                        </article>
                        <?php endforeach; wp_reset_postdata(); ?>
                    </div>
                </section>
                <?php endif;
            }
            ?>
            
            <?php endwhile; ?>
        <?php endif; ?>
    </div>
</main>

<!-- Copy to Clipboard Script -->
<script>
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        alert('URLをコピーしました！');
    }).catch(function(err) {
        console.error('コピーに失敗しました: ', err);
    });
}
</script>

<?php get_footer(); ?>
