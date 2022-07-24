let data = {}

let data_groups = [
  "weapons",
  "asteroids",
  "locations",
  "location_coords",
  "ships",
  "save_data",
  "projectiles",
]
let data_loaded = 0

function load_data() {
  this.next()
  if(data_loaded === groups.length - 1 ) {
    //assign everything to data {}
  }
}
load_data.next = function() {
  let group = data_groups.shift()
}

data.items = new Map()

{
  let weapons = ["missile_helios"]
  weapons.forEach(item => {
    data.items.set(item, item)
  })
}


data.weapons = {
  "missile_helios": {
    type: "missile",
    damage: {
      contact: 3,
    },
    effects: [
      {
        type: "fire",
        chance: 50
      }
    ]
  }
}


data.asteroids = {
  medium_0: {
    sources: sources.img.asteroids.medium_0,
    mass: 5, 
    health: 5,
    material: "iron",
    hitbox: {
      type: "circle",
      radius: 45
    }
  },
  medium_1: {
    sources: sources.img.asteroids.medium_1,
    mass: 5, 
    health: 5,
    material: "iron",
    hitbox: "asteroid_medium_1"
  },
  small_0: {
    sources: sources.img.asteroids.small_0,
    mass: 5, 
    health: 5,
    material: "iron",
    hitbox: {
      type: "circle",
      radius: 22
    }
  },
  small_1: {
    sources: sources.img.asteroids.small_1,
    mass: 5, 
    health: 5,
    material: "iron",
    hitbox: {
      type: "circle",
      radius: 25
    }
  },
  debris_0: {
    sources: sources.img.asteroids.debris_0,
    mass: 5, 
    health: 5,
    material: "iron",
    hitbox: {
      type: "circle",
      radius: 25
    }
  },
  crimson_station: {
    sources: sources.img.stations.crimson,
    material: "iron",
    mass: 300, 
    health: 5,
    hitbox: "crimson_station",
  },
  crimson_fighter: {
    sources: sources.img.crimson_fighter,
    material: "iron",
    mass: 25, 
    health: 5,
    hitbox: "crimson_fighter_small"
  },
}
data.characters = {
  "Character": {
    full_name: "Character Name",
    age: 25,
    alignment: { //how much they respect each faction 0-10
      crimson: 8,
      alliance: 3,
      the_crown: 4,
      the_hive: 0,
      traders_union: 3,
    },
    qualities: { // 0-10 scale
      //todo - simplify these to the core,
      smart: 10,
      kind: 6,
      cruel: 0,
      ambitious: 3,
      psychopathic: 0,
      open_minded: 4,
      honest: 7,
    },
  },
}
data.player = {
  full_name: "Deborah",
  age: 38,
  lore: `
    Mother of three. Space captain.
    Works as a special agent in the crown's military.
    She received her rank as Marchioness as reward for heroic actions in a battle in some other galaxy.
    She uses a heavily modified Crown fighter, nicknamed the Goldbird.

    Her family is stuck on an outback planet plagued by political upheaval, and economic instability. 
    She is currently stuck in combat duty, unable to fly back or help them.

    She's christian, or at least doesn't mind calling herself that. 
    #professional writing
  `,
  
  inventory: [
    //for things which aren't stored in the ship's cargo storage
    {
      name: "Holotape #4864",
      description: "An old holotape taken at home, approximately 14 years ago."
    },
  ],
  currency: 20, //starting currency
  ships: [], // all ships you have access to, can direct or pilot yourself
  currentShip: {} // object reference
},

data.global = {
  rotation_smoothing: 0.15 //i put this temporarily inside ship
    //todo - figure out if this global or not, it could be very annoying
    // for different ships to have different values, but it might also make it good
    // worth experimenting with - making a a fighter more reactive than a cargo

    //also - total reactor power divided by the ship total weight could affect these stats, 
    //but then, it could really screw with muscle memory and make it impossible to enjoy the game
}


readTextFile("data/location_coordinates.json", function(text) {
  data.location_coords = JSON.parse(text)
    
  data.locations = {
    crown_capital: {
      name: "Crown central system",
      pos: {
        x: data.location_coords["Crown central system"].x, 
        y: data.location_coords["Crown central system"].y
      },
      objects: []
    },
    tauri_b: {
      name: "Tauri B",
      pos: {
        x: data.location_coords["Tauri B"].x, 
        y: data.location_coords["Tauri B"].y
      },
      objects: []
    },
    hive_capital: {
      name: "Hive",
      pos: {
        x: data.location_coords["Hive"].x, 
        y: data.location_coords["Hive"].y
      },
      objects: []
    },
  }
})

readTextFile("data/worldmap_data.json", function(text) {
  let d = JSON.parse(text)
})


