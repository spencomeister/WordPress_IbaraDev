/**
 * カスタマイザー用JavaScript - YouTube Data API版
 * YouTube動画情報の自動取得とカスタマイザー連携
 */

(function($) {
    'use strict';
    
    // WordPress Customizer環境チェック
    if (typeof wp === 'undefined' || !wp.customize) {
        console.error('WordPress Customizer環境ではありません');
        return;
    }

    // デバッグ用ユーティリティ（本番時は最小限に）
    const Debug = {
        log: function(message, data) {
            if (window.location.search.includes('debug=true')) {
                console.log(`[Customizer] ${message}`, data || '');
            }
        },
        
        error: function(message, data) {
            console.error(`[Customizer Error] ${message}`, data || '');
        }
    };

    // YouTube動画情報取得とカスタマイザー同期
    function fetchVideoInfo(url, videoIndex) {
        if (!url || !url.trim() || !/(?:youtube\.com|youtu\.be)/.test(url)) {
            Debug.log(`Video ${videoIndex}: 無効なURL - スキップ`);
            return;
        }

        const titleInput = $('input[data-customize-setting-link="video_' + videoIndex + '_title"]');
        if (titleInput.length === 0) {
            Debug.error(`Video ${videoIndex}: タイトル入力フィールドが見つかりません`);
            return;
        }

        const currentTitle = titleInput.val().trim();
        if (currentTitle && currentTitle !== '取得中...' && currentTitle !== '取得失敗') {
            Debug.log(`Video ${videoIndex}: タイトル既存のためスキップ`);
            return;
        }

        // ローディング表示
        titleInput.val('取得中...').prop('disabled', true);

        // AJAX リクエスト
        $.ajax({
            url: vtuberAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'get_video_info',
                url: url,
                nonce: vtuberAjax.nonce
            },
            timeout: 15000,
            success: function(response) {
                if (response.success && response.data && response.data.title) {
                    const newTitle = response.data.title;
                    
                    // カスタマイザー設定とDOM入力フィールドを同期
                    syncTitleToCustomizer(videoIndex, newTitle, titleInput);
                    
                    Debug.log(`Video ${videoIndex}: タイトル設定完了`, newTitle);
                } else {
                    titleInput.val('取得失敗');
                    Debug.error(`Video ${videoIndex}: 取得失敗`, response.data?.message);
                    
                    if (response.data?.setup_url) {
                        Debug.error('YouTube Data APIキーが未設定です');
                    }
                }
            },
            error: function(xhr, status, error) {
                titleInput.val('取得失敗');
                Debug.error(`Video ${videoIndex}: AJAX エラー`, { status, error });
            },
            complete: function() {
                titleInput.prop('disabled', false);
            }
        });
    }

    // カスタマイザー設定とDOM入力フィールドの同期
    function syncTitleToCustomizer(videoIndex, title, titleInput) {
        const setting = wp.customize('video_' + videoIndex + '_title');
        
        if (setting) {
            // カスタマイザー設定を更新
            setting.set(title);
            
            // 変更フラグを設定
            if (setting._dirty !== undefined) {
                setting._dirty = true;
            }
            
            // 未保存状態に変更
            if (wp.customize.state && wp.customize.state('saved')) {
                wp.customize.state('saved').set(false);
            }
        }
        
        // DOM入力フィールドを更新
        titleInput.val(title);
        
        // DOM変更イベントを発火
        titleInput.trigger('input').trigger('change');
        
        // フォーカス処理で確実に認識させる
        setTimeout(function() {
            titleInput.focus();
            setTimeout(function() {
                titleInput.blur();
                
                // 値の整合性確認と再同期
                if (setting && setting.get() !== title) {
                    setting.set(title);
                    Debug.log(`Video ${videoIndex}: 再同期実行`);
                }
                
                // プレビューを更新
                if (wp.customize.previewer) {
                    wp.customize.previewer.refresh();
                }
            }, 50);
        }, 100);
    }

    // 全ての動画のDOM値とカスタマイザー値を同期
    function syncAllVideos() {
        let syncCount = 0;
        
        for (let i = 1; i <= 3; i++) {
            const titleInput = document.querySelector('input[data-customize-setting-link="video_' + i + '_title"]');
            const domValue = titleInput ? titleInput.value.trim() : '';
            
            if (domValue) {
                const setting = wp.customize('video_' + i + '_title');
                if (setting && setting.get() !== domValue) {
                    setting.set(domValue);
                    
                    if (setting._dirty !== undefined) {
                        setting._dirty = true;
                    }
                    
                    syncCount++;
                    Debug.log(`Video ${i} 同期完了`);
                }
            }
        }
        
        if (syncCount > 0) {
            // 未保存状態に変更
            if (wp.customize.state && wp.customize.state('saved')) {
                wp.customize.state('saved').set(false);
            }
            Debug.log(`${syncCount} 個のVideoを同期しました`);
        }
        
        return syncCount;
    }

    // 保存前の自動同期設定
    function setupAutoSync() {
        // 保存ボタンクリック時の同期
        $(document).on('click', '#save', function() {
            setTimeout(syncAllVideos, 100);
        });
        
        // カスタマイザー保存イベント時の同期
        wp.customize.bind('save', syncAllVideos);
        
        Debug.log('自動同期システム初期化完了');
    }

    // URL入力フィールドのイベント設定
    function setupUrlHandlers() {
        let setupCount = 0;
        
        for (let i = 1; i <= 3; i++) {
            const urlInput = $('input[data-customize-setting-link="video_' + i + '_url"]');
            
            if (urlInput.length > 0) {
                let timeoutId;
                
                // URL変更時のイベントリスナー
                urlInput.on('input blur paste change', function() {
                    const url = $(this).val().trim();
                    
                    // デバウンス処理
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                    }
                    
                    timeoutId = setTimeout(function() {
                        fetchVideoInfo(url, i);
                    }, 500);
                });
                
                setupCount++;
                Debug.log(`Video ${i} URLハンドラー設定完了`);
            }
        }
        
        Debug.log(`${setupCount}/3 個のフィールドにイベント設定完了`);
        
        if (setupCount === 0) {
            Debug.error('URL入力フィールドが見つかりませんでした');
        }
    }

    // 初期化処理
    $(document).ready(function() {
        setTimeout(setupUrlHandlers, 1000);
    });

    // WordPress Customizer API初期化
    wp.customize.bind('ready', function() {
        Debug.log('WordPress Customizer 初期化完了');
        setupAutoSync();
        
        // APIキー設定確認
        setTimeout(function() {
            const apiKeySetting = wp.customize('youtube_api_key');
            if (apiKeySetting) {
                const apiKey = apiKeySetting.get();
                if (!apiKey || apiKey.trim() === '') {
                    Debug.error('YouTube Data APIキーが設定されていません');
                    console.warn('設定方法: カスタマイザー > 動画セクション > YouTube Data API キー');
                } else {
                    Debug.log('YouTube Data APIキー設定済み');
                }
            }
        }, 500);
    });

})(jQuery);