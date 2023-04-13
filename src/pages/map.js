import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import chart1 from '../images/chart1.png';
import chart2 from '../images/chart-2.png';
import chart3 from '../images/chart-3.png';

export function Head() {
  return (
    <>
      <title>Charts | Group 8</title>
      <meta name="description" content="Group 8" />
      <link rel="canonical" href="www.drivewise.site/charts" />
    </>
  );
}

export default function ChartsPage() {
  const [hoveredImage, setHoveredImage] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (index) => {
    setHoveredImage(index);
  };

  const handleMouseLeave = () => {
    setHoveredImage(null);
  };

  const handleMouseMove = (event) => {
    setCursorPosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <Layout>
      <article className="space-y-2">
        <h2 className="text-xl font-bold underline">Charts</h2>
        <p>Charts go here:</p>
        <div className="flex flex-wrap justify-center">
          {[chart1, chart2, chart3].map((image, index) => (
            <div className="w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 px-4 mb-4" key={index}>
              <img
                src={image}
                alt={`Image ${index + 1}`}
                className="w-full cursor-pointer"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              />
              <p className="text-center mt-2">Text under image {index + 1}</p>
            </div>
          ))}
        </div>
        {hoveredImage !== null && (
          <div
            className="fixed z-50 p-2 bg-white border border-gray-200 shadow-lg"
            style={{
              top: cursorPosition.y + 15,
              left: cursorPosition.x + 15,
              transform: 'translateX(-50%)',
              maxWidth: 'calc(100% - 30px)',
            }}
          >
            <img src={[chart1, chart2, chart3][hoveredImage]} alt={`Image ${hoveredImage + 1}`} className="w-full" />
          </div>
        )}
      </article>
    </Layout>
  );
}
