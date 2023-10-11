class UltraportBeacon extends GameObject {
  constructor(transform, name, options = {isDeathmatchBeacon: false, travelDestination: "locationName"}) {
    super(transform)
    let objectData = data.ultraportBeacon[name]
    this.type = "ultraportBeacon"
    this.name = name

    this.setAsImmovable()
    this.mass = 1_000_000

    /** @type Boolean - this is only used inside the deathmatch arenas */
    this.isDeathmatchBeacon = options.isDeathmatchBeacon ?? false
    
    /** @type String - only used for the deathmatch beacon */
    this.travelDestination = options.travelDestination

    this.isPlayerNearby = false
    this.components = [
      "sprite",
      "hitbox",
      "rigidbody"
    ]
    this.registerComponents(objectData)
    this.cloneParticleSprite(2)
    this.cloneParticleSprite(3)
  }
  cloneParticleSprite(newParticleIndex) {
    let src = this.sprite.particles.texture.textureCacheIds[0]
    let 
    newSprite = Sprite.animatedSprite(src)
    newSprite.anchor.set(0.5)
    newSprite.play()
    newSprite.animationSpeed = Random.int(8, 12) / 100
    newSprite.rotation = Random.float(0.5, 12)
    this.sprite["particles" + newParticleIndex] = newSprite
    this.sprite.container.addChild(newSprite)
    this.sprite.all.push(newSprite)
  }
  onPlayerEnter() {
    if(this.isPlayerNearby) return

    this.isPlayerNearby = true
    this.createOverlayMenu()
  }
  createOverlayMenu() {
    if(player.inventory.findItemByName("beaconAccessKey")) {
      this.overlayMenu = GameObject.create("gameOverlay", "overlayOpenMapAndUseKey", {parent: this}, {world: this.gameWorld})
      this.registerBeaconKeyInteraction()
    }
    else if(this.isDeathmatchBeacon) {
      this.overlayMenu = GameObject.create("gameOverlay", "overlayBeaconDeathmatch", {parent: this}, {world: this.gameWorld})
    }
    else {
      this.overlayMenu = GameObject.create("gameOverlay", "overlayOpenMap", {parent: this}, {world: this.gameWorld})
    }
  }
  destroyOverlayMenu() {
    if(this.overlayMenu)
      GameObject.destroy(this.overlayMenu)
    this.overlayMenu = null
  }
  onPlayerLeave() {
    if(!this.isPlayerNearby) return
    
    this.isPlayerNearby = false
    this.destroyOverlayMenu()
    this.unregisterBeaconKeyInteraction()
  }
  registerBeaconKeyInteraction() {
    game.availableInteraction = UltraportBeacon.beaconKeyInteraction.bind(this)
  }
  unregisterBeaconKeyInteraction() {
    game.availableInteraction = null
  }
  updateSprite(distanceFromPlayer) {
    const opacity = clamp(1 - (distanceFromPlayer - 100) / UltraportBeacon.minDistanceToTravel, 0, 1)
    this.sprite.overlayFill.alpha = opacity
    this.sprite.glow.alpha = clamp(opacity + 0.2, 0, 1)
    this.sprite.particles.alpha = opacity
    this.sprite.particles.rotation += (30 * PI/180) * dt * opacity
    this.sprite.particles2.alpha = opacity
    this.sprite.particles2.rotation += (40 * PI/180) * dt * opacity
    this.sprite.particles3.alpha = opacity / 2
    this.sprite.particles3.rotation += (60 * PI/180) * dt * opacity
  }
  update() {
    let distanceFromPlayer = GameObject.distance(this, player.ship)
    if(distanceFromPlayer < UltraportBeacon.minDistanceToTravel)
      this.onPlayerEnter()
    else
      this.onPlayerLeave()
    this.updateSprite(distanceFromPlayer)  
  }
  destroy() {
    this.destroyOverlayMenu()
  }
  static minDistanceToTravel = 480
  static beaconKeyInteraction() {
    GameObject.create(
      "hint", 
      "Hint", 
      {
        transform: new Transform(), 
        hintData: {
          hintText: "Extracted fly-paths data from the beacon. Your map has been updated. \n\n Press [M] or click on the map icon on your right.",
          hintType: "static",
          hintAttachment: "bottom",
          hintComplete: {
            requirements: [
              {
                method: "UIevent",
                eventType: "keydown",
                eventBind: "dismissHint",
              }
            ],
            onComplete: "none"
          }
        },
        parent: this, 
      },
      {world: this.gameWorld}
    )
    /* create the quest overlay */
    GameObject.create(
      "mapImage",
      "questOverlay_theLostPrincess_searchRadius",
      {transform: new Transform(new Vector(80, -100)), scale: 0.5},
      {world: map}
    )
  }
}