# WordPress to Next.js Migration Guide

This guide explains how to migrate your existing WordPress content to the new Next.js school portal.

## Prerequisites

1. **WordPress Access**
   - Admin access to your WordPress site
   - WordPress REST API enabled (default in modern WordPress)
   - Application Password created for API access

2. **Environment Setup**
   - Node.js 18+ installed
   - Access to Supabase project
   - Supabase service role key

## Step 1: Create WordPress Application Password

1. Log in to your WordPress admin panel
2. Go to Users → Profile
3. Scroll to "Application Passwords"
4. Enter a name (e.g., "Migration Script")
5. Click "Add New Application Password"
6. Copy the generated password (you won't see it again!)

## Step 2: Set Environment Variables

Create a `.env.migration` file in your project root:

```bash
# WordPress Configuration
WORDPRESS_URL=https://your-old-site.com
WORDPRESS_USER=your-admin-username
WORDPRESS_APP_PASSWORD=your-application-password

# Supabase Configuration (from your .env.local)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Step 3: Install Dependencies

```bash
npm install --save-dev tsx node-fetch @types/node-fetch
```

## Step 4: Create Supabase Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to Storage
3. Create a new bucket named `media`
4. Set it to public access
5. Configure CORS if needed

## Step 5: Run Migration Script

### Dry Run (Preview)

First, do a dry run to see what will be migrated:

```bash
npx tsx scripts/migrate-wordpress.ts --dry-run
```

### Full Migration

When ready, run the full migration:

```bash
npx tsx scripts/migrate-wordpress.ts
```

The script will:
1. Fetch all posts from WordPress
2. Fetch all pages from WordPress
3. Convert HTML content to Markdown
4. Download and upload media to Supabase Storage
5. Update image URLs in content
6. Insert blog posts into the database
7. Create MDX files for pages

## Step 6: Manual Review

After migration, review the content:

### Blog Posts

1. Go to `/admin/blog` in your new site
2. Review each migrated post
3. Check formatting and images
4. Update any broken links
5. Adjust categories/tags if needed

### Pages

1. Check the `app/` directory for migrated pages
2. Review MDX files for formatting issues
3. Update navigation links if needed
4. Test all pages in the browser

### Media

1. Go to Supabase Storage → media bucket
2. Verify all images uploaded correctly
3. Check image URLs in content

## Step 7: Handle Special Cases

### Custom Post Types

If you have custom post types (e.g., events, staff), you'll need to modify the migration script:

```typescript
// Add to migrate-wordpress.ts
async function fetchCustomPostType(type: string) {
  const response = await fetch(
    `${WORDPRESS_URL}/wp-json/wp/v2/${type}?per_page=100`
  )
  return response.json()
}
```

### Shortcodes

WordPress shortcodes won't work in Next.js. Common replacements:

- `[gallery]` → Create a custom Gallery component
- `[contact-form]` → Use the new form builder
- `[button]` → Use HTML/Tailwind buttons

### Plugins

Replace WordPress plugins with Next.js equivalents:

- **SEO Plugin** → next-seo package
- **Contact Form** → Built-in form system
- **Events Calendar** → Built-in event management
- **Membership** → Built-in parent portal

## Step 8: URL Redirects

Set up redirects in `next.config.js` to maintain SEO:

```javascript
module.exports = {
  async redirects() {
    return [
      {
        source: '/blog/:slug',
        destination: '/news/:slug',
        permanent: true,
      },
      // Add more redirects as needed
    ]
  },
}
```

## Step 9: Update DNS

Once everything is tested:

1. Update DNS records to point to Vercel
2. Set up SSL certificate (automatic with Vercel)
3. Monitor for 404 errors
4. Keep WordPress site as backup for 30 days

## Troubleshooting

### Authentication Errors

If you get 401 errors:
- Verify WordPress username and application password
- Check if REST API is enabled
- Try accessing `https://your-site.com/wp-json/` directly

### Media Upload Failures

If media uploads fail:
- Check Supabase storage bucket permissions
- Verify storage quota
- Check file size limits

### Content Formatting Issues

If content looks wrong:
- Review the `htmlToMarkdown` function
- Add custom conversion rules for your content
- Manually fix complex layouts

### Missing Content

If some content is missing:
- Check WordPress post status (draft vs published)
- Verify pagination in fetch functions
- Check for custom post types

## Advanced: Custom Migration

For complex migrations, you can customize the script:

### Add Custom Fields

```typescript
// In migrateBlogPosts function
const { error } = await supabase
  .from('blog_posts')
  .upsert({
    title: post.title.rendered,
    slug: post.slug,
    content,
    // Add custom fields
    custom_field: post.acf?.custom_field,
  })
```

### Migrate Categories/Tags

```typescript
// Fetch WordPress tags
const tags = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/tags`)
const tagData = await tags.json()

// Map tag IDs to names
const tagMap = Object.fromEntries(
  tagData.map(tag => [tag.id, tag.name])
)

// Use in post migration
const postTags = post.tags.map(id => tagMap[id])
```

### Batch Processing

For large sites, process in batches:

```typescript
const BATCH_SIZE = 10

for (let i = 0; i < posts.length; i += BATCH_SIZE) {
  const batch = posts.slice(i, i + BATCH_SIZE)
  await Promise.all(batch.map(post => migratePost(post)))
  console.log(`Processed ${i + BATCH_SIZE} of ${posts.length}`)
}
```

## Post-Migration Checklist

- [ ] All blog posts migrated and reviewed
- [ ] All pages migrated and reviewed
- [ ] All media uploaded and accessible
- [ ] Navigation menus updated
- [ ] Internal links updated
- [ ] SEO redirects configured
- [ ] Forms tested and working
- [ ] Contact information updated
- [ ] Social media links updated
- [ ] Analytics tracking added
- [ ] Search functionality tested
- [ ] Mobile responsiveness checked
- [ ] Performance tested
- [ ] Backup of old site created
- [ ] DNS updated
- [ ] SSL certificate active

## Support

If you encounter issues:

1. Check the migration logs for errors
2. Review the WordPress REST API documentation
3. Test API endpoints manually with Postman
4. Check Supabase logs for database errors
5. Verify environment variables are correct

## Rollback Plan

If you need to rollback:

1. Update DNS back to WordPress
2. Keep WordPress site running until migration is stable
3. Export migrated content from Supabase if needed
4. Document any issues for next attempt

## Best Practices

1. **Test First**: Run migration on a staging environment
2. **Backup Everything**: Export WordPress database and files
3. **Incremental Migration**: Migrate in phases (posts, then pages, then media)
4. **Monitor Traffic**: Watch for 404 errors after DNS change
5. **Keep WordPress**: Don't delete WordPress for at least 30 days
6. **Document Changes**: Keep notes on custom modifications
7. **Test Thoroughly**: Check all functionality before going live

## Timeline Estimate

- Small site (< 50 posts): 2-4 hours
- Medium site (50-200 posts): 4-8 hours
- Large site (200+ posts): 1-2 days
- Complex site (custom post types, plugins): 2-5 days

Remember: Quality over speed. Take time to review and test everything!
