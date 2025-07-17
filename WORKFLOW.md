# WORKFLOW.md - 開発・運用ワークフロー

## 概要

このドキュメントは、WordPressテーマ「IbaraDev VTuber Landing Page v2.0」の開発・運用における詳細なワークフローを説明します。

## 🏗️ アーキテクチャ概要

### システム構成

```
WordPress Frontend
    ↓
Theme Templates (PHP)
    ↓
Customizer Interface
    ↓
JavaScript (customizer.js)
    ↓
AJAX Communication
    ↓
WordPress Backend (functions.php)
    ↓
YouTube Data API v3
    ↓
Data Storage (wp_options)
```

### 主要コンポーネント

| コンポーネント | ファイル | 役割 |
|---|---|---|
| **テーマ制御** | `functions.php` | カスタマイザー設定、API連携、AJAX処理 |
| **フロントエンド** | `customizer.js` | YouTube URL監視、タイトル自動取得 |
| **表示制御** | `front-page.php` | ランディングページのレンダリング |
| **スタイル** | `style.css` | レスポンシブデザイン |
| **UI制御** | `main.js` | ハンバーガーメニュー等のインタラクション |

## 🔄 YouTube Data API 連携ワークフロー

### Phase 1: 初期化・環境チェック

```javascript
// customizer.js - 初期化処理
$(document).ready(function() {
    setTimeout(setupUrlHandlers, 1000);
});

wp.customize.bind('ready', function() {
    setupAutoSync();
    checkApiKeyStatus();
});
```

**実行内容**:
1. WordPress Customizer環境の確認
2. DOM要素の読み込み待機（1秒遅延）
3. URL入力フィールドの検出・イベント設定
4. APIキー設定状況の確認

### Phase 2: URL入力検知・バリデーション

```javascript
// デバウンス処理付きURL監視
urlInput.on('input blur paste change', function() {
    const url = $(this).val().trim();
    
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function() {
        fetchVideoInfo(url, videoIndex);
    }, 500);
});
```

**バリデーション条件**:
- ✅ YouTube URL形式チェック (`/(?:youtube\.com|youtu\.be)/`)
- ✅ 既存タイトルの重複チェック
- ✅ 空文字・無効値の除外

### Phase 3: AJAX通信・API呼び出し

```php
// functions.php - AJAX ハンドラー
function ajax_get_video_info() {
    // セキュリティ検証
    check_ajax_referer('video_info_nonce', 'nonce');
    
    // URL検証・APIキーチェック
    $video_id = extract_youtube_video_id($url);
    $api_key = get_theme_mod('youtube_api_key');
    
    // YouTube Data API 呼び出し
    $video_info = get_youtube_video_info($url);
    
    wp_send_json_success($video_info);
}
```

**API通信フロー**:
1. **Nonce検証**: セキュリティチェック
2. **権限確認**: `current_user_can('customize')`
3. **URL解析**: 動画IDの抽出
4. **キャッシュ確認**: Transient APIでキャッシュチェック
5. **API通信**: YouTube Data API v3への認証済みリクエスト
6. **レスポンス処理**: タイトル・サムネイル・チャンネル情報の抽出

### Phase 4: データ同期・保存

```javascript
// カスタマイザー設定とDOM同期
function syncTitleToCustomizer(videoIndex, title, titleInput) {
    const setting = wp.customize('video_' + videoIndex + '_title');
    
    // 1. Customizer API更新（最優先）
    setting.set(title);
    setting._dirty = true;
    
    // 2. DOM更新
    titleInput.val(title);
    titleInput.trigger('input').trigger('change');
    
    // 3. 整合性確認・再同期
    setTimeout(function() {
        if (setting.get() !== title) {
            setting.set(title);
        }
        wp.customize.previewer.refresh();
    }, 100);
}
```

**同期処理の優先順位**:
1. **WordPress Customizer API**: `wp.customize().set()`
2. **DOM入力フィールド**: `titleInput.val()`
3. **変更フラグ設定**: `setting._dirty = true`
4. **未保存状態変更**: `wp.customize.state('saved').set(false)`
5. **整合性確認**: DOM値とCustomizer値の一致チェック
6. **プレビュー更新**: `wp.customize.previewer.refresh()`

