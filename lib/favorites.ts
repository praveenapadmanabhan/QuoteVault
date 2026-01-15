import { supabase } from './supabase';

export async function toggleFavorite(quoteId: string, userId: string): Promise<boolean> {
  try {
    // Check if already favorited
    const { data: existing, error: checkError } = await supabase
      .from('favorites')
      .select('id')
      .eq('quote_id', quoteId)
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existing) {
      // Remove from favorites
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('quote_id', quoteId)
        .eq('user_id', userId);

      if (error) throw error;
      
      // Update is_favorite in quotes table
      await supabase
        .from('quotes')
        .update({ is_favorite: false })
        .eq('id', quoteId);

      return false;
    } else {
      // Add to favorites
      const { error } = await supabase
        .from('favorites')
        .insert({ quote_id: quoteId, user_id: userId });

      if (error) throw error;
      
      // Update is_favorite in quotes table
      await supabase
        .from('quotes')
        .update({ is_favorite: true })
        .eq('id', quoteId);

      return true;
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
}

export async function getFavoriteQuotes(userId: string) {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        quotes (
          *,
          categories (
            id,
            name,
            color
          )
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;

    return (data || []).map(item => ({
      ...item.quotes,
      category: item.quotes.categories?.name,
      category_id: item.quotes.categories?.id,
      is_favorite: true
    }));
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
}