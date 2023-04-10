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
        <div className="flex flex-wrap justify-center">
          <div className="w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 px-4 mb-4">
            <img
              src={chart1}
              alt="First Image"
              className="w-full transition-transform duration-300 ease-in-out transform hover:scale-120"
            />
            <p className="text-center mt-2">Text under first image</p>
          </div>
          <div className="w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 px-4 mb-4">
            <img
              src={chart2}
              alt="Second Image"
              className="w-full transition-transform duration-300 ease-in-out transform hover:scale-120"
            />
            <p className="text-center mt-2">Text under second image</p>
          </div>
          <div className="w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 px-4 mb-4">
            <img
              src={chart3}
              alt="Third Image"
              className="w-full transition-transform duration-300 ease-in-out transform hover:scale-120"
            />
            <p className="text-center mt-2">Text under third image</p>
          </div>
        </div>
      </article>
    </Layout>
  );
}

