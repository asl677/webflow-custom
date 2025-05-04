# Webflow Custom Code

This directory contains custom CSS and JavaScript files for the Alex Lakas portfolio site.

## Setup Instructions

1. In Webflow, go to Site Settings > Custom Code
2. Add these script tags to the Head Code section:
   ```html
   <!-- GSAP Library -->
   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/SplitText.min.js"></script>
   
   <!-- Custom CSS -->
   <link rel="stylesheet" href="https://YOUR-HOSTING-URL/styles/animations.css">
   ```

3. Add this script tag to the Footer Code section:
   ```html
   <!-- Custom JavaScript -->
   <script src="https://YOUR-HOSTING-URL/scripts/animations.js"></script>
   ```

## Special Animations

### Line-by-Line Text Animation
The `.heading.large.bold.skinny` class elements will animate line-by-line with a staggered effect.
- Each line appears separately with a dramatic upward motion 
- Lines are automatically identified and animated separately
- Apply this class to headings that need special emphasis

## Hosting Options

You can host these files in several ways:
1. GitHub Pages
2. Netlify
3. Vercel
4. CDN service
5. Your own server

## File Structure

- `styles/animations.css`: Contains custom animation styles
- `scripts/animations.js`: Contains GSAP animation setup

## Customization

To modify animations:
1. Edit `animations.css` for style changes
2. Edit `animations.js` for behavior changes
3. Test locally before deploying
4. Update the hosted files

## Development

1. Make changes to the files
2. Test locally
3. Deploy to your hosting service
4. Update the URLs in Webflow if needed 