#!/bin/bash

# Sunrise School Portal - GitHub Setup Script
# This script will initialize git and push your code to GitHub

echo "🏫 Sunrise School Portal - GitHub Setup"
echo "========================================"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Error: Git is not installed"
    echo "Please install git first: https://git-scm.com/downloads"
    exit 1
fi

# Get GitHub username
echo "📝 Please enter your GitHub username:"
read -r GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ Error: GitHub username is required"
    exit 1
fi

echo ""
echo "Repository will be created at:"
echo "https://github.com/$GITHUB_USERNAME/sunrise-school-portal"
echo ""

# Confirm
echo "Continue? (y/n)"
read -r CONFIRM

if [ "$CONFIRM" != "y" ]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "🚀 Starting setup..."
echo ""

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

echo ""

# Replace README
if [ -f "README.new.md" ]; then
    echo "📄 Updating README..."
    mv README.md README.old.md 2>/dev/null
    mv README.new.md README.md
    echo "✅ README updated"
fi

echo ""

# Add all files
echo "📦 Adding all files to git..."
git add .
echo "✅ Files added"

echo ""

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Complete school portal with all features

- Public website with event management
- Parent portal with profile and invoice management  
- Admin dashboard with CRM and form builder
- AI content tools (blog drafts, FAQ answers, summaries)
- Complete testing infrastructure
- WordPress migration tools
- Comprehensive documentation

Features:
✅ 43/43 tasks completed
✅ 50+ API endpoints
✅ 60+ React components
✅ 40+ pages
✅ Complete CRM system
✅ Form builder
✅ AI tools
✅ Testing suite
✅ Full documentation"

echo "✅ Initial commit created"

echo ""

# Add remote
echo "🔗 Adding GitHub remote..."
REPO_URL="https://github.com/$GITHUB_USERNAME/sunrise-school-portal.git"
git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"
echo "✅ Remote added: $REPO_URL"

echo ""

# Set main branch
echo "🌿 Setting main branch..."
git branch -M main
echo "✅ Main branch set"

echo ""

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
echo ""
echo "⚠️  You may be prompted for your GitHub credentials"
echo "   Use your GitHub username and Personal Access Token"
echo "   (Not your password - tokens are required now)"
echo ""

if git push -u origin main; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎉 Your repository is now live at:"
    echo "   https://github.com/$GITHUB_USERNAME/sunrise-school-portal"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Visit your repository on GitHub"
    echo "   2. Add a description and topics"
    echo "   3. Set up branch protection (optional)"
    echo "   4. Deploy to Vercel"
    echo "   5. Share with your team!"
    echo ""
    echo "📚 See GITHUB_SETUP.md for more details"
else
    echo ""
    echo "❌ Push failed"
    echo ""
    echo "Common issues:"
    echo "1. Repository doesn't exist on GitHub yet"
    echo "   → Create it first at: https://github.com/new"
    echo ""
    echo "2. Authentication failed"
    echo "   → Use Personal Access Token instead of password"
    echo "   → Generate at: https://github.com/settings/tokens"
    echo ""
    echo "3. Repository already exists with content"
    echo "   → Try: git pull origin main --allow-unrelated-histories"
    echo "   → Then: git push -u origin main"
    echo ""
    echo "See GITHUB_SETUP.md for detailed troubleshooting"
    exit 1
fi
