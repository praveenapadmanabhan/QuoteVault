// @/components/CategoryFilter.tsx
import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { fetchCategories, Category } from '@/lib/categories';

interface Props {
  selectedCategory: string;
  onSelectCategory: (categoryName: string) => void;
}

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await fetchCategories();
    setCategories(data);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {/* All category */}
      <CategoryChip
        label="All"
        selected={selectedCategory === 'All'}
        onPress={() => onSelectCategory('All')}
      />

      {categories.map((category) => (
        <CategoryChip
          key={category.id}
          label={category.name}
          selected={selectedCategory === category.name}
          onPress={() => onSelectCategory(category.name)}
        />
      ))}
    </ScrollView>
  );
}

function CategoryChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        selected && styles.selectedChip,
      ]}
    >
      <Text
        style={[
          styles.chipText,
          selected && styles.selectedChipText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },

  chip: {
    paddingHorizontal: 14,
    height:28,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  selectedChip: {
    backgroundColor: '#38BDF8',
  },

  chipText: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight:16,

  },

  selectedChipText: {
    color: '#0F172A',
    fontWeight: '600',
  },
});
