class DialogueScreen extends GameWindow {
  constructor() {
    super("DialogueScreen")
    this.element = Q("#dialogue-screen")
    this.fact_switcher = Q("#fact-switcher")
    this.fact_list = this.fact_switcher.querySelector(".fact-list")
    this.graphics = new PIXI.Graphics()
    this.state = new State(
      "default",
      "dragging",
    )
    this.dragged = null
    this.timeouts = []
    this.json = null
    this.init()
  }
  init() {
    this.dialogue_name = null
    this.nodes = []
    this.facts = null
    this.facts_copy = null
    this.curr_node = null
    this.clear_html()
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
  handle_keydown(event) {
    
  }
  handle_keyup(event) {

  }
  handle_mousemove(event) {
    if(this.state.is("dragging") && this.dragged) {
      let x = +this.dragged.style.left.replace("px", "")
      let y = +this.dragged.style.top.replace("px", "")
      x += mouse.client_moved.x
      y += mouse.client_moved.y
      this.dragged.style.left = x + "px"
      this.dragged.style.top = y + "px"
    }
  }
  handle_mousedown(event) {
    let target = event.target
    if(event.button === 0) {
      if(target.closest(".option")) {
        let node = this.get_node(target.dataset.id)
        this.step(node)
      }
      if(target.closest(".drag-widget")) {
        this.dragged = target.closest(".draggable")
        this.state.set("dragging")
      }
      if(target.closest(".icon-restart-conversation")) {
        this.start()
      }
      if(target.closest(".icon-reset-facts")) {
        this.reset_facts()
      }
      if(target.closest(".fact-value") && target.closest(".fact-list")) {
        let value = event.target.closest(".fact-value")
        let identifier = this.fact_list.querySelector(`[data-identifier='${value.dataset.identifier}']`).dataset.identifier
        let fact = this.facts_copy.find(fact => fact.identifier === identifier)
        fact.value = !fact.value
        value.innerText = fact.value.toString()
        fact.value ? value.classList.replace("false", "true") : value.classList.replace("true", "false")
        if(typeof fact.value !== "boolean") alert('not boolean')
      }
    }
  }
  handle_mouseup(event) {
    if(this.state.is("dragging")) {
      this.state.revert()
      this.dragged = null
    }
  }
  handle_click(event) {
    
  }
  handle_wheel(event) {

  }
  reset_facts() {
    this.clear_html()
    this.facts = _.cloneDeep(this.facts_copy)
    this.facts.forEach(fact => {
      this.generate_fact_item(fact)
    })
  }
  start() {
    this.init()
    this.nodes = JSON.parse(this.json)
    this.curr_node = this.nodes.find(node => node.in.length === 0)
    this.facts = this.nodes.map(node => node.facts).flat()
    this.facts_copy = _.cloneDeep(this.facts)
    this.step(this.curr_node)
    this.facts.forEach(fact => {
      this.generate_fact_item(fact)
    })
  }
  load(file) {
    this.dialogue_name = file
    this.clear_html()
    readTextFile("data/dialogue/" + file + ".json", (text) => {
      this.json = text
      this.start()
    })
    game.state.set("dialogue")
  }
  pick_node(nodes = []) {
    
  }
  get_node(id) {
    return this.nodes.find(node => node.id === +id)
  }
  step(node) {
    Qa('#dialogue-options .option').forEach(o => o.remove())
    this.curr_node = node
    if(node.type === "text") this.generate_block(node.speaker, node.text)
    if(node.type === "response-picker") {
      console.log(node)
      let out = node.out.map(o => this.nodes.find(n => n.id === o.to))
      console.log(out)
      let is_you = true
      out.forEach(o => {
        if(o.type !== "text") is_you = false
      })
      if(is_you) this.generate_options(out)
      else this.pick_node(out)
    }
  }
  clear_html() {
    this.timeouts.forEach(t => window.clearTimeout(t))
    this.timeouts = []
    this.fact_switcher.querySelector(".fact-list").innerHTML = ""
    let elements = Array.from(
      this.element.querySelectorAll(".dialogue-block, .dialogue-options .option")
    )
    elements.forEach(el => el.remove())
  }
  generate_fact_item(fact) {
    let cont = El('div', "fact-item searched", [["title", "Add to node"]])
    let identifier = El('div', "fact-identifier", undefined, fact.identifier.toString())
    let value = El('div', "fact-value", undefined, fact.value.toString())
    fact.value ? value.classList.add("true") : value.classList.add("false")
    identifier.dataset.identifier = fact.identifier
    value.dataset.identifier = fact.identifier
    cont.dataset.id = fact.id
    cont.append(identifier, value)
    this.fact_list.append(cont)
  }
  generate_block(speaker, text) {
    let block = El("div", "dialogue-block")
    let empty = El("div", "empty")
    let portrait = El("div", "portrait portrait-right tooltip")
    let img = new Image(); img.src = "assets/portraits/deborah.png"
    let words = text.split(" ")
    let bubble = El("div", "chat-bubble")
    const next_word = () => {
      let word = (" " + words.shift())
      element.innerText += word
      if(words.length === 0) {
        let timeout = setTimeout(()=> {
          let node = this.get_node(this.curr_node.out[0]?.to)
          if(!node) return console.log('Dialogue over')
          this.step(node)
        },500)
        this.timeouts.push(timeout)
        return
      }
      let delay = 160
      if(word.includes(",")) delay = 550
      let timeout = setTimeout(()=> {
        next_word()
      }, delay)
      this.timeouts.push(timeout)
    }
    let element = bubble
    next_word()
    portrait.append(img)
    if(speaker === "player") {
      block.append(empty, bubble, portrait)
      bubble.classList.add("right")
      portrait.dataset.tooltip = "You"
    }
    if(speaker !== "player") {
      block.append(portrait, bubble, empty)
      portrait.dataset.tooltip = speaker.cap()
    }
    Q('.dialogue').append(block)
  }
  generate_options(nodes = []) {
    nodes.forEach((node, index) => {
      let opt = El("div", "option", undefined, node.text)
      opt.dataset.id = node.id
      Q('#dialogue-options').append(opt)
    })
  }
}