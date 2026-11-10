# Notion Blog Integration - Complete Guide

## Overview

Your blog is now fully integrated with Notion! Content is fetched dynamically from your Notion database, converted to Markdown, and displayed beautifully on your website.

---

## What Was Implemented

### 1. Edge Function: `notion-blog`

**Location:** `supabase/functions/notion-blog/`

This Supabase Edge Function:
- Fetches your Notion database structure
- Queries all pages marked as "Published"
- Retrieves all block children (content) from each page
- Converts Notion blocks to Markdown
- Auto-generates excerpts from the first paragraph
- Returns clean, structured blog post data

**Features:**
- ✅ Full CORS support
- ✅ Slug-based single post retrieval
- ✅ Bulk fetching of all posts
- ✅ Automatic filtering by "Published" status
- ✅ Markdown conversion with support for:
  - Headings (H1, H2, H3)
  - Paragraphs
  - Lists (bulleted & numbered)
  - Quotes & blockquotes
  - Code blocks
  - Images
  - Bold, italic, strikethrough, inline code
  - Links

### 2. Blog Service Layer

**Location:** `src/services/blogService.ts`

Clean service that:
- Fetches posts from the edge function
- Handles errors gracefully
- Provides filtering and search capabilities
- Returns properly typed BlogPost objects

### 3. Updated Blog Pages

**BlogIndex** (`src/pages/BlogIndex.tsx`):
- Async loading of posts
- Search functionality
- Category & tag filtering
- Handles optional fields (author, category, tags, etc.)
- Loading states

**BlogPost** (`src/pages/BlogPost.tsx`):
- Markdown rendering using `marked` library
- Related posts suggestions
- Social sharing
- Handles optional fields gracefully
- SEO optimization

### 4. Markdown Processing

**Library:** `marked`
- Converts Markdown to HTML
- Preserves formatting
- Safe rendering with `dangerouslySetInnerHTML`

---

## Notion Database Structure

Your Notion database **MUST** have these columns:

| Column Name | Type | Required | Description |
|------------|------|----------|-------------|
| **Title** | Title | ✅ Yes | Blog post title |
| **Slug** | Text | ✅ Yes | URL slug (e.g., `my-blog-post`) |
| **Status** | Select | ✅ Yes | Options: `Draft`, `Published` |
| **Date** | Date | ✅ Yes | Publication date |
| **Featured Image** | Files | ⚠️ Recommended | Cover image for the post |
| **SEO Title** | Text | ❌ Optional | Custom SEO title |
| **SEO Description** | Text | ❌ Optional | Custom SEO description |

### Important Notes:

- **NO "Content" field** - Content lives in the page blocks
- **NO "Excerpt" field** - Auto-generated from first paragraph
- **Status must be "Published"** to show on the website
- **Slug must be unique** for routing to work correctly

---

## Content Structure

### Writing Blog Posts in Notion

1. Create a new page in your Notion database
2. Fill in the required properties (Title, Slug, Status, Date)
3. Write your content **inside the page** using Notion blocks:
   - Use headings for structure
   - Add paragraphs, lists, quotes
   - Insert images directly
   - Format text (bold, italic, code, links)
4. Set Status to **"Published"** when ready
5. The post will appear automatically on your website

### Example Post Structure:

```
📄 Page: "Guide to Selling Your Home"
Properties:
- Title: Guide to Selling Your Home
- Slug: guide-to-selling-your-home
- Status: Published
- Date: 2024-12-17
- Featured Image: [uploaded image]

Content (blocks inside the page):
# Introduction
This is the introduction paragraph...

## Step 1: Prepare Your Home
- Clean thoroughly
- Make repairs
- Stage properly

## Step 2: Set the Right Price
Use market analysis...

![Market Chart](image-url)

> Pro tip: Always compare with recent sales.
```

---

## Configuration Required

### Pica API Credentials

You need to set two environment variables in your Supabase project:

1. **`PICA_SECRET_KEY`**
   - Your Pica API secret key
   - Get it from your Pica dashboard

2. **`PICA_NOTION_CONNECTION_KEY`**
   - Your Notion connection key via Pica
   - Links your Notion workspace to Pica

### How to Set Supabase Secrets:

```bash
# Using Supabase CLI (if available)
supabase secrets set PICA_SECRET_KEY=your_secret_key
supabase secrets set PICA_NOTION_CONNECTION_KEY=your_connection_key
```

