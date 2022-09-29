class DialogueEditor extends GameWindow {
  constructor(title, element) {
    super(title, element)
    this.dialogueName = "dialogue1"
    this.nodes = []
    this.textarea = El("textarea", undefined, [["type", "text"],["size", "300"],["width", ""]])
    this.edited = {}
    this.style = {
      connectionWidth: 8
    }
    this.scale = 1
    this.highlighted = null //just an element that's visually highlighted
    this.lastNpc = Object.keys(data.person)[0] //name of the last npc used inside a text node
    this.factManager = new FactManager(this, "view-left")
    this.createHtml()
    this.state = new State(
      "default",
      "connecting",
      "creating",
      "panning",
      "dragging",
      "editing",
      "loading",
      "selectingSpeaker",
    )
    this.selected = {
      connections: [],
      nodes: [],
    }
    this.deselectNode()
  }
  createHtml() {
    this.svgCont = El("div", "svg-container")
    Q('.dialogue-name').innerText = this.dialogueName
    this.element.append(this.svgCont)
    
    let importIcon = El('div', "icon-import", [["title", "Import"]])
    let exportIcon = El('div', "icon-export-facts", [["title", "Export facts"]])
    this.element.querySelector(".icon-close-container").prepend(importIcon, exportIcon)
  }
  pan() {
    this.nodes.forEach(node => {
      node.pos.add(mouse.clientMoved)
    })
  }
  scroll(amt) {
    this.nodes.forEach(node => node.pos.y += amt)
    this.reconstructHtml()
  }
  close() {
    this.nodes.forEach(node=> {
      node.element.remove()
    })
    this.nodes = []
    this.reconstructHtml()
  }
  export() {
    let nodes = []
    this.nodes.forEach(n => {
      let inNodes = []
      let outNodes = []
      n.out.forEach(node => {
        outNodes.push({
          index: node.index,
          to: node.to.id
        })
      })
      n.in.forEach(node => {
        inNodes.push({
          index: node.index,
          from: node.from.id
        })
      })
      nodes.push(
        {
          id: n.id,
          pos: n.pos,
          type: n.type,
          speaker: n.speaker,
          text: n.text,
          facts: n.facts,
          in: inNodes,
          out: outNodes,
        }
      )
    })
    exportToJsonFile(nodes, this.dialogueName)
    factManager.export()
  }
  import(name) {
    this.close()
    this.state.set('loading')
    let url = "data/dialogue/" + name + ".json"
    Q(".dialogue-name").innerText = name
    readTextFile(url, (text) => {
      let data = JSON.parse(text);
      data.forEach(d => {
        let vec = new Vector(d.pos.x, d.pos.y)
        new DialogueNode(d.type, d.text, d.speaker, vec, d.id, d.facts)
      })
      data.forEach(d => {
        d.out.forEach(outConn => {
          let nodeOrigin = this.nodes.find(node => node.id === d.id)
          let nodeDestination = this.nodes.find(node => node.id === outConn.to)
          nodeOrigin.createConnection(nodeDestination)
        })
      })
    })
    setTimeout(()=> {this.reconstructHtml(); this.state.set("default")}, 600)
  }
  displayFactSearch() {
    this.factManager.searchList.innerHTML = ""
    this.factManager.searchList.classList.remove("hidden")
    facts.forEach(fact => {
      let cont = El('div', "fact-item searched", [["title", "Add to node"]])
      let identifier = El('div', "fact-identifier", undefined, fact.identifier.toString())
      let value = El('div', "fact-value", undefined, fact.value.toString())
      cont.dataset.id = fact.id
      cont.append(identifier, value)
      this.factManager.searchList.append(cont)
      this.factManager.searchList.classList.remove("hidden")
    })
  }
  hideFactSearch() {
    this.factManager.searchList.innerHTML = ""
    this.factManager.searchList.classList.add("hidden")
    Q(".fact-search-bar input").blur()
  }
  deselectNode() {
    Qa(".dialogue-node.active").forEach(
      node => 
      node.classList.remove("active")
    )
    this.activeNode = null
  }
  setSpeaker(speaker) {
    this.activeNode.speaker = speaker
    this.highlighted.innerText = speaker
    this.lastNpc = speaker
    this.npcSearchDelete()
  }
  editBegin() {
    if(this.state.is("editing")) this.editCancel()
    this.textarea.value = this.edited.element.innerHTML.replaceAll("<br>", "\n")
    this.state.set("editing")
    this.textarea.focus()
    this.textarea.select()
  }
  editConfirm() {
    if(this.state.isnt("editing")) return
    let element = this.edited.element
    element.innerText = this.textarea.value
    this.textarea.replaceWith(element)
    this.activeNode[element.dataset.datatype] = element.innerText
    this.deselectNode()
    this.state.set("default")
  }
  editCancel() {
    if(this.state.isnt("editing")) return
    this.textarea.replaceWith(this.edited.element)
    this.state.set("default")
  }
  //#region handle input
  handleKeydown(event) { 
    if(document.activeElement === Q(".fact-search-bar input")) {
      if(event.code === "Escape") {
        this.hideFactSearch()
      }
    }
    else
    if(document.activeElement === Q('#fact-input')) {
      let input = Q('#fact-input')
      if(event.code === "Enter" || event.code === "NumpadEnter") {
        let [identifier, value] = input.value.replaceAll(" ", "").split(',')
        value = stringToBool(value)
        let createdFact = factManager.createFact(identifier, value)
        if(createdFact) {
          input.value = ""
          this.displayFactSearch()
        }
      }
    }
    else
    if(document.activeElement === this.textarea) {
      if((event.code === "Enter" || event.code === "NumpadEnter") && (!keys.shift && !keys.shiftRight)) {
        this.editConfirm()
      }
      if(event.code === "Escape") {
        this.editCancel()
      }
    }
    else {
      if(event.code === "Escape") {
        this.editCancel()
        this.npcSearchDelete()
        this.contextMenuDelete()
      }
      if(event.code === "KeyD") {
        this.duplicateNode(this.activeNode)
      }
      
      if(event.code === "KeyE") {
        this.export()
      }

    }
  }
  handleKeyup(event) {
    
  }
  handleMousedown(event) {
    let target = event.target
    if(this.state.is("editing")) {
      if(target.closest(".dialogue-node") && +target.closest(".dialogue-node").dataset.id !== this.activeNode.id) {
        this.editCancel()
      }
      else
      if(!target.closest(".dialogue-node")) {
        this.editCancel()
      }
    }
    if(event.button === 0) {
      if(target.closest(".dialogue-node")) 
      {
        this.setActiveNode(event)
        if(this.factManager.open) 
        {
          //open node context inside fact manager
        }
        else 
        {
          //do nothing else i guess
        }
      }
      if(target.closest(".dialogue-node-socket.out")) 
      {
        this.state.set("connecting")
      }
      if(target.closest("[data-editable='true']")) 
      {
        let element = target.closest("[data-editable='true']")
        this.edited = {
          content: element.innerText,
          datatype: element.dataset.datatype,
          parent: element.parentElement,
          element: element,
          node: this.activeNode
        }
        element.replaceWith(this.textarea)
        this.npcSearchDelete()
        this.contextMenuDelete()
        this.editBegin()
      }
      if(target.closest("[data-datatype='speaker']")) 
      {
        if(this.npcSearch) {this.npcSearchDelete(); return}
        this.highlighted = target.closest("[data-datatype='speaker']")
        this.highlighted.style.border = "2px solid var(--color-shield)"
        this.state.set("selectingSpeaker")
        this.npcSearchCreate()
      }
      if(target.closest(".dialogue-node-widget.drag")) 
      {
        this.editCancel()
        this.state.set("dragging")
      }
      if(target.closest(".dialogue-node-widget.remove")) 
      {
        if(target.closest(".dialogue-node")) {
          this.editCancel()
          this.activeNode.delete()
        }
        if(target.closest(".fact-container")) {
          this.factManager.toggle(event)
        }
      }
      if(target === this.element) 
      {
        this.deselectNode()
        this.state.set("creating")
      }
      if(target.closest("path")) 
      {
        let svg = target.closest("svg")
        svg.childNodes[0].setAttribute("stroke", "blue")
        let node = this.nodes.find(node => node.id === +event.target.closest("svg").dataset.id)
        let index = +svg.dataset.index
        node.deleteConnection(index)
        this.reconstructHtml()
      }
      if(target.closest(".npc-search-row")) 
      {
        let speaker = target.closest(".npc-search-row").dataset.speaker
        this.setSpeaker(speaker)
      }
      if(target.closest(".dialogue-node") && (keys.shift || keys.shiftRight)) 
      {
        this.state.set("connecting")
      }
      if(target.closest(".dialogue-node .dialogue-node-icon.plus")) 
      {
        let index = +target.closest(".dialogue-node .dialogue-node-icon.plus").dataset.index
        let el = target.closest(".dialogue-node").querySelector(`.dialogue-node-item-container[data-index='${index}']`)
        console.log(el)
        let newel = El("div", "dialogue-node-item")
        el.append(newel)
      }
      if(target.closest(".icon-export-facts")) 
      {
        this.export()
      }
      if(target.closest(".icon-import")) 
      {
        this.import(window.prompt("dialogue filename", "dorothy"))
      }
      if(target.closest(".context-menu-option")) 
      {
        let targ = target.closest(".context-menu-option")
        this.createNode(targ.dataset.type, targ.dataset.isplayer.bool())
        this.contextMenuDelete()
      }
      if(target.closest(".fact-value") && target.closest(".fact-list")) 
      {
        let value = event.target.closest(".fact-value")
        let node = this.nodes.find(n => n.id === +value.dataset.nodeid)
        let identifier = this.factManager.list.querySelector(`[data-identifier='${value.dataset.identifier}']`).dataset.identifier
        let fact = node.facts.find(fact => fact.identifier === identifier)
        fact.value = !fact.value
        value.innerText = fact.value.toString()
        fact.value ? value.classList.replace("false", "true") : value.classList.replace("true", "false")
        if(typeof fact.value !== "boolean") alert('not boolean')
      }
      if(target.closest(".fact-icon-remove")) 
      {
        let item = target.closest(".fact-item")
        let identifier = item.querySelector(".fact-identifier").innerText
        let node = this.nodes.find(n => n.id === +item.dataset.nodeid)
        node.deleteFact(identifier)
      }
      if(target.closest(".fact-item.searched")) 
      {
        let fact = facts.find(f => f.id === +target.closest(".fact-item.searched").dataset.id)
        this.activeNode.addFact(fact)
      }
      if(target.closest(".dialogue-node-widget.list")) 
      {
        this.factManager.toggle(event)
      }
      
    }
    if(event.button === 1) {
      this.state.set("panning")
    }
    if(event.button === 2) {
      if(event.target === this.element) {
        this.state.set("creating")
      }
    }
  }
  handleMousemove(event) {
    if(this.state.is("dragging")) {
      this.activeNode.drag(event)
    }
    if(this.state.is("panning")) {
      this.pan()
    }
    this.updateHtml()
  }
  handleMouseup(event) {
    if(event.button === 0) {
      if(this.state.is("connecting") && event.target.closest(".dialogue-node")) {
        let connectTo = this.getNodeAtMousePosition(event)
        this.activeNode.createConnection(connectTo)
        this.deselectNode()
      }
      if(this.state.is("connecting") && event.target === this.element) {
        let node = this.createNode("text")
        this.activeNode.createConnection(node)
      }
      if(this.state.is("creating") && event.target === this.element) {
        this.createNode("text", true)
      }
    }
    if(event.button === 2) {
      if(this.state.is("creating") && event.target === this.element) {
        this.contextMenuCreate()
      }
    }
    if(this.state.is("dragging") && this.factManager.open) {
      this.factManager.show(event)
    }
    if(this.state.isnt("editing", "selectingSpeaker")) {
      this.state.set("default")
    }
    this.reconstructHtml()
  }
  handleClick(event) {

  }
  handleWheel(event) {
    if(event.deltaY < 0) {
      // this.zoomIn)
      this.scroll(-event.deltaY)
    }
    else
    if(event.deltaY > 0) {
      // this.zoomOut()
      this.scroll(-event.deltaY)
    }
  }
  //#endregion 
  zoomIn() {
    this.scale *= (5 / 4)
    this.zoomUpdate()
  }
  zoomOut() {
    this.scale *= (4 / 5)
    this.zoomUpdate()
  }
  zoomUpdate() {
    return
    let tops = this.nodes.map(n => n.element.style.top.replace("px", ""))
    let uppest = Math.min(...tops)
    let offsets = tops.map(t => t - uppest)
    console.log(offsets)
    this.nodes.forEach(n => n.element.style.transform = `scale(${this.scale})`)
    console.log(this.svgCont.getAttribute("viewBox"))
  }
  contextMenuCreate() {
    if(this.contextMenu) this.contextMenuDelete()
    let menu = El("div", "context-menu")
    let title = El("div","context-menu-title", undefined, "Select node type")
    menu.append(title)
    let d = [
      {
        isPlayer: true,
        display: "Player",
        type: DialogueEditor.nodeTypes.findChild("text"),
      },
      {
        isPlayer: false,
        display: "NPC",
        type: DialogueEditor.nodeTypes.findChild("text"),
      },
      {
        isPlayer: false,
        display: "Router node",
        type: DialogueEditor.nodeTypes.findChild("response-picker")
      },
      {
        isPlayer: false,
        display: "Transfer node",
        type: DialogueEditor.nodeTypes.findChild("transfer")
      },
    ]
    for (let i = 0; i < d.length; i++) {
      let option = El("div", "context-menu-option", undefined, d[i].display)
      option.dataset.type = d[i].type
      option.dataset.isplayer = d[i].isPlayer
      menu.append(option)
    }
    menu.style.left = (mouse.clientPos.x + 5) + "px"
    menu.style.top = (mouse.clientPos.y + 5) + "px"
    this.element.append(menu)
    this.contextMenu = menu
  }
  contextMenuDelete() {
    if(this.contextMenu) {
      this.contextMenu.remove()
      this.contextMenu = null
    }
  }
  npcSearchCreate() {
    this.npcSearchDelete()
    let menu = El("div", "npc-search")
    let input = El("input", "npc-search-input", [["type", "text"]])
    menu.append(input)
    function createField(prop) {
      let row = El("div", "npc-search-row")
      let name = El("div", "npc-search-name", undefined, prop)
      let img = new Image()
      if(prop === "player") 
      {
        img.src = "assets/portraits/ada.png"
      }
      else if(prop.includes("variable")) 
      {
        img.src = "assets/editor/iconSpeaker.png"
      }
      else 
      {
        img.src = "assets/portraits/" + prop + ".png"
      }
      row.append(img, name)
      row.dataset.speaker = prop
      menu.append(row)
    }
    createField("player")
    createField("variable_0")
    for(let prop in data.npc) createField(prop)
    
    menu.style.left = (mouse.clientPos.x + 5) + "px"
    menu.style.top = (mouse.clientPos.y + 5) + "px"
    this.element.append(menu)
    this.npcSearch = menu
  }

  npcSearchDelete() {
    if(!this.npcSearch) return
    this.npcSearch.remove()
    this.npcSearch = null
    this.highlighted.style.border = ""
    this.highlighted = null
    this.state.ifrevert("selectingSpeaker")
  }
  createNode(type, isPlayer) {
    let node = new DialogueNode(
      type, 
      "Lorem Ipsum", 
      this.lastNpc, 
      mouse.clientPos, 
      undefined, 
      undefined, 
      {isPlayer: isPlayer}
    )
    return node
  }
  setActiveNode(event) {
    this.deselectNode()
    let target = event.target.closest(".dialogue-node")
    target.classList.add('active')
    this.activeNode = this.nodes.find(node => node.id === +target.dataset.id)
  }
  getNodeAtMousePosition(event) {
    let target = event.target.closest(".dialogue-node")
    if(target) return this.nodes.find(node => node.id === +target.dataset.id)
    return null
  }
  duplicateNode(node) {
    if(!node) alert('no node')
    let props = [
      _.cloneDeep(node.type),
      _.cloneDeep(node.text),
      _.cloneDeep(node.speaker),
      node.pos.clone().add(new Vector(0, 25)),
      undefined,
      _.cloneDeep(node.facts),
    ]
    let newnode = new DialogueNode(...props)
  }
  reconstructHtml() {
    //generate svgs for connections
    this.svgCont.innerHTML = ""
    this.nodes.forEach(node => {
      node.update()
      node.out.forEach(conn => {
        let svg = SVGEl("svg", "dialogue-node-connection", [["viewBox", "0 0 " + cw + " " + ch],["preserveAspectRatio", "xMinYMax"],["width", cw],["height", ch], ["fill", "none"]])
        let path = SVGEl("path", undefined, [["d", "M 0 0 L 250 250"],["stroke", "green"], ["stroke-width", this.style.connectionWidth]])
        let rects = [
          node.element.querySelector(`.dialogue-node-socket.out[data-index='${conn.index}'`).getBoundingClientRect(),
          conn.to.element.querySelector(".dialogue-node-socket.in").getBoundingClientRect()
        ]
        path.setAttribute("d", 
          "M " + (rects[0].x + 6) + " " + (rects[0].y + 6) + 
          "L " + (rects[1].x + 6) + " " + (rects[1].y + 6)
        )
        svg.append(path)
        svg.dataset.id = node.id
        svg.dataset.index = conn.index
        this.svgCont.append(svg)
      })
    })
    this.updateHtml()
  }
  updateHtml() {
    this.nodes.forEach(node => {
      node.update()
      node.out.forEach(conn => {
        let rects = [
          node.element.querySelector(`.dialogue-node-socket.out[data-index='${conn.index}'`).getBoundingClientRect(),
          conn.to.element.querySelector(".dialogue-node-socket.in").getBoundingClientRect()
        ]
        let selector = "svg[data-id='" + node.id + "']" + "[data-index='" + conn.index + "']" + " path"
        let path = this.svgCont.querySelector(selector)

        path.setAttribute("d",
          "M " + (rects[0].x + 6) + " " + (rects[0].y + 6) + 
          "L " + (rects[1].x + 6) + " " + (rects[1].y + 6)
        )
      })
    })
  }
  update() {
    
  }
  //#region debugging methods
  checkForDuplicateIds() {
    let ids = []
    this.nodes.forEach(node => {
      if(ids.find(id => id === node.id))
      ids.push(node.id)
    })
    if(ids.length) console.log('found duplicates', ids)
  }
  //#endregion
  static nodeTypes = [
    "player-text",
    "npc-text",
    "response-picker",
  ]
}