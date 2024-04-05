import React from 'react';
import background3 from '../../assets/background3.png';

const BgImage = ({ children }) => {
  const bgURL = `url(${background3})`; // Update the URL syntax

  return (
    <div
      className="bg-cover bg-center h-screen"
      style={{ backgroundImage: bgURL }} // Set the background image using inline style
    >
      {children}
    </div>
  );
};

export default BgImage;
