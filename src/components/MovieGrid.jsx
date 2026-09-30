import { Alert, Box, Button, CircularProgress, Grid, Typography } from '@mui/material'
import MovieCard from './MovieCard'
import { useMovies } from '../context/MovieContext'

export default function MovieGrid({
  movies,
  emptyMessage,
  hideLoadMore = false,
  useGlobalLoading = true,
  showError = true,
}) {
  const { loading, loadingMore, error, loadMore, page, totalPages, mode } = useMovies()
  const canLoadMore = !hideLoadMore && mode !== 'trending' && page < totalPages

  if (useGlobalLoading && loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      {showError && error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {!movies.length ? (
        <Typography color="text.secondary">{emptyMessage || 'No movies to show yet.'}</Typography>
      ) : (
        <Grid container spacing={2}>
          {movies.map((movie) => (
            <Grid key={movie.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <MovieCard movie={movie} />
            </Grid>
          ))}
        </Grid>
      )}
      {canLoadMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button variant="contained" onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? 'Loading…' : 'Load more'}
          </Button>
        </Box>
      )}
    </>
  )
}
