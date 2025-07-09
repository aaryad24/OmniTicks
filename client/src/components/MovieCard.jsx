import React from "react";
import { useNavigate } from "react-router-dom";
import { StarIcon, ArrowRight } from "lucide-react";
import timeFormat from "../lib/timeFormat";
import { useAppContext } from "../context/AppContext";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { image_base_url } = useAppContext();

  return (
    <div 
      className="group bg-gray-800/50 hover:bg-gray-800/70 backdrop-blur-md rounded-xl p-6 border border-gray-700 hover:border-cyan-400 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-cyan-500/20"
      onClick={() => {
        navigate(`/movies/${movie._id}`);
        scrollTo(0, 0);
      }}
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Movie Poster with Gradient Overlay */}
        <div className="relative flex-shrink-0 w-full md:w-48 h-64 md:h-48 rounded-lg overflow-hidden">
          <img 
            src={image_base_url + movie.backdrop_path}
            alt={movie.title || "No poster available"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-500/90 text-xs font-medium text-white">
              {movie.genres?.[0]?.name || "Movie"}
            </span>
          </div>
        </div>

        {/* Movie Details */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              {movie.title || "No title available"}
            </h3>
            <p className="flex items-center gap-1 text-sm bg-gray-700/80 px-2 py-1 rounded-full">
              <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-medium">{movie.vote_average?.toFixed(1) || "N/A"}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(movie.release_date).getFullYear()}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {timeFormat(movie.runtime)}
            </span>
          </div>

          <p className="text-gray-300 line-clamp-3 mb-6 text-sm leading-relaxed">
            {movie.overview || "No description available."}
          </p>

          <div className="flex items-center justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/movies/${movie._id}`);
                scrollTo(0, 0);
              }}
              className="group flex items-center gap-2 px-5 py-2.5 text-sm bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-full font-medium transition-all duration-300"
            >
              Buy Tickets
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                // Add to watchlist functionality can be added here
              }}
              className="p-2 rounded-full bg-gray-700 hover:bg-cyan-500/10 border border-gray-600 hover:border-cyan-400 transition-all"
              aria-label="Add to watchlist"
            >
              <svg className="w-5 h-5 text-gray-400 hover:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;