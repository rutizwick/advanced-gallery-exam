import React, { Component } from 'react';
import './Saved.css';

export default class SavedImages extends Component {
  render() {
    
    const { savedImages } = this.props;

    return (
      <div className='saved-gal'>
        {savedImages &&
          savedImages.map((dto) => {
            return (
              <div key={dto.id}>
                <img
                  id={dto.id}
                  alt={dto.title}
                  className='saved-img'
                  src={`https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`}
                />
              </div>
            );
          })}
      </div>
    );
  }
}
