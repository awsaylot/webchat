import React, { Component } from "react";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Outlet } from "react-router-dom";

import Header from "./components/Header/Header";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAdminBoard: false,
      currentUser: undefined,
    };

  }
  componentDidMount() {
    const user = this.props.user;
    if (user) {
      this.setState({
        currentUser: user,
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }
  }
  
  render() {
    const { currentUser, showAdminBoard } = this.state;
    return (
        <div>
          <Header currentUser={currentUser} showAdminBoard={showAdminBoard} />
          <div className="container mt-3">
          <Outlet />
          </div>
        </div>
    );
  }
}
function mapStateToProps(state) {
  const { user } = state.auth;
  return {
    user,
  };
}
export default connect(mapStateToProps)(App);