class QuestDesigner extends GameWindow {
  constructor() {
    super("QuestDesigner", Q("#quest-designer"))
    this.nodes = []
    this.activeNode = []
    this.state = new State(
      "default",
    )
    this.edit = {
      active: false,
      object: null,
    }
    this.drag = {
      active: false,
      object: null,
      origin: new Vector()
    }
    this.pan = {
      active: false,
    }
  }
  handleMousedown(event) {
    switch(event.button) {
      case 0: {this.handleLeftDown(event);   break}
      case 1: {this.handleMiddleDown(event); break}
      case 2: {this.handleRightDown(event);  break}
    }
  }
  handleLeftDown(event) {
    let target = event.target
    if(target === this.element) {
      this.createNode("quest")
    }
    if(target.closest(".quest-node")) {
      this.setActiveNode(target.closest(".quest-node"))
    }
    if(target.closest(".quest-node-widget.drag")) {
      this.dragBegin(target.closest(".quest-node"))
    }
  }
  handleMiddleDown(event) {
    this.pan.active = true
  }
  handleRightDown(event) {

  }
  handleMousemove(event) {
    if(this.drag.active) {
      this.dragUpdate()
    }
    if(this.pan.active) {
      this.panNodes()
    }
  }
  handleMouseup(event) {
    switch(event.button) {
      case 0: { this.handleLeftUp(event);   break }
      case 1: { this.handleMiddleUp(event); break }
      case 2: { this.handleRightUp(event);  break }
    }
  }
  handleLeftUp(event) {
    this.dragEnd()
  }
  handleMiddleUp(event) {
    this.pan.active = false
  }
  handleRightUp(event) {
    
  }
  handleWheel(event) {
    let target = event.target

    if(target === this.element) {
      this.scrollNodes(event.deltaY * -1)
    }
  }
  dragBegin(element) {
    this.drag.active = true
    this.drag.object = this.getNodeByElement(element)
    this.drag.origin.setFrom(mouse.clientPosition)
  }
  dragUpdate() {
    this.drag.object.move(mouse.clientMoved)
  }
  dragEnd() {
    this.drag.active = false
    this.drag.object = null
    this.drag.origin.set(0)
  }
  panNodes() {
    this.nodes.forEach(node => node.move(mouse.clientMoved))
  }
  scrollNodes(amount) {
    this.nodes.forEach(node => node.move(new Vector(0, amount)))
  }
  setActiveNode(element) {
    this.activeNode = this.getNodeByElement(element)
  }
  getNodeByElement(element) {
    return this.nodes.find(node => node.elements.container === element)
  }
  createNode(type) {
    let 
    node = new QuestNode(type, {})
    node.position.setFrom(mouse.clientPosition)
    node.moveHTML()

    this.nodes.push(node)
  }
  destroyNode(node) {
    node.destroy()
    this.nodes.remove(node)
  }
}