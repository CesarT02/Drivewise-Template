import React from 'react';
import Layout from '../components/Layout/Layout';
import { Link } from 'gatsby';


export function Head() {
    return (
        <>
            <title>404 | DriveWise</title>
            <meta name="description" content="404 error, page was not found!"/>
            <link rel="canonical" href="Www.drivewise.site/404"/>
        </>
    )
}

export default function NotFoundPage() {
    return(
        <Layout>
            <article class="text-center">
                <h2 class="text-5xl underline">404</h2>
                <p class="p-2">You seem sorta lost.</p>
                <p class="p-2">But we all do too, sometimes.</p>
                <p class="p-2">Let me take you <Link to="/" class="underline hover:text-pink-600 focus:text-pink-600 active:text-pink-600">home</Link>.</p>
            </article>
        </Layout>
    )
}
