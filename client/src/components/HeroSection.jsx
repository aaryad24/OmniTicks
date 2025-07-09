import React from 'react'
import { CalendarIcon, ClockIcon, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// HeroSection.jsx - Redesigned with side content
const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full  h-screen">
      {/* Background with parallax effect */}
      <div className="absolute inset-0 bg-[url('/squidMINI.jpg')] bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

      {/* Floating movie posters */}
      <div className="absolute -bottom-20 right-20 w-40 h-60 transform rotate-12 shadow-2xl z-10">
        <img src="/dead.jpg" className="w-full h-full object-cover rounded-lg" />
      </div>
      <div className="absolute -bottom-10 right-80 w-32 h-48 transform -rotate-6 shadow-xl z-20">
        <img src="/moneyheist.jpg" className="w-full h-full object-fill rounded-lg" />
      </div>

      {/* Main content */}
      <div className="relative z-30 h-full flex flex-col justify-end p-12">
        <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          Immersive Cinema Experience
        </h1>
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => navigate('/movies')}
            className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-bold flex items-center gap-2 transition-all"
          >
            Explore Movies
            <ArrowRight className="w-5 h-5" />
          </button>
          <button className="px-8 py-3 border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 font-bold rounded-lg transition-all">
            Membership
          </button>
        </div>
      </div>
    </div>
  )
}

export default HeroSection;