let dialogue_nodes = [] //shit, this needs to be proofed, i'll create a map of id's, and the id needs to be checked against that, but the map must be continuously updated

class DialogueNode {
  constructor(id = uniqueID(dialogue_nodes), x, y, name = "Start", from_socket = null, text = "Text", speaker = "Deborah", responses = []) {
    this.id = id
    this.pos = {
      x: x,
      y: y
    }
    this.dragged = false
    this.name = name
    this.text = text
    this.speaker = speaker
    this.responses = [
      {
        value: "No thank you",
        lead_to: {}
      },
      {
        value: "Yes, thank you",
        lead_to: {
          //node id
        }
      },
      {
        value: "Maybe, but thank you",
        lead_to: {}
      },
    ]
    this.sockets = {
      in: [],
      out: [],
      get all() {
        return this.in.concat(this.out)
      }
    }
    this.max_width = 600
    this.visual = El("div", "dialogue-node")
    let node = this.visual
    let header = El('div', "dialogue-node-header")
    let node_name = El("div", "dialogue-node-label", [["title", "Conversation name | Click to edit"]], this.name)
    let widget_edit = El("div", "dialogue-node-widget edit",  [["title", "Click to open in sidebar"]])
    let widget_drag = El("div", "dialogue-node-widget drag", undefined)
    let widget_remove = El("div", "dialogue-node-widget remove", [["title", "Delete node"]], undefined)
    let widget_resize = El("div", "dialogue-node-widget resize", [["title", "Resize"]], undefined)
    let speaker_field = El('div', "dialogue-node-row dialogue-node-speaker", undefined, this.speaker)
    let text_field = El('div', "dialogue-node-row dialogue-node-text-field", undefined, this.text)

  
    let node_socket_out = El.special("node-socket")
    this.sockets.out.push(new NodeConnectionSocket(node_socket_out, this))

    let node_socket_in;
    if(from_socket) {
      node_socket_in = ui.dialogue_editor.active_object.visual
      node_socket_in.style = ""
      node_socket_in.classList.replace("out", "in")
      this.sockets.in.push(ui.dialogue_editor.active_object)
    }
    else {
      node_socket_in = El('div', "dialogue-node-socket in", [["title", "Drag to connect to other sockets"]])     
      this.sockets.in.push(new NodeConnectionSocket(node_socket_in, this))
    }

    node.style.left = this.pos.x + "px"
    node.style.top = this.pos.y + "px"

    node_name.dataset.editable = "true"
    speaker_field.dataset.editable = "true"
    text_field.dataset.editable = "true"

    //exact string representation of the properties of <this>
    node_name.dataset.datatype = "name"
    speaker_field.dataset.datatype = "speaker"
    text_field.dataset.datatype = "text"

    widget_edit.onclick = () => {
      ui.dialogue_editor.edit_node_properties(this)
      ui.dialogue_editor.show_sidebar()
    }

    widget_drag.dataset.nodeid = this.id
    widget_drag.onmousedown = () => {
      this.dragBegin()
    }

    widget_drag.onmouseup = () => {
      this.dragEnd()
    }

    widget_remove.onclick = () => {
      this.remove()
    }

    widget_resize.onmousedown = () => {
      this.resizeBegin()
    }

    header.append(node_name, widget_edit, widget_drag, widget_remove, widget_resize)

    //todo - same here, this could get replaced once i decide you can drag IN-sockets to OUT-sockets
    node_socket_out.onmousedown = () => {
      state.switchState("dragging_node_connection_point")
      let conn = new NodeConnection(this.sockets.out[0])
      ui.dialogue_editor.active_object = conn.sockets[1]
      ui.dialogue_editor.active_connection = conn
      console.log(this)
    }
    //todo - you set this once for the initial sockets, but this needs to be set for all sockets in the class
    node_socket_in.onmouseup = () => {
      if(state.current === "dragging_node_connection_point") {
        this.visual.removeChild(this.sockets.in[0].visual)
        this.sockets.in[0].connections.forEach(conn=> conn.remove())
        this.sockets.in[0] = ui.dialogue_editor.returnActiveObject()

        let socket = this.sockets.in[0].visual
        socket.style = ""
        socket.classList.replace("out", "in")
        this.visual.append(socket)
      }
    }
    node.append(header, speaker_field, text_field,  node_socket_in, node_socket_out)

    let children = node.querySelectorAll("*")
    for (let i = 0; i < children.length; i++) {
      children[i].dataset.nodeid = this.id
    }

    Q('#dialogue-editor').append(node)
    dialogue_nodes.push(this)
  }
  add_in_socket() {

  }
  add_out_socket() {

  }
  dragBegin () {
    ui.dialogue_editor.active_object = this
    state.switchState("dragging_node")
  }
  dragEnd() {
    ui.dialogue_editor.active_object = ui.dialogue_editor.returnActiveObject()
    state.revertState()
  }
  drag(event) {
    this.pos.x += mouse.client_moved.x
    this.pos.y += mouse.client_moved.y
    this.visual.style.left = this.pos.x + "px"
    this.visual.style.top = this.pos.y + "px"
  }
  resizeBegin() {
    ui.dialogue_editor.active_object = this
    this.max_width = this.visual.clientWidth
    state.switchState("resizing_node")
  }
  resize() {
    this.max_width += mouse.client_moved.x
    this.max_width = clamp(this.max_width, 200, 600)
    this.visual.style.maxWidth = this.max_width + "px"
  }
  resizeEnd() {
    ui.dialogue_editor.active_object = ui.dialogue_editor.returnActiveObject()
    state.revertState()
  }
  addResponse() {
    this.responses.push(
      {}
    )
  }
  remove() {
    dialogue_nodes = dialogue_nodes.filter(node => node !== this)
    this.sockets.all.forEach(sock => {
      sock.connections.forEach(conn=> conn.remove())
    })
    this.visual.remove()
  }
}

