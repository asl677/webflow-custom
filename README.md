# Webflow Custom Code Repository

Custom JavaScript and CSS files for the Alex Lakas portfolio website.

## GSAP Stagger Animations

Enhanced image and content staggering animations using GSAP and ScrollTrigger.

### Implementation in Webflow

Add this single line to your Webflow project's **Custom Code** section:

**Project Settings → Custom Code → Before `</body>` tag:**

```html
<script src="https://raw.githubusercontent.com/asl677/webflow-custom/main/scripts/stagger-animations.js"></script>
```

### What it does:

- ✨ **Staggered image animations** - Images fade in with smooth timing as you scroll
- 🎯 **Scroll-triggered** - Animations only play when elements come into view  
- 📱 **Performance optimized** - Animations run once and don't repeat
- 🔧 **Auto-refreshing** - Handles font loading and resize events
- ⚡ **All-in-one** - Loads GSAP dependencies automatically

### Animation Details:

- **Images**: Fade in from bottom with scale and rotation effect (0.12s stagger)
- **Components**: Subtle entrance animation (0.08s stagger)
- **Headings**: Smooth text animation (0.05s stagger)
- **Timing**: Triggers 80px before elements enter viewport
- **Duration**: 0.6-1.2 seconds per element

### Files Structure:

```
scripts/
├── stagger-animations.js   # All-in-one script (include this in Webflow)
├── gsap-loader.js          # Legacy loader (not needed anymore)
└── animations.js           # Original animations
```

## Usage

1. **Copy the script tag above** 
2. **Paste into Webflow** Custom Code section
3. **Publish your site**
4. **Enjoy smooth staggered animations!**

## Features

- 🔄 **Preloader compatible** - Waits for existing preloaders to complete
- 🎯 **Smart targeting** - Excludes preloader elements from animations
- 📊 **Debug logging** - Console logs show initialization progress
- 🔧 **One file only** - No need for separate loader script

## Customization

To modify animation timing or effects, edit `scripts/stagger-animations.js` and commit changes to this repo. The animations will update automatically on your live site. 