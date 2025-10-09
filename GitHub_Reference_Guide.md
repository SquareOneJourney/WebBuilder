# 🚀 GitHub Reference Guide - WebBuilder Project

## 📋 **Quick Reference Commands**

### **🔄 Pull Changes FROM GitHub TO Local**
```bash
# Check current status
git status

# Pull latest changes from GitHub
git pull origin master

# If you have uncommitted changes, stash them first
git stash
git pull origin master
git stash pop
```

### **📤 Push Changes FROM Local TO GitHub**
```bash
# Check what's changed
git status

# Add specific files
git add app/globals.css
git add components/WebpageBuilder.tsx

# Add all changes
git add .

# Commit with message
git commit -m "Your descriptive commit message here"

# Push to GitHub
git push origin master
```

## 🛠️ **Complete Workflows**

### **1. Update Local Files with GitHub Changes**
```bash
# Step 1: Check current status
git status

# Step 2: Pull latest changes
git pull origin master

# Step 3: Verify updates
git log --oneline -5
```

### **2. Save Local Changes to GitHub**
```bash
# Step 1: Check what's changed
git status

# Step 2: Add your changes
git add .

# Step 3: Commit with message
git commit -m "Add new features and improvements"

# Step 4: Push to GitHub
git push origin master
```

### **3. Handle Conflicts (When GitHub and Local Both Have Changes)**
```bash
# Step 1: Try to pull
git pull origin master

# Step 2: If conflicts occur, resolve them in your editor
# Step 3: Add resolved files
git add .

# Step 4: Commit the merge
git commit -m "Resolve merge conflicts"

# Step 5: Push the resolved changes
git push origin master
```

## 🔍 **Useful Git Commands**

### **Check Status & History**
```bash
# See current status
git status

# See recent commits
git log --oneline -10

# See what's different between local and GitHub
git fetch origin
git log HEAD..origin/master --oneline
```

### **Branch Management**
```bash
# Create new branch
git checkout -b feature-name

# Switch to existing branch
git checkout branch-name

# See all branches
git branch -a

# Merge branch into master
git checkout master
git merge feature-name
```

### **Undo Changes**
```bash
# Undo uncommitted changes to a file
git checkout -- filename

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (lose changes)
git reset --hard HEAD~1
```

## 📝 **Common Scenarios**

### **Scenario 1: "I want to get the latest changes from GitHub"**
```bash
git pull origin master
```

### **Scenario 2: "I want to save my local changes to GitHub"**
```bash
git add .
git commit -m "Describe your changes"
git push origin master
```

### **Scenario 3: "I made changes but want to start fresh from GitHub"**
```bash
git stash
git pull origin master
# Your local changes are saved in stash
```

### **Scenario 4: "I want to discard my local changes and get GitHub version"**
```bash
git reset --hard origin/master
```

## 🎯 **WebBuilder Project Specific**

### **Current Repository Info**
- **Repository**: SquareOneJourney/WebBuilder
- **Main Branch**: master
- **Remote**: origin

### **Key Files to Watch**
- `app/globals.css` - Global styles and animations
- `components/WebpageBuilder.tsx` - Main builder component
- `components/CanvasElement.tsx` - Canvas functionality
- `lib/templates.ts` - Template system

### **Before Making Changes**
```bash
# Always pull latest changes first
git pull origin master
```

### **After Making Changes**
```bash
# Check what you've changed
git status

# Add and commit your changes
git add .
git commit -m "Your descriptive message"

# Push to GitHub
git push origin master
```

## ⚠️ **Important Notes**

- **Always pull before pushing** to avoid conflicts
- **Use descriptive commit messages** (e.g., "Fix drag and drop functionality")
- **Check `git status`** before making changes
- **Backup important work** before major Git operations
- **Use branches** for experimental features

## 🆘 **Emergency Commands**

### **If You Mess Up**
```bash
# Undo everything and get back to GitHub state
git reset --hard origin/master

# Save your work before discarding
git stash
git reset --hard origin/master
```

### **If You Can't Push**
```bash
# Pull first, then push
git pull origin master
git push origin master
```

---

## 📞 **Quick Copy-Paste Commands**

### **Get Latest Changes:**
```bash
git pull origin master
```

### **Save Your Changes:**
```bash
git add .
git commit -m "Your message here"
git push origin master
```

### **Check Status:**
```bash
git status
```

---

*Created for WebBuilder Project - Keep this file handy for quick reference!*
