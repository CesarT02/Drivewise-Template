import React from 'react'
import Layout from '../components/Layout/Layout'
import photo from '../images/about-photo.png'

export function Head() {
    return (
        <>
            <title>About Drivewise | </title>
            <meta name="description" content=" Group 8 ."/>
            <link rel="canonical" href="https://www.drivewise.site/about"/>
        </>
    )
}

export default function AboutPage() {
    return (
        <Layout>
            <article class="space-y-4">
                <div class = "mx-auto felx flex-row">
                    <img src={ photo } width="148" height="148" alt="Justin Johnson" class="mx-auto border border-cyan-600 rounded-xl"/>
                    <img src={ photo } width="148" height="148" alt="Justin Johnson" class="mx-auto border border-cyan-600 rounded-xl"/>
                </div>
                <h2 class="text-xl font-bold underline">About Me</h2>
                <p>
                    Drivewise.
                </p>
               
            </article>
        </Layout>
    )
}
