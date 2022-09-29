class CollisionSolver {
  static solve(world, events, previousEvents) {
    events.forEach(event => {
      if(event instanceof CollisionEvent) this.solveCollision(world, event, previousEvents)
      if(event instanceof TriggerEvent) this.solveTrigger(world, event, previousEvents)
    })
  }
  static solveCollision(world, event, previousEvents) {
      let obj1 = event.obj1
      let obj2 = event.obj2
      this.distributeVelocity(obj1, obj2)
      if(obj1 instanceof Projectile || obj2 instanceof Projectile) 
      {
        this.solveProjectileCollision(obj1, obj2)
      }
      if(this.isCollisionContinuous(event, previousEvents)) 
      {
        //hamper interlocking objects' rotation velocities
        obj1.rotationVelocity *= 0.8
        obj2.rotationVelocity *= 0.8
      }
      else
      {
       this.affectRotationByImpact(obj1, obj2)
      }
      //check validity of old clusters and destroy ones that no longer apply
      // world.gameObjects.cluster.forEach(cluster => {
      //   let allInside = false
      //   cluster.objects.forEach(obj => {
      //     if(
      //       events.find(event => {
      //         event.obj1 === obj
      //       })
      //     ) {
            
      //     }
      //   })
      //   //if destroy
      //   // world.removeGameObject(cluster)
      //   // cluster.destroy()
      // })

      // // //create clusters
      // let pos = Vector.avg(obj1.pos, obj2.pos)
      // let vel = Vector.avg(obj1.vel, obj2.vel)
      // let rotationVelocity = angleDifference * vel.length() * 0.001
      // let cluster = GameObject.create("cluster", "cluster", {pos: pos, vel:  vel, rotation: 0, rotationVelocity: rotationVelocity}, {world: world})
      // cluster.add(obj1, obj2)
  }
  static solveProjectileCollision(obj1, obj2) {
    if(obj1 instanceof Projectile && obj2 instanceof Projectile) return
    let [projectile, other] = [obj1, obj2]
    if(!(projectile instanceof Projectile)) [projectile, other] = [other, projectile]
  }
  static solveTrigger(world, event, previousEvents) {
    let [interactable, triggerer] = [event.obj1, event.obj2]
    if(event.obj2 instanceof Interactable) 
    {
      [interactable, triggerer] = [triggerer, interactable]
    }
    interactable.trigger(triggerer)
  }
  static distributeVelocity(obj1, obj2) {
    let mass1 = 1
    let mass2 = 1
    let momentum1 = obj1.vel.clone().mult(mass1)
    let momentum2 = obj2.vel.clone().mult(mass2)
    obj1.vel.set(0)
    obj2.vel.set(0)
    let totalMomentum = momentum1.clone().add(momentum2)
    obj1.vel.set(totalMomentum.x / 2, totalMomentum.y / 2).mult(mass1)
    obj2.vel.set(totalMomentum.x / 2, totalMomentum.y / 2).mult(mass2)
  }
  static affectRotationByImpact(obj1, obj2) {
    let angleDifference = 0
    let angleBetweenObjects = obj1.pos.angleTo(obj2.pos)
    let vel = obj1.vel.clone().add(obj2.vel)
    let velAngle = vel.angle()
    angleDifference = angleBetweenObjects - velAngle
    obj1.rotationVelocity += angleDifference * obj1.vel.length() * 0.001
    obj2.rotationVelocity -= angleDifference * obj2.vel.length() * 0.001
  }
  static isCollisionContinuous(event, previousEvents) {
    return previousEvents.find(
      ev => 
      (ev.obj1 === event.obj1 && ev.obj2 === event.obj2)
      || 
      (ev.obj2 === event.obj2 && ev.obj1 === event.obj1)
      )
  }
}