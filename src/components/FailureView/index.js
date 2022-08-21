import './index.css'

const FailureView = props => {
  const {onRetry} = props
  const onClickRetry = () => {
    onRetry()
  }

  return (
    <div className="fail-container">
      <img
        className="failed-image"
        src="https://res.cloudinary.com/dyx9u0bif/image/upload/v1657426934/homepage-failure_egb8fl.png"
        alt="failure view"
      />

      <p className="try-description">Something went wrong. Please try again</p>
      <button type="button" className="try-btn" onClick={onClickRetry}>
        Try Again
      </button>
    </div>
  )
}

export default FailureView
