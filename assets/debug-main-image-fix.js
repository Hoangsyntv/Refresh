// Main Image Whitespace Auto-Fix for Product Gallery
// Automatically fixes whitespace issues in product gallery main image area

console.log('🎯 Main Image Auto-Fix Script Loaded');

// Function to fix main image whitespace
function fixMainImageWhitespace() {
  console.log('🔧 Applying main image whitespace fix...');
  
  const main = document.querySelector('.product-gallery__main');
  const mainInner = document.querySelector('.product-gallery__main-inner');
  const mainImages = document.querySelectorAll('.product-gallery__main-image');
  const gallery = document.querySelector('.product-gallery');
  const mediaWrapper = document.querySelector('.product__media-wrapper');
  
  if (!main || !mainInner || !gallery) {
    console.log('⚠️ Required elements not found');
    return false;
  }

  // Get media wrapper width to calculate expected main width
  const mediaWrapperWidth = mediaWrapper ? mediaWrapper.offsetWidth : 0;
  const expectedMainWidth = mediaWrapperWidth - 75 - 16; // thumbnails width + gap
  const currentMainWidth = main.offsetWidth;
  const utilization = Math.round((currentMainWidth / expectedMainWidth) * 100);
  
  console.log(`📊 Current utilization: ${utilization}% (${currentMainWidth}px / ${expectedMainWidth}px)`);
  
  // Apply fixes if utilization is less than 90%
  if (utilization < 90) {
    console.log('🚨 Low utilization detected, applying fixes...');
    
    // Force gallery grid layout
    gallery.style.setProperty('display', 'grid', 'important');
    gallery.style.setProperty('grid-template-columns', '75px 1fr', 'important');
    gallery.style.setProperty('gap', '1rem', 'important');
    gallery.style.setProperty('max-width', 'none', 'important');
    gallery.style.setProperty('width', '100%', 'important');
    
    // Force main container dimensions
    main.style.setProperty('max-width', 'none', 'important');
    main.style.setProperty('width', 'calc(100% - 75px - 1rem)', 'important');
    main.style.setProperty('min-width', 'calc(100% - 75px - 1rem)', 'important');
    main.style.setProperty('padding', '0', 'important');
    main.style.setProperty('margin', '0', 'important');
    main.style.setProperty('flex-basis', 'calc(100% - 75px - 1rem)', 'important');
    main.style.setProperty('flex-grow', '0', 'important');
    main.style.setProperty('flex-shrink', '0', 'important');
    
    // Force main inner dimensions  
    mainInner.style.setProperty('max-width', 'none', 'important');
    mainInner.style.setProperty('width', '100%', 'important');
    mainInner.style.setProperty('min-width', '0', 'important');
    
    // Force main images to fill container
    mainImages.forEach(img => {
      img.style.setProperty('max-width', 'none', 'important');
      img.style.setProperty('width', '100%', 'important');
    });
    
    // Force actual images to fill container
    const images = document.querySelectorAll('.product-gallery__image');
    images.forEach(img => {
      img.style.setProperty('max-width', 'none', 'important');
      img.style.setProperty('width', '100%', 'important');
      img.style.setProperty('height', '100%', 'important');
      img.style.setProperty('object-fit', 'cover', 'important');
      img.style.setProperty('object-position', 'center', 'important');
    });
    
    console.log('✅ Whitespace fixes applied');
    
    // Verify fix after a short delay
    setTimeout(() => {
      const newMainWidth = main.offsetWidth;
      const newUtilization = Math.round((newMainWidth / expectedMainWidth) * 100);
      console.log(`📈 New utilization: ${newUtilization}% (${newMainWidth}px / ${expectedMainWidth}px)`);
      
      if (newUtilization > 90) {
        console.log('🎉 Fix successful!');
      } else {
        console.log('⚠️ Fix may need additional tweaks');
      }
    }, 100);
    
    return true;
  } else {
    console.log('✅ Utilization already optimal');
    return false;
  }
}

// Function to check and apply fix
function checkAndFix() {
  const main = document.querySelector('.product-gallery__main');
  if (main) {
    console.log('🔍 Checking main image layout...');
    fixMainImageWhitespace();
  } else {
    console.log('⚠️ Product gallery main not found, skipping fix');
  }
}

// Auto-apply on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Auto-applying main image fix on page load...');
  setTimeout(() => {
    checkAndFix();
  }, 1000);
});

// Auto-apply on window resize
window.addEventListener('resize', function() {
  console.log('📐 Window resized, re-checking layout...');
  setTimeout(() => {
    checkAndFix();
  }, 300);
});

// Auto-apply when images load
window.addEventListener('load', function() {
  console.log('🖼️ All resources loaded, final layout check...');
  setTimeout(() => {
    checkAndFix();
  }, 500);
});

// Make function globally available for manual testing
window.fixMainImageWhitespace = fixMainImageWhitespace;

console.log('🎯 Main Image Auto-Fix Script Ready');