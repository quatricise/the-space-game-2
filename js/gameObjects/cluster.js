class Cluster extends GameObject {
  constructor(transform) {
    super(transform)
    this.objects = []
    this.type = "cluster"
    this.name = "Cluster"
  }
  add(...objects) {
    this.objects.push(...objects)
  }
  remove(...objects) {
    objects.forEach(obj => this.objects.remove(obj))
  }
  calculateCenter() {
    let vectors = this.objects.map(o => o.transform.position)
    if(vectors.length === 0) return
    this.transform.position.setFrom(Vector.avg(...vectors))
  }
  rotationUpdate() {
    this.transform.rotation += this.transform.angularVelocity
    this.wrapRotation()
  }
  update() {
    this.calculateCenter()
    this.rotationUpdate()
    this.objects.forEach(obj => {
      obj.transform.angularVelocity = 0
      obj.transform.position.rotateAround(this.transform.position, this.transform.angularVelocity)
    })
  }
  destroy() {
    
  }
}