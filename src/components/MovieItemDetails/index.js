import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import FailureView from '../FailureView'
import MovieItem from '../MovieItem'

import './index.css'
import FooterRoute from '../FooterRoute'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class MovieItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    movieDetails: [],
  }

  componentDidMount() {
    this.getMovieItems()
  }

  getMovieItems = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/movies-app/movies/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()

      const fetchedData = {
        movieItems: {
          adult: data.movie_details.adult,
          backdropPath: data.movie_details.backdrop_path,
          budget: data.movie_details.budget,
          id: data.movie_details.id,
          overview: data.movie_details.overview,
          posterPath: data.movie_details.poster_path,
          releaseDate: data.movie_details.release_date,
          runtime: data.movie_details.runtime,
          title: data.movie_details.title,
          voteAverage: data.movie_details.vote_average,
          voteCount: data.movie_details.vote_count,
        },
        genres: data.movie_details.genres.map(eachItem => ({
          id: eachItem.id,
          name: eachItem.name,
        })),
        similarMovies: data.movie_details.similar_movies.map(eachItem => ({
          id: eachItem.id,
          backdropPath: eachItem.backdrop_path,
          posterPath: eachItem.poster_path,
          title: eachItem.title,
        })),
        spokenLanguages: data.movie_details.spoken_languages.map(eachItem => ({
          id: eachItem.id,
          englishName: eachItem.english_name,
        })),
      }
      this.setState({
        movieDetails: fetchedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {movieDetails} = this.state
    const {similarMovies, spokenLanguages, genres, movieItems} = movieDetails
    const {voteCount, voteAverage, budget, releaseDate} = movieItems

    return (
      <>
        <div className="poster-container">
          <MovieItem movieDetails={movieItems} />
        </div>
        <div className="movie-info-container">
          <div className="movie-items-div">
            <h1 className="movie-info-heading">Genres</h1>
            <ul className="movie-info-ul-container">
              {genres.map(eachGenre => (
                <li className="movie-list-item" key={eachGenre.id}>
                  <p>{eachGenre.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="movie-items-div">
            <h1 className="movie-info-heading">Audio Available</h1>
            <ul className="movie-info-ul-container">
              {spokenLanguages.map(eachAudio => (
                <li className="movie-list-item" key={eachAudio.id}>
                  <p>{eachAudio.englishName}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="movie-items-div">
            <h1 className="movie-info-heading">Rating Count</h1>
            <p className="movie-list-item">{voteCount}</p>
            <h1 className="movie-info-heading">Rating Average</h1>
            <p className="movie-list-item">{voteAverage}</p>
          </div>
          <div className="movie-items-div">
            <h1 className="movie-info-heading">Budget</h1>
            <p className="movie-list-item">{budget}</p>
            <h1 className="movie-info-heading">Release Date</h1>
            <p className="movie-list-item">{releaseDate}</p>
          </div>
        </div>
        <div className="movie-similar-container">
          <h1 className="more-like-this">More like this</h1>
          <ul className="similar-ul-container">
            {similarMovies.slice(0, 6).map(each => (
              <Link to={`/movies/${each.id}`} key={each.id} target="_blank">
                <li className="similar-li-item" key={each.id}>
                  <img
                    className="movie-popular-poster"
                    src={each.posterPath}
                    alt={each.title}
                  />
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </>
    )
  }

  onRetry = () => {
    this.getMovieItems()
  }

  renderFailureView = () => (
    <div className="original-fail-container">
      <FailureView onRetry={this.onRetry} />
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderAll = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="movie-item-container">
        {this.renderAll()}
        <FooterRoute />
      </div>
    )
  }
}

export default MovieItemDetails
