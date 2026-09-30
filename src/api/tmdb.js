import axios from 'axios'

const BASE_URL = 'https://api.themoviedb.org/3'
export const IMAGE_BASE = 'https://image.tmdb.org/t/p'

const API_KEY_STORAGE = 'tmdb_api_key'

/** Resolve the TMDb key from Vite env first, then localStorage (login form). */
export function getApiKey() {
  return (
    import.meta.env.VITE_TMDB_API_KEY ||
    localStorage.getItem(API_KEY_STORAGE) ||
    ''
  )
}

export function setStoredApiKey(key) {
  if (key) {
    localStorage.setItem(API_KEY_STORAGE, key.trim())
  } else {
    localStorage.removeItem(API_KEY_STORAGE)
  }
}

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
})

client.interceptors.request.use((config) => {
  const apiKey = getApiKey()
  config.params = { ...(config.params || {}), api_key: apiKey }
  return config
})

function friendlyError(error) {
  if (!getApiKey()) {
    return 'Add a TMDb API key on the login screen or in a .env file (VITE_TMDB_API_KEY).'
  }
  if (error.response?.status === 401) {
    return 'TMDb rejected the API key. Check VITE_TMDB_API_KEY or the key you entered at login.'
  }
  if (error.response?.status === 404) {
    return 'That movie could not be found.'
  }
  if (error.code === 'ECONNABORTED' || !error.response) {
    return 'Network problem. Check your connection and try again.'
  }
  return error.response?.data?.status_message || 'Something went wrong while talking to TMDb.'
}

async function request(promise) {
  try {
    const { data } = await promise
    return data
  } catch (error) {
    throw new Error(friendlyError(error))
  }
}

export function posterUrl(path, size = 'w500') {
  if (!path) return null
  return `${IMAGE_BASE}/${size}${path}`
}

export function profileUrl(path, size = 'w185') {
  if (!path) return null
  return `${IMAGE_BASE}/${size}${path}`
}

export const tmdb = {
  trending: (page = 1) =>
    request(client.get('/trending/movie/week', { params: { page } })),

  search: (query, page = 1) =>
    request(
      client.get('/search/movie', {
        params: { query, page, include_adult: false },
      }),
    ),

  discover: ({ page = 1, genre, year, minRating } = {}) =>
    request(
      client.get('/discover/movie', {
        params: {
          page,
          sort_by: 'popularity.desc',
          include_adult: false,
          with_genres: genre || undefined,
          primary_release_year: year || undefined,
          'vote_average.gte': minRating || undefined,
        },
      }),
    ),

  movie: (id) =>
    request(
      client.get(`/movie/${id}`, {
        params: { append_to_response: 'credits,videos' },
      }),
    ),

  genres: () => request(client.get('/genre/movie/list')),
}

export function youtubeTrailer(videos) {
  const list = videos?.results || []
  const trailer =
    list.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
    list.find((v) => v.site === 'YouTube')
  return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null
}

export function youtubeWatchUrl(videos) {
  const list = videos?.results || []
  const trailer =
    list.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
    list.find((v) => v.site === 'YouTube')
  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null
}
