/**
 * Product Thumbnail Gallery
 * Handles thumbnail navigation, image switching, zoom functionality, and keyboard accessibility
 */

class ProductThumbnailGallery {
  constructor(container) {
    this.container = container;
    this.sectionId = container.dataset.sectionId;
    this.currentIndex = 0;
    
    // DOM Elements
    this.mainImages = container.querySelectorAll('[data-main-image]');
    this.thumbnails = container.querySelectorAll('[data-thumbnail]');
    this.thumbnailsWrapper = container.querySelector('.product-gallery__thumbnails-wrapper');
    this.navPrev = container.querySelector('[data-nav-prev]');
    this.navNext = container.querySelector('[data-nav-next]');
    
    // Zoom Elements
    this.zoomTriggers = container.querySelectorAll('[data-zoom-trigger]');
    this.zoomModal = container.querySelector('[data-zoom-modal]');
    this.zoomImage = container.querySelector('[data-zoom-image-display]');
    this.zoomCloseButtons = container.querySelectorAll('[data-zoom-close]');
    
    // State
    this.isZoomOpen = false;
    this.touchStartX = 0;
    this.touchEndX = 0;
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateNavigationState();
    this.setInitialActiveState();
    
    // Preload next few images for better performance
    this.preloadImages();
  }

