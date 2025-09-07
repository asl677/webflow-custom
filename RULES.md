# Webflow Custom Animation System

Advanced animation system for the Alex Lakas portfolio website featuring mask reveals, infinite scroll, text effects, and interactive elements.

## Current Stable Version

**Commit: `32b9b02`** - **STABLE V4** - Unified mask animation system with mobile-desktop parity and perfect cloned image handling.

**Previous Stable: `fed8c2f`** - STABLE V4 (deprecated) - Had mobile-specific issues.
**Previous Stable: `f0b8715`** - STABLE V3 with working text animations, link hover effects, and infinite scroll.

## Implementation in Webflow

Add this single line to your Webflow project's **Custom Code** section:

**Project Settings → Custom Code → Before `</body>` tag:**

```html
<script src="https://raw.githubusercontent.com/asl677/webflow-custom/main/scripts/animations.js"></script>
```

## Core Features

### 🎭 **Mask Reveal Animations**
- **Simple Logic**: Container with `width:0px` and `overflow:hidden`, image at full size inside
- **Animation**: GSAP expands container width from 0 → full width
- **Optional**: Image scaling during reveal (parallax effect)
- **Class Name**: Uses `mask-wrap` to avoid Webflow conflicts

### 🔄 **Infinite Scroll System**
- **Smart Cloning**: Duplicates content sections for seamless scrolling
- **Duplicate Prevention**: Skips already processed elements
- **Dimension Handling**: Proper width/height calculation for cloned images
- **Performance**: Mobile-optimized with reduced initial animations

### 📝 **Text Scramble Effects**
- **Character Animation**: Random character cycling before revealing text
- **Device Optimized**: Different speeds and characters for mobile/desktop
- **Staggered Timing**: Sequential reveal across multiple text elements

### 🧭 **Navigation Protection**
- **ScrollTrigger Safety**: Prevents nav fading during refresh operations
- **Important Overrides**: Forces visibility with CSS priority
- **Multi-Nav Support**: Handles `.nav`, `.fake-nav`, and `.w-layout-grid.nav`

### 🖱️ **Interactive Click Toggle**
- **Image Sizing**: Click anywhere to fit all images to window width
- **Aspect Ratio**: Maintains proportions during resize
- **Smooth Transition**: 0.3s ease animation
- **Smart Detection**: Skips interactive elements (links, buttons, nav)

### ⏳ **Advanced Preloader**
- **Countdown Timer**: Animated digit counting
- **Smooth Transitions**: Fade out with GSAP or CSS fallback
- **State Management**: Loading/ready body classes
- **Mobile Optimization**: Faster loading on mobile devices

## File Structure

```
scripts/
├── animations.js           # Main animation system (USE THIS)
└── gsap-loader.js          # Legacy GSAP loader (deprecated)

styles/
└── animations.css          # Supporting CSS styles
```

## Technical Implementation

### Mask Animation Core Logic
```javascript
// 1. Create container
maskContainer = document.createElement('div');
maskContainer.className = 'mask-wrap';
maskContainer.style.cssText = `width:0px;height:${height}px;overflow:hidden;...`;

// 2. Wrap image
parent.insertBefore(maskContainer, image);
maskContainer.appendChild(image);

// 3. Animate width expansion
window.gsap.to(maskContainer, { 
  width: targetWidth + 'px',
  duration: 1.2,
  ease: "power2.out"
});
```

### Key Classes and Selectors
- **`.mask-wrap`** - Mask reveal containers
- **`[data-mask-setup]`** - Processed elements
- **`[data-infinite-clone]`** - Cloned scroll content
- **`.img-parallax`** - Images with scale effects

## Performance Features

- **Mobile Detection**: Reduced animations on small screens
- **Viewport Optimization**: Only animates visible elements initially
- **ScrollTrigger**: Efficient scroll-based trigger system
- **Memory Management**: Proper cleanup of animations and events

## Debugging

Console logs provide detailed information:
- 🎭 Mask animation progress
- 🔧 Image processing details
- 🔄 Infinite scroll operations
- 📱 Mobile/desktop detection

## Customization Guidelines

### ✅ Safe Changes
- Animation timing and easing
- Stagger delays and durations
- Mobile optimization thresholds
- Console logging verbosity

### ⚠️ Avoid Changing
- Core mask reveal logic (container width expansion)
- Class names (`mask-wrap`, data attributes)
- Infinite scroll cloning system
- ScrollTrigger refresh handling

## Development Rules

### 📝 **Commit Message Format**
Use short, focused commit messages with exactly **3 bullet points**:

```
Brief title describing the main change

- First specific change or fix
- Second specific change or improvement  
- Third specific change or addition
```

**Example:**
```
Fix mask animation flickering on scroll

- Skip duplicate mask setup on cloned images
- Add maskSetup flag to prevent re-processing
- Improve console logging for debugging
```

**Guidelines:**
- **Title**: One line summary (50 chars max)
- **Bullets**: Specific, actionable changes
- **Focus**: Each bullet should be a distinct change
- **Clarity**: Technical but readable

## Stable Version Rules

**Reference Commit: `fdc73e2`** [[memory:8072505]]

**Core Principle**: Mask reveals should be dead simple - just expanding one container width and optionally scaling the inner image.

Future changes should reference this stable baseline and avoid overcomplicating the basic mask logic.

## Dependencies

- **GSAP** - Animation library (loaded automatically)
- **ScrollTrigger** - Scroll-based animations (loaded automatically)
- **Webflow** - Platform compatibility ensured

## Webflow MCP Server Integration

### 🔧 **MCP Configuration**

The project includes Webflow MCP (Model Context Protocol) server for programmatic site management:

```json
{
  "mcpServers": {
    "webflow": {
      "command": "npx",
      "args": ["-y", "webflow-mcp-server@0.3.0"],
      "env": {
        "WEBFLOW_TOKEN": "your_token_here"
      }
    }
  }
}
```

### 🎯 **MCP Capabilities**

- **Site Management**: List and get site information
- **Page Operations**: List pages, update metadata, get/update content
- **Collection Management**: Create/update collections and fields
- **Item Operations**: Create/update/publish collection items
- **Publishing**: Publish sites and individual items

### 📝 **Common MCP Operations**

```javascript
// List all sites
mcp_webflow_sites_list

// Get site details
mcp_webflow_sites_get({ site_id: "your_site_id" })

// List pages
mcp_webflow_pages_list({ site_id: "your_site_id" })

// Update page content
mcp_webflow_pages_update_static_content({
  page_id: "page_id",
  localeId: "locale_id", 
  nodes: [{ nodeId: "node_id", text: "new_text" }]
})

// Publish site
mcp_webflow_sites_publish({ 
  site_id: "your_site_id",
  publishToWebflowSubdomain: true 
})
```

### ⚠️ **MCP Usage Guidelines**

- **Content Updates**: Use MCP for programmatic content updates
- **Animation Files**: Deploy animation changes via GitHub, not MCP
- **Site Structure**: Avoid changing site structure through MCP during active development
- **Publishing**: Test changes on staging before publishing to live domain

### 🔐 **Security Notes**

- **Token Management**: Webflow API token is configured in MCP settings
- **Permissions**: Token has full site access - use carefully
- **Rate Limits**: Respect Webflow API rate limitations
- **Backup**: Always backup before bulk operations

## Browser Support

- Modern browsers with ES6+ support
- Mobile Safari and Chrome optimized
- Fallback handling for missing GSAP

---

*Last Updated: Current with **STABLE V4** commit `fed8c2f` - Unified image masking system*