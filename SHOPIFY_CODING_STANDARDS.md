# Shopify Development Standards - Team Guidelines

## 📋 Table of Contents
1. [Official Shopify Standards](#1-official-shopify-standards)
2. [Clean Code Principles](#2-clean-code-principles)
3. [Naming Conventions](#3-naming-conventions)
4. [Mandatory Requirements](#4-mandatory-requirements)
5. [Performance Standards](#5-performance-standards)
6. [Required Tools](#6-required-tools)
7. [Git Standards](#7-git-standards)
8. [File Structure](#8-file-structure)
9. [Code Examples](#9-code-examples)
10. [Learning Resources](#10-learning-resources)

---

## 1. Official Shopify Standards

### ✅ Core Requirements
- **Ruby Style Guide** + RuboCop compliance
- **Liquid Template Best Practices** adherence
- **App Store Requirements** compliance
- **Performance**: Lighthouse score > 90
- **Accessibility**: WCAG 2.1 AA standards

### 🎯 Key Metrics
```yaml
Performance Targets:
  - Page Load: < 3 seconds
  - Lighthouse Score: > 90
  - Core Web Vitals: All green
  - Bundle Size: < 500KB
```

---

## 2. Clean Code Principles

### 🏗️ SOLID Principles
```javascript
// ✅ Single Responsibility
function calculateTax(price, taxRate) {
  return price * taxRate;
}

function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

// ❌ Multiple Responsibilities
function processOrder(order) {
  // Calculate tax, format currency, send email, update inventory
  // TOO MANY RESPONSIBILITIES!
}
```

### 🔄 DRY - Don't Repeat Yourself
```liquid
<!-- ✅ Good: Use snippets for reusable components -->
{% render 'product-card', product: product, show_vendor: true %}

<!-- ❌ Bad: Duplicate HTML structure -->
<div class="product-card">
  <img src="{{ product.featured_image | img_url: '300x300' }}">
  <h3>{{ product.title }}</h3>
  <p>{{ product.price | money }}</p>
</div>
```

### 💡 KISS - Keep It Simple
```javascript
// ✅ Simple and clear
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ❌ Overly complex
function validateEmailAddressWithAdvancedChecking(emailString) {
  // 50 lines of complex regex and validation logic
}
```

### 📏 Function Size Limit
- **Maximum 20 lines per function**
- **Single purpose per function**
- **Clear, descriptive names**

---

## 3. Naming Conventions

### 📝 Variable & Function Names
```javascript
// ✅ camelCase for variables and functions
const productPrice = 29.99;
const customerEmail = 'customer@example.com';

function calculateShippingCost(weight, destination) {
  // Implementation
}

function validateUserInput(inputData) {
  // Implementation
}
```

### 🧩 Component Names
```javascript
// ✅ PascalCase for components
class ProductCard extends HTMLElement {
  constructor() {
    super();
  }
}

const CartDrawer = {
  init() {
    // Implementation
  }
};
```

### 🔒 Constants
```javascript
// ✅ UPPER_CASE for constants
const MAX_QUANTITY = 999;
const API_ENDPOINT = 'https://api.shopify.com';
const SHIPPING_RATES = {
  STANDARD: 5.99,
  EXPRESS: 12.99,
  OVERNIGHT: 24.99
};
```

### 📁 File Names
```
✅ kebab-case for files
product-card.liquid
shipping-calculator.js
customer-reviews.css
mega-menu-navigation.liquid

❌ Wrong naming
ProductCard.liquid
shipping_calculator.js
CustomerReviews.css
```

---

## 4. Mandatory Requirements

### 🛡️ Error Handling
```javascript
// ✅ Proper error handling for API calls
async function fetchProducts(collectionId) {
  try {
    const response = await fetch(`/collections/${collectionId}/products.json`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.products;
    
  } catch (error) {
    console.error('Failed to fetch products:', error);
    
    // Show user-friendly error message
    showErrorMessage('Unable to load products. Please try again.');
    
    // Return empty array as fallback
    return [];
  }
}
```

### ✅ Input Validation
```javascript
// ✅ Validate all user inputs
function addToCart(productId, quantity) {
  // Validate product ID
  if (!productId || typeof productId !== 'string') {
    throw new Error('Invalid product ID');
  }
  
  // Validate quantity
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
    throw new Error(`Quantity must be between 1 and ${MAX_QUANTITY}`);
  }
  
  // Proceed with adding to cart
  return cartAPI.add(productId, quantity);
}
```

### 🔐 Environment Variables
```javascript
// ✅ Use environment variables for secrets
const SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_URL;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

// ❌ Never hardcode secrets
const API_KEY = 'sk_12345_abcdef'; // NEVER DO THIS!
```

### 🧪 Unit Tests (80%+ coverage)
```javascript
// ✅ Example test file: calculateTax.test.js
describe('calculateTax', () => {
  test('should calculate tax correctly', () => {
    expect(calculateTax(100, 0.08)).toBe(8);
  });
  
  test('should handle zero tax rate', () => {
    expect(calculateTax(100, 0)).toBe(0);
  });
  
  test('should throw error for invalid inputs', () => {
    expect(() => calculateTax('invalid', 0.08)).toThrow();
  });
});
```

### 🔍 GraphQL Best Practices
```graphql
# ✅ Query only necessary fields
query getProducts($first: Int!) {
  products(first: $first) {
    edges {
      node {
        id
        title
        handle
        featuredImage {
          url
          altText
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
}

# ❌ Don't query unnecessary data
query getAllProductData {
  products {
    edges {
      node {
        # Querying ALL fields unnecessarily
      }
    }
  }
}
```

---

## 5. Performance Standards

### ⚡ Response Time Targets
```yaml
API Response Times:
  - Product fetch: < 200ms
  - Cart operations: < 150ms
  - Search queries: < 300ms
  - Checkout process: < 500ms

Database Queries:
  - Simple queries: < 50ms
  - Complex queries: < 100ms
  - Bulk operations: < 200ms
```

### 📦 Bundle Size Optimization
```javascript
// ✅ Code splitting and lazy loading
const CartDrawer = () => import('./components/cart-drawer.js');

// ✅ Tree shaking unused code
import { debounce } from 'lodash-es'; // Import only what you need

// ❌ Importing entire libraries
import _ from 'lodash'; // Imports everything
```

### 🚦 Rate Limiting
```javascript
// ✅ Implement rate limiting
class APIRateLimiter {
  constructor(maxRequests = 100, windowMs = 60000) {
    this.requests = new Map();
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }
  
  isAllowed(identifier) {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return true;
  }
}
```

---

## 6. Required Tools

### 🛠️ Development Tools Setup
```json
// package.json dependencies
{
  "devDependencies": {
    "eslint": "^8.0.0",
    "prettier": "^2.8.0",
    "@shopify/eslint-plugin": "^42.0.0",
    "@shopify/prettier-config": "^1.1.2",
    "husky": "^8.0.0",
    "jest": "^29.0.0",
    "@shopify/cli": "^3.0.0"
  }
}
```

### ⚙️ ESLint Configuration
```json
// .eslintrc.json
{
  "extends": ["@shopify/eslint-plugin"],
  "rules": {
    "max-len": ["error", { "code": 100 }],
    "no-console": "warn",
    "prefer-const": "error",
    "no-unused-vars": "error"
  }
}
```

### 🎨 Prettier Configuration
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### 🪝 Husky Pre-commit Hooks
```json
// .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
npm run test
npm run build
```

---

## 7. Git Standards

### 📝 Commit Message Format
```bash
# ✅ Good commit messages
feat: add mega menu hover functionality
fix: resolve cart drawer z-index conflict
refactor: optimize product card component
docs: update API documentation
test: add unit tests for price calculator
style: format code with prettier
perf: lazy load product images

# ❌ Bad commit messages
update stuff
fix bug
changes
WIP
```

### 🌿 Branch Naming Conventions
```bash
# ✅ Feature branches
feature/mega-menu-implementation
feature/product-recommendations
feature/checkout-optimization

# ✅ Bug fix branches
bugfix/cart-quantity-validation
bugfix/mobile-navigation-overflow

# ✅ Hotfix branches
hotfix/security-vulnerability-patch
hotfix/payment-gateway-error

# ✅ Release branches
release/v2.1.0
release/holiday-theme-updates
```

### 🔄 Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] Performance impact assessed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console.log statements
```

---

## 8. File Structure

### 📁 Recommended Directory Structure
```
shopify-theme/
├── assets/
│   ├── styles/
│   │   ├── base/
│   │   ├── components/
│   │   └── utilities/
│   ├── scripts/
│   │   ├── components/
│   │   ├── utils/
│   │   └── vendors/
│   └── images/
├── config/
├── layout/
├── locales/
├── sections/
├── snippets/
│   ├── components/
│   ├── icons/
│   └── utilities/
├── templates/
├── tests/
├── docs/
└── SHOPIFY_CODING_STANDARDS.md
```

### 🧩 Component Organization
```liquid
<!-- snippets/components/product-card.liquid -->
{% comment %}
  Product Card Component
  
  Usage:
  {% render 'components/product-card', 
     product: product, 
     show_vendor: true,
     image_size: '300x300' %}
{% endcomment %}

{% liquid
  assign image_size = image_size | default: '300x300'
  assign show_vendor = show_vendor | default: false
%}

<div class="product-card" data-product-id="{{ product.id }}">
  <!-- Component implementation -->
</div>
```

---

## 9. Code Examples

### 🎯 Liquid Template Best Practices
```liquid
<!-- ✅ Good: Efficient liquid code -->
{% liquid
  assign featured_products = collections.featured.products | limit: 8
  assign has_discount = product.compare_at_price > product.price
  
  if has_discount
    assign discount_percentage = product.compare_at_price | minus: product.price | times: 100 | divided_by: product.compare_at_price | round
  endif
%}

<!-- ✅ Good: Proper error handling -->
{% if product.featured_image %}
  <img src="{{ product.featured_image | img_url: '300x300' }}" 
       alt="{{ product.featured_image.alt | escape }}"
       loading="lazy">
{% else %}
  <div class="product-image-placeholder">
    {% render 'icon-product-placeholder' %}
  </div>
{% endif %}

<!-- ❌ Bad: No error handling -->
<img src="{{ product.featured_image | img_url: '300x300' }}">
```

### 🎨 CSS/SCSS Best Practices
```scss
// ✅ Good: BEM methodology
.product-card {
  display: flex;
  flex-direction: column;
  
  &__image {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
  }
  
  &__title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  &__price {
    color: var(--color-primary);
    font-weight: 700;
    
    &--on-sale {
      color: var(--color-sale);
    }
  }
  
  &--featured {
    border: 2px solid var(--color-accent);
  }
}

// ✅ Good: CSS Custom Properties
:root {
  --color-primary: #1a1a1a;
  --color-secondary: #666;
  --color-accent: #ff6b35;
  --color-sale: #e74c3c;
  --spacing-small: 0.5rem;
  --spacing-medium: 1rem;
  --spacing-large: 2rem;
}
```

### ⚡ JavaScript Best Practices
```javascript
// ✅ Good: Modern ES6+ syntax with error handling
class CartManager {
  constructor() {
    this.items = this.loadFromStorage();
    this.listeners = new Set();
  }
  
  async addItem(productId, quantity = 1) {
    try {
      this.validateInput(productId, quantity);
      
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          id: productId,
          quantity: quantity
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add item: ${response.statusText}`);
      }
      
      const result = await response.json();
      this.updateCartUI(result);
      this.notifyListeners('item-added', result);
      
      return result;
      
    } catch (error) {
      console.error('Cart add error:', error);
      this.showErrorMessage('Unable to add item to cart');
      throw error;
    }
  }
  
  validateInput(productId, quantity) {
    if (!productId || typeof productId !== 'string') {
      throw new Error('Invalid product ID');
    }
    
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error('Invalid quantity');
    }
  }
  
  // Debounced quantity update
  updateQuantity = debounce(async (itemId, quantity) => {
    try {
      await this.changeItemQuantity(itemId, quantity);
    } catch (error) {
      this.handleUpdateError(error);
    }
  }, 300);
}
```

---

## 10. Learning Resources

### 📚 Essential Reading
1. **Clean Code** by Robert Martin
2. **Shopify Ruby Style Guide**
3. **Shopify Theme Best Practices**
4. **App Store Requirements Documentation**
5. **Liquid Template Language Documentation**

### 🔗 Official Shopify Resources
- [Shopify CLI Documentation](https://shopify.dev/tools/cli)
- [Theme Development Tools](https://shopify.dev/tools/theme-development)
- [Shopify Scripts Documentation](https://shopify.dev/apps/checkout)
- [GraphQL Storefront API](https://shopify.dev/api/storefront)

### 🛠️ Development Tools
- [Shopify Theme Inspector](https://shopify.dev/tools/theme-inspector)
- [Shopify Scripts Editor](https://help.shopify.com/en/manual/checkout-settings/script-editor)
- [Theme Check](https://github.com/Shopify/theme-check)

---

## 🏆 Golden Rules

> **"Code must read like prose, always handle errors, performance first."**

### ✨ Core Principles
1. **Readability First**: Code is read more than it's written
2. **Error Handling**: Never assume everything will work
3. **Performance**: Every millisecond matters for user experience
4. **Consistency**: Follow conventions religiously
5. **Testing**: If it's not tested, it's broken
6. **Documentation**: Future you will thank present you

### 🚨 Never Do
- Hardcode API keys or secrets
- Skip error handling
- Ignore performance implications
- Write functions longer than 20 lines
- Commit without testing
- Use `console.log` in production
- Ignore accessibility standards

### ✅ Always Do
- Write descriptive commit messages
- Add unit tests for new functionality
- Handle edge cases and errors
- Optimize for performance
- Follow naming conventions
- Document complex logic
- Review your own code before submitting

---

*Last updated: September 2025*
*Version: 1.0.0*
