# Blog System Documentation

## Overview

A complete blog system has been integrated into your real estate website with a minimalist Apple-inspired design, SEO optimization, and built-in content management.

## Features

### 1. Blog Index Page (`/blog`)
- Clean grid layout displaying all published blog posts
- Search functionality to find articles by title, excerpt, or tags
- Filter by category and tags
- Responsive design with smooth animations
- Post cards showing:
  - Featured image
  - Category badge
  - Publication date and reading time
  - Title, excerpt, and tags
  - "Read More" link

### 2. Individual Blog Post Pages (`/blog/[slug]`)
- Dynamic URL generation based on post titles
- Full article display with rich formatting
- Author information and publication date
- Social sharing buttons (Facebook, Twitter, LinkedIn)
- Related posts section
- Back to blog navigation
- SEO optimized with meta tags and structured data

### 3. Blog Editor (`/blog-editor`)
- Built-in CMS for creating and editing posts
- No external dependencies required
- Draft/publish status management
- Rich text formatting toolbar
- Image upload via URL
- Tag management
- SEO settings (custom title and description)
- Live preview mode
- Save as draft or publish immediately

## Accessing the Blog

### Public Pages
- **Blog Index**: Navigate to `/blog` or click "Blog" in the main navigation
- **Individual Posts**: Click any post card or navigate to `/blog/[post-slug]`

### Editor (Content Management)
- **Create New Post**: Navigate to `/blog-editor`
- **Edit Existing Post**: Navigate to `/blog-editor/[post-id]`

## How to Create a Blog Post

1. **Navigate to the Editor**
   - Go to `/blog-editor` in your browser

2. **Fill in Post Details**
   - **Title** (required): Main headline of your article
   - **Subtitle** (optional): Supporting headline
   - **Excerpt** (recommended): Brief summary for the index page
   - **Content** (required): Full article content in HTML
   - **Cover Image**: Paste image URL (use Pexels.com for free stock photos)
   - **Author**: Your name or team name
   - **Category**: E.g., "Guías de Venta", "Vivir en Valencia"
   - **Tags**: Add relevant keywords (press Enter or click + to add)

3. **Format Your Content**
   Use the formatting toolbar to add structure:
   - **H2**: Main section headings
   - **H3**: Subsection headings
   - **Párrafo**: Regular paragraphs
   - **Lista**: Bullet point lists
   - **Cita**: Blockquotes for important statements
   - **Negrita**: Bold text for emphasis

4. **Optimize for SEO**
   - **SEO Title**: Custom title for search engines (defaults to post title)
   - **SEO Description**: Meta description for search results (defaults to excerpt)

5. **Preview and Publish**
   - Click "Vista previa" to see how your post will look
   - Click "Guardar borrador" to save without publishing
   - Click "Publicar" to make the post live immediately

## Sample Posts

The system comes with 3 sample blog posts:
1. "Guía Completa para Vender tu Piso en Valencia en 2024"
2. "Los Mejores Barrios de Valencia para Vivir en Familia"
3. "Inversión Inmobiliaria en Valencia: ¿Qué Rentabilidad Esperar?"

These demonstrate different content types and formatting styles.

## HTML Content Formatting Guide

### Headings
```html
<h2>Main Section Title</h2>
<h3>Subsection Title</h3>
```

### Paragraphs
```html
<p>Your paragraph content here.</p>
```

### Lists
```html
<ul>
<li>First item</li>
<li>Second item</li>
<li>Third item</li>
</ul>
```

### Blockquotes
```html
<blockquote>Important quote or statement</blockquote>
```

### Bold Text
```html
<strong>Bold text</strong>
```

### Links
```html
<a href="https://example.com">Link text</a>
```

## SEO Features

### Automatic Generation
- Clean, search-friendly URLs (slugs)
- Meta titles and descriptions
- Open Graph tags for social sharing
- Twitter Card tags
- BlogPosting structured data (Schema.org)

### Manual Optimization
- Custom SEO title and description per post
- Category and tag system for topical organization
- Reading time calculation
- Related posts suggestions

## Image Guidelines

### Cover Images
- **Recommended Size**: 1200x750px (16:10 aspect ratio)
- **Format**: JPG or PNG
- **Source**: Use Pexels.com for high-quality, royalty-free images
- **Example URL Format**:
  ```
  https://images.pexels.com/photos/[id]/pexels-photo-[id].jpeg?auto=compress&cs=tinysrgb&w=1200
  ```

### In-Content Images
```html
<img src="https://images.pexels.com/..." alt="Description" />
```

## Data Storage

Currently, blog posts are stored in **browser localStorage**. This means:
- ✅ No backend setup required
- ✅ Instant availability
- ✅ Works offline
- ⚠️ Data is browser-specific (not synced across devices)
- ⚠️ Clearing browser data removes posts

### Future Enhancement: Supabase Integration
The system is designed to easily migrate to Supabase database when needed. This will provide:
- Multi-device access
- User authentication for editors
- Centralized storage
- Backup and recovery

## Navigation Integration

The blog is fully integrated into your site navigation:
- Desktop menu: Blog link in main navigation bar
- Mobile menu: Blog link in hamburger menu
- Footer: Can add blog links if desired

## Styling and Design

The blog matches your existing site design:
- **Colors**:
  - Primary green: #223e28
  - Accent tan: #998675
- **Typography**: Same font family and sizing as main site
- **Layout**: Apple-inspired minimalism with generous white space
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first design that works on all devices

## Performance

- Optimized images (compression recommendations)
- Lazy loading for post lists
- Efficient search and filtering
- Fast static generation
- Minimal bundle size impact

## Maintenance Tips

### Regular Tasks
1. **Create Content**: Aim for 2-4 posts per month
2. **Update SEO**: Review and optimize meta descriptions
3. **Monitor Performance**: Check loading times
4. **Update Images**: Refresh cover images periodically

### Content Ideas for Real Estate Blog
- Property buying guides
- Market trend analysis
- Neighborhood spotlights
- Home selling tips
- Legal and tax information
- Interior design trends
- Investment strategies
- Client success stories

## Troubleshooting

### Posts Not Appearing
- Check if post status is "published" (not "draft")
- Verify localStorage is enabled in browser
- Try refreshing the page

### Formatting Issues
- Ensure HTML tags are properly closed
- Use the formatting toolbar for consistent markup
- Preview before publishing

### Images Not Loading
- Verify image URL is valid and accessible
- Use HTTPS URLs only
- Test URL in browser first

## Admin Access

To manage posts:
1. Navigate to `/blog-editor` (no authentication required currently)
2. View all posts at `/blog`
3. To edit: Get post ID from browser localStorage or URL

### Viewing All Posts (Including Drafts)
Open browser console and run:
```javascript
localStorage.getItem('blog_posts')
```

## RSS and Sitemap

Future enhancement: Automatic RSS feed and sitemap generation for:
- Search engine discovery
- RSS readers
- Content syndication

## Backup Recommendation

To backup your blog posts:
1. Open browser console
2. Run: `localStorage.getItem('blog_posts')`
3. Copy and save the JSON output
4. To restore: `localStorage.setItem('blog_posts', '[paste JSON here]')`

## Support and Customization

The blog system is fully customizable:
- Modify styles in component files
- Adjust layouts in page components
- Add new features in utility files
- Extend functionality as needed

All code is production-ready and follows React best practices.
