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
    this.receiveFromChild = this.receiveFromChild.bind(this);
  }
  receiveFromChild(data) {
    console.log('data from child: ', data);
  }
/*sendData= {this.getDataFromChild}
 */
  render() {
    let pageToShow = <StartMenu 
    sendToParent = {this.receiveFromChild}/>;
    return (
      <div>
       {pageToShow}
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
