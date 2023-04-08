import React, { useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { GoogleMap, HeatmapLayer, useLoadScript } from '@react-google-maps/api';

const libraries = ['visualization'];

const mapContainerStyle = {
  width: '100%',
  height: '100vh',
};

const center = {
  lat: 32.2319,
  lng: -110.9501,
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
    { lat:32.236103, lng: -110.944093 },
     { lat:32.236103, lng: -110.944093 },
     { lat:32.236103, lng: -110.944093 },
     { lat:32.236103, lng: -110.944093 },
     { lat:32.236103, lng: -110.944093 },
     { lat:32.236103, lng: -110.944093 },
     { lat:32.236103, lng: -110.944093 },
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
      <HeatmapLayer
        data={heatmapData}
        options={{
          radius: 50, // Adjust the radius as needed
          opacity: 0.8, // Adjust the opacity as needed
        }}
      />
    </GoogleMap>
  </Layout>
);
