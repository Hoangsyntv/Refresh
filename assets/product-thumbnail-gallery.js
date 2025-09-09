/**
 * Product Thumbnail Gallery - Enhanced Debug Version
 * Handles thumbnail navigation, image switching, variant filtering, and keyboard accessibility
 */

document.addEventListener('DOMContentLoaded', function () {
  console.log('🖼️ Product Gallery: Initializing...');
  
  const thumbnails = document.querySelectorAll('.product-gallery__thumbnail');
  const mainImages = document.querySelectorAll('.product-gallery__main-image');
  const variantOptions = document.querySelectorAll('[data-variant-option]');
  const gallery = document.querySelector('.product-gallery');
  
  console.log('🔍 Gallery Elements Found:', {
    gallery: !!gallery,
    thumbnails: thumbnails.length,
    mainImages: mainImages.length,
    variantOptions: variantOptions.length
  });
  
  // Exit early if no gallery elements found
  if (!gallery || thumbnails.length === 0 || mainImages.length === 0) {
    console.warn('❌ Product Gallery: Required elements not found. Exiting.');
    return;
  }
  
  let activeIndex = 0;
  let availableVariants = [];

  // Initialize variant data if available
  function initializeVariants() {
    const productData = window.productVariants || [];
    availableVariants = productData.filter(variant => variant.available);
    updateVariantOptionsVisibility();
  }

  // Update variant options visibility based on availability
  function updateVariantOptionsVisibility() {
    variantOptions.forEach(option => {
      const optionValue = option.getAttribute('data-variant-value');
      const isAvailable = availableVariants.some(variant => 
        Object.values(variant.options).includes(optionValue)
      );
      
      if (!isAvailable) {
        option.style.display = 'none';
        option.setAttribute('data-unavailable', 'true');
      } else {
        option.style.display = '';
        option.removeAttribute('data-unavailable');
      }
    });
  }

  // Filter images based on selected variant
  function filterImagesByVariant(selectedOptions = {}) {
    const matchingVariant = availableVariants.find(variant => {
      return Object.keys(selectedOptions).every(key => 
        variant.options[key] === selectedOptions[key]
      );
    });

    if (matchingVariant && matchingVariant.featured_image) {
      const imageIndex = Array.from(mainImages).findIndex(img => 
        img.querySelector('img').src.includes(matchingVariant.featured_image.id)
      );
      if (imageIndex !== -1) {
        setActiveThumbnail(imageIndex);
      }
    }
  }

  function setActiveThumbnail(index) {
    if (index < 0 || index >= thumbnails.length) {
      console.warn('⚠️ Invalid thumbnail index:', index, 'Max:', thumbnails.length - 1);
      return;
    }
    
    console.log('🎯 Setting active thumbnail:', index);
    
    try {
      // Update thumbnails
      thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
        thumb.setAttribute('aria-selected', i === index ? 'true' : 'false');
        thumb.setAttribute('tabindex', i === index ? '0' : '-1');
      });
      
      // Update main images
      mainImages.forEach((img, i) => {
        const isActive = i === index;
        img.classList.toggle('active', isActive);
        img.style.display = '';
        
        console.log(`📸 Image ${i}:`, {
          active: isActive,
          visible: img.classList.contains('active'),
          opacity: window.getComputedStyle(img).opacity,
          visibility: window.getComputedStyle(img).visibility
        });
      });
      
      activeIndex = index;
      console.log('✅ Active thumbnail set successfully:', index);
      
    } catch (error) {
      console.error('❌ Error setting active thumbnail:', error);
    }
  }

  // Enhanced thumbnail interactions with debugging
  thumbnails.forEach((thumb, i) => {
    console.log(`🎨 Setting up thumbnail ${i}:`, thumb);
    
    thumb.addEventListener('click', function () {
      console.log(`👆 Thumbnail ${i} clicked`);
      setActiveThumbnail(i);
    });
    
    thumb.addEventListener('keydown', function (e) {
      console.log(`⌨️ Thumbnail ${i} keydown:`, e.key);
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setActiveThumbnail(i);
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const next = (i + 1) % thumbnails.length;
        thumbnails[next].focus();
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = (i - 1 + thumbnails.length) % thumbnails.length;
        thumbnails[prev].focus();
      }
    });

    // Add hover effect for better UX
    thumb.addEventListener('mouseenter', function () {
      thumb.style.transform = 'scale(1.05)';
    });
    
    thumb.addEventListener('mouseleave', function () {
      thumb.style.transform = 'scale(1)';
    });
  });

  // Listen for variant changes from product form
  document.addEventListener('variant:changed', function(e) {
    if (e.detail && e.detail.selectedOptions) {
      filterImagesByVariant(e.detail.selectedOptions);
      updateVariantOptionsVisibility();
    }
  });

  // Debug current page state
  function debugCurrentState() {
    console.log('🔬 Current Gallery State:', {
      activeIndex,
      thumbnailsCount: thumbnails.length,
      mainImagesCount: mainImages.length,
      firstMainImage: mainImages[0] ? {
        classes: mainImages[0].className,
        style: mainImages[0].style.cssText,
        opacity: window.getComputedStyle(mainImages[0]).opacity,
        visibility: window.getComputedStyle(mainImages[0]).visibility
      } : null
    });
  }
  
  // Initialize everything
  try {
    initializeVariants();
    setActiveThumbnail(0);
    
    // Debug after 1 second to see final state
    setTimeout(debugCurrentState, 1000);
    
    console.log('✅ Product Gallery: Initialization complete');
  } catch (error) {
    console.error('❌ Product Gallery: Initialization failed:', error);
  }
  
  // Add global debug function
  window.debugProductGallery = function() {
    debugCurrentState();
    console.log('🎯 Use setActiveThumbnail(index) to test switching');
    return { thumbnails, mainImages, activeIndex, availableVariants };
  };
  
  console.log('💡 Debug: Type debugProductGallery() in console for details');
});

// Global error handler for gallery
window.addEventListener('error', function(e) {
  if (e.filename && e.filename.includes('product-thumbnail-gallery')) {
    console.error('🚨 Product Gallery Error:', e.error);
  }
});