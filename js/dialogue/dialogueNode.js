class DialogueNode {
  constructor(type, text, speaker, pos = new Vector(cw/2, ch/2), id, criteria, options = {labels: null, factsToSet: null, tree: null, preconditions: null, preconditionLogic: null}, transfer, recipient) {
    this.id = id || uniqueID(dialogueEditor.nodes)
    this.pos = pos.clone()
    this.type = type
    this.speaker = speaker || null
    this.recipient = recipient || null
    this.tree = options.tree ?? null
    this.text = text
    this.criteria = criteria ?? []
    this.factsToSet = options.factsToSet ?? []
    this.labels = {
      lie:        options.labels?.lie         || false,
      exaggerate: options.labels?.exaggerate  || false,
    }
    this.in = []
    this.out = []
    this.transfer = transfer ?? [{owner: "player", items: [""]}, {owner: "player", items: [""]}]

    /* this contains a set of node IDs that are required to run through before this node is accepted */
    this.preconditions = new Set()
    if(Array.isArray(options.preconditions)) {
      options.preconditions.forEach(value => this.preconditions.add(value))
    } 
    /* the logical operation used, OR or AND are accepted */
    this.preconditionLogic =  options.preconditionLogic ?? "OR"

    dialogueEditor.nodes.push(this)
    this.createHTML()
    this.update()
    this.reorderOutputs()
  }
  drag() {
    this.pos.add(mouse.clientMoved)
  }
  //#region create HTML
  createHTML() {
    /* header */
    let node =                    El('div', "dialogue-node")
    let header =                  El('div', "dialogue-node-header")
    // let nodeTitle =               El('div', "dialogue-node-title", undefined, this.type.capitalize().splitCamelCase())
    let nodeTitle =               El('div', "dialogue-node-title", [["title", this.type.capitalize().splitCamelCase() + " Node"]])
    let nodeIcon =                new Image()
    // let widgetDrag =              El("div", "dialogue-node-widget drag",                    [["title", "Drag node"]])
    let widgetRemove =            El("div", "dialogue-node-widget remove",                  [["title", "Delete node"]])
    let widgetList =              El("div", "dialogue-node-widget list",                    [["title", "Open facts list"]])
    let widgetPrecondition =      El("div", "dialogue-node-widget precondition",            [["title", "Set preconditions"]])
    let widgetPreconditionLogic = El("div", "dialogue-node-widget precondition-logic or",   [["title", "Set logical operation for preconditions"]])
    let factCount =               El("div", "fact-count")
    let filler =                  El("div", "filler")
    let content =                 El("div", "dialogue-node-content")
    
    /* sockets */
    let wrapperOut =  El('div', "dialogue-node-socket-wrapper out")
    let wrapperIn  =  El('div', "dialogue-node-socket-wrapper in")
    let socketOut =   El.special('node-socket-out')
    let socketIn =    El.special('node-socket-in')
    socketOut.dataset.index = this.out.length

    nodeIcon.classList.add("dialogue-node-icon")
    nodeIcon.src = `assets/icons/iconNodeType${this.type.capitalize()}.png`
    nodeIcon.style.filter = "opacity(0.5)"

    /* append stuff */
    nodeTitle.append(nodeIcon)
    header.append(widgetRemove, widgetPrecondition, widgetPreconditionLogic, filler, nodeTitle)
    node.append(header, content, factCount, wrapperOut, wrapperIn)
    wrapperOut.append(socketOut)
    wrapperIn.append(socketIn)

    /* this is used for attaching the variable features of each specific node */
    this.nodeHTMLContent = content

    dialogueEditor.element.append(node)
    this.element = node
    node.dataset.id = this.id

    /* nodetype-specific features */
    this["createHTML" + this.type.capitalize()]()

    /* attach thumbnails to person fields */
    Array.from(this.element.querySelectorAll(".dialogue-node-speaker")).forEach(element => {
      this.setPersonThumbnail(element, element.innerText)
    })
  }
  setPersonThumbnail(element, person) {
    let 
    thumbnail = new Image()
    thumbnail.src = `assets/portraits/${person}.png`
    thumbnail.style.height = "32px"
    thumbnail.style.marginRight = "5px"
    element.prepend(thumbnail)

    /* dim if it's the field is assigned to empty character */
    person === "empty" || person === "dummyCaptain" ? thumbnail.style.filter = "opacity(0.33)" : thumbnail.style.filter = ""
  }
  createHTMLText() {
    let labels =                El("div", "dialogue-node-label-container")
    let lieLabel =              El("div", "dialogue-node-label", [["title", "The player is lying"]], "Lie")
    let exaggerateLabel =       El("div", "dialogue-node-label", [["title", "The player is exaggerating"]], "Exaggerate")
    let speaker =               El('div', "dialogue-node-row dialogue-node-speaker", [["title", "Speaker"]], this.speaker)
    let text =                  El('div', "dialogue-node-row dialogue-node-text-field", [["title", "Text"]], this.text)

    if(this.labels.lie)         lieLabel.classList.add("active")
    if(this.labels.exaggerate)  exaggerateLabel.classList.add("active")

    speaker.dataset.datatype = "speaker"
    speaker.dataset.id = this.id
    text.dataset.editable = "true"
    text.dataset.datatype = "text"
    lieLabel.dataset.nodelabel = "lie"
    exaggerateLabel.dataset.nodelabel = "exaggerate"

    labels.append(lieLabel, exaggerateLabel)
    this.nodeHTMLContent.append(speaker, text, labels)
  }
  createHTMLPass() {
    let speaker = El('div', "dialogue-node-row dialogue-node-speaker", [["title", "Speaker"]], this.speaker)
    let text =    El('div', "dialogue-node-row dialogue-node-row-informational", [["title", "Text"]], "Speaker says nothing.")

    speaker.dataset.datatype = "speaker"
    speaker.dataset.id = this.id
    this.nodeHTMLContent.append(speaker, text)
  }
  createHTMLWhisper() {
    let speaker =   El('div', "dialogue-node-row dialogue-node-speaker", [["title", "Speaker"]], this.speaker)
    let recipient = El('div', "dialogue-node-row dialogue-node-speaker", [["title", "Speaker"]], this.recipient)
    let text =      El('div', "dialogue-node-row dialogue-node-text-field", [["title", "Text"]], this.text)

    speaker.dataset.datatype = "speaker"
    speaker.dataset.id = this.id
    recipient.dataset.datatype = "recipient"
    recipient.dataset.id = this.id
    text.dataset.editable = "true"
    text.dataset.datatype = "text"
    this.nodeHTMLContent.append(speaker, recipient, text)
  }
  createHTMLResponsePicker() {

  }
  createHTMLTransfer() {
    let cont = El('div', "dialogue-node-transfer-container")
    /* create the person rows */
    for(let i = 0; i < 2; i++) {
      let row =       El("div", "dialogue-node-transfer")
      let speaker =   El('div', "dialogue-node-row dialogue-node-speaker", [["title", "Owner of these items"]])
      let itemCont =  El("div", "dialogue-node-item-container")
      let icon =      El("div", "dialogue-node-icon plus hover-dark-02")
      let addButton = El("div", "dialogue-node-add-item",  [["title", "Add new item slot"]])

      /* for each item in both rows of transfer, add an item element into this array */
      let items = this.transfer[i].items.map(() => {
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
            thumbnail.src = `assets/${data.item[item].folder ?? "item"}/${item}.png`
        items[index].append(thumbnail)
      })

      addButton.append(icon)
      itemCont.append(...items, addButton)
      row.append(speaker, itemCont)
      cont.append(row)
    }
    this.nodeHTMLContent.append(cont)
  }
  createHTMLAggression() {
    let speaker = El('div', "dialogue-node-row dialogue-node-speaker", [["title", "Speaker"]], this.speaker)
    let text =    El('div', "dialogue-node-row dialogue-node-row-informational", [["title", "Text"]], "Speaker turns on you. This ends the dialogue.")
    speaker.dataset.datatype = "speaker"
    speaker.dataset.id = this.id
    this.nodeHTMLContent.append(speaker, text)
  }
  createHTMLFactSetter() {
    let factContainer = El("div", "dialogue-node-fact-container")
    let addFactButton = El("div", "dialogue-node-add-fact-button ui-graphic")
    this.nodeHTMLContent.append(factContainer, addFactButton)
    this.refreshHTML()
  }
  createHTMLTree() {
    let text = El('div', "dialogue-node-row dialogue-node-tree-row", [["title", "Text"]], "Select node tree.")
    text.dataset.datatype = "nodeTree"
    text.dataset.editable = "true"
    this.nodeHTMLContent.append(text)

    if(this.tree)
      this.setNodeTree(text, this.tree)
  }
  //#endregion create HTML
  addSetterFact(id, identifier = "fact_identifier", value = true) {
    this.factsToSet.push(Fact.createSetterFact(id, identifier, value))
    this.refreshHTML()
  }
  createSetterFactHTML(index, identifier, value) {
    let container = this.element.querySelector(".dialogue-node-fact-container")
    let row =               El("div", "dialogue-node-fact-row", [["data-factindex", index]])
    let identifierElement = El("div", "dialogue-node-fact-identifier", [["data-editable", "true"], ["data-datatype", "nodeFactIdentifier"]], identifier)
    let valueElement =      El("div", `dialogue-node-fact-value ${value}`,    [["data-editable", "true"], ["data-datatype", "factValue"], ["data-isboolean", "true"]], value)
    let deleteButton =      El("div", "dialogue-node-fact-delete-button ui-graphic")

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
  setNodeTree(textField, treeName) {
    fetch(`data/dialogue/${treeName}.json`)
    .then((response) => {
      if(response.ok) {
        response.json().then(nodes => {
          /* find exit nodes */
          let exitNodes = nodes.filter(n => n.out.length === 0)
          
          /* delete sockets */
          let sockets = Array.from(this.element.querySelectorAll(".dialogue-node-socket.out"))
          sockets.forEach(s => s.remove())

          /* create new sockets */
          for (let i = 0; i < exitNodes.length; i++) {
            let socketOut = El.special('node-socket-out')
            socketOut.dataset.index = i
            socketOut.title = exitNodes[i].type.capitalize().splitCamelCase() + " - " + exitNodes[i].text
            this.element.querySelector(".dialogue-node-socket-wrapper.out").append(socketOut)
          }
          let rect = this.element.querySelector(".dialogue-node-socket-wrapper.out").getBoundingClientRect()
          this.element.style.minWidth = rect.width + 25 + "px"
        })
        this.tree = treeName
        textField.innerText = treeName
      }
      else {
        textField.innerText = this.tree ?? "Select node tree."
        alert("Dialogue tree not found.")
      }
    })
  }
  refreshHTML() {
    this[`refresh${this.type.capitalize()}HTML`]()
  }
  refreshFactSetterHTML() {
    this.element.querySelector(".dialogue-node-fact-container").innerHTML = ""
    this.factsToSet.forEach((fact, index) => this.createSetterFactHTML(index, fact.identifier, fact.value))
  }
  reorderOutputs() {
    /* trees have a fixed number of outputs based on the exit node count inside*/
    if(this.type === "tree") return

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
  createConnection(to, treeOutputIndex) {
    /* delete other outputs unless it's a special type of node */
    if(this.type !== "responsePicker" && this.type !== "tree")
      this.deleteOut()

    if(to.id === this.id) return
    
    /* return if the connection already exists */
    if(to.in.find(connection => connection.from.id === this.id)) return
    if(to.out.find(connection => connection.to.id === this.id)) return

    let index
    if(this.type === "tree") {
      index = treeOutputIndex
      /* delete connection from this socket if it exists */
      let conn = this.out.find(conn => conn.index === treeOutputIndex)
      if(conn) {
        let to = dialogueEditor.nodes.find(node => node.id === conn.to.id)
        let destinationRef = to.in.find(conn => conn.from.id === this.id)
        to.in.remove(destinationRef)
        this.out.remove(conn)
      }
    }
    else {
      index = this.out.length
    }
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
  update() {
    this.element.style.left = this.pos.x + "px"
    this.element.style.top = this.pos.y + "px"
    this.element.querySelector(".fact-count").innerText = this.criteria.length + " criteria"
  }
  destroy() {
    this.deleteIn()
    this.deleteOut()
    this.element.remove()
    dialogueEditor.unsetActiveNode()
    dialogueEditor.nodes.remove(this)
    dialogueEditor.reconstructHTML()
  }
  static types = [
    "text",
    "responsePicker",
    "transfer",
    "whisper",
    "pass",
    "aggression",
    "factSetter",
    "tree"
  ]
}
