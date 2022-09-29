// data.ship = {}
// data.ship["needle"] = {
//   displayName: "Goldbird",
//   model: "needle",
//   hitbox: "bluebirdNeedle",
//   rotationSpeedBase: 110 * PI/180,
//   glideReduction: 0.03,
//   baseMass: 18,
//   weaponSlots: [
//     { x: 51.5, y: -47.5 },
//     { x: 51.5, y: 47.5 },
//     { x: -4.5, y: -76.5 },
//     { x: -4.5, y: 74.5 },
//   ],
//   hull: {
//     level: 10,
//     levelMax: 20,
//     curr: 10,
//   },
//   systems: {
//       boosters: true,
//       brakes: true,
//       engineSteering: true,
//       engineBraking: true,
//       shields: true,
//       stealth: true,
//       weapons: true,
//       cargo: true,
//   },
//   cargo: {
//     capacity: 10,
//     items: []
//   },
//   reactor: {
//     power: 20,
//     powerFree: 20,
//     powerMax: 40,
//     powerDistribution: [],
//   },
//   shields: {
//     type: "pulse",
//     level: 1,
//     levelMax: 5,
//     power: 0,
//   },
//   boosters: {
//     type: "continuous",
//     level: 1,
//     levelMax: 5,
//     power: 0,
//     onupgrade: {
//       accel: 0.5,
//     },
//   },
//   engines: {
//     main: {
//       accel: 7,
//       maxSpeed: 400,
//       level: 1,
//       levelMax: 5, //needs to be the same ↓
//       power: 0,
//       onupgrade: {
//         accel: 1,
//         maxSpeed: 20
//       }
//     }, 
//     steering: {
//       rotationSpeedBonus: 10 * PI/180, //improves rotation speed by this
//       glideReduction: 0.00,
//       level: 1,
//       levelMax: 4,
//       power: 0,
//       onupgrade: {
//         glideReduction: 0.02,
//         rotationSpeedBonus: 10 * PI/180
//       },
//     }
//   },
//   brakes: {
//     level: 1,
//     levelMax: 4,
//     power: 0,  
//     auto: true,
//   },
//   dash: {
//     ready: true,
//     active: false,
//     recharge: 0, //will be recalculated based on reactor power
//     power: 1,
//   },
//   weapons: {
//     slots: 4,  
//     power: 0,
//     weapons: [],
//   }
// }

// data.ship["crimson"] = {
//   displayName: "Crimson Fighter Class I",
//   model: "crimsonFighter",
//   hitbox: "crimsonFighterSmall",
//   rotationSpeedBase: 110 * PI/180,
//   glideReduction: 0.02,
//   baseMass: 10,
//   weaponSlots: [
//     { x: 51.5, y: -47.5 },
//     { x: 51.5, y: 47.5 },
//   ],
//   hull: {
//     level: 5,
//     levelMax: 20,
//     curr: 5,
//   },
//   cargo: {
//     capacity: 5,
//     items: []
//   },
//   systems: {
//     boosters: true,
//     brakes: true,
//     engineSteering: true,
//     engineBraking: true,
//     shields: true,
//     stealth: true,
//     weapons: true,
//     cargo: true,
//   },
//   reactor: {
//     power: 20,
//     powerFree: 20,
//     powerMax: 40,
//     powerDistribution: [],
//   },
//     shields: {
//       type: "pulse",
//       level: 1,
//       levelMax: 5,
//       power: 0,
//     },
//     boosters: {
//       type: "continuous",
//       level: 1,
//       levelMax: 5,
//       power: 0,
//       onupgrade: {
//         accel: 0.5,
//       },
//     },
//     engines: {
//       main: {
//         accel: 9,
//         maxSpeed: 180,
//         level: 1,
//         levelMax: 5, //needs to be the same ↓
//         power: 0,
//         onupgrade: {
//           accel: 1,
//           maxSpeed: 20
//         }
//       },    
//       steering: {        
//         rotationSpeedBonus: 10 * PI/180, //improves rotation speed by this
//         glideReduction: 0.00,
//         level: 1,
//         levelMax: 4,
//         power: 0,
//         onupgrade: {
//           glideReduction: 0.02,
//           rotationSpeedBonus: 10 * PI/180
//         },
//       }
//     },
//     brakes: {
//       level: 1,
//       levelMax: 4,
//       power: 0,  
//       auto: true,
//     },
//     dash: {
//       ready: true,
//       active: false,
//       recharge: 0, //will be recalculated based on reactor power
//       power: 1,
//     },
//     weapons: {
//       slots: 4,  
//       power: 0,
//       weapons: [],
//     }
// }

