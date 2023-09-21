class FactEditor {
  constructor(gameWindow, viewportSide) {
    this.gameWindow = gameWindow
    this.open = true

    /* object containing some relevant html elements inside this window */
    this.elements = {}
    
    this.activeElements = {
      criterion: null
    }
    this.activeObjects = {
      criterion: null
    }
    this.createHtml(viewportSide)
  }
  show() {
    this.open = true
    this.elements.container.classList.remove("hidden")
    this.updateIconsForNodes()
  }
  hide() {
    this.open = false
    this.elements.container.classList.add('hidden')
    this.updateIconsForNodes()
  }
  toggle() {
    console.log("toggle")
    if(!this.open) 
      this.show()
    else 
      this.hide()
  }
  updateIconsForNodes() {
    Qa(".dialogue-node-widget.list").forEach(icon => {
      if(this.open)
        icon.classList.add("active")
      else 
        icon.classList.remove('active')
    })
  }
  //#region HTML layer
  createHtml(viewportSide) {
    let element =             El("div", "fact-editor " + viewportSide)
    let header =              El("div", "fact-container-header", undefined, "Node properties")
    let buttonClose =         El("div", "dialogue-node-widget remove")
    let btnAddFact =          El("div", "fact-add-button", [["title", "Add new fact"]])
    let factInputWrapper =    El("div", "fact-input-wrapper")
    let factInput =           El("div", "fact-input", [["type", "text"]])
    let searchbar =           El("div", "fact-search-bar")
    let searchIcon =          El("div", "fact-search-icon")

    let criteriaContainer =   El("div", "fact-editor-criteria-container")
    let criteriaHeader =      El("div", "fact-editor-criteria-header", undefined, "Node criteria")
    let addCriterionButton =  El("div", "fact-editor-add-criterion-button ui-graphic")

    criteriaContainer.append(criteriaHeader, addCriterionButton)
    header.append(buttonClose)
    element.append(header, criteriaContainer)

    addCriterionButton.onclick = () => this.createCriterion()

    this.elements.container =         element
    this.elements.criteriaContainer = criteriaContainer
    this.elements.criteriaHeader =    criteriaHeader
    this.gameWindow.element.append(this.elements.container)
  }
  createCriterionHTML(criterion) {
    let container = El("div", "criterion-container")
    let addRequirementButton = El("div", "fact-editor-add-requirement-button ui-graphic")
    let deleteCriterionButton = El("div", "fact-editor-delete-criterion-button ui-graphic")
    let buttons = El("div", "criterion-buttons")

    container.onclick =             () => this.setActiveCriterion(criterion)
    addRequirementButton.onclick =  () => this.addRequirementToCriterion(criterion)

    buttons.append(addRequirementButton, deleteCriterionButton)
    container.append(buttons)
    container.dataset.criterionindex = criterion.index
    this.activeElements.criterion = container
    this.elements.criteriaContainer.append(container)

    criterion.element = container
  }
  createRequirementHTML(criterion, requirement, requirementIndex) {
    let row = El("div", "criterion-requirement " + requirement.type)
    let toggle = El("div", "criterion-requirement-toggle", [["title", "Flip type"]], requirement.type.capitalize())
    let deleteButton = El("div", "criterion-requirement-delete-button ui-graphic")
    let body = El("div", "criterion-requirement-body")
    let filler = El("div", "filler")
    
    let optionalElements = []
    console.log(requirement)
    switch(requirement.type) {
      case "condition": {
        optionalElements = [
          El("div", `requirement-property editable${requirement.entryObject ? "" : " unset"}`,          [["data-editable", "true"], ["data-datatype", "entry"]],              requirement.entryObject || "Entry object"),
          El("div", `requirement-property editable${requirement.accessorChain.length ? "" : " unset"}`, [["data-editable", "true"], ["data-datatype", "accessorChain"]],      requirement.accessorChain.join(",") || "accessorChain"),
          El("div", `requirement-property editable${requirement.condition.type ? "" : " unset"}`,       [["data-editable", "true"], ["data-datatype", "conditionType"]],      requirement.condition.type || "Exists"),
          El("div", `requirement-property editable${requirement.condition.testValue ? "" : " unset"}`,  [["data-editable", "true"], ["data-datatype", "conditionTestValue"]], requirement.condition.testValue || "Test value"),
        ]
        break
      }
      case "fact": {
        optionalElements = [
          El("div", `requirement-property editable${requirement.identifier ? "" : " unset"}`,           [["data-editable", "true"], ["data-datatype", "identifier"]], requirement.identifier || "fact_identifier"),
          El("div", `requirement-property boolean editable ${boolToString(requirement.expectedValue)}`, [["data-editable", "true"], ["data-datatype", "expectedvalue"], ["data-isboolean", "true"]], boolToString(requirement.expectedValue)),
        ]
        break
      }
    }
    toggle.dataset.requirementtype = requirement.type
    body.append(...optionalElements)
    row.append(toggle, body, filler, deleteButton)

    row.dataset.requirementindex = +requirementIndex

    this.activeElements.criterion.append(row)
  }
  clearHTML() {
    Array.from(this.elements.container.querySelectorAll(".criterion-container"))
    .forEach(element => element.remove())
  }
  refreshStructure() {
    this.gameWindow.activeNode.criteria.forEach((criterion, index) => criterion.index = index)

    this.clearHTML()
    this.refreshHTML()
  }
  refreshHTML() {
    this.gameWindow.activeNode.criteria.forEach(criterion => {
      this.createCriterionHTML(criterion)
      for(let [index, requirement] of criterion.requirements.entries()) {
        this.createRequirementHTML(criterion, requirement, index)
      }
    })
    this.elements.criteriaHeader.innerText = `Node criteria [ ${this.gameWindow.activeNode.criteria.length} ]`
  }
  //#endregion HTML layer
  //#region data manipulation
  addRequirementToCriterion(criterion) {
    criterion.addRequirement(Requirement.empty("condition"))
    this.refreshStructure()
  }
  deleteRequirementFromCriterion(criterionIndex, requirementIndex) {
    this.gameWindow.activeNode.criteria[criterionIndex].requirements.removeAt(requirementIndex)
    this.refreshStructure()
  }
  createCriterion() {
    let 
    criterion = new Criterion()
    criterion.index = this.gameWindow.activeNode.criteria.length
    this.gameWindow.activeNode.criteria.push(criterion)
    this.refreshStructure()
  }
  toggleRequirementType(criterionIndex, requirementIndex) {
    let 
    requirement = this.gameWindow.activeNode.criteria[criterionIndex].requirements[requirementIndex]
    requirement.flipType()
    this.refreshStructure()
  }
  flipRequirementExpectedValue(criterionIndex, requirementIndex) {
    let 
    requirement = this.gameWindow.activeNode.criteria[criterionIndex].requirements[requirementIndex]
    requirement.expectedValue = !requirement.expectedValue
    this.refreshStructure()
  }
  setRequirementIdentifier(criterionIndex, requirementIndex, value) {
    let 
    requirement = this.gameWindow.activeNode.criteria[criterionIndex].requirements[requirementIndex]
    requirement.identifier = value
    this.refreshStructure()
  }
  setRequirementEntryObject(criterionIndex, requirementIndex, value) {
    let 
    requirement = this.gameWindow.activeNode.criteria[criterionIndex].requirements[requirementIndex]
    requirement.entryObject = value
    this.refreshStructure()
  }
  setRequirementAccessorChain(criterionIndex, requirementIndex, value) {
    let 
    requirement = this.gameWindow.activeNode.criteria[criterionIndex].requirements[requirementIndex]
    requirement.accessorChain = value.replaceAll(" ", "").split(",")
    this.refreshStructure()
  }
  setConditionType(criterionIndex, requirementIndex, value) {
    if(!Requirement.conditionTypes.findChild(value)) return console.error("invalid condition type")

    let 
    requirement = this.gameWindow.activeNode.criteria[criterionIndex].requirements[requirementIndex]
    requirement.condition.type = value
    this.refreshStructure()
  }
  setConditionTestValue(criterionIndex, requirementIndex, value) {
    let 
    requirement = this.gameWindow.activeNode.criteria[criterionIndex].requirements[requirementIndex]
    isNaN(+value) ? 
    requirement.condition.testValue = value :
    requirement.condition.testValue = +value
    this.refreshStructure()
  }
  cycleConditionType(criterionIndex, requirementIndex) {
    let 
    requirement = this.gameWindow.activeNode.criteria[criterionIndex].requirements[requirementIndex]
    let index = Requirement.conditionTypes.indexOf(requirement.conditionType)
    requirement.condition.type = Requirement.conditionTypes[++index] ?? Requirement.conditionTypes[0]
    this.refreshStructure()
  }
  setActiveCriterion(criterion) {
    Qa(".criterion-container").forEach(element => element.classList.remove("active"))
    this.activeObjects.criterion = criterion
    this.activeElements.criterion = criterion.element
    this.activeElements.criterion.classList.add("active")
  }
  deleteCriterion(criterionIndex) {
    this.gameWindow.activeNode.criteria.removeAt(criterionIndex)
    this.refreshStructure()
  }
  //#endregion data manipulation
  toggleEditability() {
    if(this.gameWindow.activeNode) {
      this.elements.container.classList.remove("disabled")
    }
    else {
      this.elements.container.classList.add("disabled")
      this.clearHTML()
    }
  }
}