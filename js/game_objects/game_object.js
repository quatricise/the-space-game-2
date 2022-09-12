class GameObject {
  constructor(
    transform = new Transform()
  ) {
    this.transform = transform
    this.type = "game_object"
    this.cell_pos = new Vector(0)
    this.vwb = false
    this.can_collide = true
    this.destroyed = false
    this.visible = true
  }
  clone() {
    return _.cloneDeep(this)
  }
  //#region instance methods
  auto_cull() {
    return
    if(!this.stage) return
    if(!this.container) return
    if(
      //unfinished code
      this.transform.position.x < this.stage.position.x - cw*2 ||
      this.transform.position.x > this.stage.position.x + cw*2
    ) {
      this.hide()
    }
    else this.show()
  }
  hide() {
    if(this.container) this.container.renderable = false
    this.visible = false
  }
  show() {
    if(this.container) this.container.renderable = true
    this.visible = true
  }
  enter_void() {
    this.vwb = true
    this.can_collide = false
  }
  exit_void() {
    this.vwb = false
    this.can_collide = true
  }
  apply_inertia() {
    if(this.brakes && this.brakes.auto == false) return
    if(this instanceof Projectile) return
    if(this instanceof BgObject) return
    this.transform.velocity.mult(data.inertia)
  }
  update_cell_pos() {
    this.transform.cell_position.x = Math.floor(this.transform.position.x / grid.cell_size)
    this.transform.cell_position.y = Math.floor(this.transform.position.y / grid.cell_size)
  }
  wrap_rotation() {
    if(this.transform.rotation > TAU) this.transform.rotation -= TAU
    if(this.transform.rotation < 0) this.transform.rotation += TAU
  }
  floor_angular_velocity() {
    if(Math.abs(this.angular_velocity) < 0.015) this.angular_velocity = 0
  }
  update_timers() {
    if(this.timers) this.timers.update()
  }
  update() {
    //this is overridden by all derived classes, 
    //but it's here just to prevent an error if you happen to instantiate a "pure" GameObject
  }
  destroy() {
    if(this.sprites) this.sprites.forEach(sprite => sprite.destroy())
    if(this.container) this.container.destroy()
  }
  //#endregion

  //#region static methods
  static create(type, name, params = {}, options = {world: game}) {
    if(!options.world) throw "A GameObject needs to be placed inside a GameWorldWindow."
    let obj
    if(type === "camera") obj = new Camera(params.transform, params.context, params.context_dim, params.locked_to, params.base_zoom)
    if(type === "asteroid") obj = new Asteroid(params.transform, name)
    if(type === "ship") obj = new Ship(params.transform, name)
    if(type === "debris") obj = new Debris(params.transform, name)
    if(type === "interactable") obj = new Interactable(params.transform, name, params.hitbox, params.do_on_enter, params.do_on_leave, params.hint_text, params.parent)
    if(type === "hint") obj = new DynamicHint(params.transform, params.text, params.fadeout_time, params.parent )
    if(type === "projectile") obj = new Projectile(params.transform, name, params.owner, params.target)
    if(type === "cluster") obj = new Cluster(params.transform)
    if(type === "bg_object") obj = new BgObject(params.transform, name)
    if(type === "ultraport_beacon") obj = new UltraportBeacon(params.transform)
    if(type === "location_randomizer") obj = new LocationRandomizer(params.transform)
    if(type === "random_spawner") obj = new RandomSpawner(params.transform, {type: "circle", radius: 50}, 250)
    if(type === "map_icon") obj = new MapIcon(params.location, params.location_name)
    if(type === "map_image") obj = new MapImage(params.transform, params.scale, name)

    obj.prototype_chain = []
    if(obj instanceof GameObject) obj.prototype_chain.push("game_object")
    if(obj instanceof Camera) obj.prototype_chain.push("camera")
    if(obj instanceof Rigid) obj.prototype_chain.push("rigid")
    if(obj instanceof Asteroid) obj.prototype_chain.push("asteroid")
    if(obj instanceof Debris) obj.prototype_chain.push("debris")
    if(obj instanceof BgObject) obj.prototype_chain.push("bg_object")
    if(obj instanceof Cluster) obj.prototype_chain.push("cluster")
    if(obj instanceof Interactable) obj.prototype_chain.push("interactable")
    if(obj instanceof Hint) obj.prototype_chain.push("hint")
    if(obj instanceof Projectile) obj.prototype_chain.push("projectile")
    if(obj instanceof Ship) obj.prototype_chain.push("ship")
    if(obj instanceof UltraportBeacon) obj.prototype_chain.push("ultraport_beacon")
    if(obj instanceof LocationRandomizer) obj.prototype_chain.push("location_randomizer")
    if(obj instanceof RandomSpawner) obj.prototype_chain.push("random_spawner")

    options.world.add_game_object(obj)
    if(obj === undefined) throw "undefined"
    return obj
  }
  static destroy(obj) {
    this.remove_from_stage(obj)
    if(obj.container) obj.container.destroy()
    if(obj.sprite) obj.sprite.all.forEach(s => s.destroy())
    obj.game_world.remove_game_object(obj)
    obj.destroy()
  }
  static add_to_stage(obj, stage) {
    if(!stage) return
    obj.stage = stage
    obj.stage.addChild(obj.container)
    obj.show()
  }
  static remove_from_stage(obj) {
    if(obj.stage) obj.stage.removeChild(obj.container)
    obj.hide()
  }
  static get_layer_for_object(obj) {
    let types = data.object_to_layer_map.get(obj.type)
    if(types) return pickRand(types)
    return null
  }
  //#endregion
}
