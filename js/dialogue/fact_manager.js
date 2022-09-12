class FactManager {
  constructor(game_window, view) {
    this.open = false
    this.create_html(game_window, view)
  }
  create_html(game_window, view) {
    let element = El("div", "fact-manager " + view)
    let header = El("div", "fact-container-header")
    let list = El("div", "fact-list")
    let search_list = El("div", "fact-search-list")
    let widget_remove = El("div", "dialogue-node-widget remove")
    let btn_add_fact = El("div", "fact-add-button", [["title", "Add new fact"]])
    let fact_input_wrapper = El("div", "fact-input-wrapper")
    let fact_input = El("div", "fact-input", [["type", "text"]])
    let searchbar = El("div", "fact-search-bar")
    let search_icon = El("div", "fact-search-icon")

    header.append(widget_remove, btn_add_fact)
    element.append(header, list, search_list)
    //
    this.element = element
    this.list = list
    this.search_list = search_list
    game_window.element.append(this.element)
  }
  // show(node) {
  //   let target = event.target
  //   if(target.closest(".dialogue-node")) {
  //     let rect = target.closest(".dialogue-node").getBoundingClientRect()
  //     this.element.classList.remove("hidden")
  //     this.open = true
  //     this.element.style.left = rect.left + rect.width + 10 + "px"
  //     this.element.style.top = rect.top + "px"
  //     this.get_facts_for_node(node)
  //   }
  //   else if(this.active_node) {
  //     let rect = this.active_node.element.getBoundingClientRect()
  //     this.element.classList.remove("hidden")
  //     this.open = true
  //     this.element.style.left = rect.left + rect.width + 10 + "px"
  //     this.element.style.top = rect.top + "px"
  //     this.get_facts_for_node(node)
  //   }
  // }
  show(node) {
    this.element.classList.remove("hidden")
  }
  get_facts_for_node(node) {
    node.facts.forEach(fact => {
      
    })
  }
  hide() {
    this.element.classList.add('hidden')
    this.open = false
  }
  toggle(event)  {
    this.open = !this.open
    if(this.open) 
    {
      this.show(event)
    }
    else 
    {
      this.hide()
    }
    this.update_icons()
  }
  update_icons() {
    Qa(".dialogue-node-widget.list").forEach(icon => {
      if(this.open) 
      {
        icon.classList.add("active")
      }
      else icon.classList.remove('active')
    })
  }
  display_facts(node) {
    this.fact_editor.list.innerHTML = ""
    node.facts.forEach(fact => {
      let cont = El("div", "fact-item")
      let identifier = El('div', "fact-identifier", [["title","Unique fact identifier"]], fact.identifier)
      let value = El('div', "fact-value", undefined, fact.value)
      let cross = El('div', "fact-icon-remove", [["title", "remove"]])
      identifier.dataset.nodeid = node.id
      identifier.dataset.identifier = fact.identifier
      value.dataset.nodeid = node.id
      value.dataset.identifier = fact.identifier
      value.title = "Click to flip value"
      fact.value ? value.classList.add("true") : value.classList.add("false")
      cont.dataset.nodeid = node.id
      cont.append(identifier, value, cross)
      this.fact_editor.list.append(cont)
    })
  }
  //#region fact create, update, delete
  create_fact(identifier, value) {
    if(!identifier || value === undefined) return false
    if(facts.find(f => f.identifier === identifier)) {
      console.warn("fact already exists")
      return false
    }
    Qa(".icon-export-facts").forEach(
      icon => 
      icon.classList.add('warning')
    )
    let id = facts.length
    facts.push(
      {
        id: id,
        identifier: identifier,
        value: value,
      }
    )
    return true
  }
  update_fact(identifier, newvalue) {
    let fact = facts.find(f => f.identifier === identifier)
    if(!fact) throw `Fact ${identifier} not found.`
    fact.value = newvalue
  }
  delete_fact(identifier) {
    let fact = facts.find(f => f.identifier === identifier)
    if(!fact) throw `Fact ${identifier} not found.`
    facts.remove(fact)
  }
  //#endregion
  export() {
    exportToJsonFile(facts, "facts")
  }
}

// <!-- <div id="fact-container" class="fact-container hidden">
// <div class="fact-container-header">
//   <div class="dialogue-node-widget remove"></div>
//   <div class="fact-add-button" title="Add new fact"></div>
//   <div class="fact-input-wrapper">
//     <input id="fact-input" class="fact-input" type="text"></input>
//   </div>
// </div>
// <div>
//   <div class="fact-search-bar">
//     <div class="fact-search-icon"></div>
//     <input type="text" name="" id="fact-search-input" onfocus="dialogue_editor.display_fact_search()" oninput="dialogue_editor.display_fact_search()">
//   </div>
//   <div id="fact-search-list" class="fact-search-list hidden">
    
//   </div>
// </div>
// <div class="fact-list-label">Active</div>
// <div id="fact-list" class="fact-list"></div>
// </div> -->