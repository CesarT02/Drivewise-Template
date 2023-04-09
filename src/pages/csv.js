import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import DataGrid from 'react-data-grid';
import CSVReader from 'react-csv-reader';

export function Head() {
  return (
    <>
      <title>Bibliography | Group 8</title>
      <meta name="description" content="Group 8" />
      <link rel="canonical" href="www.drivewise.site/bibliography" />
    </>
  );
}

export default function BibliographyPage() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const handleCSVData = (data) => {
    if (data.length === 0) return;

    // Generate columns from the header row
    const headerRow = data[0];
    const newColumns = headerRow.map((header, idx) => ({
      key: idx.toString(),
      name: header,
      resizable: true,
      sortable: true,
    }));

    // Generate rows from the data rows
    const newRows = data.slice(1).map((row, idx) => {
      const rowData = {};
      row.forEach((cell, cellIdx) => {
        rowData[cellIdx.toString()] = cell;
      });
      return { id: idx, ...rowData };
    });

    setColumns(newColumns);
    setRows(newRows);
  };

  return (
    <Layout>
      <article className="space-y-2">
        <h2 className="text-xl font-bold underline">Bibliography</h2>
        <p>Bibliography goes here:</p>
        <CSVReader
          cssClass="csv-reader-input"
          onFileLoaded={handleCSVData}
          onError={(error) => console.log('Error:', error)}
          inputId="csvFileInput"
          inputStyle={{ color: 'black' }}
        />
        <div className="mt-4">
          <DataGrid columns={columns} rows={rows} />
        </div>
      </article>
    </Layout>
  );
}

