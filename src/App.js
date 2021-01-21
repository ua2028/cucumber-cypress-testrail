import React, { Component } from 'react'
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  withRouter
} from 'react-router-dom'

import AddAssetForm from './components/AddAssetForm'
import TaskDescription from './components/TaskDescription'
import AssetsTable from './components/AssetsTable'

import './App.css'

import {
  Segment,
  Container,
  Menu
} from 'semantic-ui-react'


const AppMenu = withRouter(({ location }) => (
  <Menu inverted secondary stackable>
    <Menu.Item as={Link} to="/">
      Description
    </Menu.Item>
    
    <Menu.Item
        testid="add-asset"
        key='/add'
        as={Link}
        to='/add'
        active={location.pathname === '/add'}>
        Add Asset
      </Menu.Item>

    <Menu.Item
      key='/assets'
      as={Link}
      to='/assets'
      active={location.pathname === '/assets'}>
      Existing Assets
    </Menu.Item>
  </Menu>
))


const AppRoutes = () => (
  <Switch>
    <Route exact path="/">
      <TaskDescription/>
    </Route>
    <Route path='/add'>
      <AddAssetForm/>
    </Route>
    <Route exact path='/assets'>
      <AssetsTable/>
    </Route>

  </Switch>
)

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Segment className="AppHeader" inverted vertical>
            <Container>
              <h1>Frontend test-developer technical assignment</h1>
              <br/>
              <AppMenu />
            </Container>
          </Segment>
          <Segment vertical>
            <div className="ui container">
              <AppRoutes />
            </div>
          </Segment>
        </div>
      </Router>
    )
  }
}

export default App
