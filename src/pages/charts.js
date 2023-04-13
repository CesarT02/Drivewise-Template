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

  const handleMouseEnter = (index) => {
    setHoveredImage(index);
  };

  const handleMouseLeave = () => {
    setHoveredImage(null);
  };

  return (
    <Layout>
      <article className="space-y-2">
        <h2 className="text-xl font-bold underline">Charts</h2>
        <p>Charts go here:</p>
        <div className="flex flex-wrap justify-center">
          {[chart1, chart2, chart3].map((image, index) => (
            <div
              className={`w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 px-4 mb-4 ${
                hoveredImage === index ? 'w-full h-full fixed top-0 left-0 z-50' : ''
              }`}
              key={index}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative overflow-hidden" style={{ paddingBottom: '100%' }}>
                <img
                  src={image}
                  alt={`Image ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-in-out"
                  style={{
                    transform: hoveredImage === index ? 'scale(1)' : 'scale(1)',
                  }}
                />
              </div>
              <p className="text-center mt-2">Text under image {index + 1}</p>
            </div>
          ))}
        </div>
      </article>
    </Layout>
  );
}
