import { Button, MenuItem, Stack, TextField } from '@mui/material'
import { useMovies } from '../context/MovieContext'

const YEARS = Array.from({ length: 30 }, (_, i) => String(new Date().getFullYear() - i))
const RATINGS = ['', '5', '6', '7', '8', '9']

export default function MovieFilters() {
  const { filters, genres, applyFilters } = useMovies()

  const update = (field) => (event) => {
    applyFilters({ ...filters, [field]: event.target.value })
  }

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
      <TextField select label="Genre" value={filters.genre} onChange={update('genre')} fullWidth>
        <MenuItem value="">All genres</MenuItem>
        {genres.map((genre) => (
          <MenuItem key={genre.id} value={String(genre.id)}>
            {genre.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField select label="Year" value={filters.year} onChange={update('year')} fullWidth>
        <MenuItem value="">All years</MenuItem>
        {YEARS.map((year) => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Min rating"
        value={filters.minRating}
        onChange={update('minRating')}
        fullWidth
      >
        <MenuItem value="">Any rating</MenuItem>
        {RATINGS.filter(Boolean).map((rating) => (
          <MenuItem key={rating} value={rating}>
            {rating}+
          </MenuItem>
        ))}
      </TextField>
      <Button
        variant="outlined"
        onClick={() => applyFilters({ genre: '', year: '', minRating: '' })}
        sx={{ minWidth: { sm: 120 } }}
      >
        Reset
      </Button>
    </Stack>
  )
}
