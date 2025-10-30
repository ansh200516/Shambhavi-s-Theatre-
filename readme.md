# Shambhavi's Theatre

A premium, minimalist streaming platform built with Next.js 14, featuring Netflix-inspired UI with advanced animations and smooth interactions.

## Overview

Shambhavi's Theatre is a complete rebuild of the original "Let's Watch" application, transformed into a modern, production-ready streaming platform with a focus on premium aesthetics, smooth animations, and professional design.

## Features

### Premium Design
- **Minimalist Aesthetic**: Swiss spa-inspired design - clean, elegant, and professional
- **Cohesive Color Palette**: Deep blacks with subtle grays and white accents
- **Responsive**: Fully optimized for desktop, tablet, and mobile devices
- **Glass Morphism**: Subtle backdrop blur effects for modern UI elements

### Advanced Animations
- **Scroll Animations**: Parallax effects and scroll-triggered animations using Framer Motion
- **Micro-interactions**: Smooth hover effects, scale animations, and transitions
- **Text Animations**: GSAP-powered text reveals and stagger animations
- **Page Transitions**: Smooth navigation between pages

### Content Features
- **Multi-Source Search**: Search across movies (TMDB), TV series (TMDB), and anime (AniList)
- **Watch Progress Tracking**: Track what you're watching with state persistence
- **Multiple Servers**: Switch between different streaming servers
- **Continue Watching**: Resume where you left off
- **User Authentication**: Secure JWT-based authentication with bcrypt

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion + GSAP
- **Icons**: Lucide React
- **Database**: PostgreSQL
- **Authentication**: JWT + bcrypt
- **APIs**: TMDB, AniList GraphQL

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- TMDB API key (get one at [themoviedb.org](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd letswatch
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://user:password@host:port/database
   TMDB_API_KEY=your_tmdb_api_key_here
   JWT_SECRET=your_secure_random_secret_here
   ```

4. **Set up the database**

   Run the following SQL to create necessary tables:
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

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
/src
  /app
    /api              # API routes
      /auth           # Authentication endpoints
      /search         # Search endpoints (movies, series, anime)
      /watched        # Watch progress tracking
      /seasons        # TV show seasons
      /episodes       # TV show episodes
    /login           # Login page
    /register        # Register page
    /watch           # Video player page
    layout.tsx       # Root layout with metadata
    page.tsx         # Homepage with hero and content rows
    globals.css      # Global styles and Tailwind directives

  /components        # Reusable React components
    Header.tsx       # Navigation header with scroll effects
    Hero.tsx         # Hero section with parallax
    ContentRow.tsx   # Horizontal scrolling content rows
    ContentCard.tsx  # Individual content cards with animations

  /lib
    db.ts           # PostgreSQL connection pool
    auth.ts         # JWT authentication helpers
    utils.ts        # Utility functions (cn, image URLs, etc.)

  /types
    index.ts        # TypeScript type definitions
```

## Design System

### Color Palette

```css
background: #0a0a0a      /* Deep black background */
surface: #141414         /* Card backgrounds */
surface-light: #1a1a1a   /* Hover states */
accent: #e8e8e8          /* Body text */
accent-muted: #808080    /* Muted/secondary text */
primary: #ffffff         /* Headings, CTAs */
border: #2a2a2a          /* Subtle borders */
```

### Typography

- **Font Family**: Inter (with system fallbacks)
- **Weights**:
  - 300 (light) for headings and titles
  - 400-500 (regular/medium) for body text
- **Responsive Sizing**: Tailwind's responsive text utilities

### Spacing

- **Content Width**: Max 1920px
- **Container Padding**: 16-64px (responsive)
- **Section Spacing**: 48-96px vertical

## API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Search
- `GET /api/search/movies?q={query}&page={page}` - Search movies
- `GET /api/search/series?q={query}&page={page}` - Search TV series
- `GET /api/search/anime?q={query}` - Search anime

### Content
- `GET /api/seasons?id={tmdb_id}` - Get TV show seasons
- `GET /api/episodes?id={tmdb_id}&season={num}` - Get season episodes

### Watch Progress
- `GET /api/watched?continue=1` - Get continue watching lists
- `GET /api/watched?items=[...]` - Get watched states for items
- `POST /api/watched` - Update watched state

## Customization

### Changing Colors

Edit `tailwind.config.ts`:
```typescript
theme: {
  extend: {
    colors: {
      background: '#0a0a0a',
      surface: '#141414',
      // ... modify as needed
    }
  }
}
```

### Adjusting Animations

Modify animation properties in component files:
- Hero parallax: `/src/components/Hero.tsx`
- Card hover effects: `/src/components/ContentCard.tsx`
- Scroll effects: `/src/components/Header.tsx`

## Build & Deploy

### Production Build

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Performance

- **Lighthouse Score**: Optimized for 90+ across all metrics
- **Image Optimization**: Automatic with Next.js Image component
- **Code Splitting**: Automatic with App Router
- **Lazy Loading**: Content loads as it enters viewport

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- iOS Safari
- Chrome Mobile

## Security

- JWT tokens with 7-day expiration
- bcrypt password hashing with salt rounds
- SQL injection protection via parameterized queries
- Environment variable protection
- HTTPS recommended for production

## Migration Notes

This is a complete rewrite from vanilla HTML/JS to Next.js 14. See `MIGRATION_GUIDE.md` for detailed migration information.

## Acknowledgments

- **TMDB** for movie and TV show data
- **AniList** for anime data
- **Framer Motion** for amazing animation capabilities
- **Vercel** for Next.js and deployment platform

---

**Shambhavi's Theatre** - Where premium meets entertainment.
