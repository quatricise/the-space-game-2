class CollisionDetector {
  static detect(world) {
    let events = []
    let tested = []
    world.gameObjects.rigid.forEach(obj => {
      if(!obj.canCollide) 
        return
      let others = Collision.broadphase(world, obj)
      others.forEach(other => {
        if(!other.canCollide) 
          return
        if(this.ownerWithProjectileCollision(obj, other)) 
          return
        if(tested.findChild(other)) 
          return
        if(Collision.auto(obj.hitbox, other.hitbox)) 
        {
          if((obj instanceof Interactable) + (other instanceof Interactable) === 1)
            events.push(new TriggerEvent(obj, other))
          else
            events.push(new CollisionEvent(obj, other))
        }
      })
      tested.push(obj)
    })
    CollisionSolver.solve(world, events, world.previousCollisions)
    world.previousCollisions = events
  }
  static ownerWithProjectileCollision(obj, other) {
    return (other.owner === obj || obj.owner === other)
  }
}