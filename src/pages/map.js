import React, { useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { GoogleMap, HeatmapLayer, useLoadScript } from '@react-google-maps/api';

const libraries = ['visualization'];

const mapContainerStyle = {
  width: '100%',
  height: '100vh',
};

const center = {
  lat: 37.775,
  lng: -122.434,
};

export function Head() {
  // ...
}

export default function MapPage() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAuOhlWr5cxsZcvX6FSWA_mcEfGAGqE6u8', // Replace with your API key
    libraries,
  });

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading maps';

  const heatmapData = [
    { lat: 37.782551, lng: -122.445368 },
    { lat: 37.782745, lng: -122.444586 },
    { lat: 37.782842, lng: -122.443688 },
    { lat: 37.782919, lng: -122.442815 },
    { lat: 37.782992, lng: -122.442112 },
    { lat: 37.7831, lng: -122.441461 },
    { lat: 37.783206, lng: -122.440829 },
  ];

  return (
    <Layout>
      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={center}
        options={{ mapTypeId: 'satellite' }}
      >
        <HeatmapLayer data={heatmapData} />
      </GoogleMap>
    </Layout>
  );
}
