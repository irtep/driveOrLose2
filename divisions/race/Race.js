import React, { Component } from "react";
import { render } from "react-dom";
import './race.css';
import { setupRace, animate, checkKeyPressed, checkKeyReleased} from '../../functions/raceFunctions.js';
const keyDownListeners = window.addEventListener("keydown", checkKeyPressed, false); 
const keyUpListeners = window.addEventListener("keyup", checkKeyReleased, false); 

class Race extends Component {
  constructor() {
    super();
    this.state = {
      raceStarted: false,
      gameObject: ''
    }
  }
  componentDidMount() {
    this.setState({gameObject: this.props.gameObject});
  }
  componentDidUpdate() {
    console.log('state of race: ', this.state);
    if (this.state.raceStarted === false) {
      // setup race
      const newGameObject = setupRace(this.state.gameObject);
      console.log('newGo ', newGameObject);
      // start animation
      //animate();
      // set raceStarted = true
      this.setState({raceStarted: true});
    }
  }
  render() {
    return (
      <div>
        <div id= "inCenter">
          <div id= "canvasPlace">
            <canvas id= "kanveesi" width= "900" height= "600">
              Your browser does not support canvas.
            </canvas>
          </div>
          <div id= "infoPlace"><br/>
          </div> 
          <div id= "infoPlace2"><br/>
          </div>
          <div id= "collisionPlace"><br/>
          </div>
        </div>
      </div>
    );
  }
}
export default Race;

/**
 * Provides requestAnimationFrame in a cross browser way.
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 */
if ( !window.requestAnimationFrame ) {
    window.requestAnimationFrame = ( function() {
        return window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
            window.setTimeout( callback, 1000 / 60 );
        };
    }());
}