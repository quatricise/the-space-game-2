class DialogueEvent {
  constructor(priority = "medium", dialogue_tree) {
    this.priority = priority
    interaction_sequencer.add_to_queue(this)
  }
}

class InteractionSequencer {
  constructor() {
    this.queue = [] 
  }
}

class DialogueSequencer {
  constructor() {
    this.dialogue = []
    this.curr = {}
  }
  step() {
    //go to next node in sequence
  }
}

const interaction_sequencer = new InteractionSequencer()
const dialogue_sequencer = new DialogueSequencer()

