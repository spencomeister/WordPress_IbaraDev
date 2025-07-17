<?php
/**
 * Page Template
 * IbaraDev VTuber Landing Page Theme v2.0.0
 */
get_header(); ?>

<main class="page-main" role="main">
    <div class="container">
        <!-- Breadcrumb -->
        <nav class="breadcrumb" aria-label="パンくずリスト">
            <ol class="breadcrumb-list">
                <li><a href="<?php echo esc_url(home_url()); ?>">ホーム</a></li>
                <li>
                    <span class="breadcrumb-separator" aria-hidden="true"><i class="fas fa-chevron-right"></i></span>
                </li>
                <li aria-current="page">
                    <span><?php the_title(); ?></span>
                </li>
            </ol>
        </nav>

        <!-- Page Header -->
        <header class="page-header">
            <h1><?php the_title(); ?></h1>
        </header>

        <!-- Page Content -->
        <section class="page-content">
            <?php if (have_posts()): ?>
                <?php while (have_posts()): the_post(); ?>
                    <article class="page-article">
                        <div class="page-article-content">
                            <?php the_content(); ?>
                        </div>
                    </article>
                <?php endwhile; ?>
            <?php endif; ?>
        </section>
    </div>
</main>

<?php get_footer(); ?>
