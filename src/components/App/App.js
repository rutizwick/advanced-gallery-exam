import React from 'react';
import './App.scss';
import Gallery from '../Gallery';
import FontAwesome from 'react-fontawesome';
import SavedImages from '../SavedImages/SavedImages';
import { DebounceInput } from 'react-debounce-input';
import ScrollToTop from '../ScrollTop/ScrollTop';
import WixPage from '../WixPage/WixPage';

class App extends React.Component {
  static propTypes = {};

  constructor() {
    super();
    this.state = {
      tag: 'wix',
      savedImages: [],
      displaySaved: false,
      title: 'Flickr Gallery',
      iconName: 'heart'
    };
    this.handleHeartClick = this.handleHeartClick.bind(this);
    this.removeSavedImage = this.removeSavedImage.bind(this);
  }

  checkLocalStorage() {
    if (localStorage.getItem('savedImages') === null) return false;
    else return true;
  }

  componentDidMount() {
    const hasStorage = this.checkLocalStorage();
    if (hasStorage) {
      const savedTemp = localStorage.getItem('savedImages');
      let savedTempArr = JSON.parse(savedTemp);
      this.setState({ savedImages: savedTempArr });
    }
  }

  saveImage = (dto) => {
    let imageSaved = false;
    this.state.savedImages.map((img) => {
      if (img.id === dto.id) {
        this.removeSavedImage(dto);
        imageSaved = true;
        return;
      }
    });
    if (!imageSaved) {
      const tempSavedImages = [...this.state.savedImages, dto];
      this.setState({
        savedImages: tempSavedImages
      });
      localStorage.setItem('savedImages', JSON.stringify(tempSavedImages));
    }
  };

  removeSavedImage = (dto) => {
    const newTempArray = this.state.savedImages.filter(
      (img) => img.id !== dto.id
    );
    this.setState({
      savedImages: newTempArray
    });
    localStorage.setItem('savedImages', JSON.stringify(newTempArray));
  };

  handleHeartClick() {
    if (!this.state.displaySaved) {
      this.setState({
        displaySaved: true,
        title: 'Images I ❤️',
        iconName: 'home'
      });
    } else if (this.state.displaySaved) {
      this.setState({
        displaySaved: false,
        title: 'Flickr Gallery',
        iconName: 'heart'
      });
    }
  }

  render() {
    const { tag, savedImages, displaySaved, title, iconName } = this.state;
    return (
      <div className='app-root'>
        <div className='app-header'>
          <FontAwesome
            onClick={this.handleHeartClick}
            className='header-heart'
            name={iconName}
            title={iconName}
          />
          <div>
            <h2>{title}</h2>
            {!displaySaved && (
              <DebounceInput
                className='app-input'
                debounceTimeout={1000}
                onChange={(e) => this.setState({ tag: e.target.value })}
                value={tag}
              />
            )}
          </div>
        </div>
        <ScrollToTop/>
        {tag === 'wix' &&
        !displaySaved &&
        <WixPage/>
        }
        {!displaySaved &&
        tag !== 'wix' && (
          <Gallery
            savedImagesArray={savedImages}
            saveImage={this.saveImage}
            tag={tag}
          />
        )}
        {displaySaved  && <SavedImages savedImages={savedImages} />}
      </div>
    );
  }
}

export default App;
