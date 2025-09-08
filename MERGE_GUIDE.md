# 🔄 Merge Guide - Xử lý Xung đột Git Mượt Mà

## 🚨 **Khi Merge Bị Kẹt/Dừng Giữa Chừng**

### **Bước 1: Làm sạch trạng thái**
```bash
# Hủy merge/rebase đang dở (thử cả 2 lệnh)
git merge --abort 2>/dev/null || true
git rebase --abort 2>/dev/null || true
git merge --quit  # Quit merge hoàn toàn

# Reset về trạng thái clean nếu còn staged changes
git reset --hard HEAD

# Kiểm tra status
git status
```

### **Bước 2: Cập nhật remote**
```bash
git fetch origin
```

## 🎯 **Quy trình Merge Mượt mà (staging → main)**

### **Phương pháp: Rebase trước rồi Fast-forward merge**

```bash
# 1. Chuyển sang staging
git switch staging

# 2. Rebase staging lên main (đưa staging "đứng trên" main)
git rebase origin/main

# 3. Nếu có conflict - xử lý từng file
# Chọn version muốn giữ:
git checkout --ours file_name.liquid     # Giữ version staging
# hoặc
git checkout --theirs file_name.liquid   # Giữ version main

# 4. Soát lại file và remove các dấu <<<<<<< ======= >>>>>>>
code snippets/breadcrumb.liquid

# 5. Mark resolved và tiếp tục rebase
git add file_name.liquid
git rebase --continue

# 6. Push staging với lịch sử mới
git push --force-with-lease origin staging

# 7. Merge vào main (fast-forward, không conflict)
git switch main
git merge --ff-only staging
git push origin main
```

## 📋 **Checklist Trước Mỗi Lần Merge**

### **✅ Chuẩn bị:**
- [ ] `git status` - working tree clean
- [ ] `git fetch origin` - update remote info
- [ ] Test trên staging theme thành công
- [ ] Backup current live theme (nếu quan trọng)

### **✅ Trong quá trình:**
- [ ] Rebase instead of merge để lịch sử sạch
- [ ] Dùng `--force-with-lease` thay vì `--force`
- [ ] Test sau mỗi conflict resolution
- [ ] Commit message rõ ràng

### **✅ Sau merge:**
- [ ] Deploy lên theme tương ứng
- [ ] Test functionality trên live
- [ ] Commit và tag version nếu cần

## 🛠️ **Cấu hình Git Giảm Conflict**

### **Bật rerere (Remember Resolution)**
```bash
# Git nhớ cách bạn giải conflict và tự áp dụng lần sau
git config --global rerere.enabled true
git config --global rerere.autoupdate true
```

### **Pull rebase mặc định**
```bash
# Dùng rebase thay vì merge khi pull
git config --global pull.rebase true
```

### **Line ending thống nhất**
```bash
# Windows: convert CRLF to LF
git config --global core.autocrlf input
```

## 📁 **File .gitattributes (Tạo ở root)**

```gitattributes
# Liquid files luôn dùng LF
*.liquid text eol=lf

# JSON files 
*.json text eol=lf

# Minified files không cần diff
*.min.js -diff
*.min.css -diff

# Build files (nếu có)
dist/ export-ignore
node_modules/ export-ignore
```

## 🔧 **Shopify Theme Specific**

### **Trước khi bắt đầu branch mới:**
```bash
# Pull changes từ live theme về (nếu có)
shopify theme pull

# Hoặc tạo development theme riêng
shopify theme dev
```

### **Workflow khuyên dùng:**
```
feature/new-feature → staging → main → live theme
```

## 🆘 **Lối Thoát Khi "Kẹt" Merge**

### **Reset về trạng thái branch từ remote:**
```bash
git switch staging
git reset --hard origin/staging
```

### **Tạo branch backup trước khi merge:**
```bash
git branch backup-$(date +%Y%m%d) staging
```

### **Xem lịch sử conflict đã resolve:**
```bash
git log --oneline --merges
git rerere status
```

## 🎯 **Kinh nghiệm Từ Lần Merge Vừa Rồi**

### **✅ Thành công:**
1. **Merge --quit** thay vì --abort khi stuck
2. **Reset --hard HEAD** để clean staged changes  
3. **Rebase origin/main** thay vì merge trực tiếp
4. **Fast-forward merge** không có conflict
5. **Force-with-lease** an toàn hơn force thường

### **🔧 Liquid Files Conflict Strategy:**
- **Breadcrumb.liquid**: Ưu tiên staging (có logic mới)
- **Header-mega-menu.liquid**: Kiểm tra cả 2 version, merge manual
- **Config files**: Thường ưu tiên main (stability)

### **⚠️ Lưu ý:**
- Luôn test trên staging theme trước
- Xóa debug code trước merge vào main
- Không commit trực tiếp vào main trên production

## 🎖️ **Template Commands (Copy & Paste)**

### **Emergency Reset:**
```bash
git merge --abort 2>/dev/null || true
git rebase --abort 2>/dev/null || true
git merge --quit
git reset --hard HEAD
git status
```

### **Standard Merge:**
```bash
git fetch origin
git switch staging
git rebase origin/main
# resolve conflicts if any
git push --force-with-lease origin staging
git switch main
git merge --ff-only staging
git push origin main
```

### **Deploy After Merge:**
```bash
# Staging
shopify theme push --theme='Staging'

# Live  
shopify theme push
```

---

**💡 Tip:** Lưu file này và copy-paste commands khi cần. Practice makes perfect! 🎯
