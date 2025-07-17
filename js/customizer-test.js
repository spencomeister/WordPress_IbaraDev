/**
 * カスタマイザー用JavaScript - テスト版
 */

// 最初に即座に実行される確認
console.log('🔥 TEST: customizer-test.js loaded!');
window.customizerTestLoaded = true;

// WordPress環境チェック
if (typeof wp !== 'undefined' && wp.customize) {
    console.log('✅ WordPress Customizer API available');
} else {
    console.log('❌ WordPress Customizer API not available');
}

// jQuery チェック
if (typeof jQuery !== 'undefined') {
    console.log('✅ jQuery available');
    
    (function($) {
        console.log('✅ jQuery $ alias working in IIFE');
        
        // 簡単な手動テスト関数
        window.testCustomizerConnection = function() {
            console.log('🧪 Manual test function called');
            
            if (typeof vtuberAjax !== 'undefined') {
                console.log('✅ vtuberAjax available:', vtuberAjax);
            } else {
                console.log('❌ vtuberAjax not available');
            }
            
            // URL入力フィールドの確認
            const urlFields = $('input[data-customize-setting-link*="video"][data-customize-setting-link*="url"]');
            console.log('📋 URL input fields found:', urlFields.length);
            
            return true;
        };
        
    })(jQuery);
} else {
    console.log('❌ jQuery not available');
}

console.log('🏁 TEST: customizer-test.js execution completed');
