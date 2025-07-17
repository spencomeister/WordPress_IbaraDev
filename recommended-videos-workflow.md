# おすすめ動画セクション - 動画タイトル取得ワークフロー

## システム概要

このドキュメントは、WordPressテーマ「IbaraDev VTuber Landing Page」のおすすめ動画セクションにおける、YouTube Data APIを使用した動画タイトル自動取得機能のワークフローを詳細に説明します。

## アーキテクチャ概要

```
WordPress管理画面（カスタマイザー）
    ↓
フロントエンド（JavaScript - customizer.js）
    ↓
AJAX リクエスト
    ↓
バックエンド（PHP - functions.php）
    ↓
YouTube Data API
    ↓
動画情報取得・保存
```

## 詳細ワークフロー

### 1. カスタマイザーでの設定

#### 1.1 初期設定
- **場所**: `functions.php` (行490-520)
- **カスタマイザーセクション**: `videos_section`
- **設定項目**:
  - `youtube_api_key`: YouTube Data API キー
  - `video_1_title`, `video_2_title`, `video_3_title`: 各動画のタイトル
  - `video_1_url`, `video_2_url`, `video_3_url`: 各動画のURL
  - `video_1_description`, `video_2_description`, `video_3_description`: 各動画の説明

#### 1.2 APIキー設定
```php
$wp_customize->add_setting('youtube_api_key', array(
    'default' => '',
    'sanitize_callback' => 'sanitize_text_field',
));
```

### 2. フロントエンド（JavaScript）処理

#### 2.1 初期化プロセス
- **ファイル**: `js/customizer.js`
- **実行タイミング**: DOM読み込み完了後（1秒遅延）

```javascript
$(document).ready(function() {
    setTimeout(function() {
        // URL入力フィールドにイベントリスナーを設定
        for (let i = 1; i <= 3; i++) {
            setupVideoUrlHandler(i);
        }
    }, 1000);
});
```

#### 2.2 URL入力監視
```javascript
urlInput.on('input blur paste change', function() {
    const url = $(this).val().trim();
    
    // デバウンス処理（500ms）
    timeoutId = setTimeout(function() {
        fetchVideoInfo(url, i);
    }, 500);
});
```

#### 2.3 YouTube URL検証
```javascript
const youtubeRegex = /(?:youtube\.com|youtu\.be)/;
if (!youtubeRegex.test(url)) {
    return; // YouTube URLでない場合は処理しない
}
```

#### 2.4 重複チェック
```javascript
const currentTitle = titleInput.val().trim();
if (currentTitle && currentTitle !== '取得中...' && currentTitle !== '取得失敗') {
    return; // すでにタイトルが設定されている場合はスキップ
}
```

### 3. AJAX通信

#### 3.1 リクエスト送信
```javascript
$.ajax({
    url: vtuberAjax.ajaxurl,
    type: 'POST',
    data: {
        action: 'get_video_info',
        url: url,
        nonce: vtuberAjax.nonce
    },
    timeout: 15000,
    // ... レスポンス処理
});
```

#### 3.2 セキュリティ
- **Nonce検証**: `wp_ajax_nonce` を使用
- **権限チェック**: `current_user_can('customize')`

### 4. バックエンド（PHP）処理

#### 4.1 AJAX ハンドラー
- **関数**: `ajax_get_video_info()` (functions.php 行1137-1203)
- **アクション**: `wp_ajax_get_video_info`

#### 4.2 セキュリティチェック
```php
if (!check_ajax_referer('video_info_nonce', 'nonce', false)) {
    wp_send_json_error(array(
        'message' => 'セキュリティチェックに失敗しました。',
        'debug' => 'Invalid nonce'
    ));
    return;
}
```

#### 4.3 URL検証とAPIキーチェック
```php
// YouTube URLかチェック
if (!preg_match('/(?:youtube\.com|youtu\.be)/', $url)) {
    wp_send_json_error(...);
}

// APIキーの存在チェック
$api_key = get_theme_mod('youtube_api_key');
if (empty($api_key)) {
    wp_send_json_error(...);
}
```

### 5. YouTube Data API 通信

#### 5.1 動画情報取得関数
- **関数**: `get_youtube_video_info($url)` (functions.php 行1002-1120)

#### 5.2 動画ID抽出
```php
function extract_youtube_video_id($url) {
    $pattern = '/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/';
    preg_match($pattern, $url, $matches);
    return isset($matches[1]) ? $matches[1] : false;
}
```

#### 5.3 API キャッシュ機能
```php
$cache_key = 'youtube_data_api_' . $video_id;
$cached_info = get_transient($cache_key);

if ($cached_info !== false) {
    return $cached_info; // キャッシュがある場合は即座に返す
}
```

