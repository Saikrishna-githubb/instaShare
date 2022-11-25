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

class UserProfile extends Component {
  state = {userProfileData: [], apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getUserProfileDetails()
  }

  getUserProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const token = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/insta-share/users/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const responseData = await response.json()
      const data = {userDetails: responseData.user_details}
      console.log(data)
      const {userDetails} = data
      const updatedData = {
        followersCount: userDetails.followers_count,
        followingCount: userDetails.following_count,
        id: userDetails.id,
        posts: userDetails.posts,
        postsCount: userDetails.posts_count,
        profilePic: userDetails.profile_pic,
        stories: userDetails.stories,
        userBio: userDetails.user_bio,
        userId: userDetails.user_id,
        userName: userDetails.user_name,
      }
      this.setState({
        userProfileData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {userProfileData} = this.state
    const postsCount = userProfileData.posts.length

    return (
      <ThemeContext.Consumer>
        {value => {
          const {isDarkTheme} = value

          const textColor = isDarkTheme
            ? 'list-text-dark-theme '
            : 'list-text-light-theme'

          return (
            <div className="user-profile-content-container">
              <div className="user-profile-top-section">
                <div className="user-profile-details-section-sm-lg">
                  <img
                    src={userProfileData.profilePic}
                    alt="my profile"
                    className="user-profile-pic-lg"
                  />
                  <div>
                    <h1 className={`user-profile-username ${textColor}`}>
                      {userProfileData.userName}
                    </h1>

                    <ul className="user-profile-details-container">
                      <li>
                        <img
                          src={userProfileData.profilePic}
                          alt="user profile"
                          className="user-profile-pic-sm"
                        />
                      </li>
                      <li className="user-profile-posts-count-container">
                        <h1 className={`user-profile-posts-count ${textColor}`}>
                          {userProfileData.postsCount}
                        </h1>
                        <p
                          className={`user-profile-details-title ${textColor}`}
                        >
                          posts
                        </p>
                      </li>
                      <li className="user-profile-posts-count-container">
                        <h1 className={`user-profile-posts-count ${textColor}`}>
                          {userProfileData.followersCount}
                        </h1>
                        <p
                          className={`user-profile-details-title ${textColor}`}
                        >
                          followers
                        </p>
                      </li>
                      <li className="user-profile-posts-count-container">
                        <h1 className={`user-profile-posts-count ${textColor}`}>
                          {userProfileData.followingCount}
                        </h1>
                        <p
                          className={`user-profile-details-title ${textColor}`}
                        >
                          following
                        </p>
                      </li>
                    </ul>

                    <p className={`user-profile-sub-username ${textColor}`}>
                      {userProfileData.userId}
                    </p>
                    <p className={`user-profile-user-bio ${textColor}`}>
                      {userProfileData.userBio}
                    </p>
                  </div>
                </div>
                <ul className="user-profile-stories-container">
                  {userProfileData.stories.map(eachStory => (
                    <li className="user-profile-story-item" key={eachStory.id}>
                      <img
                        src={eachStory.image}
                        alt="user story"
                        className="user-profile-story"
                      />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="user-profile-bottom-section">
                <div className="user-profile-posts-sub-heading-container">
                  <BsGrid3X3 className="user-profile-grid-icon" />
                  <h1 className={`user-profile-posts-sub-heading ${textColor}`}>
                    Posts
                  </h1>
                </div>

                {postsCount > 0 ? (
                  <ul className="user-profile-posts-list-container">
                    {userProfileData.posts.map(eachPost => (
                      <li
                        className="user-profile-post-list-item"
                        key={eachPost.id}
                      >
                        <img
                          src={eachPost.image}
                          alt="user post"
                          className="user-profile-post-image"
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="user-profile-no-posts-container">
                    <div className="user-profile-no-posts-camera-container">
                      <BiCamera className="user-profile-camera-icon" />
                    </div>
                    <h1
                      className={`user-profile-no-posts-heading ${textColor}`}
                    >
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
    <div className="user-profile-loader-container">
      <Loader type="TailSpin" height="30" width="30" color="#4094EF" />
    </div>
  )

  onTryAgainGetUserProfile = () => this.getUserProfileDetails()

  renderFailureView = () => (
    <div className="user-profile-failure-container">
      <img
        src="https://res.cloudinary.com/dcsy19n4b/image/upload/v1669281379/InstaShare/somethingWentWrong_ko3iaa.png"
        alt="failure view"
        className="user-profile-failure-image"
      />
      <p className="user-profile-failure-desc">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        className="user-profile-failure-retry-button"
        onClick={this.onTryAgainGetUserProfile}
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
          const bgColorClassName = isDarkTheme ? 'nav-bg-dark' : 'nav-bg-light '
          return (
            <>
              <Header />
              <div
                className={`user-profile-page-bg-container ${bgColorClassName}`}
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

export default UserProfile
