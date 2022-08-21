import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import FooterRoute from '../FooterRoute'
import HeaderPage from '../HeaderPage'
import FailureView from '../FailureView'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class PopularRoute extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    popularLists: [],
  }

  componentDidMount() {
    this.getPopularItems()
  }

  getPopularItems = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const popularUrl = `https://apis.ccbp.in/movies-app/popular-movies`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(popularUrl, options)
    if (response.ok === true) {
      const data = await response.json()

      const fetchedData = data.results.map(eachItem => ({
        id: eachItem.id,
        backdropPath: eachItem.backdrop_path,
        title: eachItem.title,
        posterPath: eachItem.poster_path,
      }))
      this.setState({
        popularLists: fetchedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderPopularSuccessView = () => {
    const {popularLists} = this.state
    return (
      <div className="popular-success-div">
        <ul className="popular-ul-list">
          {popularLists.map(eachMovie => (
            <li key={eachMovie.id} className="popular-list-item">
              <Link to={`/movies/${eachMovie.id}`} key={eachMovie.id}>
                <img
                  src={eachMovie.posterPath}
                  alt={eachMovie.title}
                  className="popular-poster"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  onRetry = () => {
    this.getPopularItems()
  }

  renderFailureView = () => (
    <div className="popular-fail-div">
      <FailureView onRetry={this.onRetry} />
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderPopularView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderPopularSuccessView()
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
      <div className="popular-container" testid="popular">
        <HeaderPage />
        <div className="popular-responsive-div">
          {this.renderPopularView()}
          <FooterRoute />
        </div>
      </div>
    )
  }
}
export default PopularRoute
