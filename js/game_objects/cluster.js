class Cluster extends GameObject {
  constructor(transform) {
    super(transform)
    this.objects = []
  }
  add(...objects) {
    this.objects.push(...objects)
  }
  remove(...objects) {
    objects.forEach(obj => this.objects.remove(obj))
  }
  calculate_center() {
    let vectors = this.objects.map(o => o.transform.position)
    if(vectors.length === 0) return
    this.transform.position.set_from(Vector.avg(...vectors))
  }
  rotation_update() {
    this.transform.rotation += this.transform.angular_velocity
    this.wrap_rotation()
  }
  update() {
    this.calculate_center()
    this.rotation_update()
    this.objects.forEach(obj => {
      obj.transform.angular_velocity = 0
      obj.transform.position.rotate_around(this.transform.position, this.transform.angular_velocity)
    })
  }
  destroy() {
    
  }
}