export interface Quote {
  id: string;
  text: string;
  author: string;
  category: string;
  category_id: string;
  tags: string[];
  is_public: boolean;
  user_id: string;
  created_at: string;
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