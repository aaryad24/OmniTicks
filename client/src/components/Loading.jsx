import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Loading = () => {

  const { nextUrl } = useParams()
  const navigate = useNavigate()

  useEffect(()=>{
    if(nextUrl){
      setTimeout(()=>{
        navigate('/' + nextUrl);
      },8000)
    }
  },[])

  return(
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-cyan-500/30 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-cyan-400 text-lg font-medium">Loading cinematic experience...</p>
    </div>
  )
};

export default Loading;