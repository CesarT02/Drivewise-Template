import React from "react"
import Layout  from "../components/Layout/Layout"

export function Head() {
    return (
        <>
            <title>Home | DriveWise</title>
            <meta name="description" content="Group 8 Project"/>
            <link rel="canonical" href="www.drivewise.site"/>
        </>
    )
}

export default function IndexPage() {
    return (
        <Layout>
              <article>
                <h2 class="px-2 text-xl md:text-2xl lg:text-3xl font-bold text-yellow-400">
                     "Welcome to Drivewise!"&nbsp;
                    <span class="animate-pulse">&#x2588;</span>
                </h2>
                <div class="w-full mt-8 mb-8 mx-auto border border-b-0 border-pink-600"></div>
                <p class="px-4 text-lg font-bold">Welcome to DriveWise, a predictive analytics project aimed at estimating the likelihood of car accidents in your area. Our website is designed to provide drivers with a deeper understanding of the level of risk associated with driving in a particular region, based on historical data of car accidents collected over a certain period.


                                                   Using weather conditions, time of day and location, we analyze and interpret this data to determine higher risk roads or accident hotspots, which we present to you through an interactive map on our website. In addition, we provide raw data visualization lists of the numbers where users could filter through the data and see totals of incidents with different traits.


                                                   Our ultimate goal is to help reduce the number of car accidents by providing suggestions and warnings if a certain condition like the time of day and or where weather conditions lines up to multiple accidents. This would be more informational with some usable functionality for the everyday user as well.


                                                   With DriveWise, you can make more informed decisions when traveling and potentially avoid dangerous situations.
                </p>
              </article>
        </Layout>
    )
}
