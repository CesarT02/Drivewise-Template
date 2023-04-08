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
      const loadedMap = new google.maps.Map(mapRef.current, {
        zoom: 13,
        center: { lat: 37.775, lng: -122.434 },
        mapTypeId: 'satellite',
      });

      const loadedHeatmap = new google.maps.visualization.HeatmapLayer({
        data: getPoints(),
        map: loadedMap,
      });

      setMap(loadedMap);
      setHeatmap(loadedHeatmap);
    });
  }, []);

  function toggleHeatmap() {
    heatmap.setMap(heatmap.getMap() ? null : map);
  }

  // ... (Other functions)

  return (
    <Layout>
      <button id="toggle-heatmap" onClick={toggleHeatmap}>
        Toggle Heatmap
      </button>
      {/* ... (Other buttons) */}
      <div ref={mapRef} style={mapContainerStyle} />
    </Layout>
  );
}
