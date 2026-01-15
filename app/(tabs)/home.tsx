import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/ctx/AuthContext';
import QuoteCard from '@/components/QuoteCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import { fetchQuotes, fetchQuotesByCategory } from '@/lib/quotes';
import { toggleFavorite } from '@/lib/favorites';
import { Quote } from '@/types';

export default function HomeScreen() {
  const { user } = useAuth();

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadQuotes();
  }, [selectedCategory]);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      console.log('Loading quotes for category:', selectedCategory);

      let data: Quote[];
      if (selectedCategory === 'all') {
        data = await fetchQuotes();
      } else {
        data = await fetchQuotesByCategory(selectedCategory);
      }

      console.log('Loaded quotes:', data.length);
      setQuotes(data);
      setFilteredQuotes(data);
    } catch (error) {
      console.error('Error loading quotes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredQuotes(quotes);
      return;
    }

    const filtered = quotes.filter(
      (quote) =>
        quote.text.toLowerCase().includes(query.toLowerCase()) ||
        quote.author.toLowerCase().includes(query.toLowerCase()) ||
        quote.category?.toLowerCase().includes(query.toLowerCase()) ||
        quote.tags?.some((tag: string) =>
          tag.toLowerCase().includes(query.toLowerCase())
        )
    );

    setFilteredQuotes(filtered);
  };

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadQuotes();
  };

  const handleToggleFavorite = async (quoteId: string) => {
    if (!user?.id) {
      console.log('User not logged in');
      // TODO: Show a message asking user to log in
      return;
    }

    try {
      console.log('Toggling favorite for quote:', quoteId);
      const isFavorite = await toggleFavorite(quoteId, user.id);
      
      // Update local state immediately for better UX
      setQuotes(prevQuotes =>
        prevQuotes.map(q =>
          q.id === quoteId ? { ...q, is_favorite: isFavorite } : q
        )
      );
      
      setFilteredQuotes(prevQuotes =>
        prevQuotes.map(q =>
          q.id === quoteId ? { ...q, is_favorite: isFavorite } : q
        )
      );
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading quotes...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SearchBar onSearch={handleSearch} />
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryFilter}
      />

      <FlatList
        data={filteredQuotes}
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
              {searchQuery
                ? 'No quotes found matching your search.'
                : 'No quotes available. Pull down to refresh.'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  },
});