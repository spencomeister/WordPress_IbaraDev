<!--
IbaraDev VTuber Landing Page Theme v2.0.0
Footer Template
-->
<!-- Footer -->
<footer role="contentinfo">
    <div class="container">
        <p>&copy; <?php echo esc_html(date('Y')); ?> <?php echo esc_html(get_bloginfo('name')); ?>. All rights reserved.</p>
        
        <?php if (get_theme_mod('footer_social_links', true)) : ?>
        <div class="footer-social" aria-label="Social media links">
            <!-- Footer social links could be added here if needed -->
        </div>
        <?php endif; ?>
        
        <?php
        // Footer menu if it exists
        wp_nav_menu(array(
            'theme_location' => 'footer',
            'menu_class' => 'footer-links',
            'container' => 'nav',
            'container_class' => 'footer-nav',
            'container_aria_label' => 'Footer navigation',
            'depth' => 1,
            'fallback_cb' => false
        ));
        ?>
    </div>
</footer>

<?php wp_footer(); ?>

<!-- Performance monitoring -->
<script>
if ('performance' in window && 'measure' in window.performance) {
    window.addEventListener('load', function() {
        // Log performance metrics for debugging
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
            console.log('🚀 Page Load Performance:', {
                domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
                loadComplete: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
                totalTime: Math.round(perfData.loadEventEnd - perfData.fetchStart)
            });
        }
    });
}
</script>

</body>
</html>
