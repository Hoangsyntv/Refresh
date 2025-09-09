// SINGLE IMAGE TEST - Copy vào browser console
console.log('🎯 SINGLE IMAGE ACTIVE TEST');

// 1. Find all image elements
const allImageContainers = document.querySelectorAll('.product-gallery__main-image');
const activeImageContainer = document.querySelector('.product-gallery__main-image.active');
const mainContainer = document.querySelector('.product-gallery__main');

console.log(`Found: ${allImageContainers.length} total images, ${activeImageContainer ? 1 : 0} active`);

// 2. Check before fix
function checkCurrentState() {
    console.log('📏 CURRENT STATE:');
    
    allImageContainers.forEach((container, index) => {
        const isActive = container.classList.contains('active');
        const rect = container.getBoundingClientRect();
        const computedStyle = getComputedStyle(container);
        
        console.log(`Image ${index} (${isActive ? 'ACTIVE' : 'inactive'}):`, {
            visible: rect.width > 0 && rect.height > 0,
            dimensions: `${rect.width}x${rect.height}`,
            display: computedStyle.display,
            visibility: computedStyle.visibility
        });
    });
    
    if (mainContainer) {
        const mainRect = mainContainer.getBoundingClientRect();
        console.log(`Main Container: ${mainRect.width}x${mainRect.height}`);
    }
}

// 3. Apply single image fix
function applySingleImageFix() {
    console.log('🔧 APPLYING SINGLE IMAGE DISPLAY...');
    
    // Hide all image containers by default
    allImageContainers.forEach(container => {
        container.style.cssText += `
            display: none !important;
            visibility: hidden !important;
            position: absolute !important;
            top: -9999px !important;
            left: -9999px !important;
        `;
    });
    
    // Show only active image
    if (activeImageContainer) {
        activeImageContainer.style.cssText += `
            display: block !important;
            visibility: visible !important;
            position: relative !important;
            width: 100% !important;
            height: auto !important;
            top: auto !important;
            left: auto !important;
        `;
        
        // Ensure active image fills width
        const activeImg = activeImageContainer.querySelector('.product-gallery__image');
        if (activeImg) {
            activeImg.style.cssText += `
                width: 100% !important;
                height: auto !important;
                display: block !important;
                object-fit: contain !important;
            `;
        }
        
        console.log('✅ Active image shown, others hidden');
    }
    
    // Ensure main container adjusts to single image
    if (mainContainer) {
        mainContainer.style.cssText += `
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            position: relative !important;
        `;
        console.log('✅ Main container set to auto-adjust');
    }
}

// 4. Verify results
function verifyResults() {
    console.log('📊 VERIFICATION:');
    
    let visibleCount = 0;
    allImageContainers.forEach((container, index) => {
        const rect = container.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0;
        const isActive = container.classList.contains('active');
        
        if (isVisible) visibleCount++;
        
        console.log(`Image ${index}: ${isVisible ? '👁️ VISIBLE' : '🙈 HIDDEN'} ${isActive ? '(ACTIVE)' : '(inactive)'}`);
    });
    
    if (mainContainer && activeImageContainer) {
        const mainRect = mainContainer.getBoundingClientRect();
        const activeRect = activeImageContainer.getBoundingClientRect();
        
        console.log(`Main Container: ${mainRect.width}x${mainRect.height}`);
        console.log(`Active Image: ${activeRect.width}x${activeRect.height}`);
        console.log(`Height Match: ${Math.abs(mainRect.height - activeRect.height) < 2 ? '✅ YES' : '❌ NO'}`);
    }
    
    console.log(`Result: ${visibleCount === 1 ? '✅ SUCCESS - Only 1 image visible' : '❌ FAIL - Multiple images visible'}`);
}

// 5. Test thumbnail switching
function testThumbnailSwitch(thumbnailIndex) {
    console.log(`🔄 SWITCHING TO THUMBNAIL ${thumbnailIndex}...`);
    
    const thumbnails = document.querySelectorAll('.product-gallery__thumbnail');
    if (thumbnails[thumbnailIndex]) {
        thumbnails[thumbnailIndex].click();
        
        setTimeout(() => {
            console.log(`📊 After switch to thumbnail ${thumbnailIndex}:`);
            verifyResults();
        }, 500);
    }
}

// 6. Run complete test
function runSingleImageTest() {
    console.log('🚀 STARTING SINGLE IMAGE TEST...');
    checkCurrentState();
    applySingleImageFix();
    
    setTimeout(() => {
        verifyResults();
        console.log('🎯 SINGLE IMAGE TEST COMPLETED');
    }, 500);
}

// Export functions
window.singleImageTest = {
    runSingleImageTest,
    checkCurrentState,
    applySingleImageFix,
    verifyResults,
    testThumbnailSwitch
};

console.log('🎯 Single Image Test Ready!');
console.log('Commands: singleImageTest.runSingleImageTest(), singleImageTest.testThumbnailSwitch(0)');

// Auto-run
runSingleImageTest();