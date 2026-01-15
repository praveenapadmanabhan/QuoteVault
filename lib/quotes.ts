import { supabase } from './supabase';
import { Quote } from '@/types';

export async function fetchQuotes(userId?: string): Promise<Quote[]> {
  try {
    console.log('fetchQuotes called with userId:', userId);
    
    let query = supabase
      .from('quotes')
      .select(`
        *,
        categories (
          id,
          name,
          color
        )
      `);
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query;
    
    console.log('Fetched quotes:', data?.length, 'Error:', error);
    
    if (error) throw error;
    
    const quotes: Quote[] = (data || []).map(item => ({
      ...item,
      category: item.categories?.name || item.category,
      category_id: item.categories?.id || item.category_id,
      is_favorite: item.is_favorite || false
    }));
    
    return quotes;
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return [];
  }
}

export async function fetchQuotesByCategory(categoryId: string, userId?: string): Promise<Quote[]> {
  try {
    console.log('fetchQuotesByCategory:', categoryId, 'userId:', userId);
    
    // If 'all', fetch all quotes
    if (categoryId === 'all') {
      return fetchQuotes(userId);
    }

    let query = supabase
      .from('quotes')
      .select(`
        *,
        categories (
          id,
          name,
          color
        )
      `)
      .eq('category_id', categoryId);
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query;
    
    console.log('Fetched quotes by category:', data?.length, 'Error:', error);
    
    if (error) throw error;
    
    const quotes: Quote[] = (data || []).map(item => ({
      ...item,
      category: item.categories?.name || 'Uncategorized',
      category_id: item.categories?.id || item.category_id,
      is_favorite: item.is_favorite || false
    }));
    
    return quotes;
  } catch (error) {
    console.error('Error fetching quotes by category:', error);
    return [];
  }
}