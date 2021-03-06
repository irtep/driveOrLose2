
import { vehicles, chassises, motors, tires, armours } from '../data/carsAndParts.js';
import { Car } from '../data/classes.js';
import { aiCars } from '../data/aiDrivers.js';
import { tracks } from '../data/tracks.js';
import { paintAll } from './draw.js';
import { aiDriverBrain } from './aiFunctions.js';
let gameObject = null;

export function carMovement(car, gameObject) {
  const stats = car.statuses;
  let sliding = 0;
  //if (stats.lastStableHeading === null || stats.lastStableHeading === undefined) {
   // stats.lastStableHeading = 0;
 // }
  // maximum damage with one collision
  const maxDam = car.maxHitPoints / 4;
  // need these old values if collisions
  let oldX = JSON.parse(JSON.stringify(car.x));
  let oldY = JSON.parse(JSON.stringify(car.y));
  // need old value of heading for sliding
  const oldHeading = JSON.parse(JSON.stringify(stats.heading));
  // give lost control back if slow enough
  if (stats.grip > stats.speed) {
    stats.outOfControl = false;
   // stats.lastStableHeading = JSON.parse(JSON.stringify(stats.heading));
  } else {
    stats.outOfControl = true;
    sliding = (stats.speed - stats.grip) * 0.8;
  }
  // if advancing
  if (stats.speed > 0) {
    const speeds = getSpeeds(stats.heading, stats.speed);
    //const speeds = getSpeeds(stats.heading, stats.speed, stats.outOfControl, stats.lastStableHeading, sliding, 
    //stats.turnLeft, stats.turnRight);
    // decrease of speed by friction
    stats.isMoving = true;
    stats.speed -= stats.friction; 
    // if too much speed for grip and turning, car is out of control:
    /*
    if (stats.speed > stats.grip) {
      slipFactory = stats.speed - stats.grip;
    }
    */ 
    car.x += -speeds.x;
    car.y += speeds.y;
    // collision test:
    updateXandY(gameObject.race.cars, gameObject);
    const colTest = collisionTest(car, gameObject);
    if (colTest !== false){ 
      car.x = oldX;
      car.y = oldY;
      updateXandY(gameObject.race.cars, gameObject);
      stats.speed = 0;
      stats.isMoving = false;
      // damage test:
      const damageResults = damageDealer(car, colTest);
      if (damageResults.car1 > maxDam) { damageResults.car1 = maxDam; }
      if (damageResults.car2 > maxDam) { damageResults.car2 = maxDam; }
      damageResults.car1 = damageResults.car1 / 3;
      damageResults.car2 = damageResults.car2 /3;
      car.hitPoints = car.hitPoints - damageResults.car1;
      colTest.hitPoints = colTest.hitPoints - damageResults.car2;
    }
    else { 
      // no collision, nothing special happens 
    }
  }
    // if stopped
    if (stats.speed < 0 && stats.reverse === false) {
      stats.isMoving = false;    
    }
    // if reversing
    if (stats.speed <= 0 && stats.reverse === true && car.hitPoints > 0) {
      const speeds = getSpeeds(stats.heading, -0.6);
      car.x += -speeds.x;
      car.y += speeds.y;
      stats.isMoving = true;   
      // collision test:
      updateXandY(gameObject.race.cars, gameObject);
      const colTest = collisionTest(car, gameObject);
        if (colTest !== false) { 
          car.x = oldX;
          car.y = oldY;
          updateXandY(gameObject.race.cars, gameObject);
          stats.speed = 0;
          stats.isMoving = false;
          // damage test:
          const damageResults = damageDealer(car, colTest);
          if (damageResults.car1 > maxDam) { damageResults.car1 = maxDam; }
          if (damageResults.car2 > maxDam) { damageResults.car2 = maxDam; }
          damageResults.car1 = damageResults.car1 / 3;
          damageResults.car2 = damageResults.car2 /3;
          car.hitPoints = car.hitPoints - damageResults.car1;
          colTest.hitPoints = colTest.hitPoints - damageResults.car2;
        }
        else { 
          // no collision     
        }
    }
    // if accelerating
    if (stats.accelerate === true /*&& stats.outOfControl === false*/) { 
      car.accelerate();    
    }
    // if braking
    if (stats.braking === true && stats.speed > -1) { 
      car.brake();    
    } else {
      // release breaks
      stats.friction = stats.originalFriction;
    }
    // if turning
    // modifications caused by possibly too much speed:
    // save original value:
    const origVal = JSON.parse(JSON.stringify(car.statuses.turnRate));
    //car.statuses.turnRate -= slipFactory;
    if (stats.turnRight === true /*&& stats.outOfControl === false*/) { 
      car.turnRight();
      if (stats.outOfControl) {
        const slidingSpeeds = getSpeeds(oldHeading-45, sliding);
        const headingFix = getSpeeds(stats.heading, stats.speed-sliding)
        car.x = oldX;
        car.y = oldY;
        car.x += -slidingSpeeds.x;
        car.y += slidingSpeeds.y;
        car.x += -headingFix.x;
        car.y += headingFix.y;
      }
    }
    // if turning
    if (stats.turnLeft === true /*&& stats.outOfControl === false*/) { 
      car.turnLeft();
      if (stats.outOfControl) {
        const slidingSpeeds = getSpeeds(oldHeading+45, sliding);
        const headingFix = getSpeeds(stats.heading, stats.speed-sliding)
        car.x = oldX;
        car.y = oldY;
        car.x += -slidingSpeeds.x;
        car.y += slidingSpeeds.y;
        car.x += -headingFix.x;
        car.y += headingFix.y;
      }    
    }
    // reset value:
    car.statuses.turnRate = origVal;    
}
export function terminateRace(gameObj) {
  
  // save gameObject
  localStorage.setItem('Go', JSON.stringify(gameObj)); 
  
  window.setInterval( () => {
    // to next screen
    window.location = "https://driveorlose.glitch.me/afterRace";
  }, 2000);
  
}

