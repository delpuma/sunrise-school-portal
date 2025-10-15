# GitHub Repository Setup Guide

Follow these steps to create a new GitHub repository and push your code.

## Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click the **"+"** icon in the top right
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `sunrise-school-portal`
   - **Description**: `Modern school website and parent portal with CRM, form builder, and AI tools`
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

## Step 2: Initialize Git (if not already done)

```bash
# Check if git is already initialized
git status

# If not initialized, run:
git init
```

## Step 3: Add All Files

```bash
# Add all files to git
git add .

# Check what will be committed
git status
```

## Step 4: Create Initial Commit

```bash
# Commit all files
git commit -m "Initial commit: Complete school portal with all features

- Public website with event management
- Parent portal with profile and invoice management
- Admin dashboard with CRM and form builder
- AI content tools (blog drafts, FAQ answers, summaries)
- Complete testing infrastructure
- WordPress migration tools
- Comprehensive documentation"
```

## Step 5: Add Remote Repository

Replace `YOUR_USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/sunrise-school-portal.git

# Verify remote was added
git remote -v
```

## Step 6: Push to GitHub

```bash
# Push to main branch
git branch -M main
git push -u origin main
```

## Step 7: Verify on GitHub

1. Go to your repository on GitHub
2. Refresh the page
3. You should see all your files!

## Alternative: Using GitHub CLI

If you have GitHub CLI installed:

```bash
# Login to GitHub
gh auth login

# Create repository and push
gh repo create sunrise-school-portal --public --source=. --remote=origin --push

# Or for private repository
gh repo create sunrise-school-portal --private --source=. --remote=origin --push
```

## Step 8: Set Up Branch Protection (Optional)

1. Go to repository Settings
2. Click "Branches"
3. Add rule for `main` branch
4. Enable:
   - Require pull request reviews
   - Require status checks to pass
   - Require branches to be up to date

## Step 9: Add Repository Topics

Add topics to help others find your project:

1. Go to your repository
2. Click the gear icon next to "About"
3. Add topics:
   - `nextjs`
   - `typescript`
   - `supabase`
   - `school-management`
   - `parent-portal`
   - `crm`
   - `form-builder`
   - `ai-tools`
   - `education`
   - `montessori`

## Step 10: Update README (Optional)

Replace the placeholder README with the new one:

```bash
# Backup old README
mv README.md README.old.md

# Use new README
mv README.new.md README.md

# Commit the change
git add README.md
git commit -m "docs: update README with comprehensive project information"
git push
```

## Common Git Commands

### Check Status
```bash
git status
```

### Add Files
```bash
# Add specific file
git add filename.ts

# Add all files
git add .

# Add all TypeScript files
git add *.ts
```

### Commit Changes
```bash
git commit -m "Your commit message"
```

### Push Changes
```bash
git push
```

### Pull Latest Changes
```bash
git pull
```

### Create New Branch
```bash
git checkout -b feature/new-feature
```

### Switch Branches
```bash
git checkout main
```

### View Commit History
```bash
git log --oneline
```

## Troubleshooting

### Authentication Issues

If you get authentication errors:

1. **Use Personal Access Token**:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate new token with `repo` scope
   - Use token as password when pushing

2. **Use SSH**:
   ```bash
   # Generate SSH key
   ssh-keygen -t ed25519 -C "your_email@example.com"
   
   # Add to GitHub
   # Copy public key: cat ~/.ssh/id_ed25519.pub
   # Add to GitHub Settings → SSH and GPG keys
   
   # Change remote to SSH
   git remote set-url origin git@github.com:YOUR_USERNAME/sunrise-school-portal.git
   ```

### Large Files

If you have large files (>100MB):

```bash
# Use Git LFS
git lfs install
git lfs track "*.psd"
git add .gitattributes
```

### Undo Last Commit

```bash
# Keep changes
git reset --soft HEAD~1

# Discard changes
git reset --hard HEAD~1
```

### Remove File from Git

```bash
# Remove from git but keep locally
git rm --cached filename

# Remove completely
git rm filename
```

## Next Steps

After pushing to GitHub:

1. ✅ Set up GitHub Actions for CI/CD
2. ✅ Configure Dependabot for security updates
3. ✅ Add repository description and website
4. ✅ Create initial release/tag
5. ✅ Set up project board for issues
6. ✅ Add collaborators if needed
7. ✅ Configure branch protection rules
8. ✅ Set up deployment from GitHub to Vercel

## GitHub Actions Example

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run linter
      run: npm run lint
      
    - name: Run tests
      run: npm test
      
    - name: Build
      run: npm run build
```

## Vercel Deployment from GitHub

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Configure:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add environment variables
6. Deploy!

Vercel will automatically deploy on every push to main.

## Success! 🎉

Your code is now on GitHub and ready to share with the world!

Repository URL: `https://github.com/YOUR_USERNAME/sunrise-school-portal`

Don't forget to:
- Add a nice repository description
- Add topics/tags
- Create a release when ready
- Share with your team!
