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
          .chart-container {
            position: relative;
            overflow: hidden;
            padding-bottom: 100%;
          }

          .chart-container img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease-in-out;
          }

          .chart-container:hover img {
            transform: scale(3.5);
            z-index: 1;
          }
        `}</style>
        <div className="flex flex-wrap justify-center">
          {[chart1, chart2, chart3].map((image, index) => (
            <div className="w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 px-4 mb-4" key={index}>
              <div className="chart-container">
                <img src={image} alt={`Image ${index + 1}`} />
              </div>
              <p className="text-center mt-2">Text under image {index + 1}</p>
            </div>
          ))}
        </div>
      </article>
    </Layout>
  );
}
