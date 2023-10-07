/** Object that spawns other GameObjects into the game */
class Spawner extends GameObject {
  constructor(transform, name, params = {}) {
    super(transform)
    this.type = "spawner"
    let objData = data.spawner[name]

    /** @type Set<GameObject> Pool of objects which the spawner can select from when spawning new. */
    this.spawns = new Set()

    /** @type String: "single" || "multiple" */
    this.objectMode = params.objectMode ?? "multiple"

    /** @type String: "continuous" || "onLoad". Onload is only activated when location loads and is then destroyed. */
    this.spawnMode = params.spawnMode ?? "onLoad"

    /** @type Set<SpawnArea> */
    this.spawnAreas = new Set()

    this.components = ["hitbox"]
    this.registerComponents(objData)
  }
  addSpawn(objType, objName) {
    GameObject.create(objType, objName, {})
  }
  update() {

  }
  destroy() {
    this.spawns.forEach(s => GameObject.destroy(s))
  }
}

/** Place where objects can spawn inside a spawner, it is questionable whether this could just be a hitbox. */
class SpawnArea {
  constructor(type, data) {
    this.type = type
    switch(type) {
      case "box": {
        this.w = data.w
        this.h = data.h
        break
      }
      case "circle": {
        this.radius = data.radius
        break
      }
    }
  }
}

/** 
this class represents a gameObject inside the Spawner
it takes the thumbnail for an actual GameObject and puts it into its sprite
*/
class Spawn extends GameObject {
  constructor(transform, name, params) {
    super(transform, params.id)
    this.type = "spawn"
    let objData = data.spawn[name] ?? data.spawn.default

    this.mimic = {
      name: params.objName,
      type: params.objType
    }
  }
}