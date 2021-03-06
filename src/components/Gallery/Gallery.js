import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';
import BottomScrollListener from 'react-bottom-scroll-listener';

class Gallery extends React.Component {
  
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      images: [],
      galleryWidth: window.innerWidth,
      tagChange: false,
      loading: false
    };
    this.windowResizeLisener = this.windowResizeLisener.bind(this);
    this.getImages = this.getImages.bind(this);
    this.loadMoreImages = this.loadMoreImages.bind(this);
    this.handleOnDragStart = this.handleOnDragStart.bind(this);
    this.handleOnDragOver = this.handleOnDragOver.bind(this);
    this.handleOnDrop = this.handleOnDrop.bind(this);
    this.handleFindIndex = this.handleFindIndex.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
  }

  componentDidMount() {
    this.getImages(this.props.tag, this.state.page);
    window.addEventListener('resize', this.windowResizeLisener);
    this.setState({
      galleryWidth: window.innerWidth
    });
  }

  checkResPhoto(res) {
    if (res && res.photos && res.photos.photo && res.photos.photo.length > 0) {
      return true;
    }
  }

  getImages(tag, page) {
    this.setState({ loading: true });
    const nextPage = this.state.page + 1;
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&page=${page}&tag_mode=any&per_page=50&format=json&nojsoncallback=1`;
    const baseUrl = 'https://api.flickr.com/';
    axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: 'GET'
    })
      .then((res) => res.data)
      .then((res) => {
        const resPhotos = this.checkResPhoto(res);
        if (resPhotos && !this.state.tagChange) {
          this.setState({
            page: nextPage,
            tagChange: false,
            loading: false,
            images: [...this.state.images, ...res.photos.photo]
          });
        } else if (resPhotos && this.state.tagChange)
          this.setState({
            page: 1,
            tagChange: false,
            loading: false,
            images: res.photos.photo
          });
      });
  }

  windowResizeLisener() {
    this.setState({
      galleryWidth: window.innerWidth
    });
  }

  deleteImage = (id) => {
    this.setState({
      images: [...this.state.images.filter((dto) => dto.id !== id)]
    });
  };

  loadMoreImages() {
    this.getImages(this.props.tag, this.state.page);
  }

  handleOnDragStart(e, draggedID) {
    e.dataTransfer.setData('draggedImageId', draggedID);
  }

  handleOnDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  handleOnDrop(e, id) {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('draggedImageId');
    const droppedId = id;
    this.handleFindIndex(droppedId, draggedId);
  }

  handleFindIndex(droppedId, draggedId) {
    const { images } = this.state;
    const droppedIndex = images.findIndex((image) => image.id === droppedId);
    const draggedIndex = images.findIndex((image) => image.id === draggedId);
    this.onSortEnd(draggedIndex, droppedIndex);
  }

  onSortEnd(draggedIndex, droppedIndex) {
    let newImageOrder = this.state.images;
    newImageOrder.splice(droppedIndex, 0, newImageOrder.splice(draggedIndex, 1)[0]);
    this.setState({ images: newImageOrder });
  }

  componentDidUpdate(prevProps) {
    if (this.props.tag !== prevProps.tag) {
      this.setState({
        tagChange: true,
        page: 0
      });
    }
  }

  render() {
    const { images, loading, galleryWidth } = this.state;
    const {savedImagesArray, saveImage} = this.props;

    return (
      <BottomScrollListener offset={400} onBottom={this.loadMoreImages}>
        <div className='gallery-root'>
          {images.map((dto) => {
            return (
              <Image
                key={`image-${dto.id}${Math.random()}`}
                dto={dto}
                savedImagesArray={savedImagesArray}
                saveImage={saveImage}
                deleteImage={this.deleteImage}
                galleryWidth={galleryWidth}
                handleOnDragStart={this.handleOnDragStart}
                handleOnDragOver={this.handleOnDragOver}
                handleOnDrop={this.handleOnDrop}
              />
            );
          })}
          {loading && (
            <div className='preload'>
              <div className='preload-status'>
                <div className='preload-status-bar'></div>
                <div className='preload-status-info'>LOADING</div>
              </div>
            </div>
          )}
        </div>
      </BottomScrollListener>
    );
  }
}

export default Gallery;
