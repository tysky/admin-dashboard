import React from 'react';
import {
  Card, Image, Table, Segment, Dimmer, Loader, Icon
} from 'semantic-ui-react';
import axios from 'axios';
import {
  YMaps, Map, Placemark, GeoObject
} from 'react-yandex-maps';


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
      const userInfo = res.data.data;
      this.setState({ userInfo, isLoading: false });
    });
  }

  renderSpinner = () => (
    <Segment>
      {console.log('spinner!')}
      <Dimmer active inverted>
        <Loader size="large">Loading</Loader>
      </Dimmer>
      <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
    </Segment>
  );

  renderUserCard() {
    const {
      userInfo: {
        id, firstName, lastName, fullName, email, location
      }
    } = this.state;
    const mapState = { center: [...location], zoom: 10 };
    const placemarkParams = {
      geometry: {
        coordinates: [...location]
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
          <Image src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png" />
          <Card.Content>
            <Card.Header>{fullName}</Card.Header>
            <Card.Description>
              User hasn't description yet.
            </Card.Description>
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
                <Table.Row>
                  <Table.Cell>Location</Table.Cell>
                  <Table.Cell>{location}</Table.Cell>
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
    return (
      <div>
        {isLoading ? this.renderSpinner() : this.renderUserCard() }
      </div>
    );
  }
}
