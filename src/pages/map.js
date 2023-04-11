import React, { useRef, useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { Loader } from "@googlemaps/js-api-loader";
import Papa from "papaparse";

const mapContainerStyle = {
  width: "100%",
  height: "100vh",
};

const apiKey = "AIzaSyAuOhlWr5cxsZcvX6FSWA_mcEfGAGqE6u8";

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

    loader.load().then(async () => {
      const google = window.google;

      async function getLatLngFromStreetName(fullAddress, apiKey) {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            fullAddress
          )}&key=${apiKey}`
        );
        const data = await response.json();
        if (data.status === "OK" && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          return new google.maps.LatLng(location.lat, location.lng);
        } else {
          throw new Error("Failed to geocode full address");
        }
      }

      async function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }

      function parseCsv(csvData, filterFunction) {
        const results = Papa.parse(csvData, { header: true });
        const filteredData = results.data.filter(filterFunction);

        return filteredData;
      }

      async function geocodeFilteredData(filteredData, apiKey) {
        const coordinates = [];

        for (const row of filteredData) {
          let fullAddress;
          try {
            if (!row.streetName || !row.City || !row.State) {
              console.warn("Skipping invalid row:", row);
              continue;
            }

            fullAddress = `${row.streetName}, ${row.City}, ${row.State}`;
            const coordinate = await getLatLngFromStreetName(
              fullAddress,
              apiKey
            );

            if (
              coordinate &&
              !isNaN(coordinate.lat()) &&
              !isNaN(coordinate.lng())
            ) {
              coordinates.push(coordinate);
            } else {
              console.warn(`Invalid coordinate for ${fullAddress}`, coordinate);
            }

            await sleep(100); // Adding a delay between requests
          } catch (error) {
            console.error(`Failed to geocode ${fullAddress}`, error);
          }
        }

        return coordinates;
      }
      const switchData = (filterFunction) => {
        if (!heatmap) {
          console.error("Heatmap is not initialized yet");
          return;
        }

        fetch("../CSV_TIME.csv")
          .then((response) => response.text())
          .then((csvData) => {
            const results = Papa.parse(csvData, { header: true });
            const filteredData = results.data.filter(filterFunction);
            const coordinates = filteredData.map(
              (row) => new google.maps.LatLng(row.lat, row.lng)
            );

            heatmap.setData(coordinates);
          });
      };

      const toggleHeatmap = () => {
    if (heatmap) {
      heatmap.setMap(heatmap.getMap() ? null : map);
    }
  };

  const changeGradient = () => {
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

     if (heatmap) {
          heatmap.set("gradient", heatmap.get("gradient") ? null : gradient);
        }
      };

      const changeRadius = () => {
        if (heatmap) {
          heatmap.set("radius", heatmap.get("radius") ? null : 20);
        }
      };

      const changeOpacity = () => {
        if (heatmap) {
          heatmap.set("opacity", heatmap.get("opacity") ? null : 0.2);
        }
      };

      const switchToVehicleCollisionData = () => {
        switchData(filterByVehicleCollision);
      };

      const switchToWeatherAndDayData = () => {
        switchData(filterByWeatherAndDay);
      };

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
          <div ref={mapRef} style={mapContainerStyle} />
        </Layout>
      );
    });
  }, [map]);

  return (
    <>
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
        <div ref={mapRef} style={mapContainerStyle} />
      </Layout>
    </>
  );
}

