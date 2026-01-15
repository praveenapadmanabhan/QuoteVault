import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/ctx/AuthContext';
import QuoteCard from '@/components/QuoteCard';
import { getFavoriteQuotes, toggleFavorite } from '@/lib/favorites';
import { supabase } from '@/lib/supabase';
import { Quote } from '@/types';

export default function FavoritesScreen() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      testFavoritesDirectly();
      loadFavorites();
    }
  }, [user]);

  // TEST FUNCTION - Remove this after debugging
  const testFavoritesDirectly = async () => {
    if (!user?.id) return;

    console.log('=== TESTING FAVORITES DIRECTLY ===');
    console.log('User ID:', user.id);

    // Direct query to favorites table
    const { data: rawFavorites, error: favError } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id);

    console.log('Raw favorites from database:', rawFavorites);
    console.log('Favorites error:', favError);

    // Query with join
    const { data: joinedFavorites, error: joinError } = await supabase
      .from('favorites')
      .select(`
        id,
        quote_id,
        quotes!inner (
          *,
          categories (
            id,
            name,
            color
          )
        )
      `)
      .eq('user_id', user.id);

    console.log('Joined favorites:', joinedFavorites);
    console.log('Join error:', joinError);
  };

  const loadFavorites = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      console.log('=== LOADING FAVORITES ===');
      console.log('User ID:', user.id);

      const data = await getFavoriteQuotes(user.id);
      console.log('getFavoriteQuotes returned:', data.length, 'quotes');
      console.log('Favorites data:', JSON.stringify(data, null, 2));

      setFavorites(data);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleToggleFavorite = async (quoteId: string) => {
    if (!user?.id) return;

    try {
      console.log('Removing favorite:', quoteId);
      await toggleFavorite(quoteId, user.id);
      // Remove from local state immediately
      setFavorites(prev => prev.filter(q => q.id !== quoteId));
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadFavorites();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading favorites...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Favorites</Text>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <QuoteCard
            quote={item}
            onToggleFavorite={() => handleToggleFavorite(item.id)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No favorite quotes yet.{'\n'}
              Tap the heart icon on quotes to add them here!
            </Text>
            <TouchableOpacity onPress={testFavoritesDirectly} style={styles.testButton}>
              <Text style={styles.testButtonText}>Run Database Test</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#0F172A',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  debugButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  debugButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 32,
    marginBottom: 20,
  },
  testButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});