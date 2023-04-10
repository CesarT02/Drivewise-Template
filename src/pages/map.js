import React, { useRef, useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { Loader } from '@googlemaps/js-api-loader';
import Papa from 'papaparse';

const mapContainerStyle = {
  width: '100%',
  height: '100vh',
};

async function getLatLngFromStreetName(streetName,AIzaSyAuOhlWr5cxsZcvX6FSWA_mcEfGAGqE6u8 ) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      streetName
    )}&key=${AIzaSyAuOhlWr5cxsZcvX6FSWA_mcEfGAGqE6u8}`
  );
  const data = await response.json();
  if (data.status === 'OK' && data.results.length > 0) {
    const location = data.results[0].geometry.location;
    return new google.maps.LatLng(location.lat, location.lng);
  } else {
    throw new Error('Failed to geocode street name');
  }
}

async function parseAndGeocodeCsv(csvData, apiKey) {
  const results = Papa.parse(csvData, { header: true });
  const coordinatesPromises = results.data.map((row) =>
    getLatLngFromStreetName(row.streetName, apiKey)
  );
  const coordinates = await Promise.all(coordinatesPromises);
  return coordinates;
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

      fetch('../components/cord-data/CSV_TIME.csv')
        .then((response) => response.text())
        .then(async (csvData) => {
          const coordinates = await parseAndGeocodeCsv(csvData, AIzaSyAuOhlWr5cxsZcvX6FSWA_mcEfGAGqE6u8);
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

  function switchData(filterFunction) {
    fetch('../components/cord-data/data.csv')
      .then((response) => response.text())
      .then((csvData) => {
        const results = Papa.parse(csvData, { header: true });
        const filteredData = results.data.filter(filterFunction);
        const coordinates = filteredData.map((row) => new google.maps.LatLng(row.lat, row.lng));

        heatmap
                .setData(coordinates);
    });
  }

  function filterByVehicleCollision(data) {
    const allowedTypes = [
      'Vehicle / Vehicle',
      'Vehicle / Bicycle',
      'Vehicle / Pedestrian',
      'Single Vehicle',
      'Motorcycle / Vehicle',
      'Vehicle / Motorcycle',
      'Single Motorcycle',
    ];

    return allowedTypes.includes(data.vehiclecollision);
  }

  function filterByWeatherAndDay(data) {
    const allowedWeather = ['rain', 'clear', 'cloudy'];
    const allowedDay = ['light', 'dark', 'dusk'];

    return allowedWeather.includes(data.weather) && allowedDay.includes(data.day);
  }

  function switchToVehicleCollisionData() {
    switchData(filterByVehicleCollision);
  }

  function switchToWeatherAndDayData() {
    switchData(filterByWeatherAndDay);
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
      <button id="switch-to-vehicle-collision-data" onClick={switchToVehicleCollisionData}>
        Switch to Vehicle Collision Data
      </button>
      <button id="switch-to-weather-and-day-data" onClick={switchToWeatherAndDayData}>
        Switch to Weather and Day Data
      </button>
      <div ref={mapRef} style={mapContainerStyle} />
    </Layout>
  );
}
