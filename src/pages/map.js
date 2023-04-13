import React, { useRef, useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { Loader } from "@googlemaps/js-api-loader";
import Papa from "papaparse";

const mapContainerStyle = {
  width: "100%",
  height: "100vh",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const apiKey = "AIzaSyAuOhlWr5cxsZcvX6FSWA_mcEfGAGqE6u8";

async function getLatLngFromStreetName(streetName, apiKey) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      streetName
    )}&key=${apiKey}`
  );
  const data = await response.json();
  if (data.status === "OK" && data.results.length > 0) {
    const location = data.results[0].geometry.location;
    return new google.maps.LatLng(location.lat, location.lng);
  } else {
    throw new Error("Failed to geocode street name");
  }
}

async function parseAndGeocodeCsv(csvData, apiKey, filterFunction) {
  const results = Papa.parse(csvData, { header: true });
  const nonEmptyRows = results.data.filter(
    (row) => row.streetName.trim() !== ""
  );
  const filteredRows = nonEmptyRows.filter(filterFunction);
  const coordinates = [];

  for (const row of filteredRows) {
    try {
      const latLng = await getLatLngFromStreetName(row.streetName, apiKey);
      coordinates.push(latLng);
    } catch (error) {
      console.error(
        `Failed to geocode street name "${row.streetName}":`,
        error
      );
    }
    await sleep(200); // Adjust the sleep time as needed (in milliseconds)
  }

  return coordinates;
}

function createCustomGradient(colors) {
  const gradient = colors
    .map((color) => `rgba(${color.join(",")}, 0)`)
    .concat(colors.map((color) => `rgba(${color.join(",")}, 1)`));
  return gradient;
}

export default function MapPage() {
  const mapRef = useRef();
  const [map, setMap] = useState(null);
  const [heatmap, setHeatmap] = useState(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: apiKey,
      version: "weekly",
      libraries: ["visualization"],
    });

    loader.load().then(() => {
      const loadedMap = new google.maps.Map(mapRef.current, {
        zoom: 13,
        center: { lat: 32.248814, lng: -110.987419 },
        mapTypeId: "satellite",
      });

      setMap(loadedMap);
    });
  }, []);

  async function loadHeatmapData(filterFunction, gradientColors) {
    const csvResponse = await fetch("/CSV_TIME.csv");
    const csvData = await csvResponse.text();
    const coordinates = await parseAndGeocodeCsv(
      csvData,
      apiKey,
      filterFunction
    );
    console.log("Coordinates length:", coordinates.length); 

    if (heatmap) {
      heatmap.setMap(null);
    }

    const newHeatmap = new google.maps.visualization.HeatmapLayer({
      data: coordinates,
      map,
      gradient: gradientColors ? createCustomGradient(gradientColors) : null,
    });

    setHeatmap(newHeatmap);
  }

function filterByVehicleCollision(data) {
  const allowedTypes = ["Vehicle/Vehicle"];
  const vehicleCollisionData = data.Collision || "";

  const result = allowedTypes.includes(vehicleCollisionData.trim());
  console.log("VehicleCollision filter:", data, result);
  return result;
}

function filterByWeatherAndDay(data) {
  const allowedWeather = ["Rain", "Clear", "Cloudy", "Sleet / HA"];
  const allowedDay = [
    "DayLight",
    "Dark",
    "Dusk",
    "Dawn",
    "Dark-Lighted",
    "Dark-Not Lighted",
  ];
  const result =
    allowedWeather.includes(data.Weather.trim()) &&
    allowedDay.includes(data.Day.trim());
  console.log("WeatherAndDay filter:", data, result);
  return result;
}

 function switchToVehicleCollisionData() {
  loadHeatmapData(filterByVehicleCollision, [
    [0, 255, 255],
    [0, 191, 255],
    [0, 127, 255],
    [0, 63, 255],
    [0, 0, 255],
    [0, 0, 223],
    [0, 0, 191],
    [0, 0, 159],
    [0, 0, 127],
  ]);
}

  function switchToWeatherAndDayData() {
    loadHeatmapData(filterByWeatherAndDay, [
      [255, 255, 0],
      [255, 191, 0],
      [255, 127, 0],
      [255, 63, 0],
      [255, 0, 0],
      [223, 0, 0],
      [191, 0, 0],
      [159, 0, 0],
      [127, 0, 0],
    ]);
  }

  function switchToOriginalData() {
    loadHeatmapData(() => true); // Pass a function that always returns true to include all data points
  }

  return (
    <Layout>
      <button
        id="switch-to-vehicle-collision-data"
        onClick={switchToVehicleCollisionData}
      >
        Switch to Vehicle Collision Data
      </button>
      <button
        id="switch-to-weather-and-day-data"
        onClick={switchToWeatherAndDayData}
      >
        Switch to Weather and Day Data
      </button>
      <button id="switch-to-original-data" onClick={switchToOriginalData}>
        Switch to Original Data
      </button>
      <div ref={mapRef} style={mapContainerStyle} />
    </Layout>
  );
}
