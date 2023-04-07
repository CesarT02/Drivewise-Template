
import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const GoogleMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const initMap = () => {
      const map = new google.maps.Map(mapRef.current, {
        zoom: 4,
        center: { lat: -28, lng: 137 },
      });

      map.data.loadGeoJson(
        'https://storage.googleapis.com/mapsdevsite/json/google.json'
      );
    };

    const loader = new Loader({
      apiKey: 'AIzaSyAuOhlWr5cxsZcvX6FSWA_mcEfGAGqE6u8', // Replace with your actual Google Maps API key
      version: 'weekly',
    });

    loader
      .load()
      .then(() => {
        initMap();
      })
      .catch((error) => {
        console.error('Error loading Google Maps API:', error);
      });

    return () => {
      // Clean up
    };
  }, []);

  return <div id="map" ref={mapRef} style={{ width: '100%', height: '100%' }}></div>;
};

export default GoogleMap;