### Phase 5: 自動同期・保存処理

```javascript
// 保存時自動同期
function setupAutoSync() {
    $(document).on('click', '#save', function() {
        setTimeout(syncAllVideos, 100);
    });
    
    wp.customize.bind('save', syncAllVideos);
}

function syncAllVideos() {
    for (let i = 1; i <= 3; i++) {
        const domValue = getTitleInputValue(i);
        const setting = wp.customize('video_' + i + '_title');
        
        if (setting && setting.get() !== domValue) {
            setting.set(domValue);
            setting._dirty = true;
        }
    }
}
```

**自動同期の利点**:
- ✅ **手動操作不要**: 保存ボタン押下時に自動実行
- ✅ **確実な保存**: DOM値とCustomizer値の完全一致保証
- ✅ **透明性**: デバッグログで処理状況を確認可能

## 🔧 開発・デバッグワークフロー

### 1. 開発環境設定

**必要な環境**:
- WordPress 5.0+
- PHP 7.4+
- YouTube Data API v3 キー
- ブラウザ開発者ツール

**デバッグモード有効化**:
```
/wp-admin/customize.php?debug=true
```

### 2. コード編集ワークフロー

#### A. 機能追加・修正時
1. **該当ファイルの特定**: 機能に応じてファイルを選択
2. **バックアップ作成**: 変更前のファイルをバックアップ
3. **コード編集**: 機能追加・修正
4. **構文チェック**: PHP/JavaScript構文エラーの確認
5. **動作テスト**: カスタマイザーでの動作確認
6. **レスポンシブテスト**: モバイル・デスクトップでの表示確認

#### B. スタイル修正時
1. **開発者ツール**: ブラウザでスタイルを調整
2. **CSS編集**: `style.css` への反映
3. **キャッシュクリア**: ブラウザ・WordPress キャッシュクリア
4. **クロスブラウザテスト**: 複数ブラウザでの確認

### 3. テスト手順

#### A. YouTube API機能テスト
```javascript
// ブラウザコンソールでの手動テスト
// 1. 環境確認
console.log('WordPress Customizer:', typeof wp !== 'undefined' && wp.customize);
console.log('jQuery:', typeof $ !== 'undefined');

// 2. APIキー確認
const apiKey = wp.customize('youtube_api_key').get();
console.log('APIキー設定:', apiKey ? '設定済み' : '未設定');

// 3. 同期状態確認
for (let i = 1; i <= 3; i++) {
    const domValue = document.querySelector(`input[data-customize-setting-link="video_${i}_title"]`)?.value;
    const customizerValue = wp.customize(`video_${i}_title`).get();
    console.log(`Video ${i} 同期状態:`, domValue === customizerValue ? '一致' : '不一致');
}
```

#### B. レスポンシブテスト
- **モバイル** (375px): iPhone SE
- **タブレット** (768px): iPad
- **デスクトップ** (1200px): PC標準解像度
- **大画面** (1920px): フルHD

#### C. パフォーマンステスト
- **ページ読み込み速度**: Google PageSpeed Insights
- **JavaScript エラー**: ブラウザコンソールでエラーチェック
- **API レスポンス時間**: Network タブでの確認

### 4. エラーハンドリング・デバッグ

#### A. よくあるエラー
| エラー | 原因 | 解決方法 |
|---|---|---|
| `WordPress Customizer環境ではありません` | 通常ページで実行 | カスタマイザー画面で実行 |
| `YouTube Data APIキーが未設定` | APIキー未入力 | カスタマイザーでAPIキー設定 |
| `タイトル入力フィールドが見つかりません` | DOM読み込み未完了 | 遅延処理で自動解決 |
| `AJAX エラー` | ネットワーク・サーバーエラー | ログ確認・再試行 |

