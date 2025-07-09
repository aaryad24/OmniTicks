import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { ArrowRight } from "lucide-react";

const CinemaHallSection = () => {
  const navigate = useNavigate();
  const { shows } = useAppContext();

  const halls = [
    { 
      name: 'IMAX', 
      description: 'Immerse yourself in crystal-clear images on our giant screens with laser-aligned sound',
      features: ['Laser projection', '12-channel sound', 'Huge screens']
    },
    { 
      name: 'Dolby Cinema', 
      description: 'Experience dramatic imaging and incredible sound with Dolby Vision and Atmos',
      features: ['Dolby Vision', 'Dolby Atmos', 'Comfort seating']
    },
    { 
      name: '4DX', 
      description: 'Multi-sensory experience with motion seats and environmental effects',
      features: ['Motion seats', 'Water/air effects', 'Scent effects']
    }
  ];

  return (
    <section className="py-20 px-6 md:px-12 lg:px-24 bg-gray-900 relative">
      {/* Background image with reduced opacity */}
      <div className="absolute inset-0 bg-[url('/alice.jpg')] bg-cover opacity-20"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-4xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          Our Cinema Halls
        </h2>
        <p className="text-gray-300 mb-16 max-w-2xl mx-auto text-center">
          Experience movies in our state-of-the-art theaters
        </p>

        {/* Timeline layout for cinema halls */}
        <div className="relative">
          {/* Timeline line - updated to purple/cyan gradient */}
          <div className="absolute left-4 h-full w-0.5 bg-gradient-to-b from-purple-500 to-cyan-500"></div>
          
          {halls.map((hall, index) => (
            <div 
              key={hall.name} 
              className="relative pl-12 pb-12 group cursor-pointer"
              onClick={() => navigate('/theaters')}
            >
              {/* Timeline dot - updated to cyan */}
              <div className="absolute left-0 w-4 h-4 rounded-full bg-cyan-500 transform translate-x-[-50%] group-hover:scale-150 transition-all"></div>
              
              <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700 group-hover:border-cyan-400 transition-all">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-shrink-0">
                    <div className="text-cyan-400 text-3xl font-bold mb-2">0{index+1}</div>
                    <h3 className="text-2xl font-bold mb-2 text-white">{hall.name}</h3>
                  </div>
                  <div>
                    <p className="text-gray-300 mb-4">{hall.description}</p>
                    <ul className="flex flex-wrap gap-2">
                      {hall.features.map((feature, i) => (
                        <li key={i} className="px-3 py-1 bg-cyan-900/30 text-cyan-300 rounded-full text-sm">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button - updated to purple/cyan gradient */}
        <div className="flex justify-center mt-16">
          <button 
            onClick={() => navigate('/theaters')}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 rounded-lg font-bold flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
          >
            View All Theaters
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CinemaHallSection;