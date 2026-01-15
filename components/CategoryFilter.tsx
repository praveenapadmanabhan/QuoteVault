import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { fetchCategories } from '@/lib/categories';
import { Category } from '@/types';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      console.log('Loaded categories:', data);
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
    >
      {/* All category */}
      <TouchableOpacity
        style={[
          styles.categoryButton,
          selectedCategory === 'all' && styles.categoryButtonSelected,
        ]}
        onPress={() => onSelectCategory('all')}
      >
        <Text
          style={[
            styles.categoryText,
            selectedCategory === 'all' && styles.categoryTextSelected,
          ]}
        >
          All
        </Text>
      </TouchableOpacity>

      {/* Dynamic categories */}
      {categories.map((category) => {
        const categoryId = String(category.id);

        return (
          <TouchableOpacity
            key={categoryId}
            style={[
              styles.categoryButton,
              selectedCategory === categoryId &&
                styles.categoryButtonSelected,
            ]}
            onPress={() => onSelectCategory(categoryId)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === categoryId &&
                  styles.categoryTextSelected,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 0,
  },
  contentContainer: {
    flexDirection: 'row', // 🔥 REQUIRED for horizontal layout
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryButtonSelected: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  loadingContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
