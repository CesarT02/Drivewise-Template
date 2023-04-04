import React from 'react'
import Layout from '../components/Layout/Layout'

export function Head() {
    return (
        <>
            <title>Map | Group 8</title>
            <meta name="description" content="Group 8"/>
            <link rel="canonical" href="www.drivewise.site/map"/>
        </>
    )
}

export default function MapPage() {
    return (
        <Layout>
            <div>    
                <iframe style="width: 100%; height: 100%;" src="map-raw.html" title="description"></iframe>
           </div>
        </Layout>
    )
}
