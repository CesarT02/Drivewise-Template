import React from 'react'
import Layout from '../components/Layout/Layout'
import photo from '../images/about-photo.jpeg'

export function Head() {
    return (
        <>
            <title>About Me | C</title>
            <meta name="description" content=" is a web developer in Tucson, Arizona. Here is some information about ."/>
            <link rel="canonical" href="https://www.drivewise.site/about"/>
        </>
    )
}

export default function AboutPage() {
    return (
        <Layout>
            <article class="space-y-4">
                <img src={ photo } width="148" height="148" alt="Justin Johnson" class="mx-auto border border-cyan-600 rounded-xl"/>
                <h2 class="text-xl font-bold underline">About Me</h2>
                <p>
                    I grew up in the suburbs adjacent to the tech centers of Bellevue and Redmond. Having a family
                    history of taking interest in computers, it was natural that I too would as well. From a young
                    age, probably elementary school I began taking apart computers or various electronics (with
                    intermittent success putting them back together). After the impactful 2010 release of Tron: Legacy, it
                    was pretty much set that computers would become my career path.
                </p>
                <p>
                    Throughout much of middle school and highschool, programming, scripting and gaming constituted for much
                    of my time. I remember my friends and I making many strange projects using breadboards and microcontrollers,
                    when we weren't playing either Counter Strike or Halo. For the latter part of highschool I attended Summer
                    and Fall workshops at DigiPen institute covering things like web development, cyber-security, AI and robotics,
                    and even sound engineering. 
                </p>
                <p>
                    After highschool, I attended Bellevue College where I learned perseverance, ultimately earning my Associates in Science
                    amidst the height of the Coronavirus Pandemic. After graduation, I quickly moved to Tucson, Arizona to further my 
                    education, currently working on a Bachelors in Computer Science at the University of Arizona. When not in classes, 
                    I serve as a web developer for the university's bookstore and student union.
                </p>
            </article>
        </Layout>
    )
}
