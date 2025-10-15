/**
 * WordPress to Next.js Migration Script
 * 
 * This script migrates content from WordPress to the Next.js application:
 * - Blog posts → blog_posts table
 * - Pages → MDX files in app directory
 * - Media → Supabase Storage
 * 
 * Usage:
 * 1. Export WordPress content via WP REST API or WP-CLI
 * 2. Set environment variables for WordPress URL and credentials
 * 3. Run: npx tsx scripts/migrate-wordpress.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs/promises'
import * as path from 'path'
import fetch from 'node-fetch'

// Configuration
const WORDPRESS_URL = process.env.WORDPRESS_URL || 'https://old-site.com'
const WORDPRESS_USER = process.env.WORDPRESS_USER
const WORDPRESS_APP_PASSWORD = process.env.WORDPRESS_APP_PASSWORD
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

interface WordPressPost {
  id: number
  date: string
  slug: string
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  tags: number[]
  featured_media: number
  status: string
}

interface WordPressPage {
  id: number
  slug: string
  title: { rendered: string }
  content: { rendered: string }
  parent: number
}

interface WordPressMedia {
  id: number
  source_url: string
  alt_text: string
  media_details: {
    file: string
  }
}

/**
 * Fetch all posts from WordPress REST API
 */
async function fetchWordPressPosts(): Promise<WordPressPost[]> {
  const posts: WordPressPost[] = []
  let page = 1
  let hasMore = true

  console.log('Fetching WordPress posts...')

  while (hasMore) {
    const response = await fetch(
      `${WORDPRESS_URL}/wp-json/wp/v2/posts?page=${page}&per_page=100`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${WORDPRESS_USER}:${WORDPRESS_APP_PASSWORD}`).toString('base64')}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`)
    }

    const data = await response.json() as WordPressPost[]
    posts.push(...data)

    hasMore = data.length === 100
    page++
  }

  console.log(`Fetched ${posts.length} posts`)
  return posts
}

/**
 * Fetch all pages from WordPress REST API
 */
async function fetchWordPressPages(): Promise<WordPressPage[]> {
  const pages: WordPressPage[] = []
  let page = 1
  let hasMore = true

  console.log('Fetching WordPress pages...')

  while (hasMore) {
    const response = await fetch(
      `${WORDPRESS_URL}/wp-json/wp/v2/pages?page=${page}&per_page=100`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${WORDPRESS_USER}:${WORDPRESS_APP_PASSWORD}`).toString('base64')}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch pages: ${response.statusText}`)
    }

    const data = await response.json() as WordPressPage[]
    pages.push(...data)

    hasMore = data.length === 100
    page++
  }

  console.log(`Fetched ${pages.length} pages`)
  return pages
}

/**
 * Convert HTML to Markdown (basic conversion)
 */
function htmlToMarkdown(html: string): string {
  let markdown = html
  
  // Remove WordPress shortcodes
  markdown = markdown.replace(/\[.*?\]/g, '')
  
  // Convert headings
  markdown = markdown.replace(/<h1>(.*?)<\/h1>/g, '# $1\n\n')
  markdown = markdown.replace(/<h2>(.*?)<\/h2>/g, '## $1\n\n')
  markdown = markdown.replace(/<h3>(.*?)<\/h3>/g, '### $1\n\n')
  markdown = markdown.replace(/<h4>(.*?)<\/h4>/g, '#### $1\n\n')
  
  // Convert paragraphs
  markdown = markdown.replace(/<p>(.*?)<\/p>/g, '$1\n\n')
  
  // Convert links
  markdown = markdown.replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)')
  
  // Convert images
  markdown = markdown.replace(/<img.*?src="(.*?)".*?alt="(.*?)".*?>/g, '![$2]($1)')
  
  // Convert lists
  markdown = markdown.replace(/<ul>(.*?)<\/ul>/gs, (match, content) => {
    return content.replace(/<li>(.*?)<\/li>/g, '- $1\n')
  })
  
  markdown = markdown.replace(/<ol>(.*?)<\/ol>/gs, (match, content) => {
    let counter = 1
    return content.replace(/<li>(.*?)<\/li>/g, () => `${counter++}. $1\n`)
  })
  
  // Convert bold and italic
  markdown = markdown.replace(/<strong>(.*?)<\/strong>/g, '**$1**')
  markdown = markdown.replace(/<em>(.*?)<\/em>/g, '*$1*')
  
  // Remove remaining HTML tags
  markdown = markdown.replace(/<[^>]+>/g, '')
  
  // Clean up extra whitespace
  markdown = markdown.replace(/\n{3,}/g, '\n\n')
  markdown = markdown.trim()
  
  return markdown
}

