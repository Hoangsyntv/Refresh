# 🚀 Shopify Thumbnail Gallery Implementation Guide

## Files to Upload

### 1. **CSS File: `product-thumbnail-gallery.css`**
Location: **Assets** folder
Content: Copy from `assets/product-thumbnail-gallery.css` (full file)

### 2. **JavaScript File: `product-thumbnail-gallery.js`**
Location: **Assets** folder  
Content: Copy from `assets/product-thumbnail-gallery.js` (full file)

### 3. **Liquid Snippet: `product-thumbnail-gallery.liquid`**
Location: **Snippets** folder
Content: Copy from `snippets/product-thumbnail-gallery.liquid` (full file)

---

## Code Changes Needed

### **A. Update `sections/main-product.liquid`**

#### 1. Add CSS Loading (around line 12-20):
```liquid
{%- if section.settings.gallery_layout == 'thumbnail' -%}
  {{ 'product-thumbnail-gallery.css' | asset_url | stylesheet_tag }}
{%- endif -%}
```

#### 2. Add JavaScript Loading (around line 46-55):
```liquid
{%- if section.settings.gallery_layout == 'thumbnail' -%}
  <script src="{{ 'product-thumbnail-gallery.js' | asset_url }}" defer="defer"></script>
{%- endif -%}
```

#### 3. Update Gallery Render (around line 87-94):

**Replace this:**
```liquid
{% render 'product-media-gallery', variant_images: variant_images %}
```

**With this:**
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

---

## Activation Steps

1. **Upload all 3 files** to respective folders
2. **Make the 3 code changes** above
3. **Go to Theme Customizer**
4. **Navigate to any product page**
5. **Click "Product information" section**
6. **Set "Gallery layout" to "Thumbnail"**
7. **Save changes**

---

## Quick Test Debug (Optional)

Add this to test if files are working:

**Create:** `snippets/debug-gallery.liquid`
```liquid
<div style="background:#f0f0f0;padding:10px;border:1px solid #ccc;margin:10px 0;">
  <strong>Gallery Debug:</strong>
  <br>Layout: {{ section.settings.gallery_layout }}
  <br>Images: {{ product.images.size }}
  <br>Should show thumbnails: 
  {% if section.settings.gallery_layout == 'thumbnail' %}✅ YES{% else %}❌ NO{% endif %}
</div>
```

**Add to main-product.liquid** (temporarily):
```liquid
{% render 'debug-gallery' %}
```

This will show you exactly what's happening.

---

## Expected Result

**Desktop:**
```
[Thumb1]  [     Main Image     ]
[Thumb2]  [       Large        ]
[Thumb3]  [     Product        ]
[Thumb4]  [      Display       ]
```

**Mobile:**
```
[        Main Image        ]
[    Large Display        ]

[T1] [T2] [T3] [T4] [T5] →
```

---

## Common Issues

❌ **Files not uploaded** → Upload to correct folders
❌ **Setting not changed** → Set gallery_layout to "thumbnail"  
❌ **Code not added** → Add the 3 code changes above
❌ **Caching** → Clear browser cache / try incognito

✅ **Success indicators:**
- Thumbnails appear on left (desktop) or bottom (mobile)
- Clicking thumbnails changes main image
- Smooth transitions between images
- Active thumbnail is highlighted