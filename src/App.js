import {Route, Switch, Redirect} from 'react-router-dom'

import LoginRoute from './components/LoginRoute'
import HomeRoute from './components/HomeRoute'
import SearchRoute from './components/SearchRoute'
import ProtectedRoute from './components/ProtectedRoute'
import AccountRoute from './components/AccountRoute'
import PopularRoute from './components/PopularRoute'
import MovieItemDetails from './components/MovieItemDetails'
import NotFound from './components/NotFound'

import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/login" component={LoginRoute} />
    <ProtectedRoute exact path="/" component={HomeRoute} />
    <ProtectedRoute exact path="/search" component={SearchRoute} />
    <ProtectedRoute exact path="/account" component={AccountRoute} />
    <ProtectedRoute exact path="/popular" component={PopularRoute} />
    <ProtectedRoute exact path="/movies/:id" component={MovieItemDetails} />
    <Route path="/not-found" component={NotFound} />
    <Redirect to="not-found" />
  </Switch>
)

export default App
