// screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { quotesData } from '../data/quotes';
import QuoteCard from '../components/QuoteCard';

const categories = [
  'All',
  'Motivation',
  'Love',
  'Success',
  'Wisdom',
  'Humor',
];

export default function HomeScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [quotes, setQuotes] = useState(quotesData);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    filterQuotes();
  }, [selectedCategory]);

  const filterQuotes = () => {
    if (selectedCategory === 'All') {
      setQuotes(quotesData);
    } else {
      const filtered = quotesData.filter(
        q => q.category === selectedCategory
      );
      setQuotes(filtered);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      filterQuotes();
      setRefreshing(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>QuoteVault</Text>
        <Text style={styles.subtitle}>
          Discover daily inspiration ✨
        </Text>
      </View>

      {/* Categories */}
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item}
        style={styles.categoryList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === item && styles.activeCategory,
            ]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === item && styles.activeCategoryText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Quotes List */}
      <FlatList
        data={quotes}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={
          quotes.length === 0 && styles.emptyContainer
        }
        renderItem={({ item }) => (
          <QuoteCard
            quote={item}
            onPress={() => router.push(`/quote/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No quotes found 🫤
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#94A3B8',
  },
  categoryList: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    marginRight: 8,
  },
  activeCategory: {
    backgroundColor: '#38BDF8',
  },
  categoryText: {
    color: '#CBD5E1',
    fontSize: 14,
  },
  activeCategoryText: {
    color: '#0F172A',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 16,
  },
});