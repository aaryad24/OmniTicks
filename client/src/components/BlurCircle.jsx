import React from "react";

const BlurCircle = ({ 
  top = "0", 
  left = "0", 
  right = undefined, 
  bottom = undefined,
  width = "200", // Increased default size
  height = "200", // Increased default size
  blur = "xl", // Changed to standard blur size
  color = "primary",
  opacity = "30",
  className = ""
}) => {
  // Map blur sizes to Tailwind classes
  const blurMap = {
    sm: "blur-sm",
    md: "blur-md",
    lg: "blur-lg",
    xl: "blur-xl",
    "2xl": "blur-2xl",
    "3xl": "blur-3xl"
  };

  const colorMap = {
    primary: "bg-primary",
    cyan: "bg-cyan-500",
    purple: "bg-purple-500",
    pink: "bg-pink-500",
    custom: "bg-current"
  };

  const selectedColor = colorMap[color] || colorMap.primary;
  const selectedBlur = blurMap[blur] || blurMap.xl;

  return (
    <div
      className={`absolute filter ${selectedBlur} -z-10 rounded-full ${selectedColor} ${className}`}
      style={{ 
        top,
        left,
        right,
        bottom,
        width: `${width}px`,
        height: `${height}px`,
        opacity: opacity / 100
      }}
    />
  );
};

export default BlurCircle;