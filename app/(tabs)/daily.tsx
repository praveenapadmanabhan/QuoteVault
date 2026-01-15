import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import ShareButton from '@/components/ShareButton';
import { mockQuotes } from '@/data/mockQuotes';
import { scheduleDailyNotification } from '@/lib/notifications';
import { shareQuote } from '@/lib/shareUtils';

export default function DailyScreen() {
  const [dailyQuote, setDailyQuote] = useState(mockQuotes[0]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    getRandomQuote();
    checkNotificationStatus();
  }, []);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * mockQuotes.length);
    setDailyQuote(mockQuotes[randomIndex]);
  };

  const checkNotificationStatus = async () => {
    const settings = await Notifications.getPermissionsAsync();
    setNotificationsEnabled(settings.granted || settings.ios?.status === 2);
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

  const handleShare = () => {
    shareQuote(dailyQuote);
  };

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
        
        <View style={styles.tagsContainer}>
          {dailyQuote.tags?.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={getRandomQuote}
        >
          <Ionicons name="refresh" size={24} color="#007AFF" />
          <Text style={styles.actionText}>New Quote</Text>
        </TouchableOpacity>

        <ShareButton quote={dailyQuote} />

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleShare}
        >
          <Ionicons name="heart-outline" size={24} color="#FF3B30" />
          <Text style={styles.actionText}>Favorite</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  notificationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  quoteContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 30,
  },
  quoteText: {
    fontSize: 20,
    lineHeight: 30,
    color: '#333',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  author: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    textAlign: 'right',
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e8f4fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 'auto',
    paddingTop: 20,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});