data.projectiles = {
  debug_laser: {
    speed: 320,
    sprite: "debug_laser",
    hitbox: new CircleHitbox(8),
    mass: 0.5,
    life: 5000, //time till the projectile either explodes or is destroyed
  },
  missile_helios: {
    sprite: "missile_helios",
    speed: 250,
    hitbox: new CircleHitbox(9),
    mass: 0.5,
    life: 10000, 
  }
}
data.ships = {}
data.ships["needle"] = {
  display_name: "(this can be anything)",
  model: "bluebird_needle",
  sources: sources.img["bluebird_needle"],
  hitbox: "bluebird_needle",
  rotation_speed_base: 110 * PI/180,
  rotation_smoothing: 0.03,
  mass_base: 5,
  weapon_slots: 4,
  hull: {
    level: 10,
    curr: 10,
    level_max: 40,
  },
  supports: {
      brakes: true,
      engine_steering: true,
      engine_braking: true,
      shields: true,
      stealth: true,
      weapons: true,
      cargo: true,
  },
  cargo: {
    capacity: 10,
    items: [
      
    ]
  },
  systems: {
    shields: {
      type: "pulse",
      level: 1,
    },
    reactor: {
      power: 20,
      power_free: 20,
      power_distribution: [
        
      ],
    },
    engines: {
      main: {
        accel: 7,
        max_speed: 400,
        level: 1,
        level_max: 5, //needs to be the same ↓
        power_level_max: 5, //needs to be the same ↑
        power_level: 1,
        onupgrade: {
          accel: 1,
          max_speed: 20
        }
      },
      braking: {  //does this === brakes ??? seems kinda redundant
        installed: true,
        power: 10, //not sure what this number represents
        accel: 4,
      },
      steering: {
        installed: false,
        rotation_speed_bonus: 10 * PI/180, //improves rotation speed by this
        glide_reduction: 0.00,
        level: 1,
        level_max: 4,
        onupgrade: {
          glide_reduction: 0.02,
          rotation_speed_bonus: 10 * PI/180
        },
      }
    },
    brakes: {
      power: 1, //percent of velocity you'll lose every frame * dtf
      power_max: 4,
      auto: true,
    },
    dash: {
      ready: true,
      active: false,
      recharge: 0, //will be recalculated based on reactor power
      power: 1,
    },
    weapons: {
      level: 1,
      level_max: 6, //needs to be the same ↓
      power_level_max: 6, //needs to be the same ↑
      power_level: 1,
      weapons: [
        data.items.get["missile_mk1"]
      ],
    }
  },
},


data.ships["crimson"] = {
  display_name: "(this can be anything)",
  model: "crimson_fighter",
  sources: sources.img["crimson_fighter"],
  hitbox: "crimson_fighter_small",
  rotation_speed_base: 110 * PI/180,
  rotation_smoothing: 0.02,
  mass_base: 2,
  weapon_slots: 2,
  hull: {
    level: 5,
    curr: 5,
    level_max: 20,
  },
  cargo: {
    capacity: 5,
    items: [
      
    ]
  },
  supports: {
      brakes: true,
      engine_steering: true,
      engine_braking: true,
      shields: true,
      stealth: true,
      weapons: true,
      cargo: true,
  },
  systems: {
    shields: {
      type: "pulse",
      level: 1,
    },
    reactor: {
      power: 20,
      power_free: 20,
      power_distribution: [
        //array of components that the reactor is powering on the ship
      ],
    },
    engines: {
      main: {
        accel: 9,
        max_speed: 180,
        level: 1,
        level_max: 5, //needs to be the same ↓
        power: 1,
        upgrade() {
          if(this.level >= this.level_max) return
          this.accel += 2
          this.max_speed += 40
          this.level++
        },
        update() {
          //what if you're not able to partially power the engine,
          //and you have to make a tradeoff when you upgrade it - 
          //meaning that now the engine is better, but it'll always consume
          //more power
        },
        addPower() {
          this.power_level =  Math.max(this.level, this.power_level + 1)
        },
        removePower() {
          this.power_level = Math.min(0, this.power_level - 1)
        },
        onupgrade: {
          accel: 1,
          max_speed: 20
        }
      },
      braking: {  //does this === brakes ??? seems kinda redundant
        installed: true,
        power: 10, //not sure what this number represents
        accel: 4,
      },
      steering: {
        installed: false,
        rotation_speed_bonus: 10 * PI/180, //improves rotation speed by this
        glide_reduction: 0.00,
        level: 1,
        level_max: 4,
        onupgrade: {
          glide_reduction: 0.02,
          rotation_speed_bonus: 10 * PI/180
        },
      }
    },
    brakes: {
      power: 1, //percent of velocity you'll lose every frame * dtf
      power_max: 4,
      auto: true,
    },
    dash: {
      ready: true,
      active: false,
      recharge: 0, //will be recalculated based on reactor power
      power: 1,
    },
    weapons: {
      level: 1,
      level_max: 6, //needs to be the same ↓
      power_level_max: 6, //needs to be the same ↑
      power_level: 1,
      weapons: [
        data.weapons["missile_mk1"]
      ],
    }
  },
}

