# Image Masking and Infinite Scroll Rules

## 🚨 CRITICAL RULES - READ BEFORE ANY CHANGES

### **Rule #1: Never Break the Mask Animation System**
- **STABLE BASELINE V4**: Commit `fed8c2f` represents the proven unified mask animation system
- **PREVIOUS STABLE V3**: Commit `f0b8715` with working mask animations (fallback reference)
- Original images use `style.cssText` for styling (this works)
- Cloned images must get identical treatment to original images
- If mask animations break, revert to this stable commit immediately

### **Rule #2: Cloned Image Visibility Rules**
- **NEVER** use aggressive `!important` hiding on cloned images that can't be overridden
- **NEVER** use `setProperty('opacity', '0', 'important')` and `setProperty('visibility', 'hidden', 'important')` together
- **ALWAYS** let the mask system handle visibility naturally
- If hiding is necessary, use regular CSS properties without `!important`

### **Rule #3: CSS Override Hierarchy**
- `style.cssText` works for initial setup but **cannot override** individual `setProperty` calls with `!important`
- To override `!important` styles, you **must** use `setProperty()` with `'important'` parameter
- **Test override success**: Always verify with `getComputedStyle()` after setting styles
- **Order matters**: Last `setProperty` with `!important` wins

### **Rule #4: Infinite Scroll Cloning Process**
1. Clone the original element
2. Mark as `data-infinite-clone="true"`  
3. Remove old mask containers with `maskContainer.remove()`
4. Delete `data-maskSetup` and `data-gsapAnimated` flags
5. **DO NOT** aggressively hide images
6. Let `setupMaskAnimationsForNewClones()` handle the rest
7. Call mask setup with 300ms delay: `setTimeout(() => setupMaskAnimationsForNewClones(clone), 300)`

### **Rule #5: Debugging Requirements**
- **ALWAYS** include comprehensive console logging for mask setup
- **ALWAYS** verify styles took effect with verification timeouts
- **ALWAYS** provide manual debug functions: `window.fixHiddenClonedImages()`, `window.testInfiniteScroll()`
- **NEVER** remove debug logging until system is 100% stable

## 🔧 IMPLEMENTATION PATTERNS

### **Pattern 1: Original Image Mask Setup**
```javascript
// ✅ CORRECT - Works reliably
element.style.cssText = `width:${width}px!important;height:${height}px!important;display:block!important;margin:0!important;padding:0!important;opacity:1!important;visibility:visible!important`;

// Additional safety
element.style.setProperty('opacity', '1', 'important');
element.style.setProperty('visibility', 'visible', 'important');
```

### **Pattern 2: Cloned Image Mask Setup** 
```javascript
// ✅ CORRECT - Use setProperty to override any existing !important styles
element.style.setProperty('width', `${width}px`, 'important');
element.style.setProperty('height', `${height}px`, 'important');
element.style.setProperty('opacity', '1', 'important');
element.style.setProperty('visibility', 'visible', 'important');

// Always verify
setTimeout(() => {
  const computed = getComputedStyle(element);
  if (computed.visibility === 'hidden' || computed.opacity === '0') {
    console.error('🚨 IMAGE STILL HIDDEN!');
    // Retry logic here
  }
}, 50);
```

### **Pattern 3: Safe Cloning Process**
```javascript
// ✅ CORRECT
const clone = item.cloneNode(true);
clone.dataset.infiniteClone = 'true';

// Clean up old mask containers
clone.querySelectorAll('img, video').forEach(el => {
  const maskContainer = el.closest('.mask-wrap');
  if (maskContainer) {
    const parent = maskContainer.parentNode;
    parent.insertBefore(el, maskContainer);
    maskContainer.remove();
  }
  delete el.dataset.maskSetup;
  delete el.dataset.gsapAnimated;
  // DO NOT aggressively hide here
});
```

## ❌ NEVER DO THESE

### **Anti-Pattern 1: Aggressive Hiding**
```javascript
// ❌ WRONG - Creates !important conflicts
el.style.setProperty('opacity', '0', 'important');
el.style.setProperty('visibility', 'hidden', 'important');
```

