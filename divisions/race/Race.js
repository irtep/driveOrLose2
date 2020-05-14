import React, { Component } from "react";
import { render } from "react-dom";
import './race.css';
import { setupRace, carMovement } from '../../functions/raceFunctions.js';
import { aiDriverBrain } from '../../functions/aiFunctions.js';
import { paintAll } from '../../functions/draw.js';

class Race extends Component {
  constructor() {
    super();
    this.state = {
      raceStarted: false,
      gameObject: ''
    }
    this.animate = this.animate.bind(this);
    this.checkKeyPressed = this.checkKeyPressed.bind(this);
    this.checkKeyReleased = this.checkKeyReleased.bind(this);
    this.stopRace = this.stopRace.bind(this);
  }
  stopRace() {
    const dataToSend = {status: 'raceTerminated', gameObject: this.state.gameObject}
    // send request to show after race screen and gameObject to parent
    this.props.sendToParent(dataToSend); 
  }
  checkKeyPressed(pressed) {
    const gameObject = {...this.state.gameObject};
    switch (pressed.code) {
      // up  
      case 'ArrowUp': 
        gameObject.race.cars[0].statuses.accelerate = true;
      break;
        // shift, for alternative acceleration 
      case 'ShiftRight': 
        gameObject.race.cars[0].statuses.accelerate = true;
      break;
      // down
      case 'ArrowDown': 
        gameObject.race.cars[0].statuses.braking = true;
      break;
      // left  
      case 'ArrowLeft': 
        gameObject.race.cars[0].statuses.turnLeft = true;
      break;
      // right  
      case 'ArrowRight': 
        gameObject.race.cars[0].statuses.turnRight = true;
      break;
      // 'r' for reverse:
      case 'KeyR':
        gameObject.race.cars[0].statuses.reverse = true;  
      break;
      //default: console.log('not found this key(pressed)');  
    }
    this.setState({gameObject});
  }
  checkKeyReleased(released) {
    const gameObject = {...this.state.gameObject};
    switch (released.code) {
      // up  
      case 'ArrowUp': 
        gameObject.race.cars[0].statuses.accelerate = false;   
      break;  
      // shift, for alternative acceleration 
      case 'ShiftRight': 
        gameObject.race.cars[0].statuses.accelerate = false;
      break;
      // down
      case 'ArrowDown': 
        gameObject.race.cars[0].statuses.braking = false;
      break;
      // left  
      case 'ArrowLeft': 
        gameObject.race.cars[0].statuses.turnLeft = false;
      break;
      // right  
      case 'ArrowRight': 
        gameObject.race.cars[0].statuses.turnRight = false;
      break;      
      // 'r' for reverse:
      case 'KeyR':
        gameObject.race.cars[0].statuses.reverse = false;  
      break;     
      //default: console.log('not found this key(released) ');  
    }
    this.setState({gameObject});    
  }
  animate(){
    const keyDownListeners = window.addEventListener("keydown", this.checkKeyPressed, false); 
    const keyUpListeners = window.addEventListener("keyup", this.checkKeyReleased, false); 
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
      const raceAnimation = window.requestAnimationFrame(this.animate);
      if (gameObject.race.terminated) {
        this.stopRace();
      }
    }
  }
  componentDidMount() {
    this.setState({gameObject: this.props.gameObject});
    // show canvas
    document.getElementById('kanveesi').style.display = 'block';
  }
  componentDidUpdate() {
    console.log('state.gameObject.track ', this.state.gameObject.race.track);
    //console.log('state of race: ', this.state);
    const infoPlace = document.getElementById('infoPlace');
    let seconds = 6; // to start race

    if (this.state.raceStarted === false) {
      // setup race
      const newGameObject = setupRace(this.state.gameObject);
      // start race countdown
      const countDown = window.setInterval(() => {
        seconds--;
        infoPlace.innerHTML = 'Get ready! Race starts in: ' + seconds;
        if (seconds === 0) {
          const gameObject = {...this.state.gameObject};
          infoPlace.innerHTML = 'Race is On!'
          // give cars hit points to allow it move
          gameObject.race.cars.forEach((carInTurn) => {  
            carInTurn.hitPoints = JSON.parse(JSON.stringify(carInTurn.maxHitPoints));
          });
          gameObject.race.started = true;
          // terminate this calculator:
          window.clearInterval(countDown);
          this.setState({gameObject});
        }
      }, 1000);      
      // start race time keeping  
      const lapTimer = window.setInterval(() => {
        const gameObject = {...this.state.gameObject};
        if (gameObject.race.cars[0].currentLap > gameObject.race.totalLaps) {
          window.clearInterval(lapTimer)
        }
        // update lap time
        if (gameObject.race.currentLapTime.milliseconds < 99) {
          gameObject.race.currentLapTime.milliseconds++;
        } else {
          gameObject.race.currentLapTime.milliseconds = 0;
          if (gameObject.race.currentLapTime.seconds < 59) {
            gameObject.race.currentLapTime.seconds++;
          } else {          
            gameObject.race.currentLapTime.seconds = 0;
            gameObject.race.currentLapTime.minutes++;
          }
        }
        this.setState({gameObject});
      }, 10);
      // start animation
      this.animate();
      // set raceStarted = true
      this.setState({raceStarted: true});
    }
  }
  render() {
    return (
      <div>
        <div id= "infoPlace">
        </div>
        <div id= "canvasPlace">
          <canvas id= "kanveesi" width= "900" height= "600">
            Your browser does not support canvas.
          </canvas>
        </div>
        <div id= "infoPlace2">
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