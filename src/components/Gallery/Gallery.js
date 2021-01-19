import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';
import BottomScrollListener from 'react-bottom-scroll-listener';
import arrayMove from 'array-move';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
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

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  componentDidMount() {
    this.getImages(this.props.tag, this.state.page);
    window.addEventListener('resize', this.windowResizeLisener);
    this.setState({
      galleryWidth: window.innerWidth
    });
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
        if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0 &&
          this.state.tagChange === false
        ) {
          this.setState({
            images: [...this.state.images, ...res.photos.photo],
            page: nextPage,
            tagChange: false,
            loading: false
          });
        } else if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0 &&
          this.state.tagChange === true
        ) {
          this.setState({
            images: res.photos.photo,
            page: nextPage,
            tagChange: false,
            loading: false
          });
        }
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
    let newImageOrder = arrayMove(
      this.state.images,
      draggedIndex,
      droppedIndex
    );
    this.setState({ images: newImageOrder });
  }

  componentDidUpdate(prevProps) {
    if (this.props.tag !== prevProps.tag) {
      this.setState({ tagChange: true });
    }
  }

  render() {
    const { images, loading } = this.state;
    return (
      <BottomScrollListener offset={400} onBottom={this.loadMoreImages}>
        <div className='gallery-root'>
          {images.map((dto) => {
            return (
              <Image
                key={`image-${dto.id}${Math.random()}`}
                dto={dto}
                deleteImage={this.deleteImage}
                galleryWidth={this.state.galleryWidth}
                handleOnDragStart={this.handleOnDragStart}
                handleOnDragOver={this.handleOnDragOver}
                handleOnDrop={this.handleOnDrop}
                handleOnDragEnd={this.handleOnDragEnd}
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
