import { Box } from '@mui/material'
import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Box component="main" sx={{ px: { xs: 2, sm: 3 }, py: 3, maxWidth: 1280, mx: 'auto' }}>
        {children}
      </Box>
    </Box>
  )
}
