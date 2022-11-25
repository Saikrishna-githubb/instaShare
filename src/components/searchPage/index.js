import {Component} from 'react'
import {FaSearch} from 'react-icons/fa'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import InstaPostItem from '../InstaPostItem'
import ThemeContext from '../../context/ThemeContext'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class SearchPage extends Component {
  state = {
    searchInput: '',
    searchResultsPosts: [],
    apiStatus: apiStatusConstants.initial,
    isSearchClicked: false,
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearchButton = () => {
    this.setState({isSearchClicked: true}, this.getSearchFilteredPosts)
  }

  onTryAgainSearchResults = () => {
    this.getSearchFilteredPosts()
  }

  getSearchFilteredPosts = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
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
      searchResultsPosts: updatedData,
      apiStatus: apiStatusConstants.success,
    })
  }

  renderSuccessView = () => {
    const {searchResultsPosts} = this.state
    const searchPostsCount = searchResultsPosts.length

    return (
      <ThemeContext.Consumer>
        {value => {
          const {isDarkTheme} = value

          const textColor = isDarkTheme
            ? 'list-text-dark-theme '
            : 'list-text-light-theme'
          return (
            <>
              {searchPostsCount > 0 ? (
                <ul className="search-posts-list-container">
                  {searchResultsPosts.map(eachPost => (
                    <InstaPostItem
                      postDetails={eachPost}
                      key={eachPost.postId}
                    />
                  ))}
                </ul>
              ) : (
                <div className="home-search-page-body">
                  <img
                    src="https://res.cloudinary.com/dcsy19n4b/image/upload/v1669281335/InstaShare/NoSearchFound_mdgifc.png"
                    alt="search not found"
                    className="search-not-found-image"
                  />
                  <h1 className={`home-search-not-found-title ${textColor}`}>
                    Search Not Found
                  </h1>
                  <p className={`home-search-not-found-desc ${textColor}`}>
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

  renderLoadingView = () => (
    <div className="search-loader-container">
      <Loader type="TailSpin" height="50" width="50" color="#4094EF" />
    </div>
  )

  renderFailureView = () => (
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
        onClick={this.onTryAgainSearchResults}
      >
        Try again
      </button>
    </div>
  )

  renderViewSwitch = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {searchInput, isSearchClicked} = this.state
    return (
      <ThemeContext.Consumer>
        {value => {
          const {isDarkTheme} = value

          const textColor = isDarkTheme
            ? 'list-text-dark-theme '
            : 'list-text-light-theme'

          return (
            <>
              <Header />
              <div className="home-search-page-section">
                <div className="home-search-container">
                  <input
                    type="search"
                    placeholder="Search Caption"
                    className="home-search-input-field"
                    value={searchInput}
                    onChange={this.onChangeSearchInput}
                  />
                  <div className="home-search-icon-container">
                    <button
                      type="button"
                      className="home-search-icon-button"
                      onClick={this.onClickSearchButton}
                    >
                      <FaSearch
                        className="home-search-icon"
                        testid="searchIcon"
                      />
                    </button>
                  </div>
                </div>

                {isSearchClicked ? (
                  this.renderViewSwitch()
                ) : (
                  <div className="home-search-page-body">
                    <img
                      src="https://res.cloudinary.com/saiuttej/image/upload/v1656532101/Insta%20Share%20Project%20Assets/Frame_1473search-page-image_ber2d2.png"
                      alt="search"
                      className="home-search-page-image"
                    />
                    <p className={`home-search-page-desc ${textColor}`}>
                      Search Results will be appear here
                    </p>
                  </div>
                )}
              </div>
            </>
          )
        }}
      </ThemeContext.Consumer>
    )
  }
}

export default SearchPage
