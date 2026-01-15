# QuoteVault 📚

A beautiful mobile app for discovering, saving, and sharing inspirational quotes. Built with React Native (Expo) and Supabase.

![QuoteVault Banner](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=QuoteVault+App)

## Features

- 🔐 **Complete Authentication** - Sign up, login, and secure user sessions
- 🔍 Browse quotes by categories
- ❤️ Save favorite quotes
- 📅 Daily quote feature
- 🔔 Push notifications (production builds only)
- 📤 Share quotes (production builds only)
- 🎨 Themed UI with dark/light mode support
- 🔍 Search functionality
- 📱 Clean, intuitive interface

## Project Structure

```
QuoteVault/
├── .expo/                 # Expo development files
├── .vscode/              # VS Code settings
├── app/                  # App router (Expo Router)
│   ├── (tabs)/          # Tab navigation screens
│   │   ├── _layout.tsx
│   │   ├── daily.tsx    # Daily quote screen
│   │   ├── favorites.tsx # Favorites screen
│   │   ├── home.tsx     # Home screen
│   │   └── profile.tsx  # User profile
│   ├── (auth)/          # Authentication screens
│   │   ├── _layout.tsx
│   │   ├── forgot-password.tsx
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   └── signup.tsx
│   └── _layout.tsx      # Root layout
├── assets/              # Images, fonts, icons
├── components/          # Reusable UI components
│   ├── ui/             # UI components
│   │   ├── CategoryFilter.tsx
│   │   ├── external-link.tsx
│   │   ├── haptic-tab.tsx
│   │   ├── hello-wave.tsx
│   │   ├── parallax-scroll-view.tsx
│   │   ├── QuoteCard.tsx
│   │   ├── SearchBar.tsx
│   │   ├── ShareButton.tsx
│   │   ├── themed-text.tsx
│   │   └── themed-view.tsx
├── constants/
│   └── theme.ts        # Theme configuration
├── ctx/                # React Context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
│   ├── categories.ts   # Category management
│   ├── favorites.ts    # Favorites management
│   ├── notifications.ts # Push notifications
│   ├── quotes.ts       # Quote operations
│   ├── shareUtils.ts   # Sharing utilities
│   └── supabase.ts     # Supabase client
├── screens/            # Screen components (if used)
├── scripts/            # Build/development scripts
├── types/              # TypeScript definitions
│   └── index.ts
├── .gitignore
├── app.json            # Expo configuration
├── eslint.config.js    # ESLint configuration
├── expo-env.d.ts       # Expo environment types
├── package-lock.json
└── package.json
```

## Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- Expo CLI
- iOS Simulator (macOS) or Android Studio (Android)
- Supabase account

## Quick Setup

### 1. Clone & Install

```bash
git clone <repository-url>
cd QuoteVault
npm install
```

### 2. Supabase Configuration

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Sign up / Sign in
   - Create new project
   - Enable Email Authentication in Auth settings

2. **Set Up Database Tables:**
   Run these SQL queries in Supabase SQL Editor:

```sql
-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Categories table (public)
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  icon VARCHAR(50)
);

-- Quotes table (public)
CREATE TABLE quotes (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  author VARCHAR(100),
  category_id INTEGER REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Favorites table (user-specific)
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  quote_id INTEGER REFERENCES quotes(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, quote_id)
);

-- Create policies
CREATE POLICY "Allow anonymous read access to categories" 
ON categories FOR SELECT USING (true);

CREATE POLICY "Allow anonymous read access to quotes" 
ON quotes FOR SELECT USING (true);

CREATE POLICY "Users can manage their own favorites" 
ON favorites FOR ALL USING (auth.uid() = user_id);
```

3. **Add Sample Data:**

