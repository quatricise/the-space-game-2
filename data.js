//maybe the main data object that is used to instantiate everything
let data = {
  ships: {
    asf100: {
      model_name: "A-SF100",
      sources: sources.img["A-SF100"],
      hitbox: new PolygonHitbox([
        PolygonBuilder.triangle_right({x: 100, y: 50}, {x: 0, y: 200}, true, false, 0),
        PolygonBuilder.triangle_right({x: 100, y: 50}, {x: 200, y: 200}, false, false, 0),
      ]),
      inventory: {
        capacity: 50
      },
      rotation_speed: 210,
      max_speed: 50 //todo, still arbitrary numbers, make it concrete
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



  player: {
    inventory: {

    },
    ships: [], // object reference
    currentShip: {} // object reference
  },
}

//create a copy of data, so things can be reverted back at any point
let data_default = _.cloneDeep(data)
let d = data //make it easier to reference

let session = {} //idk, some temporary data about things like playtime, performance statistics, idk, open editors, etc..
let s = session //make it easier to reference
