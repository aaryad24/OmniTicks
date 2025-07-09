import axios from 'axios';

const ORS_API_KEY = process.env.ORS_API_KEY; 


export const theaters = async (req, res) => {
  try {
    const { latitude, longitude } = req.body.location;

    const response = await axios.get(
      `https://api.openrouteservice.org/pois`, // Updated endpoint
      {
        params: {
          api_key: process.env.ORS_API_KEY,
          request: 'pois',
          geometry: `${longitude},${latitude}`,
          radius: 100000,
          layers: 'venue',
          filter_category_ids: 'cinema,movie_theater,entertainment'
        },
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (!response.data.features || response.data.features.length === 0) {
      return res.json({ theaters: [] }); // Return empty array instead of error
    }

    const theaters = response.data.features.map(place => ({
      id: place.id || Math.random().toString(36).substr(2, 9),
      name: place.properties?.name || "Cinema",
      distance: `${(place.properties?.distance / 1000).toFixed(1)} km`,
      address: [place.properties?.street, place.properties?.locality].filter(Boolean).join(', ') || "Address not available",
      amenities: getRandomAmenities() // Use your existing function
    }));

    res.json({ theaters: theaters.length ? theaters : getFallbackTheaters(latitude, longitude) });
  } catch (error) {
    console.error("ORS Error:", error.response?.data || error.message);
    res.json({ theaters: getFallbackTheaters() });
  }
};

function getFallbackTheaters(lat = 40.7128, lng = -74.0060) {
  return [
    {
      id: "fallback-1",
      name: "AMC Theater",
      distance: "3.2 km",
      address: "123 Cinema St, New York, NY",
      amenities: ['recliners', 'dolby'],
      rating: 4.2,
      showtimes: 12
    },
    {
      id: "fallback-2",
      name: "Regal Cinemas",
      distance: "5.1 km",
      address: "456 Movie Ave, New York, NY",
      amenities: ['imax', 'bar'],
      rating: 4.5,
      showtimes: 8
    }
  ];
}
// Helper function to calculate distance
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}

// Helper function to generate random amenities
function getRandomAmenities() {
    const allAmenities = ['imax', 'dolby', 'recliners', 'bar', 'dining', 'family', 'private', 'arcade', 'drive-in', 'historic'];
    const count = Math.floor(Math.random() * 4) + 2; // 2-5 amenities
    return allAmenities.sort(() => 0.5 - Math.random()).slice(0, count);
}