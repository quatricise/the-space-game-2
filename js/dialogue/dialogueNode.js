class DialogueNode {
  constructor(type, text, speaker, pos = new Vector(cw/2, ch/2), id, criteria, options = {labels: null, factsToSet: null}, transfer, recipient) {
    this.id = id || uniqueID(dialogueEditor.nodes)
    this.pos = pos.clone()
    this.type = type
    this.speaker = speaker || null
    this.recipient = recipient || null
    this.text = text
    this.criteria = criteria ?? []
    this.factsToSet = options.factsToSet ?? []
    this.labels = {
      lie:        options.labels?.lie || false,
      exaggerate: options.labels?.exaggerate || false,
    }
    this.in = []
    this.out = []
    this.transfer = transfer ?? [
      {
        owner: "player",
        items: [
          "",
        ]
      },
      {
        owner: "player",
        items: [
          "",
        ]
      },
    ]
    dialogueEditor.nodes.push(this)
    this["createHTML" + type.capitalize()]()
    this.update()
    this.reorderOutputs()
    console.log("new node")
  }
  drag() {
    this.pos.add(mouse.clientMoved)
  }
  createHTML() {
    /* header */
    let node =                El('div', "dialogue-node")
    let header =              El('div', "dialogue-node-header")
    let nodeTitle =           El('div', "dialogue-node-title", undefined, "Fact setter")
    let widgetDrag =          El("div", "dialogue-node-widget drag", [["title", "Drag node"]])
    let widgetRemove =        El("div", "dialogue-node-widget remove", [["title", "Delete node"]])
    let widgetList =          El("div", "dialogue-node-widget list", [["title", "Open facts list"]])
    let factCount =           El("div", "fact-count")
    let filler =              El("div", "filler")
    
    /* sockets */
    let wrapperOut = El('div', "dialogue-node-socket-wrapper out")
    let wrapperIn  = El('div', "dialogue-node-socket-wrapper in")
    let socketOut = El.special('node-socket-out')
    let socketIn = El.special('node-socket-in')

    this["createHTML" + type.capitalize()]()

    //wrap up
    
    //finish node creation
  }
  createHTMLText() {
    let node =                El('div', "dialogue-node")
    let header =              El('div', "dialogue-node-header")
    let widgetDrag =          El("div", "dialogue-node-widget drag", [["title", "Drag node"]])
    let widgetRemove =        El("div", "dialogue-node-widget remove", [["title", "Delete node"]])
    let widgetList =          El("div", "dialogue-node-widget list", [["title", "Open facts list"]])
    let factCount =           El("div", "fact-count")
    let labels =              El("div", "dialogue-node-label-container")
    let lieLabel =            El("div", "dialogue-node-label", [["title", "The player is lying"]], "Lie")
    let exaggerateLabel =     El("div", "dialogue-node-label", [["title", "The player is exaggerating"]], "Exaggerate")

    if(this.labels.lie)
      lieLabel.classList.add("active")
    if(this.labels.exaggerate)
      exaggerateLabel.classList.add("active")

    let wrapperOut = El('div', "dialogue-node-socket-wrapper out")
    let wrapperIn  = El('div', "dialogue-node-socket-wrapper in")
    
    let socketOut = El.special('node-socket-out')
    let socketIn = El.special('node-socket-in')

    let speaker = El('div', "dialogue-node-row dialogue-node-speaker", [["title", "Speaker"]], this.speaker)
    let text = El('div', "dialogue-node-row dialogue-node-text-field", [["title", "Text"]], this.text)

    socketOut.dataset.index = this.out.length

    speaker.dataset.datatype = "speaker"
    speaker.dataset.id = this.id
    text.dataset.editable = "true"
    text.dataset.datatype = "text"
    lieLabel.dataset.nodelabel = "lie"
    exaggerateLabel.dataset.nodelabel = "exaggerate"

    wrapperOut.append(socketOut)
    wrapperIn.append(socketIn)

    header.append(widgetRemove, widgetDrag, widgetList)
    labels.append(lieLabel, exaggerateLabel)
    node.dataset.id = this.id
    node.append(header, speaker, text, factCount, labels, wrapperOut, wrapperIn )

    dialogueEditor.element.append(node)
    this.element = node
  }
  createHTMLPass() {
    let node =                El('div', "dialogue-node")
    let header =              El('div', "dialogue-node-header")
    let widgetDrag =          El("div", "dialogue-node-widget drag", [["title", "Drag node"]])
    let widgetRemove =        El("div", "dialogue-node-widget remove", [["title", "Delete node"]])
    let widgetList =          El("div", "dialogue-node-widget list", [["title", "Open facts list"]])
    let factCount =           El("div", "fact-count")
    
    let wrapperOut = El('div', "dialogue-node-socket-wrapper out")
    let wrapperIn  = El('div', "dialogue-node-socket-wrapper in")
    
    let socketOut = El.special('node-socket-out')
    let socketIn = El.special('node-socket-in')

    let speaker = El('div', "dialogue-node-row dialogue-node-speaker", [["title", "Speaker"]], this.speaker)
    let text = El('div', "dialogue-node-row dialogue-node-row-informational", [["title", "Text"]], "Speaker says nothing.")

    socketOut.dataset.index = this.out.length

    speaker.dataset.datatype = "speaker"
    speaker.dataset.id = this.id

    wrapperOut.append(socketOut)
    wrapperIn.append(socketIn)

    header.append(widgetRemove, widgetDrag, widgetList)
    node.dataset.id = this.id
    node.append(header, speaker, text, factCount, wrapperOut, wrapperIn )

    dialogueEditor.element.append(node)
    this.element = node
  }
  createHTMLWhisper() {
    let node =                El('div', "dialogue-node")
    let header =              El('div', "dialogue-node-header")
    let widgetDrag =          El("div", "dialogue-node-widget drag", [["title", "Drag node"]])
    let widgetRemove =        El("div", "dialogue-node-widget remove", [["title", "Delete node"]])
    let widgetList =          El("div", "dialogue-node-widget list", [["title", "Open facts list"]])
    let factCount =           El("div", "fact-count")
    
    let wrapperOut = El('div', "dialogue-node-socket-wrapper out")
    let wrapperIn  = El('div', "dialogue-node-socket-wrapper in")
    let socketOut = El.special('node-socket-out')
    let socketIn = El.special('node-socket-in')

    let speaker = El('div', "dialogue-node-row dialogue-node-speaker", [["title", "Speaker"]], this.speaker)
    let recipient = El('div', "dialogue-node-row dialogue-node-speaker", [["title", "Speaker"]], this.recipient)

    let text = El('div', "dialogue-node-row dialogue-node-text-field", [["title", "Text"]], this.text)

    socketOut.dataset.index = this.out.length

    speaker.dataset.datatype = "speaker"
    speaker.dataset.id = this.id
    recipient.dataset.datatype = "recipient"
    recipient.dataset.id = this.id
    text.dataset.editable = "true"
    text.dataset.datatype = "text"

    wrapperOut.append(socketOut)
    wrapperIn.append(socketIn)

    header.append(widgetRemove, widgetDrag, widgetList)
    node.dataset.id = this.id
    node.append(header, speaker, recipient, text, factCount, wrapperOut, wrapperIn )

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
    node.dataset.id = this.id
    wrapperOut.append(socketOut)
    wrapperIn.append(socketIn)
    header.append(widgetRemove, widgetDrag, widgetList)
    node.append(header, factCount, wrapperIn, wrapperOut )

    dialogueEditor.element.append(node)
    this.element = node
  }
  createHTMLTransfer() {
    let node = El('div', "dialogue-node")
    let header = El('div', "dialogue-node-header")
    let widgetDrag = El("div", "dialogue-node-widget drag", [["title", "Drag node"]])    
    let nodeTitle =  El('div', "dialogue-node-title", undefined, "Transfer")
    let widgetRemove = El("div", "dialogue-node-widget remove", [["title", "Delete node"]])
    let widgetList = El("div", "dialogue-node-widget list", [["title", "Open facts list"]])
    let factCount = El("div", "fact-count")
    let filler =    El("div", "filler")
    let wrapperIn  = El('div', "dialogue-node-socket-wrapper in")
    let wrapperOut = El('div', "dialogue-node-socket-wrapper out")

    let socketIn = El.special('node-socket-in')
    let socketOut = El.special('node-socket-out')

    let cont = El('div', "dialogue-node-transfer-container")

    //create the person rows
    for(let i = 0; i < 2; i++) {
      let row = El("div", "dialogue-node-transfer")
      let speaker = El('div', "dialogue-node-row dialogue-node-speaker", [["title", "Owner of these items"]])
      let itemCont = El("div", "dialogue-node-item-container")
      let icon = El("div", "dialogue-node-icon plus hover-dark-02")
      let addButton = El("div", "dialogue-node-add-item",  [["title", "Add new item slot"]])

      //for each item in both rows of transfer, add an item element into this array
      let items = this.transfer[i].items.map(item => {
        return El("div", "dialogue-node-item empty", [["title", "Click to select an item"]])
      })

      row.dataset.personindex = i

      speaker.innerText = this.transfer[i].owner
      speaker.dataset.datatype = "speaker"
      speaker.dataset.speaker = this.transfer[i].owner
      speaker.dataset.id = this.id

      icon.dataset.personindex = i
      itemCont.dataset.personindex = i

      items.forEach((item, index) => {
        item.dataset.itemindex = index
        item.dataset.datatype = "item"
        item.dataset.item = this.transfer[i].items[index]
      })

      this.transfer[i].items.forEach((item, index) => {
        if(item == "") return
        let thumbnail = new Image()
            thumbnail.src = "assets/item/" + item + ".png"
        items[index].append(thumbnail)
      })

      addButton.append(icon)
      itemCont.append(...items, addButton)
      row.append(speaker, itemCont)
      cont.append(row)
    }

    socketOut.dataset.index = this.out.length
    wrapperOut.append(socketOut)
    wrapperIn.append(socketIn)
    header.append(widgetRemove, widgetDrag, widgetList, filler, nodeTitle)
    node.dataset.id = this.id
    node.append(header, factCount, cont, wrapperIn, wrapperOut)

    dialogueEditor.element.append(node)
    this.element = node
    console.log(node)
  }
  createHTMLAggression() {
    let node =                El('div', "dialogue-node aggression")
    let header =              El('div', "dialogue-node-header")
    let nodeTitle =           El('div', "dialogue-node-title", undefined, "Aggression")
    let widgetDrag =          El("div", "dialogue-node-widget drag", [["title", "Drag node"]])
    let widgetRemove =        El("div", "dialogue-node-widget remove", [["title", "Delete node"]])
    let widgetList =          El("div", "dialogue-node-widget list", [["title", "Open facts list"]])
    let factCount =           El("div", "fact-count")
    let filler =              El("div", "filler")
    
    let wrapperOut = El('div', "dialogue-node-socket-wrapper out")
    let wrapperIn  = El('div', "dialogue-node-socket-wrapper in")
    
    let socketOut = El.special('node-socket-out')
    let socketIn = El.special('node-socket-in')

    let speaker = El('div', "dialogue-node-row dialogue-node-speaker", [["title", "Speaker"]], this.speaker)
    let text = El('div', "dialogue-node-row dialogue-node-row-informational", [["title", "Text"]], "Speaker turns on you. This ends the dialogue.")

    socketOut.dataset.index = this.out.length

    speaker.dataset.datatype = "speaker"
    speaker.dataset.id = this.id

    wrapperOut.append(socketOut)
    wrapperIn.append(socketIn)

    header.append(widgetRemove, widgetDrag, widgetList, filler, nodeTitle)
    node.dataset.id = this.id
    node.append(header, speaker, text, factCount, wrapperOut, wrapperIn )

    dialogueEditor.element.append(node)
    this.element = node
  }
  createHTMLFactSetter() {
    /* header */
    let node =                El('div', "dialogue-node")
    let header =              El('div', "dialogue-node-header")
    let nodeTitle =           El('div', "dialogue-node-title", undefined, "Fact setter")
    let widgetDrag =          El("div", "dialogue-node-widget drag", [["title", "Drag node"]])
    let widgetRemove =        El("div", "dialogue-node-widget remove", [["title", "Delete node"]])
    let widgetList =          El("div", "dialogue-node-widget list", [["title", "Open facts list"]])
    let factCount =           El("div", "fact-count")
    let filler =              El("div", "filler")

    let factContainer =       El("div", "dialogue-node-fact-container")
    let addFactButton =       El("div", "dialogue-node-add-fact-button ui-graphic")

    let wrapperOut =          El('div', "dialogue-node-socket-wrapper out")
    let wrapperIn  =          El('div', "dialogue-node-socket-wrapper in")
    let socketOut =           El.special('node-socket-out')
    let socketIn =            El.special('node-socket-in')

    socketOut.dataset.index = this.out.length

    wrapperOut.append(socketOut)
    wrapperIn.append(socketIn)

    header.append(widgetRemove, widgetDrag, widgetList, filler, nodeTitle)
    node.dataset.id = this.id
    node.append(header, factContainer, addFactButton, factCount, wrapperOut, wrapperIn )

    dialogueEditor.element.append(node)
    this.element = node

    this.refreshHTML()
  }
  addSetterFact(id, identifier = "fact_identifier", value = true) {
    this.factsToSet.push(Fact.createSetterFact(id, identifier, value))
    this.refreshHTML()
  }
  createSetterFactHTML(index, identifier, value) {
    let container = this.element.querySelector(".dialogue-node-fact-container")
    let row = El("div", "dialogue-node-fact-row", [["data-factindex", index]])
    let identifierElement = El("div", "dialogue-node-fact-identifier", [["data-editable", "true"], ["data-datatype", "nodeFactIdentifier"]], identifier)
    let valueElement = El("div", `dialogue-node-fact-value ${value}`,    [["data-editable", "true"], ["data-datatype", "factValue"], ["data-isboolean", "true"]], value)
    let deleteButton = El("div", "dialogue-node-fact-delete-button ui-graphic")

    row.append(identifierElement, valueElement, deleteButton)
    container.append(row)
  }
  flipSetterFact(index) {
    this.factsToSet[index].value = !this.factsToSet[index].value
    this.refreshHTML()
  }
  setFactIdentifier(index, identifier) {
    this.factsToSet[index].identifier = identifier
  }
  removeSetterFact(index) {
    console.log("remove setter fact")
    this.factsToSet.splice(index, 1)
    this.refreshHTML()
  }
  refreshHTML() {
    this[`refresh${this.type.capitalize()}HTML`]()
  }
  refreshFactSetterHTML() {
    this.element.querySelector(".dialogue-node-fact-container").innerHTML = ""
    this.factsToSet.forEach((fact, index) => this.createSetterFactHTML(index, fact.identifier, fact.value))
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
    } while (i < this.out.length + 1*(this.type === "responsePicker"))

    this.out.forEach((node, index) => {
      node.index = index
    })
  }
  createConnection(to) {
    if(this.type !== "responsePicker") 
      this.deleteOut()
    if(to.in.find(connection => connection.from.id === this.id)) return
    if(to.out.find(connection => connection.to.id === this.id)) return
    let index = this.out.length
    let conn = {to, index}
    this.out.push(conn)

    to.in.push({from: this})

    if(this.type === "responsePicker")
      this.reorderOutputs()
  }
  deleteConnection(index) {
    let conn = this.out[index]
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
      to.in.remove(destinationRef)
    })
    this.out = []
  }
  delete() {
    this.deleteIn()
    this.deleteOut()
    this.element.remove()
    dialogueEditor.unsetActiveNode()
    dialogueEditor.nodes = dialogueEditor.nodes.filter(node => node !== this)
  }
  update() {
    this.element.style.left = this.pos.x + "px"
    this.element.style.top = this.pos.y + "px"
    this.element.querySelector(".fact-count").innerText = this.criteria.length + " criteria"
  }
  static types = [
    "text",
    "responsePicker",
    "transfer",
    "whisper",
    "pass",
    "aggression",
    "factSetter",
  ]
}
