# IbaraDevilRoze VTuber Landing Page Theme

Modern WordPress theme designed specifically for individual VTubers with a clean white/black base design, purple accents, and comprehensive content management system.

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
- Responsive design for all devices

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
- **Small Mobile**: Ultra-compact layouts for screens down to 320px

### Breakpoints
- 1024px and below: Tablet optimization
- 768px and below: Mobile layout
- 480px and below: Small mobile adjustments
- 320px and below: Ultra-compact mobile support

## 🏗️ File Structure

### Core Files
```
WordPress_IbaraDev/
├── style.css              # Main stylesheet with CSS variables
├── front-page.php          # Landing page template
├── page-achievements.php   # Dedicated achievements page
├── functions.php           # WordPress functions and customizer
├── header.php             # Header template with navigation
├── footer.php             # Footer template
├── single.php             # Single post template
├── home.php               # Blog home template
├── index.php              # Main template file
├── page.php               # Page template
├── category.php           # Category archive template
├── search.php             # Search results template
├── 404.php                # 404 error page
├── screenshot.png         # Theme screenshot
├── js/
│   ├── main.js           # JavaScript for interactions and dark mode
│   └── customizer.js     # YouTube Data API integration
└── images/
    ├── ibaradevilroze-keyvisual-trans.png  # Main character image
    ├── about-icon-trans.png                # About section profile image
    ├── logo-black-trans.png                # Logo for light mode
    └── logo-white-trans.png                # Logo for dark mode
```

## 📄 Page Templates

### Landing Page (front-page.php)
1. **Hero Section**: Large character image with name and social links
2. **About Section**: Personal introduction with profile image  
3. **Achievements Section**: Quick overview with link to detailed page
4. **Videos Section**: YouTube recommended content showcase with API integration
5. **News Section**: Latest blog posts with excerpts
6. **Contact Section**: Professional contact information

### Achievements Page (page-achievements.php)
- **Personal Achievements**: Individual accomplishments table
- **Business Achievements**: Professional project records
- **Responsive table design**: Maintains table structure on mobile
- **Auto-sorting**: Newest entries first
- **Custom icons**: Emoji-based achievement categories

### Blog System
- **Home page**: Post listings with excerpts (50 characters in Japanese)
- **Single posts**: Individual post pages with breadcrumbs
- **Category pages**: Categorized post archives
- **Search functionality**: Built-in WordPress search

## ⚙️ WordPress Customizer Options

### Main Page Settings
- **Main Page Title**: Header title display
- **Hero Title**: Main visual section title
- **Hero Subtitle**: Tagline/subtitle
- **Hero Image**: Key visual image filename

### VTuber Information  
- **VTuber Name**: Display name
- **Subtitle**: Professional tagline
- **Description**: Main introduction text

### Social Links
- **YouTube URL**: Channel link
- **Twitter URL**: Profile link  
- **Discord URL**: Server/profile link
- **Twitch URL**: Channel link
- **Niconico URL**: Channel link

### About Section
- **About Text**: Personal introduction (3 paragraphs)
- **Profile Image**: About section image filename

### Achievements Section (Personal)
- **Dynamic JSON data**: Customizable achievement entries
- **Fields per entry**: Icon, Date, Title, Description
- **Unlimited entries**: Add as many achievements as needed

### Business Section  
- **Dynamic JSON data**: Professional project records
- **Fields per entry**: Icon, Date, Project Name, Description
- **Client work tracking**: Separate from personal achievements

### Videos Section
- **YouTube Data API Integration**: Automatic video info retrieval
- **API Key Setting**: Google Cloud Console API key
- **Video Management**: 3 customizable video slots
- **Auto-fetch**: Title, thumbnail, channel name from YouTube URLs
- **Fallback support**: Manual entry if API unavailable

## 🎮 Technical Features

### YouTube Data API Integration
- **Automatic video info**: Fetches title, thumbnail, channel name
- **API caching**: Reduces API calls with WordPress transients
- **Error handling**: Graceful fallbacks if API fails
- **Security**: Proper nonce verification and input sanitization
- **Live preview**: Real-time updates in WordPress Customizer

### Performance Optimizations
- **Optimized CSS**: Minimal redundancy with CSS variables
- **Efficient JavaScript**: Throttled scroll events and optimized DOM manipulation
- **Image optimization**: Proper sizing and format recommendations
- **Caching support**: WordPress transient API for external data
- **Minified resources**: External dependencies optimized

### Security Features
- **Nonce verification**: CSRF protection for forms
- **Input sanitization**: All user inputs properly sanitized
- **XSS protection**: Proper escaping of all output
- **Secure AJAX**: Protected API endpoints
- **SQL injection prevention**: WordPress database API usage

### SEO & Accessibility
- **Semantic HTML5**: Proper document structure
- **ARIA labels**: Screen reader accessibility
- **Breadcrumb navigation**: Structured navigation paths
- **Alt text support**: Image accessibility
- **Proper heading hierarchy**: H1-H6 structure
- **Meta descriptions**: WordPress SEO support

