import React from 'react';
import Layout from '../components/Layout/Layout';

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
            <img src="../images/chart1.png" alt="First Image" className="w-full" />
            <img src="../images/chart-2.png" alt="Second Image" className="w-full" />
            <img src="../images/chart-3.png" alt="Third Image" className="w-full" />
            <p className="text-center mt-2">Text under first image</p>
        </div>
      </article>
    </Layout>
  );
}
