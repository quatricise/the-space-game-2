class GameWorldWindow extends GameWindow {
  constructor(title, element) {
    super(title, element)
    this.create_app()
    this.create_layers()
    this.create_game_objects()
    this.create_camera()
    this.grid_sprite = new PIXI.TilingSprite(grid.texture, cw + grid.cell_size*2, ch + grid.cell_size*2)
    this.stats = new GameDebugStats()
    this.interaction_manager = new InteractionManager()
    this.mode = new Switch("edit", "play")
    this.fog = []
    this.previous_collisions = []
    this.location_name = "Location"

    this.game_objects.camera.push(this.camera)
    this.layers.graphics.addChild(this.graphics)
    this.element.append(this.app.view)
  }
  //#region setup 
  create_app() {
    this.app = new PIXI.Application(
      { 
        width: cw, 
        height: ch, 
        backgroundColor: 0x151516
      }
    )
    this.stage = this.app.stage
  }
  create_camera() {
    this.camera = GameObject.create(
      "camera", 
      "main_camera", 
      {
        transform: new Transform(),
        context: this.stage
      }, 
      {world: this}
    )
  }
  create_layers() {
    this.layers = {
      planet: new PIXI.Container(),
      background: new PIXI.Container(),
      background2: new PIXI.Container(),
      vignette: new PIXI.Container(),
      asteroid: new PIXI.Container(),
      debris: new PIXI.Container(),
      ship: new PIXI.Container(),
      projectile: new PIXI.Container(),
      vignette2: new PIXI.Container(),
      fog: new PIXI.Container(),
      graphics: new PIXI.Container(),
      overlays: new PIXI.Container(),
      get all() {
        let layers = [
          this.planet,
          this.background,
          this.background2,
          this.asteroid,
          this.vignette,
          this.debris,
          this.ship,
          this.projectile,
          this.vignette2,
          this.fog,
          this.graphics,
          this.overlays,
        ]
        if(layers.length !== Object.keys(this).length - 1) throw 'probably not all layers were got using get all()'
        return layers
      }
    }
    this.layers.all.forEach(layer => this.stage.addChild(layer))
  }
  create_game_objects() {
    this.game_objects = {
      game_object: [],
      cluster: [],
      rigid: [],
      debris: [],
      camera: [],
      projectile: [],
      asteroid: [],
      ship: [],
      persons: [],
      interactable: [],
      hint: [],
      laser: [],
      ultraport_beacon: [],
      location_randomizer: [],
      random_spawner: [],
      bg_object: [],
      map_icon: [],
      map_image: [],
    }
  }
  //#endregion
  //#region cosmetic optional methods
  create_vignette() {    
    let vignette = PIXI.Sprite.from("assets/vignette.png")
    vignette.anchor.set(0.5)
    vignette.alpha = 0.7
    this.layers.vignette.addChild(vignette)

    let vignette2 = PIXI.Sprite.from("assets/vignette.png")
    vignette2.anchor.set(0.5)
    vignette2.alpha = 0.5
    this.layers.vignette2.addChild(vignette2)
  }
  add_origin() {
    this.origin = PIXI.Sprite.from("assets/origin.png")
    this.origin.anchor.set(0.5)
    this.stage.addChild(this.origin)
  }
  update_grid_sprite() {
    this.grid_sprite.position.x = Math.floor(this.camera.transform.position.x / grid.cell_size) * grid.cell_size - (grid.cell_size*2)
    this.grid_sprite.position.y = Math.floor(this.camera.transform.position.y / grid.cell_size) * grid.cell_size - grid.cell_size
  }
  update_stats() {

  }
  update_fog() {
    if(this.mode.is("play")) {
      this.location.fog.forEach(f => {
        f.rotation = Math.floor(Date.now()/450)
      })
    }
  }
  //#endregion

  //#region GameObject logic
  add_game_object(obj) {
    obj.prototype_chain.forEach(prototype => {
      this.game_objects[prototype].push(obj)
    })
    obj.game_world = this
    let layername = GameObject.get_layer_for_object(obj)
    if(layername) GameObject.add_to_stage(obj, this.layers[layername])
  }
  remove_game_object(obj) {
    obj.prototype_chain.forEach(prototype => {
      this.game_objects[prototype].remove(obj)
    })
    obj.game_world = null
    if(obj.container) obj.stage.removeChild(obj.container)
  }
  update_game_objects() {
    this.game_objects.game_object.forEach(obj => {
      if(obj.destroyed) this.destroy_game_object(obj)
    })
    this.game_objects.game_object.forEach(obj => {
      if(this.mode.is("play")) {
        obj.update_timers()
        obj.update()
        obj.floor_angular_velocity()
        obj.apply_inertia()
      }
      obj.update_cell_pos()
      obj.auto_cull()
      Hitbox.update(obj)
      Hitbox.draw(obj, this.graphics)
      Hitbox.draw_projections(obj, this.graphics)
      Sprite.update(obj)
    })
  }
  //#endregion

  //#region location loading
  unload_game_world() {
    //hide all sprites, music and heavy stuff, push this scene into the background, only keep a reference to this somewhere
    this.layers.fog.forEach(sprite => sprite.renderable = false)
    this.game_objects.forEach(obj => {
      obj.hide()
    })
  }
  load_game_world(location_id) {
    this.location = new GameLocation(location_id, this)
    this.location.load()
  }
  load_location(file) {
    this.state.set("loading")
    readTextFile("data/locations/" + this.name + ".json", (text) => {
      let d = JSON.parse(text)
      d.objects.forEach(obj => {
        GameObject.create(obj.type, obj.name, obj, {world: this})
      })
      this.generate_background()
      this.generate_fog(d.fog)
      this.state.revert()
    })
    if(!this.generated) this.generate()
  }
  //#endregion
}