#### 5.4 API リクエスト構築
```php
$api_url = 'https://www.googleapis.com/youtube/v3/videos?' . http_build_query(array(
    'id' => $video_id,
    'part' => 'snippet',
    'key' => $api_key,
    'fields' => 'items(snippet(title,description,channelTitle,thumbnails))'
));
```

#### 5.5 レスポンス処理
```php
$response = wp_remote_get($api_url, array(
    'timeout' => 15,
    'user-agent' => 'WordPress/' . get_bloginfo('version'),
    'headers' => array('Accept' => 'application/json'),
));
```

### 6. データ処理とサニタイズ

#### 6.1 文字エンコーディング処理
- **関数**: `decode_youtube_title($title)` (functions.php 行1228-1245)

```php
function decode_youtube_title($title) {
    // Unicodeエスケープをデコード
    $title = preg_replace_callback('/\\\\u([0-9a-fA-F]{4})/', function($match) {
        return mb_convert_encoding(pack('H*', $match[1]), 'UTF-8', 'UCS-2BE');
    }, $title);
    
    // HTMLエンティティをデコード
    $title = html_entity_decode($title, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    
    return trim($title);
}
```

#### 6.2 サムネイル URL 優先順位
1. `maxres` (最高解像度)
2. `high` (高解像度)
3. `medium` (中解像度)
4. フォールバック: `https://img.youtube.com/vi/{video_id}/maxresdefault.jpg`

#### 6.3 データ構造
```php
$video_info = array(
    'title' => sanitize_text_field($title),
    'thumbnail' => esc_url_raw($thumbnail_url),
    'thumbnail_medium' => esc_url_raw($thumbnail_medium_url),
    'channel_title' => sanitize_text_field($channel_title),
    'video_id' => $video_id,
);
```

### 7. キャッシュとパフォーマンス

#### 7.1 Transient API キャッシュ
```php
// キャッシュに24時間保存
set_transient($cache_key, $video_info, 24 * HOUR_IN_SECONDS);
```

#### 7.2 デバウンス処理
- JavaScript側で500msのデバウンス
- 連続した入力をまとめて処理

### 8. エラーハンドリング

#### 8.1 JavaScript側エラー処理
```javascript
success: function(response) {
    if (response.success && response.data && response.data.title) {
        titleInput.val(response.data.title);
    } else {
        titleInput.val('取得失敗');
        console.error('動画情報取得失敗:', response);
    }
},
error: function(xhr, status, error) {
    titleInput.val('取得失敗');
    console.error('AJAX Error:', {status, error, responseText: xhr.responseText});
}
```

#### 8.2 PHP側エラーレスポンス
- セキュリティエラー
- 権限エラー  
- URL形式エラー
- APIキー未設定エラー
- API通信エラー

### 9. デバッグ機能

#### 9.1 コンソールログ
```javascript
console.log('Fetching video info for:', url);
console.log('タイトル設定完了:', response.data.title);
```

#### 9.2 WordPressデバッグログ
```php
if (defined('WP_DEBUG') && WP_DEBUG) {
    error_log('YouTube Data API Response: ' . $body);
}
```

## 設定手順

### 1. YouTube Data API キー取得
1. [Google Cloud Console](https://console.developers.google.com/) にアクセス
2. プロジェクト作成
3. YouTube Data API v3 を有効化
4. 認証情報でAPIキー作成

### 2. WordPress カスタマイザー設定
1. 外観 > カスタマイズ > 動画セクション
2. YouTube Data API キーを入力
3. 動画URLを入力（タイトルが自動取得される）

## トラブルシューティング

### よくある問題

#### 1. タイトルが「取得失敗」と表示される
- APIキーが未設定または無効
- 動画が非公開・削除済み
- API利用制限に達している

#### 2. タイトルが保存されない
- カスタマイザーで「公開」ボタンを押していない
- ブラウザキャッシュの問題

#### 3. 文字化けが発生する
- `decode_youtube_title()` 関数の処理を確認
- UTF-8エンコーディングの問題

### デバッグ方法
1. ブラウザの開発者ツールでコンソールログを確認
2. WordPress の `WP_DEBUG` を有効にしてエラーログを確認
3. ネットワークタブでAJAXリクエストの内容を確認

## パフォーマンス最適化

1. **キャッシュ活用**: 24時間のTransientキャッシュ
2. **デバウンス処理**: 500msの入力遅延
3. **タイムアウト設定**: 15秒のAPI通信タイムアウト
4. **最小限のAPIフィールド**: `fields` パラメータで必要な情報のみ取得

---

このワークフローにより、ユーザーはYouTube URLを入力するだけで自動的に動画タイトルとサムネイルが取得され、ランディングページに美しく表示されます。
