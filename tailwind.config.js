/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roadrage: ['RoadRage', 'monospace'],
        vcr: ['VCR_OSD_MONO', 'monospace']
      }
    },
  },
  plugins: [],
}
