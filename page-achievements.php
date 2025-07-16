<?php
/**
 * Template Name: Achievements Page
 * 実績ページテンプレート
 * 
 * @package VTuberTheme
 * @version 2.1
 */

get_header(); ?>

<main id="main-content" class="blog-main" role="main">
    <div class="container">
        <!-- Breadcrumb -->
        <nav class="breadcrumb" aria-label="パンくずリスト">
            <ol class="breadcrumb-list">
                <li><a href="<?php echo esc_url(home_url()); ?>">ホーム</a></li>
                <li aria-current="page">
                    <span class="breadcrumb-separator" aria-hidden="true"><i class="fas fa-chevron-right"></i></span>
                    <span>実績</span>
                </li>
            </ol>
        </nav>

        <article class="blog-article">
            <!-- Article Header -->
            <header class="article-header">
                <h1 class="article-title">実績</h1>
                <p class="article-subtitle">
                    これまでの活動実績をご紹介します
                </p>
            </header>

            <!-- Article Content -->
            <div class="article-content">
                <!-- Personal Achievements Section -->
                <section id="personal-achievements">
                    <h2>個人実績</h2>
                    
                    <div class="achievements-table-container">
                        <table class="achievements-table" role="table" aria-label="個人実績一覧">
                            <?php render_achievements_table_header('実績名'); ?>
                            <tbody>
                            <?php
                            $achievements_data = get_theme_mod('achievements_data', '[]');
                            $achievements = json_decode($achievements_data, true);
                            render_achievements_table($achievements, '📺', '実績データがありません。管理者にお問い合わせください。');
                            ?>
                            </tbody>
                        </table>
                    </div>
                </section>

            <!-- Business Achievements Section -->
            <section id="business-achievements">
                <h2>案件実績</h2>
                
                <div class="achievements-table-container">
                    <table class="achievements-table" role="table" aria-label="案件実績一覧">
                        <?php render_achievements_table_header('案件名'); ?>
                        <tbody>
                            <?php
                            $business_data = get_theme_mod('business_data', '[]');
                            $business_achievements = json_decode($business_data, true);
                            render_achievements_table($business_achievements, '🎮', '案件実績データがありません。管理者にお問い合わせください。');
                            ?>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Back to Top -->
            <div class="back-to-home">
                <a href="<?php echo esc_url(home_url()); ?>" class="btn btn-secondary">
                    <i class="fas fa-home"></i> ホームに戻る
                </a>
            </div>
        </div>
    </article>
</div>
</main>

<?php get_footer(); ?>