```sql
-- Insert categories
INSERT INTO categories (name, icon) VALUES
  ('Inspiration', 'sparkles'),
  ('Motivation', 'trending-up'),
  ('Wisdom', 'brain'),
  ('Love', 'heart'),
  ('Success', 'trophy');

-- Insert some quotes
INSERT INTO quotes (text, author, category_id) VALUES
  ('The only way to do great work is to love what you do.', 'Steve Jobs', 1),
  ('Life is what happens when you''re busy making other plans.', 'John Lennon', 3),
  ('Be the change you wish to see in the world.', 'Mahatma Gandhi', 2),
  ('In the middle of difficulty lies opportunity.', 'Albert Einstein', 4),
  ('The future belongs to those who believe in the beauty of their dreams.', 'Eleanor Roosevelt', 5);
```

4. **Configure Environment:**
   Create `.env` file in root directory:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Configure Supabase Client

Your `lib/supabase.ts` should look like:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
```

### 4. Run the App

```bash
# Start development server
npx expo start

# Scan QR code with Expo Go app (iOS/Android)
# Or run on emulator/simulator
npx expo start --ios
npx expo start --android
```

## Key Components

### 1. **QuoteCard.tsx**
   - Displays individual quotes with author
   - Includes favorite button and share functionality
   - Themed with light/dark mode support

### 2. **CategoryFilter.tsx**
   - Horizontal scrollable category filter
   - Visual category selection
   - Icon support for each category

### 3. **SearchBar.tsx**
   - Real-time quote search
   - Debounced search queries
   - Clean search interface

### 4. **ShareButton.tsx**
   - Native share functionality
   - Quote text formatting
   - Platform-specific sharing

### 5. **Themed Components**
   - `themed-text.tsx` - Consistent typography
   - `themed-view.tsx` - Consistent container styling
   - Supports dark/light mode

## Authentication Status ✅

**Complete Features:**
- ✅ User registration with email/password
- ✅ Secure login/logout
- ✅ Password reset functionality
- ✅ Protected routes for authenticated users
- ✅ Session persistence with Supabase
- ✅ User-specific data (favorites per user)

**Auth Flow:**
1. Login screen (`app/(auth)/login.tsx`)
2. Signup screen (`app/(auth)/signup.tsx`)
3. Forgot password (`app/(auth)/forgot-password.tsx`)
4. Protected tab navigation

## AI Development Workflow

### Approach & Tools Used

**AI Assistants:**
- **ChatGPT-4** (Primary): Architecture design, authentication setup, code generation
- **Claude 3** (Secondary): Code review, security best practices, optimization
- **DeepSeek** (Tertiary): Database schema design, SQL queries
- **GitHub Copilot** (Daily): Code completion, inline suggestions

### Development Process:
1. **Planning Phase:** ChatGPT for project structure and feature planning
2. **Authentication:** Multi-AI approach for secure auth implementation
3. **Database Design:** DeepSeek for SQL schema and queries
4. **UI/UX:** Iterative design with real-time AI feedback
5. **Testing & Debugging:** Cross-AI validation of issues

### Key Workflow Insights:
- **Authentication Complexity:** Used ChatGPT for Supabase auth setup, Claude for security review
- **Database Optimization:** DeepSeek helped with efficient SQL queries and RLS policies
- **State Management:** AI-assisted for auth state persistence
- **Error Handling:** Implemented comprehensive auth error states with AI guidance

## Platform-Specific Features & Limitations

### ⚠️ Important: Expo Go Limitations

**The following features are implemented but ONLY work in development/production builds:**

1. **🔔 Expo Notifications** (`lib/notifications.ts`)
   - ✅ Implemented with `expo-notifications`
   - ❌ **Does NOT work in Expo Go**
   - ✅ Works in development builds via `eas build`
   - Use: `npx expo run:ios` or `npx expo run:android`

2. **📤 Expo Share** (`lib/shareUtils.ts`, `components/ui/ShareButton.tsx`)
   - ✅ Implemented with `expo-share`
   - ❌ **Limited functionality in Expo Go**
   - ✅ Full functionality in development/production builds
   - Works fully when built with EAS or local builds

### Testing Production Features

To test notifications and share functionality:

```bash
# 1. Create development build
npx expo run:ios
# or
npx expo run:android

