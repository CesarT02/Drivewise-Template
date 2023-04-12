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

function createInfoWindow(map, marker, content, rowData) {
  const infoWindow = new google.maps.InfoWindow({
    content: content,
  });

  marker.vehicleCollision =
    rowData.vehicleCollision || rowData.vehiclecollision;
  marker.weather = rowData.Weather;
  marker.day = rowData.Day;

  marker.addListener("click", () => {
    infoWindow.open(map, marker);
  });
}

async function parseAndGeocodeCsv(csvData, apiKey, filters = {}) {
  const results = Papa.parse(csvData, { header: true });
  const nonEmptyRows = results.data.filter(
    (row) => row.streetName.trim() !== ""
  );

  const filteredRows = nonEmptyRows.filter((row) => {
    return (
      (!filters.day || row.Day === filters.day) &&
      (!filters.weather || row.Weather === filters.weather) &&
      (!filters.vehicleCollision ||
        row.vehicleCollision === filters.vehicleCollision ||
        row.vehiclecollision === filters.vehicleCollision)
    );
  });

  const coordinates = [];
  const infoWindows = [];

  for (const row of filteredRows) {
    try {
      const latLng = await getLatLngFromStreetName(row.streetName, apiKey);
      coordinates.push(latLng);

      const marker = new google.maps.Marker({
        position: latLng,
        map: null,
      });

      const content = `
        <div>
          <p>Street Name: ${row.streetName}</p>
          <p>City: ${row.City}</p>
          <p>State: ${row.State}</p>
          <p>Day: ${row.Day}</p>
          <p>Weather: ${row.Weather}</p>
          <p>Vehicle Collision: ${
            row.vehicleCollision || row.vehiclecollision || ""
          }</p>
        </div>
      `;

      createInfoWindow(map, marker, content, row);
      infoWindows.push({ marker, content });
    } catch (error) {
      console.error(
        `Failed to geocode street name "${row.streetName}":`,
        error
      );
    }
    await sleep(200); // Adjust the sleep time as needed (in milliseconds)
  }

  return { coordinates, infoWindows };
}

export default function MapPage() {
  const mapRef = useRef();
  const [map, setMap] = useState(null);
  const [heatmap, setHeatmap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [visualizationMode, setVisualizationMode] = useState("heatmap");
  const [dayFilter, setDayFilter] = useState(null);
  const [weatherFilter, setWeatherFilter] = useState(null);
  const [vehicleCollisionFilter, setVehicleCollisionFilter] = useState(null);

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
      fetch("/CSV_TIME.csv")
        .then((response) => response.text())
        .then(async (csvData) => {
          const { coordinates, infoWindows } = await parseAndGeocodeCsv(
            csvData,
            apiKey
          );
          const loadedHeatmap = new google.maps.visualization.HeatmapLayer({
            data: coordinates,
            map: loadedMap,
          });

          setMap(loadedMap);
          setHeatmap(loadedHeatmap);
          setMarkers(infoWindows.map((window) => window.marker));
        });
    });
  }, []);

  async function applyFilters() {
    const csvData = await fetch("/CSV_TIME.csv").then((response) =>
      response.text()
    );
    const filters = {
      day: dayFilter,
      weather: weatherFilter,
      vehicleCollision: vehicleCollisionFilter,
    };
    const { coordinates, infoWindows } = await parseAndGeocodeCsv(
      csvData,
      apiKey,
      filters
    );
    // Remove previous markers
    markers.forEach((marker) => marker.setMap(null));

    // Set new markers
    setMarkers(infoWindows.map((window) => window.marker));

    // Update heatmap data
    heatmap.setData(coordinates);
  }

  function updateVisualizationMode(mode) {
    if (mode === "heatmap") {
      heatmap.setMap(map);
      markers.forEach((marker) => marker.setMap(null));
    } else if (
      mode === "vehicleCollision" ||
      mode === "weather" ||
      mode === "day"
    ) {
      heatmap.setMap(null);
      markers.forEach((marker) => {
        if (marker[mode] === filters[mode]) {
          marker.setMap(map);
        } else {
          marker.setMap(null);
        }
      });
    }
    setVisualizationMode(mode);
  }

  return (
    <Layout>
      <div>
        <label htmlFor="day-filter">Day:</label>
        <input
          id="day-filter"
          value={dayFilter || ""}
          onChange={(e) => setDayFilter(e.target.value || null)}
        />
      </div>
      <div>
        <label htmlFor="weather-filter">Weather:</label>
        <input
          id="weather-filter"
          value={weatherFilter || ""}
          onChange={(e) => setWeatherFilter(e.target.value || null)}
        />
      </div>
      <div>
        <label htmlFor="vehicle-collision-filter">Vehicle Collision:</label>
        <input
          id="vehicle-collision-filter"
          value={vehicleCollisionFilter || ""}
          onChange={(e) => setVehicleCollisionFilter(e.target.value || null)}
        />
      </div>
      <button onClick={applyFilters}>Apply Filters</button>
      <button onClick={() => updateVisualizationMode("heatmap")}>
        Heatmap
      </button>
      <button onClick={() => updateVisualizationMode("vehicleCollision")}>
        Vehicle Collisions
      </button>
      <button onClick={() => updateVisualizationMode("weather")}>
        Weather
      </button>
      <button onClick={() => updateVisualizationMode("day")}>Day</button>
      <div ref={mapRef} style={mapContainerStyle} />
    </Layout>
  );
}

                              
