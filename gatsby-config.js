module.exports = {
  siteMetadata: {
    title: `site`,
    siteUrl: `https://justinmjoh.com`,
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
