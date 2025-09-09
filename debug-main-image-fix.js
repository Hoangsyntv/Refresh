/* ==========================================================================
   DEBUG MAIN IMAGE WHITESPACE FIX
   ========================================================================== */

console.log('🔧 MAIN IMAGE WHITESPACE FIX - Debug Script');

// Function to apply main image fix
function fixMainImageWhitespace() {
  console.log('=== APPLYING MAIN IMAGE WHITESPACE FIX ===');
  
  // Remove all max-width constraints
  const mainInner = document.querySelector('.product-gallery__main-inner');
  const main = document.querySelector('.product-gallery__main');  
  const mainImage = document.querySelector('.product-gallery__main-image.active');
  const gallery = document.querySelector('.product-gallery');
  const images = document.querySelectorAll('.product-gallery__image');
  
  if (mainInner) {
    mainInner.style.setProperty('max-width', 'none', 'important');
    mainInner.style.setProperty('width', '100%', 'important');
    mainInner.style.setProperty('min-width', '0', 'important');
    console.log('✅ Main inner max-width removed');
  }
  
  if (main) {
    main.style.setProperty('max-width', 'none', 'important');
    main.style.setProperty('width', '100%', 'important');
    main.style.setProperty('padding', '0', 'important');
    console.log('✅ Main container max-width removed, padding cleared');
  }
  
  if (mainImage) {
    mainImage.style.setProperty('max-width', 'none', 'important');
    mainImage.style.setProperty('width', '100%', 'important');
    console.log('✅ Main image max-width removed');
  }
  
  if (gallery) {
    gallery.style.setProperty('max-width', 'none', 'important');
    gallery.style.setProperty('width', '100%', 'important');
    gallery.style.setProperty('grid-template-columns', '75px 1fr', 'important');
    console.log('✅ Gallery max-width removed, grid optimized');
  }
  
  images.forEach((img, index) => {
    img.style.setProperty('max-width', '100%', 'important');
    img.style.setProperty('width', 'auto', 'important');
    img.style.setProperty('height', 'auto', 'important');
    img.style.setProperty('object-fit', 'contain', 'important');
  });
  console.log(`✅ ${images.length} images optimized`);
  
  console.log('🎯 Main image whitespace fix applied!');
}

// Function to check current state
function checkMainImageState() {
  console.log('=== MAIN IMAGE STATE CHECK ===');
  
  const mediaWrapper = document.querySelector('.product__media-wrapper');
  const mainInner = document.querySelector('.product-gallery__main-inner');
  const main = document.querySelector('.product-gallery__main');
  const gallery = document.querySelector('.product-gallery');
  
  if (mediaWrapper) {
    console.log('📊 Media Wrapper Width:', mediaWrapper.offsetWidth + 'px');
  }
  
  if (gallery) {
    const galleryStyles = window.getComputedStyle(gallery);
    console.log('📊 Gallery Width:', gallery.offsetWidth + 'px');
    console.log('📊 Gallery Max-Width:', galleryStyles.maxWidth);
    console.log('📊 Gallery Grid Columns:', galleryStyles.gridTemplateColumns);
  }
  
  if (main) {
    const mainStyles = window.getComputedStyle(main);
    console.log('📊 Main Width:', main.offsetWidth + 'px');
    console.log('📊 Main Max-Width:', mainStyles.maxWidth);
    console.log('📊 Main Padding:', mainStyles.padding);
  }
  
  if (mainInner) {
    const innerStyles = window.getComputedStyle(mainInner);
    console.log('📊 Main Inner Width:', mainInner.offsetWidth + 'px');
    console.log('📊 Main Inner Max-Width:', innerStyles.maxWidth);
  }
  
  // Calculate available space
  const thumbnails = document.querySelector('.product-gallery__thumbnails');
  if (mediaWrapper && thumbnails && main) {
    const mediaWidth = mediaWrapper.offsetWidth;
    const thumbnailsWidth = thumbnails.offsetWidth;
    const availableWidth = mediaWidth - thumbnailsWidth;
    const mainActualWidth = main.offsetWidth;
    
    console.log('🧮 SPACE CALCULATION:');
    console.log(`   Media Container: ${mediaWidth}px`);
    console.log(`   Thumbnails: ${thumbnailsWidth}px`);  
    console.log(`   Available: ${availableWidth}px`);
    console.log(`   Main Actual: ${mainActualWidth}px`);
    console.log(`   Utilization: ${Math.round((mainActualWidth / availableWidth) * 100)}%`);
    
    if (mainActualWidth < availableWidth * 0.95) {
      console.log('⚠️ WHITESPACE DETECTED: Main image not utilizing full space');
      return false;
    } else {
      console.log('✅ OPTIMAL: Main image utilizing available space well');
      return true;
    }
  }
}

// Function to test the fix
function testMainImageFix() {
  console.log('🧪 TESTING MAIN IMAGE FIX');
  
  console.log('\n--- BEFORE FIX ---');
  const beforeOptimal = checkMainImageState();
  
  if (!beforeOptimal) {
    console.log('\n--- APPLYING FIX ---');
    fixMainImageWhitespace();
    
    setTimeout(() => {
      console.log('\n--- AFTER FIX ---');
      const afterOptimal = checkMainImageState();
      
      if (afterOptimal) {
        console.log('🎉 SUCCESS: Main image whitespace issue fixed!');
      } else {
        console.log('⚠️ PARTIAL: Some whitespace may still remain');
      }
    }, 500);
  } else {
    console.log('✅ No fix needed - main image already optimal');
  }
}

// Export functions for console use
window.fixMainImageWhitespace = fixMainImageWhitespace;
window.checkMainImageState = checkMainImageState;  
window.testMainImageFix = testMainImageFix;

console.log('💡 Available Commands:');
console.log('  - testMainImageFix() - Run complete test');
console.log('  - checkMainImageState() - Check current state');
console.log('  - fixMainImageWhitespace() - Apply fix');