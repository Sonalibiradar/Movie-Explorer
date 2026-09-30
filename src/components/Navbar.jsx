import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import LogoutIcon from '@mui/icons-material/Logout'
import MovieFilterIcon from '@mui/icons-material/MovieFilter'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useColorMode } from '../context/ColorModeContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { mode, toggleColorMode } = useColorMode()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar sx={{ gap: 1 }}>
        <MovieFilterIcon color="primary" />
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            color: 'text.primary',
            textDecoration: 'none',
            mr: { sm: 2 },
            whiteSpace: 'nowrap',
          }}
        >
          Movie Explorer
        </Typography>
        <Button component={RouterLink} to="/" color="inherit" sx={{ minWidth: 'auto' }}>
          Home
        </Button>
        <Button
          component={RouterLink}
          to="/favorites"
          color="inherit"
          startIcon={<FavoriteBorderIcon />}
          sx={{ minWidth: 'auto' }}
        >
          Favorites
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        {user && (
          <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
            Hi, {user.username}
          </Typography>
        )}
        <IconButton onClick={toggleColorMode} aria-label="Toggle light and dark mode">
          {mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
        </IconButton>
        <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout} sx={{ minWidth: 'auto' }}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  )
}
