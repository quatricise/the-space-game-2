let data = {
  weapons: {
    missile_mk1: {
      type: "missile",
      damage: 3,
      speed: 200, // px/s
      target_locking: true
    },
    burst_laser: {
      type: "energy/burst",
      damage: 1,
      charges: 0,
      charges_max: 4,
      projectile_speed: 400, // px/s
      reload_speed: 750,
      firerate: 4, // rounds/s
    },
    missile_helios: {
      type: "missile",
      damage: 3,
      speed: 300, // px/s
      target_locking: true,
      effects: [
        {
          type: "fire",
          chance: 80,
        }
      ]
    }
  },

  entities: {
    asteroids: {
      medium_0: {
        sources: sources.img.asteroids.medium_0,
        mass: 5, //in kilotons
        material: "iron",
        hitbox: new CircleHitbox(45)
      },
      medium_1: {
        sources: sources.img.asteroids.medium_1,
        mass: 5, //in kilotons
        material: "iron",
        hitbox: new CircleHitbox(45)
      },
      crimson_station: {
        sources: sources.img.stations.crimson,
        mass: 300, //in kilotons
        hitbox: "crimson_station",
      },
      crimson_fighter: {
        sources: sources.img.crimson_fighter,
        mass: 300, //in kilotons
        // hitbox: new PolygonHitbox([
        //   PolygonBuilder.Square(50, {x: 0, y: 0}),
        // ])
        hitbox: "crimson_fighter_small"
      },
    },
  },

  characters: {
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
  },

  player: {
    character: {
      full_name: "Deborah",
      age: 38,
      lore: `
        Mother of three. Space captain.
        Works as a special agent in the crown's military.
        She received her rank as Marchioness as reward for heroic actions in a battle in some other galaxy.
        She uses a heavily modified Crown fighter, nicknamed the Goldbird.

        Her family is stuck on an outback planet plagued by political upheaval, economic instability and
        other social problems. She is currently stuck in combat duty, unable to fly back or help them.

        She is christian, or at least doesn't mind calling herself that. She's become quite numb
        to the constant doubts of her faith. 
        #professional writing
      `,
    },
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

  scenes: {
    tauri_b: {

    },
  },

  global: {
    rotation_smoothing: 0.08 //i put this temporarily inside ship
     //todo - figure out if this global or not, it could be very annoying
     // for different ships to have different values, but it might also make it good
     // worth experimenting with - making a a fighter more reactive than a cargo

     //also - total reactor power divided by the ship total weight could affect these stats, 
     //but then, it could really screw with muscle memory and make it impossible to enjoy the game
  },
}

data.projectiles = {
  debug_laser: {
    speed: 100,
    hitbox: new CircleHitbox(8),
    life_max: 5000, //time till the projectile either explodes or is destroyed
  }
}

data.locations = {
  crown_capital: {
    pos: new Vector(
      location_coords.crown_capital[0], 
      location_coords.crown_capital[1]
    ),
    objects: {
      ships: [],
      stations: [],  
    },
  },
  tauri_b: {
    pos: new Vector(
      location_coords.tauri_b[0], 
      location_coords.tauri_b[1]
    ),
    objects: {
      ships: [],
      stations: [],  
    },
  },
}

data.ships = {
  crimson_fighter: {
    model: "crimson_fighter",
    sources: sources.img["bluebird_needle"],
    hitbox: "bluebird_needle",
    inventory: {
      items: [],
      capacity: 50,
    },
    rotation_speed_base: 85 * PI/180,
    rotation_smoothing: 0.08,
    hull: {
      level: 8,
      points: 8,
      level_max: 40,
      repair() {
        if(this.points >= this.level) return
        points++
      },
      upgrade() {
        if(this.level >= this.level_max) return
        this.level += 1
        this.points += 1
      },
    },
    supports_systems: {
        brakes: true,
        engine_steering: true,
        engine_braking: true,
        shields: true,
        stealth: true,
        weapons: true,
    },
    systems: {
      shields: {
        type: "bubble",
        desc: "Generates a permanent shield bubble fully protecting your craft from incoming projectiles. It's only as strong as the power you divert to this system.",
        level: 1,
        level_max: 2,
        recharge: 500, //ms
        active: false,
      },
      shields_type2: {
        type: "energy blast",
        desc: "The mechanism generates a short burst of energy around the craft, diverting any incoming projectiles",
        level: 1,
        level_max: 2,
        recharge: 1000, //ms
        active: false,
      },
      shields_type3: {
        type: "force-field",
        desc: "prevents your ship from touching neighboring ships by gently pushing you away, this visually manifests as a soft blue glow around the edges of the craft",
      },
      shields_prototype: {
        dispotition_1: "side",
        dispotition_2: "flank",
        dispotition_3: "full",
        type_1: "force-field",
        type_2: "bubble",
        type_3: "energy-blast",
        level: 1,
        level_max: 5,
        recharge: 400-1000,
        active: false,
      },
      reactor: {
        power: 20,
        power_free: 20,
        power_distribution: [
          //array of components that the reactor is powering on the ship
        ],
        update() {
          //idk
        },
      },
      engines: {
        //todo, since this is getting more complex
        //make an engine class i guess
        //or some component class which will have
        //default methods like upgrade, power, unpower
        //stuff like that
        //more things will be instances of component class
        //like: engine, reactor, shields, etc.
        main: {
          accel: 8,
          max_speed: 250,
          level: 1,
          level_max: 5, //needs to be the same ↓
          power_level_max: 5, //needs to be the same ↑
          power_level: 1,
          upgrade() {
            if(this.level >= this.level_max) return // new Info("The engine has reached max level") 
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
        },
        braking: {  //does this === brakes ??? seems kinda redundant
          installed: true,
          power: 10, //not sure what this number represents
        },
        steering: {
          installed: false,
          rotation_speed_bonus: 10 * PI/180, //improves rotation speed by this
          glide_reduction: 0.00,
          level: 1,
          level_max: 4,
          upgrade() {
            if(this.level >= this.level_max) return
            this.rotation_speed_bonus += 10 * PI/180
            this.glide_reduction += 0.02
            this.level++
          },
        }
      },
      brakes: {
        power: 1, //percent of velocity you'll lose every frame * dtf
        power_max: 4,
        auto: true,
        upgrade() {
          if(this.power >= this.power_max) return
          this.power += 1
        },
        toggleAuto() {
          this.auto = !this.auto
        }
      },
      dash: {
        ready: true,
        active: false,
        recharge: 0 //will be recalculated based on reactor power
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
