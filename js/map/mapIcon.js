class MapIcon extends GameObject {
  constructor(transform, locationType, locationReference) {
    //locationType is actually the "name" parameter for most other objects, but here
    //it refers to the location "type": connected/outback; it isn't the name of the place
    //locationReference is the actual name of the location and a string accessor inside data.starSystem
    super(transform)
    let objectData = data.mapIcon[locationType]
    this.type = "mapIcon"
    this.name = locationType

    if(!data.starSystem[locationReference])
      throw "'" + locationReference +  "': this location doesn't exist, create it first please."
    
    this.locationReference = locationReference
    this.locationDisplayName = data.starSystem[locationReference].displayName
    this.locationType = locationType
    this.hover = false
    this.fontSize = 16
    this.transform.angularVelocity = 0.5

    this.orbitalVelocities = [
      Random.float(0.7, 1.5),
      Random.float(0.4, 1),
      Random.float(0.25, 0.75),
    ]
    
    this.components = [
      "hitbox",
      "sprite",
    ]
    this.textSprite = null
    this.registerComponents(objectData)
  }
  createText() {
    this.textSprite = new PIXI.Text(this.locationDisplayName, {fontFamily: "space", fill: "0xffffff"})
    this.textSprite.position.set(this.transform.position.x + 60, this.transform.position.y - 15)
    this.gameWorld.stage.addChild(this.textSprite)
  }
  showText() {
    if(!this.textSprite)
      this.createText()
    
    this.gameWorld.stage.addChild(this.textSprite)
    this.textSprite.position.set(this.transform.position.x + 30 + (20 * map.camera.currentZoom), this.transform.position.y -  5 - (5 * map.camera.currentZoom))
    this.textSprite.scale.set(this.gameWorld.camera.currentZoom * 0.8)
  }
  hideText() {
    this.gameWorld.stage.removeChild(this.textSprite)
  }
  update() {
    if(this.sprite.orbits)
      Sprite.updateOrbits(this)
  }
  destroy() {
    
  }
}