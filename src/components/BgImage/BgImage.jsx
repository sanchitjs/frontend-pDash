import React from 'react';
import background3 from '../../assets/background3.png';

const BgImage = ({ children }) => {
  const bgURL = `url(${background3})`; // Update the URL syntax

  return (
    <div
      className="min-[921px]:bg-cover max-[920px]:bg-no-repeat max-[920px]:fixed max-[920px]:bg-[center_-9vh] h-screen"
      style={{ backgroundImage: bgURL }} // Set the background image using inline style
    >
      {children}
    </div>
  );
};

export default BgImage;
