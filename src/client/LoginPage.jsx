import React from 'react';
import { GoogleLogin } from 'react-google-login';
import { func } from 'prop-types';
import { Redirect } from 'react-router-dom';
import credentials from '../../credentials.json';

export default class LoginPage extends React.Component {
  state = {
    redirectToReferrer: false
  };

  onSuccess = (response) => {
    this.setState({ redirectToReferrer: true });
    const { responseGoogle } = this.props;
    responseGoogle(response);
  };

  render() {
    const { redirectToReferrer } = this.state;
    if (redirectToReferrer) {
      return <Redirect to="/users" />;
    }
    const { responseGoogle } = this.props;
    return (
      <GoogleLogin
        clientId={credentials.web.client_id}
        buttonText="Login"
        onSuccess={this.onSuccess}
        onFailure={responseGoogle}
      />
    );
  }
}

LoginPage.propTypes = {
  responseGoogle: func.isRequired
};
