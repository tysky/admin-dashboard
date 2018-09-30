import React from 'react';
import { GoogleLogout } from 'react-google-login';
import {
  BrowserRouter as Router, Route, Link, Redirect, Switch
} from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import UsersList from './Users';
import LoginButton from './LoginButton';

import './app.css';

export default class App extends React.Component {
  state = {
    username: 'Guest',
    isAuthenticated: false
  };

  responseGoogle = (response) => {
    this.setState({
      username: response.profileObj.name,
      isAuthenticated: true
    });
  };

  logout = () => {
    this.setState({
      username: 'Guest',
      isAuthenticated: false
    });
  };

  render() {
    const { username, isAuthenticated } = this.state;
    return (
      <div style={{ padding: '20px' }}>
        <h1>{`Hello ${username}`}</h1>
        <Router>
          <div>
            <Button style={{ width: '150px' }}>
              <Link to="/users">Users</Link>
            </Button>
            {isAuthenticated ? (
              <GoogleLogout buttonText="Logout" onLogoutSuccess={this.logout} />
            ) : null}
            <Switch>
              <Route
                exact
                path="/"
                render={() => (isAuthenticated ? <Redirect to="/users" /> : <Redirect to="/auth" />)}
              />
              <Route
                path="/auth"
                render={props => <LoginButton responseGoogle={this.responseGoogle} {...props} />}
              />
              <PrivateRoute path="/users" component={UsersList} isAuthenticated={isAuthenticated} />
              <Redirect to="/" />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}
const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      console.log('privateRoute==', isAuthenticated, props);
      return (isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/auth',
            state: { from: props.location }
          }}
        />
      ));
    }
    }
  />
);
