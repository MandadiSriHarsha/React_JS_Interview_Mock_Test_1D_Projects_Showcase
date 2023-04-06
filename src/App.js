import {Component} from 'react'

import Loader from 'react-loader-spinner'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  isLoading: 'LOADING',
  isSuccess: 'SUCCESS',
  isFailure: 'FAILURE',
}

const GetCategoryItem = props => {
  const {data} = props
  return (
    <option value={data.id} className="option-item">
      {data.displayText}
    </option>
  )
}

class App extends Component {
  state = {
    projectsCategory: categoriesList[0].id,
    pageStatus: apiStatusConstants.isLoading,
    projectsList: [],
  }

  componentDidMount() {
    this.getProjectsList()
  }

  getProjectsList = async () => {
    this.setState({pageStatus: apiStatusConstants.isLoading})
    const {projectsCategory} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${projectsCategory}`
    const options = {method: 'GET'}
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.projects.map(eachitem => ({
        id: eachitem.id,
        name: eachitem.name,
        imageUrl: eachitem.image_url,
      }))
      this.setState({
        pageStatus: apiStatusConstants.isSuccess,
        projectsList: updatedData,
      })
    } else {
      this.setState({pageStatus: apiStatusConstants.isFailure})
    }
  }

  changeProjectsCategory = event => {
    this.setState({projectsCategory: event.target.value}, this.getProjectsList)
  }

  renderLoaderCard = () => (
    <div className="loader-bg-container" data-testid="loader">
      <Loader type="ThreeDots" color="#328af2" height={50} width={50} />
    </div>
  )

  renderProjectsCard = () => {
    const {projectsList} = this.state
    return (
      <ul className="projects-list-bg-container">
        {projectsList.map(eachitem => (
          <li className="list-item" key={eachitem.id}>
            <img
              src={eachitem.imageUrl}
              className="project-image"
              alt={eachitem.name}
            />
            <p className="project-title">{eachitem.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderFailureCard = () => (
    <div className="failure-bg-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="failure-button"
        type="button"
        onClick={this.getProjectsList}
      >
        Retry
      </button>
    </div>
  )

  getRespectivePages = () => {
    const {pageStatus} = this.state
    switch (pageStatus) {
      case apiStatusConstants.isLoading:
        return this.renderLoaderCard()
      case apiStatusConstants.isSuccess:
        return this.renderProjectsCard()
      case apiStatusConstants.isFailure:
        return this.renderFailureCard()
      default:
        return null
    }
  }

  render() {
    const {projectsCategory} = this.state
    return (
      <div className="home-page-bg-container">
        <nav className="navbar">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </nav>
        <div className="input-container">
          <select
            value={projectsCategory}
            onChange={this.changeProjectsCategory}
            className="input"
          >
            {categoriesList.map(eachCategory => (
              <GetCategoryItem
                data={eachCategory}
                key={eachCategory.id}
                changeProjectsCategory={this.changeProjectsCategory}
              />
            ))}
          </select>
        </div>
        <div className="content-card">{this.getRespectivePages()}</div>
      </div>
    )
  }
}

export default App
