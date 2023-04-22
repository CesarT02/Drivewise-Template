import React, { useRef, useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { Loader } from "@googlemaps/js-api-loader";
import * as XLSX from 'xlsx';

const mapContainerStyle = {
  width: "90%",
  height: "70vh",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const apiKey = "AIzaSyAuOhlWr5cxsZcvX6FSWA_mcEfGAGqE6u8";

async function getLatLngFromStreetName(streetName, city, state, apiKey) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      `${streetName}, ${city}, ${state}`
    )}&key=${apiKey}`
  );
  const data = await response.json();
  if (data.status === "OK" && data.results.length > 0) {
    const location = data.results[0].geometry.location;
    console.log("Location:", location);
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
      const latLng = await getLatLngFromStreetName(row.StreetName, row.City, row.State, apiKey);
      coordinates.push(latLng);
      console.log("LatLng:", latLng);
    } catch (error) {
      console.error(`Failed to geocode street name "${row.StreetName}":`, error);
    }
    await sleep(150); // Adjust the sleep time as needed (in milliseconds)
  }
  console.log(coordinates);

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
  
  const [selectedWeather, setSelectedWeather] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedCollision, setSelectedCollision] = useState("");

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
    radius: 20,
    opacity: 0.7,
    gradient: gradientColors ? createCustomGradient(gradientColors) : null,
  });

  setHeatmap(newHeatmap);
}

function filterByVehicleCollision(data) {
  const allowedTypes = ["Vehicle/Vehicle", "Vehicle/Pedestrian"];
  const vehicleCollisionData = data.Collision || "";

  const result = allowedTypes.includes(vehicleCollisionData.trim());
  console.log("VehicleCollision filter:", data, result);
  return result;
}

function filterByWeatherAndDay(data) {
  const allowedWeather = ["CLEAR", "CLOUDY", "RAIN", "SLEET / HA"];
  const allowedDay = [
  "DAYLIGHT",
  "DARK",
  "DUSK",
  "DAWN",
  "DARK-LIGHTED",
  "DARK-NOT LIGHTED",
];
   const weather = data.Weather ? data.Weather.trim() : "";
    const day = data.Day ? data.Day.trim() : "";
    const result =
      (selectedWeather === "" || selectedWeather === weather) &&
      (selectedTime === "" || selectedTime === day);
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
   ]).then(coordinates => {
    console.log('VehicleCollision coordinates:', coordinates);
  });
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
    ]).then(coordinates => {
    console.log('WeatherAndDay coordinates:', coordinates);
  });
}
  function switchToOriginalData() {
    loadHeatmapData(() => true); // Pass a function that always returns true to include all data points
  }
  
  
    function handleWeatherChange(event) {
    setSelectedWeather(event.target.value);
    loadHeatmapData(filterByWeatherAndDay);
  }

  function handleTimeChange(event) {
    setSelectedTime(event.target.value);
    loadHeatmapData(filterByWeatherAndDay);
  }
  function handleCollisionChange(event) {
    setSelectedCollision(event.target.value);
    loadHeatmapData(filterByVehicleCollision);
  }

return (
  <Layout>
    <style jsx>{`
      button, select {
        background-color: purple;
        color: white;
        padding: 10px;
        margin: 5px;
        border: none;
        cursor: pointer;
        transition: 0.3s;
        border-radius: 5px;
      }
      button:hover {
        background-color: hotpink;
      }
      select {
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        background-color: purple;
        background-image: linear-gradient(45deg, transparent 50%, white 50%),
                          linear-gradient(-45deg, transparent 50%, white 50%);
        background-position: calc(100% - 20px) center, calc(100% - 15px) center;
        background-size: 5px 5px, 5px 5px;
        background-repeat: no-repeat;
      }
    `}</style>
    <button
      id="switch-to-vehicle-collision-data"
      onClick={switchToVehicleCollisionData}
    >
      Switch to Vehicle Collision Data
   
    </button>
    <select onChange={handleCollisionChange}>
      <option value="">Select Filter</option>
      <option value="Vehicles">Vehicle/Vehicle</option>
      <option value="pedestrians">Vehicle/Pedestrian</option>
    </select>

    <button id="switch-to-original-data" onClick={switchToOriginalData}>
      Switch to Original Data
    </button>
    {/* Add two select elements to choose the weather and time of day */}
    <select onChange={handleWeatherChange}>
      <option value="">Select Weather</option>
      <option value="CLEAR">Clear</option>
      <option value="CLOUDY">Cloudy</option>
      <option value="RAIN">Rain</option>
      <option value="SLEET / HA">Sleet / Hail</option>
    </select>
    <select onChange={handleTimeChange}>
      <option value="">Select Time of Day</option>
      <option value="DAYLIGHT(6AM-6PM)">Daylight</option>
      <option value="DARK(8PM-4AM)">Dark</option>
      <option value="DUSK(6PM-8PM)">Dusk</option>
      <option value="DAWN(4AM-6AM)">Dawn</option>
      <option value="DARK-LIGHTED( 8PM to 10PM)">Dark-Lighted</option>
      <option value="DARK-NOT LIGHTED(10PM to 4AM)">Dark-Not Lighted</option>
    </select>

    <div ref={mapRef} style={mapContainerStyle} />
  </Layout>
  );
}
   



