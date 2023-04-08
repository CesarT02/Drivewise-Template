import React, { useRef, useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { Loader } from '@googlemaps/js-api-loader';

const mapContainerStyle = {
  width: '100%',
  height: '100vh',
};

export function Head() {
  // ...
}

export default function MapPage() {
  const mapRef = useRef();
  const [map, setMap] = useState(null);
  const [heatmap, setHeatmap] = useState(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: 'AIzaSyAuOhlWr5cxsZcvX6FSWA_mcEfGAGqE6u8', // Replace with your API key
      version: 'weekly',
      libraries: ['visualization'],
    });

    loader.load().then(() => {
      const newMap = new google.maps.Map(mapRef.current, {
        zoom: 13,
        center: { lat: 37.775, lng: -122.434 },
        mapTypeId: 'satellite',
      });

      setMap(newMap);

      const newHeatmap = new google.maps.visualization.HeatmapLayer({
        data: getPoints(),
        map: newMap,
      });

      setHeatmap(newHeatmap);
    });
  }, []);

  function toggleHeatmap() {
    if (heatmap) {
      heatmap.setMap(heatmap.getMap() ? null : map);
    }
  }

  // Other functions remain the same.

  function getPoints() {
    return [
      new google.maps.LatLng(37.782551, -122.445368),
      new google.maps.LatLng(37.782745, -122.444586),
    ];
  }

  return (
    <Layout>
      <button id="toggle-heatmap" onClick={toggleHeatmap}>
        Toggle Heatmap
      </button>
      <button id="change-gradient" onClick={changeGradient}>
        Change Gradient
      </button>
      <button id="change-opacity" onClick={changeOpacity}>
        Change Opacity
      </button>
      <button id="change-radius" onClick={changeRadius}>
        Change Radius
      </button>
      <div ref={mapRef} style={mapContainerStyle} />
    </Layout>
  );
}

