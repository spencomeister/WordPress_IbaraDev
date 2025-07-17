/**
 * カスタマイザー用JavaScript - YouTube Data API版
 * シンプルなDOM操作でYouTube動画情報を自動取得
 */

(function($) {
    'use strict';

    // デバッグ用ヘルパー関数
    const Debug = {
        // カラフルなログ出力
        success: function(message, data) {
            console.log(`%c✅ ${message}`, 'color: #4CAF50; font-weight: bold;', data || '');
        },
        
        error: function(message, data) {
            console.error(`%c❌ ${message}`, 'color: #F44336; font-weight: bold;', data || '');
        },
        
        warning: function(message, data) {
            console.warn(`%c⚠️ ${message}`, 'color: #FF9800; font-weight: bold;', data || '');
        },
        
        info: function(message, data) {
            console.info(`%c💡 ${message}`, 'color: #2196F3; font-weight: bold;', data || '');
        },
        
        // 処理ステップの表示
        step: function(step, message, data) {
            console.log(`%c🔄 Step ${step}: ${message}`, 'color: #9C27B0; font-weight: bold;', data || '');
        },
        
        // グループ化されたデバッグ情報
        group: function(title, callback) {
            console.group(`%c📋 ${title}`, 'color: #607D8B; font-weight: bold; font-size: 14px;');
            if (typeof callback === 'function') {
                callback();
                console.groupEnd();
            }
        }
    };

    // YouTube動画情報取得処理
    function fetchVideoInfo(url, videoIndex) {
        Debug.group(`🎬 動画情報取得プロセス開始 (Video ${videoIndex})`, function() {
            if (!url || !url.trim()) {
                Debug.warning('URL未入力のためスキップ');
                return;
            }

            // YouTube URLのチェック
            const youtubeRegex = /(?:youtube\.com|youtu\.be)/;
            if (!youtubeRegex.test(url)) {
                Debug.warning('YouTube URL以外のためスキップ:', url);
                return;
            }

            Debug.success('YouTube URL確認完了:', url);

            // タイトル入力フィールドを取得
            const titleInput = $('input[data-customize-setting-link="video_' + videoIndex + '_title"]');
            
            if (titleInput.length === 0) {
                Debug.error('タイトル入力フィールドが見つかりません (video_' + videoIndex + '_title)');
                return;
            }

            Debug.success('タイトル入力フィールド取得完了');

            // 現在のタイトルが入力されている場合はスキップ
            const currentTitle = titleInput.val().trim();
            Debug.info('現在のタイトル:', currentTitle || '(空)');
            
            if (currentTitle && currentTitle !== '取得中...' && currentTitle !== '取得失敗') {
                Debug.info('タイトル既存のためスキップ:', currentTitle);
                return;
            }

            Debug.step('1', 'API取得プロセス開始');

            // ローディング表示
            titleInput.val('取得中...');
            titleInput.prop('disabled', true);
            
            Debug.info('ローディング状態設定完了');

            // AJAX リクエスト
            const ajaxData = {
                action: 'get_video_info',
                url: url,
                nonce: vtuberAjax.nonce
            };
            
            Debug.step('2', 'AJAX送信データ確認', ajaxData);
            
            $.ajax({
                url: vtuberAjax.ajaxurl,
                type: 'POST',
                data: ajaxData,
                timeout: 15000,
                success: function(response) {
                    Debug.group('📡 AJAX レスポンス受信', function() {
                        Debug.success('成功フラグ:', response.success);
                        
                        if (response.data) {
                            Debug.info('データ部分:', response.data);
                            if (response.data.title) {
                                Debug.success('取得タイトル:', response.data.title);
                            }
                            if (response.data.thumbnail) {
                                Debug.info('サムネイル URL:', response.data.thumbnail);
                            }
                            if (response.data.channel_title) {
                                Debug.info('チャンネル名:', response.data.channel_title);
                            }
                        }
                        
                        if (response.success && response.data && response.data.title) {
                            Debug.step('3', 'タイトル入力フィールドに設定中...');
                            titleInput.val(response.data.title);
                            
                            // WordPressのoptions更新をトリガー
                            titleInput.trigger('change');
                            Debug.info('WordPressオプション更新トリガー実行');
                            
                            Debug.success('タイトル設定完了:', response.data.title);
                            
                            // カスタマイザープレビュー更新
                            if (typeof wp !== 'undefined' && wp.customize) {
                                const setting = wp.customize('video_' + videoIndex + '_title');
                                if (setting) {
                                    setting.set(response.data.title);
                                    Debug.success('カスタマイザー設定更新完了');
                                }
                            }
                        } else {
                            Debug.error('動画情報取得失敗');
                            titleInput.val('取得失敗');
                            
                            // エラーメッセージの詳細表示
                            if (response.data && response.data.message) {
                                Debug.error('エラー詳細:', response.data.message);
                                
                                // APIキー未設定の場合の特別処理
                                if (response.data.setup_url) {
                                    Debug.warning('YouTube Data APIキーが未設定です');
                                    Debug.info('設定URL:', response.data.setup_url);
                                }
                            }
                            
                            if (!response.success && response.data) {
                                Debug.error('サーバーエラー詳細:', response.data);
                            }
                        }
                    });
                },
                error: function(xhr, status, error) {
                    Debug.group('❌ AJAX エラー発生', function() {
                        titleInput.val('取得失敗');
                        Debug.error('エラー詳細:', {
                            status: status,
                            error: error,
                            responseText: xhr.responseText,
                            readyState: xhr.readyState,
                            statusCode: xhr.status
                        });
                        
                        // ネットワークエラーの場合
                        if (status === 'timeout') {
                            Debug.error('タイムアウトエラー (15秒)');
                        } else if (status === 'error') {
                            Debug.error('ネットワークエラーまたはサーバーエラー');
                        } else if (status === 'abort') {
                            Debug.error('リクエストが中断されました');
                        }
                    });
                },
                complete: function() {
                    titleInput.prop('disabled', false);
                    Debug.info('API取得プロセス完了 (フィールド有効化)');
                }
            });
        });
    }

    // カスタマイザー読み込み完了後に実行
    $(document).ready(function() {
        Debug.group('🚀 カスタマイザー初期化開始', function() {
            Debug.info('DOM読み込み完了、1秒後にイベント設定開始');
            
            // 少し遅らせてDOM要素が確実に読み込まれるのを待つ
            setTimeout(function() {
                Debug.step('1', 'YouTube URLハンドラー設定開始');
                
                let setupCount = 0;
                
                // 各動画URL入力フィールドにイベントを設定
                for (let i = 1; i <= 3; i++) {
                    const urlInput = $('input[data-customize-setting-link="video_' + i + '_url"]');
                    
                    if (urlInput.length > 0) {
                        Debug.success(`Video ${i} URL入力フィールド発見`, urlInput[0]);
                        
                        // 現在の値を確認
                        const currentUrl = urlInput.val();
                        Debug.info(`Video ${i} 現在のURL:`, currentUrl || '(空)');
                        
                        setupCount++;
                        
                        // デバウンス用のタイマー
                        let timeoutId;
                        
                        // イベントリスナーを設定
                        urlInput.on('input blur paste change', function() {
                            const url = $(this).val().trim();
                            Debug.step('2', `Video ${i} URL変更検知`, url || '(空)');
                            
                            // 前回のタイマーをクリア
                            if (timeoutId) {
                                Debug.info(`Video ${i} 前回のタイマークリア`);
                                clearTimeout(timeoutId);
                            }
                            
                            // 500ms後に実行
                            Debug.info(`Video ${i} 500ms後に自動取得実行予約`);
                            timeoutId = setTimeout(function() {
                                fetchVideoInfo(url, i);
                            }, 500);
                        });
                        
                        Debug.success(`Video ${i} イベントリスナー設定完了`);
                    } else {
                        Debug.warning(`Video ${i} URL入力フィールドが見つかりません`);
                        Debug.info(`期待するセレクター: input[data-customize-setting-link="video_${i}_url"]`);
                    }
                }
                
                Debug.success(`設定完了統計: ${setupCount}/3 個のフィールドにイベント設定`);
                
                if (setupCount === 0) {
                    Debug.error('どのURL入力フィールドも見つかりませんでした');
                    Debug.info('利用可能な入力フィールド一覧:');
                    $('input[data-customize-setting-link*="video"]').each(function(index, element) {
                        console.log(`  - ${$(element).attr('data-customize-setting-link')}`);
                    });
                }
                
                Debug.success('YouTube URLハンドラー設定完了');
            }, 1000);
        });
    });

    // カスタマイザー専用の初期化（WordPress Customizer環境の場合）
    if (typeof wp !== 'undefined' && wp.customize) {
        wp.customize.bind('ready', function() {
            Debug.group('🎛️ WordPress Customizer API 初期化', function() {
                Debug.success('WordPress Customizer ready');
                
                // 設定確認
                setTimeout(function() {
                    Debug.info('APIキー設定状況確認中...');
                    
                    const apiKeySetting = wp.customize('youtube_api_key');
                    if (apiKeySetting) {
                        const apiKey = apiKeySetting.get();
                        Debug.success('APIキー設定値:', apiKey ? '[設定済み]' : '[未設定]');
                        
                        if (!apiKey || apiKey.trim() === '') {
                            Debug.warning('YouTube Data APIキーが設定されていません');
                            Debug.info('設定方法: カスタマイザー > 動画セクション > YouTube Data API キー');
                        } else {
                            Debug.success('YouTube Data APIキーが設定済みです');
                            Debug.info('APIキー長:', apiKey.length + ' 文字');
                        }
                    } else {
                        Debug.error('youtube_api_key設定が見つかりません');
                    }
                    
                    // 動画設定の現在値も確認
                    Debug.info('現在の動画設定:');
                    for (let i = 1; i <= 3; i++) {
                        const urlSetting = wp.customize('video_' + i + '_url');
                        const titleSetting = wp.customize('video_' + i + '_title');
                        
                        if (urlSetting && titleSetting) {
                            const url = urlSetting.get();
                            const title = titleSetting.get();
                            Debug.info(`Video ${i}:`);
                            Debug.info(`  URL: ${url || '(未設定)'}`);
                            Debug.info(`  Title: ${title || '(未設定)'}`);
                        }
                    }
                }, 500);
            });
        });
    } else {
        Debug.info('WordPress Customizer API環境ではありません（通常のフロントエンド表示）');
    }

    // カスタマイザー画面での通知表示
    function showCustomizerNotification(message, type = 'info') {
        if (typeof wp !== 'undefined' && wp.customize && wp.customize.notifications) {
            const notification = new wp.customize.Notification('youtube_video_fetch', {
                message: message,
                type: type, // 'info', 'success', 'warning', 'error'
                dismissible: true
            });
            
            wp.customize.notifications.add('youtube_video_fetch', notification);
            
            // 5秒後に自動で非表示
            setTimeout(function() {
                wp.customize.notifications.remove('youtube_video_fetch');
            }, 5000);
        }
    }

})(jQuery);