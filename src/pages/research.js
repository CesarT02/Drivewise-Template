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
                <p>Research goes here:</p>
            </article>
    </Layout>
    )
}
