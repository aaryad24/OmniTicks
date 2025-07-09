import React, { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import { Check, Trash2, Star, Plus, Calendar, Clock, Film, DollarSign } from "lucide-react";
import Title from "../../components/admin/Title";
import { kConverter } from "../../lib/kConverter";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import AnimatedBackground from "../../components/AnimatedBackground";

const AddShows = () => {
  const { axios, getToken, user, image_base_url } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY;

  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("");
  const [addingShow, setAddingShow] = useState(false);

  const fetchNowPlayingMovies = async () => {
    try {
      const { data } = await axios.get('/api/show/now-playing', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });
      if (data.success) {
        setNowPlayingMovies(data.movies);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      toast.error('Failed to load movies');
    }
  };

  const handleDateTimeAdd = () => {
    if (!dateTimeInput) {
      toast.error('Please select a date and time');
      return;
    }
    const [date, time] = dateTimeInput.split("T");
    if (!date || !time) {
      toast.error('Invalid date/time format');
      return;
    }
    setDateTimeSelection((prev) => {
      const times = prev[date] || [];
      if (!times.includes(time)) {
        return { ...prev, [date]: [...times, time] };
      }
      toast('This time slot already exists');
      return prev;
    });
    setDateTimeInput("");
  };

  const handleRemoveTime = (date, time) => {
    setDateTimeSelection((prev) => {
      const filteredTimes = prev[date].filter((t) => t !== time);
      if (filteredTimes.length === 0) {
        const { [date]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [date]: filteredTimes };
    });
  };

  const handleSubmit = async () => {
    try {
      setAddingShow(true);
      if (!selectedMovie) {
        toast.error('Please select a movie');
        return;
      }
      if (Object.keys(dateTimeSelection).length === 0) {
        toast.error('Please add at least one show time');
        return;
      }
      if (!showPrice || isNaN(showPrice)) {
        toast.error('Please enter a valid price');
        return;
      }

      const showsInput = Object.entries(dateTimeSelection).map(([date, times]) => 
      ({
        date,
        time:times
      }));

      const payload = {
        movieId: selectedMovie,
        showsInput,
        showPrice: Number(showPrice)
      };

      const { data } = await axios.post('/api/show/add', payload, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (data.success) {
        toast.success(data.message);
        setSelectedMovie(null);
        setDateTimeSelection({});
        setShowPrice("");
        fetchNowPlayingMovies();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error('An error occurred, please try again');
    } finally {
      setAddingShow(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNowPlayingMovies();
    }
  }, [user]);

  return nowPlayingMovies.length > 0 ? (
    <div className="px-10 py-18 md:px-16">
      <AnimatedBackground/>
      <Title text1="Add" text2="Shows" />
      
      {/* Movie Selection Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-300 mb-4 flex items-center gap-2">
          <Film className="w-5 h-5 text-purple-400" />
          Select Movie
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {nowPlayingMovies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => setSelectedMovie(movie.id)}
              className={`relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer group
                ${selectedMovie === movie.id ? 'border-cyan-400' : 'border-gray-700 hover:border-gray-600'}`}
            >
              <img
                src={image_base_url + movie.poster_path}
                alt={movie.title}
                className="w-full h-48 object-cover group-hover:brightness-110 transition"
              />
              <div className="p-3 bg-gray-800">
                <h3 className="font-medium text-gray-300 truncate">{movie.title}</h3>
                <div className="flex justify-between items-center mt-2 text-xs">
                  <span className="flex items-center text-amber-400">
                    <Star className="w-3 h-3 fill-amber-400 mr-1" />
                    {movie.vote_average?.toFixed(1)}
                  </span>
                  <span className="text-gray-400">
                    {kConverter(movie.vote_count)} votes
                  </span>
                </div>
              </div>
              {selectedMovie === movie.id && (
                <div className="absolute top-2 right-2 bg-cyan-400 p-1 rounded-full">
                  <Check className="w-3 h-3 text-gray-900" strokeWidth={3} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Show Details Section */}
      <div className="mt-10 space-y-6">
        {/* Price Input */}
        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 p-5">
          <h3 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-purple-400" />
            Show Pricing
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-gray-400">{currency}</span>
            <input
              type="number"
              value={showPrice}
              min={0}
              onChange={(e) => setShowPrice(e.target.value)}
              placeholder="Enter ticket price"
              className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 w-full max-w-xs focus:border-cyan-400 outline-none"
            />
          </div>
        </div>

        {/* Date/Time Selection */}
        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 p-5">
          <h3 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            Show Schedule
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="datetime-local"
              value={dateTimeInput}
              onChange={(e) => setDateTimeInput(e.target.value)}
              className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 flex-1 focus:border-cyan-400 outline-none"
            />
            <button
              onClick={handleDateTimeAdd}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Time
            </button>
          </div>

          {/* Selected Times */}
          {Object.keys(dateTimeSelection).length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-300 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                Scheduled Shows
              </h4>
              <div className="space-y-4">
                {Object.entries(dateTimeSelection).map(([date, times]) => (
                  <div key={date} className="bg-gray-700/30 rounded-lg p-3">
                    <div className="font-medium text-gray-300 mb-2">{date}</div>
                    <div className="flex flex-wrap gap-2">
                      {times.map((time) => (
                        <div key={time} className="bg-gray-600/50 px-3 py-1.5 rounded-full flex items-center">
                          <span className="text-sm">{time}</span>
                          <button 
                            onClick={() => handleRemoveTime(date, time)}
                            className="ml-2 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button 
          onClick={handleSubmit} 
          disabled={addingShow}
          className={`w-full py-3 rounded-xl font-bold transition-all
            ${addingShow 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-lg hover:shadow-cyan-500/20'
            }`}
        >
          {addingShow ? 'Adding Shows...' : 'Create Shows'}
        </button>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default AddShows;