class DialogueEditor {
  constructor() {
    this.active_object = this.initActiveObject()
    this.edited_object = {
      element: null,
      parent: null,
      text_input: El("textarea", undefined, [["type", "text"],["size", "300"],["width", ""]])
    }
    this.active_connection = {}
    this.element = Q('#dialogue-editor')
    this.sidebar = {
      element: Q('#dialogue-editor-sidebar'),
      text: Q('#dialogue-editor-sidebar #text-container'),
      text_rules: Q('#dialogue-editor-sidebar #text-rules-container'),
      response: Q('#dialogue-editor-sidebar #response-container'),
      response_rules: Q('#dialogue-editor-sidebar #response-rules-container'),
    }

    this.selection = null
  }
  editObject(element) {
    if(this.edited_object.element) this.cancelEdit()
    let input = this.edited_object.text_input

    this.edited_object.element = element
    this.edited_object.parent = element.parentElement
    element.replaceWith(input)
    input.setAttribute("class", element.className)
    input.value = element.innerText
    input.select()
    state.switchState("editing_text_field")
  }
  cancelEdit() {
    this.edited_object.text_input.replaceWith(this.edited_object.element)
    this.edited_object.element = null
    this.edited_object.parent = null
    state.revertState()
  }
  confirmEdit() {
    let element = this.edited_object.element
    let input = this.edited_object.text_input

    this.edited_object.text_input.replaceWith(element)
    this.edited_object.element = null
    this.edited_object.parent = null
    element.innerText = input.value

    let node = dialogue_nodes.find(node => node.id === +element.dataset.nodeid)
    node[element.dataset.datatype] = element.innerText
    state.revertState()
  }
  returnActiveObject() {
    let obj = this.active_object
    this.active_object = this.initActiveObject()
    state.revertState()
    return obj
  }
  initActiveObject() {
    this.active_object = {drag() {},resize() {}}
  }
  toggle_visibility() {
    this.element.classList.toggle('hidden')
  }
  toggle_sidebar() {
    this.sidebar.element.classList.toggle("open")
  }
  show_sidebar() {
    this.sidebar.element.classList.add("open")
  }
  edit_node_properties(node) {
    Array.from(this.sidebar.element.querySelectorAll('.sidebar-row')).forEach(el => el.remove())
    this.sidebar.element.append(El("div", "sidebar-row label", undefined, "text"))
    this.sidebar.element.append(El("div", "sidebar-row text", undefined, node.text))
  }
  begin_selection() {

  }
  end_selection() {
    
  }
  update_selection () {

  }
}

let node_connections = []

class NodeConnection {
  constructor(socket_origin) {
    this.visual = SVGEl("svg", "dialogue-node-connection", [["viewBox", "0 0 " + cw + " " + ch],["preserveAspectRatio", "xMinYMax"],["width", cw],["height", ch], ["fill", "none"]])
    this.path = SVGEl("path", undefined, [["d", "M 0 0 L 250 250"],["stroke", "green"], ["stroke-width","2"]])
    this.sockets = [
      socket_origin, 
      new NodeConnectionSocket(El.special('node-socket'))
    ]
    this.sockets.forEach(sock=> {sock.connections.push(this)})
    this.visual.append(this.path)
    Q('#dialogue-editor').append(this.visual)
    node_connections.push(this)
    console.log(this.visual)
  }
  updateVisual() {
    let rects = [ 
      this.sockets[0].visual.getBoundingClientRect(),
      this.sockets[1].visual.getBoundingClientRect(),
    ]
    this.path.setAttribute("d", 
    "M " + (rects[0].x + 6) + " " + (rects[0].y + 6) + 
    "L " + (rects[1].x + 6) + " " + (rects[1].y + 6)
    )
  }
  remove() {
    node_connections = node_connections.filter(conn => conn !== this)
    this.visual.remove()
  }
}

class NodeConnectionSocket {
  constructor(visual, parent_node = null) {
    this.visual = visual
    this.pos = {
      x: mouse.client_pos.x,
      y: mouse.client_pos.y,
    }
    this.parent_node = parent_node
    this.connections = []
    Q('#dialogue-editor').append(this.visual)
  }
  drag(e) {
    this.pos.x += mouse.client_moved.x
    this.pos.y += mouse.client_moved.y
    this.visual.style.left = this.pos.x + "px"
    this.visual.style.top = this.pos.y + "px"
  }
  beginConnection() {

  }
  closeConnection() {

  }

}