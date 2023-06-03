class QuestNode {
  constructor(type, nodeData = {}) {
    this.type = type
    this.position = new Vector()
    this.elements = {}
    this.interactionSets = []
    this.createHTML()
  }
  createHTML() {
    /* node body and header */
    let container =       El("div", "quest-node")
    let widgetDrag =      El("div", "quest-node-widget drag")
    let widgetRemove =    El("div", "quest-node-widget remove", [["title", "Delete node"]])
    let header =          El('div', "quest-node-header")
    let title =           El("div", "quest-node-title", undefined, "Quest node")
    let filler =          El('div', "filler")
    let body =            El("div", "quest-node-body")

    this.elements.container =     container
    this.elements.header =        header
    this.elements.widgetDrag =    widgetDrag
    this.elements.widgetRemove =  widgetRemove
    this.elements.body =          body

    /* type-specific */
    this[`create${this.type.capitalize()}NodeHTML`]()
    
    /* node sockets */
    let wrapperOut = El('div', "quest-node-socket-wrapper out")
    let wrapperIn  = El('div', "quest-node-socket-wrapper in")
    let socketOut = El.special('node-socket-out')
    let socketIn = El.special('node-socket-in')

    /* append everything */
    wrapperIn.append(socketIn)
    wrapperOut.append(socketOut)
    header.append(title, filler, widgetDrag, widgetRemove)
    container.append(header, wrapperOut, wrapperIn)
    questDesigner.element.append(container)
  }
  createQuestNodeHTML() {
    let interactionSets = El("div", "interaction-set-container")

    this.elements.body.append(interactionSets)
  }
  createRouterNodeHTML() {

  }
  move(vector) {
    this.position.add(vector)
    this.moveHTML()
  }
  moveHTML() {
    this.elements.container.style.left = this.position.x  + "px"
    this.elements.container.style.top  = this.position.y  + "px"
  }
  update() {

  }
  destroy() {
    this.elements.container.remove()
  }
  static types = {
    quest: true,
    router: true,
  }
}
