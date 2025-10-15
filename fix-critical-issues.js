#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Common patterns to fix
const fixes = [
  // Fix error handling patterns
  {
    pattern: /console\.error\(['"`]([^'"`]+)['"`],\s*error\)/g,
    replacement: "console.error('$1:', { errorCode: error?.code, message: error?.message })"
  },
  
  // Fix missing error handling in API routes
  {
    pattern: /const\s+{\s*data:\s*(\w+),\s*error\s*}\s*=\s*await\s+supabase\s*\n\s*\.from\([^)]+\)\s*\n\s*[^;]+;\s*\n\s*if\s*\(error\)\s*{\s*\n\s*return\s+NextResponse\.json\(\{\s*error:\s*error\.message\s*\},\s*\{\s*status:\s*500\s*\}\)/g,
    replacement: `const { data: $1, error } = await supabase
    .from($2)
    $3;
  
  if (error) {
    console.error('Database error:', { errorCode: error.code, message: error.message });
    return NextResponse.json({ error: 'Database operation failed' }, { status: 500 });
  }`
  },
  
  // Fix validation patterns
  {
    pattern: /if\s*\(!\w+\)\s*{\s*return\s+NextResponse\.json\(\{\s*error:\s*['"`][^'"`]+['"`]\s*\},\s*\{\s*status:\s*400\s*\}\)\s*\}/g,
    replacement: function(match) {
      return match.replace(/error:\s*['"`]([^'"`]+)['"`]/, "error: 'Validation failed: $1'");
    }
  }
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    fixes.forEach(fix => {
      if (typeof fix.replacement === 'function') {
        const newContent = content.replace(fix.pattern, fix.replacement);
        if (newContent !== content) {
          content = newContent;
          modified = true;
        }
      } else {
        const newContent = content.replace(fix.pattern, fix.replacement);
        if (newContent !== content) {
          content = newContent;
          modified = true;
        }
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      walkDirectory(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fixFile(filePath);
    }
  });
}

// Run fixes
console.log('Starting critical issue fixes...');
walkDirectory('./app');
walkDirectory('./lib');
walkDirectory('./components');
console.log('Critical fixes completed!');