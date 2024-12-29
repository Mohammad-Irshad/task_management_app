import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const Header = () => {

  const navigate = useNavigate()

  const signoutHandler = () => {
    localStorage.removeItem('accessToken')
    navigate('/')
  }

  return (
    <header>
      <nav className="navbar bg-body-tertiary">
        <div className="container ">
          <div>
            <NavLink className={({ isActive }) =>
                `navbar-brand ${isActive ? 'active-link' : ''}`
              }
               to={'/dashboard'}>
                Dashboard</NavLink>
            <NavLink className={({ isActive }) =>
                `navbar-brand ${isActive ? 'active-link' : ''}`
              }
               to={'/tasks'}>
                Task List</NavLink>
          </div>          
          <div>
            <button className="btn btn-primary" onClick={signoutHandler}>Logout</button>
          </div>
          
        </div>
      </nav>
    </header>
  )
}

export default Header
