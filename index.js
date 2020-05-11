import React, { Component } from 'react';
import { render } from 'react-dom';
import StartMenu from './divisions/startMenu/StartMenu.js';
import Race from './divisions/race/Race.js';
import AfterRace from './divisions/afterRace/AfterRace.js';
import './style.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      status: 'start',
      gameObject: ''
    };
    this.receiveFromChild = this.receiveFromChild.bind(this);
  }
  receiveFromChild(data) {
    switch (data.status) {
      case 'readyForRace':
        this.setState({
          status: 'race',
          gameObject: data.gameObject
        });
      break;
      case 'raceTerminated':
        this.setState({
          status: 'afterRace',
          gameObject: data.gameObject
        });
      break;
      default: console.log('not found data from child!');
    }
  }
  render() {
    let pageToShow = null;
    switch (this.state.status) {
      case 'start':
        pageToShow = <StartMenu 
        sendToParent = {this.receiveFromChild}/>;
      break;
      case 'race':
        pageToShow = <Race
        gameObject = {this.state.gameObject}
        sendToParent = {this.receiveFromChild}/>
      break;
      case 'afterRace':
        pageToShow = <AfterRace
        gameObject = {this.state.gameObject}
        sendToParent = {this.receiveFromChild}/>
      break;
      default: console.log('not found page to show!');
    };
    return (
      <div>
       {pageToShow}
      </div>
    );
  }
}
render(<App />, document.getElementById('root'));
