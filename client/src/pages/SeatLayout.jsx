import React, { useState, useEffect } from "react";
import { Clock, ArrowRight, Ticket, Armchair } from "lucide-react";
import Loading from "../components/Loading";
import { assets } from "../assets/assets";
import { useNavigate, useParams } from "react-router-dom";
import isoTimeFormat from "../lib/isoTimeFormat";
import BlurCircle from "../components/BlurCircle";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const SeatLayout = () => {
    const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]];
    const { id, date } = useParams();
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [show, setShow] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { axios, getToken, user } = useAppContext();
    const [occupiedSeats, setOccupiedSeats] = useState([]);
    const MAX_SEATS = 5;

    const getShow = async () => {
        try {
            const { data } = await axios.get(`/api/show/${id}`);
            if (data.success) {
                setShow(data);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to load show details");
        }
    };

    const renderSeats = (row, count = 9) => (
        <div key={row} className="flex gap-2 mt-2">
            <div className="flex flex-wrap items-center justify-center gap-3">
                {Array.from({ length: count }, (_, i) => {
                    const seatId = `${row}${i + 1}`;
                    const isSelected = selectedSeats.includes(seatId);
                    const isOccupied = occupiedSeats.includes(seatId);
                    
                    return (
                        <button
                            key={seatId}
                            onClick={() => handleSeatClick(seatId)}
                            disabled={isOccupied}
                            className={`relative h-10 w-10 flex items-center justify-center rounded-lg transition-all duration-200
                                ${isSelected 
                                    ? 'bg-gradient-to-br from-cyan-500 to-purple-600 text-white shadow-lg' 
                                    : isOccupied 
                                        ? 'bg-gray-700/50 border border-gray-600 cursor-not-allowed' 
                                        : 'bg-gray-800 border border-gray-600 hover:border-cyan-400 hover:bg-gray-700'}
                                `}
                        >
                            {seatId}
                            {isOccupied && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-6 h-[2px] bg-red-400 rotate-45"></div>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    const handleSeatClick = (seatId) => {
        if (!selectedTime) {
            return toast("Please select a showtime first");
        }
        if (occupiedSeats.includes(seatId)) {
            return toast.error('This seat is already booked');
        }
        if (!selectedSeats.includes(seatId) && selectedSeats.length >= MAX_SEATS) {
            return toast.error(`You can only select up to ${MAX_SEATS} seats`);
        }

        setSelectedSeats(prev =>
            prev.includes(seatId)
                ? prev.filter(seat => seat !== seatId)
                : [...prev, seatId]
        );
    };

    const getOccupiedSeats = async () => {
        try {
            if (!selectedTime) return;
            setIsLoading(true);
            const { data } = await axios.get(`/api/booking/seats/${selectedTime.showId}`);
            if (data.success) {
                setOccupiedSeats(data.occupiedSeats);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to load seat availability");
        } finally {
            setIsLoading(false);
        }
    };

    const bookTickets = async () => {
        try {
            if (!user) return toast.error('Please login to proceed');
            if (!selectedTime) return toast.error('Please select a showtime');
            if (!selectedSeats.length) return toast.error('Please select at least one seat');

            setIsLoading(true);
            const { data } = await axios.post('/api/booking/create', {
                showId: selectedTime.showId,
                selectedSeats
            }, {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            });

            if (data.success) {
                window.location.href = data.url;
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to process booking");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getShow();
    }, []);

    useEffect(() => {
        if (selectedTime) {
            setSelectedSeats([]);
            getOccupiedSeats();
        }
    }, [selectedTime]);

    if (!show) return <Loading />;

    return (
        <div className="relative px-6 md:px-12 lg:px-24 py-12 bg-gray-900 min-h-screen">
            {/* Background elements */}
            

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
                {/* Showtimes Panel */}
                <div className="bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 p-6 h-fit lg:sticky lg:top-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Clock className="w-6 h-6 text-cyan-400" />
                        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                            Available Showtimes
                        </h2>
                    </div>
                    
                    <div className="space-y-2">
                        {show.dateTime[date]?.map((item) => (
                            <button
                                key={item.time}
                                onClick={() => setSelectedTime(item)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                                    ${selectedTime?.time === item.time
                                        ? 'bg-gradient-to-r from-cyan-500/80 to-purple-600/80 text-white shadow-lg'
                                        : 'bg-gray-700/50 hover:bg-gray-700 border border-gray-600 hover:border-cyan-400'
                                    }`}
                            >
                                <span className="text-sm font-medium">
                                    {isoTimeFormat(item.time)}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Seat Selection Area */}
                <div className="relative">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
                            Select Your Seats
                        </h1>
                        <p className="text-gray-400">Choose up to {MAX_SEATS} seats</p>
                    </div>

                    {/* Screen Display */}
                    <div className="flex flex-col items-center mb-12">
                        <div className="w-full max-w-2xl h-4 bg-gradient-to-t from-gray-700 to-gray-500 rounded-t-full mb-2"></div>
                        <p className="text-gray-400 text-sm font-medium">SCREEN THIS WAY</p>
                    </div>

                    {/* Seat Legend */}
                    <div className="flex justify-center gap-6 mb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-gradient-to-br from-cyan-500 to-purple-600"></div>
                            <span className="text-sm text-gray-300">Selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-gray-800 border border-gray-600"></div>
                            <span className="text-sm text-gray-300">Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-gray-700/50 relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-3 h-[1px] bg-red-400 rotate-45"></div>
                                </div>
                            </div>
                            <span className="text-sm text-gray-300">Booked</span>
                        </div>
                    </div>

                    {/* Seat Grid */}
                    <div className="flex flex-col items-center">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {groupRows.map((group, idx) => (
                                <div key={idx} className="flex flex-col items-center">
                                    {group.map(row => renderSeats(row))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Selection Summary */}
                    {selectedSeats.length > 0 && (
                        <div className="mt-8 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                            <h3 className="text-lg font-semibold text-cyan-400 mb-4">Your Selection</h3>
                            <div className="flex flex-wrap gap-3 mb-4">
                                {selectedSeats.map(seat => (
                                    <span key={seat} className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-sm">
                                        {seat}
                                    </span>
                                ))}
                            </div>
                            <p className="text-gray-300">
                                <span className="font-medium">{selectedSeats.length}</span> seat{selectedSeats.length !== 1 ? 's' : ''} selected
                            </p>
                        </div>
                    )}

                    {/* Checkout Button */}
                    <div className="flex justify-center mt-12">
                        <button
                            onClick={bookTickets}
                            disabled={!selectedTime || !selectedSeats.length || isLoading}
                            className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold transition-all
                                ${!selectedTime || !selectedSeats.length || isLoading
                                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-lg hover:shadow-cyan-500/30'
                                }`}
                        >
                            {isLoading ? (
                                'Processing...'
                            ) : (
                                <>
                                    <Ticket className="w-5 h-5" />
                                    Proceed to Checkout - ${selectedSeats.length * 15}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatLayout;