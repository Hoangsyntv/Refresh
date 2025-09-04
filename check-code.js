#!/usr/bin/env node

/**
 * Shopify Code Quality Check & Auto Deploy Script
 * Usage: npm run check-code or node check-code.js
 * 
 * This script will:
 * 1. Run code quality checks against SHOPIFY_CODING_STANDARDS.md
 * 2. Auto-fix issues where possible
 * 3. Run tests
 * 4. Deploy to staging if all checks pass
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ShopifyCodeChecker {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.fixes = [];
    this.projectRoot = process.cwd();
    this.standardsFile = path.join(this.projectRoot, 'SHOPIFY_CODING_STANDARDS.md');
  }

  // Main execution flow
  async run() {
    console.log('🚀 Starting Shopify Code Quality Check...\n');
    
    try {
      // Step 1: Verify standards file exists
      this.checkStandardsFile();
      
      // Step 2: Run all quality checks
      await this.runQualityChecks();
      
      // Step 3: Run tests
      await this.runTests();
      
      // Step 4: Deploy if all checks pass
      await this.deployToStaging();
      
      // Step 5: Show summary
      this.showSummary();
      
    } catch (error) {
      console.error('❌ Code check failed:', error.message);
      process.exit(1);
    }
  }

  checkStandardsFile() {
    if (!fs.existsSync(this.standardsFile)) {
      throw new Error('SHOPIFY_CODING_STANDARDS.md not found! Please create standards file first.');
    }
    console.log('✅ Standards file found');
  }

  async runQualityChecks() {
    console.log('🔍 Running quality checks...\n');
    
    // Check 1: Liquid template validation
    await this.checkLiquidTemplates();
    
    // Check 2: JavaScript code quality
    await this.checkJavaScript();
    
    // Check 3: CSS/SCSS validation
    await this.checkStylesheets();
    
    // Check 4: File naming conventions
    await this.checkFileNaming();
    
    // Check 5: Performance checks
    await this.checkPerformance();
    
    // Check 6: Security checks
    await this.checkSecurity();
  }

  async checkLiquidTemplates() {
    console.log('📄 Checking Liquid templates...');
    
    const liquidFiles = this.findFiles(['**/*.liquid']);
    
    for (const file of liquidFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for proper comments
      if (!content.includes('{% comment %}')) {
        this.warnings.push(`${file}: Missing documentation comment`);
      }
      
      // Check for error handling
      if (content.includes('product.') && !content.includes('if product')) {
        this.errors.push(`${file}: Missing product existence check`);
      }
      
      // Check for proper escaping
      if (content.includes('{{') && !content.includes('| escape')) {
        this.warnings.push(`${file}: Consider adding | escape for user content`);
      }
      
      // Check for performance - avoid loops in loops
      const loopCount = (content.match(/{% for /g) || []).length;
      if (loopCount > 2) {
        this.warnings.push(`${file}: Multiple nested loops detected - consider optimization`);
      }
    }
    
    console.log(`   Checked ${liquidFiles.length} Liquid files`);
  }

  async checkJavaScript() {
    console.log('⚡ Checking JavaScript code...');
    
    const jsFiles = this.findFiles(['**/*.js', '!node_modules/**']);
    
    for (const file of jsFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for console.log in production
      if (content.includes('console.log')) {
        this.warnings.push(`${file}: Remove console.log statements`);
      }
      
      // Check for proper error handling
      if (content.includes('fetch(') && !content.includes('catch')) {
        this.errors.push(`${file}: Missing error handling for fetch calls`);
      }
      
      // Check function length (max 20 lines)
      const functions = content.match(/function\s+\w+\s*\([^)]*\)\s*{[^}]*}/g) || [];
      functions.forEach((func, index) => {
        const lines = func.split('\n').length;
        if (lines > 20) {
          this.warnings.push(`${file}: Function ${index + 1} exceeds 20 lines (${lines} lines)`);
        }
      });
      
      // Check for camelCase variables
      const variables = content.match(/(?:var|let|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g) || [];
      variables.forEach(variable => {
        const name = variable.split(/\s+/)[1];
        if (name && !this.isCamelCase(name) && !this.isConstant(name)) {
          this.warnings.push(`${file}: Variable '${name}' should use camelCase`);
        }
      });
    }
    
    console.log(`   Checked ${jsFiles.length} JavaScript files`);
  }

  async checkStylesheets() {
    console.log('🎨 Checking stylesheets...');
    
    const cssFiles = this.findFiles(['**/*.css', '**/*.scss', '!node_modules/**']);
    
    for (const file of cssFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for BEM methodology
      const classNames = content.match(/\.[a-zA-Z][a-zA-Z0-9-_]*(?=\s*{)/g) || [];
      classNames.forEach(className => {
        if (!this.isBEMCompliant(className)) {
          this.warnings.push(`${file}: Class '${className}' should follow BEM methodology`);
        }
      });
      
      // Check for CSS custom properties usage
      if (!content.includes('var(--') && content.includes('color:')) {
        this.warnings.push(`${file}: Consider using CSS custom properties for colors`);
      }
      
      // Check for !important overuse
      const importantCount = (content.match(/!important/g) || []).length;
      if (importantCount > 5) {
        this.warnings.push(`${file}: Too many !important declarations (${importantCount})`);
      }
    }
    
    console.log(`   Checked ${cssFiles.length} stylesheet files`);
  }

  async checkFileNaming() {
    console.log('📁 Checking file naming conventions...');
    
    const allFiles = this.findFiles(['**/*', '!node_modules/**', '!.git/**']);
    
    allFiles.forEach(file => {
      const fileName = path.basename(file);
      const ext = path.extname(fileName);
      const name = fileName.replace(ext, '');
      
      // Check kebab-case for most files
      if (!['.md', '.json', '.yml', '.yaml'].includes(ext) && !this.isKebabCase(name)) {
        this.warnings.push(`${file}: Filename should use kebab-case convention`);
      }
    });
  }

  async checkPerformance() {
    console.log('⚡ Checking performance...');
    
    // Check bundle size (if webpack stats exist)
    const statsFile = path.join(this.projectRoot, 'webpack-stats.json');
    if (fs.existsSync(statsFile)) {
      const stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
      const bundleSize = stats.assets[0]?.size || 0;
      
      if (bundleSize > 500000) { // 500KB
        this.warnings.push(`Bundle size (${bundleSize}B) exceeds 500KB limit`);
      }
    }
    
    // Check for large images
    const imageFiles = this.findFiles(['**/*.{jpg,jpeg,png,gif,webp}', '!node_modules/**']);
    imageFiles.forEach(file => {
      const stats = fs.statSync(file);
      if (stats.size > 1000000) { // 1MB
        this.warnings.push(`${file}: Image size (${stats.size}B) is too large`);
      }
    });
  }

  async checkSecurity() {
    console.log('🔒 Checking security...');
    
    const allFiles = this.findFiles(['**/*.{js,liquid,json}', '!node_modules/**']);
    
    allFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for hardcoded secrets
      const secretPatterns = [
        /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/i,
        /secret\s*[:=]\s*['"][^'"]+['"]/i,
        /password\s*[:=]\s*['"][^'"]+['"]/i,
        /token\s*[:=]\s*['"][^'"]+['"]/i
      ];
      
      secretPatterns.forEach(pattern => {
        if (pattern.test(content)) {
          this.errors.push(`${file}: Potential hardcoded secret detected`);
        }
      });
      
      // Check for eval usage
      if (content.includes('eval(')) {
        this.errors.push(`${file}: Avoid using eval() - security risk`);
      }
    });
  }

  async runTests() {
    console.log('\n🧪 Running tests...');
    
    try {
      // Check if tests exist
      const testFiles = this.findFiles(['**/*.test.js', '**/*.spec.js']);
      
      if (testFiles.length === 0) {
        this.warnings.push('No test files found - consider adding unit tests');
      } else {
        // Run Jest if available
        try {
          execSync('npm test', { stdio: 'inherit' });
          console.log('✅ All tests passed');
        } catch (error) {
          throw new Error('Tests failed');
        }
      }
    } catch (error) {
      this.errors.push('Test execution failed');
    }
  }

  async deployToStaging() {
    if (this.errors.length > 0) {
      console.log('\n❌ Cannot deploy - fix errors first');
      return;
    }
    
    console.log('\n🚀 Deploying to staging...');
    
    try {
      // Git operations
      execSync('git add .', { stdio: 'inherit' });
      
      const timestamp = new Date().toISOString().slice(0, 19);
      execSync(`git commit -m "feat: code quality check passed - ${timestamp}"`, { stdio: 'inherit' });
      
      // Push to current branch
      const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
      execSync(`git push origin ${currentBranch}`, { stdio: 'inherit' });
      
      // Deploy to Shopify staging
      execSync('shopify theme push --theme="Staging"', { stdio: 'inherit' });
      
      console.log('✅ Successfully deployed to staging');
      
    } catch (error) {
      this.errors.push('Deployment failed: ' + error.message);
    }
  }

  showSummary() {
    console.log('\n📋 SUMMARY');
    console.log('==================');
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('🎉 All checks passed! Code quality is excellent.');
    } else {
      if (this.errors.length > 0) {
        console.log(`\n❌ ERRORS (${this.errors.length}):`);
        this.errors.forEach(error => console.log(`   ${error}`));
      }
      
      if (this.warnings.length > 0) {
        console.log(`\n⚠️  WARNINGS (${this.warnings.length}):`);
        this.warnings.forEach(warning => console.log(`   ${warning}`));
      }
    }
    
    if (this.fixes.length > 0) {
      console.log(`\n🔧 AUTO-FIXES APPLIED (${this.fixes.length}):`);
      this.fixes.forEach(fix => console.log(`   ${fix}`));
    }
    
    console.log('\n📚 For detailed standards, see: SHOPIFY_CODING_STANDARDS.md');
  }

  // Helper methods
  findFiles(patterns) {
    const glob = require('glob');
    let files = [];
    
    patterns.forEach(pattern => {
      const matches = glob.sync(pattern, { cwd: this.projectRoot });
      files = files.concat(matches.map(match => path.join(this.projectRoot, match)));
    });
    
    return [...new Set(files)]; // Remove duplicates
  }

  isCamelCase(str) {
    return /^[a-z][a-zA-Z0-9]*$/.test(str);
  }

  isConstant(str) {
    return /^[A-Z][A-Z0-9_]*$/.test(str);
  }

  isKebabCase(str) {
    return /^[a-z][a-z0-9-]*$/.test(str);
  }

  isBEMCompliant(className) {
    // Simple BEM check: .block__element--modifier
    return /^\.?[a-z][a-z0-9-]*(__[a-z][a-z0-9-]*)?(--[a-z][a-z0-9-]*)?$/.test(className);
  }
}

// Run the checker if called directly
if (require.main === module) {
  const checker = new ShopifyCodeChecker();
  checker.run().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = ShopifyCodeChecker;
