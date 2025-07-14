import React, { useState, useEffect, useRef, useMemo } from "react";
import { Clock, ArrowRight, Ticket } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Environment, Sparkles, Stars, useTexture } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import Loading from "../components/Loading";
import isoTimeFormat from "../lib/isoTimeFormat";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import { fetchUpcomingMovies, fetchGenres } from "../services/tmdb";

const HolographicSeat = React.memo(({ position, seatId, isSelected, isOccupied, onClick }) => {
  const groupRef = useRef();
  const hoverState = useRef(false);
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const yOffset = position[1] + Math.sin(clock.getElapsedTime() * 2 + seatId.charCodeAt(0)) * 0.05;
    groupRef.current.position.y = yOffset;
    groupRef.current.scale.x = THREE.MathUtils.lerp(
      groupRef.current.scale.x,
      hoverState.current ? 1.1 : 1,
      0.1
    );
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isOccupied) onClick(seatId);
  };

  return (
    <group 
      ref={groupRef}
      position={position}
      rotation={[0, 0, 0]}
      onClick={handleClick}
      onPointerOver={() => !isOccupied && (hoverState.current = true)}
      onPointerOut={() => (hoverState.current = false)}
    >
      <mesh castShadow>
        <boxGeometry args={[0.9, 0.4, 0.9]} />
        <meshStandardMaterial 
          color={isSelected ? '#7e22ce' : isOccupied ? '#374151' : '#1f2937'}
          roughness={0.4}
          metalness={0.8}
          emissive={isSelected ? '#7e22ce' : '#000000'}
          emissiveIntensity={isSelected ? 1 : 0}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      <mesh position={[0, 0.6, 0.6]} castShadow>
        <boxGeometry args={[0.9, 1, 0.1]} />
        <meshStandardMaterial 
          color={isSelected ? '#6366f1' : isOccupied ? '#1f2937' : '#374151'}
          roughness={0.5}
          metalness={0.7}
          emissive={isSelected ? '#6366f1' : '#000000'}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>
      
      <Float speed={1} floatIntensity={0.5}>
        <Text
          position={[0, 1.4, 1]}
          fontSize={0.25}
          color={isSelected ? 'white' : isOccupied ? '#ef4444' : '#d1d5db'}
          anchorX="center"
          anchorY="middle"
          outlineColor="#000000"
          outlineWidth={0.01}
        >
          {isOccupied ? 'X' : seatId}
        </Text>
      </Float>
    </group>
  );
});

const CosmicScreen = ({ currentMovie }) => {
  const { image_base_url } = useAppContext();
  const [posterError, setPosterError] = useState(false);
  
  // Use the context's image_base_url with the correct poster size
  const posterUrl = currentMovie?.poster_path 
    ? `${image_base_url}w500${currentMovie.poster_path}`
    : null;

  // Apply texture or fallback
  const posterTexture = useTexture(
    posterError || !posterUrl ? '/squidMINI.jpg' : posterUrl
  );


  return (
    <group position={[0, 6.2, -20]}>
      <mesh rotation={[0, 0, 0]}>
        <planeGeometry args={[25, 12]} />
        <meshStandardMaterial 
          map={posterTexture}
          emissive="#4f46e5"
          emissiveIntensity={0.5}
          side={THREE.DoubleSide}
          transparent
          opacity={0.9}
          // Handle texture loading errors
          onError={() => setPosterError(true)}
        />
      </mesh>
      <Text
        position={[0, -5.5, 0.1]}
        fontSize={1.5}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineColor="#000000"
        outlineWidth={0.05}
      >
        {currentMovie?.title || 'NOW SHOWING'}
      </Text>
      {currentMovie && (
        <group position={[0, -7, 0]}>
          <Text
            fontSize={0.8}
            color="#a5b4fc"
            anchorX="center"
            anchorY="middle"
            maxWidth={20}
            lineHeight={1}
            letterSpacing={0.02}
          >
            {`${currentMovie.release_date?.split('-')[0] || ''} • ${currentMovie.genreNames?.slice(0, 2).join(', ') || ''}`}
          </Text>
        </group>
      )}
    </group>
  );
};

