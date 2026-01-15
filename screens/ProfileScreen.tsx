import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function ProfileScreen() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async (): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const handleSignOut = async (): Promise<void> => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);

    // ✅ Redirect to login after logout
    router.replace('/login');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
      </View>

      <Text style={styles.email}>{user?.email}</Text>
      <Text style={styles.userId}>
        User ID: {user?.id?.substring(0, 8)}...
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Email Confirmed</Text>
          <Text style={styles.value}>
            {user?.email_confirmed_at ? '✓ Yes' : '✗ No'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Account Created</Text>
          <Text style={styles.value}>
            {user?.created_at
              ? new Date(user.created_at).toLocaleDateString()
              : 'N/A'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignOut}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Out</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
    paddingHorizontal: 20,
    color: '#fff',
  },
  userId: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 32,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    color: '#555',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
