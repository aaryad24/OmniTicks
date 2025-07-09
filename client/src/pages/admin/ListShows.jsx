import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { dateFormat } from "../../lib/dateFormat";
import isoTimeFormat from "../../lib/isoTimeFormat";
import { useAppContext } from "../../context/AppContext";
import { CalendarDays, Clock, Film, Ticket, DollarSign } from 'lucide-react';
import BlurCircle from "../../components/BlurCircle";
import AnimatedBackground from "../../components/AnimatedBackground";

const ListShows = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const currency = import.meta.env.VITE_CURRENCY;
  const { axios, getToken, user } = useAppContext();

  const getAllShows = async () => {
    try {
      const { data } = await axios.get("/api/admin/all-shows", {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });
      setShows(data.shows);
    } catch (error) {
      console.error("Error fetching shows:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getAllShows();
    }
  }, [user]);

  const calculateEarnings = (show) => {
    return (show.occupiedSeats?.length || 0) * (show.showPrice || 0);
  };

  return !loading ? (
    <div className="px-10 py-18 md:px-16">
      <AnimatedBackground/>
      <Title text1="List" text2="Shows" />
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shows.length > 0 ? (
          shows.map((show, index) => (
            <div 
              key={index}
              className="bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 p-5 hover:border-cyan-400 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-300 truncate">
                  {show.movie?.title || "Untitled Show"}
                </h3>
                <span className="px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-sm">
                  {show.occupiedSeats?.length || 0} bookings
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-400">
                  <CalendarDays className="w-5 h-5 text-purple-400" />
                  <span>{dateFormat(show.showDateTime)}</span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-400">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <span>{isoTimeFormat(show.showDateTime)}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-400">
                  <Ticket className="w-5 h-5 text-purple-400" />
                  <span>
                    {Object.keys(show.occupiedSeats || {}).length} seats booked
                  </span>
                </div>

                <div className="flex items-center gap-3 text-gray-400">
                  <DollarSign className="w-5 h-5 text-purple-400" />
                  <span className="font-medium text-purple-400">
                    {currency} {calculateEarnings(show).toFixed(2)} earned
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-8 text-center text-gray-500 bg-gray-800/50 rounded-xl">
            No shows found
          </div>
        )}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default ListShows;