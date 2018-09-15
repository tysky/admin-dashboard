import React from 'react';
import {
  Table, Dimmer, Loader, Image, Segment, Pagination
} from 'semantic-ui-react';
import axios from 'axios';
import PropTypes from 'prop-types';

const UsersTable = ({ usersList }) => (
  <Table celled>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Id</Table.HeaderCell>
        <Table.HeaderCell>FullName</Table.HeaderCell>
        <Table.HeaderCell>E-mail</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {usersList.map(({ id, fullName, email }) => (
        <Table.Row key={id}>
          <Table.Cell>{id}</Table.Cell>
          <Table.Cell>{fullName}</Table.Cell>
          <Table.Cell>{email}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
);

export default class UsersList extends React.Component {
  state = {
    users: [],
    activePage: 1,
    isLoading: false
  };

  componentDidMount() {
    this.setState({ isLoading: true }, () => this.loadUsers());
  }

  loadUsers = () => {
    const { activePage } = this.state;
    axios.get(`/api/getUsersList?page=${activePage}`).then((res) => {
      const users = res.data.data;
      this.setState({ users, isLoading: false });
    });
  };

  handlePaginationChange = (e, { activePage }) => {
    this.setState({ activePage, isLoading: true }, () => this.loadUsers());
  };

  renderSpinner = () => (
    <Segment>
      <Dimmer active inverted>
        <Loader size="large">Loading</Loader>
      </Dimmer>
      <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
    </Segment>
  );

  renderUsersTable(users) {
    const { activePage } = this.state;
    return (
      <React.Fragment>
        <UsersTable usersList={users} />
        <Pagination
          activePage={activePage}
          onPageChange={this.handlePaginationChange}
          totalPages={10}
        />
      </React.Fragment>
    );
  }

  render() {
    const { users, isLoading } = this.state;
    return <div>{isLoading ? this.renderSpinner() : this.renderUsersTable(users)}</div>;
  }
}


UsersTable.propTypes = {
  usersList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    fullName: PropTypes.string,
    email: PropTypes.string,
  })).isRequired
};
