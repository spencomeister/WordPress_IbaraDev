<?php get_header(); ?>

<main class="blog-main">
    <div class="container">
        <!-- Breadcrumb -->
        <nav class="breadcrumb">
            <a href="<?php echo home_url(); ?>">ホーム</a>
            <span class="breadcrumb-separator"><i class="fas fa-chevron-right"></i></span>
            <span>検索結果</span>
        </nav>

        <!-- Page Header -->
        <div class="page-header">
            <h1>検索結果</h1>
            <p>「<strong><?php echo get_search_query(); ?></strong>」の検索結果</p>
        </div>

        <!-- Search Form -->
        <div style="text-align: center; margin-bottom: 3rem;">
            <form role="search" method="get" action="<?php echo home_url('/'); ?>" style="max-width: 500px; margin: 0 auto;">
                <div style="display: flex; gap: 1rem;">
                    <input type="search" 
                           name="s" 
                           placeholder="キーワードを入力..." 
                           value="<?php echo get_search_query(); ?>"
                           style="flex: 1; padding: 1rem; border: 2px solid var(--border-color); border-radius: 12px; background: var(--bg-primary); color: var(--text-primary); font-size: 1rem;">
                    <button type="submit" class="submit-btn" style="padding: 1rem 2rem; margin: 0;">検索</button>
                </div>
            </form>
        </div>

        <!-- Search Results -->
        <div class="blog-list">
            <?php if (have_posts()): ?>
                <p style="margin-bottom: 2rem; color: var(--text-secondary);">
                    <?php echo $wp_query->found_posts; ?>件の結果が見つかりました
                </p>
                
                <?php while (have_posts()): the_post(); ?>
                <?php
                $categories = get_the_category();
                $category_name = !empty($categories) ? $categories[0]->name : 'お知らせ';
                ?>
                
                <article class="blog-list-item">
                    <time class="item-date"><?php echo get_the_date('Y.m.d'); ?></time>
                    <div class="item-category"><?php echo esc_html($category_name); ?></div>
                    <h2 class="item-title">
                        <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                    </h2>
                    <p class="item-excerpt">
                        <?php
                        $excerpt = get_the_excerpt();
                        if (empty($excerpt)) {
                            $excerpt = vtuber_get_excerpt(get_the_content(), 50);
                        } else {
                            $excerpt = vtuber_get_excerpt($excerpt, 50);
                        }
                        // Highlight search terms
                        $search_query = get_search_query();
                        if (!empty($search_query)) {
                            $excerpt = preg_replace('/(' . preg_quote($search_query, '/') . ')/i', '<mark>$1</mark>', $excerpt);
                        }
                        echo $excerpt;
                        ?>
                    </p>
                    <div class="item-meta">
                        <a href="<?php the_permalink(); ?>" class="read-more">続きを読む <i class="fas fa-arrow-right"></i></a>
                    </div>
                </article>
                
                <?php endwhile; ?>
            <?php else: ?>
                <div style="text-align: center; padding: 4rem 0;">
                    <h3>検索結果が見つかりませんでした</h3>
                    <p>別のキーワードで検索してみてください。</p>
                    
                    <div style="margin: 2rem 0;">
                        <h4>検索のヒント：</h4>
                        <ul style="list-style: none; padding: 0; margin: 1rem 0;">
                            <li>• より一般的なキーワードを使用してみてください</li>
                            <li>• スペルに間違いがないか確認してください</li>
                            <li>• キーワードの数を減らしてみてください</li>
                        </ul>
                    </div>
                    
                    <a href="<?php echo home_url(); ?>" class="submit-btn">ホームページへ戻る</a>
                </div>
            <?php endif; ?>
        </div>

        <!-- Pagination -->
        <?php
        $pagination = paginate_links(array(
            'type' => 'array',
            'prev_text' => '<i class="fas fa-chevron-left"></i> 前へ',
            'next_text' => '次へ <i class="fas fa-chevron-right"></i>',
            'current' => max(1, get_query_var('paged'))
        ));
        
        if ($pagination): ?>
        <nav class="pagination">
            <?php foreach ($pagination as $page): ?>
                <?php if (strpos($page, 'current') !== false): ?>
                    <?php echo str_replace('page-numbers', 'page-link current', $page); ?>
                <?php elseif (strpos($page, 'next') !== false): ?>
                    <?php echo str_replace('page-numbers', 'page-link next', $page); ?>
                <?php elseif (strpos($page, 'prev') !== false): ?>
                    <?php echo str_replace('page-numbers', 'page-link prev', $page); ?>
                <?php elseif (strpos($page, 'dots') !== false): ?>
                    <span class="page-dots">...</span>
                <?php else: ?>
                    <?php echo str_replace('page-numbers', 'page-link', $page); ?>
                <?php endif; ?>
            <?php endforeach; ?>
        </nav>
        <?php endif; ?>
    </div>
</main>

<style>
mark {
    background-color: var(--accent-purple);
    color: white;
    padding: 0.1rem 0.3rem;
    border-radius: 3px;
}
</style>

<?php get_footer(); ?>
