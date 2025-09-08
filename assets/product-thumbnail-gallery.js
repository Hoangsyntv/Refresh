/**
 * Product Thumbnail Gallery
 * Handles thumbnail navigation, image switching, variant filtering, and keyboard accessibility
 */

document.addEventListener('DOMContentLoaded', function () {
  const thumbnails = document.querySelectorAll('.product-gallery__thumbnail');
  const mainImages = document.querySelectorAll('.product-gallery__main-image');
  const variantOptions = document.querySelectorAll('[data-variant-option]');
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
    if (index < 0 || index >= thumbnails.length) return;
    
    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
      thumb.setAttribute('aria-selected', i === index ? 'true' : 'false');
      thumb.setAttribute('tabindex', i === index ? '0' : '-1');
    });
    mainImages.forEach((img, i) => {
      img.classList.toggle('active', i === index);
      // Remove conflicting display style - let CSS handle visibility
      img.style.display = '';
    });
    activeIndex = index;
  }

  // Enhanced thumbnail interactions
  thumbnails.forEach((thumb, i) => {
    thumb.addEventListener('click', function () {
      setActiveThumbnail(i);
    });
    
    thumb.addEventListener('keydown', function (e) {
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

  // Initialize everything
  initializeVariants();
  setActiveThumbnail(0);
});