export function giveStats() {  // just informal stuff in development and bugfix purposes...
  const infoPlace = document.getElementById('infoPlace');
  const infoPlace2 = document.getElementById('infoPlace2');
  /*
  infoPlace.innerHTML = 'currentLap: ' + gameObject.race.cars[0].currentLap + ' last/next checkPoint: ' + 
  gameObject.race.cars[0].lastCheckPoint + '/' + gameObject.race.cars[0].nextCheckPoint + 'lap time: ' +
  gameObject.race.currentLapTime.minutes + ':' + gameObject.race.currentLapTime.seconds + ':' + gameObject.race.currentLapTime.milliseconds
  */
  infoPlace.innerHTML = 'speed: '+ gameObject.race.cars[0].statuses.speed+ ' turnRate: '+ gameObject.race.cars[0].statuses.turnRate;
  
}

// with grip, this if from original version
export function getSpeeds (rotation, speed) {
  const to_angles = Math.PI/180;
  
  return {
		y: Math.sin(rotation * to_angles) * speed,
		x: Math.cos(rotation * to_angles) * speed * -1,
	};
} 
// with grip
/*
export function getSpeeds (rotation, speed, outOfControl, lastStableHeading, sliding, turnLeft, turnRight) {
  const to_angles = Math.PI/180;
  //console.log('compare rotation and last stable ', rotation, lastStableHeading);
  if (outOfControl && turnLeft) {
    return {
		  y: Math.sin(lastStableHeading+20 * to_angles) * speed+20,
		  x: Math.cos(lastStableHeading+20 * to_angles) * speed+20 * -1,
	  };
  }  
  else if (outOfControl && turnRight) {
    return {
		  y: Math.sin(lastStableHeading * to_angles) * speed,
		  x: Math.cos(lastStableHeading * to_angles) * speed * -1,
	  };
  } 
  else {
    return {
		  y: Math.sin(rotation * to_angles) * speed,
		  x: Math.cos(rotation * to_angles) * speed * -1,
	  };
  }
}
*/
// when lost grip:
/*
export function getSpeedsSliding (rotation, speed, outOfControl, lastStableHeading, sliding, turnLeft, turnRight) {
  const to_angles = Math.PI/180;
  let speedX = Math.cos(rotation * to_angles) * speed * -1;
  let speedY = Math.sin(rotation * to_angles) * speed;
  const absolutes = {x: Math.abs(speedX), y: Math.abs(speedY)};
  if (slide !== 0) { slide = slide + 5; }
  // add slide value to that who has smaller absolute number
  if (absolutes.x >= absolutes.y && (turnLeft || turnRight)) {
    const posOrNeg = Math.sign(speedY);
    if (posOrNeg == -1) {
      speedY -= slide;     
    } else {
      speedY += slide;
    }
  } 
  else if (absolutes.x < absolutes.y && (turnLeft || turnRight)){
    const posOrNeg = Math.sign(speedX);
    if (posOrNeg == -1) {
      speedX -= slide;     
    } else {
      speedX += slide;
    }   
  }
  return {
		y: speedY,
		x: speedX,
	};
}
*/
// updating weight, color, cost, armour, hitPoints and car handling stats.
export function updateCar(carOnCase) {
  carOnCase.weight = carOnCase.chassis.weight + carOnCase.armour.weight + carOnCase.motor.weight + carOnCase.tires.weight;
  carOnCase.cost = carOnCase.chassis.cost + carOnCase.armour.cost + carOnCase.tires.cost + carOnCase.motor.cost;
  carOnCase.statuses.power = carOnCase.motor.power - (carOnCase.weight/10);
  carOnCase.statuses.maxSpeed = carOnCase.motor.maxSpeed - carOnCase.weight;
  carOnCase.statuses.grip = carOnCase.tires.grip - carOnCase.weight;
  carOnCase.pieces.hull.color = carOnCase.color1;
  carOnCase.armourValue = carOnCase.chassis.armour + carOnCase.armour.value;
  // giving 0 hit points as a starting stats:
  carOnCase.hitPoints = 0;
  //carOnCase.hitPoints = carOnCase.chassis.durability + carOnCase.motor.durability;
  carOnCase.maxHitPoints = carOnCase.chassis.durability + carOnCase.motor.durability;
  return carOnCase;
}
/*
      CREATE NEW CAR
*/
// this will create car to racetrack. playerCar indicates if this is for player or ai
function createNewCar(newCar, playerCar, gameObject){
  console.log('createNewCar', newCar, playerCar);
  // search chassis, motor, tires, armour and pieces by cars name:
  // these are not defined atm...
  const allPieces = {
    vehicles: JSON.parse(JSON.stringify(vehicles)),
    chassises: JSON.parse(JSON.stringify(chassises)),
    motors: JSON.parse(JSON.stringify(motors)),
    tires: JSON.parse(JSON.stringify(tires)),
    armours: JSON.parse(JSON.stringify(armours))
  };
  const stats = allPieces.vehicles.filter( (cars) => newCar.name === cars.name);
  // chassis has pieces
  const chassis = allPieces.chassises.filter( (chas) => stats[0].chassis === chas.name);
  const mot = allPieces.motors.filter( (moto) => stats[0].motor === moto.name);
  const tire = allPieces.tires.filter( (tir) => stats[0].tires === tir.name);
  const armour = allPieces.armours.filter( (armo) => stats[0].armour === armo.name);
  newCar.chassis = chassis[0]; newCar.motor = mot[0]; newCar.tires = tire[0]; newCar.armour = armour[0];
  newCar.pieces = chassis[0].pieces;
  // updates weight, color, cost, handling stats from pieces. 
  // separates, as can use that same for example, if someone changes motor/tires etc.
  newCar = updateCar(newCar);
  // if not first car, lets change x and y:
  playerCar ? newCar.pieces.hull.x = 10 : newCar.pieces.hull.y += (30 * gameObject.race.cars.length);
  // add statuses.dodgeLeft and statuses.dodgeRight for ai purposes also aiCheckPoints
  if (playerCar !== true) {
    newCar.statuses.dodgeLeft = false; newCar.statuses.dodgeRight = false; newCar.statuses.dodgeReverse = false;
    newCar.lastAiCp = 0;
    newCar.nextAiCp = 1;
  }
  // array for pieceList
  newCar.pieces.parts = [];
  // add stats that will be needed to paint the car. For all different parts.
  newCar.pieces.drawPoint = newCar.chassis.drawPoint;
  if (newCar.pieces.speedStripe !== undefined) {
    newCar.pieces.speedStripe.x = newCar.pieces.drawPoint.x;
    newCar.pieces.speedStripe.y = newCar.pieces.drawPoint.y + (newCar.pieces.hull.h / 2) - 1.5;   
    newCar.pieces.speedStripe.w = newCar.pieces.hull.w;
    // if secondary color is selected, apply it:
    if (newCar.color2 !== 'Choose a color 2') {  
      newCar.pieces.speedStripe.color = newCar.color2;
    }
    newCar.pieces.parts.push(newCar.pieces.speedStripe);
  } 
  if (newCar.pieces.leftFrontWindow !== undefined) {
    newCar.pieces.leftFrontWindow.x = newCar.pieces.drawPoint.x + (newCar.pieces.hull.w / 2);
    newCar.pieces.leftFrontWindow.y = newCar.pieces.drawPoint.y + 1;
    newCar.pieces.leftFrontWindow.w = (newCar.pieces.hull.w / 4) / 2;
    newCar.pieces.parts.push(newCar.pieces.leftFrontWindow);
  }
  if (newCar.pieces.rightFrontWindow !== undefined) {
    newCar.pieces.rightFrontWindow.x = newCar.pieces.leftFrontWindow.x;
    newCar.pieces.rightFrontWindow.y = newCar.pieces.drawPoint.y + newCar.pieces.hull.h - newCar.pieces.rightFrontWindow.h - 1;
    newCar.pieces.rightFrontWindow.w = (newCar.pieces.hull.w / 4) / 2;
    newCar.pieces.parts.push(newCar.pieces.rightFrontWindow);
  }
  if (newCar.pieces.leftRearWindow !== undefined) {
    newCar.pieces.leftRearWindow.x = newCar.pieces.drawPoint.x + (newCar.pieces.hull.w / 4);
    newCar.pieces.leftRearWindow.y = newCar.pieces.drawPoint.y + 1;
    newCar.pieces.leftRearWindow.w = (newCar.pieces.hull.w / 4) / 2;
    newCar.pieces.parts.push(newCar.pieces.leftRearWindow);
  }
  if (newCar.pieces.rightRearWindow !== undefined) {
    newCar.pieces.rightRearWindow.x = newCar.pieces.leftRearWindow.x;
    newCar.pieces.rightRearWindow.y = newCar.pieces.drawPoint.y + newCar.pieces.hull.h - newCar.pieces.rightRearWindow.h - 1;
    newCar.pieces.rightRearWindow.w = (newCar.pieces.hull.w / 4) / 2;
    newCar.pieces.parts.push(newCar.pieces.rightRearWindow);
  }
  if (newCar.pieces.frontWindow !== undefined) {
    newCar.pieces.frontWindow.x = newCar.pieces.drawPoint.x + newCar.pieces.hull.w - (newCar.pieces.hull.w / 3);
    newCar.pieces.frontWindow.y = newCar.pieces.drawPoint.y + 1.5;
    newCar.pieces.frontWindow.h = newCar.pieces.hull.h - 3;
    newCar.pieces.parts.push(newCar.pieces.frontWindow);
  }
  if (newCar.pieces.rearWindow !== undefined) { 
    newCar.pieces.rearWindow.x = newCar.pieces.drawPoint.x + (newCar.pieces.hull.w / 6);
    newCar.pieces.rearWindow.y = newCar.pieces.drawPoint.y + 1.5;
    newCar.pieces.rearWindow.h = newCar.pieces.hull.h - 3;
    newCar.pieces.parts.push(newCar.pieces.rearWindow);
  }
  const carsRootStats = {name: newCar.name, cost: newCar.cost, weight: newCar.weight, armourValue: newCar.armourValue, hitPoints: newCar.hitPoints,
                        maxHitPoints: newCar.maxHitPoints};
  console.log('new car created, gO: ', newCar);
  return new Car(newCar.driver, carsRootStats, newCar.pieces, newCar.statuses);
}

