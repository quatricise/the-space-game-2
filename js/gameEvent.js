class GameEvent {
  
  constructor(type, ...params) {
    this.type = type
    for(let key in params)
      this[key] = params[key]
  }

  static create(type, params = {}) {
    let event = new GameEvent(type, params)

    /* 
    go through some potential handlers to process the event 
    the event isn't referenced anywhere to allow GC to devour the related data
    */
   this.handlers.forEach(handler => {
    if(handler.eventType === event.type || handler.eventType === "*")
      handler.function(event)
   })
  }

  static attachHandler(handler = {eventType: "destroyGameObject", function: () => {}}) {
    this.handlers.push(handler)
  }

  static handlers = []
}