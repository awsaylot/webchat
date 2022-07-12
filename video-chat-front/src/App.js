import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";

import Header from './components/Header';
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardUser from "./components/BoardUser";
import BoardModerator from "./components/BoardModerator";
import BoardAdmin from "./components/BoardAdmin";
import ChatRoom from "./components/ChatRoom";

const App = () => {
  return (
	<Router>
	  <div>
		<Header />
		<div >
		  <Switch>
			<Route exact path={["/", "/home"]} component={Home} />
			<Route exact path="/login" component={Login} />
			<Route exact path="/register" component={Register} />
			<Route exact path="/profile" component={Profile} />
			<Route path="/user" component={BoardUser} />
			<Route path="/mod" component={BoardModerator} />
			<Route path="/admin" component={BoardAdmin} />
			<Route path="/chat" component={ChatRoom} />
		  </Switch>
		</div>
	  </div>
	</Router>
  );
};

export default App;

// TODO: build out chat page with chat messages and userlist
// TODO: build out video chat
// TODO: add styles