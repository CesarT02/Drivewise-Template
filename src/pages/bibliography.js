import React from 'react'
import Layout from '../components/Layout/Layout'

export function Head() {
    return (
        <>
            <title>Bibliography | Group 8</title>
            <meta name="description" content="Group 8"/>
            <link rel="canonical" href="www.drivewise.site/bibliography"/>
        </>
    )
}

export default function BibliographyPage() {
    return (
        <Layout>
            <article className="space-y-2">
                <h2 className="text-xl font-bold underline text-center">Bibliography</h2>
                
                <style jsx>{`
                    .reference {
                        text-align: center;
                    }
                `}</style>
                <p className="reference">
                    Tucson Open Data. (n.d.). Retrieved April 13, 2023, from https://gisdata.tucsonaz.gov/datasets/f83a509e59f045eda63750f665a3b002
                </p>
                <p className="reference">
                    Arizona Department of Transportation. (2021). Crash Data and Reporting. Retrieved from https://azdot.gov/planning/crash-data-and-reporting
                </p>
                <p className="reference">
                    National Highway Traffic Safety Administration. (2020). Traffic Safety Facts. Retrieved from https://crashstats.nhtsa.dot.gov/Api/Public/ViewPublication/813060
                </p>
                <p className="reference">
                    Tucson Open Data. (n.d.). Retrieved March 25, 2023, from https://gisdata.tucsonaz.gov/datasets/distracted-driving-traffic-accidents-open-data/explore?location=32.170276%2C-110.977900%2C10.13
                </p>
            </article>
        </Layout>
    )
}
