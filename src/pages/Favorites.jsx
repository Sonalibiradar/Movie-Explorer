import { Typography } from '@mui/material'
import Layout from '../components/Layout'
import MovieGrid from '../components/MovieGrid'
import { useMovies } from '../context/MovieContext'

export default function Favorites() {
  const { favorites } = useMovies()

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Your favorites
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Saved on this device with local storage.
      </Typography>
      <MovieGrid
        movies={favorites}
        emptyMessage="You have not saved any favorites yet."
        hideLoadMore
        useGlobalLoading={false}
        showError={false}
      />
    </Layout>
  )
}
