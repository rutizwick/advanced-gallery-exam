import React, { Component } from 'react';
import '../WixPage/wixPage.css';

export default class WixPage extends Component {
  render() {
    return (
      <div className='wix-page'>
        <h2>
          Did you mean ...
          <a
          target="_blank"
          className='wix-link' 
          href='https://www.wix.com/'>
            best company ever{' '}
          </a>
          and the future home of
          <a
          target="_blank"
          className='wix-link' 
          href='https://www.linkedin.com/in/ruti-zwick/'>{` Ruti Zwick?`}
          </a>
        </h2>
        <div>
          <iframe
          className='youtube'
            width='560'
            height='315'
            src='https://www.youtube.com/embed/JkrkTCnDqno'
            frameBorder='0'
            allowFullScreen
          />
        </div>
      </div>
    );
  }
}
