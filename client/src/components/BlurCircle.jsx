import React from "react";

const BlurCircle = ({ top = "auto", left = "auto", right = "auto", bottom = "auto" }) => {
  return (
	<div
	  className="absolute -z-50 w-58 h-58 blur-3xl aspect-square rounded-full bg-primary/30"
	  style={{ top: top, left: left, right: right, bottom: bottom}}
	></div>
  );
};

export default BlurCircle;