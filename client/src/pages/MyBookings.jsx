import React from 'react'
import { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import BlurCircle from '../components/BlurCircle';
import timeFormat from '../lib/timeFormat';
import { dateFormat } from '../lib/dateFormat';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { Ticket, CalendarDays, Clock, CircleDollarSign, Armchair } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

const MyBookings = () => {
    const currency = import.meta.env.VITE_CURRENCY;
    const { axios, getToken, user, image_base_url } = useAppContext();
    
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getMyBookings = async () => {
        try {
            const { data } = await axios.get('/api/user/bookings', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            if (data.success) {
                setBookings(data.bookings);
            }
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (user) {
            getMyBookings();
        }
    }, [user]);

    return !isLoading ? (
        <div className='relative px-4 py-30 sm:px-6 md:px-8 lg:px-12 min-h-[80vh]'>
            <AnimatedBackground/>
            
            <div className='max-w-6xl mx-auto'>
                <div className='flex items-center justify-between mb-8'>
                    <h1 className='text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400'>
                        My Bookings
                    </h1>
                    <div className='text-sm text-gray-400 flex items-center gap-1'>
                        <Ticket className='w-4 h-4' />
                        {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
                    </div>
                </div>

                {bookings.length > 0 ? (
                    <div className='grid grid-cols-1 gap-6'>
                        {bookings.map((item, index) => (
                            <div
                                key={index}
                                className='bg-gray-800/50 backdrop-blur-md rounded-xl overflow-hidden border border-gray-700 hover:border-cyan-400 transition-all shadow-lg'>
                                <div className='flex flex-col md:flex-row'>
                                    <div className='md:w-1/3 lg:w-1/4 relative'>
                                        <img
                                            src={image_base_url + item.show.movie.poster_path}
                                            alt={item.show.movie.title}
                                            className='w-full h-full max-h-64 md:max-h-full object-cover'
                                        />
                                        <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4'>
                                            <h2 className='text-lg font-semibold text-white'>{item.show.movie.title}</h2>
                                        </div>
                                    </div>
                                    
                                    <div className='flex-1 p-6'>
                                        <div className='flex justify-between items-start mb-4'>
                                            <div className='flex items-center gap-2'>
                                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    item.isPaid 
                                                        ? 'bg-green-900/30 text-green-400' 
                                                        : 'bg-amber-900/30 text-amber-400'
                                                }`}>
                                                    {item.isPaid ? 'Confirmed' : 'Payment Pending'}
                                                </div>
                                            </div>
                                            
                                            <span className='text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent'>
                                                {currency} {item.amount}
                                            </span>
                                        </div>

                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
                                            <div className='flex items-center gap-2 text-gray-300'>
                                                <CalendarDays className='w-4 h-4 text-purple-400' />
                                                <span>{dateFormat(item.show.showDateTime)}</span>
                                            </div>
                                            <div className='flex items-center gap-2 text-gray-300'>
                                                <Clock className='w-4 h-4 text-cyan-400' />
                                                <span>{timeFormat(item.show.movie.runtime)}</span>
                                            </div>
                                            <div className='flex items-center gap-2 text-gray-300'>
                                                <Armchair className='w-4 h-4 text-emerald-400' />
                                                <span>{item.bookedSeats.length} seats: {item.bookedSeats.join(', ')}</span>
                                            </div>
                                            <div className='flex items-center gap-2 text-gray-300'>
                                                <CircleDollarSign className='w-4 h-4 text-amber-400' />
                                                <span>{item.show.screen?.name || 'Main Hall'}</span>
                                            </div>
                                        </div>

                                        {!item.isPaid && (
                                            <div className='mt-6 flex justify-end'>
                                                <Link 
                                                    to={item.paymentLink} 
                                                    className='bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white px-6 py-2 rounded-full font-medium text-sm transition-all duration-300 shadow-lg hover:shadow-amber-400/20'>
                                                    Complete Payment
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center py-16 text-center bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700'>
                        <div className='w-24 h-24 bg-gradient-to-br from-cyan-400/10 to-purple-400/10 rounded-full flex items-center justify-center mb-4'>
                            <Ticket className='h-10 w-10 text-gray-400' />
                        </div>
                        <h3 className='text-xl font-medium mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400'>
                            No Bookings Yet
                        </h3>
                        <p className='text-gray-400 max-w-md mx-auto'>
                            You haven't made any bookings yet. Browse our shows and book your tickets to get started!
                        </p>
                        <Link 
                            to='/' 
                            className='mt-6 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-6 py-2 rounded-full font-medium text-sm transition-all duration-300'>
                            Browse Shows
                        </Link>
                    </div>
                )}
            </div>
        </div>
    ) : (
        <Loading />
    );
}

export default MyBookings;