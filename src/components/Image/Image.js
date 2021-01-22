import React from "react";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";
import "./Image.scss";
import ImageModal from "../ImageModal/ImageModal";

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {
      size: 200,
      rotation: 0,
      showModal: false,
      dragging: false,
      saved: '',
    };
    this.rotateImage = this.rotateImage.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  calcImageSize() {
    const { galleryWidth } = this.props;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = galleryWidth / imagesPerRow;
    this.setState({
      size,
    });
  }

  componentDidMount() {
    this.calcImageSize();
    this.checkSavedImages(this.props.savedImagesArray);
  }

  checkSavedImages(savedImagesArray){
    savedImagesArray.map(img => {
      if (img.id === this.props.dto.id){
        this.setState({saved: 'saved'})
        return
      }
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.galleryWidth !== prevProps.galleryWidth) {
      this.calcImageSize();
    }
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  rotateImage() {
    let newRotation = this.state.rotation + 90;
    if (newRotation >= 360) {
      newRotation = -360;
    }
    this.setState({
      rotation: newRotation,
    });
  }

  handleOpenModal() {
    this.setState({
      showModal: true,
    });
  }

  handleCloseModal() {
    this.setState({
      showModal: false,
    });
  }

  render() {
    const { rotation, showModal, saved } = this.state;
    const { dto, saveImage, deleteImage } = this.props;

    return (
      <div
        draggable
        className="image-root"
        onDrop={(e) => {
          this.props.handleOnDrop(e, dto.id);
        }}
        onDragStart={(e) => {
          this.setState({ dragging: true });
          this.props.handleOnDragStart(e, dto.id);
        }}
        onDragOver={(e) => {
          this.props.handleOnDragOver(e);
        }}
        style={{
          width: this.state.size + "px",
          height: this.state.size + "px",
          backgroundImage: `url(${this.urlFromDto(dto)})`,
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <div
          style={{
            transform: `rotate(${-rotation}deg)`,
          }}
        >
          <FontAwesome
            className={`image-icon heart ${saved}`}
            name="heart"
            title="heart"
            onClick={this.props.saveImage.bind(this, dto)}
          />
          <FontAwesome
            onClick={this.rotateImage}
            className="image-icon"
            name="sync-alt"
            title="rotate"
          />

          <FontAwesome
            onClick={deleteImage.bind(this, dto.id)}
            className="image-icon"
            name="trash-alt"
            title="delete"
          />

          <FontAwesome
            onClick={this.handleOpenModal}
            className="image-icon"
            name="expand"
            title="expand"
          />
        </div>

        <ImageModal
          isOpen={showModal}
          handleCloseModal={this.handleCloseModal}
          imageData={dto}
          imgUrl={`${this.urlFromDto(dto)}`}
        />
      </div>
    );
  }
}

export default Image;
