//maybe the main data object that is used to instantiate everything
let data = {
  ships: {
    asf100: {
      model_name: "debug_ship",
      sources: sources.img["debug_ship"],
      // hitbox: new PolygonHitbox([
      //   PolygonBuilder.Triangle_right({x: 100, y: 100}, {x: -200, y: 0}, true, false, 0),
      //   PolygonBuilder.Triangle_right({x: 100, y: 100}, {x: 200, y: 0}, false, false, 0),
      // ]),
      hitbox: new PolygonHitbox([
        PolygonBuilder.Rectangle(220, 150, {x: -110, y: -75})
      ]),
      inventory: {
        capacity: 50
      },
      rotation_speed_base: 85, //deg per second, the ship class will recalculate this to rad
      accel: 20, //todo, still arbitrary numbers, make it concrete
      max_speed: 250, //px per second

      shields: {
        type: "bubble",
        level: 1,
        recharge: 500, //ms
        active: false,
      },
      shields_type2: {
        type: "energy blast",
        desc: "The mechanism generates a short burst of energy around the craft, diverting any incoming projectiles",
        level: 1,
        recharge: 1000, //ms
        active: false,
      },
      reactor: {
        power: 20,
      },
      engines: {
        main: {
          accel: 20,
          max_speed: 250,
          level: 1,
          level_max: 5,
          upgrade() {
            if(this.level >= this.level_max) return // new Info("The engine has reached max level") 
            this.accel += 2
            this.max_speed += 50
          }
        },
        braking: {
          power: 10, //not sure what this number represents
          installed: true,
        },
        steering: {
          rotation_speed_bonus: 25, //improves rotation speed by this number; does nothing else
          installed: false,
        }
      },
      brakes: {
        power: 2, //again, arbitrary number
        auto: true,
      },
      dash: {
        ready: true,
        active: false,
        recharge: 0 //will be recalculated based on reactor power
      }
    },
  }, 

  infrastructure: { //todo, where to store stuff like stations and other non-ship types of infrastructure
    stations: {
      "crimson": {
        model_name: "crimson placeholder station",
        type: "repair",
        sources: "",
      }
    },
  },  
  ship_actions: {
    //jumpout has this nice action pool where ship actions are stored so they are all in one place, probably
    // could be nice, if ships had standardized actions, but i want flexibility in my code so it's not all the same code
    // weapon fire will be mostly localized to the scope of the weapons so they can be used on any ship and behave the same way
  },



  weapons: {
    missile_mk1: {
      ammo_type: "missile",
      damage: 3,
      speed: 200, //px/s
      target_locking: false
    },
  },



  locations: {
    crown_capital: {
      objects: {
        ships: [],
        stations: [],  
      },
      dialogue: [
        {
          trigger: "some location or event",
          dialogue_tree: dialogue.location1 //dialogue reference
        }
      ]
    }
  },

  entities: {
    asteroids: {
      medium_0: {
        sources: sources.img.asteroids.medium_0,
        mass: 5, //in kilotons
        hitbox: new CircleHitbox(45)
      },
      medium_1: {
        sources: sources.img.asteroids.medium_1,
        mass: 5, //in kilotons
        hitbox: new CircleHitbox(45)
      },
      crimson_station: {
        sources: sources.img.stations.crimson,
        mass: 300, //in kilotons
        hitbox: new CircleHitbox(240)
      },
      crimson_fighter: {
        sources: sources.img.crimson_fighter,
        mass: 300, //in kilotons
        hitbox: new CircleHitbox(120)
      },
    },
  },

  player: {
    inventory: {

    },
    ships: [], // object reference
    currentShip: {} // object reference
  },
  global: {
    rotation_smoothing: 0.08
     //todo - figure out if this global or not, it could be very annoying
     // for different ships to have different values, but it might also make it good
     // worth experimenting with - making a a fighter more reactive than a cargo

     //also - total reactor power divided by the ship total weight could affect these stats, 
     //but then, it could really screw with muscle memory and make it impossible to enjoy the game
  },
}

//create a copy of data, so things can be reverted back at any point
let data_default = _.cloneDeep(data)
let d = data //make it easier to reference

let session = {} //idk, some temporary data about things like playtime, performance statistics, idk, open editors, etc..
let s = session //make it easier to reference
