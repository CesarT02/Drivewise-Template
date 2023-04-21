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
    await sleep(100); // Adjust the sleep time as needed (in milliseconds)
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

  useEffect(() => {
    const loader = new Loader({
      apiKey: apiKey,
      version: "weekly",
      libraries: ["visualization"],
    });

    loader.load().then(() => {
      const loadedMap = new google.maps.Map(mapRef.current, {
        zoom: 13,
        center: {         lat: 32.248814, lng: -110.987419 },
        mapTypeId: "satellite",
      });

      setMap(loadedMap);
    });
  }, []);

  async function loadHeatmapData(filterFunction) {
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
      gradient: createCustomGradient([
        [0, 255, 255],
        [0, 191, 255],
        [0, 127, 255],
      ]),
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
    loadHeatmapData(filterByVehicleCollision).then(coordinates => {
      console.log('VehicleCollision coordinates:', coordinates);
    });
  }

  function handleWeatherChange(event) {
    setSelectedWeather(event.target.value);
    loadHeatmapData(filterByWeatherAndDay);
  }

  function handleTimeChange(event) {
    setSelectedTime(event.target.value);
    loadHeatmapData(filterByWeatherAndDay);
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
        <option value="DAYLIGHT">Daylight</option>
        <option value="DARK">Dark</option>
        <option value="DUSK">Dusk</option>
        <option value="DAWN">Dawn</option>
        <option value="DARK-LIGHTED">Dark-Lighted</option>
        <option value="DARK-NOT LIGHTED">Dark-Not Lighted</option>
      </select>

      <div ref={mapRef} style={mapContainerStyle} />
    </Layout>
  );
}



