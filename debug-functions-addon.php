<?php
/**
 * functions.phpに追加する一時的なデバッグコード
 * 管理者でログイン時のみ、ページ下部にデータを表示
 */

// デバッグ用：カスタマイザーデータを表示（管理者のみ）
function debug_customizer_video_data() {
    if (!current_user_can('manage_options')) {
        return;
    }
    
    echo '<div style="background: #fff; border: 2px solid #0073aa; padding: 15px; margin: 20px; font-family: monospace;">';
    echo '<h3>🎬 動画カスタマイザーデータ（デバッグ用）</h3>';
    
    for ($i = 1; $i <= 3; $i++) {
        echo "<h4>動画 {$i}:</h4>";
        echo "<ul>";
        echo "<li><strong>Title:</strong> " . esc_html(get_theme_mod("video_{$i}_title", '未設定')) . "</li>";
        echo "<li><strong>Description:</strong> " . esc_html(get_theme_mod("video_{$i}_desc", '未設定')) . "</li>";
        echo "<li><strong>URL:</strong> " . esc_html(get_theme_mod("video_{$i}_url", '未設定')) . "</li>";
        echo "</ul>";
    }
    
    echo '<h4>JavaScriptに渡されるデータ（修正後）:</h4>';
    echo '<pre>';
    // New video data format being passed to JavaScript
    $video_data = array();
    for ($i = 1; $i <= 3; $i++) {
        $video_data['video_' . $i] = array(
            'title' => get_theme_mod('video_' . $i . '_title', ''),
            'description' => get_theme_mod('video_' . $i . '_desc', ''),
            'url' => get_theme_mod('video_' . $i . '_url', ''),
        );
    }
    print_r($video_data);
    echo '</pre>';
    
    echo '<h4>旧形式のデータ（参考）:</h4>';
    echo '<pre>';
    $video_titles = array(
        'video_1' => get_theme_mod('video_1_title', ''),
        'video_2' => get_theme_mod('video_2_title', ''),
        'video_3' => get_theme_mod('video_3_title', ''),
    );
    print_r($video_titles);
    echo '</pre>';
    echo '</div>';
}

// フロントエンドのフッターに表示（管理者のみ）
add_action('wp_footer', 'debug_customizer_video_data');
?>
