class DialogueNode {
  constructor(type, text, speaker, pos = new Vector(cw/2, ch/2), id, facts, options = {isPlayer: false}) {
    this.id = id || uniqueID(dialogue_editor.nodes)
    this.pos = pos.clone()
    this.type = type
    this.speaker = speaker
    this.text = text
    this.facts = facts || []
    this.in = []
    this.out = []
    dialogue_editor.nodes.push(this)
    if(type === "text") {
      if(options.isPlayer) this.create_html_text(true)
      else this.create_html_text(false)
    }
    if(type === "response-picker") {
      this.create_html_response_picker()
    }
    if(type === "transfer") {
      this.create_html_transfer_node()
    }
    this.update()
    this.reorder_outputs()
  }
  update() {
    this.element.style.left = this.pos.x + "px"
    this.element.style.top = this.pos.y + "px"
    this.element.querySelector(".fact-count").innerText = this.facts.length + " facts"
  }
  drag() {
    this.pos.add(mouse.client_moved)
  }
  create_html_text(isPlayer = false) {
    let node = El('div', "dialogue-node")
    let header = El('div', "dialogue-node-header")
    let widget_drag = El("div", "dialogue-node-widget drag", [["title", "Drag node"]])
    let widget_remove = El("div", "dialogue-node-widget remove", [["title", "Delete node"]])
    let widget_list = El("div", "dialogue-node-widget list", [["title", "Open facts list"]])
    let fact_count = El("div", "fact-count")

    let wrapper_out = El('div', "dialogue-node-socket-wrapper out")
    let wrapper_in  = El('div', "dialogue-node-socket-wrapper in")
    
    let socket_out = El.special('node-socket-out')
    let socket_in = El.special('node-socket-in')

    let speaker = El('div', "dialogue-node-row dialogue-node-speaker", [["title", "Speaker"]])
    if(isPlayer) speaker.innerText = "player"
    else speaker.innerText = this.speaker
    let text = El('div', "dialogue-node-row dialogue-node-text-field", [["title", "Text"]], this.text)

    socket_out.dataset.index = this.out.length

    speaker.dataset.datatype = "speaker"
    speaker.dataset.id = this.id
    text.dataset.editable = "true"
    text.dataset.datatype = "text"
    wrapper_out.append(socket_out)
    wrapper_in.append(socket_in)

    header.append(widget_remove, widget_drag, widget_list)
    node.dataset.id = this.id
    node.append(header, speaker, text, fact_count, wrapper_out, wrapper_in )

    dialogue_editor.element.append(node)
    this.element = node
  }
  create_html_response_picker() {
    let node = El('div', "dialogue-node")
    let header = El('div', "dialogue-node-header")
    let widget_drag = El("div", "dialogue-node-widget drag", [["title", "Drag node"]])
    let widget_remove = El("div", "dialogue-node-widget remove", [["title", "Delete node"]])
    let widget_list = El("div", "dialogue-node-widget list", [["title", "Open facts list"]])
    let fact_count = El("div", "fact-count")

    let wrapper_in  = El('div', "dialogue-node-socket-wrapper in")
    let wrapper_out = El('div', "dialogue-node-socket-wrapper out")
    
    let socket_in = El.special('node-socket-in')
    let socket_out = El.special('node-socket-out')

    socket_out.dataset.index = this.out.length
    wrapper_out.append(socket_out)
    wrapper_in.append(socket_in)
    header.append(widget_remove, widget_drag, widget_list)
    node.dataset.id = this.id
    node.append(header, fact_count, wrapper_in, wrapper_out )

    dialogue_editor.element.append(node)
    this.element = node
  }
  create_html_transfer_node() {
    let node = El('div', "dialogue-node")
    let header = El('div', "dialogue-node-header")
    let widget_drag = El("div", "dialogue-node-widget drag", [["title", "Drag node"]])
    let widget_remove = El("div", "dialogue-node-widget remove", [["title", "Delete node"]])
    let widget_list = El("div", "dialogue-node-widget list", [["title", "Open facts list"]])
    let fact_count = El("div", "fact-count")

    let wrapper_in  = El('div', "dialogue-node-socket-wrapper in")
    let wrapper_out = El('div', "dialogue-node-socket-wrapper out")

    let socket_in = El.special('node-socket-in')
    let socket_out = El.special('node-socket-out')

    let cont = El('div', "dialogue-node-transfer-container")
    for(let i = 0; i < 2; i++) {
      let row = El("div", "dialogue-node-transfer")
      let speaker = El('div', "dialogue-node-row dialogue-node-speaker", [["title", "Speaker"]])
      let item_cont = El("div", "dialogue-node-item-container")
      let icon = El("div", "dialogue-node-icon plus hover-dark-02")
      let add_button = El("div", "dialogue-node-add-item")
      let items = [El("div", "dialogue-node-item empty"), El("div", "dialogue-node-item empty")]
      speaker.innerText = "Actor" + (i + 1)
      speaker.dataset.datatype = "speaker"
      speaker.dataset.id = this.id
      add_button.append(icon)
      icon.dataset.index = i
      item_cont.dataset.index = i
      item_cont.append(...items, add_button)
      row.append(speaker, item_cont)
      cont.append(row)
    }

    socket_out.dataset.index = this.out.length
    wrapper_out.append(socket_out)
    wrapper_in.append(socket_in)
    header.append(widget_remove, widget_drag, widget_list)
    node.dataset.id = this.id
    node.append(header, fact_count, cont, wrapper_in, wrapper_out )

    dialogue_editor.element.append(node)
    this.element = node
    console.log(node)
  }
  reorder_outputs() {
    let sockets = Array.from(this.element.querySelectorAll(".dialogue-node-socket.out"))
    sockets.forEach(s => s.remove())
    let i = 0
    do {
      let socket_out = El.special('node-socket-out')
      socket_out.dataset.index = i
      this.element.querySelector(".dialogue-node-socket-wrapper.out").append(socket_out)
      i++
    } while (i < this.out.length + 1*(this.type === "response-picker"))

    this.out.forEach((node, index) => {
      node.index = index
    })
  }
  add_fact(fact) {
    if(!fact) {
      alert('bad fact')
      return
    }
    if(this.facts.find(f => f.identifier === fact.identifier)) {console.log('fact already exists'); return;}
    let fact_copy = _.cloneDeep(fact)
    console.log(this.facts)
    this.facts.push(fact_copy)
    dialogue_editor.display_facts(this)
  }
  delete_fact(identifier) {
    let fact = this.facts.find(f => f.identifier === identifier)
    if(fact) {
      this.facts.splice(this.facts.indexOf(fact), 1)
    }
    dialogue_editor.display_facts(this)
  }
  create_connection(to) {
    if(this.type !== "response-picker") this.delete_out()
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
      this.reorder_outputs()
    }

