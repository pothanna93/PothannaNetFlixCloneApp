import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class LoginRoute extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
    const {username, password} = this.state
    localStorage.setItem('username', username)
    localStorage.setItem('password', password)
  }

  onFailureSubmit = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state

    const userDetails = {username, password}

    const loginUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(loginUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onFailureSubmit(data.error_msg)
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  usernameElement = () => {
    const {username} = this.state
    return (
      <div className="username-container">
        <label htmlFor="username" className="label-element">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="user-input"
          onChange={this.onChangeUsername}
          value={username}
        />
      </div>
    )
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  passwordElement = () => {
    const {password} = this.state
    return (
      <div className="username-container">
        <label htmlFor="password" className="label-element">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="user-input"
          onChange={this.onChangePassword}
          value={password}
        />
      </div>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-page-container">
        <img
          src="https://res.cloudinary.com/dyx9u0bif/image/upload/v1657426908/lg-devices-logo_rpfa68.png"
          className="app-logo"
          alt="login website logo"
        />

        <div className="responsive-container">
          <div className="login-form-container">
            <h1 className="login">Login</h1>
            <form className="form-container" onSubmit={this.onSubmitForm}>
              {this.usernameElement()}
              {this.passwordElement()}
              {showSubmitError && <p className="error-msg">{errorMsg}</p>}
              <button type="submit" className="sign-button">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default LoginRoute
