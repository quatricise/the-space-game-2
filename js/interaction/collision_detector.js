class CollisionDetector {
  static detect(world) {
    let events = []
    let tested = []
    world.game_objects.rigid.forEach(obj => {
      if(!obj.can_collide) return
      let others = Collision.broadphase(world, obj)
      others.forEach(other => {
        if(!other.can_collide) return
        if(this.owner_with_projectile_collision(obj, other)) return
        if(tested.findChild(other)) return
        if(Collision.auto(obj.hitbox, other.hitbox)) 
        {
          if((obj instanceof Interactable) + (other instanceof Interactable) === 1)
          {
            events.push(new TriggerEvent(obj, other))
          }
          else 
          {
            events.push(new CollisionEvent(obj, other))
          }
        }
      })
      tested.push(obj)
    })
    CollisionSolver.solve(world, events, world.previous_collisions)
    world.previous_collisions = events
  }
  static owner_with_projectile_collision(obj, other) {
    return (other.owner === obj || obj.owner === other)
  }
}