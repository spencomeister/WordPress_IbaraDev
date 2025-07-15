/**
 * カスタマイザー用JavaScript - YouTube Data API版
 * シンプルなDOM操作でYouTube動画情報を自動取得
 */

(function($) {
    'use strict';

    // YouTube動画情報取得処理
    function fetchVideoInfo(url, videoIndex) {
        if (!url || !url.trim()) {
            return;
        }

        // YouTube URLのチェック
        const youtubeRegex = /(?:youtube\.com|youtu\.be)/;
        if (!youtubeRegex.test(url)) {
            return;
        }

        console.log('Fetching video info for:', url);

        // タイトル入力フィールドを取得
        const titleInput = $('input[data-customize-setting-link="video_' + videoIndex + '_title"]');
        
        if (titleInput.length === 0) {
            console.warn('Title input not found for video ' + videoIndex);
            return;
        }

        // 現在のタイトルが入力されている場合はスキップ
        const currentTitle = titleInput.val().trim();
        if (currentTitle && currentTitle !== '取得中...' && currentTitle !== '取得失敗') {
            console.log('Title already exists, skipping:', currentTitle);
            return;
        }

        // ローディング表示
        titleInput.val('取得中...');
        titleInput.prop('disabled', true);

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
                console.log('AJAX Success:', response);
                
                if (response.success && response.data && response.data.title) {
                    titleInput.val(response.data.title);
                    console.log('タイトル設定完了:', response.data.title);
                } else {
                    titleInput.val('取得失敗');
                    console.error('動画情報取得失敗:', response);
                    
                    // エラーメッセージの詳細表示
                    if (response.data && response.data.message) {
                        console.error('エラー詳細:', response.data.message);
                        
                        // APIキー未設定の場合の特別処理
                        if (response.data.setup_url) {
                            console.warn('YouTube Data APIキーが未設定です。設定URL:', response.data.setup_url);
                        }
                    }
                }
            },
            error: function(xhr, status, error) {
                titleInput.val('取得失敗');
                console.error('AJAX Error:', {
                    status: status,
                    error: error,
                    responseText: xhr.responseText
                });
            },
            complete: function() {
                titleInput.prop('disabled', false);
            }
        });
    }

    // カスタマイザー読み込み完了後に実行
    $(document).ready(function() {
        // 少し遅らせてDOM要素が確実に読み込まれるのを待つ
        setTimeout(function() {
            console.log('Setting up YouTube URL handlers...');
            
            // 各動画URL入力フィールドにイベントを設定
            for (let i = 1; i <= 3; i++) {
                const urlInput = $('input[data-customize-setting-link="video_' + i + '_url"]');
                
                if (urlInput.length > 0) {
                    console.log('Found URL input for video ' + i);
                    
                    // デバウンス用のタイマー
                    let timeoutId;
                    
                    // イベントリスナーを設定
                    urlInput.on('input blur paste change', function() {
                        const url = $(this).val().trim();
                        
                        // 前回のタイマーをクリア
                        if (timeoutId) {
                            clearTimeout(timeoutId);
                        }
                        
                        // 500ms後に実行
                        timeoutId = setTimeout(function() {
                            fetchVideoInfo(url, i);
                        }, 500);
                    });
                    
                    console.log('Event listener set for video ' + i);
                } else {
                    console.warn('URL input not found for video ' + i);
                }
            }
            
            console.log('All YouTube URL handlers setup complete');
        }, 1000);
    });

    // カスタマイザー専用の初期化（WordPress Customizer環境の場合）
    if (typeof wp !== 'undefined' && wp.customize) {
        wp.customize.bind('ready', function() {
            console.log('WordPress Customizer ready');
            
            // 設定確認
            setTimeout(function() {
                const apiKeySetting = wp.customize('youtube_api_key');
                if (apiKeySetting) {
                    const apiKey = apiKeySetting.get();
                    if (!apiKey || apiKey.trim() === '') {
                        console.warn('YouTube Data APIキーが設定されていません。');
                        console.info('設定方法: カスタマイザー > 動画セクション > YouTube Data API キー');
                    } else {
                        console.log('YouTube Data APIキーが設定済みです');
                    }
                }
            }, 500);
        });
    }

})(jQuery);