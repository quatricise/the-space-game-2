let data = {}

data.weaponTypes = {
  missile: {
    codeColor: "#dba03b"
  },
  plasma: {
    codeColor: "#3cb329"
  },
  solidProjectile: {
    codeColor: "#9e9e9e"
  },
  laser: {
    codeColor: "#da291f"
  },
  deathbeam: {
    codeColor: "#857eb8"
  },
}

data.shieldTypes = [
  "bubble",
  "pulse",
  "force",
  "hardLight",
]

data.shieldTemplates = [
  {
    type: "forceField",
    level: 1,
    levelMax: 5,
    power: 0,
    shieldData: {
      strength: 60,
      effectiveDistance: 60
    }
  },
  {
    type: "hardLight",
    level: 1,
    levelMax: 5,
    power: 0,
    shieldData: {
      disposition: "flank",
      distance: 250,
    }
  },
  {
    type: "pulse",
    level: 1,
    levelMax: 5,
    power: 0,
    shieldData: {
      distance: 250,
      pulseStrength: 400,
      arcLength: PI/2, 
      rechargeTimeMS: 1500,
    }
  },
]

data.starTypes = {
  redDwarf: {
    displayName: "Red Dwarf",
    hexColor: "#A81411",
    description: "A small star at the end of its lifetime, it emits barely enough light to support life on it's surrounding planets."
  },
  mainSequenceGType: {
    displayName: "Main sequence G-Type star",
    hexColor: "#FFF2BD",
    description: "A regular sized star, similar to Earth's sun. It's one of the most common star types."
  },
  mainSequenceBType: {
    displayName: "Main sequence B-Type star",
    hexColor: "#48A0FF",
    description: "Rather small star, emitting very luminous blue light."
  },
  neutronStar: {
    displayName: "Neutron Star",
    hexColor: "#99E0FF",
    description: "Tiny in size, but extremely dense, made up almost exclusively of tightly packed neutrons. It emits light blue color."
  },
}

data.ability = [
  "transferItems",
  "transferCurrency",
  "travel", //can exit current vehicle && travel to different orbits or systems
  "controlShip",
  "talk",
  "command", //can be followed by others on a battlefield
]

data.jobTitle = {
  "player": {
    ability: [ "transferItems", "transferCurrency", "travel", "controlShip", "talk", "command" ]
  },
  "captain": {
    ability: [ "transferItems", "transferCurrency", "travel", "controlShip", "talk", "command" ]
  },
  "crewman": {
    ability: [ "travel", "talk", ]
  },
  "merchant": {
    ability: [ "transferItems", "transferCurrency", "travel", "controlShip" ]
  },
  "communicator": {
    ability: [ "transferCurrency", "talk", "command" ]
  },
  "king": {
    ability: [ "transferItems", "transferCurrency", "travel", "controlShip", "talk", "command" ]
  },
  "princess": {
    ability: [ "transferItems", "transferCurrency", "travel", "controlShip", "talk", "command" ]
  },
}

data.faction = {
  crimsonLeague: {
    ships: [],
    personnel: [],
    territories: [
      //...list of locations
    ],
  },
}


data.pathfinding = {
  projection: {
    iterations: 14,
    timestretch: 12, //used to compute values further in time, each iteration takes this many frames, therefore allowing you to compute many seconds ahead
  }
}

data.maxObjectVelocity = 1200
data.inertia = 0.998 //multiplies velocity of all objects on per-frame basis, with a few exceptions; I might remove this feature
data.detectCollisionWithinThisFastDistanceOfPlayer = 2000
data.updateObjectsWithinThisFastDistanceOfPlayer = 2000
data.npcLineOfSightDistance = 2200