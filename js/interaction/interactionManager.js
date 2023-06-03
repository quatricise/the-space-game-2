class InteractionManager {
  constructor() {
    this.interactions = []
    this.currentInteraction = null
  }
  createInteraction() {
    let interaction = new Interaction()
    if(interaction.type === "one of the types that display shit in the UI")
      interaction.createHTML()
  }
}