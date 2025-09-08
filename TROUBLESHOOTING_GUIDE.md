# 🚨 THUMBNAIL GALLERY TROUBLESHOOTING GUIDE

## IMMEDIATE DEBUG STEPS

### Step 1: Add Debug Tool
1. **Upload** the file `full-debug-thumbnail.liquid` to your **Snippets** folder
2. **Edit** `sections/main-product.liquid`
3. **Add this line** right after the opening `<product-info>` tag (around line 12):
   ```liquid
   {% render 'full-debug-thumbnail' %}
   ```
4. **Save** and **refresh** your product page
5. **Look for the green debug box** - it will tell you exactly what's wrong

---

## COMMON ISSUES & FIXES

### 🔴 Issue 1: "Gallery Layout: UNDEFINED" or not "thumbnail"
**FIX:**
1. Go to **Theme Customizer**
2. Navigate to your product page
3. Click **"Product information"** section in the left panel
4. Find **"Gallery layout"** dropdown
5. Select **"Thumbnail"**
6. Click **Save**

### 🔴 Issue 2: "No product images found"
**FIX:**
1. Go to **Shopify Admin** → **Products**
2. Edit the product
3. **Upload product images** in the Media section
4. **Save product**

### 🔴 Issue 3: CSS/JS files showing 404 errors
**FIX:**
1. **Re-upload files** to correct folders:
   - `product-thumbnail-gallery.css` → **Assets** folder
   - `product-thumbnail-gallery.js` → **Assets** folder
   - `product-thumbnail-gallery.liquid` → **Snippets** folder

### 🔴 Issue 4: Files uploaded but not loading
**FIX:** Check if code changes were made in `main-product.liquid`:

**Add near line 19:**
```liquid
{%- if section.settings.gallery_layout == 'thumbnail' -%}
  {{ 'product-thumbnail-gallery.css' | asset_url | stylesheet_tag }}
{%- endif -%}
```

**Add near line 54:**
```liquid
{%- if section.settings.gallery_layout == 'thumbnail' -%}
  <script src="{{ 'product-thumbnail-gallery.js' | asset_url }}" defer="defer"></script>
{%- endif -%}
```

**Replace gallery render section (around line 93):**
```liquid
{%- if section.settings.gallery_layout == 'thumbnail' -%}
  {% render 'product-thumbnail-gallery', 
     product: product, 
     section_id: section.id,
     enable_zoom: section.settings.image_zoom %}
{%- else -%}
  {% render 'product-media-gallery', variant_images: variant_images %}
{%- endif -%}
```

### 🔴 Issue 5: Gallery appears but doesn't work (thumbnails don't click)
**FIX:**
1. **Open browser console** (F12 → Console tab)
2. **Look for JavaScript errors** (red text)
3. **Try incognito mode** (clears cache)
4. **Check if JavaScript file is correct** - re-upload `product-thumbnail-gallery.js`

---

## VERIFICATION CHECKLIST

After making changes, verify these work:

- [ ] **Green debug box appears** on product page
- [ ] **Gallery Layout shows "thumbnail"** in debug box
- [ ] **Product images count > 0** in debug box
- [ ] **CSS/JS files load without 404 errors**
- [ ] **Thumbnail gallery renders** in the dashed border area
- [ ] **Thumbnails appear** (left side on desktop, bottom on mobile)
- [ ] **Clicking thumbnails changes main image**
- [ ] **Active thumbnail is highlighted**

---

## NUCLEAR OPTION: Fresh Start

If nothing works, start over:

1. **Delete all uploaded files**
2. **Revert main-product.liquid changes**
3. **Follow the original implementation guide step by step**
4. **Test with debug tool after each step**

---

## BROWSER CONSOLE COMMANDS

Paste these in browser console (F12) for quick checks:

```javascript
// Check if files loaded
console.log('CSS:', !!document.querySelector('link[href*="thumbnail-gallery"]'));
console.log('JS:', typeof window.ProductThumbnailGallery);
console.log('Galleries:', document.querySelectorAll('[data-product-gallery]').length);

// Force initialize (if JS loaded but not working)
document.querySelectorAll('[data-product-gallery]').forEach(gallery => {
  new window.ProductThumbnailGallery(gallery);
});
```

---

## GET SPECIFIC HELP

**Tell me exactly what you see in the debug box, and I can give you the exact fix needed.**