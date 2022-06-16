class DialogueNode {
  constructor(type, text, speaker, pos = new Vector(cw/2, ch/2)) {
    this.id = uniqueID(dialogue_editor.nodes)
    this.pos = pos.clone()
    this.type = type
    this.speaker = speaker
    this.text = text
    this.facts = []
    this.in = []
    this.out = []
    dialogue_editor.nodes.push(this)
    switch(type) {
      case "player-text": {
        this.create_html_player_text()
        break
      }
      case "npc-text": {
        this.create_html_npc_text()
        break
      }
      case "response-picker": {
        this.create_html_response_picker()
        break
      }
    }
    this.update()
  }
  update() {
    this.element.style.left = this.pos.x + "px"
    this.element.style.top = this.pos.y + "px"
  }
  drag() {
    this.pos.add(mouse.client_moved)
  }
  create_html_player_text() {
    let node = El('div', "dialogue-node")
    let header = El('div', "dialogue-node-header")
    let widget_drag = El("div", "dialogue-node-widget drag", [["title", "Drag node"]])
    let widget_remove = El("div", "dialogue-node-widget remove", [["title", "Delete node"]], undefined)
    
    let speaker = El('div', "dialogue-node-row dialogue-node-speaker", [["title", "Speaker"]], this.speaker)
    let text = El('div', "dialogue-node-row dialogue-node-text-field", [["title", "Text"]], this.text)
    let wrapper_out = El('div', "dialogue-node-socket-wrapper out")
    let wrapper_in  = El('div', "dialogue-node-socket-wrapper in")
    
    let socket_out = El.special('node-socket-out')
    let socket_in = El.special('node-socket-in')
    socket_out.dataset.index = this.out.length

    wrapper_out.append(socket_out)
    wrapper_in.append(socket_in)
    node.dataset.id = this.id
    header.append(widget_drag, widget_remove)
    node.append(header, speaker, text, wrapper_out, wrapper_in )

    dialogue_editor.element.append(node)
    this.element = node
  }
  create_html_npc_text() {
    this.create_html_player_text()
  }
  create_html_response_picker() {
    let node = El('div', "dialogue-node")
    let header = El('div', "dialogue-node-header")
    let widget_drag = El("div", "dialogue-node-widget drag", [["title", "Drag node"]])
    let widget_remove = El("div", "dialogue-node-widget remove", [["title", "Delete node"]], undefined)
    
    let wrapper_in  = El('div', "dialogue-node-socket-wrapper in")
    let wrapper_out = El('div', "dialogue-node-socket-wrapper out")
    
    let socket_in = El.special('node-socket-in')
    let socket_out = El.special('node-socket-out')
    socket_out.dataset.index = this.out.length
    
    let buttons = El('div', "flex")
    let add_btn = El('div', "dialogue-node-icon dialogue-add-output")
    let remove_btn = El('div', "dialogue-node-icon dialogue-remove-output")
    wrapper_out.append(socket_out)
    wrapper_in.append(socket_in)
    node.dataset.id = this.id
    header.append(widget_drag, widget_remove)
    buttons.append(add_btn, remove_btn)
    node.append(header, buttons, wrapper_in, wrapper_out, )

    dialogue_editor.element.append(node)
    this.element = node
  }
  reorder_outputs() {
    let sockets = Array.from(this.element.querySelectorAll(".dialogue-node-socket.out"))
    sockets.forEach(s => s.remove())
    for (let i = 0; i < this.out.length + 1*(this.type === "response-picker"); i++) {
      let socket_out = El.special('node-socket-out')
      socket_out.dataset.index = i
      this.element.querySelector(".dialogue-node-socket-wrapper.out").append(socket_out)
    }
    this.out.forEach((node, index) => {
      node.index = index
    })
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
    dialogue_editor.nodes = dialogue_editor.nodes.filter(node => node !== this)
  }
}

