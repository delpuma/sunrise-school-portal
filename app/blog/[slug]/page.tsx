import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = await createClient()
  
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .single()
  
  if (!post) {
    notFound()
  }
  
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {post.image_url && (
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full h-96 object-cover rounded-lg mb-8"
        />
      )}
      
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex items-center gap-4 text-gray-600">
          <time dateTime={post.published_at}>
            {new Date(post.published_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>
      
      {post.excerpt && (
        <div className="text-xl text-gray-600 mb-8 italic">
          {post.excerpt}
        </div>
      )}
      
      <div className="prose prose-lg max-w-none">
        {post.content.split('\n').map((paragraph: string, index: number) => (
          <p key={index} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>
      
      <footer className="mt-12 pt-8 border-t border-gray-200">
        <a
          href="/blog"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Blog
        </a>
      </footer>
    </article>
  )
}
