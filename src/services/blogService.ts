import type { BlogPost } from '../lib/blogStorage';
import { edgeFetch } from '../lib/edgeClient';

async function fetchFromEdgeFunction(slug?: string): Promise<BlogPost[]> {
  try {
    const params = slug ? { slug } : undefined;

    const response = await edgeFetch('notion-blog', {
      method: 'GET',
      params,
    });

    if (!response.ok) {
      console.error('Failed to fetch blog posts:', response.statusText);
      return [];
    }

    const result = await response.json();

    if (!result.success) {
      console.error('Edge function returned error:', result.error);
      return [];
    }

    if (slug) {
      return result.data ? [result.data] : [];
    }

    return result.data || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export const blogService = {
  getAllPosts: async (): Promise<BlogPost[]> => {
    return fetchFromEdgeFunction();
  },

  getPublishedPosts: async (): Promise<BlogPost[]> => {
    const posts = await fetchFromEdgeFunction();
    return posts.filter(post => post.status !== 'draft');
  },

  getPostBySlug: async (slug: string): Promise<BlogPost | null> => {
    const posts = await fetchFromEdgeFunction(slug);
    return posts.length > 0 ? posts[0] : null;
  },

  createPost: async (post: Omit<BlogPost, 'id'>): Promise<BlogPost> => {
    console.warn('Create post not implemented for Notion integration');
    return { id: 'not-implemented', ...post } as BlogPost;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updatePost: async (_id: string, _updates: Partial<BlogPost>): Promise<BlogPost | null> => {
    console.warn('Update post not implemented for Notion integration');
    return null;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deletePost: async (_id: string): Promise<boolean> => {
    console.warn('Delete post not implemented for Notion integration');
    return false;
  },

  searchPosts: async (query: string): Promise<BlogPost[]> => {
    const posts = await fetchFromEdgeFunction();
    const lowerQuery = query.toLowerCase();
    return posts.filter(post =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery)
    );
  },

  getPostsByCategory: async (category: string): Promise<BlogPost[]> => {
    const posts = await fetchFromEdgeFunction();
    return posts.filter(post => post.category === category);
  },

  getPostsByTag: async (tag: string): Promise<BlogPost[]> => {
    const posts = await fetchFromEdgeFunction();
    return posts.filter(post => post.tags?.includes(tag));
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  incrementViews: async (_slug: string): Promise<void> => {
    return Promise.resolve();
  }
};
