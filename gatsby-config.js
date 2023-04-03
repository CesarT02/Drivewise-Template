module.exports = {
  siteMetadata: {
    title: `site`,
    siteUrl: `https://www.drivewise.site/`,
  },
  plugins: [
    'gatsby-plugin-postcss',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'src/images/icon.png'
      }
    }
  ],
}
