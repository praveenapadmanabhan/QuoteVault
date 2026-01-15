export interface Quote {
  id: string;
  text: string;  // Changed from content to text
  author: string;
  category_id: string;
  category?: string;
  categories?: {
    id: string;
    name: string;
    color: string;
  };
  tags?: string[];
  is_favorite: boolean;
  is_public?: boolean;
  user_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  created_at?: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  quote_id: string;
  created_at: string;
}

export interface AuthSession {
  user: User;
  access_token: string;
  refresh_token?: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}