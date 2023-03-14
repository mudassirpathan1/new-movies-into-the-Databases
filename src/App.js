import React, { useCallback, useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        	"https://swapi.dev/api/films/",
        
      );
      if (!response.ok) {
        throw new Error("Something went wrong...Retrying");
      }

      const data = await response.json();
      
      const transformedMovies= data.results.map((movieData) => {
        return {
          id:movieData.episode_id,
          title:movieData.title,
          openingText:movieData.opening_crawl,
          releaseDate: movieData.releaseDate,
        };
      });

      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  const deleteMovieHandler = async (id) => {
    
    const response = await fetch(
      `https://swapi.dev/api/films/${id}`,
      {
        method: 'DELETE',
      }
    );
    console.log(response);
   

  };

  let content = <p>No movies found</p>;
  if (error) {
    content = <p>{error}</p>;
  }
  if (movies.length > 0) {
    content = <p><MoviesList movies={movies} onDeleteMovie={deleteMovieHandler} /></p>;
    console.log(movies);
  }
  if (isLoading) {
    content = <p>Loading...</p>;
  }

  const addMovieHandler = async (movie) => {
    const response = await fetch(
      "https://swapi.dev/api/films/"
      ,
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Context-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data);
  };

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        { content}
      </section>
      
    </React.Fragment>
  );
}

export default App;