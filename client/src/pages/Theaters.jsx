import React, { useState, useEffect } from 'react';
import { MapPin, Popcorn, Coffee, Star } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

// Fallback theaters data
const FALLBACK_THEATERS = [
  {
    id: "fallback-1",
    name: "AMC Metreon 16",
    distance: "0.5 km",
    rating: "4.5",
    showtimes: 12,
    address: "135 4th St, San Francisco, CA",
    amenities: ["imax", "recliners", "dining"]
  },
  {
    id: "fallback-2",
    name: "Regal Cinemas",
    distance: "1.2 km",
    rating: "4.2",
    showtimes: 8,
    address: "2001 Junipero Serra Blvd, Daly City, CA",
    amenities: ["dolby", "bar"]
  },
  {
    id: "fallback-3",
    name: "Century Theatres",
    distance: "2.1 km",
    rating: "4.0",
    showtimes: 10,
    address: "3211 Scott Blvd, Santa Clara, CA",
    amenities: ["drive-in", "family"]
  }
];

const TheatersPage = () => {
  const { 
    theaters = [], 
    theatersLoading, 
    theatersError, 
    fetchTheaters,
  } = useAppContext();

  const [activeTab, setActiveTab] = useState('all');
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [zipCode, setZipCode] = useState('');
  const [usingDefaultLocation, setUsingDefaultLocation] = useState(false);
  const [locationRequested, setLocationRequested] = useState(false);

  const DEFAULT_COORDS = {
    latitude: 40.7128,
    longitude: -74.0060
  };

  // Determine which theaters to display
  const displayTheaters = theaters.length > 0 ? theaters : FALLBACK_THEATERS;

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }),
        (error) => {
          let message = 'Location error: ';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              message += 'Permission denied';
              break;
            case error.POSITION_UNAVAILABLE:
              message += 'Position unavailable';
              break;
            case error.TIMEOUT:
              message += 'Request timeout';
              break;
            default:
              message += 'Unknown error';
          }
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  const loadTheaters = async (coords = DEFAULT_COORDS) => {
    try {
      await fetchTheaters(coords);
      setUsingDefaultLocation(coords === DEFAULT_COORDS);
    } catch (error) {
      console.error('Error loading theaters:', error);
      toast.error(error.message || 'Failed to load theaters');
      // Still continue to show fallback theaters
    }
  };

  const requestLocation = async () => {
    setLocationRequested(true);
    try {
      const coords = await getUserLocation();
      await loadTheaters(coords);
    } catch (error) {
      console.warn(error.message);
      toast.error(error.message);
      await loadTheaters(DEFAULT_COORDS);
    }
  };

  const handleLocationSearch = async () => {
    if (!zipCode.trim()) {
      toast.error('Please enter a ZIP code');
      return;
    }

    try {
      const mockCoords = {
        latitude: 37.7749 + (Math.random() * 0.1 - 0.05),
        longitude: -122.4194 + (Math.random() * 0.1 - 0.05)
      };
      await loadTheaters(mockCoords);
      toast.success(`Showing theaters near ${zipCode}`);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search by location');
    }
  };

  useEffect(() => {
    if (locationRequested) return;
  }, [locationRequested]);

  // Filter theaters based on active tab
  const filteredTheaters = displayTheaters.filter(theater => {
    if (!theater.amenities) return false;
    if (activeTab === 'all') return true;
    return theater.amenities.includes(
      activeTab === 'premium' ? 'recliners' : 
      activeTab === 'imax' ? 'imax' :
      activeTab === 'drive-in' ? 'drive-in' : 'dining'
    );
  });

  // Amenity icons
  const amenityIcons = {
    imax: <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-white text-xs font-bold">IMAX</div>,
    dolby: <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white text-xs font-bold">DOLBY</div>,
    recliners: <div className="p-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg"><Popcorn className="w-5 h-5 text-amber-400" /></div>,
    bar: <div className="p-1.5 bg-purple-500/10 border border-purple-500/30 rounded-lg"><Coffee className="w-5 h-5 text-purple-400" /></div>,
    dining: <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg"><svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h6a1 1 0 011 1v2H8V4a1 1 0 011-1zM3 21h18a1 1 0 001-1v-8a2 2 0 00-2-2H4a2 2 0 00-2 2v8a1 1 0 001 1z" /></svg></div>,
    family: <div className="p-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg"><svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg></div>,
    private: <div className="p-1.5 bg-violet-500/10 border border-violet-500/30 rounded-lg"><svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></div>,
    arcade: <div className="p-1.5 bg-red-500/10 border border-red-500/30 rounded-lg"><svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg></div>,
    "drive-in": <div className="p-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"><svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg></div>,
    historic: <div className="p-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg"><svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>,
  };

  if (theatersLoading) return <Loading />;
  
  if (theatersError) {
    return (
      <div className="text-red-500 text-center mt-20">
        <h3 className="text-xl font-bold">Error Loading Theaters</h3>
        <p className="mt-2">{theatersError}</p>
        <p className="text-sm mt-4">Showing sample theaters instead</p>
        <button 
          onClick={requestLocation}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-32 pb-20 px-4 md:px-8 lg:px-16 relative">
      {usingDefaultLocation && (
        <div className="bg-yellow-500/10 text-yellow-300 p-4 rounded-lg mb-6 text-center">
          Using default New York location. Enable permissions for accurate results.
        </div>
      )}

      {!locationRequested && (
        <div className="flex justify-center mb-8">
          <button 
            onClick={requestLocation}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition"
          >
            <MapPin className="w-5 h-5" />
            Use My Current Location
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        <AnimatedBackground />
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
            Our Theaters
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {theaters.length === 0 ? 
              "Couldn't find theaters in your area. Showing popular locations:" : 
              "Discover premium cinema experiences near you."}
          </p>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 mb-12 border border-gray-700">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
              <input
                type="text"
                placeholder="Enter ZIP code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch()}
                className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <button 
              onClick={handleLocationSearch}
              className="w-full md:w-auto px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition"
            >
              Search
            </button>
          </div>
          
          <div className="mt-6">
            <div className="flex flex-wrap gap-3 justify-center">
              {['all', 'premium', 'imax', 'drive-in', 'dining'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-full capitalize font-medium transition-all ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
                      : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/70"
                  }`}
                >
                  {tab.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {filteredTheaters.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl text-gray-300 mb-4">No theaters match your filters</h3>
            <button 
              onClick={() => setActiveTab('all')}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              Show All Theaters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTheaters.map((theater) => (
              <TheaterCard 
                key={theater.id}
                theater={theater}
                amenityIcons={amenityIcons}
                onClick={() => setSelectedTheater(theater)}
              />
            ))}
          </div>
        )}
        
        {/* Features section */}
        <div className="mt-20 pt-10 border-t border-gray-800">
          <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-12">
            Premium Cinema Experiences
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-white"><Popcorn className="w-6 h-6" /></div>,
                title: "Luxury Seating",
                description: "Recliner seats with extra legroom and premium materials for ultimate comfort."
              },
              {
                icon: <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg></div>,
                title: "IMAX & Dolby Cinema",
                description: "Immersive formats with crystal-clear images and powerful surround sound."
              },
              {
                icon: <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h6a1 1 0 011 1v2H8V4a1 1 0 011-1zM3 21h18a1 1 0 001-1v-8a2 2 0 00-2-2H4a2 2 0 00-2 2v8a1 1 0 001 1z" /></svg></div>,
                title: "Dining Options",
                description: "Gourmet meals, artisanal snacks, and full bars delivered to your seat."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700 hover:border-cyan-400 transition-all">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-200 mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Theater Detail Modal */}
      {selectedTheater && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800/90 backdrop-blur-xl rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-cyan-500/30">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-cyan-400">{selectedTheater.name}</h2>
                <button 
                  onClick={() => setSelectedTheater(null)}
                  className="p-2 rounded-full hover:bg-gray-700/50"
                >
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <div className="h-64 rounded-lg bg-gradient-to-br from-purple-900/30 to-cyan-900/30 mb-4"></div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-200 mb-3">Location</h3>
                    <p className="text-gray-400 flex items-start">
                      <MapPin className="w-5 h-5 mr-2 text-cyan-400 mt-0.5" />
                      <span>{selectedTheater.address}</span>
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-200 mb-3">Opening Hours</h3>
                    <div className="text-gray-400 space-y-1">
                      <p>Monday - Friday: 10:00 AM - 11:00 PM</p>
                      <p>Saturday - Sunday: 9:00 AM - 12:00 AM</p>
                    </div>
                  </div>
                  
                  <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 rounded-lg font-medium text-white shadow-lg hover:shadow-purple-500/30 transition-all">
                    Get Directions
                  </button>
                </div>
                
                <div className="md:w-1/2">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-200 mb-3">Amenities</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedTheater.amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center gap-2 bg-gray-700/30 rounded-lg p-3">
                          {amenityIcons[amenity]}
                          <span className="text-gray-300 capitalize">{amenity.replace('-', ' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-gray-200 mb-3">Today's Showtimes</h3>
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <div className="flex flex-wrap gap-2">
                        {['10:00 AM', '1:30 PM', '4:45 PM', '7:00 PM', '9:30 PM', '11:45 PM'].map((time) => (
                          <button key={time} className="px-4 py-2 bg-gray-800 hover:bg-cyan-600/20 border border-gray-700 hover:border-cyan-400 rounded-lg text-gray-300 hover:text-cyan-300 transition-all">
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TheaterCard = ({ theater, amenityIcons, onClick }) => (
  <div 
    className="bg-gray-800/50 backdrop-blur-md rounded-xl overflow-hidden border border-gray-700 hover:border-cyan-400 transition-all duration-300 shadow-lg hover:shadow-cyan-500/20 cursor-pointer"
    onClick={onClick}
  >
    <div className="h-48 bg-gradient-to-br from-purple-900/30 to-cyan-900/30 flex items-center justify-center relative">
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div className="text-center relative z-10 p-4">
        <h2 className="text-2xl font-bold mb-2">{theater.name}</h2>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span>{theater.distance}</span>
        </div>
      </div>
    </div>
    
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="font-medium">{theater.rating}</span>
          <span className="text-gray-500 ml-1">/ 5.0</span>
        </div>
        <div className="text-sm text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full">
          {theater.showtimes} showtimes today
        </div>
      </div>
      
      <p className="text-gray-400 mb-4 flex items-center">
        <MapPin className="w-4 h-4 mr-2 text-cyan-400" />
        <span>{theater.address}</span>
      </p>
      
      <div className="mt-6">
        <h4 className="text-gray-300 font-medium mb-3">Amenities</h4>
        <div className="flex flex-wrap gap-3">
          {theater.amenities.map((amenity) => (
            <div key={amenity} className="flex flex-col items-center">
              {amenityIcons[amenity]}
              <span className="text-xs text-gray-400 mt-1 capitalize">
                {amenity.replace('-', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <button className="mt-6 w-full py-2.5 bg-gradient-to-r from-purple-600/30 to-cyan-600/30 border border-purple-500/30 hover:from-purple-500/40 hover:to-cyan-500/40 hover:border-cyan-400 rounded-lg text-cyan-300 transition-all">
        View Showtimes
      </button>
    </div>
  </div>
);

export default TheatersPage;