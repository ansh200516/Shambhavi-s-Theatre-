# Quick Start Guide - Shambhavi's Theatre

## What Changed?

Your application has been **completely rebuilt** from a vanilla HTML/JS app to a modern Next.js 14 application with:

- ✅ **Premium Netflix-inspired UI** with minimalist design
- ✅ **Advanced animations** using Framer Motion & GSAP
- ✅ **TypeScript** for type safety
- ✅ **Tailwind CSS** for styling
- ✅ **Responsive design** for all devices
- ✅ **New branding**: "Shambhavi's Theatre"

## Next Steps

### 1. Set Up Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://user:password@host:port/database
TMDB_API_KEY=your_tmdb_api_key_here
JWT_SECRET=your_secure_random_secret_here
```

### 2. Run the Development Server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

### 3. Build for Production

```bash
npm run build
npm start
```

## What You'll See

### Homepage
- **Hero Section**: Large hero with featured content and parallax scrolling
- **Content Rows**: Netflix-style horizontal scrolling rows for movies and series
- **Smooth Animations**: Elements fade in as you scroll

### Design Elements
- **Color Scheme**: Deep black (#0a0a0a) with subtle grays and white accents
- **Typography**: Inter font with light weights for headings
- **Animations**: Hover effects, scale transitions, and micro-interactions throughout
- **Glass Morphism**: Subtle backdrop blur effects on navigation and modals

### Pages
- `/` - Homepage with hero and content rows
- `/login` - Minimalist login page with glass effect
- `/register` - Registration page with matching design
- `/watch` - Video player with server selection

## Key Features

### 1. Search
The header includes a search button that expands a search bar when clicked.

### 2. Content Discovery
- Movies from TMDB
- TV Series from TMDB
- Anime from AniList

### 3. Watch Progress
Track what you're watching with the `/api/watched` endpoints.

### 4. Multiple Servers
Switch between different video sources in the player.

## Customization

### Change Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  background: '#0a0a0a',  // Change this
  surface: '#141414',     // And this
  // ...
}
```

### Modify Animations
- **Hero parallax**: `src/components/Hero.tsx`
- **Card animations**: `src/components/ContentCard.tsx`
- **Header effects**: `src/components/Header.tsx`

## File Structure

```
/src
  /app
    page.tsx          # Homepage
    layout.tsx        # Root layout
    /api              # API routes
    /login            # Auth pages
    /register
    /watch
  /components         # Reusable components
  /lib               # Utilities and DB
  /types             # TypeScript types
```

## Troubleshooting

### "Module not found" errors
```bash
npm install
```

### Database connection issues
Check your `DATABASE_URL` in `.env`

### TMDB API errors
Verify your `TMDB_API_KEY` is valid

## Next Steps

1. **Customize the design** to match your preferences
2. **Add more content sources** if needed
3. **Deploy to Vercel** for production use
4. **Set up your database** with the schema in README.md

## Resources

- [Full README](./README.md) - Complete documentation
- [Migration Guide](./MIGRATION_GUIDE.md) - Detailed migration info
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)

---

Enjoy your premium streaming experience! 🎬
