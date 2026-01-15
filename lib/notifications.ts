import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { mockQuotes } from '@/data/mockQuotes';

export async function scheduleDailyNotification() {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const trigger : Notifications.DailyTriggerInput = { 
    hour: 9,
    minute: 0,
  };

  const randomQuote = mockQuotes[Math.floor(Math.random() * mockQuotes.length)];

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '📖 Daily Quote',
      body: `"${randomQuote.text}" - ${randomQuote.author}`,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
      data: { quoteId: randomQuote.id },
    },
    trigger,
  });
}

export async function registerForPushNotifications() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return;
  }

  return true;
}