#### B. デバッグログ確認
```javascript
// デバッグログの確認方法
// 1. ブラウザコンソールを開く (F12)
// 2. 以下のログを確認
[Customizer] WordPress Customizer 初期化完了
[Customizer] Video 1 URLハンドラー設定完了
[Customizer] YouTube Data APIキー設定済み
[Customizer] Video 1: タイトル設定完了 [動画タイトル]
```

## 🚀 デプロイ・リリースワークフロー

### 1. プリリリーステスト

#### A. 機能テスト
- [ ] YouTube URL入力→タイトル自動取得
- [ ] カスタマイザー設定→フロントエンド反映
- [ ] 保存→データベース保存確認
- [ ] レスポンシブデザイン確認

#### B. 互換性テスト
- [ ] WordPress最新版での動作確認
- [ ] 主要ブラウザでの動作確認
- [ ] PHP 7.4+ での動作確認

#### C. パフォーマンステスト
- [ ] ページ読み込み速度測定
- [ ] JavaScript エラーなし確認
- [ ] CSS レンダリング確認

### 2. バージョンアップ手順

#### A. バージョン情報更新
```php
// style.css - テーマヘッダー
/*
Theme Name: IbaraDev VTuber Landing Page
Version: 2.0.0
*/

// functions.php - バージョン定数
define('VTUBER_THEME_VERSION', '2.0.0');
```

#### B. 変更ログ作成
- 新機能の追加
- バグ修正
- パフォーマンス改善
- 破壊的変更（あれば）

#### C. リリースノート
- ユーザー向けの変更内容
- アップグレード手順
- 既知の問題・回避方法

### 3. デプロイ

#### A. ファイル準備
1. **コード最終確認**: 構文エラー・デバッグコード除去
2. **ファイル圧縮**: テーマファイル一式をZIP化
3. **メタデータ確認**: テーマ情報・バージョン確認

#### B. 本番環境展開
1. **バックアップ**: 既存テーマのバックアップ
2. **アップロード**: 新バージョンのアップロード
3. **有効化**: テーマの有効化
4. **設定確認**: カスタマイザー設定の確認
5. **動作テスト**: 本番環境での動作確認

## 📊 運用・保守ワークフロー

### 1. 定期メンテナンス

#### A. 週次チェック
- [ ] エラーログの確認
- [ ] パフォーマンス指標の確認
- [ ] ユーザーフィードバックの確認

#### B. 月次チェック
- [ ] WordPress・プラグインの更新確認
- [ ] セキュリティ脆弱性の確認
- [ ] API利用量・クォータの確認

#### C. 四半期チェック
- [ ] 機能拡張の検討
- [ ] デザイン改善の検討
- [ ] パフォーマンス最適化の検討

### 2. トラブルシューティング

#### A. ユーザーサポート
1. **問題の切り分け**: テーマ・プラグイン・WordPress本体
2. **ログ確認**: エラーログ・デバッグログの確認
3. **再現テスト**: 同環境での再現確認
4. **解決策提供**: 修正方法・回避方法の提示

#### B. 緊急対応
1. **問題の評価**: 影響範囲・緊急度の評価
2. **応急処置**: 一時的な回避方法の実装
3. **根本修正**: 問題の根本原因解決
4. **テスト・デプロイ**: 修正版のテスト・展開

## 🔮 将来の拡張計画

### Phase 1: 機能拡張
- **チャンネル統計**: 登録者数・総再生回数の表示
- **プレイリスト対応**: YouTube プレイリストからの一括取得
- **ソーシャル連携**: Twitter・Instagram の連携

### Phase 2: UX改善
- **管理画面の充実**: より直感的な設定画面
- **プレビュー機能**: リアルタイムプレビューの強化
- **アニメーション**: ページ遷移・要素表示のアニメーション

### Phase 3: パフォーマンス最適化
- **キャッシュ強化**: より効率的なキャッシュシステム
- **CDN対応**: 画像・静的ファイルのCDN配信
- **コード分割**: JavaScript の動的読み込み

---

**最終更新**: 2025年7月17日  
**バージョン**: 2.0.0  
**文書バージョン**: 1.0
