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
  }
  checkInfo(data) {
    const tempGameObject = {...this.state.gameObject};
    switch (data.target.id) {
      case 'yourName':
        tempGameObject.car.driver = data.target.value;
      break; 
      case 'selectCar':
        console.log('sC');
      break;
      case 'selectColor':
        console.log('selectColor');
      break;
      case 'selectColor2':
        console.log('sco2');
      break;
      case 'typeOfRace':
        console.log('tOr');
      break;
      case 'selectCircuit':
        console.log('sCircu');
      break;
      default: console.log('not found check info!');
    }

    this.setState({gameObject: tempGameObject});
  }
  componentDidMount(){
    const insideFoot = document.getElementById('insideFoot');
    const nameF = document.getElementById('yourName');
    const colorF = document.getElementById('selectColor');
    const colorF2 = document.getElementById('selectColor2');
  
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
    */// Dropdown menu for cars:
    vehicles.forEach( (item) => { 
      const o = document.createElement("option");
      o.text = item.name;
      o.value = item.name;
      document.getElementById("selectCar").appendChild(o);
    });
    // Dropdown menu for circuits:
    tracks.forEach( (item) => { 
      const o = document.createElement("option");
      o.text = item.name;
      o.value = item.name;
      document.getElementById("selectCircuit").appendChild(o);
    });
    // Dropdown menu for race type:
    raceTypes.forEach( (item) => { 
      const o = document.createElement("option");
      o.text = item;
      o.value = item;
      document.getElementById("typeOfRace").appendChild(o);
    });
    // Dropdown menu for colors:
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
  render() {
    return (   
      <div id= "container">
      
      <header id= "theHeader" class= "divs"> 
        <span id= "gameTitle">Drive Or Lose 2.</span>
        <span id="version">beta 0.1</span>
      </header>

      <div id= "idForm" class= "divs">
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
            <input id= "startButton" type= "button" value= "Start" onclick= "start()"/>
            <input id= "quickButton" type= "button" value= "Quick Start" onclick= "quickStart()"/>
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
          <div id= "finseFactory" class= "divs">Finse Factory Top 3 laps:</div>
          <div id= "cityCentre" class= "divs">City Centre Top 3 laps:</div>
          <div id= "lasCurvas" class= "divs">Las Curvas Top 3 laps:</div>
          <div id= "alleys" class= "divs">Alleys Top 3 laps:</div>
          <div id= "champs" class= "divs">Drive or Lose Champions: <br/></div>
        </div>
      </div>

      <footer id= "theFoot" class= "divs">
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