import React, { useState, useEffect, useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";


import { logout } from "../slices/auth";

import EventBus from "../common/EventBus";

export default function Header(props) {

	const [showModeratorBoard, setShowModeratorBoard] = useState(false);
	const [showAdminBoard, setShowAdminBoard] = useState(false);

	const { user: currentUser } = useSelector((state) => state.auth);
	const dispatch = useDispatch();

	const logOut = useCallback(() => {
		dispatch(logout());
	}, [dispatch]);

	useEffect(() => {
		if (currentUser) {
			setShowModeratorBoard(currentUser.roles.includes("ROLE_MODERATOR"));
			setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
		} else {
			setShowModeratorBoard(false);
			setShowAdminBoard(false);
		}

		EventBus.on("logout", () => {
			logOut();
		});

		return () => {
			EventBus.remove("logout");
		};
	}, [currentUser, logOut]);

	return (
		<>
			<nav>
				<Link to={"/"} >
					Video Chat
				</Link>
				<div>
					<li>
						<Link to={"/home"} >
							Home
						</Link>
					</li>
					{showModeratorBoard && (
						<li>
							<Link to={"/mod"} >
								Moderator Board
							</Link>
						</li>
					)}
					{showAdminBoard && (
						<li>
							<Link to={"/admin"} >
								Admin Board
							</Link>
						</li>
					)}
					{currentUser && (
						<>
							<li>
								<Link to={"/user"} >
									User
								</Link>
							</li>
							<li>
								<Link to={"/chat"}>
									Chat
								</Link>
							</li>
						</>
						
					)}
				</div>
				{currentUser ? (
					<div>
						<li >
							<Link to={"/profile"} >
								{currentUser.username}
							</Link>
						</li>
						<li>
							<a href="/login"  onClick={logOut}>
								LogOut
							</a>
						</li>
					</div>
				) : (
					<div>
						<li>
							<Link to={"/login"} >
								Login
							</Link>
						</li>
						<li>
							<Link to={"/register"} >
								Sign Up
							</Link>
						</li>
					</div>
				)}
			</nav>
		</>
	)
}
