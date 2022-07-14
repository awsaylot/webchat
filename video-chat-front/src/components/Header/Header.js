import React from 'react'
import { useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import { logout } from "../../actions/authActions/auth";


export default function Header(props) {
	const {currentUser, showAdminBoard} = props
  const dispatch = useDispatch()
	const logOut = () => {
    console.log('logout')
		dispatch(logout());
	}
  return (
	<div>
		<nav className="navbar navbar-expand navbar-dark bg-dark">
            <Link to={"/"} className="navbar-brand">
              Awsaylot
            </Link>
            <div className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to={"/home"} className="nav-link">
                  Home
                </Link>
              </li>
              {showAdminBoard && (
                <li className="nav-item">
                  <Link to={"/admin"} className="nav-link">
                    Admin Board
                  </Link>
                </li>
              )}
            </div>
            {currentUser ? (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/profile"} className="nav-link">
                    {currentUser.username}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={"/chat"} className="nav-link">
                    Chat
                  </Link>
                </li>
                <li className="nav-item">
                  <a href='/login'  className="nav-link" onClick={logOut}>
                    LogOut
                  </a>
                </li>
              </div>
            ) : (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/login"} className="nav-link">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={"/register"} className="nav-link">
                    Sign Up
                  </Link>
                </li>
              </div>
            )}
          </nav>
	</div>
  )
}
