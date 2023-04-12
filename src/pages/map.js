import React, { useRef, useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { Loader } from '@googlemaps/js-api-loader';
import Papa from 'papaparse';

const mapContainerStyle = {
  width: '100%',
  height: '100vh',
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const apiKey = 'AIzaSyAuOhlWr5cxsZcvX6FSWA_mcEfGAGqE6u8';

async function getLatLngFromStreetName(streetName, apiKey) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      streetName
    )}&key=${apiKey}`
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
  const nonEmptyRows = results.data.filter(row => row.streetName.trim() !== '');
  const coordinates = [];

  for (const row of nonEmptyRows) {
    try {
      const latLng = await getLatLngFromStreetName(row.streetName, apiKey);
      coordinates.push(latLng);
    } catch (error) {
      console.error(`Failed to geocode street name "${row.streetName}":`, error);
    }
    await sleep(200); // Adjust the sleep time as needed (in milliseconds)
  }

  return coordinates;
}

export default function MapPage() {
  const mapRef = useRef();
  const [map, setMap] = useState(null);
  const [heatmap, setHeatmap] = useState(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: apiKey,
      version: 'weekly',
      libraries: ['visualization'],
    });

    loader.load().then(() => {
      const loadedMap = new google.maps.Map(mapRef.current, {
        zoom: 13,
        center: { lat: 32.248814, lng: -110.987419 },
        mapTypeId: 'satellite',
      });

      fetch('/CSV_TIME.csv')
        .then((response) => response.text())
        .then(async (csvData) => {
          const coordinates = await parseAndGeocodeCsv(csvData, apiKey);
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

 async function switchData(filterFunction) {
  const response = await fetch('/CSV_TIME.csv');
  const csvData = await response.text();
  const results = Papa.parse(csvData, { header: true });
  
  // Trim values and headers
  const trimmedHeaders = results.meta.fields.map(field => field.trim());
  const trimmedData = results.data.map(row => {
    const newRow = {};
    for (const key of Object.keys(row)) {
      newRow[key.trim()] = row[key].trim();
    }
    return newRow;
  });

  const filteredData = trimmedData.filter(filterFunction);
  const coordinates = [];

  for (const row of filteredData) {
    try {
      const latLng = await getLatLngFromStreetName(row.streetName, apiKey);
      coordinates.push(latLng);
    } catch (error) {
      console.error(`Failed to geocode street name "${row.streetName}":`, error);
    }
    await sleep(200); // Adjust the sleep time as needed (in milliseconds)
  }

  console.log('Filtered data:', filteredData, 'Coordinates:', coordinates);

  heatmap.setData(coordinates);
}

  function filterByVehicleCollision(data) {
  const allowedTypes = ['Vehicle / Vehicle'];
  const vehicleCollisionData = data.vehiclecollision || data.vehicleCollision || '';

  const result = allowedTypes.includes(vehicleCollisionData.trim());
  console.log('VehicleCollision filter:', data, result);
  return result;

  }

function filterByWeatherAndDay(data) {
  const allowedWeather = ['Rain', 'Clear', 'Cloudy', 'Sleet / HA'];
  const allowedDay = ['DayLight', 'Dark', 'Dusk', 'Dawn', 'Dark-Lighted', 'Dark-Not Lighted'];
  const result = allowedWeather.includes(data.Weather.trim().toUpperCase()) && allowedDay.includes(data.Day.trim().toUpperCase());
  console.log('WeatherAndDay filter:', data, result);
  return result;
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
