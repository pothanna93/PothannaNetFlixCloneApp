import {Component} from 'react'
import Cookies from 'js-cookie'
import HeaderPage from '../HeaderPage'
import FooterRoute from '../FooterRoute'

import './index.css'

class AccountRoute extends Component {
  state = {
    username: localStorage.getItem('username'),
    password: localStorage.getItem('password'),
  }

  onClickLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  render() {
    const {username, password} = this.state

    const passwordInAsterisk = '*'.repeat(password.length)
    return (
      <div className="account-container">
        <HeaderPage />
        <div className="account-resp-div">
          <h1>Account</h1>
          <hr className="hr-line" />
          <div className="member-details-container">
            <p className="membership-heading">Member ship</p>
            <div>
              <p className="membership-email">{username}@gmail.com</p>
              <p className="membership-password">
                Password:{passwordInAsterisk}
              </p>
            </div>
          </div>
          <hr className="hr-line" />
          <div className="membership-container">
            <p className="membership-heading">Plan details</p>
            <p className="membership-premium">Premium</p>
            <p className="ultra-hd">Ultra HD</p>
          </div>
          <hr className="hr-line" />
          <div className="account-logout-container">
            <button
              onClick={this.onClickLogout}
              className="account-logout"
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
        <FooterRoute />
      </div>
    )
  }
}
export default AccountRoute
