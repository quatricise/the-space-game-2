class Collision {
  //#region detect
  static testedObjects = []
  static detect(world) {
    if(world === game && !player.ship) return

    this.testedObjects = []
    let collisionEvents = []
    let interactionEvents = []

    for(let obj of world.gameObjects.gameObject) {
      if(!obj.rigidbody) 
        continue
      if(!obj.hitbox) 
        continue
      if(world === game && GameObject.distanceFast(obj, player.ship) > data.detectCollisionWithinThisFastDistanceOfPlayer) 
        continue
      if(!obj.canCollide) 
        continue

      let others = Collision.broadphase(world, obj, {exclude: [Interactable]})
      for(let other of others) {
        if(!other.rigidbody) 
          continue
        if(world === game && GameObject.distanceFast(other, player.ship) > data.detectCollisionWithinThisFastDistanceOfPlayer) 
          continue
        if(Collision.isOwnerWithProjectileCollision(obj, other)) 
          continue
        if(this.testedObjects.findChild(other)) 
          continue

        if(Collision.auto(obj.hitbox, other.hitbox)) 
          collisionEvents.push(new CollisionEvent(obj, other))
      }
      this.testedObjects.push(obj)
    }

    for(let obj of world.gameObjects.interactable) {
      if(obj.interactionData.trigger.allowedIds.length === 1 && obj.interactionData.trigger.allowedIds[0] === "player_ship") {
        if(Collision.auto(obj.hitbox, player.ship.hitbox))
          interactionEvents.push(new TriggerEvent(obj, player.ship))
        continue
      }
      for(let other of world.gameObjects.gameObject) {
        if(other instanceof Interactable) continue
        if(Collision.auto(obj.hitbox, other.hitbox))
          interactionEvents.push(new TriggerEvent(obj, other))
      }
    }
    Collision.solve(world, collisionEvents, world.previousCollisions)
    Collision.solve(world, interactionEvents, world.previousInteractions)

    world.previousCollisions = collisionEvents
    world.previousInteractions = interactionEvents
  }

  static broadphase(world, gameObject, options = {exclude: [], solo: [], grid: grid}) {
    broadphaseCallsPerFrame++

    let searchGrowFactor = 1
    let usedGrid = options.grid ?? grid
    let cellPosition = usedGrid === navMeshGrid ? "navCellPosition" : "cellPosition"

    let objects = []
    main_broadphase:
    for(let i = 0; i < world.gameObjects.gameObject.length; i++) {
      let other = world.gameObjects.gameObject[i]
      if(!other.hitbox)     continue main_broadphase
      if(!other.canCollide) continue main_broadphase
      if(options.exclude?.length)
        for(let type of options.exclude)
          if(other instanceof type)
            continue main_broadphase

      let matchesSolo = true
      if(options.solo?.length) {
        solo:
        for(let type of options.solo) {
          matchesSolo = false
          if(other instanceof type) {
            matchesSolo = true
            break solo
          }
        }
      }
      if(!matchesSolo) continue main_broadphase

      searchGrowFactor = Math.max(gameObject.broadphaseGrowFactor, other.broadphaseGrowFactor) || 1
      
      if(
        other.transform[cellPosition].x >= gameObject.transform[cellPosition].x - searchGrowFactor &&
        other.transform[cellPosition].x <= gameObject.transform[cellPosition].x + searchGrowFactor &&
        other.transform[cellPosition].y >= gameObject.transform[cellPosition].y - searchGrowFactor &&
        other.transform[cellPosition].y <= gameObject.transform[cellPosition].y + searchGrowFactor &&
        other !== gameObject
      )
      objects.push(other)
    }
    return objects
  }
  static broadphaseForVector(world, vector, options = {exclude: [], solo: [], grid: grid}) {
    let obj = {transform: new Transform(vector)}
    return this.broadphase(world, obj, options)
  }
  static auto(hitbox1, hitbox2) {
    if(!hitbox1 || !hitbox2)
      return
    collisionChecksPerFrame++
    if(this[hitbox1.type + hitbox2.type.capitalize()])
      return this[hitbox1.type + hitbox2.type.capitalize()](hitbox1, hitbox2)
    else if(this[hitbox2.type + hitbox1.type.capitalize()])
      return this[hitbox2.type + hitbox1.type.capitalize()](hitbox2, hitbox1)
    else {
      console.error("auto collision solving fail", hitbox1, hitbox2)
      game.app.ticker.stop()
    }  
  }
  static isWithinRadiusAndAngle(hitbox, angleMin, angleMax, targetObject) {

  }
  static lineCircle(line, circle) {
    if(line instanceof Line === false)
      throw "only accept Line instances in" + this
    return Intersects.lineCircle(line.startPoint.x, line.startPoint.y, line.endPoint.x, line.endPoint.y, circle.gameObject.transform.position.x, circle.gameObject.transform.position.y, circle.radius)
  }
  static linePolygon(line, polygon) {
    if(line instanceof Line === false)
      throw "only accept Line instances in" + this
    let verts = []
    for(let vert of polygon.vertices) {
      verts.push(vert.x, vert.y)
    }
    let tolerance = 0
    return Intersects.linePolygon(line.startPoint.x, line.startPoint.y, line.endPoint.x, line.endPoint.y, verts, tolerance)
  }
  static linePolygonHitbox(line, hitbox) {
    if(line instanceof Line === false)
      throw "only accept Line instances in" + this
    let collided = false
    hitbox.bodies.forEach(body => {
      if(this.linePolygon(line, body)) 
        collided = true
    })
    return collided
  }
  static lineBox(line, box) {
    let boundingBox = box instanceof BoundingBox ? box : box.boundingBox
    return Intersects.lineBox(line.startPoint.x, line.startPoint.y, line.endPoint.x, line.endPoint.y, boundingBox.x, boundingBox.y, boundingBox.w, boundingBox.h)
  }
  static polygonHitboxPolygonHitbox(hitbox1, hitbox2) {
    let collided = false
    let checkedBodies = []
    for(let body1 of hitbox1.bodies) {
      for(let body2 of hitbox2.bodies) {
        if(checkedBodies.find(b => b === body2)) 
          continue
        if(this.polygonPolygon(body1, body2)) 
          collided = true
      }
      checkedBodies.push(body1)
    }
    return collided
  }
  static polygonHitboxVector(hitbox, vector) {
    let collided = false
    for(let body of hitbox.bodies) {
      if(this.polygonVector(body, vector)) 
        return true
    }
    return collided
  }
  static polygonHitboxCircle(hitbox, circle) {
    let collided = false
    hitbox.bodies.forEach(body => {
      if(this.polygonCircle(body, circle)) 
        collided = true
    })
    return collided
  }
  static polygonCircle(polygon, circle) {
    let verts = []
    for(let vert of polygon.vertices) {
      verts.push(vert.x, vert.y)
    }
    return Intersects.polygonCircle(
      verts,
      circle.gameObject.transform.position.x,
      circle.gameObject.transform.position.y,
      circle.radius,
    )
  }
  static polygonVector(polygon, vector) {
    let verts = []
    for(let vert of polygon.vertices) {
      verts.push(vert.x, vert.y)
    }
    return Intersects.polygonPoint(
      verts,
      vector.x,
      vector.y,
    )
  }
  static polygonPolygon(polygon1, polygon2) {
    let verts1 = []
    let verts2 = []
    for(let vert of polygon1.vertices) {
      verts1.push(vert.x, vert.y)
    }
    for(let vert of polygon2.vertices) {
      verts2.push(vert.x, vert.y)
    }
    return Intersects.polygonPolygon(
      verts1,
      verts2,
    )
  }
  static polygonBox(polygon, box) {
    let verts = []
    let boundingBox = box instanceof BoundingBox ? box : box.boundingBox
    for(let vert of polygon.vertices) {
      verts.push(vert.x, vert.y)
    }
    return Intersects.polygonBox(
      verts,
      boundingBox.x,
      boundingBox.y,
      boundingBox.w,
      boundingBox.h,
    )
  }
  static circleCircle(circle1, circle2) {
    return Intersects.circleCircle(
      circle1.gameObject.transform.position.x, circle1.gameObject.transform.position.y, circle1.radius,
      circle2.gameObject.transform.position.x, circle2.gameObject.transform.position.y, circle2.radius,
    )
  }
  static vectorCircle(vector, circle) {
    return Intersects.pointCircle(
      vector.x, vector.y,
      circle.gameObject.transform.position.x, circle.gameObject.transform.position.y, circle.radius
    )
  }
  static boxBox(box1, box2) {
    let [boundingBox1, boundingBox2] = [box1 instanceof BoundingBox ? box1 : box1.boundingBox, box2 instanceof BoundingBox ? box2 : box2.boundingBox]
    return Intersects.boxBox(
      boundingBox1.x, boundingBox1.y, boundingBox1.w, boundingBox1.h, 
      boundingBox2.x, boundingBox2.y, boundingBox2.w, boundingBox2.h 
    )
  }
  static boxVector(box, vector) {
    let boundingBox = box instanceof BoundingBox ? box : box.boundingBox
    return Intersects.boxPoint(
      boundingBox.x, boundingBox.y, boundingBox.w, boundingBox.h, 
      vector.x, vector.y
    )
  }
  static boxCircle(box, circle) {
    let boundingBox = box instanceof BoundingBox ? box : box.boundingBox
    return Intersects.boxCircle(
      boundingBox.x,
      boundingBox.y,
      boundingBox.w,
      boundingBox.h,
      circle.gameObject.transform.position.x, circle.gameObject.transform.position.y, circle.radius
    )
  }
  static boxPolygonHitbox(box, hitbox) {
    let collided = false
    hitbox.bodies.forEach(body => {
      if(this.polygonBox(body, box))
        collided = true
    })
    return collided
  }
  //#endregion detect
  //#region solve
  static solve(world, events, previousEvents) {
    for(let event of events) {
      if(this.isSameCollisionGroup(event.obj1, event.obj2)) return
      
      if(event instanceof CollisionEvent)
        this.solveCollision(world, event, previousEvents)
      if(event instanceof TriggerEvent) 
        this.solveTrigger(world, event, previousEvents)
      if(event instanceof LightEvent) 
        this.solveLightEvent(world, event, previousEvents)
    }
  }
  static solveCollision(world, event, previousEvents) {
      if(event.obj1.destroyed || event.obj2.destroyed) return

      let obj1 = event.obj1
      let obj2 = event.obj2

      this.distributeVelocity(obj1, obj2)
      this.repelObjects(event.obj1, event.obj2, event.impactSpeed)

      obj1.handleImpact(event)
      obj2.handleImpact(event)

      if(obj1 instanceof Projectile || obj2 instanceof Projectile) 
      {
        this.solveProjectileCollision(obj1, obj2)
      }
      if(this.isCollisionContinuous(event, previousEvents)) 
      {
        //hamper interlocking objects' angular velocities
        obj1.transform.angularVelocity *= 0.8
        obj2.transform.angularVelocity *= 0.8
      }
      else
      {
       this.affectRotationByImpact(obj1, obj2)
      }
  }
  static solveProjectileCollision(obj1, obj2) {
    if(obj1 instanceof Projectile && obj2 instanceof Projectile) return

    let [projectile, other] = [obj1, obj2]
    if(!(projectile instanceof Projectile)) 
      [projectile, other] = [other, projectile]
  }
  static solveTrigger(world, event, previousEvents) {
    if(event.obj1.destroyed || event.obj2.destroyed) return

    let [interactable, triggerer] = [event.obj1, event.obj2]
    if(event.obj2 instanceof Interactable) 
      [interactable, triggerer] = [triggerer, interactable]
    interactable.trigger(triggerer)
  }
  static solveLightEvent(world, event, previousEvents) {
    if(!event.visibleObject.sprite) return
    let distance = GameObject.distance(event.light, event.visibleObject)
    if(distance > event.light.radius) return
    
    let intensity = 1 - (distance / event.light.radius)
    let inverseIntensity = 1 - intensity

    let colorNumber = parseInt(event.light.color.toString(16), 16)
    let finalDecimalColor = (colorNumber * intensity + 16777215 * inverseIntensity)
    let tintVal = parseInt(finalDecimalColor.toString(16), 16)
    event.visibleObject.sprite.colorFilter.tint(tintVal, false)
  }
  static distributeVelocity(obj1, obj2) {
    let mass1 = obj1.mass
    let mass2 = obj2.mass

    if(!mass1 || !mass2)
      console.error("one or both objects are missing mass", obj1, obj2)

    let massFraction = 1 / (mass1 + mass2)

    let finalVelocity = obj1.transform.velocity.clone()
    .mult(massFraction * mass1)
    .add(
      obj2.transform.velocity.clone().mult(massFraction * mass2)
    )
    obj1.transform.velocity.set(0)
    obj2.transform.velocity.set(0)

    if(!obj1.immovable)
      obj1.transform.velocity.setFrom(finalVelocity)
    if(!obj2.immovable)
      obj2.transform.velocity.setFrom(finalVelocity)
  }
  static repelObjects(obj1, obj2, collisionImpactSpeed = 0) {
    let repelStrength = 1
    if(obj1 instanceof Fragment && obj2 instanceof Fragment)
      repelStrength = 0.2

    let v1 = Vector.fromAngle(GameObject.angle(obj2, obj1)).mult((collisionImpactSpeed * 0.2 * dt) + 30 * dt).mult(repelStrength)
    let v2 = Vector.fromAngle(GameObject.angle(obj1, obj2)).mult((collisionImpactSpeed * 0.2 * dt) + 30 * dt).mult(repelStrength)

    //this part (in theory) should make sure that heavier objects get pushed very little by this interaction
    let v1Multiplier = clamp(obj2.mass / obj1.mass, 0, 1)
    let v2Multiplier = clamp(obj1.mass / obj2.mass, 0, 1)
    v1.mult(v1Multiplier)
    v2.mult(v2Multiplier)

    if(!obj1.immovable) {
      obj1.transform.position.add(v1)
      obj1.transform.velocity.add(v1)
    }
      
    if(!obj2.immovable) {
      obj2.transform.position.add(v2)
      obj2.transform.velocity.add(v2)
    }
      
  }
  static affectRotationByImpact(obj1, obj2) {
    let angleDifference = 0
    let angleBetweenObjects = obj1.transform.position.angleTo(obj2.transform.position)
    let vel = obj1.transform.velocity.clone().add(obj2.transform.velocity)
    let velAngle = vel.angle()
    angleDifference = angleBetweenObjects - velAngle
    obj1.transform.angularVelocity += angleDifference * obj1.transform.velocity.length() * 0.009 * dt
    obj2.transform.angularVelocity -= angleDifference * obj2.transform.velocity.length() * 0.009 * dt
  }
  //#endregion
  static isCollisionContinuous(event, previousEvents) {
    return previousEvents.find(ev => 
      (ev.obj1 === event.obj1 && ev.obj2 === event.obj2)
      || 
      (ev.obj2 === event.obj2 && ev.obj1 === event.obj1)
      )
  }
  static isOwnerWithProjectileCollision(obj, other) {
    return (other.owner === obj || obj.owner === other)
  }
  static isSameCollisionGroup(obj1, obj2) {
    return (obj1.collisionGroup && obj2.collisionGroup) && obj1.collisionGroup == obj2.collisionGroup
  }
}