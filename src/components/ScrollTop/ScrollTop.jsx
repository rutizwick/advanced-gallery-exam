import React, { Component } from 'react';
import '../ScrollTop/scrollTop.css';
import FontAwesome from 'react-fontawesome';

export default class ScrollToTop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_visible: false
    };
  }

  componentDidMount() {
    const scrollComponent = this;
    document.addEventListener('scroll', () => {
      scrollComponent.toggleVisibility();
    });
  }

  toggleVisibility() {
    if (window.pageYOffset > 300) {
      this.setState({
        is_visible: true
      });
    } else {
      this.setState({
        is_visible: false
      });
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  render() {
    const { is_visible } = this.state;
    return (
      <div className='scroll-to-top'>
        {is_visible && (
          <div onClick={() => this.scrollToTop()}>
            <FontAwesome
              className='arrow-up'
              name='arrow-up'
              title='arrow-up'
            />
          </div>
        )}
      </div>
    );
  }
}
