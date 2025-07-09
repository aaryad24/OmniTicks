import React from 'react'
import BlurCircle from '../components/BlurCircle'
import MovieCard from '../components/MovieCard'
import { useAppContext } from '../context/AppContext'
import Loading from '../components/Loading'
import AnimatedBackground from '../components/AnimatedBackground'

const Favorite = () => {
    const { favoriteMovies } = useAppContext()
  
  return favoriteMovies.length > 0 ? (
    <div className="relative xl:px-44 overflow-hidden my-40 mb-60 px-6 md:px-16 lg:px-40 min-h-[80vh] ">
      <AnimatedBackground />
      
      <h1 className="text-lg  font-medium my-4">
    Your Favorite Movies
      </h1>
      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {favoriteMovies.map((movie) => (
          <MovieCard movie={movie} key={movie.id} />
        ))}
      </div>
    </div>
  ) : (
    <Loading/>
  )
}

export default Favorite