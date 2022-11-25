import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class LoginForm extends Component {
  state = {username: '', password: '', errorMsg: '', showErrorMsg: false}

  submitSuccess = token => {
    const {history} = this.props
    Cookies.set('jwt_token', token, {expires: 30})
    history.replace('/')
  }

  submitFailure = errorMsg => {
    this.setState({errorMsg, showErrorMsg: true})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {
      username,
      password,
    }
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.submitSuccess(data.jwt_token)
    } else {
      this.submitFailure(data.error_msg)
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  renderUsernameContainer = () => {
    const {username} = this.state
    return (
      <>
        <label htmlFor="username" className="login-form-label">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="login-form-text-input"
          onChange={this.onChangeUsername}
          value={username}
          placeholder="Enter Username"
        />
      </>
    )
  }

  renderPasswordContainer = () => {
    const {password} = this.state
    return (
      <>
        <label htmlFor="password" className="login-form-label">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="login-form-text-input"
          onChange={this.onChangePassword}
          value={password}
          placeholder="Enter Password"
        />
      </>
    )
  }

  render() {
    const {errorMsg, showErrorMsg} = this.state
    const errorMsgClassName = showErrorMsg ? 'show-error-msg' : ''
    const token = Cookies.get('jwt_token')

    if (token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-bg-container">
        <div className="login-content-container">
          <img
            src="https://res.cloudinary.com/dcsy19n4b/image/upload/v1669281315/InstaShare/Layer_2_h3tnvt.png"
            alt="website login"
            className="website-login-image"
          />
          <form className="login-form-container" onSubmit={this.submitForm}>
            <img
              src="https://res.cloudinary.com/dcsy19n4b/image/upload/v1669281432/InstaShare/websiteLogo_j56qly.png"
              alt="website logo"
              className="website-logo"
            />
            <h1 className="login-form-logo-heading">Insta Share</h1>

            <div className="input-container">
              {this.renderUsernameContainer()}
            </div>
            <div className="input-container">
              {this.renderPasswordContainer()}
            </div>
            <p className={`login-error-msg ${errorMsgClassName}`}>{errorMsg}</p>
            <button type="submit" className="form-submit-button">
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }
}
export default LoginForm
