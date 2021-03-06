import React from 'react';
import {
  Card, Image, Table, Segment, Dimmer, Loader
} from 'semantic-ui-react';
import axios from 'axios';
import {
  YMaps, Map, Placemark,
} from 'react-yandex-maps';
import EditDescription from './EditDescription';
import EditImage from './EditImage';

export default class UserInfo extends React.Component {
  state = {
    userInfo: {},
    isLoading: true
  };

  componentDidMount() {
    this.setState({ isLoading: true }, () => this.loadUser());
  }

  loadUser = () => {
    const { match } = this.props;
    axios.get(`/api/getUserInfo?userId=${match.params.userId}`).then((res) => {
      const userInfo = res.data;
      this.setState({ userInfo, isLoading: false });
    });
  };

  updateUserInfo = (propName, propValue) => {
    const { userInfo } = this.state;
    userInfo[propName] = propValue;
    this.setState({ userInfo });
  }

  setDescription = desc => this.updateUserInfo('description', desc);

  setImageUrl = imageUrl => this.updateUserInfo('imageUrl', imageUrl);

  renderSpinner = () => (
    <Segment>
      <Dimmer active inverted>
        <Loader size="large">Loading</Loader>
      </Dimmer>
      <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
    </Segment>
  );

  renderUserCard() {
    const {
      userInfo: {
        id, firstName, lastName, fullName, email, location, imageUrl, description
      }
    } = this.state;
    const [firstCoordinate, secondCoordinate] = location.map(Number);
    const mapState = { center: [firstCoordinate, secondCoordinate], zoom: 10 };
    const placemarkParams = {
      geometry: {
        coordinates: [firstCoordinate, secondCoordinate]
      },
      properties: {
        balloonContent: fullName
      },
      options: {
        preset: 'islands#icon',
        iconColor: '#0095b6'
      }
    };
    return (
      <div>
        <Card>
          <Image src={`/api/userImage/${imageUrl}`} />
          <EditImage userId={id} setImageUrl={this.setImageUrl} />
          <Card.Content>
            <Card.Header>{fullName}</Card.Header>
            <Card.Description>{description}</Card.Description>
            <EditDescription userId={id} setDescription={this.setDescription} />
          </Card.Content>
          <Card.Content extra>
            <Table basic>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Id</Table.Cell>
                  <Table.Cell>{id}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>First name</Table.Cell>
                  <Table.Cell>{firstName}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Last name</Table.Cell>
                  <Table.Cell>{lastName}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>E-mail</Table.Cell>
                  <Table.Cell>{email}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>

            <YMaps>
              <div id="map-basics">
                <Map state={mapState}>
                  <Placemark {...placemarkParams} />
                </Map>
              </div>
            </YMaps>
          </Card.Content>
        </Card>
      </div>
    );
  }

  render() {
    const { isLoading } = this.state;
    return <div>{isLoading ? this.renderSpinner() : this.renderUserCard()}</div>;
  }
}
