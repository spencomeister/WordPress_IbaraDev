<?php
/**
 * Template Name: Achievements Page
 * 実績ページテンプレート（年別グループ表示）
 * 
 * @package VTuberTheme
 * @version 2.2
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
                    これまでの活動実績を年別にご紹介します
                </p>
            </header>

            <!-- Article Content -->
            <div class="article-content">
                <!-- Personal Achievements Section -->
                <section id="personal-achievements">
                    <h2>個人実績</h2>
                    
                    <?php
                    $achievements_data = get_theme_mod('achievements_data', '[]');
                    $achievements = json_decode($achievements_data, true);
                    render_yearly_grouped_achievements($achievements, '📺', '個人実績データがありません。管理者にお問い合わせください。', '実績名');
                    ?>
                </section>

                <!-- Business Achievements Section -->
                <section id="business-achievements">
                    <h2>案件実績</h2>
                    
                    <?php
                    $business_data = get_theme_mod('business_data', '[]');
                    $business_achievements = json_decode($business_data, true);
                    render_yearly_grouped_achievements($business_achievements, '🎮', '案件実績データがありません。管理者にお問い合わせください。', '案件名');
                    ?>
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

<script>
// アコーディオン機能
document.addEventListener('DOMContentLoaded', function() {
    const accordionHeaders = document.querySelectorAll('.yearly-accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isOpen = content.style.display === 'block';
            
            // 現在のアコーディオンを切り替え
            if (isOpen) {
                content.style.display = 'none';
                this.classList.remove('active');
                this.setAttribute('aria-expanded', 'false');
            } else {
                content.style.display = 'block';
                this.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
            }
        });
        
        // キーボード対応
        header.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // 各セクションの最新年度を最初に開く
    const sections = ['personal-achievements', 'business-achievements'];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const firstAccordion = section.querySelector('.yearly-accordion-header');
            if (firstAccordion) {
                firstAccordion.click();
            }
        }
    });
});
</script>

<?php get_footer(); ?>
