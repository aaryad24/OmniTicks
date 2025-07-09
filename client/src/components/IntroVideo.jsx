import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

const IntroVideo = ({ children }) => {
  const [appReady, setAppReady] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    // Check localStorage and set states synchronously
    const firstVisit = localStorage.getItem('firstVisit');
    
    if (!firstVisit) {
      setShowVideo(true);
      localStorage.setItem('firstVisit', 'false');
      document.body.style.overflow = 'hidden'; // Lock scroll
    }
    
    setAppReady(true); // Mark app as ready
    
    return () => {
      document.body.style.overflow = ''; // Cleanup
    };
  }, []);

  const handleVideoEnd = () => {
    setShowVideo(false);
    document.body.style.overflow = '';
  };

  if (!appReady) {
    // Show blank screen until we know what to display
    return <div className="fixed inset-0 bg-black z-[9999]" />;
  }

  return (
    <>
      {showVideo ? (
        <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
          <div className="w-full  aspect-video">
            <ReactPlayer
              url="/intro.mp4"
              playing={true}
              controls={false}
              width="100%"
              height="100%"
              onEnded={handleVideoEnd}
              muted={true}
              playsinline
              config={{
                file: {
                  attributes: {
                    preload: 'auto'
                  }
                }
              }}
            />
          </div>
          
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default IntroVideo;