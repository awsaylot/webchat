import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { connect } from "react-redux";
import { login } from "../../actions/authActions/auth";
import { Navigate } from "react-router-dom";
const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

class Login extends Component {
  constructor(props) {
    super(props)
    this.handleLogin = this.handleLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      username: "",
      password: "",
      loading: false,
    }
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleLogin(e) {
    e.preventDefault()
    this.setState({
      loading: true
    })
    this.form.validateAll()
    const {dispatch, history } = this.props
    if (this.checkBtn.context._errors.length === 0) {
      dispatch(login(this.state.username, this.state.password))
        .then(() => {
          window.location.reload()
        })
        .catch(() => {
          this.setState({
            loading: false
          })
        })
    } else {
      this.setState({
        loading: false,
      })
    }
  }
  render() {
    const {isLoggedIn, message} = this.props
    if (isLoggedIn) {
      return <Navigate to="/home" replace={true} />
    }
    return (
      <div className="col-md-12">
        <div className="card card-container">
          <Form
          onSubmit={this.handleLogin}
          ref={(c) => {
          this.form = c}}
          >
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <Input
              type="text"
              className="form-controll"
              name="username"
              value={this.state.username}
              onChange={this.handleChange}
              validations={[required]}
              />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <Input
              type="password"
              className="form-control"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
              validations={[required]}
              />
          </div>
          <div className="form-group">
            <button
              className="btn btn-primary btn-block"
              disabled={this.state.loading}
              >
                {this.state.loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Login</span>
              </button>
          </div>
          {message && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            </div>
          )}
          <CheckButton
            style={{display: "none"}}
            ref={(c) => {
              this.checkBtn = c;
            }}
            />
          </Form>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { isLoggedIn } = state.auth
  const { message } = state.message
  return {
    isLoggedIn,
    message
  }
}
export default connect(mapStateToProps)(Login);