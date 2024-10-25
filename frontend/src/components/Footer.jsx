import React from 'react';
import footerImage from "../assets/DP.jpeg";

function Footer() {
  return (
    <div className="flex flex-row flex-wrap justify-between items-center bg-gray-100 max-h-1/4 p-4 md:p-8 lg:p-12">
      <div className="text-gray-600 hover:text-[60px] flex flex-col gap-4 md:gap-6 text-3xl md:text-4xl lg:text-5xl px-4 md:px-8 lg:px-12">
        <p>SELL</p>
        <p>ON</p>
        <p>E-COMMERCE</p>
      </div>
      <div className="px-4 md:px-8 lg:px-12">
        <img src={footerImage} className="w-[150px] md:w-[300px] lg:w-[400px]" alt="Footer" />
      </div>
    </div>
  );
}

export default Footer;
