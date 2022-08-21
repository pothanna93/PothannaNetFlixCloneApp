import {Component} from 'react'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import {Link} from 'react-router-dom'

import Loader from 'react-loader-spinner'
import FailureView from '../FailureView'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class TrendingRoute extends Component {
  state = {
    trendingLists: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getTrendItems()
  }

  getTrendItems = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const trendUrl = 'https://apis.ccbp.in/movies-app/trending-movies'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(trendUrl, options)
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
        trendingLists: fetchedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderSlider = () => {
    const {trendingLists} = this.state
    const settings = {
      dots: false,

      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
    }

    return (
      <div className="trend-slide-container">
        <Slider {...settings}>
          {trendingLists.map(eachLogo => {
            const {posterPath} = eachLogo
            return (
              <Link to={`/movies/${eachLogo.id}`} key={eachLogo.id}>
                <div className="trend-slide-image-container" key={eachLogo.id}>
                  <img
                    className="trend-image"
                    src={posterPath}
                    alt={eachLogo.title}
                  />
                </div>
              </Link>
            )
          })}
        </Slider>
      </div>
    )
  }

  onRetry = () => {
    this.getTrendItems()
  }

  renderFailureView = () => (
    <div className="trend-fail-div">
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
        return this.renderSlider()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return <div className="trending-container">{this.renderAll()}</div>
  }
}

export default TrendingRoute
