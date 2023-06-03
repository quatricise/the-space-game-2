class FogGenerator extends GameObject {
  constructor(transform, parent, fogData) {
    super(transform)
  }
  update() {
    this.transform.position.set(this.parent.transform.position)
  }
}