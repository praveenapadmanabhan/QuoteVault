import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Go to Supabase Dashboard → Settings → API to get these
const supabaseUrl = 'https://jjrmcscdpwclgomtsijc.supabase.co';  // Replace with your URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqcm1jc2NkcHdjbGdvbXRzaWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNjg3NTIsImV4cCI6MjA4Mzk0NDc1Mn0.nCh_IFDz1ZzMqWKCnKy93YJr0f-5qDGWFvvWwBHOvQk';             // Replace with your anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});