class DialogueScreen extends GameWindow {
  constructor() {
    super("DialogueScreen")
    this.element = Q("#dialogue-screen")
    this.optionsElement = Q("#dialogue-options")
    this.factSwitcher = Q("#fact-switcher")
    this.dialogueContent = Q('#dialogue-content')
    this.factList = this.factSwitcher.querySelector(".fact-list")
    this.graphics = new PIXI.Graphics()
    this.state = new State(
      "default",
      "dragging",
    )
    this.canFastForwardBubble = true
    this.dragged = null
    this.JSONData = null
    this.timeouts = []
    this.windowType = "overlay"
    this.reset()
  }
  show() {
    if(this.visible) return

    AudioManager.dimMusic(0.5)

    this.visible = true
    this.reset()
    this.element.classList.remove('hidden')
    this.element.style.backgroundColor = "hsla(240, 2%, 8%, 0.0)"
    this.element.animate([
      {filter: "opacity(0) saturate(0)", backgroundColor: "hsla(240, 2%, 8%, 0.0)"},
      {filter: "opacity(1) saturate(1)", backgroundColor: "hsla(240, 2%, 8%, 0.5)"},
    ], {
      duration: 700,
      iterations: 1,
      easing: "cubic-bezier(0.65, 0.0, 0.35, 1.0)",
    })
    .onfinish = () => this.element.style.backgroundColor = "hsla(240, 2%, 8%, 0.5)"
  }
  hide() {
    if(!this.visible) return

    this.visible = false
    this.element.animate([
      {filter: "opacity(1) saturate(1)", backgroundColor: "hsla(240, 2%, 8%, 0.5)"},
      {filter: "opacity(0) saturate(0)", backgroundColor: "hsla(240, 2%, 8%, 0.0)"},
    ], {
      duration: 1000,
      easing: "cubic-bezier(0.65, 0.0, 0.35, 1.0)"
    })
    .onfinish = () => {
      this.element.classList.add('hidden')
      this.element.style.backgroundColor = ""
      this.reset()
    }
    AudioManager.restoreMusic()
  }
  reset() {
    this.dialogueName = null
    this.nodes = []
    this.facts = null
    this.factsCopy = null
    this.currentNode = null
    this.isDialogueFinished = false
    this.resetHTML()
  }
  resetFacts() {
    this.resetHTML()
  }
  //#region input
  handleKeydown(event) {
    
  }
  handleKeyup(event) {

  }
  handleMousemove(event) {
    if(this.state.is("dragging") && this.dragged)
      this.updateDrag()
  }
  handleMousedown(event) {
    let target = event.target
    if(event.button === 0) {
      if(target.closest(".option:not(.leave-call-option)")) {
        let node = this.getNodeById(target.dataset.id)
        this.processNextNode(node)
      }
      if(target.closest("#dialogue-content")) {
        this.fastForwardBubble()
      }
      if(target.closest(".drag-widget")) {
        this.dragBegin(target)
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
    if(this.state.is("dragging"))
      this.dragEnd()
  }
  handleClick(event) {
    
  }
  handleWheel(event) {

  }
  //#endregion
  //#region drag
  dragBegin(target) {
    this.dragged = target.closest(".draggable")
    this.state.set("dragging")
  }
  updateDrag() {
    let x = +this.dragged.style.left.replace("px", "")
    let y = +this.dragged.style.top.replace("px", "")
    x += mouse.clientMoved.x
    y += mouse.clientMoved.y
    this.dragged.style.left = x + "px"
    this.dragged.style.top = y + "px"
  }
  dragEnd() {
    this.state.revert()
    this.dragged = null
  }
  //#endregion
  start() {
    this.reset()
    this.nodes = JSON.parse(this.JSONData)
    let node = this.nodes.find(node => node.in.length === 0)
    this.displaySpeakers()
    this.processNextNode(node)
  }
  load(filename) {
    this.dialogueName = filename
    this.reset()
    readJSONFile("data/dialogue/" + filename + ".json", (text) => {
      this.JSONData = text
      this.start()
    })
  }
  displaySpeakers() {
    let speakers = this.getUniqueSpeakersPerDialogueTree()
    let rightContainer = Q("#dialogue-screen-portrait-container-right")
    let leftContainer = Q("#dialogue-screen-portrait-container-left")
    
    leftContainer.innerHTML = ""
    rightContainer.innerHTML = ""
    
    for(let [index, speaker] of speakers.entries()) {
      if(DialogueScreen.hiddenSpeakers.findChild(speaker)) continue

      let 
      image = new Image()
      image.src = "assets/portraits/" + speaker + ".png"

      let 
      imageContainer = El("div", "chat-portrait-big")
      imageContainer.append(image)
      imageContainer.style.zIndex = index

      if(speaker === "player")
        rightContainer.prepend(imageContainer)
      else
        leftContainer.prepend(imageContainer)
    }
    setTimeout(() => {
      if(leftContainer.childNodes.length > 1)
        leftContainer.style.left = "-100px"
      else
        leftContainer.style.left = ""
    }, 500)
  }
  animateSpeakers() {

  }
  getUniqueSpeakersPerDialogueTree() {
    let unfiltered = this.nodes.map(node => {
      if(node.type !== "text") 
        return null
      return node.speaker
    })
    .filter(s => s !== null)

    let speakers = []
    unfiltered.forEach(speaker => {
      if(!speakers.find(s => s === speaker))
        speakers.push(speaker)
    })
    return speakers
  }
  getNodeById(id) {
    return this.nodes.find(node => node.id === +id)
  }
  getNextNode() {
    if(this.forwardingTimeout)
      window.clearTimeout(this.forwardingTimeout)

    let node = this.getNodeById(this.currentNode.out[0]?.to)
    if(!node) 
      return this.endDialogue()
    else
      this.processNextNode(node)
  }
  pickNodeForNPC(nodes = []) {
    let [filteredNodes, criteriaRequirementCounts] = this.filterNodes(nodes)
    let mostSpecific = Math.max(...criteriaRequirementCounts)
    let index = criteriaRequirementCounts.indexOf(mostSpecific)
    let pickedNode = filteredNodes[index]

    this.processNextNode(pickedNode)
  }
  processNextNode(node) {
    this.clearOptions()

    this.canFastForwardBubble = false
    this.forwardingTimeout = setTimeout(() => {
      this.canFastForwardBubble = true
    }, DialogueScreen.bubbleDelay)

    this.currentNode = node
    this[`process${node.type.capitalize()}Node`](node)
  }
  //#region processing notes per type
  processTextNode(node) {
    this.generateBlock(node.speaker, node.text)
  }
  processResponsePickerNode(node) {
    let out = node.out.map(output => this.nodes.find(node => node.id === output.to))
    if(out.find(conn => conn.speaker !== "player"))
      this.pickNodeForNPC(out)
    else
      this.generateOptions(out)
  }
  processTransferNode(node) {
    let nonPlayerRow = node.transfer.find(part => part.owner !== "player")
    if(!nonPlayerRow) throw "npc item transfer has not been implemented yet"

    let items = nonPlayerRow.items.map(itemName => new Item(itemName))
    receivedItemModal.setItems(...items)
    gameManager.setWindow(receivedItemModal)
    player.inventory.addItems(...items)

    console.log(nonPlayerRow.items, items)

    receivedItemModal.onClose = () => this.getNextNode()
  }
  processPassNode(node) {
    this.generateBlock(node.speaker, node.text)
  }
  processWhisperNode(node) {
    
  }
  processAggressionNode(node) {
    /* this method turns ALL npcs involved in the dialogue hostile, not just the specific one mentioned in the node */
    let speakersInvolved = this.getUniqueSpeakersPerDialogueTree()
    game.gameObjects.npc.forEach(npc => {
      if(!speakersInvolved.find(s => s == npc.name)) return
      npc.stateMachine.setStateByName("attackEnemy")
      npc.ship?.stealth?.deactivate()
    })
    this.endDialogue("Prepare for a fight")
  }
  processFactSetterNode(node) {
    node.factsToSet.forEach(fact => Fact.create(fact.id, fact.identifier, fact.value))
    this.getNextNode()
  }
  //#endregion
  resetHTML() {
    this.clearTimeouts()
    this.factSwitcher.querySelector(".fact-list").innerHTML = ""
    
    Array.from(this.element.querySelectorAll(".dialogue-block, .dialogue-options .option, .dialogue-end-block"))
    .forEach(el => el.remove())
  }
  clearTimeouts() {
    this.timeouts.forEach(t => window.clearTimeout(t))
    this.timeouts = []
  }
  async generateBlock(speaker, text) {
    let block = El("div", "dialogue-block")
    this.remainingLetters = text.split("")
    let bubble = El("div", "chat-bubble ui-button-minimal-alt-filled")
    let bubbleArrow = El("div", "chat-bubble-arrow")
    let bubbleText = El("span", "chat-bubble-text")

    this.dialogueContent.append(block)

    const nextLetter = (prependWithSpace = false) => {
      let letter = this.remainingLetters.shift()
      let prependNextLetterWithSpace

      prependWithSpace ?
      bubbleText.innerText += " " + letter + " " :
      bubbleText.innerText += letter

      letter === " " ?
      prependNextLetterWithSpace = true :
      prependNextLetterWithSpace = false

      if(this.remainingLetters.length === 0) {
        let timeout = setTimeout(this.getNextNode.bind(this), 900)
        this.timeouts.push(timeout)
        return
      }

      let delay = 28
      if(letter.includes(",")) 
        delay = 260
      if(letter.includes("?")) 
        delay = 520
      if(letter.includes(".")) 
        delay = 520
      if(letter.includes(".") && this.remainingLetters[0].includes("."))
        delay = 260

      let timeout = setTimeout(() => nextLetter(prependNextLetterWithSpace), delay)
      this.timeouts.push(timeout)
      AudioManager.playSFX("dialogueLetter" + Random.int(1, 3), Random.decimal(0.4, 0.5, 1))
    }

    let bubbleHeight = await this.getBubbleHeight(text, block)

    bubble.append(bubbleText, bubbleArrow)
    bubble.dataset.playsfx = ""
    bubble.dataset.sounds = "buttonNoAction"
    bubble.dataset.playonevents = "mouseover"
    bubble.dataset.volumes = "0.05"
    bubble.style.height = bubbleHeight + "px"
    nextLetter()
    
    if(speaker === "player") {
      bubble.classList.add("orange")
      bubbleArrow.classList.add("right")
      block.append(bubble)
    }
    else {
      bubble.classList.add("dialogue-gray")
      bubbleArrow.classList.add("left")
      block.append(bubble)
    }

    this.scrollDown()

    bubbleText.classList.add("chat-bubble-text-background-color")
  }
  async getBubbleHeight(text, dialogueBlock) {
    /* this function creates an invisible bubble, waits for DOM to *hopefully* update and then returns the bubble height */
    let newBubble = El("div", "chat-bubble ui-button-minimal-alt-filled")
    let newText = El("span", "chat-bubble-text")

    newBubble.style.filter = "opacity(0)"
    newBubble.append(newText)
    newText.innerText = text

    dialogueBlock.append(newBubble)
    await waitFor(DialogueScreen.bubbleDelay)
    let height = newBubble.getBoundingClientRect().height
    newBubble.remove()
    return height
  }
  scrollDown() {
    this.dialogueContent.scrollTo({top: this.dialogueContent.scrollHeight, behavior: "smooth",})
  }
  async fastForwardBubble() {
    if(!this.canFastForwardBubble) return
    if(this.currentNode.type === "responsePicker") return

    this.canFastForwardBubble = false
    this.clearTimeouts()

    let bubbles = Qa(".chat-bubble-text")
    bubbles.last().innerText += this.remainingLetters.join("")
    this.remainingLetters = []

    let timeout = setTimeout(() => this.getNextNode(), 400)
    this.timeouts.push(timeout)

    AudioManager.playSFX("buttonNoAction", 0.3)
    await waitFor(70)
    AudioManager.playSFX("buttonNoAction", 0.2)
    await waitFor(70)
    AudioManager.playSFX("buttonNoAction", 0.15)
  }
  filterNodes(nodes) {
    let filteredNodes = []
    let criteriaRequirementCounts = []
    nodes.forEach(node => {
      node.criteria.forEach(criterion => {
        let passedCriterion = true
        criterion.requirements.forEach(requirement => {
          switch(requirement.type) {
            case "fact": {
              let match = Fact.testForFact(requirement.identifier) === requirement.expectedValue
              if(!match) passedCriterion = false
              break
            }
            case "condition": {
              let match = Fact.testForCondition(requirement.entryObject, requirement.accessorChain, requirement.condition)
              if(!match) passedCriterion = false
              break
            }
          }
        })
        if(passedCriterion) {
          filteredNodes.push(node)
          criteriaRequirementCounts.push(criterion.requirements.length)
        }
      })
      if(node.criteria.length == 0) {
        filteredNodes.push(node)
        criteriaRequirementCounts.push(0)
      }
    })
    return [filteredNodes, criteriaRequirementCounts]
  }
  generateOptions(nodes = []) {
    let [filteredNodes] = this.filterNodes(nodes)
    this.optionsElement.classList.remove("inactive")

    let 
    optionsCopy = this.optionsElement.cloneNode(true)
    optionsCopy.style.filter = "opacity(0)"
    optionsCopy.style.position = "absolute"
    optionsCopy.style.top = 0
    optionsCopy.style.left = 0
    optionsCopy.style.width = this.optionsElement.getBoundingClientRect().width + "px"

    document.body.append(optionsCopy)

    let options = []
    filteredNodes.forEach(node => {
      let 
      option = El("div", "option", undefined)
      option.innerText = node.text
      
      for(let key in node.labels) {
        if(node.labels[key])
          option.innerText = `[${key.capitalize()}] ` + option.innerText
      }

      option.style.filter = "opacity(0)"
      option.dataset.id = node.id
      option.dataset.playsfx = ""
      option.dataset.sounds = "buttonHover buttonClick"
      option.dataset.playonevents = "mouseover mousedown"
      optionsCopy.append(option)
      options.push(option)
    })

    optionsCopy.removeAttribute("style")
    this.optionsElement.replaceWith(optionsCopy)
    this.optionsElement = optionsCopy
    options.forEach(option => option.removeAttribute("style"))
    this.scrollDown()

    this.generateWaitingBlock()

    AudioManager.playSFX("dialogueOptionsShow")
  }
  clearOptions() {
    let options = Qa('#dialogue-options .option')
    
    if(!options.length) return

    options.forEach(o => o.remove())
    this.optionsElement.classList.add("inactive")

    this.destroyWaitingBlock()
    AudioManager.playSFX("dialogueOptionsHide")

    this.dialogueContent.style.justifyContent = ""
  }
  generateWaitingBlock() {
    let block = El("div", "dialogue-block waiting-block")
    let bubble = El("div", "chat-bubble ui-button-minimal-alt-filled orange")

    /* this shit animates the 3 circles element inside the waiting bubble */
    let img = new Image(); img.style.width = "50px"
    let animIndex = 0
    let interval = setInterval(() => {
      img.src = `assets/ui/chat/chatCirclesWaiting000${animIndex}.png`
      animIndex++
      if(animIndex > 9)
        animIndex = 0
      if(!img.isConnected) {
        window.clearInterval(interval)
      }
    }, 250)

    bubble.append(img)
    block.append(bubble)
    this.dialogueContent.append(block)

    /* this enables scrolling for the dialogue but only while the player is picking from options */
    setTimeout(() => {
      let totalDialogueHeight = sum(...Qa("#dialogue-content .chat-bubble").map(bubble => bubble.getBoundingClientRect().height + 20))
      console.log(totalDialogueHeight)
      if(totalDialogueHeight < 540) return

      this.dialogueContent.style.justifyContent = "flex-start"
      this.dialogueContent.scrollTo({behavior: "auto", top: this.dialogueContent.scrollHeight + 50})
    }, 400)
  }
  destroyWaitingBlock() {
    Q(".dialogue-block.waiting-block")?.remove()
  }
  endDialogue(endMessage) {
    if(this.isDialogueFinished) return

    this.isDialogueFinished = true
    AudioManager.playSFX("speakerLeaveDialogue")
    this.generateDialogueEndBlock(endMessage)
    Qa(".chat-portrait-big").forEach(portrait => portrait.style.filter = "grayscale(0.5) brightness(0.6)")
  }
  generateDialogueEndBlock(endMessage) {
    let block = El("div", "dialogue-end-block ui-graphic")
    let text = El("div", "dialogue-block-informatory-text-bubble")

    text.innerText = endMessage ?? "All participants left, you can close the window."
    block.append(text)
    Q('#dialogue-content').append(block)
    this.scrollDown()

    let option = El("div", "option leave-call-option", undefined, "Leave call")

    /* this is a terrible hack so the intro quest can continue */
    let closeButton = Q("#leave-call-button")
    option.onclick = () => closeButton.click()

    this.optionsElement.append(option)
  }
  //#region fact switcher
  setupFactSwitcher() {
    /* create an index of facts that have been altered for the sake of dialogue testing */
    this.alteredFacts = {} 
  }
  switchFact(fact) {

  }
  //#endregion
  static hiddenSpeakers = [
    "dummyCaptain",
    "aiAssistant",
  ]
  static bubbleDelay = 450
}