//maybe the main data object that is used to instantiate everything
let data = {
  ships: {
    starting_ship: {
      sprites: {
        //default: ???
      },
      hitbox: {} //some standardized hitbox structure
    }
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
          dialogue_tree: data.dialogue.location1 //dialogue reference
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
  dialogue: {
    location1: {},
    location2: {},
    location3: {},
  }
}
//create a copy of data, so things can be reverted back at any point
let data_default = _.cloneDeep(data)
let d = data //make it easier to reference

let session = {} //idk, some temporary data about things like playtime, performance statistics, idk, open editors, etc..
let s = session //make it easier to reference
