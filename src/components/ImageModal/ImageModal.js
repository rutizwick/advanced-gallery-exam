import React from "react";
import Modal from "react-modal";
import "./ImageModal.css";

export default class ImageModal extends React.Component {
  componentWillMount() {
    Modal.setAppElement("body");
  }

  render() {
    const { isOpen, imageData, handleCloseModal, imgUrl } = this.props;

    return (
          <Modal 
          onRequestClose={handleCloseModal}
          className="image-modal" 
          isOpen={isOpen}>
            <span className="close-button" onClick={handleCloseModal}>
              &times;
            </span>
            <img
              alt={imageData.title}
              className="image-in-modal"
              src={imgUrl}
            />
          </Modal>
    );
  }
}
