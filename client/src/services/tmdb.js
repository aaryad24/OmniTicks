// services/tmdb.js
const API_KEY = '568a6b3f8c326a145e2f84ab4ac3ea66'

const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchTrendingTrailers = async () => {
  try {
    // 1. Fetch trending movies
    const trendingResponse = await fetch(
      `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
    );
    const trendingData = await trendingResponse.json();

    // 2. Process only movies that have both poster and backdrop images
    const validMovies = trendingData.results.filter(movie => 
      movie.poster_path && movie.backdrop_path
    ).slice(0, 4); // Limit to 4 movies

    // 3. Fetch trailers for valid movies
    const trailers = await Promise.all(
      validMovies.map(async (movie) => {
        const videosResponse = await fetch(
          `${BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}`
        );
        const videosData = await videosResponse.json();

        // Find the first official YouTube trailer
        const trailer = videosData.results.find(
          (video) => video.type === 'Trailer' && video.site === 'YouTube'
        );

        return trailer ? {
          id: movie.id,
          title: movie.title,
          overview: movie.overview,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          videoUrl: `https://www.youtube.com/watch?v=${trailer.key}`,
          vote_average: movie.vote_average, // Add rating
          release_date: movie.release_date, // Add release date
          vote_count: movie.vote_count // For rating credibility
        } : null;
      })
    );

    // 4. Return only valid trailers with all required data
    return trailers.filter(trailer => 
      trailer && 
      trailer.poster_path && 
      trailer.backdrop_path && 
      trailer.videoUrl
    );
  } catch (error) {
    console.error('Error fetching trailers:', error);
    return [];
  }
};

export const fetchUpcomingMovies = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1®ion=US`
    );
    const data = await response.json();
    
    return data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      overview: movie.overview,
      genre_ids: movie.genre_ids // We'll convert these to names later
    }));
    
  } catch (error) {
    console.error("TMDB API Error:", error);
    return [];
  }
};


let genreCache = null;

export const fetchGenres = async () => {
  if (genreCache) return genreCache;
  
  try {
    const response = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
    );
    const data = await response.json();
    genreCache = data.genres;
    return genreCache;
  } catch (error) {
    console.error("TMDB Genres Error:", error);
    return [];
  }
};