### **Anti-Pattern 2: Mixed Styling Approaches**
```javascript
// ❌ WRONG - cssText cannot override setProperty !important
el.style.setProperty('opacity', '0', 'important');  // This wins
el.style.cssText = 'opacity: 1 !important';         // This loses
```

### **Anti-Pattern 3: No Verification**
```javascript
// ❌ WRONG - Always verify styles took effect
element.style.setProperty('opacity', '1', 'important');
// Missing verification that it actually worked
```

## 🧪 TESTING CHECKLIST

Before deploying any image/masking changes:

1. **Original Images**:
   - [ ] Do original images mask reveal on scroll?
   - [ ] Do they start hidden and reveal smoothly?
   - [ ] Are dimensions correct?

2. **Infinite Scroll**:
   - [ ] Does infinite scroll trigger properly?
   - [ ] Are cloned images created correctly?
   - [ ] Test with `window.testInfiniteScroll()`

3. **Cloned Images**:
   - [ ] Do cloned images mask reveal like originals?
   - [ ] Are they not stuck with `visibility: hidden`?
   - [ ] Test with `window.fixHiddenClonedImages()`
   - [ ] Check computed styles in browser dev tools

4. **Console Logging**:
   - [ ] Is mask setup process clearly logged?
   - [ ] Are any error messages appearing?
   - [ ] Are verification steps reporting success?

## 🔍 DEBUG COMMANDS

Add these to browser console for testing:

```javascript
// Check infinite scroll status
window.getInfiniteScrollStatus()

// Test infinite scroll manually  
window.testInfiniteScroll()

// Fix any hidden cloned images
window.fixHiddenClonedImages()

// Check all image visibility
document.querySelectorAll('img').forEach((img, i) => {
  const computed = getComputedStyle(img);
  console.log(`Image ${i}:`, {
    opacity: computed.opacity,
    visibility: computed.visibility,
    isClone: !!img.dataset.infiniteClone
  });
});
```

## 📚 STABLE REFERENCE COMMITS

- **`fed8c2f`**: **STABLE V4** - Unified mask animation system using single code path for all images
- **`f0b8715`**: Complete stable V3 with working text animations, link hover, infinite scroll, and mask animations
- **`cd0556e`**: Fixed cloned image masking behavior to match original images exactly
- **`2a751aa`**: Added comprehensive debugging and verification for cloned image visibility

## 🆕 STABLE V4 IMPROVEMENTS

### **Unified Mask System**
- **Single Code Path**: Both original and cloned images use `startMaskedImageAnimations()`
- **No Duplicate Logic**: Eliminated 150+ lines of complex separate cloning code
- **Consistent Treatment**: All images get identical mask setup regardless of origin
- **Proven Reliability**: Uses the same tested mask logic that works for original images

### **Simplified Cloning Process**
```javascript
// V4 Approach - Simple and reliable
setTimeout(() => {
  const unprocessedImages = document.querySelectorAll('img:not([data-mask-setup]):not(#preloader img), video:not([data-mask-setup])');
  if (unprocessedImages.length > 0) {
    startMaskedImageAnimations(); // Use main system
  }
}, 500);
```

## 🚨 EMERGENCY PROCEDURES

If images break completely:

1. **Immediate**: Revert to commit `fed8c2f` (STABLE V4)
2. **Fallback**: Revert to commit `f0b8715` (STABLE V3)
3. **Check**: Are you seeing console errors about mask setup?
4. **Test**: Run `window.fixHiddenClonedImages()` in browser console
5. **Verify**: Check computed styles in dev tools for `visibility` and `opacity`
6. **Debug**: Look for conflicts between `cssText` and `setProperty` calls

## 💡 KEY INSIGHTS

- **CSS Precedence**: `setProperty` with `!important` always wins over `cssText`
- **Timing**: Mask setup needs proper delays (300ms) for DOM readiness
- **Verification**: Never assume styles applied successfully - always check
- **Consistency**: Original and cloned images need identical treatment
- **Debugging**: Comprehensive logging is essential for troubleshooting

---

**⚠️ WARNING**: Any changes to the image masking system should be tested thoroughly with both original and infinite scroll cloned images. When in doubt, revert to stable commit and start over.
