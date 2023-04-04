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
            <article class="space-y-2">
                <h2 class="text-xl font-bold underline">Bibliography</h2>
                <p>Bibliography goes here:</p>
            </article>
    </Layout>
    )
}
