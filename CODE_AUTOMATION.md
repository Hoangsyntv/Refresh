# Shopify Code Quality Automation

## 🚀 Quick Commands

### Auto Code Check & Deploy
```bash
# Main command - Bạn chỉ cần gọi lệnh này!
npm run check-code
```

**Lệnh này sẽ tự động:**
1. ✅ Kiểm tra code theo `SHOPIFY_CODING_STANDARDS.md`
2. 🔧 Tự động fix các lỗi có thể sửa được
3. 🧪 Chạy unit tests
4. 📦 Deploy lên Shopify Staging
5. 📊 Hiển thị báo cáo chi tiết

### Alternative Commands
```bash
# Chỉ kiểm tra code quality (không deploy)
node check-code.js

# Chạy full quality pipeline
npm run quality-check

# Individual commands
npm run lint          # ESLint check
npm run format        # Prettier formatting  
npm run test          # Run Jest tests
npm run deploy-staging # Deploy to staging only
```

## 📋 Code Quality Checks

### ✅ Automatic Checks Include:

#### 🎨 **Liquid Templates**
- Documentation comments present
- Product existence checks
- Proper escaping with `| escape`
- Performance optimization (nested loops)

#### ⚡ **JavaScript**
- No `console.log` in production
- Error handling for all `fetch()` calls
- Function length < 20 lines
- camelCase variable naming
- No hardcoded secrets

#### 🎭 **CSS/SCSS**
- BEM methodology compliance
- CSS custom properties usage
- `!important` overuse detection

#### 📁 **File Naming**
- kebab-case convention
- Consistent naming patterns

#### 🔒 **Security**
- No hardcoded API keys/secrets
- No `eval()` usage
- Environment variables for sensitive data

#### ⚡ **Performance**
- Bundle size < 500KB
- Image optimization
- API response time checks

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Make Script Executable (Optional)
```bash
# Linux/Mac
chmod +x check-code.js

# Windows - no action needed
```

### 3. Configure Husky (Pre-commit Hooks)
```bash
npx husky install
npx husky add .husky/pre-commit "npm run check-code"
```

## 📊 Output Examples

### ✅ Success Output
```
🚀 Starting Shopify Code Quality Check...

✅ Standards file found
🔍 Running quality checks...

📄 Checking Liquid templates...
   Checked 15 Liquid files
⚡ Checking JavaScript code...
   Checked 8 JavaScript files
🎨 Checking stylesheets...
   Checked 12 stylesheet files
📁 Checking file naming conventions...
🔒 Checking security...

🧪 Running tests...
✅ All tests passed

🚀 Deploying to staging...
✅ Successfully deployed to staging

📋 SUMMARY
==================
🎉 All checks passed! Code quality is excellent.
```

### ⚠️ Issues Found Output
```
📋 SUMMARY
==================

❌ ERRORS (2):
   snippets/product-card.liquid: Missing product existence check
   assets/cart.js: Missing error handling for fetch calls

⚠️  WARNINGS (3):
   snippets/header.liquid: Consider adding | escape for user content
   assets/main.js: Function calculateTotal exceeds 20 lines (25 lines)
   assets/styles.css: Too many !important declarations (8)

🔧 AUTO-FIXES APPLIED (1):
   Formatted 5 files with Prettier

📚 For detailed standards, see: SHOPIFY_CODING_STANDARDS.md
```

## 🎯 Usage Scenarios

### 📅 Daily Development
```bash
# Khi bạn hoàn thành feature
npm run check-code

# Output: Kiểm tra + Deploy tự động nếu pass
```

### 🔄 CI/CD Integration
```bash
# Trong GitHub Actions
- name: Quality Check & Deploy
  run: npm run check-code
```

### 🧪 Testing Only
```bash
# Chỉ test không deploy
npm run test
npm run lint
```

## 🔧 Configuration Files

### ESLint Config (`.eslintrc.json`)
```json
{
  "extends": ["@shopify/eslint-plugin"],
  "rules": {
    "max-len": ["error", { "code": 100 }],
    "no-console": "warn",
    "prefer-const": "error"
  }
}
```

### Prettier Config (`.prettierrc`)
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100
}
```

## 🚨 Common Issues & Solutions

### ❌ "Standards file not found"
**Solution:** Đảm bảo file `SHOPIFY_CODING_STANDARDS.md` tồn tại

### ❌ "Tests failed"
**Solution:** Fix failing tests trước khi deploy

### ❌ "Deployment failed"
**Solution:** Kiểm tra Shopify CLI authentication

### ⚠️ "Bundle size exceeds limit"
**Solution:** Optimize images và code splitting

## 📚 Related Files

- `SHOPIFY_CODING_STANDARDS.md` - Detailed coding standards
- `check-code.js` - Main automation script  
- `package.json` - NPM scripts và dependencies
- `.eslintrc.json` - ESLint configuration
- `.prettierrc` - Prettier configuration

## 🎉 Benefits

### 👥 **For Team**
- ✅ Consistent code quality
- ✅ Automated best practices enforcement  
- ✅ Reduced manual review time
- ✅ Faster deployment cycles

### 🚀 **For Project**
- ✅ Better performance
- ✅ Fewer bugs in production
- ✅ Maintainable codebase
- ✅ Professional standards

---

**🎯 Remember:** Chỉ cần chạy `npm run check-code` và để automation lo tất cả!
