import React from 'react'
import Layout from '../components/Layout/Layout'

export function Head() {
    return (
        <>
            <title>Projects | Justin Johnson</title>
            <meta name="description" content="Group 8"/>
            <link rel="canonical" href="https://www.drivewise.site/Research"/>
        </>
    )
}

export default function ProjectsPage() {
    return (
        <Layout>
            <article class="space-y-2">
                <h2 class="text-xl font-bold underline">Projects</h2>
                <p>As I figure out how I want to implement projects on this page, let the site itself serve as one:</p>
                <h3 class="font-bold underline">justinmjoh.com</h3>
                <ul class="list-disc pl-8">
                    <li class="text-cyan-600">
                        <span class="text-slate-200">
                            <a class="duration-200 hover:text-pink-600" href="https://tailwindcss.com/">Tailwind</a> (frontend / CSS)
                        </span>
                    </li>
                    <li class="text-cyan-600">
                        <span class="text-slate-200">
                            <a class="duration-200 hover:text-pink-600" href="https://www.gatsbyjs.com/">GatsbyJS</a> (rendering)
                        </span>
                    </li>
                    <li class="text-cyan-600">
                        <span class="text-slate-200">
                            <a class="duration-200 hover:text-pink-600" href="https://www.gatsbyjs.com/products/cloud/">Gatsby Cloud</a> (server)
                        </span>
                    </li>
                </ul>
            </article>
        </Layout>
    )
}
