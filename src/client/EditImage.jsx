import React from 'react';
import {
  Button, Modal, Form, Icon, Input, Image
} from 'semantic-ui-react';
import axios from 'axios';
import PropTypes from 'prop-types';


export default class ModalImage extends React.Component {
  state = { modalOpen: false, file: '', imagePreviewUrl: null };

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })

  handleSubmit = (e) => {
    e.preventDefault();
    const { file } = this.state;
    const { userId, setImageUrl } = this.props;
    const formData = new FormData();
    formData.append(userId, file);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    axios.post('/api/uploadImage', formData, config)
      .then((response) => {
        console.log('The file is successfully uploaded');
        const imageExtension = file.name.split('.').slice(-1)[0];
        setImageUrl(`${userId}.${imageExtension}`);
      }).catch((error) => {
        console.error(error);
      });
    this.handleClose();
  }

  handleImageChange = (e) => {
    const file = e.target.files[0];
    this.setState({ file, imagePreviewUrl: URL.createObjectURL(file) });
  }

  render() {
    const { modalOpen, imagePreviewUrl } = this.state;
    const { userId } = this.props;
    const modalStyle = {
      padding: '20px'
    };

    return (
      <Modal
        trigger={(
          <Button icon onClick={this.handleOpen}>
            <Icon name="upload" />
            Upload image
          </Button>
          )}
        open={modalOpen}
        onClose={this.handleClose}
        style={modalStyle}
      >
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <Input type="file" onChange={this.handleImageChange} name={userId} />
          </Form.Field>
          <Button type="submit">Submit</Button>
        </Form>
        {imagePreviewUrl ? <Image src={imagePreviewUrl} size="medium" /> : null}
      </Modal>
    );
  }
}

ModalImage.propTypes = {
  userId: PropTypes.string.isRequired,
  setImageUrl: PropTypes.func.isRequired
};
