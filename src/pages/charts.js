import React from 'react';
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
  return (
    <Layout>
      <article className="space-y-2">
        <h2 className="text-xl font-bold underline">Charts</h2>
        <p>Charts go here:</p>
        <style jsx>{`
          .image-container {
            position: relative;
          }

          .image-container:hover .hovered-image {
            display: block;
          }

          .hovered-image {
            display: none;
            position: absolute;
            z-index: 10;
            max-width: calc(100vw - 2rem);
            max-height: calc(100vh - 2rem);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
        `}</style>
        <div className="flex flex-wrap justify-center">
          {[chart1, chart2, chart3].map((image, index) => (
            <div className="w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 px-4 mb-4" key={index}>
              <div className="image-container">
                <img src={image} alt={`Image ${index + 1}`} className="w-full cursor-pointer" />
                <img src={image} alt={`Image ${index + 1}`} className="hovered-image" />
              </div>
              <p className="text-center mt-2">Text under image {index + 1}</p>
            </div>
          ))}
        </div>
      </article>
    </Layout>
  );
}

