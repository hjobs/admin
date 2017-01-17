import React from 'react';
import { Modal, Button } from 'react-bootstrap';

class ApplyModal extends React.Component {
  render() {
    // console.log("ApplyModal this.props.shown = " + this.props.shown);
    return (
      <Modal
        show={this.props.shown}
        dialogClassName="apply-modal"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-lg">Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Wrapped Text</h4>
          <p>Paragraph here</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => { this.props.closeModal(); }}>Close</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

ApplyModal.propTypes = {
  closeModal: React.PropTypes.func.isRequired,
  shown: React.PropTypes.bool.isRequired
};

export default ApplyModal;