# 2. For production builds
eas build --platform ios --profile development
# or use EAS Build for distribution
```

### Current Feature Status

**✅ Complete & Working (Expo Go):**
- User authentication (signup/login/logout)
- Quote browsing by categories
- Favorite quotes management
- User profile management
- Search functionality
- Daily quotes feature
- All database operations
- Basic app navigation
- Theme switching (light/dark)

**✅ Implemented but Expo Go Limited:**
- Push notifications setup (`lib/notifications.ts`)
- Native share functionality (`ShareButton.tsx`)
- Background tasks (requires build)

## Screens Navigation

### Tab Navigation (`app/(tabs)/`)
1. **Home** (`home.tsx`) - Browse quotes by category
2. **Daily** (`daily.tsx`) - Today's featured quote
3. **Favorites** (`favorites.tsx`) - Saved quotes
4. **Profile** (`profile.tsx`) - User account & settings

### Authentication Flow (`app/(auth)/`)
1. **Login** (`login.tsx`) - Existing user login
2. **Signup** (`signup.tsx`) - New user registration
3. **Forgot Password** (`forgot-password.tsx`) - Password reset

## Building for Production

### Option 1: Development Builds (Recommended for Testing)

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

### Option 2: EAS Build (Production)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for platforms
eas build --platform ios
eas build --platform android
```

### Option 3: Custom Development Client

```bash
# Create development client with custom native code
npx expo prebuild

# Run with custom native modules
npx expo run:ios
```

## API Reference

### Supabase Tables
- `auth.users` - Authentication users (managed by Supabase)
- `categories` - Quote categories with icons (public)
- `quotes` - Main quotes storage (public)
- `favorites` - User saved quotes (protected by RLS)

### Utility Functions (`lib/` directory)
- `categories.ts` - Fetch and manage categories
- `quotes.ts` - Quote CRUD operations
- `favorites.ts` - Favorite management
- `notifications.ts` - Push notification setup
- `shareUtils.ts` - Share functionality helpers

## Troubleshooting

### Common Issues:

1. **Supabase Connection Failed:**
```bash
# Check environment variables
echo $EXPO_PUBLIC_SUPABASE_URL

# Restart Expo server
npx expo start --clear
```

2. **Authentication Errors:**
- Verify RLS policies in Supabase
- Check if user is confirmed (if email confirmation enabled)
- Verify JWT token storage

3. **Notifications/Share Not Working:**
- ❌ **Expected in Expo Go** - These features don't work in Expo Go
- ✅ Create development build: `npx expo run:ios`
- ✅ Test on physical device with development build
- ✅ Use EAS Build for full functionality

4. **TypeScript Errors:**
```bash
# Clear cache and rebuild
npx expo start --clear

# Check TypeScript
npx tsc --noEmit

# Reinstall dependencies
npm install
```

## Future Enhancements

**Planned for next versions:**
- [ ] Social login (Google, Apple, etc.)
- [ ] Offline quote storage
- [ ] Quote search with filters
- [ ] User profiles with avatars
- [ ] Quote submission system
- [ ] Advanced filtering (by author, date, popularity)
- [ ] Widget for home screen (iOS/Android)
- [ ] Audio quotes feature
- [ ] Quote collections/playlists

**Platform-Specific Plans:**
- [ ] iOS App Store deployment
- [ ] Google Play Store deployment
- [ ] App clip (iOS)
- [ ] Deep linking for shared quotes

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- Quotes from various public domain sources
- Icons from Expo Vector Icons
- Authentication powered by Supabase Auth
- Built with Expo and React Native
- UI components with NativeWind/Tailwind
- AI assistance from ChatGPT, Claude, DeepSeek, and Copilot

---

**Need Help?**
- Expo Docs: https://docs.expo.dev
- Supabase Auth Docs: https://supabase.com/docs/guides/auth
- EAS Build Docs: https://docs.expo.dev/build/introduction/
- Open an issue for bugs or feature requests

**Note for Testers:** 
Remember that notifications and share functionality require a development build (`npx expo run:ios/android`) and will not work in Expo Go. Authentication and all other features work fully in Expo Go.