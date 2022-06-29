class Rigid extends Entity {
  constructor(pos = Vector.zero(), vel = Vector.zero(), rotation = 0, rotation_velocity = 0, hitbox) {
    super(pos, vel, rotation, rotation_velocity)
    if(typeof hitbox === "string") {
      readTextFile(`data/hitboxes/${hitbox}.json`, (text) => {
        let h = JSON.parse(text)
        if(debug.hitbox) console.log(h)
        if(h.type === "circle") {
          this.hitbox = new CircleHitbox(h.radius, h.color)
          this.hitbox_relative = _.cloneDeep(this.hitbox)
        }
        if(h.type === "polygon") {
          let bodies = []
          h.bodies.forEach(body => {
            bodies.push(new Polygon(body.vertices))
          })
          this.hitbox = new PolygonHitbox(bodies, h.color)
          this.hitbox_relative = _.cloneDeep(this.hitbox)
        }
        rigids.push(this)
        this.referenced_in.push(rigids)
      })
    }
    if(typeof hitbox === "object") {
      if(hitbox.type === "circle") {
        this.hitbox = new CircleHitbox(hitbox.radius)
      }
      if(hitbox.type === "polygon") {
        this.hitbox = new PolygonHitbox.default()
      }
      // this.hitbox = _.cloneDeep(hitbox)
      // this.hitbox_relative = _.cloneDeep(this.hitbox)
      rigids.push(this)
      this.referenced_in.push(rigids)
    }
    this.project_position = () => {
      this.projections = []
      let bb = this.hitbox.bb
      for (let i = 0; i < pathfinding.projection.iterations; i++) {
        let dir = this.vel.clone().mult(dt).mult(pathfinding.projection.timestretch)
        bb.x = Math.round(bb.x + dir.x)
        bb.y = Math.round(bb.y + dir.y)
        bb.w = Math.round(bb.w)
        bb.h = Math.round(bb.h)
        this.projections.push({...bb})
      }
    }
    this.projections = []
    this.timers = new Timer(
      ["project", 500, {loop: true, active: true, onfinish: this.project_position}]
    )
  }
  add_body(body) {
    if(!body) {console.log('please specify body'); return;}
    this.hitbox.bodies.push(body)
    this.hitbox_relative.bodies.push(_.cloneDeep(body))
  }
  offset_body(body, offset) {
    let [index_b, index_v] = this.get_indices(body, null)
    this.hitbox_relative.bodies[index_b].vertices.forEach(vert => {
      this.offset_vertex(vert, offset)
    })
  }
  remove_body(body) {
    let ind = this.hitbox.bodies.indexOf(body)
    this.hitbox_relative.bodies.splice(ind, 1)
    this.hitbox = _.cloneDeep(this.hitbox_relative)
  }
  add_vertex(body) {
    let ind = this.hitbox.bodies.indexOf(body)
    let b = this.hitbox_relative.bodies[ind]
    let first = b.vertices[0]
    let second = b.vertices[1]

    let diff = new Vector(first.x - second.x, first.y - second.y)
    diff.mult(0.5)
    b.vertices.push(
      {
        x: first.x + diff.x,
        y: first.y + diff.y
      }
    )
    this.hitbox = _.cloneDeep(this.hitbox_relative)
  }
  offset_vertex(vert, offset) {
    vert.x += offset.x
    vert.y += offset.y
  }
  move_point( body, point, offset) {
    let [index_b, index_v] = this.get_indices(body, point)
    let vert = this.hitbox_relative.bodies[index_b].vertices[index_v]
    this.offset_vertex(vert, offset)
  }
  get_indices(body, point) {
    return [this.hitbox.bodies.indexOf(body), body.vertices.indexOf(point)]
  }
  remove_point(body, point) {
    if(body.vertices.length <= 3) return
    let [index_b, index_v] = this.get_indices(body, point)
    let vert = this.hitbox_relative.bodies[index_b].vertices[index_v]
    this.hitbox_relative.bodies[index_b].vertices.splice(index_v, 1)
    this.hitbox = _.cloneDeep(this.hitbox_relative)
  }
  update() {
    
  }
}