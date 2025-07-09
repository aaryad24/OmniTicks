import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import MovieCard from "../components/MovieCard"

export default function FeaturedSection() {
  const navigate = useNavigate();
  const { shows } = useAppContext();

  return (
    <section className="min-h-screen py-20 px-6 md:px-12 lg:px-24 bg-gray-900 relative">
      {/* Dark overlay - maintaining your background image */}
      <div className="absolute inset-0 bg-cover bg-center bg-[url('/squidgamemain.jpeg')] opacity-20"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header - updated to match timeline style */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            Now Showing
          </h2>
          
          <button
            onClick={() => navigate("/Movies")}
            className="group flex items-center gap-2 px-6 py-2 rounded-full border border-cyan-400/50 hover:bg-cyan-400/10 hover:border-cyan-400/80 transition-all mt-4 md:mt-0"
          >
            <span className="text-cyan-400 group-hover:text-white">View All</span>
            <ArrowRight className="w-5 h-5 text-cyan-400 group-hover:text-white group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Timeline layout for featured movies */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 h-full w-0.5 bg-gradient-to-b from-purple-500 to-cyan-500"></div>
          
          {shows.slice(0, 4).map((show, index) => (
            <div key={show._id} className="relative pl-12 pb-12 group">
              {/* Timeline dot */}
              <div className="absolute left-0 w-4 h-4 rounded-full bg-cyan-500 transform translate-x-[-50%] group-hover:scale-150 transition-all"></div>
              
              <MovieCard movie={show} />
            </div>
          ))}
        </div>

        {/* CTA Button - maintained from original */}
        <div className="flex justify-center mt-16">
          <button
            onClick={() => {
              navigate("/movies");
              scrollTo(0, 0);
            }}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 flex items-center gap-2"
          >
            Show More Movies
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}