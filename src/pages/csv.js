import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import DataGrid from 'react-data-grid';
import csv from '../data/data.csv';
import * as d3 from 'd3';

export function Head() {
  // ...
}

export default function CSVPage() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    d3.csv(csv).then((data) => {
      handleCSVData(data);
    });
  }, []);

  const handleCSVData = (data) => {
    if (data.length === 0) return;

    // Generate columns from the header row
    const headerRow = data.columns;
    const newColumns = headerRow.map((header, idx) => ({
      key: idx.toString(),
      name: header,
      resizable: true,
      sortable: true,
    }));

    // Generate rows from the data rows
    const newRows = data.map((row, idx) => {
      const rowData = {};
      headerRow.forEach((cell, cellIdx) => {
        rowData[cellIdx.toString()] = row[cell];
      });
      return { id: idx, ...rowData };
    });

    setColumns(newColumns);
    setRows(newRows);
  };

  return (
    <Layout>
      <article className="space-y-2">
        <h2 className="text-xl font-bold underline">CSV Data</h2>
        <div className="mt-4">
          <DataGrid columns={columns} rows={rows} />
        </div>
      </article>
    </Layout>
  );
}
