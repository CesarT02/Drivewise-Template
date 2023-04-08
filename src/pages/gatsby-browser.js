import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: 'AIzaSyAuOhlWr5cxsZcvX6FSWA_mcEfGAGqE6u8', // Replace with your API key
  version: 'weekly',
  libraries: ['visualization'],
});

loader.load().then(() => {
  console.log('Google Maps API loaded');
});
