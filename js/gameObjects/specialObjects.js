class LocationRandomizer extends GameObject {
  constructor(transform) {
    super(transform)
    this.object = {}
    this.spawns = []
    this.type = "locationRandomizer"
  }
  setObject(type, name) {
    if(this.object.thumbnail) {
      this.container.removeChild(this.object.thumbnail)
      this.object.thumbnail.destroy()
    }
    this.object = {}
    this.object.name = name
    this.object.type = type
    
    let thumbnail = PIXI.Sprite.from(data[type][name].sources.folder + "thumbnail" + ".png")
    thumbnail.anchor.set(0.5)
    thumbnail.position.set(0, 100)
    this.container.addChild(thumbnail)
    this.object.thumbnail = thumbnail
  }
  addSpawn(pos) {
    let newspawn = new LocationRandomizerSpawn(pos.clone(), 1, this)
    newspawn.addToStage(locationEditor.stage)
    this.spawns.push(newspawn)
  }
  removeSpawn(spawn) {
    this.spawns.remove(spawn)
  }
  update() {

  }
  destroy() {

  }
}

class LocationRandomizerSpawn extends GameObject {
  constructor(transform, weight, parent) {
    super(transform)
    this.weight = weight
    this.hitbox = new CircleHitbox(24)
    this.parent = parent
    this.type = "locationRandomizerSpawn"
  }
  update() {

  }
  destroy() {
    this.parent.removeSpawn(this)
  }
}

class RandomSpawner extends GameObject {
  constructor(pos, hitbox = {}, radius) {
    super(pos)
    this.type = "randomSpawner"
    this.transform.position = pos
    this.transform.velocity = new Vector(0)
    this.radius = radius || 250
    this.objects = []
    this.spawnsMin = 3
    this.spawnsMax = 5

    if(hitbox.type === "circle") 
      this.hitbox = new CircleHitbox(hitbox.radius)
    if(hitbox.type === "box") 
      this.hitbox = new BoxHitbox(hitbox.a, hitbox.b)
  }
  addToStage(stage) {
    this.stage = stage
    this.stage.addChild(this.container)
  }
  addObject(type, name, rotation, rotationVelocity, weight = 1) {
    if(this.objects.find(obj => obj.type === type && obj.name === name)) return
    let src = data[type][name].sources.folder + "thumbnail.png"
    let object = new RandomSpawnerSpawn(type, name, rotation, rotationVelocity, this, src, weight)
    this.generateThumbnail(type, name, src)
    this.objects.push(object)
  }
  generateThumbnail(type, name, src) {
    let imgCont = El('div', "context-window-thumbnail temp")
    let img = new Image(); img.src = src
    let cross = El('div', "icon-16 icon-close-top-right")
    imgCont.dataset.type = type
    imgCont.dataset.name = name
    imgCont.append(img, cross)
    locationEditor.contextWindow.querySelector(".thumbnail-container").append(imgCont)
  }
  removeObject(obj) {
    this.objects.remove(obj)
  }
  update() {

  }
  destroy() {
    this.sprite.destroy()
    this.container.destroy()
  }
}

class RandomSpawnerSpawn extends GameObject {
  constructor(transform, spawnType, spawnName, parent, src, weight = 1) {
    super(transform)
    this.type = "randomSpawnerSpawn"

    this.transform.position = parent.pos.clone()
    this.transform.position.y += 100
    this.transform.velocity = new Vector(0)
    this.spawnType = spawnType
    this.spawnName = spawnName
    this.rotation = rotation
    this.rotationVelocity = rotationVelocity
    this.parent = parent
    this.weight = weight
    this.src = src
  }
  update() {

  }
  destroy() {
    this.parent.removeObject(this)
    let thumbnail = locationEditor.contextWindow.querySelector(".context-window-thumbnail[data-type='" + this.spawnType + "']" + "[data-name='" + this.spawnName + "']")
    thumbnail.remove()
  }
}