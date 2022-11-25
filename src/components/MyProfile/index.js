import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'
import Cookies from 'js-cookie'

import ThemeContext from '../../context/ThemeContext'

import './index.css'
import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class MyProfile extends Component {
  state = {profileData: [], apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getMyProfileDetails()
  }

  getMyProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const token = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/insta-share/my-profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      const {profile} = data
      const updatedData = {
        followersCount: profile.followers_count,
        followingCount: profile.following_count,
        id: profile.id,
        posts: profile.posts,
        postsCount: profile.posts_count,
        profilePic: profile.profile_pic,
        stories: profile.stories,
        userBio: profile.user_bio,
        userId: profile.user_id,
        userName: profile.user_name,
      }
      this.setState({
        profileData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {profileData} = this.state
    const postsCount = profileData.posts.length

    return (
      <ThemeContext.Consumer>
        {value => {
          const {isDarkTheme} = value
          const textColor = isDarkTheme
            ? 'list-text-dark-theme '
            : 'list-text-light-theme'

          return (
            <div className="my-profile-content-container">
              <div className="my-profile-top-section">
                <div className="my-profile-details-section-sm-lg">
                  <img
                    src={profileData.profilePic}
                    alt="user profile"
                    className="my-profile-pic-lg"
                  />
                  <div>
                    <h1 className={`my-profile-username ${textColor}`}>
                      {profileData.userName}
                    </h1>

                    <ul className="my-profile-details-container">
                      <li>
                        <img
                          src={profileData.profilePic}
                          alt="my profile"
                          className="my-profile-pic-sm"
                        />
                      </li>
                      <li className="my-profile-posts-count-container">
                        <h1 className={`my-profile-posts-count ${textColor}`}>
                          {profileData.postsCount}
                        </h1>
                        <p className={`my-profile-details-title ${textColor}`}>
                          posts
                        </p>
                      </li>
                      <li className="my-profile-posts-count-container">
                        <h1 className={`my-profile-posts-count ${textColor}`}>
                          {profileData.followersCount}
                        </h1>
                        <p className={`my-profile-details-title ${textColor}`}>
                          followers
                        </p>
                      </li>
                      <li className="my-profile-posts-count-container">
                        <h1 className={`my-profile-posts-count ${textColor}`}>
                          {profileData.followingCount}
                        </h1>
                        <p className={`my-profile-details-title ${textColor}`}>
                          following
                        </p>
                      </li>
                    </ul>

                    <p className={`my-profile-sub-username ${textColor}`}>
                      {profileData.userId}
                    </p>
                    <p className={`my-profile-user-bio ${textColor}`}>
                      {profileData.userBio}
                    </p>
                  </div>
                </div>
                <ul className="my-profile-stories-container">
                  {profileData.stories.map(eachStory => (
                    <li className="my-profile-story-item" key={eachStory.id}>
                      <img
                        src={eachStory.image}
                        alt="my story"
                        className="my-profile-story"
                      />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="my-profile-bottom-section">
                <div className="my-profile-posts-sub-heading-container">
                  <BsGrid3X3 className="grid-icon" />
                  <h1 className={`my-profile-posts-sub-heading ${textColor}`}>
                    Posts
                  </h1>
                </div>

                {postsCount > 0 ? (
                  <ul className="my-profile-posts-list-container">
                    {profileData.posts.map(eachPost => (
                      <li
                        className="my-profile-post-list-item"
                        key={eachPost.id}
                      >
                        <img
                          src={eachPost.image}
                          alt="my post"
                          className="my-profile-post-image"
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="no-posts-container">
                    <div className="no-posts-camera-container">
                      <BiCamera className="camera-icon" />
                    </div>
                    <h1 className={`no-posts-heading ${textColor}`}>
                      No Posts
                    </h1>
                  </div>
                )}
              </div>
            </div>
          )
        }}
      </ThemeContext.Consumer>
    )
  }

  renderLoaderView = () => (
    <div className="my-profile-loader-container">
      <Loader type="TailSpin" height="30" width="30" color="#4094EF" />
    </div>
  )

  onTryAgainGetMyProfile = () => this.getMyProfileDetails()

  renderFailureView = () => (
    <div className="my-profile-failure-container">
      <img
        src="https://res.cloudinary.com/dcsy19n4b/image/upload/v1669281379/InstaShare/somethingWentWrong_ko3iaa.png"
        alt="failure view"
        className="my-profile-failure-image"
      />
      <p className="my-profile-failure-desc">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        className="my-profile-failure-retry-button"
        onClick={this.onTryAgainGetMyProfile}
      >
        Try again
      </button>
    </div>
  )

  renderSwitch = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <ThemeContext.Consumer>
        {value => {
          const {isDarkTheme} = value
          const bgColorClassName = isDarkTheme ? 'nav-bg-dark' : 'nav-bg-light'
          return (
            <>
              <Header />
              <div
                className={`my-profile-page-bg-container ${bgColorClassName}`}
              >
                {this.renderSwitch()}
              </div>
            </>
          )
        }}
      </ThemeContext.Consumer>
    )
  }
}

export default MyProfile
