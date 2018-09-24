import React from 'react';
import {
  Button, Modal, Form, TextArea
} from 'semantic-ui-react';
import axios from 'axios';
import PropTypes from 'prop-types';


export default class ModalDescription extends React.Component {
  state = { modalOpen: false, inputDescription: '' };

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })

  handleSubmit = (e) => {
    e.preventDefault();
    const { inputDescription } = this.state;
    const { userId, setDescription } = this.props;
    axios({
      method: 'post',
      url: '/api/setUserDescription',
      data: {
        userId,
        description: inputDescription
      }
    })
      .catch((error) => {
        console.log(error);
      });
    this.handleClose();
    setDescription(inputDescription);
  };

  handleDestInput = (e) => {
    this.setState({ inputDescription: e.target.value });
  };

  render() {
    const { modalOpen } = this.state;
    const modalStyle = {
      padding: '20px'
    };
    return (
      <Modal style={modalStyle} trigger={<Button icon="pencil" onClick={this.handleOpen} />} open={modalOpen} onClose={this.handleClose}>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Description</label>
            <TextArea autoHeight placeholder="User's description" onChange={this.handleDestInput} />
          </Form.Field>
          <Button type="submit">Submit</Button>
        </Form>
      </Modal>
    );
  }
}

ModalDescription.propTypes = {
  userId: PropTypes.string.isRequired,
  setDescription: PropTypes.func.isRequired
};
