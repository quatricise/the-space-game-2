class LocationRandomizer extends Rigid {
  constructor(
    transform, 
    hitbox = new CircleHitbox(50)
  ) {
    super(transform, hitbox)
    this.object = {}
    this.spawns = []
    // this.sprite = PIXI.Sprite.from("assets/specialObjects/locationRandomizer.png")
    // this.sprite.anchor.set(0.5)
    // this.container = new PIXI.Container()
    // this.container.addChild(this.sprite)
  }
  setObject(type, name) {
    if(this.object.thumbnail) {
      this.container.removeChild(this.object.thumbnail)
      this.object.thumbnail.destroy()
    }
    this.object = {}
    this.object.name = name
    this.object.type = type
    let thumb = PIXI.Sprite.from(data[type][name].sources.folder + "thumbnail" + ".png")
    thumb.anchor.set(0.5)
    thumb.position.set(0, 100)
    this.container.addChild(thumb)
    this.object.thumbnail = thumb
  }
  addSpawn(pos) {
    let newspawn = new LocationRandomizerSpawn(pos.clone(), 1, this)
    newspawn.addToStage(locationEditor.stage)
    this.spawns.push(newspawn)
  }
  removeSpawn(spawn) {
    this.spawns.splice(this.spawns.indexOf(spawn),1)
  }
  update() {

  }
  destroy() {
    this.sprite.destroy()
    this.container.destroy()
  }
}

class LocationRandomizerSpawn extends Rigid {
  constructor(transform, weight, parent) {
    super(transform)
    this.weight = weight
    this.hitbox = new CircleHitbox(24)
    this.parent = parent

    // this.sprite = PIXI.Sprite.from("assets/specialObjects/locationRandomizerSpawn.png")
    // this.sprite.anchor.set(0.5)
    // this.container = new PIXI.Container()
    // this.container.addChild(this.sprite)
  }
  addToStage(stage) {
    this.stage = stage
    this.stage.addChild(this.container)
  }
  update() {
    Hitbox.update(this)
    this.container.position.set(this.transform.position.x, this.transform.position.y)
  }
  destroy() {
    this.sprite.destroy()
    this.container.destroy()
    this.parent.removeSpawn(this)
  }
}

class RandomSpawner extends Rigid {
  constructor(pos, hitbox = {}, radius) {
    super(pos)
    this.transform.position = pos
    this.transform.velocity = new Vector(0)
    this.radius = radius || 250
    this.objects = []
    this.spawnsMin = 3
    this.spawnsMax = 5
    if(hitbox.type === "circle") this.hitbox = new CircleHitbox(hitbox.radius)
    if(hitbox.type === "box") this.hitbox = new BoxHitbox(hitbox.a, hitbox.b)

    // this.sprite = PIXI.Sprite.from("assets/specialObjects/randomSpawner.png")
    // this.sprite.anchor.set(0.5)
    // this.container = new PIXI.Container()
    // this.container.addChild(this.sprite)
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
    this.objects.splice(this.objects.indexOf(obj), 1)
  }
  update() {

  }
  destroy() {
    this.sprite.destroy()
    this.container.destroy()
  }
}

class RandomSpawnerSpawn extends Rigid {
  constructor(transform, type, name, parent, src, weight = 1) {
    super(transform, new CircleHitbox(30))
    this.transform.position = parent.pos.clone()
    this.transform.position.y += 100
    this.transform.velocity = new Vector(0)
    this.type = type
    this.name = name
    this.rotation = rotation
    this.rotationVelocity = rotationVelocity
    this.parent = parent
    this.weight = weight
    this.src = src

    this.sprite = new PIXI.Sprite.from(src)
    this.sprite.anchor.set(0.5)
    this.container = new PIXI.Container()
    this.container.addChild(this.sprite)

    this.addToStage(locationEditor.stage)
  }
  addToStage(stage) {
    this.stage = stage
    this.stage.addChild(this.container)
  }
  update() {

  }
  destroy() {
    this.sprite.destroy()
    this.container.destroy()
    this.parent.removeObject(this)
    let thumbnail = locationEditor.contextWindow.querySelector(".context-window-thumbnail[data-type='" + this.type + "']" + "[data-name='" + this.name + "']")
    thumbnail.remove()
  }
}

class FogGenerator extends Rigid {
  constructor(transform, hitbox, radius) {
    super(transform, hitbox)
    this.type = "specialObject"
    this.transform.position = pos
    this.transform.velocity = new Vector(0)
    this.radius = radius || 200
  }
  addToStage(stage) {
    this.stage = stage
    this.stage.addChild(this.container)
  }
  destroy() {
    this.sprite.destroy()
    this.container.destroy()
  }
}

class UltraportBeacon extends Rigid {
  constructor(pos) {
    super(transform, PolygonHitbox.default())
    // this.sprite = PIXI.Sprite.from("./assets/ultraportBeacon.png")
    // this.container = new PIXI.Container()
    // this.container.addChild(this.sprite)
  }
  destroy() {
    this.sprite.destroy()
    this.container.destroy()
  }
}