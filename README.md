# Webflow Custom Code Repository

Custom JavaScript and CSS files for the Alex Lakas portfolio website.

## GSAP Stagger Animations

Enhanced image and content staggering animations using GSAP and ScrollTrigger.

### Implementation in Webflow

Add this single line to your Webflow project's **Custom Code** section:

**Project Settings → Custom Code → Before `</body>` tag:**

```html
<script src="https://raw.githubusercontent.com/asl677/webflow-custom/main/scripts/gsap-loader.js"></script>
```

### What it does:

- ✨ **Staggered image animations** - Images fade in with smooth timing as you scroll
- 🎯 **Scroll-triggered** - Animations only play when elements come into view  
- 📱 **Performance optimized** - Animations run once and don't repeat
- 🔧 **Auto-refreshing** - Handles font loading and resize events

### Animation Details:

- **Images**: Fade in from bottom with scale effect (0.15s stagger)
- **Project cards**: Subtle entrance animation (0.1s stagger)
- **Timing**: Triggers 100px before elements enter viewport
- **Duration**: 0.6-0.8 seconds per element

### Files Structure:

```
scripts/
├── gsap-loader.js          # Main loader (include this in Webflow)
└── stagger-animations.js   # Custom animation logic
```

## Usage

1. **Copy the script tag above** 
2. **Paste into Webflow** Custom Code section
3. **Publish your site**
4. **Enjoy smooth staggered animations!**

## Customization

To modify animation timing or effects, edit `scripts/stagger-animations.js` and commit changes to this repo. The animations will update automatically on your live site. 