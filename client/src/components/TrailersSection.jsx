import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { PlayIcon, Star as StarIcon, Calendar, Clock } from "lucide-react";
import { fetchTrendingTrailers } from "../services/tmdb";

const TrailersSection = () => {
  const [trailers, setTrailers] = useState([]);
  const [currentTrailer, setCurrentTrailer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrailers = async () => {
      setLoading(true);
      const fetchedTrailers = await fetchTrendingTrailers();
      setTrailers(fetchedTrailers);
      if (fetchedTrailers.length > 0) {
        setCurrentTrailer(fetchedTrailers[0]);
      }
      setLoading(false);
    };

    loadTrailers();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gray-900 relative">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-3">
            Loading Trailers...
          </h2>
        </div>
      </section>
    );
  }

  if (trailers.length === 0) {
    return (
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gray-900 relative">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-3">
            No Trailers Available
          </h2>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 md:px-12 lg:px-24 bg-gray-900 relative">
      {/* Background overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-purple-900/20 to-cyan-900/20"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: currentTrailer 
            ? `url(https://image.tmdb.org/t/p/original${currentTrailer.backdrop_path})`
            : "url('/stranger.jpg')"
        }}
      ></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header with gradient text */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-3">
            Trending Trailers
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Watch previews of the most popular movies this week
          </p>
        </div>

        <div className="relative">
          {/* Timeline with gradient */}
          <div className="absolute left-4 h-full w-0.5 bg-gradient-to-b from-purple-500 to-cyan-500"></div>
          
          {/* Main featured trailer */}
          <div className="relative pl-12 pb-12">
            <div className="absolute left-0 w-4 h-4 rounded-full bg-cyan-500 transform translate-x-[-50%] shadow-lg shadow-cyan-400/30"></div>
            
            <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700 hover:border-cyan-400 transition-all duration-300 shadow-lg hover:shadow-cyan-500/20">
              <div className="rounded-xl overflow-hidden shadow-2xl shadow-cyan-500/20 border border-cyan-500/30 bg-black">
                <ReactPlayer
                  url={currentTrailer.videoUrl}
                  controls={true}
                  width="100%"
                  height="100%"
                  style={{ aspectRatio: "16/9" }}
                  playing={isPlaying}
                />
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  {currentTrailer.title || "Untitled"}
                </h3>

                {/* Metadata row - matching MovieCard style */}
                <div className="flex flex-wrap gap-3 text-sm text-gray-400 mt-2 mb-3">
                  <span className="flex items-center">
                    <StarIcon className="w-4 h-4 mr-1 text-amber-400 fill-amber-400" />
                    {currentTrailer.vote_average?.toFixed(1) || "N/A"}
                    <span className="text-xs ml-1 text-gray-500">
                      ({currentTrailer.vote_count?.toLocaleString() || 0})
                    </span>
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-cyan-400" />
                    {currentTrailer.release_date?.split("-")[0] || "N/A"}
                  </span>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed">
                  {currentTrailer.overview || "No description available."}
                </p>
              </div>
            </div>
          </div>

          {/* Other trailers */}
          {trailers.filter(t => t.id !== currentTrailer.id).map((trailer) => (
            <div key={trailer.id} className="relative pl-12 pb-12 group">
              <div className="absolute left-0 w-4 h-4 rounded-full bg-cyan-500 transform translate-x-[-50%] group-hover:scale-150 transition-all shadow-lg shadow-cyan-400/30"></div>
              
              <div 
                className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700 hover:border-cyan-400 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-cyan-500/20"
                onClick={() => {
                  setCurrentTrailer(trailer);
                  setIsPlaying(true);
                }}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative flex-shrink-0 w-full md:w-48 h-40 rounded-lg overflow-hidden">
                    <img
                      src={trailer.poster_path ? `https://image.tmdb.org/t/p/w500${trailer.poster_path}` : "/placeholder.jpg"}
                      alt={trailer.title || "Untitled"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    
                    {/* Floating play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-cyan-500/90 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                        <PlayIcon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                        {trailer.title || "Untitled"}
                      </h3>
                      <span className="flex items-center gap-1 text-sm bg-gray-700/80 px-2 py-1 rounded-full">
                        <StarIcon className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="font-medium">{trailer.vote_average?.toFixed(1) || "N/A"}</span>
                      </span>
                    </div>
                    
                    {/* Metadata row */}
                    <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-3">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-cyan-400" />
                        {trailer.release_date?.split("-")[0] || "N/A"}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 line-clamp-2 text-sm leading-relaxed">
                      {trailer.overview || "No description available."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrailersSection;