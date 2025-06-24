import React from 'react'
import BlurCircle from '../components/BlurCircle'
import MovieCard from '../components/MovieCard'
import { useAppContext } from '../context/AppContext'

const Movies = () => {
  const { shows } = useAppContext()
  return shows.length > 0 ? (
    <div className="relative xl:px-44 overflow-hidden my-40 mb-60 px-6 md:px-16 lg:px-40 min-h-[80vh] ">
      <BlurCircle top="150px" left="0px"></BlurCircle>
      <BlurCircle bottom="50px" right="50px"></BlurCircle>
      <h1 className="text-lg  font-medium my-4">
        Now Showing
      </h1>
      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {shows.map((movie) => (
          <MovieCard movie={movie} key={movie.id} />
        ))}
      </div>
    </div>
  ) : (
    <div>No movies available.</div>
  )
}

export default Movies