  bindEvents() {
    // Thumbnail clicks
    this.thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchToImage(index);
      });
    });

    // Keyboard navigation
    this.container.addEventListener('keydown', this.handleKeydown.bind(this));

    // Navigation arrows
    if (this.navPrev) {
      this.navPrev.addEventListener('click', () => this.navigatePrev());
    }
    if (this.navNext) {
      this.navNext.addEventListener('click', () => this.navigateNext());
    }

    // Touch/swipe support for mobile
    if (this.thumbnailsWrapper) {
      this.thumbnailsWrapper.addEventListener('touchstart', this.handleTouchStart.bind(this));
      this.thumbnailsWrapper.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }

    // Zoom functionality
    if (this.zoomTriggers.length > 0) {
      this.zoomTriggers.forEach(trigger => {
        trigger.addEventListener('click', this.openZoom.bind(this));
      });
    }

    if (this.zoomCloseButtons.length > 0) {
      this.zoomCloseButtons.forEach(closeBtn => {
        closeBtn.addEventListener('click', this.closeZoom.bind(this));
      });
    }

    // Close zoom on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isZoomOpen) {
        this.closeZoom();
      }
    });

    // Variant changes (if product has variants)
    document.addEventListener('variant:change', this.handleVariantChange.bind(this));
  }

  switchToImage(index) {
    if (index < 0 || index >= this.mainImages.length || index === this.currentIndex) {
      return;
    }

    const previousIndex = this.currentIndex;
    this.currentIndex = index;

    // Update main image display
    this.mainImages[previousIndex]?.classList.remove('active');
    this.mainImages[this.currentIndex]?.classList.add('active');

    // Update thumbnail active state
    this.thumbnails[previousIndex]?.classList.remove('active');
    this.thumbnails[previousIndex]?.setAttribute('aria-current', 'false');
    
    this.thumbnails[this.currentIndex]?.classList.add('active');
    this.thumbnails[this.currentIndex]?.setAttribute('aria-current', 'true');

    // Ensure active thumbnail is visible
    this.scrollThumbnailIntoView(this.currentIndex);

    // Update navigation state
    this.updateNavigationState();

    // Trigger custom event
    this.container.dispatchEvent(new CustomEvent('gallery:imageChanged', {
      detail: {
        currentIndex: this.currentIndex,
        previousIndex: previousIndex,
        currentImage: this.mainImages[this.currentIndex]
      }
    }));
  }

  navigatePrev() {
    const newIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.mainImages.length - 1;
    this.switchToImage(newIndex);
  }

  navigateNext() {
    const newIndex = this.currentIndex < this.mainImages.length - 1 ? this.currentIndex + 1 : 0;
    this.switchToImage(newIndex);
  }

  scrollThumbnailIntoView(index) {
    const thumbnail = this.thumbnails[index];
    if (!thumbnail || !this.thumbnailsWrapper) return;

    const container = this.thumbnailsWrapper;
    const containerRect = container.getBoundingClientRect();
    const thumbnailRect = thumbnail.getBoundingClientRect();

    // Check if thumbnail is fully visible
    const isVisible = (
      thumbnailRect.left >= containerRect.left &&
      thumbnailRect.right <= containerRect.right &&
      thumbnailRect.top >= containerRect.top &&
      thumbnailRect.bottom <= containerRect.bottom
    );

    if (!isVisible) {
      thumbnail.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }

  updateNavigationState() {
    if (this.navPrev) {
      this.navPrev.disabled = false; // Enable circular navigation
    }
    if (this.navNext) {
      this.navNext.disabled = false; // Enable circular navigation
    }
  }

  setInitialActiveState() {
    // Find the first visible image or default to index 0
    const activeImage = this.container.querySelector('[data-main-image].active');
    if (activeImage) {
      const index = parseInt(activeImage.dataset.imageIndex) || 0;
      this.currentIndex = index;
    }
  }

  handleKeydown(event) {
    // Only handle keyboard events when gallery is focused
    if (!this.container.contains(document.activeElement)) return;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        this.navigatePrev();
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        this.navigateNext();
        break;
      case 'Home':
        event.preventDefault();
        this.switchToImage(0);
        break;
      case 'End':
        event.preventDefault();
        this.switchToImage(this.mainImages.length - 1);
        break;
    }
  }

  handleTouchStart(event) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  handleTouchEnd(event) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipeGesture();
  }

  handleSwipeGesture() {
    const swipeThreshold = 50;
    const swipeDistance = this.touchStartX - this.touchEndX;

    if (Math.abs(swipeDistance) < swipeThreshold) return;

    if (swipeDistance > 0) {
      // Swiped left - go to next
      this.navigateNext();
    } else {
      // Swiped right - go to previous
      this.navigatePrev();
    }
  }

  openZoom() {
    if (!this.zoomModal) return;

    const currentMainImage = this.mainImages[this.currentIndex];
    const zoomImageUrl = currentMainImage?.querySelector('img')?.dataset.zoomImage;
    const altText = currentMainImage?.querySelector('img')?.alt || '';

    if (this.zoomImage && zoomImageUrl) {
      this.zoomImage.src = zoomImageUrl;
      this.zoomImage.alt = altText;
    }

    this.zoomModal.classList.add('active');
    this.isZoomOpen = true;
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    
    // Focus management
    this.zoomModal.focus();
  }

  closeZoom() {
    if (!this.zoomModal) return;

    this.zoomModal.classList.remove('active');
    this.isZoomOpen = false;
    
    // Restore background scrolling
    document.body.style.overflow = '';
    
    // Return focus to zoom trigger
    const currentZoomTrigger = this.mainImages[this.currentIndex]?.querySelector('[data-zoom-trigger]');
    if (currentZoomTrigger) {
      currentZoomTrigger.focus();
    }
  }

  handleVariantChange(event) {
    // Handle variant image switching if needed
    const variant = event.detail?.variant;
    if (!variant || !variant.featured_media) return;

    // Find the image that corresponds to the variant
    const variantImageIndex = this.findImageIndex(variant.featured_media.id);
    if (variantImageIndex !== -1) {
      this.switchToImage(variantImageIndex);
    }
  }

  findImageIndex(mediaId) {
    return Array.from(this.mainImages).findIndex(image => {
      const img = image.querySelector('img');
      return img?.dataset.mediaId === mediaId.toString();
    });
  }

  preloadImages() {
    // Preload the next 2-3 images for smoother transitions
    const preloadCount = 3;
    const startIndex = Math.max(0, this.currentIndex - 1);
    const endIndex = Math.min(this.mainImages.length, this.currentIndex + preloadCount);

    for (let i = startIndex; i < endIndex; i++) {
      if (i === this.currentIndex) continue;
      
      const img = this.mainImages[i]?.querySelector('img');
      if (img && img.loading === 'lazy') {
        img.loading = 'eager';
      }
    }
  }

  // Public API methods
  goToImage(index) {
    this.switchToImage(index);
  }

  getCurrentIndex() {
    return this.currentIndex;
  }

  getImageCount() {
    return this.mainImages.length;
  }

  destroy() {
    // Clean up event listeners
    this.thumbnails.forEach(thumbnail => {
      thumbnail.removeEventListener('click', this.switchToImage);
    });

    if (this.navPrev) {
      this.navPrev.removeEventListener('click', this.navigatePrev);
    }
    if (this.navNext) {
      this.navNext.removeEventListener('click', this.navigateNext);
    }

    this.container.removeEventListener('keydown', this.handleKeydown);
    document.removeEventListener('variant:change', this.handleVariantChange);
  }
}

// Auto-initialize galleries when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const galleries = document.querySelectorAll('[data-product-gallery]');
  galleries.forEach(gallery => {
    new ProductThumbnailGallery(gallery);
  });
});

// Re-initialize galleries after AJAX content updates
document.addEventListener('shopify:section:load', (event) => {
  const galleries = event.target.querySelectorAll('[data-product-gallery]');
  galleries.forEach(gallery => {
    new ProductThumbnailGallery(gallery);
  });
});

// Export for use in other scripts
window.ProductThumbnailGallery = ProductThumbnailGallery;