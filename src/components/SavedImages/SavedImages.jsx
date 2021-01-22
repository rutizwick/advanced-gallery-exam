import React, { Component } from 'react';

export default class SavedImages extends Component {
  render() {
    const { savedImages } = this.props;
    return (
      <div>
        {savedImages &&
          savedImages.map((dto) => {
            return (
              <img
                key={dto.id}
                alt={dto.title}
                className='image-in-modal'
                src={`https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`}
              />
            );
          })}
      </div>
    );
  }
}
