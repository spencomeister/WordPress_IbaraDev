<?php get_header(); ?>

<main class="blog-main" role="main">
    <div class="container">
        <!-- Page Header -->
        <header class="page-header">
            <h1>404 - ページが見つかりません</h1>
            <p>申し訳ございませんが、お探しのページは見つかりませんでした。</p>
        </header>

        <section class="error-content" style="text-align: center; padding: 4rem 0;">
            <div class="error-actions">
                <p>以下の方法をお試しください：</p>
                <nav role="navigation" aria-label="エラーページナビゲーション">
                    <ul style="list-style: none; padding: 0; margin: 2rem 0;">
                        <li style="margin: 1rem 0;">
                            <a href="<?php echo esc_url(home_url()); ?>" class="read-more">
                                ホームページへ戻る
                            </a>
                        </li>
                        <?php if (get_option('page_for_posts')): ?>
                        <li style="margin: 1rem 0;">
                            <a href="<?php echo esc_url(get_permalink(get_option('page_for_posts'))); ?>" class="read-more">
                                最新の記事を見る
                            </a>
                        </li>
                        <?php endif; ?>
                        <li style="margin: 1rem 0;">
                            <button type="button" onclick="history.back()" class="read-more" style="border: none; background: none; cursor: pointer;">
                                前のページに戻る
                            </button>
                        </li>
                    </ul>
                </nav>
                
                <!-- Search Form -->
                <div style="margin: 3rem 0;">
                    <h2>サイト内検索</h2>
                    <form role="search" 
                          method="get" 
                          action="<?php echo esc_url(home_url('/')); ?>" 
                          style="max-width: 400px; margin: 1rem auto;">
                        <div style="display: flex; gap: 1rem;">
                            <label for="search-404" class="sr-only">サイト内検索</label>
                            <input type="search" 
                                   id="search-404"
                                   name="s" 
                                   placeholder="キーワードを入力..." 
                                   value="<?php echo esc_attr(get_search_query()); ?>"
                                   style="flex: 1; padding: 0.8rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--bg-primary); color: var(--text-primary);">
                            <button type="submit" 
                                    class="submit-btn" 
                                    style="padding: 0.8rem 1.5rem; margin: 0;"
                                    aria-label="検索実行">
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
