import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ShareButton from '@/components/ShareButton';
import { scheduleDailyNotification } from '@/lib/notifications';
import { fetchQuotes } from '@/lib/quotes';
import { Quote } from '@/types';

export default function DailyScreen() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [dailyQuote, setDailyQuote] = useState<Quote | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Quote[]>([]);

  useEffect(() => {
    loadQuotes();
    checkNotificationStatus();
    loadFavorites();
  }, []);

  // Load quotes
  const loadQuotes = async () => {
    try {
      const data = await fetchQuotes();
      setQuotes(data);
      pickRandomQuote(data);
    } catch (error) {
      console.error('Failed to load quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Pick a random quote
  const pickRandomQuote = (quotesList: Quote[]) => {
    if (quotesList.length === 0) return;
    const randomIndex = Math.floor(Math.random() * quotesList.length);
    setDailyQuote(quotesList[randomIndex]);
  };

  // Check notification permissions
  const checkNotificationStatus = async () => {
    const settings = await Notifications.getPermissionsAsync();
    setNotificationsEnabled(settings.granted || settings.ios?.status === 2);
  };

  // Toggle notifications
  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        await scheduleDailyNotification();
        setNotificationsEnabled(true);
        Alert.alert('Success', 'Daily notifications enabled!');
      }
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
      setNotificationsEnabled(false);
      Alert.alert('Notifications Disabled', 'Daily notifications turned off.');
    }
  };

  // Handle New Quote button
  const handleNewQuote = () => {
    pickRandomQuote(quotes);
  };

  // Load favorites from AsyncStorage
  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem('@favorites');
      if (stored) setFavorites(JSON.parse(stored));
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  };

  // Handle favorite
  const handleFavorite = async (quote: Quote) => {
    if (favorites.find((q) => q.id === quote.id)) {
      Alert.alert('Already Favorited', 'This quote is already in your favorites.');
      return;
    }
    const updatedFavorites = [...favorites, quote];
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem('@favorites', JSON.stringify(updatedFavorites));
    Alert.alert('Added to Favorites', `"${quote.text}" has been added!`);
  };

  if (loading || !dailyQuote) {
    return (
      <SafeAreaView style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Quote of the Day</Text>
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationText}>Daily Reminder</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={notificationsEnabled ? '#007AFF' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Quote */}
      <View style={styles.quoteContainer}>
        <Text style={styles.quoteText}>"{dailyQuote.text}"</Text>
        <Text style={styles.author}>— {dailyQuote.author}</Text>
        {dailyQuote.tags?.length > 0 && (
          <View style={styles.tagsContainer}>
            {dailyQuote.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        {/* New Quote */}
        <TouchableOpacity style={styles.actionButton} onPress={handleNewQuote}>
          <Ionicons name="refresh" size={24} color="#007AFF" />
          <Text style={styles.actionText}>New Quote</Text>
        </TouchableOpacity>

        {/* Share */}
        <ShareButton quote={dailyQuote} />

        {/* Favorite */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleFavorite(dailyQuote)}
        >
          <Ionicons
            name={favorites.find((q) => q.id === dailyQuote.id) ? 'heart' : 'heart-outline'}
            size={24}
            color="#FF3B30"
          />
          <Text style={styles.actionText}>Favorite</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
    marginBottom: 16,
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  notificationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  quoteContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 32,
  },
  quoteText: {
    fontSize: 20,
    lineHeight: 32,
    color: '#111827',
    fontStyle: 'italic',
    marginBottom: 18,
  },
  author: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'right',
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 'auto',
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  actionText: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
  },
});
