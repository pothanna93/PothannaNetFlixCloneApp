import HeaderPage from '../HeaderPage'
import './index.css'

const MovieItem = props => {
  const {movieDetails} = props
  const {
    backdropPath,
    title,
    adult,
    runtime,
    releaseDate,
    overview,
  } = movieDetails

  const hours = Math.floor(runtime / 60)
  const minutes = runtime % 60
  const date = new Date(releaseDate)
  const year = date.getFullYear()
  return (
    <div
      className="home-poster-container"
      style={{backgroundImage: `url(${backdropPath})`}}
    >
      <HeaderPage />
      <div className="poster-div">
        <div className="content-container">
          <h1 className="poster-title">{title}</h1>
          <div className="runtime-container">
            <p className="movie-poster-overview">{`${hours}h ${minutes}m `}</p>
            <p className="movie-poster-overview">{adult ? 'A' : 'U/A'}</p>
            <p className="movie-poster-overview">{year}</p>
          </div>
          <p className="poster-overview">{overview}</p>
          <button type="button" className="poster-btn">
            Play
          </button>
        </div>
      </div>
    </div>
  )
}

export default MovieItem
