# Shambhavi's Theatre - Migration Guide

## Overview

This application has been completely rebuilt from a vanilla HTML/JS application to a modern Next.js 14 application with TypeScript, featuring a premium Netflix-inspired UI with advanced animations.

## What's New

### Technology Stack
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for smooth animations
- **GSAP** for advanced scroll animations
- **Lucide React** for icons

### Design Philosophy
- **Minimalist & Premium**: Swiss spa aesthetic - clean, elegant, professional
- **Cohesive Color Palette**: Black backgrounds (#0a0a0a) with subtle grays and white accents
- **Smooth Animations**: Scroll animations, micro-interactions, and transitions throughout
- **Responsive**: Fully optimized for desktop, tablet, and mobile

### Key Features

#### 1. Premium Homepage
- Netflix-style hero section with parallax scrolling
- Horizontal content rows with smooth scroll navigation
- Animated content cards with hover effects
- Automatic content loading from TMDB and AniList

#### 2. Authentication
- Minimalist login/register pages with glass morphism effects
- JWT-based authentication
- Secure password hashing with bcrypt

#### 3. Video Player
- Clean, distraction-free player interface
- Multiple server options
- Responsive video container

#### 4. Animations
- Scroll-triggered animations using Framer Motion
- GSAP-powered text animations
- Micro-interactions on all interactive elements
- Smooth page transitions

## Project Structure

```
/src
  /app
    /api              # API routes (Next.js API)
      /auth
        /login        # Login endpoint
        /register     # Register endpoint
      /search
        /movies       # Search movies (TMDB)
        /series       # Search TV series (TMDB)
        /anime        # Search anime (AniList)
      /watched        # Watch progress tracking
      /seasons        # TV show seasons
      /episodes       # TV show episodes
    /login           # Login page
    /register        # Register page
    /watch           # Video player page
    layout.tsx       # Root layout
    page.tsx         # Homepage
    globals.css      # Global styles

  /components        # React components
    Header.tsx       # Navigation header
    Hero.tsx         # Hero section with parallax
    ContentRow.tsx   # Horizontal content rows
    ContentCard.tsx  # Individual content cards

  /lib
    db.ts           # Database connection
    auth.ts         # Authentication helpers
    utils.ts        # Utility functions

  /types
    index.ts        # TypeScript type definitions
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://user:password@host:port/database
TMDB_API_KEY=your_tmdb_api_key_here
JWT_SECRET=your_secure_random_secret_here
```

### 3. Database Setup

The application expects the following PostgreSQL tables:

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Watched items tracking
CREATE TABLE watched (
  user_id INTEGER REFERENCES users(id),
  item_type VARCHAR(50) NOT NULL,
  item_id VARCHAR(50) NOT NULL,
  season_number INTEGER DEFAULT 0,
  episode_number INTEGER DEFAULT 0,
  state VARCHAR(20) NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, item_type, item_id, season_number, episode_number)
);
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
npm start
```

## Design System

### Color Palette

```css
background: #0a0a0a      /* Deep black */
surface: #141414         /* Card backgrounds */
surface-light: #1a1a1a   /* Hover states */
accent: #e8e8e8          /* Body text */
accent-muted: #808080    /* Muted text */
primary: #ffffff         /* Headings, CTAs */
border: #2a2a2a          /* Borders */
```

### Typography
- **Font**: Inter (system fallback)
- **Weights**: 300 (light) for headings, 400-500 for body
- **Scale**: Responsive text sizing with Tailwind utilities

### Spacing
- Consistent padding using Tailwind's spacing scale
- Content containers: max-width 1920px
- Section padding: 48-96px vertical

## Migration from Old Structure

### Old Files (No Longer Needed)
- `index.html`, `login.html`, `register.html`, etc.
- `main.js`, `sw.js` (Service Worker)
- `/api/*.js` files (moved to `/src/app/api/*/route.ts`)
- `/lib/db.js` (moved to `/src/lib/db.ts`)

### Preserved
- `/icons` directory (PWA icons)
- Environment variables structure
- Database schema
- API endpoint logic

## Customization

### Changing Colors
Edit `/tailwind.config.ts`:
```typescript
colors: {
  background: '#0a0a0a',
  surface: '#141414',
  // ... modify as needed
}
```

### Adjusting Animations
Components use Framer Motion. Modify animation properties in:
- `/src/components/Hero.tsx`
- `/src/components/ContentCard.tsx`
- Individual page files

### Adding New Content Sources
Create new API routes in `/src/app/api/` following the existing pattern.

## Performance Optimizations

1. **Image Optimization**: Next.js Image component with automatic optimization
2. **Code Splitting**: Automatic with Next.js App Router
3. **Lazy Loading**: Content cards load as they enter viewport
4. **Caching**: API responses cached where appropriate

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Minimum: ES2020 support required

## Troubleshooting

### "Module not found" errors
Run `npm install` to ensure all dependencies are installed.

### Database connection issues
Verify `DATABASE_URL` in `.env` is correct and database is accessible.

### TMDB API errors
Check that `TMDB_API_KEY` is valid and has necessary permissions.

### Animation performance issues
Reduce animation complexity in low-power mode or older devices.

## Credits

Built with modern web technologies for a premium streaming experience.
