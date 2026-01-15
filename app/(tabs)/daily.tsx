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

import ShareButton from '@/components/ShareButton';
import { scheduleDailyNotification } from '@/lib/notifications';
import { shareQuote } from '@/lib/shareUtils';
import { fetchQuotes } from '@/lib/quotes';
import { Quote } from '@/types';


export default function DailyScreen() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [dailyQuote, setDailyQuote] = useState<Quote | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuotes();
    checkNotificationStatus();
  }, []);

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

  const pickRandomQuote = (quotesList: Quote[]) => {
    if (quotesList.length === 0) return;
    const randomIndex = Math.floor(Math.random() * quotesList.length);
    setDailyQuote(quotesList[randomIndex]);
  };

  const checkNotificationStatus = async () => {
    const settings = await Notifications.getPermissionsAsync();
    setNotificationsEnabled(
      settings.granted || settings.ios?.status === 2
    );
  };

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

  const handleNewQuote = () => {
    pickRandomQuote(quotes);
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

      <View style={styles.quoteContainer}>
        <Text style={styles.quoteText}>"{dailyQuote.text}"</Text>
        <Text style={styles.author}>— {dailyQuote.author}</Text>

        {dailyQuote.tags?.length > 0 && (
          <View style={styles.tagsContainer}>
            {(dailyQuote.tags ?? []).map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleNewQuote}
        >
          <Ionicons name="refresh" size={24} color="#007AFF" />
          <Text style={styles.actionText}>New Quote</Text>
        </TouchableOpacity>

        <ShareButton quote={dailyQuote} />

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={24} color="#FF3B30" />
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