data.ships["wasp_fighter"] = {
  display_name: "(this can be anything)",
  model: "wasp_fighter",
  sources: sources.img["wasp_fighter"],
  hitbox: "wasp_fighter",
  rotation_speed_base: 120 * PI/180,
  rotation_smoothing: 0.014,
  mass_base: 2,
  weapon_slots: 2,
  hull: {
    level: 7,
    curr: 7,
    level_max: 20,
  },
  cargo: {
    capacity: 5,
    items: [

    ]
  },
  supports: {
      brakes: true,
      engine_steering: true,
      engine_braking: true,
      shields: true,
      stealth: true,
      weapons: true,
      cargo: true,
  },
  systems: {
    shields: {
      type: "pulse",
      level: 1,
    },
    reactor: {
      power: 20,
      power_free: 20,
      power_distribution: [
        //array of components that the reactor is powering on the ship
      ],
    },
    engines: {
      main: {
        accel: 8,
        max_speed: 400,
        level: 1,
        level_max: 5, //needs to be the same ↓
        power: 1,
        onupgrade: {
          accel: 1,
          max_speed: 20
        }
      },
      braking: {  //does this === brakes ??? seems kinda redundant
        installed: true,
        power: 10, //not sure what this number represents
        accel: 4,
      },
      steering: {
        installed: false,
        rotation_speed_bonus: 10 * PI/180, //improves rotation speed by this
        glide_reduction: 0.00,
        level: 1,
        level_max: 4,
        onupgrade: {
          glide_reduction: 0.02,
          rotation_speed_bonus: 10 * PI/180
        },
      }
    },
    brakes: {
      power: 1, //percent of velocity you'll lose every frame * dtf
      power_max: 4,
      auto: true,
    },
    dash: {
      ready: true,
      active: false,
      recharge: 0, //will be recalculated based on reactor power
      power: 1,
    },
    weapons: {
      level: 1,
      level_max: 6, //needs to be the same ↓
      power_level_max: 6, //needs to be the same ↑
      power_level: 1,
      weapons: [
        data.weapons["missile_mk1"]
      ],
    }
  },
}


data.infractructure = { //todo, where to store stuff like stations and other non-ship types of infrastructure
  stations: {
    "crimson": {
      model_name: "crimson placeholder station",
      type: "repair",
      sources: "",
    }
  },
}
data.ship_actions = {
  //jumpout has this nice action pool where ship actions are stored so they are all in one place, probably
  // could be nice, if ships had standardized actions, but i want flexibility in my code so it's not all the same code
  // weapon fire will be mostly localized to the scope of the weapons so they can be used on any ship and behave the same way
}

data.factions = {
  crimson_league: {
    army: {
      ships: [],
      personnel: []
    },
    territories: [] //list of controlled territories
  },
  alliance: {},
  crown: {},
  hive: {},
  traders_union: {},
}

//create a copy of data, so things can be reverted back at any point
let data_default = _.cloneDeep(data)
let d = data

let session = {} //idk, some temporary data about things like playtime, performance statistics, idk, open editors, etc..
let s = session

data.shields = {
  shields: {
    type: "bubble",
    desc: "Generates a permanent shield bubble protecting your craft from hard projectiles. Doesn't work well for lasers",
    level: 1,
    level_max: 2,
    recharge: 500, //ms
    active: false,
  },
  shields: {
    type: "pulse",
    desc: "The mechanism generates a short burst of energy around the craft, diverting any incoming projectiles",
    level: 1,
    level_max: 2,
    recharge: 1000, //ms
    active: false,
  },
  shields: {
    type: "force",
    desc: "prevents your ship from touching neighboring ships by gently pushing you away, this visually manifests as a soft blue glow around the edges of the craft",
  },
  shields: {
    type: "hard-light",
    desc: "blocks everything, even from the inside, impractical to fully shield yourself, because you cannot shoot",
    dispotitions: [
      "front",
      "side",
      "flank",
    ],
    level: 1,
    level_max: 5,
    recharge: 400-1000,
    active: false,
  },
}

data.weapontypes = [
  "missile", 
  "plasma",
  "solid-projectile",
  "laser",
  "deathbeam",
]


data.max_velocity = 1000 //max object velocity
data.invulnerability_window = 1200 //only for player ship
