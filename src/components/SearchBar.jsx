import { useState } from 'react'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { useMovies } from '../context/MovieContext'

export default function SearchBar() {
  const { query, runSearch } = useMovies()
  const [value, setValue] = useState(query)

  const submit = (event) => {
    event.preventDefault()
    runSearch(value)
  }

  return (
    <form onSubmit={submit}>
      <TextField
        fullWidth
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search movies by name"
        aria-label="Search movies"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="Clear search"
                onClick={() => {
                  setValue('')
                  runSearch('')
                }}
              >
                <CloseIcon />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
    </form>
  )
}
