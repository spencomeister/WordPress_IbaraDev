<?php get_header(); ?>

<!-- Blog List -->
<main class="blog-main" role="main">
    <div class="container">
        <!-- Breadcrumb -->
        <nav class="breadcrumb" aria-label="パンくずリスト">
            <ol class="breadcrumb-list">
                <li><a href="<?php echo esc_url(home_url()); ?>">ホーム</a></li>
                <li aria-current="page">
                    <span class="breadcrumb-separator" aria-hidden="true"><i class="fas fa-chevron-right"></i></span>
                    <span>NEWS</span>
                </li>
            </ol>
        </nav>

        <!-- Page Header -->
        <div class="page-header">
            <h1>NEWS</h1>
            <p>最新のお知らせや活動報告をお届けします</p>
        </div>

        <!-- Category Filter -->
        <?php
        $categories = get_categories(array(
            'hide_empty' => true,
            'exclude' => array(1) // Exclude "Uncategorized"
        ));
        
        if (!empty($categories)): ?>
        <div class="category-filter">
            <button class="filter-btn active" data-category="all">すべて</button>
            <?php foreach ($categories as $category): ?>
            <button class="filter-btn" data-category="<?php echo esc_attr($category->slug); ?>">
                <?php echo esc_html($category->name); ?>
            </button>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>

        <!-- Articles List -->
        <div class="blog-list">
            <?php if (have_posts()): ?>
                <?php while (have_posts()): the_post(); ?>
                <?php
                $categories = get_the_category();
                $category_slug = !empty($categories) ? $categories[0]->slug : '';
                $category_name = !empty($categories) ? $categories[0]->name : 'お知らせ';
                ?>
                
                <article class="blog-list-item" data-category="<?php echo esc_attr($category_slug); ?>">
                    <time class="item-date"><?php echo get_the_date('Y.m.d'); ?></time>
                    <div class="item-category"><?php echo esc_html($category_name); ?></div>
                    <h2 class="item-title">
                        <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                    </h2>
                    <p class="item-excerpt">
                        <?php
                        if (has_excerpt()) {
                            echo vtuber_get_excerpt(get_the_excerpt(), 50);
                        } else {
                            echo vtuber_get_excerpt(get_the_content(), 50);
                        }
                        ?>
                    </p>
                    <div class="item-meta">
                        <a href="<?php the_permalink(); ?>" class="read-more">続きを読む <i class="fas fa-arrow-right"></i></a>
                    </div>
                </article>
                
                <?php endwhile; ?>
            <?php else: ?>
                <p>投稿が見つかりませんでした。</p>
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

<!-- Blog Filter JavaScript -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const blogItems = document.querySelectorAll('.blog-list-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items
            blogItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (category === 'all' || itemCategory === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});
</script>

<?php get_footer(); ?>
