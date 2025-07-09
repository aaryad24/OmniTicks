// Home.jsx - Completely new layout structure
import React from 'react'
import HeroSection from '../components/HeroSection'
import FeaturedSection from '../components/FeaturedSection'
import TrailersSection from '../components/TrailersSection'
import CinemaHallSection from '../components/CinemaHallSection' // New component

const Home = () => {
  return (
    <div className="bg-gray-900 text-white">
      {/* Immersive Hero with Side Navigation */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        <HeroSection />
      </div>

      {/* Featured Content Carousel */}
      <FeaturedSection />

      {/* Interactive Cinema Hall Experience */}
      <CinemaHallSection />

      {/* Trailers Gallery */}
      <TrailersSection />

    </div>
  )
}

export default Home