class NPC extends Person {
  constructor(name) {
    super(name)
    this.type = "npc"
    this.name = name
    this.ship = null
    this.target = null
    
    /* flags */
    this.canUseAbility = true

    this.followDistance = 1400
    this.stopDistance = 650
    this.brakeDistance = 450
    this.timers = new Timer()
    this.setupStateMachine()
    this.setupNavMesh()
  }
  setupStateMachine() {
    this.stateMachine = new StateMachine(this)
    for(let key in NPC.states) {
      let stateRef = key
      let state = new StateObject(stateRef)
      state.assignMethods(NPC.states[stateRef].methods.map(method => NPC[method].bind(state)))
      state.timers = NPC.states[stateRef].setupTimers(state)
      this.stateMachine.addState(state)
    }
  }
  setupNavMesh() {
    this.navMesh = {
      boundingBoxes: [],
      nearest: null,
      indexOfTargetBox: 0
    }
  }
  assignShip(ship) {
    this.ship = ship
    this.ship.npcs.push(this)
  }
  update() {
    this.stateMachine.update()
    this.ship ? this.transform.position.setFrom(this.ship.transform.position) : null
    NPC.drawNavMesh(this)
  }
  destroy() {
    this.stateMachine.destroy()
  }
  static states = {
    avoidCollision: {
      methods: [
        "setTarget",
        "rotateToNearestPoint",
      ],
      setupTimers(state) {
        return new Timer(
          ["createNavmesh", 400, {loop: true, active: true, onfinish: NPC.createNavmesh.bind(state)}],
        )
      }
    },
    attackEnemy: {
      methods: [
        "setTarget",
        "rotateToTargetIfNotObstructed",
        "rotateToNearestPoint",
        "followTarget",
      ],
      setupTimers(state) {
        return new Timer(
          ["createNavmesh", 400,  {loop: true, active: true, onfinish: NPC.createNavmesh.bind(state)}],
          ["fireWeapon",    900,  {loop: true, active: true, onfinish: NPC.useWeapon.bind(state)}],
          ["skip",          8000, {loop: true, active: true, onfinish: NPC.useSkip.bind(state)}],
          ["useShield",     600,  {loop: true, active: true, onfinish: NPC.useShields.bind(state)}],

          /* 
          this is used to limit the rate of abilities so that the NPC doesn't fire weapon and use a shield within a time window
          because that would feel unnatural
          */
          ["resetAbility",    350,  {loop: false, active: true, onfinish: NPC.resetAbility.bind(state)}],
        )
      }
    },
    flee: {
      methods: [
        "rotateToNearestPoint",
        "avoidTarget",
      ],
      setupTimers(state) {
        return new Timer(
          ["createNavmesh", 400, {loop: true, active: true, onfinish: NPC.createNavmesh.bind(state)}],
        )
      }
    },
  }
  //#region state methods (inside these methods this === the StateObject)
  static createNavmesh() {
    if(this.timers.createNavmesh.finished)
      this.timers.createNavmesh.start()
    let shipBoundingBox = this.gameObject.ship.hitbox?.boundingBox
    if(!shipBoundingBox) return

    this.gameObject.navMesh.boundingBoxes.empty()

    let objects = Collision.broadphase(game, this.gameObject.ship, {exclude: [Interactable], grid: navMeshGrid})
    let navmeshFirstPhase = []

    /* 1st phase - create 4 bounding boxes around each object */
    for(let obj of objects) {
      let offsetFromObject = Math.max(shipBoundingBox.w + obj.hitbox.boundingBox.w, shipBoundingBox.h + obj.hitbox.boundingBox.h)
      let offsetVector = new Vector(offsetFromObject, 0)
      for(let i = 0; i < 4; i++) {
        //create a navmesh point with absolute position in the world
        let worldPosition = offsetVector.clone().add(obj.transform.position)
        let newBoundingBox = new BoundingBox(worldPosition.x - shipBoundingBox.w/2, worldPosition.y - shipBoundingBox.h/2, shipBoundingBox.w, shipBoundingBox.h)
        navmeshFirstPhase.push(newBoundingBox)
        offsetVector.rotate(halfPI)
      }
    }

    /* 2nd phase - ruling out colliding bounding boxes */
    for(let boundingBox of navmeshFirstPhase) {
      let objects = Collision.broadphaseForVector(game, new Vector(boundingBox.x, boundingBox.y), {exclude: [Interactable], grid: grid} )
      let isColliding = false
      for(let obj of objects) {
        if(Collision.auto(boundingBox, obj.hitbox)) 
          isColliding = true
      }
      if(!isColliding)
        this.gameObject.navMesh.boundingBoxes.push(boundingBox)
    }

    /* player line of sight check */
    {
      let line = new Line(this.gameObject.ship.transform.position.clone(), player.ship.transform.position.clone())
      let objects = game.gameObjects.gameObject.filter(obj => 
        obj.hitbox && 
        obj.rigidbody && 
        obj !== player.ship && 
        obj !== this.gameObject.ship && 
        GameObject.distanceFast(obj, this.gameObject.ship) < data.npcLineOfSightDistance
      )

      this.hasAngleToTarget = true
      for(let obj of objects) {
        if(Collision.auto(line, obj.hitbox)) {
          this.hasAngleToTarget = false
          return
        }
      }
    }
  }
  static rotateToNearestPoint() {
    if(this.hasAngleToTarget) return
    if(!this.gameObject.ship.hitbox) return
    if(!this.gameObject.target) return
    if(!this.gameObject.navMesh.nearest) return

    let distances = this.gameObject.navMesh.boundingBoxes.map((b, index) => [b.position.distance(this.gameObject.ship.transform.position), index])
    let indexOfNearest = distances.indexOf(
      distances.find(dist => dist[0] === Math.min(...distances.map(d => d[0])))
    )
    this.gameObject.navMesh.nearest = this.gameObject.navMesh.boundingBoxes[indexOfNearest]
    let positionOfNearest = this.gameObject.navMesh.nearest.position

    let angleToPlayer = GameObject.angle(this.gameObject.ship, this.gameObject.target)

    //angles to all the viable boundingBoxes that the ship can navigate to
    let angles = this.gameObject.navMesh.boundingBoxes.map((b, i) => 
      [
        this.gameObject.transform.position.angleTo(b.position), 
        i
      ]
    )
    
    let subtractedAngles = angles.map(a => Math.abs(a[0] - angleToPlayer))
    let sortedSubtractedAngles = subtractedAngles.sort((a, b) => a - b)
    let indexOfClosestAngleToPlayerAngle = subtractedAngles.indexOf(subtractedAngles.find(a => a === Math.min(...subtractedAngles)))
    let closestAngle = angles[indexOfClosestAngleToPlayerAngle][0]

    //this block tries to get the boundingbox which is with its angle to the npc's ship closest to the angle the npc's ship has to the player
    {
      return
      let nearestPositionBetweenPlayerAndShip = this.gameObject.navMesh.boundingBoxes[indexOfClosestAngleToPlayerAngle].position
      this.gameObject.navMesh.indexOfTargetBox = indexOfClosestAngleToPlayerAngle

      //if the point is too far away, pick a different one from all available positions, if it doesn't work, just get the first one
      let foundSuitablePosition = false
      for(let i = 0; i < angles.length; i++) {
        if(nearestPositionBetweenPlayerAndShip.distance(this.gameObject.target < 1000)) {
          foundSuitablePosition = true
          break
        }
        this.gameObject.navMesh.indexOfTargetBox = i
        nearestPositionBetweenPlayerAndShip = this.gameObject.navMesh.boundingBoxes[i].position
      }

      if(!foundSuitablePosition)
        nearestPositionBetweenPlayerAndShip = this.gameObject.navMesh.boundingBoxes[indexOfClosestAngleToPlayerAngle].position

      if(this.gameObject.ship.transform.position.isObjectRotationGreaterThanAngleToVector(nearestPositionBetweenPlayerAndShip, this.gameObject.ship.transform.rotation)) {
        this.gameObject.ship.rotate(-1)
      }      
      else {
        this.gameObject.ship.rotate(1)
      }   
    }
    {
      let closestBoxPosition = this.gameObject.target.transform.position.closest(...this.gameObject.navMesh.boundingBoxes.map(b => b.position))
      let indexOfBox = this.gameObject.navMesh.boundingBoxes.indexOf(this.gameObject.navMesh.boundingBoxes.find(box => box.position.is(closestBoxPosition)))
      this.gameObject.navMesh.indexOfTargetBox = indexOfBox
      if(this.gameObject.ship.transform.position.isObjectRotationGreaterThanAngleToVector(closestBoxPosition, this.gameObject.ship.transform.rotation)) {
        this.gameObject.ship.rotate(-1)
        console.log("rotating CCW")
      }      
      else {
        this.gameObject.ship.rotate(1)
        console.log("rotating CW")
      }   
    }
  }
  static rotateToTargetIfNotObstructed() {
    if(!this.gameObject.ship) return
    if(!this.gameObject.target) return
    if(!this.hasAngleToTarget) return
    let [angle, rotation] = this.gameObject.ship.transform.position.wrapAngleAndRotation(this.gameObject.target.transform.position, this.gameObject.ship.transform.rotation)
    if(Math.abs(rotation - angle) < PI_32) return
    
    if(this.gameObject.ship.transform.position.isObjectRotationGreaterThanAngleToVector(this.gameObject.target.transform.position, this.gameObject.ship.transform.rotation))
      this.gameObject.ship.rotate(-1)
    else
      this.gameObject.ship.rotate(1)
  }
  static checkForCollision() {
    if(!this.gameObject.ship) return
    this.collisionEvents = []
    let objects = Collision.broadphase(game, this.gameObject.ship, {exclude: [Interactable]})
    objects.forEach(obj => {
      for(let [iteration, projection] of obj.hitbox.projections.entries()) {
        if(Collision.auto(projection, this.gameObject.ship.hitbox))
          this.collisionEvents.push(new CollisionEvent(this.gameObject.ship, obj, {iteration}))
      }
    })
  }
  static updateNavMesh() {
    if(this.navMeshGenerated && this.gameObject.navMesh.points.length > 4) return
    if(!this.gameObject.ship.hitbox) return
  }
  static avoidObstacle() {
    //this function only works by predicting where the craft would go, but there should be another one, predicting with an imagined, higher velocity
    if(this.collisionEvents.length == 0) return
    
    let collisionEvents = []
    let allProjections = []
    let angleOffsetStep = PI/6
    let iteration = 1
    do {
      let multiplier = Math.ceil((iteration * (1 - (iteration % 2)*2)) / 2) //this should cause that an alternation in the offset
      let newProjections = this.gameObject.ship.hitbox.projectPositionInDifferentAngle(angleOffsetStep * multiplier)
      allProjections.push(...newProjections)
      collisionEvents = NPC.checkForCollisionInSetOfProjections(this, newProjections)
      if(collisionEvents.length === 0) break
      iteration++
    }
    while(angleOffsetStep * iteration < TAU)
    
    if(collisionEvents.length > 0 ) {
      //try to pathfind if the velocity was something more normal, to avoid the constant collision when the craft isn't moving
      iteration = 1
      let newVelocity = this.gameObject.transform.velocity.clone().normalize(250)
      do {
        let multiplier = Math.ceil((iteration * (1 - (iteration % 2)*2)) / 2) //this should cause that an alternation in the offset
        let newProjections = this.gameObject.ship.hitbox.projectPositionInDifferentAngle(angleOffsetStep * multiplier, newVelocity)
        allProjections.push(...newProjections)
        collisionEvents = NPC.checkForCollisionInSetOfProjections(this, newProjections)
        if(collisionEvents.length === 0) break
        iteration++
      }
      while(angleOffsetStep * iteration < TAU)
      
      if(collisionEvents.length > 0 ) {
        this.gameObject.desiredAngle = GameObject.angle(this.gameObject.ship, this.gameObject.target)
      }
      else {
        this.gameObject.desiredAngle = this.gameObject.ship.transform.rotation + (angleOffsetStep * iteration)
      }
    }
    else {
      this.gameObject.desiredAngle = this.gameObject.ship.transform.rotation + (angleOffsetStep * iteration)
    }

    allProjections.forEach(projection => {
      let color = projection === allProjections.last() ? 0xff0000 : 0x1111dd
      game.graphics.lineStyle(2, color, 1)
      game.graphics.drawCircle(projection.x, projection.y, 4)
      game.graphics.closePath()
    })
  }
  static avoidTarget() {

  }
  static rotateTowardsDesiredAngle() {
    if(this.collisionEvents.length == 0) return

    let margin = 0.2
    if(this.gameObject.desiredAngle > this.gameObject.ship.transform.rotation + margin) 
      this.gameObject.ship.rotate(1)
    else
    if(this.gameObject.desiredAngle < this.gameObject.ship.transform.rotation - margin)
      this.gameObject.ship.rotate(-1) 
  }
  static setTarget() {
    if(!player || !player.ship || !this.gameObject.ship) 
      this.gameObject.target = null
    else
    if(player.ship && player.ship.vwb) {
      this.gameObject.target = null
    }
    else
    if(GameObject.distance(this.gameObject.ship, player.ship) < this.gameObject.followDistance) {
      this.gameObject.target = player.ship
      this.gameObject.ship.targetPosition = this.gameObject.target.transform.position.clone()
    }      
  }
  static followTarget() {
    if(!this.gameObject.target) return

    let distance = GameObject.distance(this.gameObject.ship, this.gameObject.target)
    if(distance > this.gameObject.followDistance) return

    if( distance > this.gameObject.stopDistance && 
        this.gameObject.ship.transform.velocity.length() < this.gameObject.ship.engine.maxSpeed / 2
    ) {
      this.gameObject.ship.accelerate()
    }
    else
    if(distance > this.gameObject.brakeDistance) {
      //do nothing
    }
    else {
      this.gameObject.ship.decelerate()
    }
  }
  static useWeapon() {
    if(!this.gameObject.canUseAbility) return
    if(!this.gameObject.ship.weapons) return
    
    /* rotate the target position around the NPC's ship by up to 10 degrees, to achieve inaccuracy */
    let 
    ship = this.gameObject.ship
    ship.targetPosition.rotateAround(
      ship.transform.position, 
      (TAU/360) * Random.int(2, 10) * Random.from(-1, 1)
    )
    
    let weaponSystem = this.gameObject.ship.weapons
    if(!weaponSystem.activeWeapon.ready) 
      weaponSystem.cycleActiveWeapon()
    
    if(weaponSystem.activeWeapon.ready) {
      let event = {type: weaponSystem.activeWeapon.fireMethod}
      weaponSystem.activeWeapon.handleInput.bind(weaponSystem.activeWeapon, event)()
    }
    else 
    if(weaponSystem.weapons.find(w => w.chargeMethod !== "auto")) {
      weaponSystem.setActiveWeapon(
        weaponSystem.weapons.find(w => w.chargeMethod !== "auto")
      )
      if(weaponSystem.activeWeapon.charging) return
      
      let event = {type: weaponSystem.activeWeapon.chargeMethod}
      weaponSystem.activeWeapon.handleInput.bind(weaponSystem.activeWeapon, event)()
    }

    /* reset ability use */
    this.gameObject.canUseAbility = false
    this.timers.resetAbility.start()
  }
  static useSkip() {
    if(!this.gameObject.canUseAbility) return
    if(!this.gameObject.ship.skip.ready) return
    if(!this.gameObject.target) return

    let targetPos = this.gameObject.target.transform.position
    let destination = targetPos.clone()

    destination.x += 320
    destination.y += 320
    destination.rotateAround(targetPos, Random.rotation())

    this.gameObject.ship.skip.activate(destination)

    /* this kinda randomizes when the next skip occurs */
    this.timers.skip.duration = Random.int(5000, 18000)
    this.timers.skip.start()

    /* reset ability use */
    this.gameObject.canUseAbility = false
    this.timers.resetAbility.start()
  }
  static useShields() {
    if(!this.gameObject.canUseAbility) return
    if(!this.gameObject.ship.shields.ready) return

    let targets = Collision.broadphase(this.gameObject.ship.gameWorld, this.gameObject.ship, {solo: [Projectile]})
    targets.forEach(target => {
      if(!target.transform.position.isClose(300, this.gameObject.ship.transform.position)) return
      if(target.owner === this.gameObject.ship) return

      this.gameObject.ship.shields.activate(GameObject.angle(this.gameObject.ship, target))
    })

    /* reset ability use */
    this.gameObject.canUseAbility = false
    this.timers.resetAbility.start()
  }
  static resetAbility() {
    this.gameObject.canUseAbility = true
  }
  //#endregion
  //#region helper methods
  static drawNavMesh(npcObject) {
    if(!visible.navMesh) return

    for(let [index, box] of npcObject.navMesh.boundingBoxes.entries()) {
      if(index === npcObject.navMesh.indexOfTargetBox) 
        game.graphics.lineStyle(npcObject.gameWorld.camera.currentZoom, 0xff0000, 1)
      else
        game.graphics.lineStyle(npcObject.gameWorld.camera.currentZoom, 0x1111dd, 1)

      game.graphics.drawRect(box.x, box.y, box.w, box.h)
      game.graphics.closePath()
      game.graphics.drawCircle(box.x, box.y, 7)
      game.graphics.closePath()
    }
  }
  static checkForCollisionInSetOfProjections(stateObject, projections) {
    let collisionEvents = []
    let objects = Collision.broadphase(game, stateObject.gameObject.ship, {exclude: [Interactable]})
    objects.forEach(obj => {
      for(let [iteration, projection] of projections.entries()) {
        if(Collision.auto(projection, obj.hitbox))
          collisionEvents.push(new CollisionEvent(stateObject.gameObject.ship, obj, {iteration}))
      }
    })
    return collisionEvents
  }
}