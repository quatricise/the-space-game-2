class StateMachine {
  constructor(gameObject) {
    this.gameObject = gameObject
    this.states = []
  }
  addState(state) {
    state.stateMachine = this
    state.gameObject = this.gameObject
    
    this.states.push(state)
    this.current || this.setState(state)
  }
  removeState(state) {
    state.stateMachine = null
    this.states.remove(state)
    this.setState(this.states.last())
  }
  setState(state) {
    this.current = state
  }
  setStateByName(name) {
    let state = this.states.find(s => s.name === name)
    if(state) this.setState(state)
  }
  update() {
    this.current.update()
  }
  destroy() {
    delete this.gameObject
  }
}