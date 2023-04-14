import React from "react";
import Layout from "../components/Layout/Layout";
import picture1 from "../images/Picture1.png";
import picture2 from "../images/Picture2.png";
import chart3 from "../images/chart-3.png";

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
        
        <style jsx>
          <style jsx>{`
  .image-container {
    position: relative;
  }

  .image-container:hover .hovered-image {
    display: block;
  }

  .hovered-image {
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    max-width: calc(80vw - 2rem);
    max-height: calc(80vh - 2rem);
    object-fit: contain;
    background-color: rgba(255, 255, 255, 0.95);
    padding: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 0.5rem;
  }
`}</style>
        </style>
        <div className="flex flex-wrap justify-center">
          {[picture1, picture2, chart3].map((image, index) => (
            <div
              className="w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 px-4 mb-4"
              key={index}
            >
              <div className="image-container">
                <img
                  src={image}
                  alt={`Image ${index + 1}`}
                  className="w-full cursor-pointer"
                />
                <img
                  src={image}
                  alt={`Image ${index + 1}`}
                  className="hovered-image"
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
