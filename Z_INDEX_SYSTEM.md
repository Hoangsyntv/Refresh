# Z-Index System - Shopify Theme Standards

## 🎯 **Problem Statement**
Việc sử dụng z-index ngẫu nhiên (999999, 10000, etc.) gây ra conflicts và khó maintain. Cần hệ thống có tổ chức.

## 📚 **Z-Index Layer System**

### **Layer 1: Base Elements (1-99)**
```css
/* Basic page elements */
.breadcrumb              { z-index: 50; }
.page-content           { z-index: 10; }
.footer                 { z-index: 20; }
.background-elements    { z-index: 1-30; }
```

### **Layer 2: Navigation (100-199)**
```css
/* Navigation components */
.header__inline-menu           { z-index: 150; }  /* Normal navbar */
.header__search               { z-index: 160; }  /* Search in navbar */
.mobile-menu                  { z-index: 170; }  /* Mobile navigation */
.secondary-nav               { z-index: 140; }  /* Secondary navigation */
```

### **Layer 3: Overlays & Dropdowns (200-299)**
```css
/* Dropdowns, mega menus, overlays */
.mega-menu__panel            { z-index: 250; }  /* Mega menu dropdowns */
.dropdown-menu              { z-index: 220; }  /* Regular dropdowns */
.tooltip                    { z-index: 230; }  /* Tooltips */
.popover                    { z-index: 240; }  /* Popovers */
.search-results             { z-index: 260; }  /* Search results overlay */
```

### **Layer 4: Critical UI (300-399)**
```css
/* Important UI that must be on top */
.header__inline-menu.is-sticky  { z-index: 350; }  /* Sticky navbar */
.cart-drawer                    { z-index: 320; }  /* Cart sidebar */
.notification-banner           { z-index: 310; }  /* Important notifications */
.mega-menu__panel.sticky-parent { z-index: 360; }  /* Mega menu over sticky navbar */
```

### **Layer 5: Modals & Critical Overlays (400-499)**
```css
/* Modals and critical overlays */
.modal-backdrop             { z-index: 400; }  /* Modal background */
.modal-content              { z-index: 410; }  /* Modal content */
.loading-overlay           { z-index: 420; }  /* Loading screens */
.error-overlay             { z-index: 430; }  /* Error messages */
```

### **Layer 6: Emergency/Debug (500+)**
```css
/* Only for debugging or emergency fixes */
.debug-overlay             { z-index: 9999; }  /* Debug tools */
.emergency-banner          { z-index: 9998; }  /* Emergency notifications */
```

## 📋 **Z-Index Rules & Guidelines**

### **✅ DO's:**

#### **1. Follow the Layer System**
```css
/* ✅ Good: Following layer system */
.mega-menu { z-index: 250; }  /* Layer 3: Overlays */
.navbar    { z-index: 150; }  /* Layer 2: Navigation */

/* ❌ Bad: Random high numbers */
.mega-menu { z-index: 99999; }
.navbar    { z-index: 1000000; }
```

#### **2. Use Meaningful Comments**
```css
/* ✅ Good: Explain why */
.sticky-navbar {
  z-index: 350; /* Layer 4: Must be above all dropdowns and overlays */
}

/* ❌ Bad: No explanation */
.sticky-navbar {
  z-index: 9999; /* High z-index */
}
```

#### **3. Consider Context**
```css
/* ✅ Good: Context-aware z-index */
.mega-menu__panel {
  z-index: 250; /* Normal state: Layer 3 */
}

.header.is-sticky .mega-menu__panel {
  z-index: 360; /* Sticky state: Above sticky navbar */
}
```

#### **4. Document Relationships**
```css
/*
  Z-Index Hierarchy:
  - Breadcrumb: 50 (base)
  - Navbar: 150 (navigation)
  - Mega Menu: 250 (overlay)
  - Sticky Navbar: 350 (critical)
  - Mega Menu over Sticky: 360 (critical)
*/
```

### **❌ DON'T's:**

#### **1. Don't Use Arbitrary High Numbers**
```css
/* ❌ Bad: Why 99999? */
.element { z-index: 99999; }

/* ✅ Good: Systematic approach */
.element { z-index: 250; } /* Layer 3: Overlays */
```

