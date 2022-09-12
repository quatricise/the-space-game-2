class CollisionSolver {
  static solve(world, events, previous_events) {
    events.forEach(event => {
      if(event instanceof CollisionEvent) this.solve_collision(world, event, previous_events)
      if(event instanceof TriggerEvent) this.solve_trigger(world, event, previous_events)
    })
  }
  static solve_collision(world, event, previous_events) {
      let obj1 = event.obj1
      let obj2 = event.obj2
      this.distribute_velocity(obj1, obj2)
      if(obj1 instanceof Projectile || obj2 instanceof Projectile) 
      {
        this.solve_projectile_collision(obj1, obj2)
      }
      if(this.is_collision_continuous(event, previous_events)) 
      {
        //hamper interlocking objects' rotation velocities
        obj1.rotation_velocity *= 0.8
        obj2.rotation_velocity *= 0.8
      }
      else
      {
       this.affect_rotation_by_impact(obj1, obj2)
      }
      //check validity of old clusters and destroy ones that no longer apply
      // world.game_objects.cluster.forEach(cluster => {
      //   let all_inside = false
      //   cluster.objects.forEach(obj => {
      //     if(
      //       events.find(event => {
      //         event.obj1 === obj
      //       })
      //     ) {
            
      //     }
      //   })
      //   //if destroy
      //   // world.remove_game_object(cluster)
      //   // cluster.destroy()
      // })

      // // //create clusters
      // let pos = Vector.avg(obj1.pos, obj2.pos)
      // let vel = Vector.avg(obj1.vel, obj2.vel)
      // let rotation_velocity = angle_difference * vel.length() * 0.001
      // let cluster = GameObject.create("cluster", "cluster", {pos: pos, vel:  vel, rotation: 0, rotation_velocity: rotation_velocity}, {world: world})
      // cluster.add(obj1, obj2)
  }
  static solve_projectile_collision(obj1, obj2) {
    if(obj1 instanceof Projectile && obj2 instanceof Projectile) return
    let [projectile, other] = [obj1, obj2]
    if(!(projectile instanceof Projectile)) [projectile, other] = [other, projectile]
  }
  static solve_trigger(world, event, previous_events) {
    let [interactable, triggerer] = [event.obj1, event.obj2]
    if(event.obj2 instanceof Interactable) 
    {
      [interactable, triggerer] = [triggerer, interactable]
    }
    interactable.trigger(triggerer)
  }
  static distribute_velocity(obj1, obj2) {
    let mass1 = 1
    let mass2 = 1
    let momentum1 = obj1.vel.clone().mult(mass1)
    let momentum2 = obj2.vel.clone().mult(mass2)
    obj1.vel.set(0)
    obj2.vel.set(0)
    let total_momentum = momentum1.clone().add(momentum2)
    obj1.vel.set(total_momentum.x / 2, total_momentum.y / 2).mult(mass1)
    obj2.vel.set(total_momentum.x / 2, total_momentum.y / 2).mult(mass2)
  }
  static affect_rotation_by_impact(obj1, obj2) {
    let angle_difference = 0
    let angle_between_objects = obj1.pos.angleTo(obj2.pos)
    let vel = obj1.vel.clone().add(obj2.vel)
    let vel_angle = vel.angle()
    angle_difference = angle_between_objects - vel_angle
    obj1.rotation_velocity += angle_difference * obj1.vel.length() * 0.001
    obj2.rotation_velocity -= angle_difference * obj2.vel.length() * 0.001
  }
  static is_collision_continuous(event, previous_events) {
    return previous_events.find(
      ev => 
      (ev.obj1 === event.obj1 && ev.obj2 === event.obj2)
      || 
      (ev.obj2 === event.obj2 && ev.obj1 === event.obj1)
      )
  }
}