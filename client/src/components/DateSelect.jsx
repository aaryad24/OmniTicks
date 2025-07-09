import React, { useState } from 'react';
import BlurCircle from './BlurCircle';
import { ChevronLeft, ChevronRight, CalendarDays, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const DateSelect = ({ dateTime, id }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const datesPerPage = 5;

  const dates = Object.keys(dateTime);
  const totalPages = Math.ceil(dates.length / datesPerPage);
  const visibleDates = dates.slice(
    currentPage * datesPerPage,
    (currentPage + 1) * datesPerPage
  );

  const onBookHandler = () => {
    if (!selected) return toast.error('Please select a date');
    navigate(`/movies/${id}/${selected}`);
    scrollTo(0, 0);
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className='relative p-8 bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 hover:border-cyan-400 transition-all shadow-lg'>
      
      
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <CalendarDays className="w-6 h-6 text-cyan-400" />
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            Select Showtime
          </h3>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`p-2 rounded-full ${currentPage === 0 ? 'text-gray-500' : 'text-cyan-400 hover:bg-cyan-400/10'}`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex gap-4 overflow-hidden">
              {Object.keys(dateTime).map((date) => (
                <button
                  key={date}
                  onClick={() => setSelected(date)}
                  className={`flex flex-col items-center justify-center min-w-[70px] p-3 rounded-lg transition-all ${selected === date 
                    ? 'bg-gradient-to-br from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/30' 
                    : 'bg-gray-700/50 hover:bg-gray-700 border border-gray-600 hover:border-cyan-400'}`}
                >
                  <span className="text-lg font-semibold">
                    {new Date(date).getDate()}
                  </span>
                  <span className="text-xs uppercase">
                    {new Date(date).toLocaleDateString("en-US", { month: "short" })}
                  </span>
                  <span className="text-xs mt-1">
                    {new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className={`p-2 rounded-full ${currentPage === totalPages - 1 ? 'text-gray-500' : 'text-cyan-400 hover:bg-cyan-400/10'}`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          
        </div>

        <button
          onClick={onBookHandler}
          disabled={!selected}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all mt-4 ${!selected 
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-lg hover:shadow-cyan-500/30'}`}
        >
          <Ticket className="w-5 h-5" />
          Book Tickets
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default DateSelect;