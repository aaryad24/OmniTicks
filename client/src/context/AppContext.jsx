import { useContext, useEffect, useState } from "react";
import { Children } from "react";
import { createContext } from "react";
import axios from "axios";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export const Appcontext = createContext();

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [shows, setShows] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const { user } = useUser();
  const { getToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
  const [theaters, setTheaters] = useState([]);
  const [theatersLoading, setTheatersLoading] = useState(false);
  const [theatersError, setTheatersError] = useState(null);

 const fetchTheaters = async (location) => {
  setTheatersLoading(true);
  setTheatersError(null);
  
  try {
    // Validate location structure
    if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
      throw new Error('Invalid location data');
    }

    const { data } = await axios.post(
      "/api/theaters",
      { location },
      { 
        headers: { 
          Authorization: `Bearer ${await getToken()}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10-second timeout
      }
    );

    // Validate response structure
    const theaters = Array.isArray(data?.theaters) ? data.theaters : [];
    setTheaters(theaters);

    if (theaters.length === 0) {
      setTheatersError("No theaters found nearby. Showing sample data.");
    }
  } catch (error) {
    console.error("API Error:", error);
    setTheaters(getFallbackTheaters()); // Use your fallback data
    setTheatersError(
      error.response?.data?.message || 
      error.message || 
      "Couldn't load theaters. Showing sample data."
    );
  } finally {
    setTheatersLoading(false);
  }
};

// Sample fallback data function
const getFallbackTheaters = () => [
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

  const fetchIsAdmin = async () => {
    try {
      const { data } = await axios.get("/api/admin/is-admin", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      setIsAdmin(data.isAdmin);

      if (!data.isAdmin && location.pathname.startsWith("/admin")) {
        navigate("/");
        toast.error("you are not authorized to access admin dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchShows = async () => {
    try {
      const { data } = await axios.get("/api/show/all");
      if (data.success) {
        setShows(data.shows);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFavoriteMovies = async () => {
    try {
      const { data } = await axios.get("/api/user/favorites", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setFavoriteMovies(data.movies);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  useEffect(() => {
    if (user) {
      fetchIsAdmin();
      fetchFavoriteMovies();
    }
  }, [user]);

  const value = {
    axios,
    fetchIsAdmin,
    user,
    getToken,
    navigate,
    isAdmin,
    shows,
    favoriteMovies,
    fetchFavoriteMovies,
    image_base_url,
    theaters,
    fetchTheaters,
    theatersLoading,
    theatersError,
  };

  return <Appcontext.Provider value={value}>{children}</Appcontext.Provider>;
};

export const useAppContext = () => useContext(Appcontext);
