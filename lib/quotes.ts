import { supabase } from './supabase';
import { Quote } from '@/types';

/**
 * Fetch all quotes
 * - If userId is provided → fetch user's quotes + public quotes
 * - If not → fetch only public quotes
 */
export async function fetchQuotes(userId?: string): Promise<Quote[]> {
  try {
    let query = supabase
      .from('quotes')
      .select(`
        id,
        text,
        author,
        category,
        category_id,
        tags,
        is_public,
        user_id,
        created_at
      `);

    if (userId) {
      query = query.or(`user_id.eq.${userId},is_public.eq.true`);
    } else {
      query = query.eq('is_public', true);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data ?? []).map((item) => ({
      id: item.id,
      text: item.text,
      author: item.author,
      category: item.category,
      category_id: item.category_id,
      tags: Array.isArray(item.tags) ? item.tags : [],
      is_public: item.is_public,
      user_id: item.user_id,
      created_at: item.created_at,
    }));
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return [];
  }
}

/**
 * Fetch quotes by category
 */
export async function fetchQuotesByCategory(
  categoryId: string,
  userId?: string
): Promise<Quote[]> {
  try {
    if (categoryId === 'all') {
      return fetchQuotes(userId);
    }

    let query = supabase
      .from('quotes')
      .select(`
        id,
        text,
        author,
        category,
        category_id,
        tags,
        is_public,
        user_id,
        created_at
      `)
      .eq('category_id', categoryId);

    if (userId) {
      query = query.or(`user_id.eq.${userId},is_public.eq.true`);
    } else {
      query = query.eq('is_public', true);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data ?? []).map((item) => ({
      id: item.id,
      text: item.text,
      author: item.author,
      category: item.category,
      category_id: item.category_id,
      tags: Array.isArray(item.tags) ? item.tags : [],
      is_public: item.is_public,
      user_id: item.user_id,
      created_at: item.created_at,
    }));
  } catch (error) {
    console.error('Error fetching quotes by category:', error);
    return [];
  }
}
