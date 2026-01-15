// @/lib/categories.ts
import { supabase } from './supabase';

export interface Category {
  id: string;
  name: string;
}

/**
 * Fetch all categories
 */
export async function fetchCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .order('name', { ascending: true });

    if (error) throw error;

    return data ?? [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