#### **2. Don't Stack Without Planning**
```css
/* ❌ Bad: Z-index war */
.menu    { z-index: 1000; }
.submenu { z-index: 2000; }
.tooltip { z-index: 3000; }

/* ✅ Good: Planned hierarchy */
.menu    { z-index: 150; }  /* Navigation layer */
.submenu { z-index: 250; }  /* Overlay layer */
.tooltip { z-index: 230; }  /* Tooltip sublayer */
```

#### **3. Don't Ignore Stacking Context**
```css
/* ❌ Bad: Creating unnecessary stacking context */
.parent {
  transform: translateZ(0); /* Creates new stacking context */
  z-index: 1;
}
.child {
  z-index: 9999; /* Won't work as expected */
}

/* ✅ Good: Understand stacking context */
.parent {
  position: relative; /* No transform */
}
.child {
  z-index: 250; /* Works as expected */
}
```

## 🔧 **Implementation Guidelines**

### **1. Audit Existing Z-Indexes**
```bash
# Find all z-index usage
grep -r "z-index" assets/ snippets/ sections/

# Look for patterns like:
# z-index: 9999
# z-index: 10000
# z-index: 999999
```

### **2. Refactor Systematically**
```css
/* Before: Random numbers */
.navbar         { z-index: 1000; }
.mega-menu      { z-index: 99999; }
.sticky-navbar  { z-index: 10000; }

/* After: System approach */
.navbar         { z-index: 150; }  /* Layer 2: Navigation */
.mega-menu      { z-index: 250; }  /* Layer 3: Overlays */
.sticky-navbar  { z-index: 350; }  /* Layer 4: Critical UI */
```

### **3. Create Z-Index Variables**
```css
:root {
  /* Layer 1: Base Elements */
  --z-base: 10;
  --z-breadcrumb: 50;
  
  /* Layer 2: Navigation */
  --z-navbar: 150;
  --z-search: 160;
  
  /* Layer 3: Overlays */
  --z-dropdown: 220;
  --z-mega-menu: 250;
  
  /* Layer 4: Critical UI */
  --z-navbar-sticky: 350;
  --z-mega-menu-sticky: 360;
  
  /* Layer 5: Modals */
  --z-modal: 400;
}

/* Usage */
.navbar { z-index: var(--z-navbar); }
.mega-menu { z-index: var(--z-mega-menu); }
```

## 🧪 **Testing Z-Index Issues**

### **1. Visual Debugging**
```css
/* Add to debug z-index issues */
.debug-z-index * {
  outline: 2px solid red;
  background: rgba(255, 0, 0, 0.1) !important;
}

.debug-z-index *:before {
  content: "z:" attr(style);
  position: absolute;
  top: 0;
  left: 0;
  font-size: 10px;
  background: yellow;
  color: black;
}
```

### **2. Browser DevTools**
```javascript
// Check z-index hierarchy in console
document.querySelectorAll('*').forEach(el => {
  const zIndex = window.getComputedStyle(el).zIndex;
  if (zIndex !== 'auto') {
    console.log(el, 'z-index:', zIndex);
  }
});
```

## 📊 **Current Implementation Status**

### **✅ Fixed Elements:**
- **Navbar**: z-index 150 (Layer 2)
- **Sticky Navbar**: z-index 350 (Layer 4)  
- **Mega Menu**: z-index 250 (Layer 3)
- **Mega Menu over Sticky**: z-index 360 (Layer 4)
- **Breadcrumb**: z-index 50 (Layer 1)

### **🔄 To Review:**
- Search modal z-index
- Cart drawer z-index
- Mobile menu z-index
- Product quick view z-index

## 🎯 **Benefits of This System**

1. **Predictable**: Know which element will be on top
2. **Maintainable**: Easy to add new elements
3. **Debuggable**: Clear hierarchy for troubleshooting
4. **Scalable**: Room for growth in each layer
5. **Team-friendly**: Everyone follows same rules

## 🚨 **Emergency Protocol**

If urgent z-index fix needed:

1. **Identify the layer conflict**
2. **Use next available number in appropriate layer**
3. **Document the decision**
4. **Schedule proper refactor**

```css
/* Emergency fix example */
.urgent-fix {
  z-index: 251; /* Layer 3: Next available after mega-menu (250) */
  /* TODO: Refactor with proper system review */
}
```

---

**Remember:** Z-index problems always come from lack of system, not lack of higher numbers! 🎯
