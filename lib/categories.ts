import { supabase } from './supabase';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  created_at: string;
}

// Fetch all categories
export async function fetchCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Get category by ID
export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

// Get category by name
export async function getCategoryByName(name: string): Promise<Category | null> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('name', name)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching category by name:', error);
    return null;
  }
}

// Get categories with quote count
export async function fetchCategoriesWithCount(): Promise<(Category & { quote_count: number })[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        quotes:quotes(count)
      `)
      .order('name');

    if (error) throw error;

    const categoriesWithCount = (data || []).map(category => ({
      ...category,
      quote_count: category.quotes?.[0]?.count || 0
    }));

    return categoriesWithCount;
  } catch (error) {
    console.error('Error fetching categories with count:', error);
    return [];
  }
}