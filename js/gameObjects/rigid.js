class Rigid extends GameObject {
  constructor(transform, hitbox) {
    super(transform)
    this.type = "rigid"
    if(typeof hitbox === "string") {
      readTextFile(`data/hitboxes/${hitbox}.json`, (text) => {
        let h = JSON.parse(text)
        if(debug.hitbox) console.log(h)
        if(h.type === "circle") {
          this.hitbox = new CircleHitbox(h.radius, h.color)
          this.hitboxRelative = _.cloneDeep(this.hitbox)
        }
        if(h.type === "polygon") {
          let bodies = []
          h.bodies.forEach(body => {
            bodies.push(new Polygon(body.vertices))
          })
          this.hitbox = new PolygonHitbox(bodies, h.color)
          this.hitboxRelative = _.cloneDeep(this.hitbox)
        }
      })
    }
    if(typeof hitbox === "object") {
      if(hitbox.type === "circle") {
        this.hitbox = new CircleHitbox(hitbox.radius)
        this.hitboxRelative = _.cloneDeep(this.hitbox)
      }
      if(hitbox.type === "polygon") {
        this.hitbox = PolygonHitbox.default()
        this.hitboxRelative = _.cloneDeep(this.hitbox)
      }
    }
    if(!hitbox) {
      this.hitbox = PolygonHitbox.default()
      this.hitboxRelative = _.cloneDeep(this.hitbox)
    }
    this.projectPosition = () => {
      this.projections = []
      let bb = this.hitbox.boundingBox
      for (let i = 0; i < data.pathfinding.projection.iterations; i++) {
        let dir = this.vel.clone().mult(dt).mult(data.pathfinding.projection.timestretch)
        bb.x = Math.round(bb.x + dir.x)
        bb.y = Math.round(bb.y + dir.y)
        bb.w = Math.round(bb.w)
        bb.h = Math.round(bb.h)
        this.projections.push({...bb})
      }
    }
    this.projections = []
    this.timers = new Timer(
      ["project", 500, {loop: true, active: true, onfinish: this.projectPosition}]
    )
  }
  addBody(body) {
    if(!body) {console.log('please specify body'); return;}
    this.hitbox.bodies.push(body)
    this.hitboxRelative.bodies.push(_.cloneDeep(body))
  }
  offsetBody(body, offset) {
    let [indexB, indexV] = this.getIndices(body, null)
    this.hitboxRelative.bodies[indexB].vertices.forEach(vert => {
      this.offsetVertex(vert, offset)
    })
  }
  removeBody(body) {
    let ind = this.hitbox.bodies.indexOf(body)
    this.hitboxRelative.bodies.splice(ind, 1)
    this.hitbox = _.cloneDeep(this.hitboxRelative)
  }
  addVertex(body) {
    let ind = this.hitbox.bodies.indexOf(body)
    let b = this.hitboxRelative.bodies[ind]
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
    this.hitbox = _.cloneDeep(this.hitboxRelative)
  }
  offsetVertex(vert, offset) {
    vert.x += offset.x
    vert.y += offset.y
  }
  movePoint( body, point, offset) {
    let [indexB, indexV] = this.getIndices(body, point)
    let vert = this.hitboxRelative.bodies[indexB].vertices[indexV]
    this.offsetVertex(vert, offset)
  }
  getIndices(body, point) {
    return [this.hitbox.bodies.indexOf(body), body.vertices.indexOf(point)]
  }
  removePoint(body, point) {
    if(body.vertices.length <= 3) return
    let [indexB, indexV] = this.getIndices(body, point)
    let vert = this.hitboxRelative.bodies[indexB].vertices[indexV]
    this.hitboxRelative.bodies[indexB].vertices.splice(indexV, 1)
    this.hitbox = _.cloneDeep(this.hitboxRelative)
  }
  update() {
    
  }
}