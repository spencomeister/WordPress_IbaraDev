# IbaraDevilRoze VTuber Landing Page Theme

Modern WordPress theme designed specifically for individual VTubers with a clean white/black base design, purple accents, and dark mode toggle functionality.

## 🎨 Design Features

### Modern Color Scheme
- **Light Mode**: White background with black text and purple accents
- **Dark Mode**: Black background with white text and purple accents
- **Accent Color**: Beautiful purple gradient (`#8b5cf6` to `#a78bfa`)
- **Seamless transition** between light and dark modes

### Key Visual Elements
- Clean, minimalist design with modern typography (Inter font)
- Large hero section with character key visual (4000x2000 optimized)
- Smooth animations and hover effects
- Card-based layout for content sections
- Professional purple gradient accents throughout

## 🌓 Dark Mode Implementation

- **Automatic detection** of system preference
- **Manual toggle** button in header
- **Persistent setting** using localStorage
- **Smooth transitions** between themes
- **CSS variables** for easy color management

## 📱 Responsive Design

Fully responsive across all devices:
- **Desktop**: Full layout with sidebar navigation
- **Tablet**: Optimized grid layouts
- **Mobile**: Stacked sections with touch-friendly interfaces

### Breakpoints
- 1024px and below: Tablet optimization
- 768px and below: Mobile layout
- 480px and below: Small mobile adjustments

## 🏗️ Structure

### Files
```
WordPress_IbaraDev/
├── style.css          # Main stylesheet with CSS variables
├── index.php          # Main template file
├── functions.php      # WordPress functions and customizer
├── preview.html       # Static preview file
├── js/
│   └── main.js       # JavaScript for interactions and dark mode
├── images/
│   ├── ibaradevilroze-keyvisual-trans.png  # Main character image
│   ├── logo-black-trans.png                # Logo for light mode
│   └── logo-white-trans.png                # Logo for dark mode
└── README.md         # This file
```

### Sections
1. **Hero Section**: Large character image with name and social links
2. **About Section**: Personal introduction with profile image
3. **Achievements Section**: Grid of accomplishment cards
4. **Videos Section**: Recommended content showcase
5. **Contact Section**: Professional contact form

## ⚙️ WordPress Customizer Options

### VTuber Information
- VTuber Name
- Subtitle/Tagline
- Description text

### Social Links
- YouTube URL
- Twitter URL
- Discord URL
- Twitch URL
- Niconico URL

### About Section
- About text (3 paragraphs)
- Profile image filename

### Achievements Section
- 4 customizable achievement cards
- Title and description for each

### Videos Section
- 3 customizable video cards
- Title and description for each

## 🎮 Technical Features

### Performance Optimizations
- Optimized CSS with minimal redundancy
- Efficient JavaScript with throttled scroll events
- Image optimization settings
- Minified external resources

### Security
- Nonce verification for forms
- Input sanitization
- XSS protection headers
- Secure AJAX handling

### SEO Friendly
- Semantic HTML5 structure
- Proper heading hierarchy
- Alt text for images
- Meta descriptions support

## 🚀 Installation

1. Upload theme files to `/wp-content/themes/vtuber-landing/`
2. Activate theme in WordPress admin
3. Go to Customizer to configure VTuber information
4. Upload character images to `/images/` folder
5. Customize colors and content as needed

## 📋 Image Requirements

### Main Character Image
- **Filename**: `ibaradevilroze-keyvisual-trans.png`
- **Dimensions**: 4000x2000px (optimized for 16:9 display)
- **Format**: PNG with transparency
- **Size**: Recommended under 2MB

### Profile Images
- **About Image**: `about-icon-trans.png` - 280x280px minimum, transparent PNG format
- **Logo Images**: `logo-black-trans.png` / `logo-white-trans.png` - Transparent PNG format for light/dark mode
- **Social Icons**: Font Awesome icons used

## 🛠️ Customization

### Color Scheme
Colors are defined as CSS variables in `:root` for easy customization:

```css
:root {
  --accent-purple: #8b5cf6;
  --accent-purple-light: #a78bfa;
  --accent-purple-dark: #7c3aed;
  /* ... more variables */
}
```

### Dark Mode
Dark mode colors are automatically applied using CSS variables with `[data-theme="dark"]` selector.

### Typography
Using Inter font family for modern, clean readability across all devices.

## 📱 Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔄 Version History

### v2.0.0 (Current)
- Complete redesign with white/black + purple theme
- Added dark mode toggle functionality
- Improved responsive design
- Enhanced accessibility features
- Performance optimizations

### v1.0.0
- Initial purple gradient theme
- Basic responsive layout
- Contact form functionality

## 📞 Support

For theme support or customization requests, please use the contact form on the website or reach out through the provided social media links.

## 📄 License

This theme is designed specifically for IbaraDevilRoze. Unauthorized distribution or modification is not permitted.

---

**Theme**: IbaraDevilRoze VTuber Landing Page  
**Version**: 2.0.0  
**Design**: Modern White/Black + Purple Accent with Dark Mode  
**Developer**: IbaraDev  
**Last Updated**: 2024

## ⚡ Loading Screen

### Interactive Loading Experience
- **Animated logo images** with theme-aware switching (black/white)
- **Real-time progress bar** with loading percentage
- **Dynamic loading messages** showing current process
- **Smooth animations** with purple accent colors
- **Resource monitoring** that tracks actual asset loading
- **Dark mode support** with automatic logo switching
- **Error handling** with fallback text if images fail to load

### Loading Features
- Progress bar with animated shine effect
- Bouncing dots animation  
- Fade-in text animations
- **Smart logo switching**: Black logo for light mode, white logo for dark mode
- **Automatic theme detection**: Responds to system preference and manual toggle
- Logo floating animation with drop shadow effects
- Seamless transition to main content
- Responsive design for all screen sizes
- **Image fallback**: Shows text logo if image files are missing

### Loading Steps
1. Connecting...
2. Loading fonts...
3. Loading stylesheets...
4. Loading images...
5. Loading assets...
6. Initializing components...
7. Setting up animations...
8. Finalizing...
9. Welcome to my world!
