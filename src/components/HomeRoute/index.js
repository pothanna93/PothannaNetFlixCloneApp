import {Component} from 'react'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import HomePoster from '../HomePoster'
import TrendingRoute from '../TrendingRoute'
import OriginalRoute from '../OriginalRoute'
import FooterRoute from '../FooterRoute'
import FailureView from '../FailureView'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class HomeRoute extends Component {
  state = {
    originalLists: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getOriginals()
  }

  getOriginals = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const originalsUrl = 'https://apis.ccbp.in/movies-app/originals'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(originalsUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const fetchedData = data.results.map(eachItem => ({
        backdropPath: eachItem.backdrop_path,
        posterPath: eachItem.poster_path,
        id: eachItem.id,
        overview: eachItem.overview,
        title: eachItem.title,
      }))
      this.setState({
        originalLists: fetchedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onRetry = () => {
    this.getOriginals()
  }

  renderFailureView = () => (
    <div className="home-fail-div">
      <FailureView onRetry={this.onRetry} />
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderSuccessView = () => {
    const {originalLists} = this.state
    const singleObj =
      originalLists[Math.floor(Math.random() * originalLists.length)]

    return (
      <div className="home-poster-div">
        <HomePoster posterDetails={singleObj} />
      </div>
    )
  }

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
      <div className="home-app-container">
        {this.renderAll()}
        <div className="home-responsive-container">
          <h1 className="slide-title">Trending Now</h1>
          <TrendingRoute />
          <h1 className="slide-title">Originals</h1>
          <OriginalRoute />
          <FooterRoute />
        </div>
      </div>
    )
  }
}
export default HomeRoute
