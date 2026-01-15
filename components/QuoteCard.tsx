import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ShareButton from './ShareButton';
import { Quote } from '@/types';

interface QuoteCardProps {
  quote: Quote;
  onToggleFavorite: () => void;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, onToggleFavorite }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>"{quote.text}"</Text>
        <Text style={styles.author}>— {quote.author}</Text>
        
        {quote.category && (
          <View style={styles.categoryContainer}>
            <View style={[styles.categoryBadge, { backgroundColor: quote.categories?.color || '#007AFF' }]}>
              <Text style={styles.categoryText}>{quote.category}</Text>
            </View>
          </View>
        )}

        {quote.tags && quote.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {quote.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity onPress={onToggleFavorite} style={styles.actionButton}>
          <Ionicons
            name={quote.is_favorite ? 'heart' : 'heart-outline'}
            size={24}
            color={quote.is_favorite ? '#FF3B30' : '#666'}
          />
        </TouchableOpacity>
        
        <ShareButton quote={quote} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  author: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textAlign: 'right',
  },
  categoryContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    gap: 16,
  },
  actionButton: {
    padding: 8,
  },
});

export default QuoteCard;