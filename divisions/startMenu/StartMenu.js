import React, { Component } from "react";
import { render } from "react-dom";
import './startMenu.css';
import { vehicles } from '../../data/carsAndParts.js';
import { colorsAll, raceTypes, gameObject } from '../../data/miscVariables.js';
import { tracks } from '../../data/tracks.js';

class StartMenu extends Component {
  constructor() {
    super();
    this.state = {
      gameObject: ''
    }
    this.checkInfo = this.checkInfo.bind(this);
    this.startGame = this.startGame.bind(this);
  }
  startGame() {
    const dataToSend = {status: 'readyForRace', gameObject: this.state.gameObject}
    // send request to start the race and gameObject to parent
    this.props.sendToParent(dataToSend); 
  }
  checkInfo(data) {
    // adds selected data to gameObject
    const tempGameObject = {...this.state.gameObject};
    switch (data.target.id) {
      case 'yourName':
        tempGameObject.car.driver = data.target.value;
      break; 
      case 'selectCar':
        tempGameObject.car.name = data.target.value;
      break;
      case 'selectColor':
        tempGameObject.car.color1 = data.target.value;
      break;
      case 'selectColor2':
        tempGameObject.car.color2 = data.target.value;
      break;
      case 'typeOfRace':
        tempGameObject.race.typeOfRace = data.target.value;         
        // if selected Champs Series, need to hide circuit selector and vice versa.
        const selectCircuitForm = document.getElementById('selectCircuitForm');
        switch (data.target.value) {  
          case 'Lap Record Hunt':
            selectCircuitForm.style.opacity = 1;
          break;
          case 'Single Race':
            selectCircuitForm.style.opacity = 1;
          break;
          case 'Championships Series':
            selectCircuitForm.style.opacity = 0;
          break;
          default: console.log('racetype not found!');
        }
      break;
      case 'selectCircuit':
        tempGameObject.race.track  = data.target.value;
      break;
      default: console.log('not found check info!');
    }

    this.setState({gameObject: tempGameObject});
    //console.log('state: ', this.state);
  }
  componentDidMount(){
    const insideFoot = document.getElementById('insideFoot');
    const nameF = document.getElementById('yourName');
    const colorF = document.getElementById('selectColor');
    const colorF2 = document.getElementById('selectColor2');
    // hide canvas
    document.getElementById('kanveesi').style.display = 'none';
  
    // Table to show car details:
    vehicles.forEach( (vehicle) => {
      insideFoot.innerHTML += '<td><b>' +vehicle.name +'</b><br>'+ vehicle.stats + '<br><br>' + vehicle.description +'</td>';
    }); 
  
    // fetch top drivers and lap records entries from database.
    //showListFromDB(false); // lap records
    //showListFromDB(true);  // top drivers
    // add them to their place.
  
    // get possible saved driver info
    /*
    const driverInfo = JSON.parse(localStorage.getItem('driverInfo'));
  
    if (driverInfo !== null) {
      nameF.value = driverInfo.name;
      colorF.value = driverInfo.color1;
      colorF2.value = driverInfo.color2;
    }
    */
    // fill dropdown menu for cars:
    vehicles.forEach( (item) => { 
      const o = document.createElement("option");
      o.text = item.name;
      o.value = item.name;
      document.getElementById("selectCar").appendChild(o);
    });
    // fill dropdown menu for circuits:
    tracks.forEach( (item) => { 
      const o = document.createElement("option");
      o.text = item.name;
      o.value = item.name;
      document.getElementById("selectCircuit").appendChild(o);
    });
    // fill dropdown menu for race type:
    raceTypes.forEach( (item) => { 
      const o = document.createElement("option");
      o.text = item;
      o.value = item;
      document.getElementById("typeOfRace").appendChild(o);
    });
    // fill dropdown menu for colors:
    const colors = colorsAll.sort();
    colors.forEach( (item) => { 
      const o = document.createElement("option");
      o.text = item;
      o.value = item;
      document.getElementById("selectColor").appendChild(o);
    });
    colors.forEach( (item) => { 
      const o = document.createElement("option");
      o.text = item;
      o.value = item;
      document.getElementById("selectColor2").appendChild(o);
    });
    // make gameObject:
    this.setState({gameObject: gameObject});
  }
  componentDidUpdate() {
    const selectOptions = [
      document.getElementById('selectCar'),
      document.getElementById('selectColor'),
      document.getElementById('selectColor2'),
      document.getElementById('typeOfRace'),
      document.getElementById('selectCircuit')
    ];
    const defaultValues = [
      'Choose a car',
      'Choose a color 1',
      'Choose a color 2',
      'Choose type of race',
      'Choose a circuit',
    ];
    // remove options "choose xxx" if that is already is chosen
    selectOptions.forEach( (seOps, idx) => {
      if (seOps.options[0].value === defaultValues[idx] && seOps.value !== defaultValues[idx]) {
        seOps.remove(0);
      }
    });
    // if all is selected, lets show the start button:
    if (this.state.gameObject !== '') {
      const startButton = document.getElementById('startButton');
      if (this.state.gameObject.car.driver !== null &&
          this.state.gameObject.car.name !== null &&
          this.state.gameObject.car.color1 !== null &&
          this.state.gameObject.car.color2 !== null &&
          (this.state.gameObject.race.typeOfRace === 'Championships Series' ||
          this.state.gameObject.race.track !== null && 
          this.state.gameObject.race.typeOfRace !== null)) {
        startButton.style.opacity = 1;
      } else {
        startButton.style.opacity = 0;
      }
    }
  }
  render() {
    return (   
      <div id= "container">
      
      <header id= "theHeader" className= "divs"> 
        <span id= "gameTitle">Drive Or Lose 2.</span>
        <span id="version">beta 0.1</span>
      </header>

      <div id= "idForm" className= "divs">
        <div id= "container3">
          <div id= "menus">
            Your name: <br/>
            <input type= "text" id= "yourName" onChange= {this.checkInfo}/><br/><br/>
            Select your car:
            <form name= "selectCarForm" id= "selectCarForm"> 
              <select id="selectCar" onChange= {this.checkInfo}>
                <option>Choose a car</option>
              </select>
            </form>  
            Select colors:
            <form name= "selectColorForm" id= "selectColorForm"> 
              <select id="selectColor" onChange= {this.checkInfo}>
                <option>Choose a color 1</option>
              </select>
            </form>
            <form name= "selectColorForm2" id= "selectColorForm2"> 
              <select id="selectColor2" onChange= {this.checkInfo}>
                <option>Choose a color 2</option>
              </select>
            </form>
            Select a type of race:
            <form name= "selectTypeOfRaceForm" id= "selectTypeOfRaceForm">
              <select id="typeOfRace" onChange= {this.checkInfo}>
                <option>Choose type of race</option>
              </select>
            </form>       
            Select circuit:
            <form name= "selectCircuitForm" id= "selectCircuitForm"> 
              <select id="selectCircuit" onChange= {this.checkInfo}>
                <option>Choose a circuit</option>
              </select>
            </form> 
            <br/>
            <input id= "startButton" type= "button" value= "Start" onClick= {this.startGame}/>
          </div>
          <div id= "helps">
            GAME INFO:
            <p>
              Start by filling form at left.<br/><br/>
              Full racing season is 4 races and the most glorious form of play.<br/><br/>
              Race or lap record hunt is 3 laps long.<br/><br/>
              Info about cars in boxes below.<br/><br/>
              How to drive:<br/><br/>
              arrow up: accelerate.<br/>
              arrow down: break. <br/>
              arrows left and right: steering wheel. <br/>
              reverse: R.
            </p>
          </div>
        </div>
      </div>
      
      <div id= "lapRecords">
        <div id= "container2">
          <div id= "finseFactory" className= "divs">Finse Factory Top 3 laps:</div>
          <div id= "cityCentre" className= "divs">City Centre Top 3 laps:</div>
          <div id= "lasCurvas" className= "divs">Las Curvas Top 3 laps:</div>
          <div id= "alleys" className= "divs">Alleys Top 3 laps:</div>
          <div id= "champs" className= "divs">Drive or Lose Champions: <br/></div>
        </div>
      </div>

      <footer id= "theFoot" className= "divs">
        <table>
          <tbody>
            <tr id= "insideFoot"></tr>
          </tbody>
        </table>
          {/* Canvas needed here as some track data gets data by its size-->*/}
          <canvas id="kanveesi" width="1" height="1">
          Your browser does not support canvas.
          </canvas>
      </footer>
      
    </div>
    );
  }
}

export default StartMenu;