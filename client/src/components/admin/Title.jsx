import React from 'react';

const Title = ({ 
  text1, 
  text2,
  className = "",
  highlightStyle = "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400",
  as: Component = "h1"
}) => (
  <Component className={`text-3xl md:text-4xl font-bold tracking-tight ${className}`}>
    {text1 && (
      <span className="text-gray-300">
        {text1}{' '}
      </span>
    )}
    {text2 && (
      <span className={`${highlightStyle}`}>
        {text2}
      </span>
    )}
  </Component>
);

export default Title;