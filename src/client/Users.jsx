import React from 'react';
import {
  Switch, Route
} from 'react-router-dom';

import UserInfo from './User';
import UsersList from './UsersList';

export default () => (
  <Switch>
    <Route exact path="/users" component={UsersList} />
    <Route path="/users/:userId" component={UserInfo} />
  </Switch>
);
