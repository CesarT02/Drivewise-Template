import React, { useRef, useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { Loader } from "@googlemaps/js-api-loader";
import * as XLSX from 'xlsx';

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

async function parseAndGeocodeExcel(excelArrayBuffer, apiKey, filterFunction) {
  const workbook = XLSX.read(new Uint8Array(excelArrayBuffer), { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  const headers = json.shift();
  const data = json.map(row => headers.reduce((acc, header, i) => {
    acc[header] = row[i];
    return acc;
  }, {}));

  const nonEmptyRows = data.filter((row) => row.StreetName.trim() !== '');
  const filteredRows = nonEmptyRows.filter(filterFunction);
  const coordinates = [];

  for (const row of filteredRows) {
    try {
      const latLng = await getLatLngFromStreetName(row.StreetName, apiKey);
      coordinates.push(latLng);
    } catch (error) {
      console.error(`Failed to geocode street name "${row.StreetName}":`, error);
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
  const excelResponse = await fetch("/Good_Excel.xlsx");
  const excelBlob = await excelResponse.blob();

  const excelArrayBuffer = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(excelBlob);
  });

  const coordinates = await parseAndGeocodeExcel(
    excelArrayBuffer,
    apiKey,
    filterFunction
  );

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
  const weather = data.Weather || "";
  const day = data.Day || "";
  const result =
    allowedWeather.includes(weather.trim()) &&
    allowedDay.includes(day.trim());
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
