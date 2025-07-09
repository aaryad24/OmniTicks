import React from 'react'
import { useNavigate } from "react-router-dom";
import { useAppContext } from '../context/AppContext'
import { ArrowRight } from "lucide-react";
import AnimatedBackground from '../components/AnimatedBackground';

const Movies = () => {
  const { shows, image_base_url } = useAppContext();
  const navigate = useNavigate();

  return shows.length > 0 ? (
    <section className="relative py-25 px-6 md:px-12 lg:px-24 bg-gray-900 min-h-[100vh]">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
      <AnimatedBackground />
        {/* Header with timeline dot */}
        <div className="relative pl-12 pb-16">
          <div className="absolute left-0 w-4 h-4 rounded-full bg-cyan-500 transform translate-x-[-50%]"></div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
                Now Showing
              </h1>
              <p className="text-gray-300">Browse our current movie selection</p>
            </div>
            <button
              onClick={() => navigate("/theaters")}
              className="group flex items-center gap-2 px-6 py-2 rounded-full border border-cyan-400/50 hover:bg-cyan-400/10 hover:border-cyan-400/80 transition-all"
            >
              <span className="text-cyan-400 group-hover:text-white">View Theaters</span>
              <ArrowRight className="w-5 h-5 text-cyan-400 group-hover:text-white group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Movies Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 h-full w-0.5 bg-gradient-to-b from-purple-500 to-cyan-500"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pl-12">
            {shows.map((movie, index) => (
              <div 
                key={movie._id} 
                className="relative pb-12 group cursor-pointer"
                onClick={() => navigate(`/movies/${movie._id}`)}
              >
                {/* Timeline dot - only show on first column */}
                {index % 3 === 0 && (
                  <div className="absolute left-0 w-4 h-4 rounded-full bg-cyan-500 transform translate-x-[-200%] translate-y-8 group-hover:scale-150 transition-all"></div>
                )}
                
                <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700 group-hover:border-cyan-400 transition-all h-full">
                  <img 
                    src={image_base_url + movie.backdrop_path}
                    alt={movie.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-bold mb-2">{movie.title}</h3>
                  <div className="flex gap-4 text-sm text-gray-400 mb-3">
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                    <span>{movie.genres?.slice(0, 2).map(g => g.name).join(", ")}</span>
                    <span>{movie.runtime} mins</span>
                  </div>
                  <p className="text-gray-300 line-clamp-2 text-sm mb-4">{movie.overview}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/movie/${movie._id}`);
                    }}
                    className="w-full py-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 rounded-lg font-medium transition-all"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  ) : (
    <div className="min-h-screen py-20 px-6 md:px-12 lg:px-24 bg-gray-900 relative flex items-center justify-center text-center">
  {/* Background elements */}
  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20 opacity-80"></div>
  <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
  
  {/* Blur circles for visual interest */}
  <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
  <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full filter blur-3xl"></div>

  {/* Content */}
  <div className="relative z-10 max-w-2xl">
      <AnimatedBackground />
    <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-6 animate-pulse">
      No Movies Available
    </h2>
    <p className="text-lg text-gray-400 mb-8">
      We couldn't find any movies matching your criteria.
    </p>
    <button 
      onClick={() => window.location.reload()}
      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 rounded-lg font-medium text-white shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-1"
    >
      Refresh Page
    </button>
  </div>
</div>
  )
}

export default Movies