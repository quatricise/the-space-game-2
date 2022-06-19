class DialogueNode {
  constructor(type, text, speaker, pos = new Vector(cw/2, ch/2), id, facts) {
    this.id = id || uniqueID(dialogue_editor.nodes)
    this.pos = pos.clone()
    this.type = type
    this.speaker = speaker
    this.text = text
    this.facts = facts || []
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
  create_html_player_text() {
    let node = El('div', "dialogue-node")
    let header = El('div', "dialogue-node-header")
    let widget_drag = El("div", "dialogue-node-widget drag", [["title", "Drag node"]])
    let widget_remove = El("div", "dialogue-node-widget remove", [["title", "Delete node"]])
    let widget_list = El("div", "dialogue-node-widget list", [["title", "Open facts list"]])
    let fact_count = El("div", "fact-count")
    let speaker = El('div', "dialogue-node-row dialogue-node-speaker", [["title", "Speaker"]], this.speaker)
    let text = El('div', "dialogue-node-row dialogue-node-text-field", [["title", "Text"]], this.text)
    let wrapper_out = El('div', "dialogue-node-socket-wrapper out")
    let wrapper_in  = El('div', "dialogue-node-socket-wrapper in")
    
    let socket_out = El.special('node-socket-out')
    let socket_in = El.special('node-socket-in')
    socket_out.dataset.index = this.out.length

    speaker.dataset.editable = "true"
    speaker.dataset.datatype = "speaker"
    speaker.dataset.id = this.id
    text.dataset.editable = "true"
    text.dataset.datatype = "text"
    wrapper_out.append(socket_out)
    wrapper_in.append(socket_in)

    // header.innerText = this.id
    header.append(widget_remove, widget_drag, widget_list)
    node.dataset.id = this.id
    node.append(header, speaker, text, fact_count, wrapper_out, wrapper_in )

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
    // header.innerText = this.id
    header.append(widget_remove, widget_drag, widget_list)
    node.dataset.id = this.id
    node.append(header, fact_count, wrapper_in, wrapper_out, )

    dialogue_editor.element.append(node)
    this.element = node
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
    let fact_copy = {
      ...fact
    }
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

class DialogueEditor {
  constructor() {
    this.name = "dialogue1"
    this.nodes = []
    this.graphics = new PIXI.Graphics()
    this.element = Q('#dialogue-editor')
    this.textarea = El("textarea", undefined, [["type", "text"],["size", "300"],["width", ""]])
    this.edited = {}
    this.fact_editor = {
      element: Q('#fact-container'),
      list: Q('#fact-list'),
      search_list: Q('#fact-search-list'),
      open: false,
      hide() {
        console.log("hide")
        this.element.classList.add('hidden')
        this.open = false
      },
      show: (event) => {
        console.log("show")
        if(event.target.closest(".dialogue-node")) {
          let rect = event.target.closest(".dialogue-node").getBoundingClientRect()
          this.fact_editor.element.classList.remove("hidden")
          this.open = true
          this.fact_editor.element.style.left = rect.left + rect.width + 10 + "px"
          this.fact_editor.element.style.top = rect.top + "px"
          this.display_facts(this.active_node)

        }
        else if(this.active_node) {
          let rect = this.active_node.element.getBoundingClientRect()
          this.fact_editor.element.classList.remove("hidden")
          this.open = true
          this.fact_editor.element.style.left = rect.left + rect.width + 10 + "px"
          this.fact_editor.element.style.top = rect.top + "px"
          this.display_facts(this.active_node)
        }
      },
      toggle: (event) => {
        console.log("toggle")
        this.fact_editor.open = !this.fact_editor.open
        if(this.fact_editor.open) this.fact_editor.show(event)
        else this.fact_editor.hide()
        this.fact_editor.update_icons()
      },
      update_icons: () => {
        console.log("update_icons")
        Qa(".dialogue-node-widget.list").forEach(icon => {
          if(this.fact_editor.open) icon.classList.add("active")
          else icon.classList.remove('active')
        })
      }
    }
    this.create_html()
    this.state = {
      set(value) {
        let val = this.values.find(v => v === value)
        if(val) {
          this.previous = this.current
          this.current = val
          // console.log("state: "  + this.current)
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
      isnt(...values) {
        let match = true
        values.forEach(val => {
          if(this.current === val) match = false
        })
        return match
      },
      values: [
        "default",
        "connecting",
        "creating",
        "panning",
        "dragging",
        "editing",
        "loading",
      ],
      current: "default",
      previous: "default"
    }
    this.selected = {
      connections: [],
      nodes: [],
    }
    this.deselect_node()
  }
  create_html() {
    this.svg_cont = El("div", "svg-container")
    Q('.dialogue-name').innerText = this.name
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
  close() {
    this.nodes.forEach(node=> {
      node.element.remove()
    })
    this.nodes = []
    this.reconstruct_html()
  }
  display_facts(node) {
    this.fact_editor.list.innerHTML = ""
    node.facts.forEach(fact => {
      let cont = El("div", "fact-item")
      let owner = El('div', "fact-owner", [["title", "Owner"]], fact.owner)
      let label = El('div', "fact-label", [["title","Unique fact identifier within owner context"]], fact.identifier)
      let value = El('div', "fact-value", undefined, fact.value)
      let cross = El('div', "fact-icon-remove", [["title", "remove"]])
      label.dataset.nodeid = node.id
      label.dataset.label = fact.identifier
      value.dataset.nodeid = node.id
      value.dataset.label = fact.identifier
      value.title = "Click to flip value"
      if(fact.value === true) value.classList.add("true")
      if(fact.value === false) value.classList.add("false")
      cont.dataset.nodeid = node.id
      cont.append(owner, label, value, cross)
      this.fact_editor.list.append(cont)
    })
  }
  display_fact_search() {
    this.fact_editor.search_list.innerHTML = ""
    this.fact_editor.search_list.classList.remove("hidden")
    facts.forEach(fact => {
      let cont = El('div', "fact-item searched", [["title", "Add to node"]])
      let owner = El('div', "fact-owner", undefined, fact.owner)
      let identifier = El('div', "fact-label", undefined, fact.identifier.toString())
      let value = El('div', "fact-value", undefined, fact.value.toString())
      cont.dataset.id = fact.id
      cont.append(owner, identifier, value)
      this.fact_editor.search_list.append(cont)
      this.fact_editor.search_list.classList.remove("hidden")
    })
  }
  hide_fact_search() {
    this.fact_editor.search_list.innerHTML = ""
    this.fact_editor.search_list.classList.add("hidden")
    Q(".fact-search-bar input").blur()
  }
  export() {
    let nodes = []
    this.nodes.forEach(n => {
      let in_nodes = []
      let out_nodes = []
      n.out.forEach(node => {
        out_nodes.push({
          index: node.index,
          to: node.to.id
        })
      })
      n.in.forEach(node => {
        in_nodes.push({
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
          in: in_nodes,
          out: out_nodes,
        }
      )
    })
    exportToJsonFile(nodes, this.name)
  }
  import(name) {
    this.close()
    this.state.set('loading')
    let url = "data/dialogue/" + name + ".json"
    readTextFile(url, (text) => {
      let data = JSON.parse(text);
      data.forEach(d => {
        let vec = new Vector(d.pos.x, d.pos.y)
        new DialogueNode(d.type, d.text, d.speaker, vec, d.id, d.facts)
      })
      data.forEach(d => {
        d.out.forEach(out_conn => {
          let node_origin = this.nodes.find(node => node.id === d.id)
          let node_destination = this.nodes.find(node => node.id === out_conn.to)
          console.log(node_destination)
          node_origin.create_connection(node_destination)
        })
      })
    })
    setTimeout(()=> {this.reconstruct_html(); this.state.set("default")}, 600)
  }
  deselect_node() {
    Qa(".dialogue-node.active").forEach(node => node.classList.remove("active"))
    this.fact_editor.element.classList.add("hidden")
    this.active_node = null
  }
  edit_begin() {
    if(this.state.is("editing")) this.edit_cancel()
    this.textarea.value = this.edited.element.innerHTML.replaceAll("<br>", "\n")
    this.state.set("editing")
    this.textarea.focus()
    this.textarea.select()
  }
  edit_confirm() {
    if(this.state.isnt("editing")) return
    console.log(this.active_node)
    let element = this.edited.element
    element.innerText = this.textarea.value
    this.textarea.replaceWith(element)
    this.active_node[element.dataset.datatype] = element.innerText
    this.deselect_node()
    this.state.set("default")
  }
  edit_cancel() {
    if(this.state.isnt("editing")) return
    this.textarea.replaceWith(this.edited.element)
    this.state.set("default")
  }
  handle_input(event) {
    if(ui.windows.active !== this) return
    if(this.state.is("loading")) return
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
    if(document.activeElement === Q(".fact-search-bar input")) {
      if(event.code === "Escape") {
        this.hide_fact_search()
      }
    }
    else
    if(document.activeElement === Q('#fact-input')) {
      let input = Q('#fact-input')
      if(event.code === "Enter" || event.code === "NumpadEnter") {
        let [owner, identifier, value] = input.value.replaceAll(" ", "").split(',')
        value = stringToBool(value)
        fact_manager.create_fact(owner, identifier, value)
      }
    }
    else
    if(document.activeElement === this.textarea) {
      if((event.code === "Enter" || event.code === "NumpadEnter") && (!keys.shift && !keys.shift_right)) {
        this.edit_confirm()
      }
      if(event.code === "Escape") {
        this.edit_cancel()
      }
    }
    else {
      if(event.code === "Escape") {
        this.edit_cancel()
      }
      if(event.code === "KeyD") {
        this.duplicate_node(this.active_node)
      }
    }
  }
  handle_keyup(event) {
    
  }
  handle_mousedown(event) {
    let target = event.target
    if(this.state.is("editing")) {
      if(target.closest(".dialogue-node") && +target.closest(".dialogue-node").dataset.id !== this.active_node.id) {
        this.edit_cancel()
      }
      else
      if(!target.closest(".dialogue-node")) {
        this.edit_cancel()
      }
    }
    if(target.closest(".dialogue-node")) {
      this.set_active_node(event)
    }
    if(event.button === 0) {
      if(event.target.closest(".dialogue-node-socket.out")) {
        this.state.set("connecting")
      }
      if(event.target.closest("[data-editable='true']")) {
        let element = event.target.closest("[data-editable='true']")
        this.edited = {
          content: element.innerText,
          datatype: element.dataset.datatype,
          parent: element.parentElement,
          element: element,
          node: this.active_node
        }
        element.replaceWith(this.textarea)
        this.edit_begin()
      }
      if(event.target.closest(".dialogue-node-widget.drag")) {
        this.edit_cancel()
        this.state.set("dragging")
      }
      if(event.target.closest(".dialogue-node-widget.remove")) {
        if(target.closest(".dialogue-node")) {
          this.edit_cancel()
          this.active_node.delete()
        }
        if(target.closest(".fact-container")) {
          this.fact_editor.toggle(event)
        }
      }
      if(event.target === this.element) {
        this.deselect_node()
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
      if(event.target.closest(".dialogue-node") && (keys.shift || keys.shift_right)) {
        this.state.set("connecting")
      }

      if(event.target.closest(".fact-value") && event.target.closest(".fact-list")) {
        let value = event.target.closest(".fact-value")
        let node = this.nodes.find(n => n.id === +value.dataset.nodeid)
        let label = this.fact_editor.list.querySelector(`[data-label='${value.dataset.label}']`).dataset.label
        let fact = node.facts.find(fact => fact.identifier === label)
        fact.value = !fact.value
        value.innerText = fact.value.toString()
        if(fact.value === false) {
          value.classList.add("false")
          value.classList.remove("true")
        }
        else {       
          value.classList.add("true")
          value.classList.remove("false")
        }
        if(typeof fact.value !== "boolean") alert('not boolean')
      }
      if(target.closest(".fact-icon-remove")) {
        let item = target.closest(".fact-item")
        let identifier = item.querySelector(".fact-label").innerText
        let node = this.nodes.find(n => n.id === +item.dataset.nodeid)
        node.delete_fact(identifier)
      }
      if(target.closest(".fact-item.searched")) {
        let fact = facts.find(f => f.id === +target.closest(".fact-item.searched").dataset.id)
        this.active_node.add_fact(fact)
      }

      if(target.closest(".dialogue-node-widget.list")) {
        this.fact_editor.toggle(event)
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
        this.active_node.create_connection(connect_to)
        this.deselect_node()
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
    if(this.state.is("dragging") && this.fact_editor.open) {
      this.fact_editor.show(event)
    }
    if(this.state.isnt("editing")) {
      this.state.set("default")
    }
    this.reconstruct_html()
  }
  handle_click(event) {

  }
  create_node(type) {
    let node = new DialogueNode(type, "Lorem Ipsum", "unknown", mouse.client_pos)
    return node
  }
  set_active_node(event) {
    this.deselect_node()
    let target = event.target.closest(".dialogue-node")
    target.classList.add('active')
    this.active_node = this.nodes.find(node => node.id === +target.dataset.id)
    if(this.fact_editor.open) this.fact_editor.show(event)
  }
  get_node_from_event(event) {
    let target = event.target.closest(".dialogue-node")
    if(target) return this.nodes.find(node => node.id === +target.dataset.id)
    return null
  }
  duplicate_node(node) {
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
  open_facts_editor(event) {

  }
  reconstruct_html() {
    // console.log("Reconstruct")
    //generate svgs for connections
    this.svg_cont.innerHTML = ""
    this.nodes.forEach(node => {
      node.update()
      node.out.forEach(conn => {
        let svg = SVGEl("svg", "dialogue-node-connection", [["viewBox", "0 0 " + cw + " " + ch],["preserveAspectRatio", "xMinYMax"],["width", cw],["height", ch], ["fill", "none"]])
        let path = SVGEl("path", undefined, [["d", "M 0 0 L 250 250"],["stroke", "green"], ["stroke-width","8"]])
        // console.log("conn to", conn.to.element)
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