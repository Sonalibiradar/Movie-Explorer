import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Rating,
  Typography,
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { useNavigate } from 'react-router-dom'
import { posterUrl } from '../api/tmdb'
import { useMovies } from '../context/MovieContext'

export default function MovieCard({ movie }) {
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useMovies()
  const year = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A'
  const saved = isFavorite(movie.id)

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <IconButton
        aria-label={saved ? 'Remove from favorites' : 'Save to favorites'}
        onClick={(event) => {
          event.stopPropagation()
          toggleFavorite(movie)
        }}
        sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, bgcolor: 'background.paper' }}
      >
        {saved ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
      </IconButton>
      <CardActionArea onClick={() => navigate(`/movie/${movie.id}`)} sx={{ flexGrow: 1 }}>
        <CardMedia
          component="img"
          image={posterUrl(movie.poster_path) || '/no-poster.svg'}
          alt={movie.title}
          sx={{ aspectRatio: '2 / 3', objectFit: 'cover', bgcolor: 'action.hover' }}
        />
        <CardContent>
          <Typography variant="subtitle1" noWrap title={movie.title}>
            {movie.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {year}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <Rating
              readOnly
              precision={0.5}
              max={5}
              value={(movie.vote_average || 0) / 2}
              size="small"
            />
            <Typography variant="caption">{Number(movie.vote_average || 0).toFixed(1)}</Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