/**
 * Download and upload media to Supabase Storage
 */
async function migrateMedia(mediaUrl: string, fileName: string): Promise<string> {
  try {
    console.log(`Downloading media: ${fileName}`)
    
    const response = await fetch(mediaUrl)
    if (!response.ok) {
      throw new Error(`Failed to download media: ${response.statusText}`)
    }
    
    const buffer = await response.buffer()
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('media')
      .upload(`migrated/${fileName}`, buffer, {
        contentType: response.headers.get('content-type') || 'image/jpeg',
        upsert: true
      })
    
    if (error) {
      throw error
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(`migrated/${fileName}`)
    
    console.log(`Uploaded media: ${fileName}`)
    return publicUrl
  } catch (error) {
    console.error(`Failed to migrate media ${fileName}:`, error)
    return mediaUrl // Return original URL as fallback
  }
}

/**
 * Update image URLs in content
 */
async function updateImageUrls(content: string): Promise<string> {
  const imageRegex = /!\[(.*?)\]\((https?:\/\/.*?)\)/g
  const matches = [...content.matchAll(imageRegex)]
  
  let updatedContent = content
  
  for (const match of matches) {
    const [fullMatch, altText, imageUrl] = match
    
    if (imageUrl.includes(WORDPRESS_URL)) {
      const fileName = path.basename(new URL(imageUrl).pathname)
      const newUrl = await migrateMedia(imageUrl, fileName)
      updatedContent = updatedContent.replace(fullMatch, `![${altText}](${newUrl})`)
    }
  }
  
  return updatedContent
}

/**
 * Migrate blog posts to Supabase
 */
async function migrateBlogPosts(posts: WordPressPost[]) {
  console.log('\nMigrating blog posts...')
  
  for (const post of posts) {
    try {
      console.log(`Migrating post: ${post.title.rendered}`)
      
      // Convert HTML to Markdown
      let content = htmlToMarkdown(post.content.rendered)
      
      // Update image URLs
      content = await updateImageUrls(content)
      
      // Extract excerpt
      const excerpt = htmlToMarkdown(post.excerpt.rendered)
      
      // Insert into database
      const { error } = await supabase
        .from('blog_posts')
        .upsert({
          title: post.title.rendered,
          slug: post.slug,
          excerpt: excerpt.substring(0, 200),
          content,
          published_at: post.status === 'publish' ? post.date : null,
        }, {
          onConflict: 'slug'
        })
      
      if (error) {
        console.error(`Failed to migrate post ${post.slug}:`, error)
      } else {
        console.log(`✓ Migrated post: ${post.slug}`)
      }
    } catch (error) {
      console.error(`Error migrating post ${post.slug}:`, error)
    }
  }
  
  console.log(`\nMigrated ${posts.length} blog posts`)
}

/**
 * Migrate pages to MDX files
 */
async function migratePages(pages: WordPressPage[]) {
  console.log('\nMigrating pages...')
  
  for (const page of pages) {
    try {
      console.log(`Migrating page: ${page.title.rendered}`)
      
      // Convert HTML to Markdown
      let content = htmlToMarkdown(page.content.rendered)
      
      // Update image URLs
      content = await updateImageUrls(content)
      
      // Create MDX file
      const mdxContent = `---
title: "${page.title.rendered}"
---

${content}
`
      
      // Determine file path
      const filePath = path.join(process.cwd(), 'app', page.slug, 'page.mdx')
      
      // Create directory if it doesn't exist
      await fs.mkdir(path.dirname(filePath), { recursive: true })
      
      // Write file
      await fs.writeFile(filePath, mdxContent, 'utf-8')
      
      console.log(`✓ Migrated page: ${page.slug}`)
    } catch (error) {
      console.error(`Error migrating page ${page.slug}:`, error)
    }
  }
  
  console.log(`\nMigrated ${pages.length} pages`)
}

/**
 * Main migration function
 */
async function main() {
  console.log('Starting WordPress migration...\n')
  
  // Validate environment variables
  if (!WORDPRESS_URL || !WORDPRESS_USER || !WORDPRESS_APP_PASSWORD) {
    throw new Error('Missing WordPress credentials. Set WORDPRESS_URL, WORDPRESS_USER, and WORDPRESS_APP_PASSWORD')
  }
  
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error('Missing Supabase credentials')
  }
  
  try {
    // Fetch content from WordPress
    const posts = await fetchWordPressPosts()
    const pages = await fetchWordPressPages()
    
    // Migrate content
    await migrateBlogPosts(posts)
    await migratePages(pages)
    
    console.log('\n✅ Migration completed successfully!')
  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
main()