const CosmicTheater = React.memo(({ 
  groupRows, 
  selectedSeats, 
  occupiedSeats, 
  handleSeatClick,
  currentMovie
}) => {
  const seatsPerRow = 10;
  const seats = useMemo(() => {
    return groupRows.flat().map((row, rowIndex) => 
      Array.from({ length: seatsPerRow }).map((_, seatIndex) => ({
        seatId: `${row}${seatIndex + 1}`,
        position: [(seatIndex - seatsPerRow/2) * 1.3, 0, rowIndex * 1.8],
        isSelected: selectedSeats.includes(`${row}${seatIndex + 1}`),
        isOccupied: occupiedSeats.includes(`${row}${seatIndex + 1}`)
      }))
    ).flat();
  }, [groupRows, selectedSeats, occupiedSeats]);

  return (
    <Canvas 
      shadows
      camera={{ position: [0, 15, 25], fov: 45 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ 
        height: '600px', 
        background: 'linear-gradient(to bottom, #000000, #111827)',
        borderRadius: '12px'
      }}
    >
      <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={150} scale={20} size={3} speed={0.1} color="#6366f1" />
      
      <EffectComposer>
        <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} height={300} intensity={0.8} />
      </EffectComposer>

      <ambientLight intensity={0.4} color="#6366f1" />
      <spotLight
        position={[0, 25, 10]}
        angle={0.3}
        penumbra={1}
        intensity={1.5}
        castShadow
        shadow-mapSize={1024}
        shadow-bias={-0.001}
        color="#818cf8"
      />
      <pointLight position={[-10, 5, 10]} intensity={0.6} color="#c4b5fd" />
      <pointLight position={[10, 5, 10]} intensity={0.6} color="#c4b5fd" />
      
      <Environment preset="city" />
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial 
          color="#111827"
          roughness={0.8}
          metalness={0.3}
          emissive="#1e293b"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      <CosmicScreen currentMovie={currentMovie} />
      
      <group position={[0, 0, 0]}>
        {seats.map((seat) => (
          <HolographicSeat
            key={seat.seatId}
            position={seat.position}
            seatId={seat.seatId}
            isSelected={seat.isSelected}
            isOccupied={seat.isOccupied}
            onClick={handleSeatClick}
          />
        ))}
      </group>
      
      <Float speed={3} rotationIntensity={0.5} floatIntensity={2}>
        <mesh position={[8, 3, -5]}>
          <torusGeometry args={[1, 0.3, 16, 32]} />
          <meshStandardMaterial 
            color="#6366f1" 
            wireframe 
            emissive="#818cf8"
            emissiveIntensity={0.8}
          />
        </mesh>
      </Float>
      
      <Float speed={4} rotationIntensity={0.7} floatIntensity={1.5}>
        <mesh position={[-7, 2, -8]}>
          <icosahedronGeometry args={[1]} />
          <meshStandardMaterial 
            color="#60a5fa" 
            wireframe 
            emissive="#3b82f6"
            emissiveIntensity={0.6}
          />
        </mesh>
      </Float>
      
      <OrbitControls 
        enableZoom={true}
        minDistance={15}
        maxDistance={50}
        enablePan={false}
        autoRotate={true}
        autoRotateSpeed={0.3}
      />
    </Canvas>
  );
});

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
    const [currentMovie, setCurrentMovie] = useState(null);
    const MAX_SEATS = 5;

    const getShow = async () => {
        try {
            const { data } = await axios.get(`/api/show/${id}`);
            if (data.success) setShow(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load show details");
        }
    };

    const handleSeatClick = (seatId) => {
        if (!selectedTime) return toast("Please select a showtime first");
        if (occupiedSeats.includes(seatId)) return toast.error('This seat is already booked');
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
            if (data.success) setOccupiedSeats(data.occupiedSeats);
        } catch (error) {
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

            if (data.success) window.location.href = data.url;
        } catch (error) {
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

    useEffect(() => {
        if (selectedTime && show) {
            setCurrentMovie(show.movieDetails);
        }
    }, [selectedTime, show]);

    if (!show) return <Loading />;

    return (
        <div className="relative px-4 md:px-8 lg:px-12 py-25 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-20">
                <Canvas>
                    <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
                    <Sparkles count={100} scale={20} size={3} speed={0.1} color="#6366f1" />
                </Canvas>
            </div>
            
            <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 z-10">
                <div className="bg-gray-900/80 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6 h-fit lg:sticky lg:top-8 shadow-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <Clock className="w-6 h-6 text-purple-400" />
                        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                            Available Showtimes
                        </h2>
                    </div>
                    
                    <div className="space-y-2">
                        {show.dateTime[date]?.map((item) => (
                            <button
                                key={item.time}
                                onClick={() => setSelectedTime(item)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 border
                                    ${selectedTime?.time === item.time
                                        ? 'bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white shadow-lg border-transparent'
                                        : 'bg-gray-800/50 hover:bg-gray-800 border-gray-600 hover:border-purple-400'
                                    }`}
                            >
                                <span className="text-sm font-medium">
                                    {isoTimeFormat(item.time)}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
                            Select Your Seats
                        </h1>
                        <p className="text-gray-400">Choose up to {MAX_SEATS} seats</p>
                    </div>
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

                    <CosmicTheater
                        groupRows={groupRows}
                        selectedSeats={selectedSeats}
                        occupiedSeats={occupiedSeats}
                        handleSeatClick={handleSeatClick}
                        currentMovie={currentMovie}
                    />

                    {selectedSeats.length > 0 && (
                        <div className="mt-6 p-6 bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-lg">
                            <h3 className="text-lg font-semibold text-purple-400 mb-4">Your Selection</h3>
                            <div className="flex flex-wrap gap-3 mb-4">
                                {selectedSeats.map(seat => (
                                    <span key={seat} className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm font-medium">
                                        {seat}
                                    </span>
                                ))}
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-gray-300">
                                    <span className="font-medium">{selectedSeats.length}</span> seat{selectedSeats.length !== 1 ? 's' : ''} selected
                                </p>
                                <p className="text-xl font-bold text-white">
                                    ${selectedSeats.length * 15}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center mt-8">
                        <button
                            onClick={bookTickets}
                            disabled={!selectedTime || !selectedSeats.length || isLoading}
                            className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02]
                                ${!selectedTime || !selectedSeats.length || isLoading
                                    ? 'bg-gray-800/50 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg hover:shadow-purple-500/30'
                                }`}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                <>
                                    <Ticket className="w-5 h-5" />
                                    Proceed to Checkout
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
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