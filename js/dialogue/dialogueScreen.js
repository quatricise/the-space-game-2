class DialogueScreen extends GameWindow {
  constructor() {
    super("DialogueScreen")
    this.element = Q("#dialogue-screen")
    this.factSwitcher = Q("#fact-switcher")
    this.factList = this.factSwitcher.querySelector(".fact-list")
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
    this.dialogueName = null
    this.nodes = []
    this.facts = null
    this.factsCopy = null
    this.currNode = null
    this.clearHtml()
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
  handleKeydown(event) {
    
  }
  handleKeyup(event) {

  }
  handleMousemove(event) {
    if(this.state.is("dragging") && this.dragged) {
      let x = +this.dragged.style.left.replace("px", "")
      let y = +this.dragged.style.top.replace("px", "")
      x += mouse.clientMoved.x
      y += mouse.clientMoved.y
      this.dragged.style.left = x + "px"
      this.dragged.style.top = y + "px"
    }
  }
  handleMousedown(event) {
    let target = event.target
    if(event.button === 0) {
      if(target.closest(".option")) {
        let node = this.getNode(target.dataset.id)
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
        this.resetFacts()
      }
      if(target.closest(".fact-value") && target.closest(".fact-list")) {
        let value = event.target.closest(".fact-value")
        let identifier = this.factList.querySelector(`[data-identifier='${value.dataset.identifier}']`).dataset.identifier
        let fact = this.factsCopy.find(fact => fact.identifier === identifier)
        fact.value = !fact.value
        value.innerText = fact.value.toString()
        fact.value ? value.classList.replace("false", "true") : value.classList.replace("true", "false")
        if(typeof fact.value !== "boolean") alert('not boolean')
      }
    }
  }
  handleMouseup(event) {
    if(this.state.is("dragging")) {
      this.state.revert()
      this.dragged = null
    }
  }
  handleClick(event) {
    
  }
  handleWheel(event) {

  }
  resetFacts() {
    this.clearHtml()
    this.facts = _.cloneDeep(this.factsCopy)
    this.facts.forEach(fact => {
      this.generateFactItem(fact)
    })
  }
  start() {
    this.init()
    this.nodes = JSON.parse(this.json)
    this.currNode = this.nodes.find(node => node.in.length === 0)
    this.facts = this.nodes.map(node => node.facts).flat()
    this.factsCopy = _.cloneDeep(this.facts)
    this.step(this.currNode)
    this.facts.forEach(fact => {
      this.generateFactItem(fact)
    })
  }
  load(file) {
    this.dialogueName = file
    this.clearHtml()
    readTextFile("data/dialogue/" + file + ".json", (text) => {
      this.json = text
      this.start()
    })
    game.state.set("dialogue")
  }
  pickNode(nodes = []) {
    
  }
  getNode(id) {
    return this.nodes.find(node => node.id === +id)
  }
  step(node) {
    Qa('#dialogue-options .option').forEach(o => o.remove())
    this.currNode = node
    if(node.type === "text") this.generateBlock(node.speaker, node.text)
    if(node.type === "response-picker") {
      console.log(node)
      let out = node.out.map(o => this.nodes.find(n => n.id === o.to))
      console.log(out)
      let isYou = true
      out.forEach(o => {
        if(o.type !== "text") isYou = false
      })
      if(isYou) this.generateOptions(out)
      else this.pickNode(out)
    }
  }
  clearHtml() {
    this.timeouts.forEach(t => window.clearTimeout(t))
    this.timeouts = []
    this.factSwitcher.querySelector(".fact-list").innerHTML = ""
    let elements = Array.from(
      this.element.querySelectorAll(".dialogue-block, .dialogue-options .option")
    )
    elements.forEach(el => el.remove())
  }
  generateFactItem(fact) {
    let cont = El('div', "fact-item searched", [["title", "Add to node"]])
    let identifier = El('div', "fact-identifier", undefined, fact.identifier.toString())
    let value = El('div', "fact-value", undefined, fact.value.toString())
    fact.value ? value.classList.add("true") : value.classList.add("false")
    identifier.dataset.identifier = fact.identifier
    value.dataset.identifier = fact.identifier
    cont.dataset.id = fact.id
    cont.append(identifier, value)
    this.factList.append(cont)
  }
  generateBlock(speaker, text) {
    let block = El("div", "dialogue-block")
    let empty = El("div", "empty")
    let portrait = El("div", "portrait portrait-right tooltip")
    let img = new Image(); img.src = "assets/portraits/deborah.png"
    let words = text.split(" ")
    let bubble = El("div", "chat-bubble")
    const nextWord = () => {
      let word = (" " + words.shift())
      element.innerText += word
      if(words.length === 0) {
        let timeout = setTimeout(()=> {
          let node = this.getNode(this.currNode.out[0]?.to)
          if(!node) return console.log('Dialogue over')
          this.step(node)
        },500)
        this.timeouts.push(timeout)
        return
      }
      let delay = 160
      if(word.includes(",")) delay = 550
      let timeout = setTimeout(()=> {
        nextWord()
      }, delay)
      this.timeouts.push(timeout)
    }
    let element = bubble
    nextWord()
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
  generateOptions(nodes = []) {
    nodes.forEach((node, index) => {
      let opt = El("div", "option", undefined, node.text)
      opt.dataset.id = node.id
      Q('#dialogue-options').append(opt)
    })
  }
}