    console.log('created conn')
  }
  delete_connection(index) {
    let conn = this.out[index]
    console.log("connection index", index)
    let to = dialogue_editor.nodes.find(node => node.id === conn.to.id)
    let destination_ref = to.in.find(conn => conn.from.id === this.id)
    to.in.splice(to.in.indexOf(destination_ref), 1)
    this.out.splice(index, 1)
    this.reorder_outputs()
  }
  delete_in() {
    this.in.forEach(conn => {
      let from = dialogue_editor.nodes.find(node => node.id === conn.from.id)
      let origin_ref = from.out.find(conn => conn.to.id === this.id)
      from.reorder_outputs()
      from.out.splice(from.out.indexOf(origin_ref), 1)
    })
    this.in = []
  }
  delete_out() {
    this.out.forEach(conn => {
      let to = dialogue_editor.nodes.find(node => node.id === conn.to.id)
      let destination_ref = to.in.find(conn => conn.from.id === this.id)
      to.in.splice(to.in.indexOf(destination_ref), 1)
    })
    this.out = []
  }
  delete() {
    this.delete_in()
    this.delete_out()
    this.element.remove()
    dialogue_editor.fact_editor.element.classList.add("hidden")
    dialogue_editor.nodes = dialogue_editor.nodes.filter(node => node !== this)
  }
}
