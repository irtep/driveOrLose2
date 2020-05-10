import React, { Component } from "react";
import { render } from "react-dom";
import './race.css';
import { setupRace, checkKeyPressed, checkKeyReleased} from '../../functions/raceFunctions.js';

class Race extends Component {
  constructor() {
    super();
    this.state = {
      raceStarted: false,
      gameObject: ''
    }
    this.animate = this.animate.bind(this);
  }
    animate(){
    const keyDownListeners = window.addEventListener("keydown", checkKeyPressed, false); 
    const keyUpListeners = window.addEventListener("keyup", checkKeyReleased, false); 
    const gameObject = this.state.gameObject;

    if (gameObject.race.terminated !== true) {
      // decide ai actions
      // make them for everyone else except car[0] as that is players car. So i = 1, because of that.
      for (let i = 1; i < gameObject.race.cars.length; i++) {
        aiDriverBrain(gameObject.race.cars[i], gameObject);
      }
      gameObject.race.cars.forEach( (vehicle) => {
        if (vehicle.hitPoints > 0) {
          carMovement(vehicle, gameObject);
        }
      }); 
      // check if all cars are disabled
      if (gameObject.race.started) {
        const carsInGoal = gameObject.race.cars.filter(car => gameObject.race.totalLaps == car.currentLap);
        const brokenCars = gameObject.race.cars.filter(car => 0.1 > car.hitPoints);
        // race is finished
        if (carsInGoal.length + brokenCars.length === gameObject.race.cars.length)  {
          gameObject.race.terminated = true;
        }
      }
      paintAll(gameObject.race);
      //giveStats();  // writes info to infoPlace.innerHTML as for bugfix purpose
      // maybe to this.animate?
      raceAnimation = window.requestAnimationFrame(animate);
      //  if (gameObject.race.terminated) {
      //    terminateRace(gameObject);
      //  }
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
      // start race time keeping
      // start animation
      this.animate();
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