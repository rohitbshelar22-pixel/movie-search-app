
import { useState } from 'react'
import './App.css'

function App() {
  const [search, setSearch] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY

  const searchMovies = async (e) => {
    e.preventDefault()

    if (!search.trim()) {
      setError('Please enter a movie name.')
      setMovies([])
      return
    }

    if (!API_KEY) {
      setError('API key is missing. Please check your .env file.')
      return
    }

    setLoading(true)
    setError('')
    setMovies([])

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(search)}`
      )

      if (!response.ok) {
        throw new Error('Unable to fetch movies. Check your API key.')
      }

      const data = await response.json()
      setMovies(data.results || [])

      if (data.results.length === 0) {
        setError('No movies found. Try another name.')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Movie<span>Finder</span></h1>
        <p>Discover movies you love.</p>
      </header>

      <form onSubmit={searchMovies} className="search-form">
        <input
          type="search"
          placeholder="Search your favourite movie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p className="message">{error}</p>}

      {loading && <p className="message">Finding movies...</p>}

      <section className="movie-grid">
        {movies.map((movie) => (
          <div className="movie-card" key={movie.id}>
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
            ) : (
              <div className="no-poster">No Poster Available</div>
            )}

            <div className="movie-info">
              <h2>{movie.title}</h2>
              <p>
                Release: {movie.release_date || 'Unknown'}
              </p>
              <p>
                Rating: {movie.vote_average?.toFixed(1) || 'N/A'} / 10
              </p>
            </div>
          </div>
        ))}
      </section>

      <footer>
        <p>MovieFinder | Built with React</p>
        <small>Movie data provided by TMDB</small>
      </footer>
    </div>
  )
}

export default App
