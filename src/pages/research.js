import React from 'react'
import Layout from '../components/Layout/Layout'

export function Head() {
    return (
        <>
            <title>Projects | Group 8</title>
            <meta name="description" content="Group 8"/>
            <link rel="canonical" href="www.drivewise.site/research"/>
        </>
    )
}

export default function ResearchPage() {
    return (
     <Layout>
            <article class="space-y-2">
                <h2 class="text-xl font-bold underline">Projects</h2>
                <p>This research aims to identify the most common causes of car accidents in Tucson, Arizona, and the specific roads on which they occur. By analyzing historical data, weather conditions, and other factors, we hope to provide valuable insights for drivers in the region. We also discuss the Drive Wise project, which aims to pull and provide data on which parts of Tucson have the most accidents.

Car accidents are a leading cause of injury and death in the United States, with millions of accidents occurring each year (NHTSA, 2020). In Tucson, Arizona, certain roads and intersections are known for having higher accident rates, and understanding these patterns can help drivers make informed decisions when traveling. In this paper, we analyze the most common causes of car accidents in Tucson and identify high-risk roads.

We conducted a thorough analysis of historical car accident data from the City of Tucson's Open Data Portal (City of Tucson, 2021). We also used additional sources such as the Arizona Department of Transportation (ADOT) and the National Highway Traffic Safety Administration (NHTSA) to gain a comprehensive understanding of accident patterns. Factors such as weather conditions, time of day, and specific locations were considered in our analysis.


The most common causes of car accidents in Tucson include:

Distracted driving: Texting, eating, or engaging in other activities while driving contribute to a significant number of accidents (NHTSA, 2020).
Speeding: Exceeding the posted speed limits, especially in residential areas and school zones, is a leading cause of accidents (ADOT, 2021).
Impaired driving: Driving under the influence of alcohol or drugs is a major factor in many accidents (NHTSA, 2020).
High-risk roads in Tucson:

Grant Road: A high volume of traffic, combined with a history of accidents, make Grant Road a hazardous area for drivers (City of Tucson, 2021).
Speedway Boulevard: This arterial road is known for its high accident rates, particularly at intersections (ADOT, 2021).
Oracle Road: With a history of fatal and serious injury accidents, Oracle Road is another high-risk area in Tucson (City of Tucson, 2021).

Our research has provided an analysis of the most common causes of car accidents in Tucson and identified high-risk roads. As the Drive Wise project continues to develop, drivers will have access to valuable information to help them navigate safely and avoid accidents.
</p>
            </article>
    </Layout>
    )
}
