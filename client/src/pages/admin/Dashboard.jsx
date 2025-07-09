import { useEffect } from 'react';
import { BarChart3, DollarSign, Film, Users, Star, CalendarDays } from 'lucide-react';
import React, { useState } from 'react';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import BlurCircle from '../../components/BlurCircle';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import AnimatedBackground from '../../components/AnimatedBackground';

const Dashboard = () => {
  const { axios, getToken, user, image_base_url } = useAppContext();
  const VITE_CURRENCY = import.meta.env.VITE_CURRENCY;
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0
  });
  const [loading, setLoading] = useState(true);

  const dashboardCards = [
    {
      title: "Total Bookings",
      icon: BarChart3,
      value: dashboardData.totalBookings || "0",
      color: "from-cyan-400 to-blue-500"
    },
    {
      title: "Total Revenue",
      icon: DollarSign,
      value: VITE_CURRENCY + (dashboardData.totalRevenue || "0"),
      color: "from-emerald-400 to-teal-500"
    },
    {
      title: "Active Shows",
      icon: Film,
      value: dashboardData.activeShows.length || "0",
      color: "from-purple-400 to-violet-500"
    },
    {
      title: "Total Users",
      icon: Users,
      value: dashboardData.totalUser || "0",
      color: "from-amber-400 to-orange-500"
    }
  ];

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get("/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });
      if (data.success) {
        setDashboardData(data.dashboardData);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error fetching dashboard data");
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  return !loading ? (
    <div className="relative h-[cal(100vh)] px-4 py-10 md:px-10">
      {/* Background elements */}
      <AnimatedBackground />  
      
      <Title text1="Admin" text2="Dashboard" />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {dashboardCards.map((card, index) => (
          <div 
            key={index} 
            className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700 hover:border-cyan-400 transition-all shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{card.title}</p>
                <h3 className="text-2xl font-bold mt-2">
                  {card.value}
                </h3>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-br ${card.color}`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Shows Section */}
      <div className="mt-12">
        <h2 className="text-xl font-bold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          <Film className="w-5 h-5" />
          Active Shows
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {dashboardData.activeShows.map((show) => (
            <div
              key={show._id}
              className="bg-gray-800/50 backdrop-blur-md rounded-xl overflow-hidden border border-gray-700 hover:border-cyan-400 transition-all hover:-translate-y-1 shadow-lg"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={image_base_url + show.movie.poster_path}
                  alt={show.movie.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="text-lg font-semibold text-white truncate">{show.movie.title}</h3>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold text-cyan-400">
                    {VITE_CURRENCY}{show.showPrice}
                  </span>
                  <span className="flex items-center gap-1 px-2 py-1 bg-gray-700 rounded-full text-sm">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    {show.movie.vote_average.toFixed(1)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <CalendarDays className="w-4 h-4 text-purple-400" />
                  {dateFormat(show.showDateTime)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Dashboard;