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
      page: 1,
      images: [],
      galleryWidth: window.innerWidth,
      tagChange: false
    };
    this.windowResizeLisener = this.windowResizeLisener.bind(this);
    this.incrementPage = this.incrementPage.bind(this);
  }

  getImages(tag, page) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&page=${page}&tag_mode=any&per_page=100&format=json&nojsoncallback=1`;
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
          });
        } else if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0 &&
          this.state.tagChange === true
        ) {
          this.setState({ images: res.photos.photo });
        }
      });
  }

  componentDidMount() {
    this.getImages(this.props.tag);
    window.addEventListener('resize', this.windowResizeLisener);
    this.setState({
      galleryWidth: window.innerWidth
    });
  }

  windowResizeLisener() {
    this.setState({
      galleryWidth: window.innerWidth
    });
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  deleteImage = (id) => {
    this.setState({
      images: [...this.state.images.filter((dto) => dto.id !== id)]
    });
  };

  incrementPage() {
    const nextPage = this.state.page + 1;
    this.setState({
      page: nextPage
    });
    this.getImages(this.props.tag, this.state.page);
  }

  componentDidUpdate(prevProps) {
    if (this.props.tag !== prevProps.tag) {
      this.setState({ tagChange: true });
    }
  }

  render() {
    return (
      <BottomScrollListener offset={400} onBottom={this.incrementPage}>
        <div className='gallery-root'>
          {this.state.images.map((dto) => {
            return (
              <Image
                key={'image-' + dto.id + dto.secret}
                dto={dto}
                deleteImage={this.deleteImage}
                galleryWidth={this.state.galleryWidth}
              />
            );
          })}
        </div>
      </BottomScrollListener>
    );
  }
}

export default Gallery;