**Or via Supabase Dashboard:**
1. Go to your Supabase project
2. Navigate to **Settings** → **Edge Functions**
3. Add the two secrets manually

---

## API Endpoints

### Get All Published Posts

```
GET /functions/v1/notion-blog
Authorization: Bearer YOUR_SUPABASE_ANON_KEY
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "page-id",
      "title": "Post Title",
      "slug": "post-slug",
      "coverImage": "image-url",
      "excerpt": "Auto-generated excerpt...",
      "content": "# Markdown content...",
      "publishedAt": "2024-12-17T10:00:00Z",
      "seoTitle": "Custom SEO Title",
      "seoDescription": "Custom SEO description",
      "status": "Published"
    }
  ]
}
```

### Get Single Post by Slug

```
GET /functions/v1/notion-blog?slug=post-slug
Authorization: Bearer YOUR_SUPABASE_ANON_KEY
```

---

## How It Works

```
┌─────────────────┐
│  Notion Database│
│   (Your CMS)    │
└────────┬────────┘
         │
         ↓
┌─────────────────────────┐
│ Pica API Proxy          │
│ (Notion API Wrapper)    │
└────────┬────────────────┘
         │
         ↓
┌─────────────────────────┐
│ Edge Function           │
│ - Fetch database        │
│ - Query pages           │
│ - Get block children    │
│ - Convert to Markdown   │
└────────┬────────────────┘
         │
         ↓
┌─────────────────────────┐
│ Frontend (React)        │
│ - blogService           │
│ - BlogIndex page        │
│ - BlogPost page         │
└─────────────────────────┘
```

---

## Testing

### 1. Create a Test Post in Notion

1. Go to your Notion database
2. Create a new page with:
   - Title: "Test Blog Post"
   - Slug: "test-blog-post"
   - Status: "Published"
   - Date: Today
3. Add some content (headings, paragraphs, a list)
4. Add a Featured Image

### 2. Test the Edge Function

```bash
# Test in browser or with curl
curl -X GET \
  "https://YOUR-SUPABASE-URL.supabase.co/functions/v1/notion-blog" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

### 3. Test on Website

1. Navigate to `/blog` on your website
2. You should see your test post
3. Click on it to view the full post
4. Verify that:
   - Markdown renders correctly
   - Images display
   - SEO fields work

---

## Troubleshooting

### Posts Not Showing

**Check:**
- ✅ Status is "Published" (not "Draft")
- ✅ Pica credentials are set correctly
- ✅ Notion database ID is correct in edge function
- ✅ Edge function is deployed successfully

### Content Not Rendering

**Check:**
- ✅ Content is in page blocks (not in a "Content" field)
- ✅ Markdown conversion is working
- ✅ Console for any JavaScript errors

### Images Not Loading

**Check:**
- ✅ Images are uploaded to Notion (not external links that expired)
- ✅ Notion workspace has proper permissions
- ✅ Image URLs are accessible

---

## Benefits of This Setup

1. **No Manual Updates** - Edit in Notion, changes appear automatically
2. **Clean Content Management** - Use Notion's familiar interface
3. **Version Control** - Notion's built-in page history
4. **Collaboration** - Multiple team members can edit
5. **Rich Formatting** - Full Markdown support
6. **SEO Optimized** - Custom SEO fields per post
7. **Fast Performance** - Edge function caching
8. **Scalable** - Handles hundreds of posts easily

---

## Next Steps

1. **Set Pica Credentials** in Supabase
2. **Create your first blog post** in Notion
3. **Test the integration** by visiting `/blog`
4. **Customize styling** if needed (already beautifully styled!)
5. **Share your blog** with the world!

---

## Files Modified

**Created:**
- `supabase/functions/notion-blog/index.ts`
- `supabase/functions/notion-blog/notion-to-markdown.ts`

**Modified:**
- `src/services/blogService.ts` - Now fetches from edge function
- `src/pages/BlogPost.tsx` - Async loading, markdown rendering
- `src/pages/BlogIndex.tsx` - Async loading, optional fields
- `src/lib/blogStorage.ts` - Updated BlogPost interface
- `package.json` - Added `marked` library

---

## Support

If you encounter any issues:

1. Check the browser console for errors
2. Check Supabase Edge Function logs
3. Verify Notion database structure matches requirements
4. Ensure Pica credentials are set correctly

---

Your blog is now powered by Notion! 🎉
