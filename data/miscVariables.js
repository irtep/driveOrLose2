export const colorsAll = ['white','green','darkGreen','black','navy','blue','cyan','orange','gold','yellow','red','crimson','silver','gray', 'pink', 'purple', 'cornsilk', 'navajowhite', 'aqua', 'aquamarine', 'blueviolet', 'burlyWood', 'cadetBlue', 'cornFlowerBlue', 'coral', 'darkBlue', 'darkMagenta', 'magenta', 'darkOrange', 'darkSeaGreen', 'deepPink', 'deepSkyBlue', 'fuchsia', 'greenYellow', 'hotPink', 'violet', 'yellowGreen'];
export const raceTypes = ['Lap record hunt', 'Single Race', 'Championships Series'];
export const gameObject = {                                                             
  car: {driver: null, name: null, color1: null, color2: null, chassis: null, motor: null, tires: null, armour: null, pieces: null, x: null, y: null, w: null, h: null, 
         statuses: {
           speed: 0, brakingValue: 0.2, originalFriction: 0.06, turnRate: 5, friction: 0.06, heading: 0, isMoving: false, reverse: false, outOfControl: false
         }
       },
  race: {cars: [], track: [], typeOfRace: 'default', tests: {radarBars: null}, results: [], terminated: false, started: false},
  standings: []
}