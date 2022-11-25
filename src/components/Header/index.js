import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {HiMenu} from 'react-icons/hi'
import {FaSearch} from 'react-icons/fa'
import {IoCloseCircle} from 'react-icons/io5'
import {FiSun} from 'react-icons/fi'
import {RiMoonFill} from 'react-icons/ri'

import Cookies from 'js-cookie'

import ThemeContext from '../../context/ThemeContext'

import './index.css'

class Header extends Component {
  state = {
    expandHamburger: false,
    searchInput: '',
    showSmSearchBar: false,
  }

  onLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  onHamburgerClick = () => {
    this.setState(prevState => ({
      expandHamburger: !prevState.expandHamburger,
      showSmSearchBar: false,
    }))
  }

  onCloseHamburgerClick = () => {
    const {onCloseTriggerSearch} = this.props
    onCloseTriggerSearch()
    this.setState(prevState => ({
      expandHamburger: !prevState.expandHamburger,
      showSmSearchBar: false,
    }))
  }

  onSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSearchButtonClicked = () => {
    const {onShowTriggerSearch} = this.props
    const {searchInput} = this.state
    onShowTriggerSearch(searchInput)
  }

  toggleShowSmSearchBar = () => {
    this.setState({showSmSearchBar: true, expandHamburger: false})
  }

  render() {
    const {expandHamburger, showSmSearchBar, searchInput} = this.state

    return (
      <ThemeContext.Consumer>
        {value => {
          const {isDarkTheme, toggleTheme} = value
          const onClickToggle = () => {
            toggleTheme()
          }
          const bgColorClassName = isDarkTheme
            ? 'nav-bar-bg-dark'
            : 'nav-bar-bg-light'
          const navItemClassName = isDarkTheme
            ? 'list-text-dark-theme'
            : 'list-text-light-theme'

          const ThemeIcons = isDarkTheme ? (
            <FiSun size={15} color="#ffffff" />
          ) : (
            <RiMoonFill size={15} />
          )

          return (
            <nav className={`nav-header ${bgColorClassName}`}>
              <div className="nav-content">
                <div className="header-sm-container">
                  <Link to="/" className="link-tag">
                    <button
                      className="header-logo-container-button"
                      type="button"
                    >
                      <img
                        src="https://res.cloudinary.com/dcsy19n4b/image/upload/v1669281432/InstaShare/websiteLogo_j56qly.png"
                        alt="website logo"
                        className="header-website-logo"
                      />
                      <h1 className={`header-logo-heading ${navItemClassName}`}>
                        Insta Share
                      </h1>
                    </button>
                  </Link>

                  <button
                    type="button"
                    className={`sm-hamburger-close-button ${navItemClassName}`}
                    onClick={this.onHamburgerClick}
                  >
                    <HiMenu
                      className={`header-burger-icon ${navItemClassName}`}
                    />
                  </button>
                </div>

                {expandHamburger && (
                  <div className="sm-hamburger-expanded-menu-container">
                    <ul className="sm-hamburger-menu-list-container">
                      <Link to="/" className="link-tag">
                        <li className="sm-hamburger-menu-item">
                          <button
                            type="button"
                            className={`sm-hamburger-menu-item-button ${navItemClassName}`}
                          >
                            Home
                          </button>
                        </li>
                      </Link>
                      <li className="sm-hamburger-menu-item">
                        <button
                          type="button"
                          className={`sm-hamburger-menu-item-button ${navItemClassName}`}
                          onClick={this.toggleShowSmSearchBar}
                        >
                          Search
                        </button>
                      </li>
                      <Link to="/my-profile" className="link-tag">
                        <li className="sm-hamburger-menu-item">
                          <button
                            type="button"
                            className={`sm-hamburger-menu-item-button ${navItemClassName}`}
                          >
                            Profile
                          </button>
                        </li>
                      </Link>
                      <li>
                        <button
                          type="button"
                          className="theme-btn"
                          onClick={onClickToggle}
                        >
                          {ThemeIcons}
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="logout-button logout-button-sm"
                          onClick={this.onLogout}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>

                    {/* <button
                      type="button"
                      className={`sm-hamburger-close-button ${navItemClassName}`}
                      onClick={this.onCloseHamburgerClick}
                    >
                      <IoCloseCircle className="sm-hamburger-close-icon" />
                    </button> */}
                  </div>
                )}

                {showSmSearchBar && (
                  <div className="header-sm-search-section">
                    <div className="header-sm-search-container">
                      <input
                        type="search"
                        placeholder="Search Caption"
                        className="header-sm-search-input-field"
                        onChange={this.onSearchInput}
                        value={searchInput}
                      />

                      <div className="sm-search-icon-container">
                        <button
                          type="button"
                          className="sm-search-icon-button"
                          onClick={this.onSearchButtonClicked}
                        >
                          <FaSearch className="sm-search-icon" />
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="sm-hamburger-close-button"
                      onClick={this.onCloseHamburgerClick}
                    >
                      <IoCloseCircle className="sm-hamburger-close-icon" />
                    </button>
                  </div>
                )}

                <div className="header-large-menu-container">
                  <div className="header-search-container">
                    <input
                      type="search"
                      placeholder="Search Caption"
                      className="header-search-input-field"
                      onChange={this.onSearchInput}
                      value={searchInput}
                    />

                    <div className="search-icon-container">
                      <button
                        type="button"
                        className="search-icon-button"
                        onClick={this.onSearchButtonClicked}
                      >
                        <FaSearch className="search-icon" testid="searchIcon" />
                      </button>
                    </div>
                  </div>

                  <ul className="nav-lg-menu-list-container">
                    <li>
                      <button
                        type="button"
                        className="theme-btn"
                        onClick={onClickToggle}
                      >
                        {ThemeIcons}
                      </button>
                    </li>

                    <Link to="/" className="link-tag">
                      <li className="nav-lg-menu-item">
                        <button
                          type="button"
                          className={`lg-menu-item-button ${navItemClassName}`}
                        >
                          Home
                        </button>
                      </li>
                    </Link>
                    <Link to="/my-profile" className="link-tag">
                      <li className="nav-lg-menu-item">
                        <button
                          type="button"
                          className={`lg-menu-item-button ${navItemClassName}`}
                        >
                          Profile
                        </button>
                      </li>
                    </Link>
                  </ul>
                  <button
                    type="button"
                    className="logout-button"
                    onClick={this.onLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </nav>
          )
        }}
      </ThemeContext.Consumer>
    )
  }
}
export default withRouter(Header)
