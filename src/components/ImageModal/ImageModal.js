import React from 'react';
import Modal from 'react-modal';
import './ImageModal.css';

export default class ImageModal extends React.Component {
  componentWillMount() {
    Modal.setAppElement('body');
  }

  download(e) {
    e.preventDefault();
    fetch(e.target.href, {
      method: 'GET',
      headers: {}
    })
      .then((response) => {
        response.arrayBuffer().then(function (buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'img.png');
          document.body.appendChild(link);
          link.click();
        });
      })
      .catch((err) => {
        return err;
      });
  }

  render() {
    const { isOpen, imageData, handleCloseModal, imgUrl } = this.props;

    return (
      <Modal
        onRequestClose={handleCloseModal}
        className='image-modal'
        isOpen={isOpen}
      >
        <span className='modal-button close-button' onClick={handleCloseModal}>
          &times;
        </span>
        <a
        className="modal-button download-button"
        onClick={this.download}
        download
        href={imgUrl}>
          📥
        </a>
        <img alt={imageData.title} className='image-in-modal' src={imgUrl} />
      </Modal>
    );
  }
}
