import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Slider from 'react-slick'
import Cookies from 'js-cookie'
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

class OriginalRoute extends Component {
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

  renderSlideBar = () => {
    const {originalLists} = this.state
    const settings = {
      dots: false,

      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
    }

    return (
      <div className="slides">
        <Slider {...settings}>
          {originalLists.map(eachLogo => {
            const {posterPath} = eachLogo
            return (
              <Link to={`/movies/${eachLogo.id}`} key={eachLogo.id}>
                <div className="slick-item" key={eachLogo.id}>
                  <img
                    className="logo-image"
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
    this.getOriginals()
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
        return this.renderSlideBar()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return <div className="slide-container">{this.renderAll()}</div>
  }
}
export default OriginalRoute
