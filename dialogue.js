class DialogueTree {
  constructor(nodes) {
    this.nodes = nodes
  }
}


//a way to store dialogue
let dialogue = {
  "captain confronts the crimson league leader": {
    characters: [
      data.characters["Character Name"]
    ],
    nodes: {
      "entry": {
        variants: [
          {
            condition: "default",
            text: ``
          },
        ]
      },
      "So what do you plan to do with amogus": {
        variants: [
          {
            condition: "default",
            text: ``
          },
        ]
      },
    }
  }
}


// priority
// low => can be canceled or overridden by a new low priority event
// medium => can be canceled, but also blocks unimportant events while medium are happening
// high => cannot be canceled, must be finished the proper way


//interruption mode - you can leave dialogue? 

//no, i don't like this idea, the only way you can leave a dialogue is through a dedicated "end transmission"
//button inside the dialogue menu
// this will end the transmission and depending on your position on the tree, might initiate an action
//mostly negative, and it hampers your reputation
let dialogues = []

class DialogueEvent {
  constructor(priority = "medium", dialogue_tree) {
    this.priority = priority
    //okay i need to somehow structure dialogue differently depending on whether you are
    //asking a question or you're answering a question or reacting to a prompt
    this.dialogue_tree = [
      {
        is_entry: true,
        type: "player-asking",
        player_text: [
          {
            default: true,
            id: 1,
            text: "Hello there, I would like to purchase a burger, please.",
            requirements: []
          },
          {
            default: false,
            id: 2,
            text: "I know you sell burgers, but I'm not hungry",
            requirements: [
              "player.hasEaten",
            ]
          },
        ],
        responses: [
          {
            default: true,
            text: "",
            requirements: [],
            onfinish: DialogueTools.openDialogue("dialogue")
          },
          {
            default: false,
            text: "",
            requirements: [],
            onfinish: DialogueTools.openDialogue("dialogue")
          },
        ]
      }
    ]
    dialogues.push(this)
  }
}

class InteractionSequencer {
  constructor() {
    
  }
}

class DialogueSequencer {
  constructor() {
    
  }
}

const interaction_sequencer = new InteractionSequencer()
const dialogue_sequencer = new DialogueSequencer()

//so, a blackboard? 

//content pipeline - write everything in code or like, have text documents loaded via some API?

//then it would be cool to have some simple tool generate syntax like 
//name of conversation, character speaking, their lines, list of possible responses

//so the dialogue with the highest number of specific requirements from any given set of options
//will be triggered

//each "fact" will have an importance rating, and it will override any number or at least
//an equal number of less important facts

//like if idk, Deborah knows that you plan to blow up a storage unit outside Tauos III, 
// she will talk about that, instead of talking about other stuff like what are you doing here

let tree_preview = (conversation) => {
  //construct a visual tree based on any dialogue
}


//valve approach
//the higher the number of criteria for any given rule -> the more specific it is, 
// therefore if you have to pick from a series of possible rules, pick the one with the most
// criteria in it

//characters can send events to each other, containing some information, using some kind of premise
//fullfilling - one character stops speaking, sends an event to another character, that character is speaking

//or i could have a "conversation" object, which can contain characters, and if a character is present
//in a conversation (would just be a comm channel, so this is easy to tell), they receive all the information
//shared there and add it to their own database of facts


//it would be cool to have a way for characters to terminate their speech or break out of a long
//monologue, if for example, you decide you wanna kill them and fire a volley at their ship, 


function queryWorld() {
  //idk, some function that queries the state of the world and retrieves a list of facts (a 'query')
}