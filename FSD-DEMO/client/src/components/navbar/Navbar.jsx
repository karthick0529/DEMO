import React from 'react'
import { NavLink } from 'react-router-dom'

import "./Navbar.css"

function Navbar({ user }) {
    console.log("From navbar", user);
    return (
        <nav className='navbar'>
            <NavLink to='/'>Home</NavLink>
            {!user && (
                <>
                    <NavLink to='/login'>Login</NavLink>
                    <NavLink to='/register'>Register</NavLink>
                </>
            )}
            {user && (
                <>
                    <NavLink to='/profile'>Dashboard</NavLink>
                    <NavLink to='/logout'>Logout</NavLink>
                </>
            )}
        </nav>
    )
}

export default Navbar