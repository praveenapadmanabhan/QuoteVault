import * as Sharing from 'expo-sharing';
import { Quote } from '@/types';

export async function shareQuote(quote: Quote) {
  const message = `"${quote.text}"\n\n— ${quote.author}\n\nShared from QuoteVault App`;
  
  try {
    await Sharing.shareAsync(message, {
      dialogTitle: 'Share this quote',
    });
  } catch (error) {
    console.error('Error sharing quote:', error);
  }
}