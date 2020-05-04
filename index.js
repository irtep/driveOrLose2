import React, { Component } from 'react';
import { render } from 'react-dom';
import StartMenu from './divisions/startMenu/StartMenu.js';
import './style.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      status: 'start'
    };
  }

  render() {
    return (
      <div>
       <StartMenu/>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
