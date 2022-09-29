let data = {}

// {
//   //this was an idea, to load everything from JSON and use
//   //my object editor for creating the structures, but I'm
//   //not liking that idea anymore
//   let dataGroups = [
//     "weapon",
//     "asteroid",
//     "location",
//     "locationCoords",
//     "ship",
//     "saveData",
//     "projectile",
//   ]
//   let dataLoaded = 0

//   function loadData() {
//     this.next()
//     if(dataLoaded === groups.length - 1 ) {
//       //assign everything to data {}
//     }
//   }
//   loadData.next = function() {
//     let group = dataGroups.shift()
//   }
// }

// data.npc = {
//   "Character": {
//     fullName: "Character Name",
//     age: 25,
//     reputation: { 
//       //0-10
//       crimson: 8,
//       alliance: 3,
//       theCrown: 4,
//       theHive: 0,
//       tradersUnion: 3,
//     },
//     alignment: { 
//       //how much they respect each faction 0-10
//       crimson: 8,
//       alliance: 3,
//       theCrown: 4,
//       theHive: 0,
//       tradersUnion: 3,
//     },
//   },
// }
// data.player = {
//   fullName: "Ada",
//   age: 38,
//   lore: `
//     Mother of three. Space captain.
//     Works as a special agent in the crown's military.
//     She received her rank as Marchioness as reward for heroic actions in a battle in some other galaxy.
//     She uses a heavily modified Crown fighter, nicknamed the Goldbird.

//     Her family is stuck on an outback planet plagued by political upheaval, and economic instability. 
//     She is currently stuck in combat duty, unable to fly back or help them.

//     She's baptised, christian for most of her life, but slightly
//     falling out of it.
//   `,
  
//   inventory: [
//     //for things which aren't stored in the ship's cargo storage
//     {
//       name: "Holotape #4864",
//       description: "An old holotape taken at home, approximately 14 years ago."
//     },
//   ],
//   currency: 20, //starting currency
//   ships: [], // all ships you have access to, can direct or pilot yourself
//   currentShip: {} // object reference
// },

data.boosters = {
  boosters: {
    type: "continuous",
  },
  boosters: {
    type: "pulse",
  }
}

data.weapontypes = [
  "missile", 
  "plasma",
  "solid-projectile",
  "laser",
  "deathbeam",
]
Object.freeze(data.weapontypes)