// data.ship["waspFighter"] = {
//   displayName: "Wasp Fighter",
//   model: "waspFighter",
//   hitbox: "waspFighter",
//   rotationSpeedBase: 120 * PI/180,
//   glideReduction: 0.028,
//   baseMass: 15,
//   weaponSlots: [
//     { x: 51.5, y: -47.5 },
//     { x: 51.5, y: 47.5 },
//   ],
//   hull: {
//     level: 7,
//     levelMax: 20,
//     curr: 7,
//   },
//   cargo: {
//     capacity: 5,
//     items: []
//   },
//   systems: {
//     boosters: true,
//     brakes: true,
//     engineSteering: true,
//     engineBraking: true,
//     shields: true,
//     stealth: true,
//     weapons: true,
//     cargo: true,
//   },
//   reactor: {
//     power: 20,
//     powerFree: 20,
//     powerMax: 40,
//     powerDistribution: [],
//   },
//   shields: {
//     type: "pulse",
//     level: 1,
//     levelMax: 5,
//     power: 0,
//   },
//   boosters: {
//     type: "continuous",
//     level: 1,
//     levelMax: 5,
//     power: 0,
//     onupgrade: {
//       accel: 0.5,
//     },
//   },
//   engines: {
//     main: {
//       accel: 8,
//       maxSpeed: 520,
//       level: 1,
//       levelMax: 5, //needs to be the same ↓
//       power: 0,
//       onupgrade: {
//         accel: 1,
//         maxSpeed: 20
//       }
//     },    
//     steering: {        
//       rotationSpeedBonus: 10 * PI/180, //improves rotation speed by this
//       glideReduction: 0.00,
//       level: 1,
//       levelMax: 4,
//       power: 0,
//       onupgrade: {
//         glideReduction: 0.02,
//         rotationSpeedBonus: 10 * PI/180
//       },
//     }
//   },
//   brakes: {
//     level: 1,
//     levelMax: 4,
//     power: 0,  
//     auto: true,
//   },
//   dash: {
//     ready: true,
//     active: false,
//     recharge: 0, //will be recalculated based on reactor power
//     power: 1,
//   },
//   weapons: {
//     slots: 4,  
//     power: 0,
//     weapons: [],
//   }
// }

data.ship["theGrandMoth"] = {
  displayName: "The Grand Moth",
  model: "theGrandMoth",
  hitbox: "theGrandMoth",
  rotationSpeedBase: 100 * PI/180,
  glideReduction: 0.085,
  baseMass: 20,
  weaponSlots: [
    { x: 51.5, y: -47.5 },
    { x: 51.5, y: 47.5 },
    { x: -4.5, y: -76.5 },
    { x: -4.5, y: 74.5 },
  ],
  systems: {
    boosters: true,
    brakes: true,
    engineSteering: true,
    engineBraking: true,
    shields: true,
    stealth: true,
    weapons: true,
    cargo: true,
  },
  hull: {
    level: 12,
    levelMax: 20,
    curr: 12,
  },
  cargo: {
    capacity: 5,
    items: []
  },
  reactor: {
    power: 20,
    powerFree: 20,
    powerMax: 40,
    powerDistribution: [],
  },
  shields: {
    type: "pulse",
    level: 1,
    levelMax: 5,
    power: 0,
  },
  boosters: {
    type: "continuous",
    level: 1,
    levelMax: 5,
    power: 0,
    onupgrade: {
      accel: 0.5,
    },
  },
  engineSteering: {
    rotationSpeedBonus: 10 * PI/180, //improves rotation speed by this
    glideReduction: 0.01,
    level: 1,
    levelMax: 4,
    power: 0,
    onupgrade: {
      glideReduction: 0.01,
      rotationSpeedBonus: 10 * PI/180
    },
  },
  engineMain: {
    accel: 8,
    maxSpeed: 420,
    level: 1,
    levelMax: 5,
    power: 0,
    onupgrade: {
      accel: 1,
      maxSpeed: 20
    }
  },
  brakes: {
    level: 3,
    levelMax: 4,
    power: 0,  
    auto: true,
  },
  dash: {
    ready: true,
    active: false,
    recharge: 0, //will be recalculated based on reactor power
    power: 1,
  },
  weapons: {
    slots: 4,  
    power: 0,
    weapons: [],
  }
}
