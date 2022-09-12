class DialogueEditor extends GameWindow {
  constructor(title, element) {
    super(title, element)
    this.dialogue_name = "dialogue1"
    this.nodes = []
    this.textarea = El("textarea", undefined, [["type", "text"],["size", "300"],["width", ""]])
    this.edited = {}
    this.style = {
      connection_width: 8
    }
    this.scale = 1
    this.highlighted = null //just an element that's visually highlighted
    this.last_npc = Object.keys(data.person)[0] //name of the last npc used inside a text node
    this.fact_manager = new FactManager(this, "view-left")
    this.create_html()
    this.state = new State(
      "default",
      "connecting",
      "creating",
      "panning",
      "dragging",
      "editing",
      "loading",
      "selecting_speaker",
    )
    this.selected = {
      connections: [],
      nodes: [],
    }
    this.deselect_node()
  }
  create_html() {
    this.svg_cont = El("div", "svg-container")
    Q('.dialogue-name').innerText = this.dialogue_name
    this.element.append(this.svg_cont)
    
    let import_icon = El('div', "icon-import", [["title", "Import"]])
    let export_icon = El('div', "icon-export-facts", [["title", "Export facts"]])
    this.element.querySelector(".icon-close-container").prepend(import_icon, export_icon)
  }
  pan() {
    this.nodes.forEach(node => {
      node.pos.add(mouse.client_moved)
    })
  }
  scroll(amt) {
    this.nodes.forEach(node => node.pos.y += amt)
    this.reconstruct_html()
  }
  close() {
    this.nodes.forEach(node=> {
      node.element.remove()
    })
    this.nodes = []
    this.reconstruct_html()
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
    exportToJsonFile(nodes, this.dialogue_name)
    fact_manager.export()
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
        d.out.forEach(out_conn => {
          let node_origin = this.nodes.find(node => node.id === d.id)
          let node_destination = this.nodes.find(node => node.id === out_conn.to)
          node_origin.create_connection(node_destination)
        })
      })
    })
    setTimeout(()=> {this.reconstruct_html(); this.state.set("default")}, 600)
  }
  display_fact_search() {
    this.fact_manager.search_list.innerHTML = ""
    this.fact_manager.search_list.classList.remove("hidden")
    facts.forEach(fact => {
      let cont = El('div', "fact-item searched", [["title", "Add to node"]])
      let identifier = El('div', "fact-identifier", undefined, fact.identifier.toString())
      let value = El('div', "fact-value", undefined, fact.value.toString())
      cont.dataset.id = fact.id
      cont.append(identifier, value)
      this.fact_manager.search_list.append(cont)
      this.fact_manager.search_list.classList.remove("hidden")
    })
  }
  hide_fact_search() {
    this.fact_manager.search_list.innerHTML = ""
    this.fact_manager.search_list.classList.add("hidden")
    Q(".fact-search-bar input").blur()
  }
  deselect_node() {
    Qa(".dialogue-node.active").forEach(
      node => 
      node.classList.remove("active")
    )
    this.active_node = null
  }
  set_speaker(speaker) {
    this.active_node.speaker = speaker
    this.highlighted.innerText = speaker
    this.last_npc = speaker
    this.npc_search_delete()
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
  //#region handle input
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
        let [identifier, value] = input.value.replaceAll(" ", "").split(',')
        value = stringToBool(value)
        let created_fact = fact_manager.create_fact(identifier, value)
        if(created_fact) {
          input.value = ""
          this.display_fact_search()
        }
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
        this.npc_search_delete()
        this.context_menu_delete()
      }
      if(event.code === "KeyD") {
        this.duplicate_node(this.active_node)
      }
      
      if(event.code === "KeyE") {
        this.export()
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
    if(event.button === 0) {
      if(target.closest(".dialogue-node")) 
      {
        this.set_active_node(event)
        if(this.fact_manager.open) 
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
          node: this.active_node
        }
        element.replaceWith(this.textarea)
        this.npc_search_delete()
        this.context_menu_delete()
        this.edit_begin()
      }
      if(target.closest("[data-datatype='speaker']")) 
      {
        if(this.npc_search) {this.npc_search_delete(); return}
        this.highlighted = target.closest("[data-datatype='speaker']")
        this.highlighted.style.border = "2px solid var(--color-shield)"
        this.state.set("selecting_speaker")
        this.npc_search_create()
      }
      if(target.closest(".dialogue-node-widget.drag")) 
      {
        this.edit_cancel()
        this.state.set("dragging")
      }
      if(target.closest(".dialogue-node-widget.remove")) 
      {
        if(target.closest(".dialogue-node")) {
          this.edit_cancel()
          this.active_node.delete()
        }
        if(target.closest(".fact-container")) {
          this.fact_manager.toggle(event)
        }
      }
      if(target === this.element) 
      {
        this.deselect_node()
        this.state.set("creating")
      }
      if(target.closest("path")) 
      {
        let svg = target.closest("svg")
        svg.childNodes[0].setAttribute("stroke", "blue")
        let node = this.nodes.find(node => node.id === +event.target.closest("svg").dataset.id)
        let index = +svg.dataset.index
        node.delete_connection(index)
        this.reconstruct_html()
      }
      if(target.closest(".npc-search-row")) 
      {
        let speaker = target.closest(".npc-search-row").dataset.speaker
        this.set_speaker(speaker)
      }
      if(target.closest(".dialogue-node") && (keys.shift || keys.shift_right)) 
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
        this.create_node(targ.dataset.type, targ.dataset.isplayer.bool())
        this.context_menu_delete()
      }
      if(target.closest(".fact-value") && target.closest(".fact-list")) 
      {
        let value = event.target.closest(".fact-value")
        let node = this.nodes.find(n => n.id === +value.dataset.nodeid)
        let identifier = this.fact_manager.list.querySelector(`[data-identifier='${value.dataset.identifier}']`).dataset.identifier
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
        node.delete_fact(identifier)
      }
      if(target.closest(".fact-item.searched")) 
      {
        let fact = facts.find(f => f.id === +target.closest(".fact-item.searched").dataset.id)
        this.active_node.add_fact(fact)
      }
      if(target.closest(".dialogue-node-widget.list")) 
      {
        this.fact_manager.toggle(event)
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
        let connect_to = this.get_node_at_mouse_position(event)
        this.active_node.create_connection(connect_to)
        this.deselect_node()
      }
      if(this.state.is("connecting") && event.target === this.element) {
        let node = this.create_node("text")
        this.active_node.create_connection(node)
      }
      if(this.state.is("creating") && event.target === this.element) {
        this.create_node("text", true)
      }
    }
    if(event.button === 2) {
      if(this.state.is("creating") && event.target === this.element) {
        this.context_menu_create()
      }
    }
    if(this.state.is("dragging") && this.fact_manager.open) {
      this.fact_manager.show(event)
    }
    if(this.state.isnt("editing", "selecting_speaker")) {
      this.state.set("default")
    }
    this.reconstruct_html()
  }
  handle_click(event) {

  }
  handle_wheel(event) {
    if(event.deltaY < 0) {
      // this.zoom_in()
      this.scroll(-event.deltaY)
    }
    else
    if(event.deltaY > 0) {
      // this.zoom_out()
      this.scroll(-event.deltaY)
    }
  }
  //#endregion 
  zoom_in() {
    this.scale *= (5 / 4)
    this.zoom_update()
  }
  zoom_out() {
    this.scale *= (4 / 5)
    this.zoom_update()
  }
  zoom_update() {
    return
    let tops = this.nodes.map(n => n.element.style.top.replace("px", ""))
    let uppest = Math.min(...tops)
    let offsets = tops.map(t => t - uppest)
    console.log(offsets)
    this.nodes.forEach(n => n.element.style.transform = `scale(${this.scale})`)
    console.log(this.svg_cont.getAttribute("viewBox"))
  }
  context_menu_create() {
    if(this.context_menu) this.context_menu_delete()
    let menu = El("div", "context-menu")
    let title = El("div","context-menu-title", undefined, "Select node type")
    menu.append(title)
    let d = [
      {
        isPlayer: true,
        display: "Player",
        type: DialogueEditor.node_types.findChild("text"),
      },
      {
        isPlayer: false,
        display: "NPC",
        type: DialogueEditor.node_types.findChild("text"),
      },
      {
        isPlayer: false,
        display: "Router node",
        type: DialogueEditor.node_types.findChild("response-picker")
      },
      {
        isPlayer: false,
        display: "Transfer node",
        type: DialogueEditor.node_types.findChild("transfer")
      },
    ]
    for (let i = 0; i < d.length; i++) {
      let option = El("div", "context-menu-option", undefined, d[i].display)
      option.dataset.type = d[i].type
      option.dataset.isplayer = d[i].isPlayer
      menu.append(option)
    }
    menu.style.left = (mouse.client_pos.x + 5) + "px"
    menu.style.top = (mouse.client_pos.y + 5) + "px"
    this.element.append(menu)
    this.context_menu = menu
  }
  context_menu_delete() {
    if(this.context_menu) {
      this.context_menu.remove()
      this.context_menu = null
    }
  }
  npc_search_create() {
    this.npc_search_delete()
    let menu = El("div", "npc-search")
    let input = El("input", "npc-search-input", [["type", "text"]])
    menu.append(input)
    function create_field(prop) {
      let row = El("div", "npc-search-row")
      let name = El("div", "npc-search-name", undefined, prop)
      let img = new Image()
      if(prop === "player") 
      {
        img.src = "assets/portraits/ada.png"
      }
      else if(prop.includes("variable")) 
      {
        img.src = "assets/editor/icon_speaker.png"
      }
      else 
      {
        img.src = "assets/portraits/" + prop + ".png"
      }
      row.append(img, name)
      row.dataset.speaker = prop
      menu.append(row)
    }
    create_field("player")
    create_field("variable_0")
    for(let prop in data.npc) create_field(prop)
    
    menu.style.left = (mouse.client_pos.x + 5) + "px"
    menu.style.top = (mouse.client_pos.y + 5) + "px"
    this.element.append(menu)
    this.npc_search = menu
  }

  npc_search_delete() {
    if(!this.npc_search) return
    this.npc_search.remove()
    this.npc_search = null
    this.highlighted.style.border = ""
    this.highlighted = null
    this.state.ifrevert("selecting_speaker")
  }
  create_node(type, isPlayer) {
    let node = new DialogueNode(
      type, 
      "Lorem Ipsum", 
      this.last_npc, 
      mouse.client_pos, 
      undefined, 
      undefined, 
      {isPlayer: isPlayer}
    )
    return node
  }
  set_active_node(event) {
    this.deselect_node()
    let target = event.target.closest(".dialogue-node")
    target.classList.add('active')
    this.active_node = this.nodes.find(node => node.id === +target.dataset.id)
  }
  get_node_at_mouse_position(event) {
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
  reconstruct_html() {
    //generate svgs for connections
    this.svg_cont.innerHTML = ""
    this.nodes.forEach(node => {
      node.update()
      node.out.forEach(conn => {
        let svg = SVGEl("svg", "dialogue-node-connection", [["viewBox", "0 0 " + cw + " " + ch],["preserveAspectRatio", "xMinYMax"],["width", cw],["height", ch], ["fill", "none"]])
        let path = SVGEl("path", undefined, [["d", "M 0 0 L 250 250"],["stroke", "green"], ["stroke-width", this.style.connection_width]])
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
        this.svg_cont.append(svg)
      })
    })
    this.update_html()
  }
  update_html() {
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
  update() {
    
  }
  //#region debugging methods
  check_for_duplicate_ids() {
    let ids = []
    this.nodes.forEach(node => {
      if(ids.find(id => id === node.id))
      ids.push(node.id)
    })
    if(ids.length) console.log('found duplicates', ids)
  }
  //#endregion
  static node_types = [
    "player-text",
    "npc-text",
    "response-picker",
  ]
}