### Navigation System
- **Primary navigation**: Header menu with responsive design
- **Breadcrumbs**: Contextual navigation paths
- **Sidebar menu**: Mobile-friendly hamburger menu
- **Social links**: Integrated social media navigation
- **Page-specific menus**: Achievements page integration

## 🚀 Installation & Setup

1. **Upload theme**: Place files in `/wp-content/themes/WordPress_IbaraDev/`
2. **Activate theme**: Enable in WordPress admin dashboard
3. **Configure customizer**: Set up VTuber information and content
4. **Upload images**: Add character and profile images to `/images/` folder
5. **YouTube API** (Optional): Set up Google Cloud Console API key for video integration
6. **Create achievements page**: Page automatically created on theme activation
7. **Menu setup**: Configure primary navigation menu

## 📋 Image Requirements

### Main Character Image
- **Filename**: `ibaradevilroze-keyvisual-trans.png`
- **Dimensions**: 4000x2000px (optimized for 16:9 display)
- **Format**: PNG with transparency preferred
- **Size**: Recommended under 2MB for performance

### Profile Images
- **About Image**: `about-icon-trans.png` - 280x280px minimum
- **Logo Images**: `logo-black-trans.png` / `logo-white-trans.png` - Transparent PNG format
- **Screenshot**: `screenshot.png` - 1200x900px for WordPress theme directory

### YouTube Integration
- **Thumbnails**: Automatically fetched from YouTube API
- **Fallback images**: Manual upload support if API unavailable

## 🛠️ Customization

### Color Scheme
Colors defined as CSS variables for easy customization:

```css
:root {
  --accent-purple: #8b5cf6;
  --accent-purple-light: #a78bfa;
  --accent-purple-dark: #7c3aed;
  --bg-primary: #ffffff;
  --text-primary: #1a1a1a;
  /* Dark mode automatically handled */
}
```

### Content Management
- **WordPress Customizer**: Live preview of all changes
- **JSON data structure**: Flexible achievement and business data
- **API integration**: YouTube Data API for dynamic content
- **Responsive tables**: Mobile-optimized data display

### Typography
- **Font family**: Inter font for modern readability
- **Font loading**: Optimized web font delivery
- **Responsive typography**: Scales appropriately across devices

## 📱 Browser Support

- **Chrome/Chromium**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support including iOS
- **Edge**: Full support
- **Mobile browsers**: Optimized for iOS Safari and Chrome Mobile
- **Legacy support**: Graceful degradation for older browsers

## 🔄 Version History

### v2.1.0 (Current)
- **YouTube Data API integration**: Automatic video information retrieval
- **Achievements page separation**: Dedicated achievements template
- **Enhanced responsive design**: Improved mobile table layouts
- **Navigation improvements**: Breadcrumbs and menu refinements
- **Performance optimizations**: Reduced redundancy and improved caching
- **Accessibility enhancements**: Better ARIA support and semantic structure

### v2.0.0
- **Complete redesign**: White/black + purple theme
- **Dark mode toggle**: System preference detection
- **Improved responsive design**: Better mobile experience
- **Enhanced accessibility**: WCAG compliance improvements
- **Performance optimizations**: Faster loading and rendering

### v1.0.0
- **Initial release**: Purple gradient theme
- **Basic responsive layout**: Mobile-friendly design
- **Contact form functionality**: Basic inquiry system

## 🔧 Developer Features

### Common Functions
- **`render_achievements_table()`**: Reusable table rendering
- **`render_achievements_table_header()`**: Consistent table headers
- **`get_youtube_video_info()`**: YouTube API integration
- **`extract_youtube_video_id()`**: URL parsing utility
- **`clean_youtube_title()`**: Title sanitization

### AJAX Endpoints
- **`wp_ajax_get_youtube_video_info`**: Video data retrieval
- **Contact form processing**: Secure form handling
- **Customizer integration**: Live preview updates

### WordPress Integration
- **Theme activation hooks**: Automatic page creation
- **Customizer API**: Full WordPress customizer integration
- **Menu registration**: Navigation menu support
- **Widget areas**: Sidebar widget support

## 📞 Support & Maintenance

### Regular Updates
- **Security patches**: Regular WordPress compatibility updates
- **Feature enhancements**: Based on user feedback and requirements
- **Performance monitoring**: Ongoing optimization
- **API compatibility**: YouTube API version compatibility

### Troubleshooting
- **YouTube API issues**: Check API key and quota limits
- **Image loading**: Verify file paths and permissions
- **Mobile display**: Clear caching after updates
- **Customizer preview**: Refresh preview panel if needed

## 📄 License & Usage

This theme is designed specifically for IbaraDevilRoze VTuber branding and content presentation. 

**Unauthorized distribution, modification, or commercial use is prohibited.**

---

**Theme**: IbaraDevilRoze VTuber Landing Page  
**Version**: 2.1.0  
**Design**: Modern White/Black + Purple Accent with Dark Mode  
**Developer**: IbaraDev  
**Last Updated**: July 2025  
**WordPress Compatibility**: 5.0+  
**PHP Compatibility**: 7.4+
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

## ⚡ Loading Screen (Legacy Feature)

*Note: This feature was part of the initial design but may not be currently active in the WordPress theme.*

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
