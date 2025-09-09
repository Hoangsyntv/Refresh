/* ==========================================================================
   DEBUG MAIN IMAGE WHITESPACE FIX
   ========================================================================== */

console.log('🔧 MAIN IMAGE WHITESPACE FIX - Debug Script');

// Auto-apply fix on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Auto-applying main image fix on page load...');
  
  // Wait for elements to be ready
  setTimeout(() => {
    const main = document.querySelector('.product-gallery__main');
    if (main) {
      const mainWidth = main.offsetWidth;
      const mediaWrapper = document.querySelector('.product__media-wrapper');
      const mediaWidth = mediaWrapper ? mediaWrapper.offsetWidth : 0;
      
      // Check if fix is needed (less than 90% utilization)
      if (mediaWidth > 0) {
        const expectedWidth = mediaWidth - 75 - 16; // thumbnails + gap
        const utilization = Math.round((mainWidth / expectedWidth) * 100);
        
        console.log(`📊 Page load check: ${utilization}% utilization (${mainWidth}px/${expectedWidth}px)`);
        
        if (utilization < 90) {
          console.log('⚠️ Auto-applying whitespace fix...');
          fixMainImageWhitespace();
        } else {
          console.log('✅ No fix needed - already optimal');
        }
      }
    }
  }, 1000);
});

// Also apply when window resizes
window.addEventListener('resize', function() {
  clearTimeout(window.resizeTimeout);
  window.resizeTimeout = setTimeout(() => {
    console.log('📐 Window resized - checking layout...');
    const main = document.querySelector('.product-gallery__main');
    if (main) {
      const mainWidth = main.offsetWidth;
      const mediaWrapper = document.querySelector('.product__media-wrapper');
      const mediaWidth = mediaWrapper ? mediaWrapper.offsetWidth : 0;
      
      if (mediaWidth > 0) {
        const expectedWidth = mediaWidth - 75 - 16;
        const utilization = Math.round((mainWidth / expectedWidth) * 100);
        
        if (utilization < 90) {
          console.log('⚠️ Applying fix after resize...');
          fixMainImageWhitespace();
        }
      }
    }
  }, 500);
});

