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
  const chartDescriptions = [
    `Chart (Days of the week): When analyzing the data we found there to be some small trend patterns in the data, In this particular case we noticed there to be a trend in the day of the accidents reported. When looking into the data we notice that throughout the week. Mon-Sun There was an uptrend from the start of the week with a climax on fridays being the most active for accidents and diminishing down to Sunday and Monday.`,
    `Chart (Time of day): Part of the project was also meant to help be more conscious of when to travel, so when taking a look at the times reported for these accidents we did find there was some standout times that more incidents were reported at. In this chart the frequency is displayed the data seems a bit skewed as times reported could’ve been rounded up or down with the reports. There are times of the day to be aware of and that's essentially rush hour, around 5pm-7pm seemed to be the most reported incidents time, drivers focused on avoiding accidents could find themselves a bit safer at the early morning hours from 4am-7am and 12pm-3:30pm seemed to be the safest of the afternoon time.`,
    `Chart (Light conditions): When looking at the data, Most of the incidents reported were during daylight hours or largely in areas with some sort of street light, It was an interesting split as with traffic incidents reported in the time of day chart seemed to dwindle down after about 6:30PM, so to see such a large portion still reported in night conditions unexpected.With this we would advise drivers to use their own discretion when driving in different lighting conditions.`,
  ];

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
          {[picture1, picture2, chart3].map((image, index)
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
              <p className="text-justify text-sm mt-2">{chartDescriptions[index]}</p>
            </div>
          ))}
        </div>
      </article>
    </Layout>
  );
}
