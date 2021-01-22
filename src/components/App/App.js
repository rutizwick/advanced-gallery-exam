import React from 'react';
import './App.scss';
import Gallery from '../Gallery';
import FontAwesome from 'react-fontawesome';
import SavedImages from '../SavedImages/SavedImages';

class App extends React.Component {
  static propTypes = {};

  constructor() {
    super();
    this.state = {
      tag: 'circus',
      savedImages: [],
      displaySaved: false,
      title: 'Flickr Gallery'
    };
  this.handleHeartClick=this.handleHeartClick.bind(this);
  }

  componentDidMount() {
    let savedTemp = localStorage.getItem("savedImages");
    let savedTempArr = JSON.parse(savedTemp);
    this.setState({savedImages: savedTempArr});
  }

  saveImage = (dto) => {
    const tempSavedImages = [...this.state.savedImages, dto];
    this.setState({
      savedImages: tempSavedImages
    });
    localStorage.setItem('savedImages', JSON.stringify(tempSavedImages));
  };

  handleHeartClick(){
    if(!this.state.displaySaved){
      this.setState({
        displaySaved: true,
        title: 'Images I ❤️'
      })
    }
    else if (this.state.displaySaved){
      this.setState({
        displaySaved: false,
        title: 'Flickr Gallery'
      })
    }
  }

  render() {
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
            <input
              className='app-input'
              onChange={(event) => this.setState({ tag: event.target.value })}
              value={this.state.tag}
            />
          </div>
        </div>
        {!this.state.displaySaved && <Gallery saveImage={this.saveImage} tag={this.state.tag} />}
        {this.state.displaySaved && <SavedImages savedImages={this.state.savedImages}/>
        }
      </div>
    );
  }
}

export default App;
