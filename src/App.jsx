import React, { useEffect, useState } from 'react'
import Search from './components/search'
import heroImg from './assets/hero-img.png';
import logo from './assets/logo.png';
import Spinner from './components/spinner';
import Moviecard from './components/moviecard';
import { useDebounce } from 'react-use'
import { getTrendingMovies, updateSearchCount } from './appwrite.js';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async(query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS)
      if(!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();

      if(data.response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return
      }

      setMovieList(data.results || []);

      if(query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }

    } catch(error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies!');
    } finally {
      setIsLoading(false)
    }
  }

  const loadTrendingMovies = async () => {
    try{
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchMovies(searchTerm);
  }, [debouncedSearchTerm])

  useEffect(() => {
    loadTrendingMovies();
  }, [])



  return (
    <main>
      <div className='pattern'>
        <img src={logo} alt="Hero Image" className='wrapper'/>
      </div>
      <div className='wrapper'>
        <header>
          <img src={heroImg} alt="Hero Image" />
          <h1>
            Bored? Find the <span className='text-gradient'>Movies</span> You'll Enjoy Below!
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
          <h1 className='text-white'>{searchTerm}</h1>
        </header>

        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2>Hot Movies Today</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>
                    {index + 1}
                  </p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className='all-movies'>
          <h2 className=''>All Available Movies</h2>
          {isLoading ? (
            <Spinner/>
          ) : errorMessage ? (
            <p className='text-red-300'>{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <Moviecard key={movie.id} movie={movie}/>
              ))}
            </ul>
          )}
        </section>
      </div>
  </main>
  )
}

export default App
