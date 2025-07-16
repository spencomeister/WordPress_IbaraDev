<?php
/**
 * カスタマイザーデータ確認用デバッグファイル
 * 使用方法: このファイルをテーマフォルダに置いて、ブラウザで直接アクセス
 * 例: http://yourdomain.com/wp-content/themes/WordPress_IbaraDev/debug-customizer-data.php
 */

// WordPressを読み込む
require_once('../../../../wp-load.php');

// 管理者権限チェック
if (!current_user_can('manage_options')) {
    die('このページを表示する権限がありません。');
}

echo '<h1>カスタマイザーデータ確認</h1>';
echo '<style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    pre { background: #f5f5f5; padding: 10px; overflow-x: auto; }
</style>';

// 動画データを取得
echo '<h2>動画セクションのデータ</h2>';
echo '<table>';
echo '<tr><th>設定キー</th><th>設定値</th></tr>';

for ($i = 1; $i <= 3; $i++) {
    $title = get_theme_mod("video_{$i}_title", '');
    $desc = get_theme_mod("video_{$i}_desc", '');
    $url = get_theme_mod("video_{$i}_url", '');
    
    echo "<tr><td>video_{$i}_title</td><td>" . esc_html($title) . "</td></tr>";
    echo "<tr><td>video_{$i}_desc</td><td>" . esc_html($desc) . "</td></tr>";
    echo "<tr><td>video_{$i}_url</td><td>" . esc_html($url) . "</td></tr>";
}

echo '</table>';

// 全てのテーマモッズを表示
echo '<h2>全テーマカスタマイザーデータ</h2>';
$theme_mods = get_theme_mods();
echo '<pre>';
print_r($theme_mods);
echo '</pre>';

// データベースの生データを表示
echo '<h2>データベース生データ</h2>';
$theme_name = get_option('stylesheet');
$raw_data = get_option("theme_mods_$theme_name");
echo '<p><strong>オプション名:</strong> theme_mods_' . $theme_name . '</p>';
echo '<pre>';
print_r($raw_data);
echo '</pre>';
?>
