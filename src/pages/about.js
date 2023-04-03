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
                    I grew up in the suburbs adjacent to the tech centers of Bellevue and Redmond. Having a family
                    history of taking interest in computers, it was natural that I too would as well. From a young
                    age, probably elementary school I began taking apart computers or various electronics (with
                    intermittent success putting them back together). After the impactful 2010 release of Tron: Legacy, it
                    was pretty much set that computers would become my career path.
                </p>
               
            </article>
        </Layout>
    )
}
