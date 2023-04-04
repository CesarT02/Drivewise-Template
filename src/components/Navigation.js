import React from "react"
import Logo from "./Logo"
import StyledNavLink from "./StyledNavLink"

export default function Navigation() {
    return (
        <nav class="sticky top-0 z-50">
            <div class="bg-slate-900 py-2 border-b border-pink-600 shadow-lg">
                <div class="max-w-7xl md:mx-auto md:w-3/4 md:space-x-2 space-y-2 md:space-y-0">
                    <Logo/>
                    <StyledNavLink to="/about/">about</StyledNavLink>
                    <StyledNavLink to="/map/">map</StyledNavLink>
                    <StyledNavLink to="/charts/">charts</StyledNavLink>
                    <StyledNavLink to="/research/">research</StyledNavLink>
                    <StyledNavLink to="/bibliography/">bibliography</StyledNavLink>
                </div>
            </div>
        </nav>
    )
}
