<?php
/**
 * 404 Error Page Template
 * IbaraDev VTuber Landing Page Theme v2.0.1
 * パフォーマンス向上のため画像をAVIF形式に変更
 */
get_header(); ?>

<main class="blog-main error-page-main" role="main">
    <div class="container">
        <!-- Breadcrumb -->
        <nav class="breadcrumb" aria-label="パンくずリスト">
            <ol class="breadcrumb-list">
                <li><a href="<?php echo esc_url(home_url()); ?>">ホーム</a></li>
                <li>
                    <span class="breadcrumb-separator" aria-hidden="true"><i class="fas fa-chevron-right"></i></span>
                </li>
                <li aria-current="page">
                    <span>404エラー</span>
                </li>
            </ol>
        </nav>
        
        <!-- Page Header -->
        <header class="page-header">
            <h1>404 - ページが見つかりません</h1>
            <p>申し訳ございませんが、お探しのページは見つかりませんでした。</p>
        </header>

        <section class="error-content">
            <div class="article-content">
                <div class="error-actions">
                    <p>以下の方法をお試しください：</p>
                    <nav role="navigation" aria-label="エラーページナビゲーション">
                        <ul>
                            <li>
                                <a href="<?php echo esc_url(home_url()); ?>" class="read-more">
                                    <i class="fas fa-home" aria-hidden="true"></i>
                                    ホームページへ戻る
                                </a>
                            </li>
                            <?php if (get_option('page_for_posts')): ?>
                            <li>
                                <a href="<?php echo esc_url(get_permalink(get_option('page_for_posts'))); ?>" class="read-more">
                                    <i class="fas fa-newspaper" aria-hidden="true"></i>
                                    最新の記事を見る
                                </a>
                            </li>
                            <?php endif; ?>
                            <li>
                                <button type="button" onclick="history.back()" class="read-more">
                                    <i class="fas fa-arrow-left" aria-hidden="true"></i>
                                    前のページに戻る
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
                
                <!-- Search Form -->
                <div class="search-section">
                    <h2>サイト内検索</h2>
                    <form role="search" 
                          method="get" 
                          action="<?php echo esc_url(home_url('/')); ?>" 
                          class="search-form">
                        <div class="search-input-group">
                            <label for="search-404" class="sr-only">サイト内検索</label>
                            <input type="search" 
                                   id="search-404"
                                   name="s" 
                                   placeholder="キーワードを入力..." 
                                   value="<?php echo esc_attr(get_search_query()); ?>">
                            <button type="submit" 
                                    class="submit-btn" 
                                    aria-label="検索実行">
                                <i class="fas fa-search" aria-hidden="true"></i>
                                検索
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    </div>
</main>

<?php get_footer(); ?>
