import React from 'react'
import Layout from '../components/Layout/Layout'

export function Head() {
    return (
        <>
            <title>Projects | Group 8</title>
            <meta name="description" content="Group 8"/>
            <link rel="canonical" href="https://www.drivewise.site/Map"/>
        </>
    )
}

export default function ProjectsPage() {
    return (
        <Layout>
            <div>    
                <iframe style="width: 100%; height: 100%;" src="map-raw" title="description"></iframe>
           </div>
        </Layout>
    )
}