import HeaderPage from '../HeaderPage'
import './index.css'

const HomePoster = props => {
  const {posterDetails} = props
  const {backdropPath, title, overview} = posterDetails
  return (
    <div
      className="home-poster-container"
      style={{backgroundImage: `url(${backdropPath})`}}
    >
      <HeaderPage />
      <div className="poster-div">
        <div className="content-container">
          <h1 className="poster-title">{title}</h1>
          <p className="poster-overview">{overview}</p>
          <button type="button" className="poster-btn">
            Play
          </button>
        </div>
      </div>
    </div>
  )
}

export default HomePoster
