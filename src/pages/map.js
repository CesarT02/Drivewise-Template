import React, { useRef, useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { Loader } from '@googlemaps/js-api-loader';
import Papa from 'papaparse';

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
        center: { lat: 32.248814, lng: -110.987419 },
        mapTypeId: 'satellite',
      });

      fetch('../components/cord-data/data.csv')
        .then((response) => response.text())
        .then((csvData) => {
          const results = Papa.parse(csvData, { header: true });
          const coordinates = results.data.map((row) => new google.maps.LatLng(row.lat, row.lng));

          const loadedHeatmap = new google.maps.visualization.HeatmapLayer({
            data: coordinates,
            map: loadedMap,
          });

          setMap(loadedMap);
          setHeatmap(loadedHeatmap);
        });
    });
  }, []);

  function toggleHeatmap() {
    if (heatmap) {
      heatmap.setMap(heatmap.getMap() ? null : map);
    }
  }

  function changeGradient() {
    const gradient = [
      'rgba(0, 255, 255, 0)',
      'rgba(0, 255, 255, 1)',
      'rgba(0, 191, 255, 1)',
      'rgba(0, 127, 255, 1)',
      'rgba(0, 63, 255, 1)',
      'rgba(0, 0, 255, 1)',
      'rgba(0, 0, 223, 1)',
      'rgba(0, 0, 191, 1)',
      'rgba(0, 0, 159, 1)',
      'rgba(0, 0, 127, 1)',
      'rgba(63, 0, 91, 1)',
      'rgba(127, 0, 63, 1)',
      'rgba(191, 0, 31, 1)',
      'rgba(255, 0, 0, 1)',
    ];

    heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
  }

  function changeRadius() {
    heatmap.set('radius', heatmap.get('radius') ? null : 20);
  }

  function changeOpacity() {
    heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
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
