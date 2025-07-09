import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Star, Ticket, ArrowRight } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import Loading from "../components/Loading";
import AnimatedBackground from "../components/AnimatedBackground";
import { fetchUpcomingMovies, fetchGenres } from "../services/tmdb";

const UpcomingMovies = () => {
  const { axios } = useAppContext();
  const [allMovies, setAllMovies] = useState([]); // Store all movies
  const [filteredMovies, setFilteredMovies] = useState([]); // Store filtered movies
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      // Fetch both movies and genres in parallel
      const [movies, genres] = await Promise.all([
        fetchUpcomingMovies(),
        fetchGenres(),
      ]);

      // Map genre IDs to names
      const moviesWithGenres = movies.map((movie) => ({
        ...movie,
        genres: movie.genre_ids
          .map((id) => genres.find((g) => g.id === id)?.name || "Unknown")
          .slice(0, 3), // Show max 3 genres
        genreNames: movie.genre_ids
          .map((id) => genres.find((g) => g.id === id)?.name || "Unknown")
          .map(name => name.toLowerCase()) // For case-insensitive filtering
      }));

      setAllMovies(moviesWithGenres);
      setFilteredMovies(moviesWithGenres); // Initially show all movies
      setLoading(false);
    };

    loadData();
  }, []);

  // Filter movies when selectedFilter changes
  useEffect(() => {
    if (selectedFilter === "all") {
      setFilteredMovies(allMovies);
    } else {
      const filtered = allMovies.filter(movie => 
        movie.genreNames.includes(selectedFilter.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  }, [selectedFilter, allMovies]);


  const formatReleaseDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const daysUntilRelease = (dateString) => {
    const releaseDate = new Date(dateString);
    const today = new Date();
    const diffTime = releaseDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="relative min-h-screen pt-32 pb-20 px-6 md:px-12 lg:px-24">
      {/* Background elements */}
      <AnimatedBackground />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl py-3 font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
            Coming Soon to Theaters
          </h1>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Get ready for the most anticipated films of the year. Mark your
            calendars and be the first to experience these cinematic events.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {["all", "action", "drama", "comedy", "horror", "animation"].map(
            (filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-5 py-2 rounded-full capitalize font-medium transition-all ${
                  selectedFilter === filter
                    ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/70"
                }`}
              >
                {filter}
              </button>
            )
          )}
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="bg-gray-800/50 backdrop-blur-md rounded-xl overflow-hidden border border-gray-700 hover:border-cyan-400 transition-all duration-300 shadow-lg hover:shadow-cyan-500/20"
            >
              {/* Movie Poster with Countdown */}
              <div className="relative">
                <div className="h-64 bg-gradient-to-br from-purple-900/30 to-cyan-900/30 flex items-center justify-center">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = "/placeholder-movie.jpg"; // Fallback image
                      }}
                    />
                  
                </div>

                {/* Release Countdown */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-cyan-300">
                      {daysUntilRelease(movie.release_date)} days until release
                    </span>
                    <div className="bg-amber-500/90 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      {movie.vote_average.toFixed(1)}
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full"
                      style={{
                        width: `${
                          100 -
                          (daysUntilRelease(movie.release_date) / 90) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Movie Details */}
              <div className="p-6">
                <div className="flex flex-wrap gap-3 mb-4">
                      <h3 className="text-xl font-bold">{movie.title}</h3>
                  {movie.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs bg-gray-700/70 rounded-full text-cyan-300"
                    >
                      {genre}
                    </span>
                  ))}
                </div>

                <div className="flex items-center text-sm text-gray-400 mb-4">
                  <span className="flex items-center mr-4">
                    <Clock className="w-4 h-4 mr-1 text-purple-400" />
                    {movie.runtime} mins
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-cyan-400" />
                    {formatReleaseDate(movie.release_date)}
                  </span>
                </div>

                <p className="text-gray-300 mb-6 line-clamp-3">
                  {movie.overview}
                </p>

                <div className="flex justify-between items-center">
                  <Link
                    to={`/movies/${movie.id}`}
                    className="group flex items-center gap-2 px-5 py-2.5 text-sm bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-full font-medium transition-all duration-300"
                  >
                    Remind Me
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <div className="flex items-center text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400 mr-1" />
                    <span className="font-medium">
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl text-gray-300 mb-2">
                No movies found in this category
              </h3>
              <p className="text-gray-500">
                Try selecting a different filter or check back later for new releases
              </p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-300 mb-6">
            Never Miss a Release
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Sign up for our newsletter and get exclusive updates, early ticket
            access, and special promotions for upcoming movies.
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-5 py-3 bg-gray-800/50 border border-gray-700 rounded-full focus:border-cyan-500 focus:outline-none text-white"
            />
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 rounded-full font-medium text-white shadow-lg hover:shadow-purple-500/30 transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingMovies;
