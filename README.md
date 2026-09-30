# Movie Explorer – Discover Your Favorite Films

React app for searching movies, browsing weekly trending titles, viewing details (cast, genres, trailer), and saving favorites. Data comes from the [TMDb API](https://developer.themoviedb.org/docs/getting-started).

This project uses **Vite + React** (current Create React App setup) with **Axios**, **MUI**, **React Router**, and the **Context API**.

## Features

- Login screen (username + password; session stored in `localStorage`)
- Search by movie name, with the last query remembered
- Trending movies grid (poster, title, year, rating)
- Movie details: overview, genres, cast, YouTube trailer embed
- Light / dark mode
- Favorites list stored locally
- Filters: genre, year, minimum rating
- **Load more** pagination for search and discover results
- User-friendly TMDb / network error messages

## 📸 Screenshot :
  
<img width="900" alt="Movie Explorer home page" src="https://github.com/user-attachments/assets/ee559389-5bf2-4675-b276-62251be701a8" />

## Setup

1. Install Node.js 18+.
2. Create a free API key at [themoviedb.org](https://www.themoviedb.org/settings/api).
3. Install dependencies and configure the key:

```bash
npm install
copy .env.example .env
```

Set `VITE_TMDB_API_KEY` in `.env`. You can also paste the key on the login form (stored in `localStorage`).

4. Run the app:

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

Sign in with any username and a password of at least 4 characters.

```bash
npm run build
npm run preview
```

## API usage

Axios talks to `https://api.themoviedb.org/3` with the `api_key` query parameter.

| Need | Endpoint |
| --- | --- |
| Trending | `GET /trending/movie/week` |
| Search | `GET /search/movie` |
| Filters | `GET /discover/movie` |
| Details + cast + videos | `GET /movie/{id}?append_to_response=credits,videos` |
| Genres | `GET /genre/movie/list` |
| Images | `https://image.tmdb.org/t/p/w500{poster_path}` |

## Project structure

- `src/api/tmdb.js` – Axios client and helpers
- `src/context/` – auth, theme, movie state
- `src/components/` – `Navbar`, `SearchBar`, `MovieCard`, `MovieGrid`, `MovieFilters`
- `src/pages/` – `Login`, `Home`, `MovieDetails`, `Favorites`

## Deploy

Deploy the `dist` folder from `npm run build` to Vercel or Netlify. Add `VITE_TMDB_API_KEY` in the host’s environment variables.

## 🚀 Live Demo

[View the live demo](https://movie-explorer-project-phi.vercel.app)

> To use the app, get a free API key at [themoviedb.org](https://www.themoviedb.org/settings/api) and enter it on the sign-in screen.
