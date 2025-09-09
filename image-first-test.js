// IMAGE-FIRST APPROACH TEST - Copy vào browser console
console.log('🎯 IMAGE-FIRST APPROACH TEST');

// 1. Tìm tất cả elements
const images = document.querySelectorAll('.product-gallery__image');
const mainContainers = document.querySelectorAll('.product-gallery__main');
const innerContainers = document.querySelectorAll('.product-gallery__main-inner');
const imageContainers = document.querySelectorAll('.product-gallery__main-image');

console.log(`Found: ${images.length} images, ${mainContainers.length} main containers`);

// 2. Kiểm tra kích thước trước khi fix
function checkBeforeFix() {
    console.log('📏 BEFORE FIX:');
    images.forEach((img, index) => {
        const rect = img.getBoundingClientRect();
        const parent = img.parentElement.getBoundingClientRect();
        console.log(`Image ${index}: ${rect.width}x${rect.height} in ${parent.width}x${parent.height}`);
    });
}

// 3. IMAGE-FIRST FIX - Ảnh control kích thước
function applyImageFirstFix() {
    console.log('🔧 APPLYING IMAGE-FIRST LOGIC...');
    
    // Step 1: Force tất cả containers thành auto height
    [...mainContainers, ...innerContainers, ...imageContainers].forEach(container => {
        container.style.cssText += `
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            aspect-ratio: auto !important;
            display: block !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
        `;
    });
    
    // Step 2: Force images fill width, auto height
    images.forEach((img, index) => {
        // Remove any existing constraints
        img.style.cssText = '';
        
        // Apply image-first styles
        img.style.cssText += `
            width: 100% !important;
            height: auto !important;
            max-width: 100% !important;
            min-width: 100% !important;
            max-height: none !important;
            min-height: auto !important;
            object-fit: contain !important;
            object-position: center !important;
            display: block !important;
            vertical-align: top !important;
        `;
        
        console.log(`✅ Image ${index}: Applied image-first styles`);
    });
    
    console.log('✅ IMAGE-FIRST LOGIC APPLIED');
}

// 4. Kiểm tra kết quả sau fix
function checkAfterFix() {
    console.log('📏 AFTER FIX:');
    images.forEach((img, index) => {
        const rect = img.getBoundingClientRect();
        const parent = img.parentElement.getBoundingClientRect();
        const utilization = Math.round(rect.width/parent.width*100);
        
        console.log(`Image ${index}: ${rect.width}x${rect.height} in ${parent.width}x${parent.height} = ${utilization}%`, 
            utilization >= 98 ? '✅ GOOD' : '❌ STILL NOT FULL WIDTH');
    });
}

// 5. So sánh container dimensions
function compareContainerSizes() {
    console.log('📐 CONTAINER SIZE COMPARISON:');
    
    mainContainers.forEach((container, index) => {
        const rect = container.getBoundingClientRect();
        const computedStyle = getComputedStyle(container);
        
        console.log(`Main Container ${index}:`, {
            actual: `${rect.width}x${rect.height}`,
            computed_height: computedStyle.height,
            computed_maxHeight: computedStyle.maxHeight,
            computed_minHeight: computedStyle.minHeight,
            computed_aspectRatio: computedStyle.aspectRatio
        });
    });
}

// 6. Run all tests
function runImageFirstTest() {
    console.log('🚀 STARTING IMAGE-FIRST TEST...');
    checkBeforeFix();
    compareContainerSizes();
    applyImageFirstFix();
    
    // Wait for DOM update then check results
    setTimeout(() => {
        checkAfterFix();
        compareContainerSizes();
        console.log('🎯 IMAGE-FIRST TEST COMPLETED');
    }, 500);
}

// Export functions
window.imageFirstTest = {
    runImageFirstTest,
    applyImageFirstFix,
    checkBeforeFix,
    checkAfterFix,
    compareContainerSizes
};

console.log('🎯 Image-First Test Ready!');
console.log('Run: imageFirstTest.runImageFirstTest()');

// Auto-run
runImageFirstTest();