// damage dealer:
export function damageDealer(obj1, obj2) {
  let weightDifference = Math.abs(obj1.weight) - Math.abs(obj2.weight);
  const absDifference = Math.abs(weightDifference);
  const damages = {car1: 0, car2: 0};
  // lighter takes damage
  if (obj1.weight < obj2.weight) {
    let dealToObj1 = 0;
    let dealToObj2 = 1;
    dealToObj1 = absDifference - obj1.armourValue;
    if (dealToObj1 < 1) { dealToObj1 = 1} // 1 is minimum damage
    damages.car1 = dealToObj1; damages.car2 = dealToObj2
  }
  if (obj2.weight < obj1.weight) {
    let dealToObj1 = 1;
    let dealToObj2 = 0;
    dealToObj2 = absDifference - obj2.armourValue;
    if (dealToObj2 < 1) { dealToObj2 = 1} // 1 is minimum damage
    //console.log('dealing: ', dealToObj1, dealToObj2);
    damages.car1 = dealToObj1; damages.car2 = dealToObj2
  }
  // if same, both take
  if (obj1.weight === obj2.weight) {
    damages.car1 = 3; damages.car2 = 3;
  }
  return damages;
}

/*  
  RECTANGLE BASED COLLISION TEST: 
*/
export function pointInPoly(verties, testx, testy) { 
  var i;
  var j;
  var c = 0;
  var nvert = verties.length;
  for (i = 0, j = nvert - 1; i < nvert; j = i++) {
    if (((verties[i].y > testy) != (verties[j].y > testy)) && (testx < (verties[j].x - verties[i].x) * (testy - verties[i].y) / (verties[j].y - verties[i].y) + verties[i].x))
                    c = !c;
  }
  return c;
}

