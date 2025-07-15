<?php get_header(); ?>

<!-- Blog List -->
<main class="blog-main">
    <div class="container">
        <!-- Breadcrumb -->
        <nav class="breadcrumb">
            <a href="<?php echo home_url(); ?>">ホーム</a>
            <span class="breadcrumb-separator"><i class="fas fa-chevron-right"></i></span>
            <a href="<?php echo get_permalink(get_option('page_for_posts')); ?>">NEWS</a>
            <span class="breadcrumb-separator"><i class="fas fa-chevron-right"></i></span>
            <span><?php single_cat_title(); ?></span>
        </nav>

        <!-- Page Header -->
        <div class="page-header">
            <h1><?php single_cat_title(); ?></h1>
            <?php if (category_description()): ?>
            <p><?php echo category_description(); ?></p>
            <?php else: ?>
            <p><?php single_cat_title(); ?>の記事一覧</p>
            <?php endif; ?>
        </div>

        <!-- Articles List -->
        <div class="blog-list">
            <?php if (have_posts()): ?>
                <?php while (have_posts()): the_post(); ?>
                <article class="blog-list-item">
                    <time class="item-date"><?php echo get_the_date('Y.m.d'); ?></time>
                    <div class="item-category"><?php single_cat_title(); ?></div>
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
                <p>この カテゴリーには投稿がありません。</p>
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

<?php get_footer(); ?>
