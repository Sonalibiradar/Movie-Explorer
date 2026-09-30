import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import MovieFilterIcon from '@mui/icons-material/MovieFilter'
import { useLocation, useNavigate } from 'react-router-dom'
import { getApiKey, setStoredApiKey } from '../api/tmdb'
import { useAuth } from '../context/AuthContext'
import { useColorMode } from '../context/ColorModeContext'

export default function Login() {
  const { login } = useAuth()
  const { mode, toggleColorMode } = useColorMode()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [apiKey, setApiKey] = useState(getApiKey())
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')
    try {
      if (apiKey.trim()) setStoredApiKey(apiKey)
      login({ username, password })
      navigate(location.state?.from || '/', { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        bgcolor: 'background.default',
      }}
    >
      <Paper sx={{ p: { xs: 3, sm: 4 }, width: '100%', maxWidth: 420 }}>
        <Stack spacing={2} component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MovieFilterIcon color="primary" fontSize="large" />
            <Typography variant="h5" sx={{ flexGrow: 1 }}>
              Movie Explorer
            </Typography>
            <IconButton onClick={toggleColorMode} aria-label="Toggle light and dark mode">
              {mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
            </IconButton>
          </Box>
          <Typography color="text.secondary">
            Sign in to search films, browse trending titles, and save favorites.
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            helperText="At least 4 characters"
          />
          <TextField
            label="TMDb API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            helperText="Required unless VITE_TMDB_API_KEY is set. Get a free key at themoviedb.org."
          />
          <Button type="submit" variant="contained" size="large">
            Sign in
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}
