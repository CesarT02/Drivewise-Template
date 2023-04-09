import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import DataGrid from 'react-data-grid';
import jsonData from '../data/data.json';

export function Head() {
  return (
    <>
      <title>CSV Page | Group 8</title>
      <meta name="description" content="Group 8" />
      <link rel="canonical" href="www.drivewise.site/csv" />
    </>
  );
}

export default function CSVPage() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const data = jsonData;
    if (data.length === 0) return;

    // Generate columns from the header row
    const headerRow = Object.keys(data[0]);
    const newColumns = headerRow.map((header, idx) => ({
      key: idx.toString(),
      name: header,
      resizable: true,
      sortable: true,
    }));

    // Generate rows from the data rows
    const newRows = data.map((row, idx) => {
      const rowData = {};
      headerRow.forEach((header, cellIdx) => {
        rowData[cellIdx.toString()] = row[header];
      });
      return { id: idx, ...rowData };
    });

    setColumns(newColumns);
    setRows(newRows);
  }, []);

  return (
    <Layout>
      <article className="space-y-2">
        <h2 className="text-xl font-bold underline">CSV Interaction</h2>
        <p>Interact with the data:</p>
        {rows.length > 0 && (
          <div className="mt-4">
            <DataGrid columns={columns} rows={rows} />
          </div>
        )}
      </article>
    </Layout>
  );
}

