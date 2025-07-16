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
                <p style="color: var(--text-secondary); font-size: 1.1rem; margin-top: 1rem;">
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
                            <thead>
                                <tr>
                                    <th class="icon-col" scope="col" aria-label="種別"><span class="sr-only">種別</span></th>
                                    <th class="date-col" scope="col">時期</th>
                                    <th class="title-col" scope="col">実績名</th>
                                    <th class="description-col" scope="col">詳細</th>
                                </tr>
                            </thead>
                            <tbody>
                            <?php
                            $achievements_data = get_theme_mod('achievements_data', '[]');
                            $achievements = json_decode($achievements_data, true);
                            
                            if (!empty($achievements) && is_array($achievements)):
                                // Sort by date in descending order (newest first)
                                usort($achievements, function($a, $b) {
                                    $dateA = isset($a['date']) ? $a['date'] : '';
                                    $dateB = isset($b['date']) ? $b['date'] : '';
                                    return strcmp($dateB, $dateA);
                                });
                                
                                foreach ($achievements as $achievement): 
                                    if (!empty($achievement['title'])): ?>
                            <tr class="achievement-row">
                                <td class="achievement-icon" role="gridcell">
                                    <span aria-label="<?php echo esc_attr($achievement['title']); ?>の種別">
                                        <?php echo isset($achievement['icon']) ? esc_html($achievement['icon']) : '📺'; ?>
                                    </span>
                                </td>
                                <td class="achievement-date" role="gridcell">
                                    <time><?php echo esc_html(isset($achievement['date']) ? $achievement['date'] : ''); ?></time>
                                </td>
                                <td class="achievement-title" role="gridcell">
                                    <?php echo esc_html($achievement['title']); ?>
                                </td>
                                <td class="achievement-description" role="gridcell">
                                    <?php echo esc_html(isset($achievement['desc']) ? $achievement['desc'] : ''); ?>
                                </td>
                            </tr>
                                    <?php endif;
                                endforeach;
                            else: ?>
                            <tr>
                                <td colspan="4" style="text-align: center; padding: 2rem; color: var(--text-tertiary);">
                                    実績データがありません。管理者にお問い合わせください。
                                </td>
                            </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Business Achievements Section -->
            <section id="business-achievements">
                <h2>案件実績</h2>
                
                <div class="achievements-table-container">
                    <table class="achievements-table" role="table" aria-label="案件実績一覧">
                        <thead>
                            <tr>
                                <th class="icon-col" scope="col" aria-label="種別"><span class="sr-only">種別</span></th>
                                <th class="date-col" scope="col">時期</th>
                                <th class="title-col" scope="col">案件名</th>
                                <th class="description-col" scope="col">詳細</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            $business_data = get_theme_mod('business_data', '[]');
                            $business_achievements = json_decode($business_data, true);
                            
                            if (!empty($business_achievements) && is_array($business_achievements)):
                                // Sort by date in descending order (newest first)
                                usort($business_achievements, function($a, $b) {
                                    $dateA = isset($a['date']) ? $a['date'] : '';
                                    $dateB = isset($b['date']) ? $b['date'] : '';
                                    return strcmp($dateB, $dateA);
                                });
                                
                                foreach ($business_achievements as $achievement): 
                                    if (!empty($achievement['title'])): ?>
                            <tr class="achievement-row">
                                <td class="achievement-icon" role="gridcell">
                                    <span aria-label="<?php echo esc_attr($achievement['title']); ?>の種別">
                                        <?php echo isset($achievement['icon']) ? esc_html($achievement['icon']) : '🎮'; ?>
                                    </span>
                                </td>
                                <td class="achievement-date" role="gridcell">
                                    <time><?php echo esc_html(isset($achievement['date']) ? $achievement['date'] : ''); ?></time>
                                </td>
                                <td class="achievement-title" role="gridcell">
                                    <?php echo esc_html($achievement['title']); ?>
                                </td>
                                <td class="achievement-description" role="gridcell">
                                    <?php echo esc_html(isset($achievement['desc']) ? $achievement['desc'] : ''); ?>
                                </td>
                            </tr>
                                    <?php endif;
                                endforeach;
                            else: ?>
                            <tr>
                                <td colspan="4" style="text-align: center; padding: 2rem; color: var(--text-tertiary);">
                                    案件実績データがありません。管理者にお問い合わせください。
                                </td>
                            </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Back to Top -->
            <div style="text-align: center; margin: 3rem 0;">
                <a href="<?php echo esc_url(home_url()); ?>" class="btn btn-secondary">
                    <i class="fas fa-home"></i> ホームに戻る
                </a>
            </div>
        </div>
    </article>
</div>
</main>

<?php get_footer(); ?>