class DialogueEditor {
  constructor() {
    this.nodes = []
    this.graphics = new PIXI.Graphics()
    this.element = Q('#dialogue-editor')
    this.create_html()
    this.state = {
      set(value) {
        let val = this.values.find(v => v === value)
        if(val) {
          this.previous = this.current
          this.current = val
          console.log("state: "  + this.current)
        }
        else {
          console.log('invalid value')
        }
      },
      revert() {
        this.current = this.previous
      },
      is(...values) {
        let match = false
        values.forEach(val => {
          if(this.current === val) match = true
        })
        return match
      },
      values: [
        "default",
        "connecting",
        "creating",
        "panning",
        "dragging",
      ],
      current: "default",
      previous: "default"
    }
    this.selected = {
      connections: [],
      nodes: [],
    }
    this.active_node = {}
  }
  create_html() {
    this.svg_cont = El("div", "svg-container")
    this.element.append(this.svg_cont)
  }
  show() {
    this.element.classList.remove('hidden')
  }
  hide() {
    this.element.classList.add('hidden')
  }
  toggle() {
    this.element.classList.toggle('hidden')
  }
  pan() {
    this.nodes.forEach(node => {
      node.pos.add(mouse.client_moved)
    })
  }
  handle_input(event) {
    if(ui.windows.active !== this) return
    switch(event.type) {
      case "keydown"    : { this.handle_keydown(event); break;}
      case "keyup"      : { this.handle_keyup(event); break;}
      case "mousedown"  : { this.handle_mousedown(event); break;}
      case "mousemove"  : { this.handle_mousemove(event); break;}
      case "mouseup"    : { this.handle_mouseup(event); break;}
      case "click"      : { this.handle_click(event); break;}
    }
  }
  handle_keydown(event) { 

  }
  handle_keyup(event) {
    
  }
  handle_mousedown(event) {
    let target = event.target
    this.active_node = this.get_node_from_event(event)
    if(event.button === 0) {
      if(event.target.closest(".dialogue-node-socket.out")) {
        this.state.set("connecting")
      }
      if(event.target.closest(".dialogue-node-widget.drag")) {
        this.state.set("dragging")
      }
      if(event.target.closest(".dialogue-node-widget.remove")) {
        this.active_node.delete()
      }
      if(event.target === this.element) {
        this.state.set("creating")
      }
      if(event.target.closest("path")) {
        let svg = event.target.closest("svg")
        svg.childNodes[0].setAttribute("stroke", "blue")
        let node = this.nodes.find(node => node.id === +event.target.closest("svg").dataset.id)
        let index = +svg.dataset.index
        node.delete_connection(index)
        this.reconstruct_html()
      }

    }
    if(event.button === 1) {
      if(event.target === this.element) {
        this.state.set("panning")
      }
    }
    if(event.button === 2) {
      if(event.target === this.element) {
        this.state.set("creating")
      }
    }
  }
  handle_mousemove(event) {
    if(this.state.is("dragging")) {
      this.active_node.drag(event)
    }
    if(this.state.is("panning")) {
      this.pan()
    }
    this.update_html()
  }
  handle_mouseup(event) {
    if(event.button === 0) {
      if(this.state.is("connecting") && event.target.closest(".dialogue-node")) {
        let connect_to = this.get_node_from_event(event)
        this.active_node.create_connection(connect_to, 0)
        this.active_node = {}
      }
      if(this.state.is("connecting") && event.target === this.element) {
        let node = this.create_node("player-text")
        this.active_node.create_connection(node)
      }
      if(this.state.is("creating") && event.target === this.element) {
        this.create_node("player-text")
      }
    }
    if(event.button === 2) {
      if(this.state.is("creating") && event.target === this.element) {
        this.create_node("response-picker")
      }
    }
    this.state.set("default")
    this.reconstruct_html()
  }
  handle_click(event) {

  }
  create_node(type) {
    let node = new DialogueNode(type, "Lorem Ipsum", "unknown", mouse.client_pos)
    return node
  }
  get_node_from_event(event) {
    if(event.target.closest(".dialogue-node")) {
      return this.nodes.find(node => node.id === +event.target.closest(".dialogue-node").dataset.id)
    }
    else return null
  }
  reconstruct_html() {
    console.log("Reconstruct")
    //generate svgs for connections
    this.svg_cont.innerHTML = ""
    this.nodes.forEach(node => {
      node.update()
      node.out.forEach(conn => {
        let svg = SVGEl("svg", "dialogue-node-connection", [["viewBox", "0 0 " + cw + " " + ch],["preserveAspectRatio", "xMinYMax"],["width", cw],["height", ch], ["fill", "none"]])
        let path = SVGEl("path", undefined, [["d", "M 0 0 L 250 250"],["stroke", "green"], ["stroke-width","8"]])
        // console.log("index", conn.index)
        let rects = [
          node.element.querySelector(`.dialogue-node-socket.out[data-index='${conn.index}'`).getBoundingClientRect(),
          conn.to.element.querySelector(".dialogue-node-socket.in").getBoundingClientRect()
        ]
        // console.log(node.element.querySelector(`.dialogue-node-socket.out[data-index='${conn.index}'`))
        path.setAttribute("d", 
          "M " + (rects[0].x + 6) + " " + (rects[0].y + 6) + 
          "L " + (rects[1].x + 6) + " " + (rects[1].y + 6)
        )
        svg.append(path)
        svg.dataset.id = node.id
        svg.dataset.index = conn.index
        this.svg_cont.append(svg)
      })
    })
    this.update_html()
  }
  update_html() {
    // console.log('update')
    this.nodes.forEach(node => {
      node.update()
      node.out.forEach(conn => {
        let rects = [
          node.element.querySelector(`.dialogue-node-socket.out[data-index='${conn.index}'`).getBoundingClientRect(),
          conn.to.element.querySelector(".dialogue-node-socket.in").getBoundingClientRect()
        ]
        let selector = "svg[data-id='" + node.id + "']" + "[data-index='" + conn.index + "']" + " path"
        let path = this.svg_cont.querySelector(selector)

        path.setAttribute("d",
          "M " + (rects[0].x + 6) + " " + (rects[0].y + 6) + 
          "L " + (rects[1].x + 6) + " " + (rects[1].y + 6)
        )
      })
    })
  }
  static node_types = [
    "player-text",
    "npc-text",
    "response-picker",
  ]
}