export function testCollision(rectangle) {
  var collision = false;
  //console.log('testC ', rectangle);
  this.getCorners().forEach((corner) => {
    var isCollided = pointInPoly(rectangle.getCorners(), corner.x, corner.y);
    if (isCollided) collision = true;
  });
  return collision;
}

// bring "full objects" like car or gameObject.race.track.obstacles[0]
// example: checkRectangleCollision(car, gameObject.race.track.obstacles[0]);
export function checkRectangleCollision(rect, rect2) {
  //console.log('cRC ', rect, rect2);
  if (testCollision.call(rect, rect2)) return true;
  else if (testCollision.call(rect2, rect)) return true;
  return false;
}

// collision test starts here
export function collisionTest(car, gameObject) {
  const noCollision = false;
  // AI cars own guide checkpoints:
    // ai guide checkPoints check
    for (let ix1 = 0; ix1 < gameObject.race.track.aiCheckPoints.length; ix1++) {
      const testResult = checkRectangleCollision(car, gameObject.race.track.aiCheckPoints[ix1]);
      if (testResult) {
        if (car.nextAiCp === gameObject.race.track.aiCheckPoints[ix1].number) {
          car.lastAiCp = gameObject.race.track.aiCheckPoints[ix1].number;
          // check if last check points of track reached.
          if (car.lastAiCp + 1 > gameObject.race.track.aiCheckPoints.length) {
            car.nextAiCp = 1;
          } else { 
            car.nextAiCp++;
          }
        }
      }
    }
    // AIs danger zones
    for (let ix1 = 0; ix1 < gameObject.race.track.dangerZones.length; ix1++) {
      const testResult = checkRectangleCollision(car, gameObject.race.track.dangerZones[ix1]);
      if (testResult) {
        // cars start with undefined, so when entering first time set inDangerZone to 1.
        // 0 and undefined is not in danger, all others yes.
        /*if (car.inDangerZone === undefined || car.inDangerZone === false) {
        */
          car.inDangerZone = true;
        //}
      }
    }
    // AIs danger is clear
    for (let ix2 = 0; ix2 < gameObject.race.track.dangerClear.length; ix2++) {
      const testResult = checkRectangleCollision(car, gameObject.race.track.dangerClear[ix2]);
      if (testResult) {
        // cars start with undefined, so when entering first time set inDangerZone to 1.
        // 0 and undefined is not in danger, all others yes.
        //if (car.inDangerZone === undefined || car.inDangerZone === false) {
          car.inDangerZone = false;
        //}
      }
    }       
  
  // check with checkPoints
  for (let ind = 0; ind < gameObject.race.track.checkPoints.length; ind++) {
    const testResult = checkRectangleCollision(car, gameObject.race.track.checkPoints[ind]);
    if (testResult) {
      if (car.nextCheckPoint === gameObject.race.track.checkPoints[ind].number) {
        car.lastCheckPoint = gameObject.race.track.checkPoints[ind].number;
        // check if last check points of track reached.
        if (car.lastCheckPoint + 1 > gameObject.race.track.checkPoints.length) {
          car.nextCheckPoint = 1;
        } else { 
          car.nextCheckPoint++; 
        }
        
        // if start of new lap
        if (car.lastCheckPoint === 1) {
          // if players car
          if (car.driver  === gameObject.car.driver) { 
            // push result of lap clock to 
            if (car.currentLap > 0 && car.currentLap < 4) {
              gameObject.race.lastLaps.push(JSON.parse(JSON.stringify(gameObject.race.currentLapTime)));
            }
            // reset currentLapTime
            gameObject.race.currentLapTime.minutes = 0;
            gameObject.race.currentLapTime.seconds = 0;
            gameObject.race.currentLapTime.milliseconds = 0;
            // write lap times:
            if (gameObject.race.totalLaps + 1 > car.currentLap) {
              let lapTimes = '';
              gameObject.race.lastLaps.forEach( (times) => {
                lapTimes = lapTimes + times.minutes + ':' + times.seconds + ':' + times.milliseconds + '<br>';
              });
              infoPlace2.innerHTML = lapTimes;
            }
          }
          car.currentLap++  
          // check if this was last lap
          if (gameObject.race.totalLaps === car.currentLap) {
            gameObject.race.results.push(car);
            // check if all are finished:
            const finishedCars = gameObject.race.cars.filter(carrito => gameObject.race.totalLaps == carrito.currentLap);
            const disabledCars = gameObject.race.cars.filter(carrito => 0.1 > carrito.hitPoints);
            // race is finished
            if (finishedCars.length + disabledCars.length === gameObject.race.cars.length) {
              const infoPlace = document.getElementById('infoPlace');
              infoPlace.innerHTML = 'RACE FINISHED! Results: ';
              for (let i = 0; i < gameObject.race.results.length; i++) {
                const place = i + 1;
                infoPlace.innerHTML = infoPlace.innerHTML + place + '. ' + gameObject.race.results[i].driver + '. ';
                gameObject.race.terminated = true;
              }
            }
          } else {
            // continues
          }
        } // first checkpoint
      }
    }
  }
  
  // check if collision with cars
  for (let i = 0; i < gameObject.race.cars.length; i++) {
      // lets not compare with same car.
      if (car.driver !== gameObject.race.cars[i].driver) {
        const testResult = checkRectangleCollision(car, gameObject.race.cars[i]);
        //console.log('test: ', gameObject.race.cars[i]);
        if (testResult) { return gameObject.race.cars[i]; } 
      }  
  }
  // check with track obstacles:
  for (let iv = 0; iv < gameObject.race.track.obstacles.length; iv++) {
    const testResult = checkRectangleCollision(car, gameObject.race.track.obstacles[iv]);  
    //console.log('test: ', gameObject.race.track.obstacles[iv]);
    if (testResult) { return gameObject.race.track.obstacles[iv]; } 
  }
  // if no collisions:
  return noCollision;
}

