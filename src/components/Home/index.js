import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import Header from '../Header'
import InstaPostItem from '../InstaPostItem'
import InstaStoryItem from '../InstaStoryItem'

import ThemeContext from '../../context/ThemeContext'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 7,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 7,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 360,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
  ],
}

class Home extends Component {
  state = {
    triggerSearch: false,
    searchInput: '',
    allPosts: [],
    searchPosts: [],
    usersStories: [],
    allPostsApiStatus: apiStatusConstants.initial,
    storiesApiStatus: apiStatusConstants.initial,
    searchApiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getInstaPosts()
    this.getStories()
  }

  onChangeSearchInput = input => {
    this.setState({searchInput: input})
  }

  onShowTriggerSearch = userInput => {
    this.setState(
      {triggerSearch: true, searchInput: userInput},
      this.getSearchFilteredPosts,
    )
  }

  onCloseTriggerSearch = () => {
    this.setState({triggerSearch: false, searchInput: ''})
  }

  getSearchFilteredPosts = async () => {
    this.setState({searchApiStatus: apiStatusConstants.inProgress})
    const token = Cookies.get('jwt_token')
    const {searchInput} = this.state
    const url = `https://apis.ccbp.in/insta-share/posts?search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      const {posts} = data
      const updatedData = posts.map(eachPost => ({
        comments: eachPost.comments.map(each => ({
          comment: each.comment,
          userId: each.user_id,
          userName: each.user_name,
        })),
        createdAt: eachPost.created_at,
        likesCount: eachPost.likes_count,
        postDetails: {
          caption: eachPost.post_details.caption,
          imageUrl: eachPost.post_details.image_url,
        },
        postId: eachPost.post_id,
        profilePic: eachPost.profile_pic,
        userId: eachPost.user_id,
        userName: eachPost.user_name,
      }))

      this.setState({
        searchPosts: updatedData,
        searchApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({searchApiStatus: apiStatusConstants.failure})
    }
  }

  renderSearchSuccessView = () => {
    const {searchPosts} = this.state
    const searchPostsCount = searchPosts.length

    return (
      <ThemeContext.Consumer>
        {value => {
          const {isDarkTheme} = value
          const bgColorClassName = isDarkTheme ? 'nav-bg-dark' : 'nav-bg-light '
          const textColor = isDarkTheme
            ? 'list-text-dark-theme '
            : 'list-text-light-theme'

          return (
            <>
              {searchPostsCount > 0 ? (
                <>
                  <h1 className={`search-heading ${textColor}`}>
                    Search Results
                  </h1>
                  <div
                    className={`search-section-container ${bgColorClassName}`}
                  >
                    <ul
                      className={`search-posts-list-container ${bgColorClassName}`}
                    >
                      {searchPosts.map(eachPost => (
                        <InstaPostItem
                          postDetails={eachPost}
                          key={eachPost.postId}
                        />
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="search-not-found-container">
                  <img
                    src="https://res.cloudinary.com/dcsy19n4b/image/upload/v1669281335/InstaShare/NoSearchFound_mdgifc.png"
                    alt="search not found"
                    className="search-not-found-image"
                  />
                  <h1 className={`search-not-found-title ${textColor}`}>
                    Search Not Found
                  </h1>
                  <p className={`search-not-found-desc ${textColor}`}>
                    Try different keyword or search again
                  </p>
                </div>
              )}
            </>
          )
        }}
      </ThemeContext.Consumer>
    )
  }

  renderSearchLoadingView = () => (
    <div className="search-loader-container">
      <Loader type="TailSpin" height="50" width="50" color="#4094EF" />
    </div>
  )

  renderStoriesLoaderView = () => (
    <div className="stories-loader-container">
      <Loader type="TailSpin" height="30" width="30" color="#4094EF" />
    </div>
  )

  renderSearchFailureView = () => (
    <div className="search-failure-container">
      <img
        src="https://res.cloudinary.com/dcsy19n4b/image/upload/v1669281379/InstaShare/somethingWentWrong_ko3iaa.png"
        alt="failure view"
        className="search-failure-image"
      />
      <p className="search-failure-desc">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        className="search-failure-retry-button"
        onClick={this.getSearchFilteredPosts}
      >
        Try again
      </button>
    </div>
  )

  renderSearchResultsSwitch = () => {
    const {searchApiStatus} = this.state
    switch (searchApiStatus) {
      case apiStatusConstants.success:
        return this.renderSearchSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderSearchLoadingView()
      case apiStatusConstants.failure:
        return this.renderSearchFailureView()
      default:
        return null
    }
  }

  getStories = async () => {
    this.setState({storiesApiStatus: apiStatusConstants.inProgress})
    const token = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/insta-share/stories'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        usersStories: data.users_stories,
        total: data.total,
      }
      const {usersStories} = updatedData
      const updatedUserStories = usersStories.map(eachItem => ({
        storyUrl: eachItem.story_url,
        userId: eachItem.user_id,
        userName: eachItem.user_name,
      }))
      this.setState({
        usersStories: updatedUserStories,
        storiesApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({storiesApiStatus: apiStatusConstants.failure})
    }
  }

  renderStoriesSlider = () => {
    const {usersStories} = this.state
    return (
      <ThemeContext.Consumer>
        {value => {
          const {isDarkTheme} = value
          const bgColorClassName = isDarkTheme ? 'nav-bg-dark' : 'nav-bg-light'

          return (
            <div className={`stories-container ${bgColorClassName}`}>
              <Slider {...settings}>
                {usersStories.map(eachStory => (
                  <InstaStoryItem
                    eachStory={eachStory}
                    key={eachStory.userId}
                  />
                ))}
              </Slider>
            </div>
          )
        }}
      </ThemeContext.Consumer>
    )
  }

  onTryAgainGetStories = () => this.getStories()

  renderStoriesFailureView = () => (
    <div className="stories-failure-container">
      <img
        src="https://res.cloudinary.com/dcsy19n4b/image/upload/v1669281400/InstaShare/TriangleCaution_ufizhi.png"
        alt="failure view"
        className="stories-failure-alert-icon"
      />
      <p className="stories-failure-desc">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        className="stories-failure-retry-button"
        onClick={this.onTryAgainGetStories}
      >
        Try again
      </button>
    </div>
  )

  renderStoriesSwitch = () => {
    const {storiesApiStatus} = this.state
    switch (storiesApiStatus) {
      case apiStatusConstants.success:
        return this.renderStoriesSlider()
      case apiStatusConstants.inProgress:
        return this.renderStoriesLoaderView()
      case apiStatusConstants.failure:
        return this.renderStoriesFailureView()
      default:
        return null
    }
  }

  getInstaPosts = async () => {
    this.setState({allPostsApiStatus: apiStatusConstants.inProgress})
    const token = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/insta-share/posts'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      const {posts} = data

      const updatedPosts = posts.map(eachPost => ({
        comments: eachPost.comments.map(each => ({
          comment: each.comment,
          userId: each.user_id,
          userName: each.user_name,
        })),
        createdAt: eachPost.created_at,
        likesCount: eachPost.likes_count,
        postDetails: {
          caption: eachPost.post_details.caption,
          imageUrl: eachPost.post_details.image_url,
        },
        postId: eachPost.post_id,
        profilePic: eachPost.profile_pic,
        userId: eachPost.user_id,
        userName: eachPost.user_name,
      }))

      this.setState({
        allPosts: updatedPosts,
        allPostsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({allPostsApiStatus: apiStatusConstants.failure})
    }
  }

  renderInstaPostsSuccessView = () => {
    const {allPosts} = this.state
    return (
      <ul className="all-posts-list-container">
        {allPosts.map(eachPost => (
          <InstaPostItem postDetails={eachPost} key={eachPost.postId} />
        ))}
      </ul>
    )
  }

  onTryAgain = () => this.getInstaPosts()

  renderInstaPostsFailureView = () => (
    <ThemeContext.Consumer>
      {value => {
        const {isDarkTheme} = value
        const textColor = isDarkTheme
          ? 'list-text-dark-theme '
          : 'list-text-light-theme'
        return (
          <div className="all-posts-failure-container">
            <img
              src="https://res.cloudinary.com/saiuttej/image/upload/v1656098258/Insta%20Share%20Project%20Assets/alert-triangle_o9v5op.png"
              alt="failure view"
              className="all-posts-failure-alert-icon"
            />
            <p className={`all-posts-failure-desc ${textColor}`}>
              Something went wrong. Please try again
            </p>
            <button
              type="button"
              className="all-posts-failure-retry-button"
              onClick={this.onTryAgain}
            >
              Try again
            </button>
          </div>
        )
      }}
    </ThemeContext.Consumer>
  )

  renderInstaPostsSwitch = () => {
    const {allPostsApiStatus} = this.state

    switch (allPostsApiStatus) {
      case apiStatusConstants.success:
        return this.renderInstaPostsSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderSearchLoadingView()
      case apiStatusConstants.failure:
        return this.renderInstaPostsFailureView()
      default:
        return null
    }
  }

  render() {
    const {triggerSearch} = this.state

    return (
      <ThemeContext.Consumer>
        {value => {
          const {isDarkTheme} = value
          const bgColorClassName = isDarkTheme ? 'nav-bg-dark' : 'nav-bg-light '

          return (
            <div className={`home-bg-container ${bgColorClassName}`}>
              <Header
                onShowTriggerSearch={this.onShowTriggerSearch}
                onCloseTriggerSearch={this.onCloseTriggerSearch}
              />
              <div className="home-content-container">
                {triggerSearch ? (
                  <>{this.renderSearchResultsSwitch()}</>
                ) : (
                  <>
                    {this.renderStoriesSwitch()}
                    {this.renderInstaPostsSwitch()}
                  </>
                )}
              </div>
            </div>
          )
        }}
      </ThemeContext.Consumer>
    )
  }
}
export default Home