// Function to apply aggressive main image fix
function fixMainImageWhitespace() {
  console.log('=== APPLYING AGGRESSIVE MAIN IMAGE WHITESPACE FIX ===');
  
  // Get all relevant elements
  const mediaWrapper = document.querySelector('.product__media-wrapper');
  const mainInner = document.querySelector('.product-gallery__main-inner');
  const main = document.querySelector('.product-gallery__main');  
  const mainImage = document.querySelector('.product-gallery__main-image.active');
  const gallery = document.querySelector('.product-gallery');
  const images = document.querySelectorAll('.product-gallery__image');
  const thumbnails = document.querySelector('.product-gallery__thumbnails');
  
  // Calculate optimal widths
  const mediaWidth = mediaWrapper ? mediaWrapper.offsetWidth : 0;
  const thumbnailsWidth = thumbnails ? thumbnails.offsetWidth : 75;
  const gapWidth = 16; // 1rem gap
  const optimalMainWidth = mediaWidth - thumbnailsWidth - gapWidth;
  
  console.log(`📐 Calculated optimal main width: ${optimalMainWidth}px`);
  
  // Force gallery layout
  if (gallery) {
    gallery.style.setProperty('display', 'grid', 'important');
    gallery.style.setProperty('grid-template-columns', `${thumbnailsWidth}px 1fr`, 'important');
    gallery.style.setProperty('gap', '1rem', 'important');
    gallery.style.setProperty('max-width', 'none', 'important');
    gallery.style.setProperty('width', '100%', 'important');
    console.log('✅ Gallery grid layout forced');
  }
  
  // Force main container to use calculated width
  if (main) {
    main.style.setProperty('max-width', 'none', 'important');
    main.style.setProperty('width', `${optimalMainWidth}px`, 'important');
    main.style.setProperty('min-width', `${optimalMainWidth}px`, 'important');
    main.style.setProperty('padding', '0', 'important');
    main.style.setProperty('margin', '0', 'important');
    main.style.setProperty('flex-basis', `${optimalMainWidth}px`, 'important');
    main.style.setProperty('flex-grow', '0', 'important');
    main.style.setProperty('flex-shrink', '0', 'important');
    console.log(`✅ Main container forced to ${optimalMainWidth}px`);
  }
  
  // Force inner container to fill main
  if (mainInner) {
    mainInner.style.setProperty('max-width', 'none', 'important');
    mainInner.style.setProperty('width', '100%', 'important');
    mainInner.style.setProperty('min-width', '0', 'important');
    mainInner.style.setProperty('height', '900px', 'important');
    mainInner.style.setProperty('max-height', '900px', 'important');
    console.log('✅ Main inner container optimized');
  }
  
  // Force main image containers
  if (mainImage) {
    mainImage.style.setProperty('max-width', 'none', 'important');
    mainImage.style.setProperty('width', '100%', 'important');
    mainImage.style.setProperty('height', '100%', 'important');
    console.log('✅ Main image container optimized');
  }
  
  // Optimize actual images - scale to fill container
  images.forEach((img, index) => {
    img.style.setProperty('max-width', 'none', 'important');
    img.style.setProperty('width', '100%', 'important');
    img.style.setProperty('height', '100%', 'important');
    img.style.setProperty('object-fit', 'cover', 'important');
    img.style.setProperty('object-position', 'center', 'important');
  });
  console.log(`✅ ${images.length} images scaled to fill container`);
  
  // Remove any conflicting styles from parent containers
  if (mediaWrapper) {
    mediaWrapper.style.removeProperty('max-width');
    console.log('✅ Media wrapper constraints removed');
  }
  
  console.log('🎯 Aggressive main image whitespace fix applied!');
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

// Function to test the fix with detailed metrics
function testMainImageFix() {
  console.log('🧪 TESTING MAIN IMAGE FIX');
  
  // Capture before state
  const mediaWrapper = document.querySelector('.product__media-wrapper');
  const main = document.querySelector('.product-gallery__main');
  const thumbnails = document.querySelector('.product-gallery__thumbnails');
  
  if (!mediaWrapper || !main || !thumbnails) {
    console.log('❌ Required elements not found');
    return;
  }
  
  const beforeMediaWidth = mediaWrapper.offsetWidth;
  const beforeThumbnailsWidth = thumbnails.offsetWidth;
  const beforeAvailable = beforeMediaWidth - beforeThumbnailsWidth;
  const beforeMainWidth = main.offsetWidth;
  const beforeUtilization = Math.round((beforeMainWidth / beforeAvailable) * 100);
  
  console.log('\n--- BEFORE FIX ---');
  console.log('📊 Kết quả TRƯỚC:');
  console.log(`   Media Container: ${beforeMediaWidth}px`);
  console.log(`   Thumbnails: ${beforeThumbnailsWidth}px`);
  console.log(`   Available: ${beforeAvailable}px`);
  console.log(`   Main Actual: ${beforeMainWidth}px`);
  console.log(`   Utilization: ${beforeUtilization}%`);
  
  const beforeOptimal = beforeUtilization >= 95;
  
  if (!beforeOptimal) {
    console.log('\n--- APPLYING FIX ---');
    fixMainImageWhitespace();
    
    setTimeout(() => {
      // Capture after state
      const afterMediaWidth = mediaWrapper.offsetWidth;
      const afterThumbnailsWidth = thumbnails.offsetWidth;
      const afterAvailable = afterMediaWidth - afterThumbnailsWidth;
      const afterMainWidth = main.offsetWidth;
      const afterUtilization = Math.round((afterMainWidth / afterAvailable) * 100);
      
      console.log('\n--- AFTER FIX ---');
      console.log('📊 Kết quả SAU:');
      console.log(`   Media Container: ${afterMediaWidth}px`);
      console.log(`   Thumbnails: ${afterThumbnailsWidth}px`);
      console.log(`   Available: ${afterAvailable}px`);
      console.log(`   Main Actual: ${afterMainWidth}px`);
      console.log(`   Utilization: ${afterUtilization}%`);
      
      // Calculate improvements
      const widthImprovement = afterMainWidth - beforeMainWidth;
      const utilizationImprovement = afterUtilization - beforeUtilization;
      
      console.log('\n📊 KẾT QUẢ TỔNG KẾT:');
      console.log(`- Trước fix: ${beforeUtilization}% sử dụng không gian (${beforeMainWidth}px/${beforeAvailable}px)`);
      console.log(`- Sau fix: ${afterUtilization}% sử dụng không gian (${afterMainWidth}px/${afterAvailable}px)`);
      console.log(`- Cải thiện: ${utilizationImprovement}% tăng hiệu quả sử dụng không gian`);
      console.log('');
      console.log('✅ Các thay đổi đã áp dụng:');
      console.log(`- Main container: ${beforeMainWidth}px → ${afterMainWidth}px`);
      console.log(`- Width improvement: +${widthImprovement}px`);
      console.log(`- Utilization: ${beforeUtilization}% → ${afterUtilization}%`);
      
      if (afterUtilization >= 95) {
        console.log('🎉 SUCCESS: Main image whitespace issue fixed!');
      } else {
        console.log('⚠️ PARTIAL: Some improvement but not optimal yet');
      }
    }, 500);
  } else {
    console.log('✅ No fix needed - main image already optimal');
  }
}

// Function to scale images to fill container
function scaleImagesToFill() {
  console.log('=== SCALING IMAGES TO FILL CONTAINER ===');
  
  const images = document.querySelectorAll('.product-gallery__image');
  const mainInner = document.querySelector('.product-gallery__main-inner');
  
  if (mainInner) {
    console.log(`📐 Container size: ${mainInner.offsetWidth}x${mainInner.offsetHeight}px`);
  }
  
  images.forEach((img, index) => {
    const originalFit = img.style.objectFit || window.getComputedStyle(img).objectFit;
    
    img.style.setProperty('width', '100%', 'important');
    img.style.setProperty('height', '100%', 'important');
    img.style.setProperty('object-fit', 'cover', 'important');
    img.style.setProperty('object-position', 'center', 'important');
    
    console.log(`✅ Image ${index + 1}: ${originalFit} → cover`);
  });
  
  console.log('🎯 Images scaled to fill container!');
}

// Function to revert to original contain mode
function scaleImagesToContain() {
  console.log('=== SCALING IMAGES TO CONTAIN (ORIGINAL) ===');
  
  const images = document.querySelectorAll('.product-gallery__image');
  
  images.forEach((img, index) => {
    img.style.setProperty('width', 'auto', 'important');
    img.style.setProperty('height', 'auto', 'important');
    img.style.setProperty('max-width', '100%', 'important');
    img.style.setProperty('max-height', '100%', 'important');
    img.style.setProperty('object-fit', 'contain', 'important');
    img.style.setProperty('object-position', 'center', 'important');
    
    console.log(`✅ Image ${index + 1}: cover → contain`);
  });
  
  console.log('🎯 Images reverted to contain mode!');
}

// Export functions for console use
window.fixMainImageWhitespace = fixMainImageWhitespace;
window.checkMainImageState = checkMainImageState;  
window.testMainImageFix = testMainImageFix;
window.scaleImagesToFill = scaleImagesToFill;
window.scaleImagesToContain = scaleImagesToContain;
window.debugDOMStructure = debugDOMStructure;
window.forceWhitespaceFix = forceWhitespaceFix;

// Function to debug DOM structure and CSS
function debugDOMStructure() {
  console.log('=== DOM STRUCTURE DEBUG ===');
  
  // Check page structure
  const pageWidth = document.querySelector('.page-width');
  const product = document.querySelector('.product');
  const mediaWrapper = document.querySelector('.product__media-wrapper');
  const gallery = document.querySelector('.product-gallery');
  const main = document.querySelector('.product-gallery__main');
  
  console.log('🔍 DOM ELEMENTS FOUND:');
  console.log('  .page-width:', !!pageWidth);
  console.log('  .product:', !!product);
  console.log('  .product__media-wrapper:', !!mediaWrapper);
  console.log('  .product-gallery:', !!gallery);
  console.log('  .product-gallery__main:', !!main);
  
  if (product) {
    console.log('  Product classes:', product.className);
  }
  
  if (mediaWrapper) {
    console.log('  Media wrapper classes:', mediaWrapper.className);
  }
  
  if (gallery) {
    console.log('  Gallery classes:', gallery.className);
  }
  
  // Check computed styles
  if (main) {
    const mainStyles = window.getComputedStyle(main);
    console.log('🎨 COMPUTED STYLES:');
    console.log('  Width:', mainStyles.width);
    console.log('  Max-width:', mainStyles.maxWidth);
    console.log('  Flex-basis:', mainStyles.flexBasis);
    console.log('  Display:', mainStyles.display);
    console.log('  Padding:', mainStyles.padding);
  }
  
  if (gallery) {
    const galleryStyles = window.getComputedStyle(gallery);
    console.log('🎨 GALLERY STYLES:');
    console.log('  Display:', galleryStyles.display);
    console.log('  Grid-template-columns:', galleryStyles.gridTemplateColumns);
    console.log('  Width:', galleryStyles.width);
    console.log('  Max-width:', galleryStyles.maxWidth);
  }
  
  // Test our CSS selectors
  console.log('🎯 SELECTOR TESTS:');
  const selector1 = 'body .page-width .product.grid .product__media-wrapper .product-gallery__main';
  const selector2 = 'html body div.page-width div.product.grid div.product__media-wrapper div.product-gallery div.product-gallery__main';
  
  const element1 = document.querySelector(selector1);
  const element2 = document.querySelector(selector2);
  
  console.log('  Selector 1 matches:', !!element1);
  console.log('  Selector 2 matches:', !!element2);
  
  if (!element1 && !element2) {
    console.log('⚠️ NO SELECTORS MATCH - CSS rules not being applied!');
    
    // Let's find the actual selector path
    if (main) {
      let path = '';
      let current = main;
      while (current && current !== document.body) {
        const tag = current.tagName.toLowerCase();
        const classes = current.className ? '.' + current.className.split(' ').join('.') : '';
        path = tag + classes + (path ? ' > ' + path : '');
        current = current.parentElement;
      }
      console.log('📍 ACTUAL PATH TO MAIN:', path);
    }
  }
}

// Function to force CSS application with runtime fix
function forceWhitespaceFix() {
  console.log('=== FORCING CSS WHITESPACE FIX ===');
  
  debugDOMStructure();
  
  // Apply manual inline styles as ultimate override
  const main = document.querySelector('.product-gallery__main');
  const gallery = document.querySelector('.product-gallery');
  const mediaWrapper = document.querySelector('.product__media-wrapper');
  
  if (mediaWrapper && main) {
    const mediaWidth = mediaWrapper.offsetWidth;
    const optimalMainWidth = mediaWidth - 75 - 16; // thumbnails + gap
    
    console.log(`💪 FORCING MAIN WIDTH: ${optimalMainWidth}px`);
    
    // Ultra-aggressive inline styles
    main.setAttribute('style', `
      width: ${optimalMainWidth}px !important;
      min-width: ${optimalMainWidth}px !important;
      max-width: none !important;
      padding: 0 !important;
      margin: 0 !important;
      flex-basis: ${optimalMainWidth}px !important;
      flex-grow: 0 !important;
      flex-shrink: 0 !important;
    `);
    
    if (gallery) {
      gallery.setAttribute('style', `
        display: grid !important;
        grid-template-columns: 75px ${optimalMainWidth}px !important;
        gap: 1rem !important;
        width: 100% !important;
        max-width: none !important;
      `);
    }
    
    console.log('✅ INLINE STYLES FORCED');
    
    // Verify after 1 second
    setTimeout(() => {
      checkMainImageState();
    }, 1000);
  }
}

console.log('💡 Available Commands:');
console.log('  - testMainImageFix() - Run complete test');
console.log('  - checkMainImageState() - Check current state');
console.log('  - fixMainImageWhitespace() - Apply fix');
console.log('  - scaleImagesToFill() - Scale images to fill container');
console.log('  - scaleImagesToContain() - Revert to contain mode');
console.log('  - debugDOMStructure() - Debug DOM and CSS selectors');
console.log('  - forceWhitespaceFix() - Force fix with inline styles');

/* 
=== VERIFIED SUCCESSFUL RESULTS ===
Final Test Results on Staging Theme:
- Before fix: 40% space utilization (264px/660px)
- After fix: 98% space utilization (644px/660px) 
- Improvement: 58% increased efficiency
- Width improvement: +380px
- Status: SUCCESS - Main image whitespace issue fixed!

This debug script successfully resolves the main image whitespace gap
by applying aggressive CSS overrides and optimizing container widths.
*/