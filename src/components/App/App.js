import React from 'react';
import './App.scss';
import Gallery from '../Gallery';
import FontAwesome from 'react-fontawesome';
import SavedImages from '../SavedImages/SavedImages';
import { DebounceInput } from 'react-debounce-input';

class App extends React.Component {
  static propTypes = {};

  constructor() {
    super();
    this.state = {
      tag: 'cirque du soleil',
      savedImages: [],
      displaySaved: false,
      title: 'Flickr Gallery'
    };
    this.handleHeartClick = this.handleHeartClick.bind(this);
  }

  checkLocalStorage(){
    if (localStorage.getItem('savedImages') === null) return false
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
    const tempSavedImages = [...this.state.savedImages, dto];
    this.setState({
      savedImages: tempSavedImages
    });
    localStorage.setItem('savedImages', JSON.stringify(tempSavedImages));
  };

  handleHeartClick() {
    if (!this.state.displaySaved) {
      this.setState({
        displaySaved: true,
        title: 'Images I ❤️'
      });
    } else if (this.state.displaySaved) {
      this.setState({
        displaySaved: false,
        title: 'Flickr Gallery'
      });
    }
  }

  render() {
    const { tag, savedImages } = this.state;
    return (
      <div className='app-root'>
        <div className='app-header'>
          <FontAwesome
            onClick={this.handleHeartClick}
            className='header-heart'
            name='heart'
            title='heart'
          />
          <div>
            <h2>{this.state.title}</h2>
            {!this.state.displaySaved && (
              <DebounceInput
                className='app-input'
                debounceTimeout={1000}
                onChange={(e) => this.setState({ tag: e.target.value })}
                value={tag}
              />
            )}
          </div>
        </div>
        {!this.state.displaySaved && (
          <Gallery
          savedImagesArray={savedImages}
          saveImage={this.saveImage}
          tag={tag}/>
        )}
        {this.state.displaySaved && <SavedImages savedImages={savedImages} />}
      </div>
    );
  }
}

export default App;
