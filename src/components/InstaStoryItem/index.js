import './index.css'

import ThemeContext from '../../context/ThemeContext'

const InstaStoryItem = props => {
  const {eachStory} = props
  const {storyUrl, userName} = eachStory
  return (
    <ThemeContext.Consumer>
      {value => {
        const {isDarkTheme} = value
        const textColor = isDarkTheme
          ? 'list-text-dark-theme'
          : 'list-text-light-theme '

        return (
          <div className={`slick-item ${textColor}`}>
            <img src={storyUrl} alt="user story" className="user-story-image" />
            <p className={`story-username ${textColor}`}>{userName}</p>
          </div>
        )
      }}
    </ThemeContext.Consumer>
  )
}
export default InstaStoryItem
