import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react'
import BlurCircle from '../components/BlurCircle'
import timeFormat from '../lib/timeFormat'
import DateSelect from '../components/DateSelect'
import MovieCard from '../components/MovieCard'
import Loading from '../components/Loading'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import AnimatedBackground from '../components/AnimatedBackground'

const MovieDetails = () => {

    const { id } = useParams()
    const [show, setShow] = useState();
    const navigate = useNavigate();
    const { shows, axios, getToken, user, fetchFavoriteMovies, favoriteMovies, image_base_url } = useAppContext()
    

const getShow = async () => {

    try {
        const {data} = await axios.get(`/api/show/${id}`)
        if(data.success){
            setShow(data)
        }
    } catch (error) {
        console.log(error)
    }
}

const handleFavorite = async () =>{
    try {
        if(!user) return toast.error("please login to proceed");
            const {data} = await axios.post('/api/user/update-favorite', {movieId: id},
         {headers: { Authorization: `Bearer ${await getToken()}`}})
         
         if(data.success){
             await fetchFavoriteMovies();
             toast.success(
                data.action === 'added' 
                    ? "Added to favorites!" 
                    : "Removed from favorites!"
            );
            }
        } catch (error) {
        console.log(error)
    }
}

    useEffect(()=>{
getShow()
    }, [id])

    return show ? (
        <div className="h-100vh bg-gray-900 text-white py-20">
  {/* Movie Header Section */}
  <div className="bg-gradient-to-b from-gray-900 to-gray-950 relative overflow-hidden">
    {/* Glowing Particles Background */}
    <div className="absolute inset-0 opacity-35">
          <AnimatedBackground/>
    </div>

    <div className=" container mx-auto px-6 py-12 md:px-12 lg:px-24 relative z-10">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        {/* Movie Poster with Neon Glow */}
        <div className="relative group w-64 h-96 flex-shrink-0">
          <div className="absolute inset-0 bg-purple-500 rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500" />
          <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
          <img
            src={image_base_url + show.movie.poster_path}
            alt={show.movie.title}
            className="w-full h-full object-cover rounded-xl relative z-10"
          />
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70 blur-sm" />
        </div>

        {/* Movie Info */}
        <div className="flex-1">
          <div className="mb-6">
            <span className="text-cyan-400 font-medium">{show.movie.genres.slice(0, 2).map(g => g.name).join(' • ')}</span>
            <h1 className="text-4xl font-bold mt-2 neon-text-purple">{show.movie.title}</h1>
            
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1 text-yellow-400">
                <StarIcon className="w-5 h-5" />
                <span>{show.movie.vote_average.toFixed(1)}</span>
              </div>
              <span>{timeFormat(show.movie.runtime)}</span>
              <span>{show.movie.release_date.split("-")[0]}</span>
            </div>
          </div>

          {/* Synopsis */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2 neon-text-cyan"></h3>
            <p className="text-gray-300 leading-relaxed">{show.movie.overview}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button 
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all"
              onClick={() => {/* trailer function */}}
            >
              <PlayCircleIcon className="w-5 h-5" />
              Watch Trailer
            </button>
            
            <a
              href="#dateSelect"
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
            >
              Book Tickets
            </a>
            
            <button 
              onClick={handleFavorite}
              className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-all border border-cyan-400/20"
            >
              <Heart className={`w-6 h-6 ${favoriteMovies.find(movie => movie._id === id) ? 'text-pink-500 fill-pink-500' : 'text-gray-300'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Main Content */}
  <div className="container mx-auto px-6 py-12 md:px-12 lg:px-24">
    {/* Cast Section */}
    <section className="mb-16">
      <h2 className="text-2xl font-bold mb-8 neon-text-pink border-b border-cyan-400/30 pb-2">Cast</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
        {show.movie.casts.slice(0,8).map((cast, index) => (
          <div key={index} className="text-center group">
            <div className="w-full aspect-square rounded-full overflow-hidden mb-3 relative">
              <div className="absolute inset-0 bg-cyan-400/20 opacity-0 group-hover:opacity-100 rounded-full transition-all" />
              <img
                src={image_base_url + cast.profile_path}
                alt={cast.name}
                className="w-full h-full object-cover relative z-10"
              />
            </div>
            <p className="font-medium text-sm">{cast.name}</p>
            <p className="text-cyan-400 text-xs">{cast.character}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Showtimes */}
    <section id='dateSelect' className="mb-16" >
      <h2 className="text-2xl font-bold mb-8 neon-text-cyan border-b border-cyan-400/30 pb-2">Showtimes</h2>
      <DateSelect dateTime={show.dateTime} id={id} />
    </section>

    {/* Recommended Movies */}
    <section>
      <h2 className="text-2xl font-bold mb-8 neon-text-purple border-b border-cyan-400/30 pb-2">You May Also Like</h2>
      <div className="grid  gap-6">
        {shows.slice(0,4).map((movie, index) => (
          <MovieCard 
            key={index} 
            movie={movie} 
            className="hover:transform hover:scale-105 transition-all duration-300 " 
          />
        ))}
      </div>
      <div className="flex justify-center mt-12">
        <button 
          onClick={() => {navigate('/movies'); scrollTo(0,0)}}
          className="px-10 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all"
        >
          View All Movies
        </button>
      </div>
    </section>
  </div>

  

  {/* Custom Styles */}
  <style jsx>{`
    .neon-text-purple {
      text-shadow: 0 0 8px rgba(192, 132, 252, 0.7);
    }
    .neon-text-cyan {
      text-shadow: 0 0 8px rgba(34, 211, 238, 0.7);
    }
    .neon-text-pink {
      text-shadow: 0 0 8px rgba(236, 72, 153, 0.7);
    }
    .glow-cyan {
      box-shadow: 0 0 10px #06b6d4, 0 0 20px #06b6d4;
    }
  `}</style>
</div>
    ) : <Loading />
}

export default MovieDetails