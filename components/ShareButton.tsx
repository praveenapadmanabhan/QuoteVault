import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { shareQuote } from '@/lib/shareUtils';
import { Quote } from '@/types';

interface ShareButtonProps {
  quote: Quote;
}

const ShareButton: React.FC<ShareButtonProps> = ({ quote }) => {
  const handleShare = async () => {
    await shareQuote(quote);
  };

  return (
    <TouchableOpacity onPress={handleShare}>
      <Ionicons name="share-outline" size={24} color="#666" />
    </TouchableOpacity>
  );
};

export default ShareButton;