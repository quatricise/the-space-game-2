class DialogueEditorSection {
  constructor() {
    this.nodes = new Set()
    this.elements = {}
    this.name = "Section " + dialogueEditor.sections.size
    this.createHTML()
  }
  createHTML() {
    let container =    El("div", "dialogue-editor-section")
    let header =       El("div", "dialogue-editor-section-header")
    let title =        El("div", "dialogue-editor-section-title", [["title", "Click to rename section"]], this.name)
    let deleteButton = El("div", "dialogue-editor-section-delete-button")

    this.elements.container = container
    this.elements.title = title
    this.elements.header = header
    this.elements.deleteButton = deleteButton

    header.append(title, deleteButton)
    container.append(header)
    dialogueEditor.element.append(container)
  }
  addNodes(...nodes) {
    dialogueEditor.sections.forEach(section => {
      nodes.forEach(n => section.nodes.delete(n))
    })
    nodes.forEach(n => this.nodes.add(n))
  }
  setName(name) {
    this.name = name
    this.elements.title.innerText = name
  }
  update() {
    let nodes = Array.from(this.nodes)

    /* query DOM for data */
    let nodeRects = nodes.map(node => node.element.getBoundingClientRect())
    let headerRect = this.elements.header.getBoundingClientRect()

    let leftMostPoint =   Math.min(...nodeRects.map(rect => rect.left)) 
    let rightMostPoint =  Math.max(...nodeRects.map(rect => rect.left + rect.width)) 
    let topMostPoint =    Math.min(...nodeRects.map(rect => rect.top)) 
    let bottomMostPoint = Math.max(...nodeRects.map(rect => rect.top + rect.height)) 
    
    let outset = 30

    this.elements.container.style.left =    (leftMostPoint - outset) + "px"
    this.elements.container.style.top =     (topMostPoint - outset) + "px"
    this.elements.container.style.width =   (rightMostPoint - leftMostPoint + outset*2) + "px"
    this.elements.container.style.height =  (bottomMostPoint - topMostPoint + outset*2) + "px"

    /* flip the location of the header to try and make it visible */
    if(leftMostPoint < outset)
      this.elements.header.classList.add("right")
    else
      this.elements.header.classList.remove("right")
    if(topMostPoint < outset*2)
      this.elements.header.classList.add("bottom")
    else
      this.elements.header.classList.remove("bottom")

    if(this.nodes.size === 0)
      this.destroy()
  }
  destroy() {
    this.elements.container.remove()
    dialogueEditor.sections.delete(this)
  }
}