import React, { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { useAppContext } from "../../context/AppContext";
import { CalendarDays, Clock, Ticket, User, Film, DollarSign } from 'lucide-react';
import AnimatedBackground from "../../components/AnimatedBackground";

const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { axios, getToken, user } = useAppContext();
  
  const getAllBookings = async () => {
    try {
      const { data } = await axios.get("/api/admin/all-bookings", {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });
      setBookings(data.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      getAllBookings();
    }
  }, [user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return !isLoading ? (
    <div className="px-10 py-18 md:px-16">
      <AnimatedBackground/>
      <Title text1="List" text2="Bookings" />
      
      <div className="mt-8 space-y-6">
        {bookings.length > 0 ? (
          bookings.map((item, index) => (
            <div 
              key={index}
              className="bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 p-6 hover:border-cyan-400 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-500/10 p-2 rounded-full">
                    <User className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-300">
                    {item.user?.name || "Anonymous User"}
                  </h3>
                </div>
                
                <div className="flex items-center gap-3 bg-cyan-500/10 px-4 py-2 rounded-full">
                  <DollarSign className="w-4 h-4 text-cyan-400" />
                  <span className="font-medium text-cyan-400">
                    {currency}{item.amount?.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-500/10 p-2 rounded-full mt-0.5">
                    <Film className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Movie</p>
                    <p className="text-gray-300 font-medium">
                      {item.show?.movie?.title || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-500/10 p-2 rounded-full mt-0.5">
                    <CalendarDays className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Date & Time</p>
                    <p className="text-gray-300 font-medium">
                      {formatDate(item.show?.showDateTime)} at {formatTime(item.show?.showDateTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-500/10 p-2 rounded-full mt-0.5">
                    <Ticket className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Seats</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.values(item.bookedSeats || {}).map((seat, i) => (
                        <span 
                          key={i}
                          className="px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs"
                        >
                          {seat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500 bg-gray-800/50 rounded-xl">
            No bookings found
          </div>
        )}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default ListBookings;