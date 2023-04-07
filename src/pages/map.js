import React from 'react';
import Layout from '../components/Layout/Layout';
import GoogleMap from './GoogleMap';

export function Head() {
  // ...
}

export default function MapPage() {
  return (
    <Layout>
      <GoogleMap />
    </Layout>
  );
}
