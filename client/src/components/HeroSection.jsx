import React from 'react'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen md:h-[90vh] lg:h-screen">
      {/* Background with parallax effect */}
      <div className="absolute inset-0 bg-[url('/squidMINI.jpg')] bg-cover bg-center bg-no-repeat"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

      {/* Floating movie posters - Hidden on mobile */}
      <div className="hidden md:block absolute -bottom-20 right-4 lg:right-20 w-32 lg:w-40 h-48 lg:h-60 transform rotate-12 shadow-2xl z-10">
        <img src="/dead.jpg" className="w-full h-full object-cover rounded-lg" alt="Movie poster" />
      </div>
      <div className="hidden md:block absolute -bottom-10 right-40 lg:right-80 w-24 lg:w-32 h-36 lg:h-48 transform -rotate-6 shadow-xl z-20">
        <img src="/moneyheist.jpg" className="w-full h-full object-fill rounded-lg" alt="Movie poster" />
      </div>

      {/* Main content */}
      <div className="relative z-30 h-full flex flex-col justify-end p-6 sm:p-8 md:p-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          Immersive Cinema Experience
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8">
          <button 
            onClick={() => navigate('/movies')}
            className="px-6 py-2 sm:px-8 sm:py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-bold flex items-center justify-center gap-2 transition-all text-sm sm:text-base"
          >
            Explore Movies
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button className="px-6 py-2 sm:px-8 sm:py-3 border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 font-bold rounded-lg transition-all text-sm sm:text-base">
            Membership
          </button>
        </div>
      </div>
    </div>
  )
}

export default HeroSection;