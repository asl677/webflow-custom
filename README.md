# Webflow Custom Animation System

Advanced animation system for the Alex Lakas portfolio website featuring mask reveals, infinite scroll, text effects, and interactive elements.

## Current Stable Version

**Commit: `fdc73e2`** - Stable baseline with working mask animations and click toggle functionality.

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

## Stable Version Rules

**Reference Commit: `fdc73e2`** [[memory:8072505]]

**Core Principle**: Mask reveals should be dead simple - just expanding one container width and optionally scaling the inner image.

Future changes should reference this stable baseline and avoid overcomplicating the basic mask logic.

## Dependencies

- **GSAP** - Animation library (loaded automatically)
- **ScrollTrigger** - Scroll-based animations (loaded automatically)
- **Webflow** - Platform compatibility ensured

## Browser Support

- Modern browsers with ES6+ support
- Mobile Safari and Chrome optimized
- Fallback handling for missing GSAP

---

*Last Updated: Current with stable commit `fdc73e2`*