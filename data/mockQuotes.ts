import { Quote } from '@/types';

export const mockQuotes: Quote[] = [
  {
    id: '1',
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
    category: 'Motivation',
    tags: ['work', 'passion', 'success'],
    isFavorite: false,
  },
  {
    id: '2',
    text: 'Life is what happens to you while you\'re busy making other plans.',
    author: 'John Lennon',
    category: 'Life',
    tags: ['life', 'wisdom'],
    isFavorite: true,
  },
  {
    id: '3',
    text: 'The future belongs to those who believe in the beauty of their dreams.',
    author: 'Eleanor Roosevelt',
    category: 'Inspiration',
    tags: ['dreams', 'future'],
    isFavorite: false,
  },
  {
    id: '4',
    text: 'It is during our darkest moments that we must focus to see the light.',
    author: 'Aristotle',
    category: 'Wisdom',
    tags: ['darkness', 'light', 'hope'],
    isFavorite: false,
  },
  {
    id: '5',
    text: 'Whoever is happy will make others happy too.',
    author: 'Anne Frank',
    category: 'Happiness',
    tags: ['happiness', 'joy'],
    isFavorite: true,
  },
];