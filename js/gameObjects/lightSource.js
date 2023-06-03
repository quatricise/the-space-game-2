class LightSource extends GameObject {
  constructor(transform, name, parent, lightData = {}) {
    super(transform)
    let objectData = {hitbox: {filename: null, type: "circle", definition: {radius: lightData.radius}}}
    this.type = "lightSource"
    this.name = name
    this.parent = parent

    this.lightData = lightData
    this.color = Number(lightData.color)
    this.radius = lightData.radius
    this.components = ["hitbox"]
    this.registerComponents(objectData)
    this.update()
  }
  update() {
    this.transform.position.setFrom(this.parent.transform.position)
  }
}