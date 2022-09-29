class DialogueNode {
  constructor(type, text, speaker, pos = new Vector(cw/2, ch/2), id, facts, options = {isPlayer: false}) {
    this.id = id || uniqueID(dialogueEditor.nodes)
    this.pos = pos.clone()
    this.type = type
    this.speaker = speaker
    this.text = text
    this.facts = facts || []
    this.in = []
    this.out = []
    dialogueEditor.nodes.push(this)
    if(type === "text") {
      if(options.isPlayer) this.createHTMLText(true)
      else this.createHTMLText(false)
    }
    if(type === "response-picker") {
      this.createHTMLResponsePicker()
    }
    if(type === "transfer") {
      this.createHTMLTransferNode()
    }
    this.update()
    this.reorderOutputs()
  }
  update() {
    this.element.style.left = this.pos.x + "px"
    this.element.style.top = this.pos.y + "px"
    this.element.querySelector(".fact-count").innerText = this.facts.length + " facts"
  }
  drag() {
    this.pos.add(mouse.clientMoved)
  }
  createHTMLText(isPlayer = false) {
    let node = El('div', "dialogue-node")
    let header = El('div', "dialogue-node-header")
    let widgetDrag = El("div", "dialogue-node-widget drag", [["title", "Drag node"]])
    let widgetRemove = El("div", "dialogue-node-widget remove", [["title", "Delete node"]])
    let widgetList = El("div", "dialogue-node-widget list", [["title", "Open facts list"]])
    let factCount = El("div", "fact-count")

    let wrapperOut = El('div', "dialogue-node-socket-wrapper out")
    let wrapperIn  = El('div', "dialogue-node-socket-wrapper in")
    
    let socketOut = El.special('node-socket-out')
    let socketIn = El.special('node-socket-in')

    let speaker = El('div', "dialogue-node-row dialogue-node-speaker", [["title", "Speaker"]])
    if(isPlayer) speaker.innerText = "player"
    else speaker.innerText = this.speaker
    let text = El('div', "dialogue-node-row dialogue-node-text-field", [["title", "Text"]], this.text)

    socketOut.dataset.index = this.out.length

    speaker.dataset.datatype = "speaker"
    speaker.dataset.id = this.id
    text.dataset.editable = "true"
    text.dataset.datatype = "text"
    wrapperOut.append(socketOut)
    wrapperIn.append(socketIn)

    header.append(widgetRemove, widgetDrag, widgetList)
    node.dataset.id = this.id
    node.append(header, speaker, text, factCount, wrapperOut, wrapperIn )

    dialogueEditor.element.append(node)
    this.element = node
  }
  createHTMLResponsePicker() {
    let node = El('div', "dialogue-node")
    let header = El('div', "dialogue-node-header")
    let widgetDrag = El("div", "dialogue-node-widget drag", [["title", "Drag node"]])
    let widgetRemove = El("div", "dialogue-node-widget remove", [["title", "Delete node"]])
    let widgetList = El("div", "dialogue-node-widget list", [["title", "Open facts list"]])
    let factCount = El("div", "fact-count")

    let wrapperIn  = El('div', "dialogue-node-socket-wrapper in")
    let wrapperOut = El('div', "dialogue-node-socket-wrapper out")
    
    let socketIn = El.special('node-socket-in')
    let socketOut = El.special('node-socket-out')

    socketOut.dataset.index = this.out.length
    wrapperOut.append(socketOut)
    wrapperIn.append(socketIn)
    header.append(widgetRemove, widgetDrag, widgetList)
    node.dataset.id = this.id
    node.append(header, factCount, wrapperIn, wrapperOut )

    dialogueEditor.element.append(node)
    this.element = node
  }
  createHTMLTransferNode() {
    let node = El('div', "dialogue-node")
    let header = El('div', "dialogue-node-header")
    let widgetDrag = El("div", "dialogue-node-widget drag", [["title", "Drag node"]])
    let widgetRemove = El("div", "dialogue-node-widget remove", [["title", "Delete node"]])
    let widgetList = El("div", "dialogue-node-widget list", [["title", "Open facts list"]])
    let factCount = El("div", "fact-count")

    let wrapperIn  = El('div', "dialogue-node-socket-wrapper in")
    let wrapperOut = El('div', "dialogue-node-socket-wrapper out")

    let socketIn = El.special('node-socket-in')
    let socketOut = El.special('node-socket-out')

    let cont = El('div', "dialogue-node-transfer-container")
    for(let i = 0; i < 2; i++) {
      let row = El("div", "dialogue-node-transfer")
      let speaker = El('div', "dialogue-node-row dialogue-node-speaker", [["title", "Speaker"]])
      let itemCont = El("div", "dialogue-node-item-container")
      let icon = El("div", "dialogue-node-icon plus hover-dark-02")
      let addButton = El("div", "dialogue-node-add-item")
      let items = [El("div", "dialogue-node-item empty"), El("div", "dialogue-node-item empty")]
      speaker.innerText = "Actor" + (i + 1)
      speaker.dataset.datatype = "speaker"
      speaker.dataset.id = this.id
      addButton.append(icon)
      icon.dataset.index = i
      itemCont.dataset.index = i
      itemCont.append(...items, addButton)
      row.append(speaker, itemCont)
      cont.append(row)
    }

    socketOut.dataset.index = this.out.length
    wrapperOut.append(socketOut)
    wrapperIn.append(socketIn)
    header.append(widgetRemove, widgetDrag, widgetList)
    node.dataset.id = this.id
    node.append(header, factCount, cont, wrapperIn, wrapperOut)

    dialogueEditor.element.append(node)
    this.element = node
    console.log(node)
  }
  reorderOutputs() {
    let sockets = Array.from(this.element.querySelectorAll(".dialogue-node-socket.out"))
    sockets.forEach(s => s.remove())
    let i = 0
    do {
      let socketOut = El.special('node-socket-out')
      socketOut.dataset.index = i
      this.element.querySelector(".dialogue-node-socket-wrapper.out").append(socketOut)
      i++
    } while (i < this.out.length + 1*(this.type === "response-picker"))

    this.out.forEach((node, index) => {
      node.index = index
    })
  }
  addFact(fact) {
    if(!fact) {
      alert('bad fact')
      return
    }
    if(this.facts.find(f => f.identifier === fact.identifier)) {
      console.log('fact already exists')
      return
    }
    let factCopy = _.cloneDeep(fact)
    console.log(this.facts)
    this.facts.push(factCopy)
    dialogueEditor.displayFacts(this)
  }
  deleteFact(identifier) {
    let fact = this.facts.find(f => f.identifier === identifier)
    if(fact) {
      this.facts.splice(this.facts.indexOf(fact), 1)
    }
    dialogueEditor.displayFacts(this)
  }
  createConnection(to) {
    if(this.type !== "response-picker") this.deleteOut()
    if(to.in.find(connection => connection.from.id === this.id)){ 
      console.log('already exists')
      return
    }
    if(to.out.find(connection => connection.to.id === this.id)) {
      console.log('already exists')
      return
    }
    let index = this.out.length
    let conn = {
      to: to,
      index: index,
    }
    
    this.out.push(conn)

    to.in.push({
      from: this
    })

    if(this.type === "response-picker") {
      this.reorderOutputs()
    }

    console.log('created conn')
  }
  deleteConnection(index) {
    let conn = this.out[index]
    console.log("connection index", index)
    let to = dialogueEditor.nodes.find(node => node.id === conn.to.id)
    let destinationRef = to.in.find(conn => conn.from.id === this.id)
    to.in.splice(to.in.indexOf(destinationRef), 1)
    this.out.splice(index, 1)
    this.reorderOutputs()
  }
  deleteIn() {
    this.in.forEach(conn => {
      let from = dialogueEditor.nodes.find(node => node.id === conn.from.id)
      let originRef = from.out.find(conn => conn.to.id === this.id)
      from.reorderOutputs()
      from.out.splice(from.out.indexOf(originRef), 1)
    })
    this.in = []
  }
  deleteOut() {
    this.out.forEach(conn => {
      let to = dialogueEditor.nodes.find(node => node.id === conn.to.id)
      let destinationRef = to.in.find(conn => conn.from.id === this.id)
      to.in.splice(to.in.indexOf(destinationRef), 1)
    })
    this.out = []
  }
  delete() {
    this.deleteIn()
    this.deleteOut()
    this.element.remove()
    dialogueEditor.factEditor.element.classList.add("hidden")
    dialogueEditor.nodes = dialogueEditor.nodes.filter(node => node !== this)
  }
}
