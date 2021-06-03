import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import {NavLink, useHistory} from 'react-router-dom'

export const Navbar = () => {

    const history = useHistory()
    const auth = useContext(AuthContext)

    const logoutHandler = event => {
        event.preventDefault()
        auth.logout()
        history.push('/')
    }

    return (
        <nav>
        <div class="nav-wrapper blue darken-1" style={{padding: '0 2rem'}}>
          <span class="brand-logo">Url Shorter</span>
          <ul id="nav-mobile" class="right hide-on-med-and-down">
            <li><NavLink to="/create">Create</NavLink></li>
            <li><NavLink to="/links">List</NavLink></li>
            <li><a href="/" onClick={logoutHandler}>Exit</a></li>
          </ul>
        </div>
      </nav>
    )
}