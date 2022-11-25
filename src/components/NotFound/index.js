import './index.css'

const NotFound = props => {
  const onGoToHomePage = () => {
    const {history} = props
    history.replace('/')
  }

  return (
    <div className="not-found-container">
      <img
        src="https://res.cloudinary.com/dcsy19n4b/image/upload/v1669281367/InstaShare/PageNotFound-sm_hdqqdt.png"
        alt="page not found"
        className="not-found-image"
      />
      <h1 className="not-found-title">PAGE NOT FOUND</h1>
      <p className="not-found-desc">
        we are sorry, the page you requested could not be found
      </p>
      <p className="not-found-desc">Please go back to homepage</p>
      <button
        type="button"
        className="not-found-home-button"
        onClick={onGoToHomePage}
      >
        Home Page
      </button>
    </div>
  )
}

export default NotFound
