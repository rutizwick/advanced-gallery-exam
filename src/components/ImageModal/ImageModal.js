import React from 'react';
import Modal from 'react-modal';
import './ImageModal.css';

export default class ImageModal extends React.Component {
  componentWillMount() {
    Modal.setAppElement('body');
  }

  render() {
    const { isOpen, imageData, handleCloseModal, imgUrl } = this.props;

    return (
      <Modal className='image-modal' isOpen={isOpen}>
        <div>
          <h2>{imageData.title}</h2>
          <img alt={imageData.title} className='image-in-modal' src={imgUrl} />
          <button onClick={handleCloseModal}>close Modal</button>
        </div>
      </Modal>
    );
  }
}
