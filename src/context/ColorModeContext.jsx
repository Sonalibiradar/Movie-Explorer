import { createContext, useContext, useMemo, useState } from 'react'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'

const STORAGE_KEY = 'movie_explorer_theme'
const ColorModeContext = createContext(null)

function readMode() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ColorModeProvider({ children }) {
  const [mode, setMode] = useState(readMode)

  const toggleColorMode = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: mode === 'dark' ? '#90caf9' : '#1565c0' },
          secondary: { main: '#f4c430' },
          background: {
            default: mode === 'dark' ? '#0e1116' : '#f4f6fb',
            paper: mode === 'dark' ? '#171b22' : '#ffffff',
          },
        },
        shape: { borderRadius: 12 },
        typography: {
          fontFamily: '"Segoe UI", system-ui, Roboto, sans-serif',
          h4: { fontWeight: 700 },
          h5: { fontWeight: 700 },
          h6: { fontWeight: 600 },
        },
      }),
    [mode],
  )

  const value = useMemo(() => ({ mode, toggleColorMode }), [mode])

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export function useColorMode() {
  const ctx = useContext(ColorModeContext)
  if (!ctx) throw new Error('useColorMode must be used inside ColorModeProvider')
  return ctx
}
