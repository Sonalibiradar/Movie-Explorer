import { Typography } from '@mui/material'
import Layout from '../components/Layout'
import MovieFilters from '../components/MovieFilters'
import MovieGrid from '../components/MovieGrid'
import SearchBar from '../components/SearchBar'
import { useMovies } from '../context/MovieContext'

export default function Home() {
  const { displayedMovies, mode, query } = useMovies()

  const heading =
    mode === 'search' || query
      ? `Results for “${query}”`
      : mode === 'discover'
        ? 'Filtered movies'
        : 'Trending this week'

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Discover your favorite films
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Search TMDb, filter by genre, year, or rating, and open a title for cast and trailers.
      </Typography>
      <SearchBar />
      <MovieFilters />
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        {heading}
      </Typography>
      <MovieGrid
        movies={displayedMovies}
        emptyMessage={query ? 'No movies matched that search and filter.' : 'No trending movies right now.'}
      />
    </Layout>
  )
}
