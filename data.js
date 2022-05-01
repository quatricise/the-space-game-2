//maybe the main data object that is used to instantiate everything
let data = {
  ships: {
    asf100: {
      model_name: "debug_ship",
      sources: sources.img["debug_ship"],
      hitbox: new PolygonHitbox([
        PolygonBuilder.Triangle_right({x: 100, y: 100}, {x: -200, y: 0}, true, false, 0),
        PolygonBuilder.Triangle_right({x: 100, y: 100}, {x: 200, y: 0}, false, false, 0),
      ]),
      inventory: {
        capacity: 50
      },
      rotation_speed_base: 150, //deg per second, the ship class will recalculate this to rad
      accel: 20, //todo, still arbitrary numbers, make it concrete
      max_speed: 500, //px per second

      shields: {
        level: 1,
        recharge: 500, //ms
        active: false,
      },
      reactor: {
        power: 20,
      },
      engines: {
        main: {
          accel: 20,
          max_speed: 500,
          level: 1,
          level_max: 5,
          upgrade() {
            if(this.level >= this.level_max) return // new Info("The engine has reached max level") 
            this.accel += 2
            this.max_speed += 50
          }
        },
        braking: {
          power: 10,
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
    },
  },

  player: {
    inventory: {

    },
    ships: [], // object reference
    currentShip: {} // object reference
  },
  global: {
    rotation_smoothing: 8 // frames basically
  },
}

//create a copy of data, so things can be reverted back at any point
let data_default = _.cloneDeep(data)
let d = data //make it easier to reference

let session = {} //idk, some temporary data about things like playtime, performance statistics, idk, open editors, etc..
let s = session //make it easier to reference
