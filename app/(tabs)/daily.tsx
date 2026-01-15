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
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/ctx/AuthContext';

export default function DailyScreen() {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [dailyQuote, setDailyQuote] = useState<Quote | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Quote[]>([]);

  useEffect(() => {
    initDailyQuote();
    checkNotificationStatus();
    if (user?.id) loadFavorites();
  }, [user]);

  // Initialize Daily Quote with AsyncStorage (daily persistence)
  const initDailyQuote = async () => {
    try {
      const data = await fetchQuotes();
      setQuotes(data);

      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const storedQuoteId = await AsyncStorage.getItem(`dailyQuote_${today}`);

      if (storedQuoteId) {
        const quote = data.find((q) => q.id === storedQuoteId);
        if (quote) {
          setDailyQuote(quote);
        } else {
          pickAndSaveRandomQuote(data, today);
        }
      } else {
        pickAndSaveRandomQuote(data, today);
      }
    } catch (error) {
      console.error('Failed to load quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Pick random quote and save to AsyncStorage
  const pickAndSaveRandomQuote = async (quotesList: Quote[], dateKey: string) => {
    if (quotesList.length === 0) return;
    const randomIndex = Math.floor(Math.random() * quotesList.length);
    const quote = quotesList[randomIndex];
    setDailyQuote(quote);

    try {
      await AsyncStorage.setItem(`dailyQuote_${dateKey}`, quote.id);
    } catch (error) {
      console.error('Failed to save daily quote:', error);
    }
  };

  // Load favorites from Supabase
  const loadFavorites = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`quote_id, quotes(*)`)
        .eq('user_id', user.id);

      if (error) throw error;

      setFavorites(data.map((item: any) => item.quotes));
    } catch (error) {
      console.error('Failed to load favorites from Supabase:', error);
    }
  };

  // Toggle favorite via Supabase
  const handleToggleFavorite = async (quote: Quote) => {
    if (!user?.id) return;

    const isFavorited = favorites.find((q) => q.id === quote.id);

    try {
      if (isFavorited) {
        // Remove from Supabase
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('quote_id', quote.id);

        setFavorites(prev => prev.filter(q => q.id !== quote.id));
        Alert.alert('Removed from Favorites', `"${quote.text}" removed!`);
      } else {
        // Add to Supabase
        await supabase
          .from('favorites')
          .insert([{ user_id: user.id, quote_id: quote.id }]);

        setFavorites(prev => [...prev, quote]);
        Alert.alert('Added to Favorites', `"${quote.text}" added!`);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorite.');
    }
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

  // Handle New Quote button manually (override daily)
  const handleNewQuote = () => {
    if (!quotes.length) return;
    const today = new Date().toISOString().split('T')[0];
    pickAndSaveRandomQuote(quotes, today);
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
          onPress={() => handleToggleFavorite(dailyQuote)}
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
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  container: { flex: 1, backgroundColor: '#0F172A', paddingHorizontal: 20, paddingTop: 16 },
  header: { marginBottom: 28 },
  title: { fontSize: 28, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.3, marginBottom: 16 },
  notificationContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB' },
  notificationText: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  quoteContainer: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 32 },
  quoteText: { fontSize: 20, lineHeight: 32, color: '#111827', fontStyle: 'italic', marginBottom: 18 },
  author: { fontSize: 15, fontWeight: '600', color: '#6B7280', textAlign: 'right', marginBottom: 16 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: '#EFF6FF', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999 },
  tagText: { fontSize: 12, fontWeight: '600', color: '#2563EB' },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingTop: 12, paddingBottom: 20, borderTopWidth: 1, borderTopColor: '#E5E7EB', marginTop: 'auto' },
  actionButton: { alignItems: 'center', justifyContent: 'center', padding: 10 },
  actionText: { marginTop: 6, fontSize: 13, fontWeight: '500', color: '#475569' },
});