// sets x and y to all cars for collision purposes
export function updateXandY(cars, gameObject) {
  // cars:
  cars.forEach((carInTurn) => {  
    carInTurn.angle = carInTurn.statuses.heading;
    carInTurn.setCorners(carInTurn.angle);
  }); 
  // rectangles in track:
  gameObject.race.track.obstacles.forEach((obsInTurn) => {  
    obsInTurn.setCorners(obsInTurn.angle);
  });
  // checkpoints:
  gameObject.race.track.checkPoints.forEach((cpInTurn) => {  
    cpInTurn.setCorners(cpInTurn.angle);
  });  
  // ai guide checkpoints:
  gameObject.race.track.aiCheckPoints.forEach((cpInTurn) => {  
    cpInTurn.setCorners(cpInTurn.angle);
  }); 
  // ai danger zones
  gameObject.race.track.dangerZones.forEach((cpInTurn) => {  
    cpInTurn.setCorners(cpInTurn.angle);
  });  
  // ai danger clear
  gameObject.race.track.dangerClear.forEach((cpInTurn) => {  
    cpInTurn.setCorners(cpInTurn.angle);
  });
}

export function nameChecker(name1, name2) {
  if (name1 === name2) {
    return true;
  } else {
    return false;
  }
}

/*  ------------------
    Setup the race.
    ------------------
*/  
export function setupRace(gameObject){
  // players car:
  switch (gameObject.race.typeOfRace) {
    case 'Lap Record Hunt':
      // players car:
      gameObject.race.cars.push(createNewCar(gameObject.car, true, gameObject));  
       // find selected track:
      const selectedTrack = tracks.filter( track => track.name === gameObject.race.track);
      gameObject.race.track = selectedTrack[0];
    break;
    case 'Single Race':
      // players car:
      gameObject.race.cars.push(createNewCar(gameObject.car, true, gameObject));
      // ai cars:
      gameObject.race.cars.push(createNewCar(aiCars[0], false, gameObject));
      gameObject.race.cars.push(createNewCar(aiCars[1], false, gameObject));
      gameObject.race.cars.push(createNewCar(aiCars[2], false, gameObject));
      // find selected track:
      const selectedTrack = tracks.filter( track => track.name === gameObject.race.track);
      gameObject.race.track = selectedTrack[0];
    break;
    case 'Championships Series':
      // players car:
      gameObject.race.cars.push(createNewCar(gameObject.car, true, gameObject));
      // ai cars:
      gameObject.race.cars.push(createNewCar(aiCars[0], false, gameObject));
      gameObject.race.cars.push(createNewCar(aiCars[1], false, gameObject));
      gameObject.race.cars.push(createNewCar(aiCars[2], false, gameObject));
      // starting from track 1
      if (gameObject.race.currentRace === undefined) {
        gameObject.race.track = tracks[0];
        gameObject.race.currentRace = 0;  
      } else {
        //gameObject.race.track = tracks[gameObject.race.currentRace];
        gameObject.race.track = tracks[gameObject.race.currentRace];
      }
    break;
    default: console.log('not found in setupRace type of race');  
  }
  // check that no overlapping names
  // not only for clarity reasons in standings, but for collision test too.
  for (let i = 1; i < gameObject.race.cars.length; i++) {
    const nameMatch = nameChecker(gameObject.race.cars[0].driver, gameObject.race.cars[i].driver);
    nameMatch ? gameObject.race.cars[i].driver = 'Josue' : console.log('name ok');
  }
  // finish x and y setup and get angles.
  gameObject.race.cars.forEach((carInTurn) => {  
    carInTurn.x = carInTurn.pieces.hull.x;
    carInTurn.y = carInTurn.pieces.hull.y;
    carInTurn.w = carInTurn.pieces.hull.w;
    carInTurn.h = carInTurn.pieces.hull.h;
    carInTurn.angle = carInTurn.statuses.heading;
    carInTurn.setCorners(carInTurn.angle);
    // checkPoint, currentLap, lapTime, bestTime
    carInTurn.lastCheckPoint = 0;
    carInTurn.nextCheckPoint = 1;
    carInTurn.lastAiCp = 0;
    carInTurn.nextAiCp = 1;
    carInTurn.currentLap = 0;
    carInTurn.lapTime = null;
    carInTurn.bestTime = null;
  }); 
  // laps and raceclock:
  gameObject.race.totalLaps = 4;
  gameObject.race.currentLapTime = {minutes: 0, seconds: 0, milliseconds: 0};
  gameObject.race.lastLaps = [];
  return gameObject;
}
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