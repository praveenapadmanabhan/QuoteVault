import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Notification behavior when app is foregrounded
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Ask permission & setup notification channel
 */
export async function registerForPushNotifications(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-quotes', {
      name: 'Daily Quotes',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#38BDF8',
    });
  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } =
      await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

/**
 * Schedule daily quote reminder (9 AM)
 */
export async function scheduleDailyNotification(): Promise<void> {
  // Remove old scheduled notifications
  await Notifications.cancelAllScheduledNotificationsAsync();

  const hasPermission = await registerForPushNotifications();
  if (!hasPermission) return;

  // ✅ Correct daily trigger (no TS error)
  const trigger: Notifications.DailyTriggerInput = {
    hour: 9,
    minute: 0,
    type: Notifications.SchedulableTriggerInputTypes.DAILY
  };

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '📖 Daily Quote',
      body: 'Open QuoteVault to read today’s inspiration ✨',
      sound: true,
    },
    trigger,
  });
}

/**
 * Cancel all notifications (for toggle OFF)
 */
export async function cancelDailyNotification(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
