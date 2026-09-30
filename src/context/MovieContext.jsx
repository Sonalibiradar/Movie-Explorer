import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { tmdb } from '../api/tmdb'

const LAST_SEARCH_KEY = 'movie_explorer_last_search'
const FAVORITES_KEY = 'movie_explorer_favorites'
const MovieContext = createContext(null)

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const emptyFilters = { genre: '', year: '', minRating: '' }

export function MovieProvider({ children }) {
  const [trending, setTrending] = useState([])
  const [results, setResults] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [query, setQuery] = useState(() => localStorage.getItem(LAST_SEARCH_KEY) || '')
  const [filters, setFilters] = useState(emptyFilters)
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState('trending') // trending | search | discover
  const [favorites, setFavorites] = useState(() => readJson(FAVORITES_KEY, []))

  const persistFavorites = (next) => {
    setFavorites(next)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
  }

  const isFavorite = useCallback(
    (id) => favorites.some((movie) => movie.id === id),
    [favorites],
  )

  const toggleFavorite = useCallback(
    (movie) => {
      persistFavorites(
        isFavorite(movie.id)
          ? favorites.filter((item) => item.id !== movie.id)
          : [
              ...favorites,
              {
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                release_date: movie.release_date,
                vote_average: movie.vote_average,
              },
            ],
      )
    },
    [favorites, isFavorite],
  )

  const rememberSearch = (value) => {
    setQuery(value)
    if (value) localStorage.setItem(LAST_SEARCH_KEY, value)
    else localStorage.removeItem(LAST_SEARCH_KEY)
  }

  const loadGenres = useCallback(async () => {
    try {
      const data = await tmdb.genres()
      setGenres(data.genres || [])
    } catch {
      // Genres are optional chrome; the main movie fetch reports errors.
    }
  }, [])

  const loadTrending = useCallback(async () => {
    setLoading(true)
    setError('')
    setMode('trending')
    try {
      const data = await tmdb.trending(1)
      setTrending(data.results || [])
      setResults([])
      setPage(1)
      setTotalPages(1)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const runSearch = useCallback(async (term) => {
    const trimmed = term.trim()
    rememberSearch(trimmed)
    if (!trimmed) {
      await loadTrending()
      return
    }
    setLoading(true)
    setError('')
    setMode('search')
    try {
      const data = await tmdb.search(trimmed, 1)
      setResults(data.results || [])
      setPage(1)
      setTotalPages(data.total_pages || 1)
    } catch (err) {
      setError(err.message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [loadTrending])

  const runDiscover = useCallback(async (nextFilters) => {
    setLoading(true)
    setError('')
    setMode('discover')
    rememberSearch('')
    try {
      const data = await tmdb.discover({ page: 1, ...nextFilters })
      setResults(data.results || [])
      setPage(1)
      setTotalPages(data.total_pages || 1)
    } catch (err) {
      setError(err.message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const applyFilters = useCallback(
    async (nextFilters) => {
      setFilters(nextFilters)
      const active = nextFilters.genre || nextFilters.year || nextFilters.minRating
      if (query.trim()) {
        await runSearch(query)
        return
      }
      if (active) {
        await runDiscover(nextFilters)
      } else {
        await loadTrending()
      }
    },
    [query, runSearch, runDiscover, loadTrending],
  )

  const loadMore = useCallback(async () => {
    if (page >= totalPages || mode === 'trending') return
    setLoadingMore(true)
    setError('')
    try {
      const nextPage = page + 1
      const data =
        mode === 'search'
          ? await tmdb.search(query, nextPage)
          : await tmdb.discover({ page: nextPage, ...filters })
      setResults((prev) => [...prev, ...(data.results || [])])
      setPage(nextPage)
      setTotalPages(data.total_pages || nextPage)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingMore(false)
    }
  }, [page, totalPages, mode, query, filters])

  useEffect(() => {
    loadGenres()
    const lastSearch = localStorage.getItem(LAST_SEARCH_KEY)
    if (lastSearch) {
      runSearch(lastSearch)
    } else {
      loadTrending()
    }
  }, [loadGenres, loadTrending, runSearch])

  const displayedMovies = useMemo(() => {
    const source = mode === 'trending' ? trending : results
    if (!query.trim()) return source
    return source.filter((movie) => {
      const year = movie.release_date ? movie.release_date.slice(0, 4) : ''
      const genreOk =
        !filters.genre || (movie.genre_ids || []).map(String).includes(String(filters.genre))
      const yearOk = !filters.year || year === String(filters.year)
      const ratingOk = !filters.minRating || (movie.vote_average || 0) >= Number(filters.minRating)
      return genreOk && yearOk && ratingOk
    })
  }, [mode, trending, results, query, filters])

  const value = useMemo(
    () => ({
      trending,
      results,
      displayedMovies,
      page,
      totalPages,
      query,
      filters,
      genres,
      loading,
      loadingMore,
      error,
      mode,
      favorites,
      isFavorite,
      toggleFavorite,
      loadTrending,
      runSearch,
      applyFilters,
      loadMore,
      setError,
    }),
    [
      trending,
      results,
      displayedMovies,
      page,
      totalPages,
      query,
      filters,
      genres,
      loading,
      loadingMore,
      error,
      mode,
      favorites,
      isFavorite,
      toggleFavorite,
      loadTrending,
      runSearch,
      applyFilters,
      loadMore,
    ],
  )

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
}

export function useMovies() {
  const ctx = useContext(MovieContext)
  if (!ctx) throw new Error('useMovies must be used inside MovieProvider')
  return ctx
}
