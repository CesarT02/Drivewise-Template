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

function createInfoWindow(map, marker, content) {
  const infoWindow = new google.maps.InfoWindow({
    content: content,
  });

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

      createInfoWindow(map, marker, content);
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

  function toggleHeatmap() {
    if (heatmap) {
      heatmap.setMap(heatmap.getMap() ? null : map);
    }
  }

  function toggleMarkers() {
    const nextMap = markers[0].getMap() ? null : map;
    markers.forEach((marker) => marker.setMap(nextMap));
  }

  function changeGradient() {
    const gradient = [
      "rgba(0, 255, 255, 0)",
      "rgba(0, 255, 255, 1)",
      "rgba(0, 191, 255, 1)",
      "rgba(0, 127, 255, 1)",
      "rgba(0, 63, 255, 1)",
      "rgba(0, 0, 255, 1)",
      "rgba(0, 0, 223, 1)",
      "rgba(0, 0, 191, 1)",
      "rgba(0, 0, 159, 1)",
      "rgba(0, 0, 127, 1)",
      "rgba(63, 0, 91, 1)",
      "rgba(127, 0, 63, 1)",
      "rgba(191, 0, 31, 1)",
      "rgba(255, 0, 0, 1)",
    ];
    heatmap.set("gradient", heatmap.get("gradient") ? null : gradient);
  }

  function changeRadius() {
    heatmap.set("radius", heatmap.get("radius") ? null : 20);
  }

  function changeOpacity() {
    heatmap.set("opacity", heatmap.get("opacity") ? null : 0.2);
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
      <button id="toggle-heatmap" onClick={toggleHeatmap}>
        Toggle Heatmap
      </button>
      <button id="toggle-markers" onClick={toggleMarkers}>
        Toggle Markers
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
      <div ref={mapRef} style={mapContainerStyle} />
    </Layout>
  );
}

                              
