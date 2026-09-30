import { useEffect, useState } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Rating,
  Stack,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { useNavigate, useParams } from 'react-router-dom'
import { posterUrl, profileUrl, tmdb, youtubeTrailer, youtubeWatchUrl } from '../api/tmdb'
import Layout from '../components/Layout'
import { useMovies } from '../context/MovieContext'

export default function MovieDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useMovies()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    tmdb
      .movie(id)
      .then((data) => {
        if (!cancelled) setMovie(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Layout>
    )
  }

  if (error || !movie) {
    return (
      <Layout>
        <Alert severity="error">{error || 'Movie details are unavailable.'}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Back
        </Button>
      </Layout>
    )
  }

  const year = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A'
  const trailer = youtubeTrailer(movie.videos)
  const trailerLink = youtubeWatchUrl(movie.videos)
  const cast = (movie.credits?.cast || []).slice(0, 8)
  const saved = isFavorite(movie.id)

  return (
    <Layout>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Box
          component="img"
          src={posterUrl(movie.poster_path) || '/no-poster.svg'}
          alt={movie.title}
          sx={{ width: { xs: '100%', md: 320 }, borderRadius: 2, objectFit: 'cover' }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4">
            {movie.title} ({year})
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
            <Rating readOnly precision={0.5} max={5} value={(movie.vote_average || 0) / 2} />
            <Typography>{Number(movie.vote_average || 0).toFixed(1)} / 10</Typography>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
            {(movie.genres || []).map((genre) => (
              <Chip key={genre.id} label={genre.name} />
            ))}
          </Stack>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {movie.overview || 'No overview available.'}
          </Typography>
          <Button
            variant={saved ? 'outlined' : 'contained'}
            color={saved ? 'error' : 'primary'}
            startIcon={saved ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            onClick={() => toggleFavorite(movie)}
            sx={{ mb: 2 }}
          >
            {saved ? 'Remove favorite' : 'Save favorite'}
          </Button>
          {trailerLink && (
            <Button href={trailerLink} target="_blank" rel="noreferrer" sx={{ ml: 1, mb: 2 }}>
              Open trailer
            </Button>
          )}
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Cast
          </Typography>
          <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
            {cast.length ? (
              cast.map((person) => (
                <Box key={person.id} sx={{ minWidth: 88, textAlign: 'center' }}>
                  <Avatar
                    src={profileUrl(person.profile_path) || undefined}
                    alt={person.name}
                    sx={{ width: 72, height: 72, mx: 'auto' }}
                  />
                  <Typography variant="caption" display="block">
                    {person.name}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">Cast information is not available.</Typography>
            )}
          </Stack>
        </Box>
      </Stack>
      {trailer && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Trailer
          </Typography>
          <Box
            sx={{
              position: 'relative',
              pt: '56.25%',
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: 'black',
            }}
          >
            <Box
              component="iframe"
              src={trailer}
              title={`${movie.title} trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
            />
          </Box>
        </Box>
      )}
    </Layout>
  )
}
