import React from 'react'
import { Link } from 'gatsby'

export default function Logo() {
    return (
        <h1 class="font-roadrage inline-flex px-3 text-2xl">
        <Link 
            className="text-pink-600 hover:text-cyan-600 duration-200"
            to="/"
            // Uses activeStyle instead of activeClassName due to bug in gatsby
            activeStyle={{
                color: '#facc15'
            }}
            >
            Justin Johnson
        </Link>
    </h1>
    )
}