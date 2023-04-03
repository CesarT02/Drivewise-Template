import React from "react"
import Footer from "../Footer"
import Navigation from "../Navigation"

export default function Layout({ children }) {
    return (
        <div className="bg-slate-800 text-slate-200 font-mono antialiased flex flex-col min-h-screen min-w-full">
            <Navigation/>
            <main className="max-w-7xl w-full md:w-3/4 mx-auto m-8 p-8 rounded-xl bg-slate-700 border border-pink-600 shadow-lg flex-grow">
                {children}
            </main>
            <Footer/>
        </div>
    )
}