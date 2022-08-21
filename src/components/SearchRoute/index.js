import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import HeaderPage from '../HeaderPage'

import FailureView from '../FailureView'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class SearchRoute extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    searchMovies: [],
    searchInput: '',
  }

  onClickSearch = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {searchInput} = this.state

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/movies-app/movies-search?search=${searchInput}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.results.map(each => ({
        posterPath: each.poster_path,
        title: each.title,
        id: each.id,
        backdropPath: each.backdrop_path,
      }))
      this.setState({
        searchMovies: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  enterSearchInput = () => {
    const {searchInput} = this.state
    if (searchInput !== '') {
      this.onClickSearch()
    }
  }

  changeSearchInput = text => {
    this.setState({searchInput: text})
  }

  renderNoSearchFound = () => {
    const {searchInput} = this.state
    return (
      <div className="no-search-container">
        <img
          src="https://res.cloudinary.com/dtvpdvwm9/image/upload/v1660053592/Group_7394_iyciwz.png"
          alt="no movies"
          className="no-search-img"
        />
        <p className="no-search-description">
          Your search for {searchInput} did not find any matches.
        </p>
      </div>
    )
  }

  renderResultView = () => {
    const {searchMovies} = this.state

    return (
      <div className="search-filter-container">
        <ul className="search-filter-ul-container">
          {searchMovies.map(each => (
            <Link to={`/movies/${each.id}`} key={each.id}>
              <li className="search-filter-li-item" key={each.id}>
                <img
                  className="search-poster"
                  src={each.posterPath}
                  alt={each.title}
                />
              </li>
            </Link>
          ))}
        </ul>
      </div>
    )
  }

  renderSuccessView = () => {
    const {searchMovies} = this.state
    const searchLength = searchMovies.length > 0

    return (
      <>{searchLength ? this.renderResultView() : this.renderNoSearchFound()}</>
    )
  }

  onRetry = () => {
    this.onClickSearch()
  }

  renderFailureView = () => (
    <div className="search-fail-container">
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
    const {searchInput} = this.state

    return (
      <div className="search-container">
        <HeaderPage
          searchInput={searchInput}
          enterSearchInput={this.enterSearchInput}
          changeSearchInput={this.changeSearchInput}
        />
        <div className="search-responsive-div">{this.renderAll()}</div>
      </div>
    )
  }
}
export default SearchRoute
