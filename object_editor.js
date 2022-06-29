class ObjectEditor {
  constructor() {
    this.element = Q('#object-editor')
    this.graphics = new PIXI.Graphics()
    this.dropdown = Q('#object-editor-dropdown')
    this.object_list = Q('#object-editor-dropdown .dropdown-list')
    this.prop_list = Q("#object-property-list")
    this.obj_name = Q('#object-editor-object-name h2')
    this.input = Q('#object-editor-dropdown-search-bar-input')
    this.rewrite_input = El("input", undefined, [["type", "text"]])
    this.rewrite_input.style.backgroundColor = "var(--dark-4)"
    this.objects = []
    this.active = {}
    this.edited //html element
    this.nest_level = 0
    this.nest_path = ""
    this.group_count = 0
    this.location
    this.keys = []
    this.edit_globally = false
    this.state = new State(
      "default",
      "editing"
    )
  }
  import(path) {
    this.objects = []
    let steps = path.split(".")
    let loc = data
    console.log(steps)
    steps.forEach(step => loc = loc[step])
    for(let key in loc) {
      loc[key].key = key
      console.log(loc[key].key)
      this.objects.push(loc[key])
    }
    this.keys = Object.keys(loc)
    this.view_collection()
  }
  add_prop(newprop, default_value) {
    this.objects.forEach(obj => {
      obj[newprop] = default_value
    })
  }
  view_collection() {
    this.object_list.innerHTML = ""
    this.objects.forEach((obj, index) => {
      let cont = El('div', "object-item", undefined, this.keys[index])
      cont.dataset.key = obj.key
      this.object_list.append(cont)
    })
  }
  view_object_tree(obj) {
    this.prop_list.innerHTML = ""
    this.location = this.prop_list
    this.group_count = 0
    this.nest_level = 0
    this.nest_path = ""
    this.view_object(obj)
    this.obj_name.innerText = obj.key
    this.active = obj
  }
  edit_begin(element) {
    if(this.state.is("editing")) this.edit_end()
    this.state.set("editing")
    if(keys.shift || keys.shift_right) {
      this.edit_globally = true
      this.rewrite_input.style.backgroundColor = "hsl(210,40%,20%)"
      this.rewrite_input.style.borderWidth = "2px"
      this.rewrite_input.style.borderColor = "hsl(210,40%,40%)"
      this.rewrite_input.style.borderStyle = "solid"
    }
    else {
      this.rewrite_input.style = ""
    }
    element.replaceWith(this.rewrite_input)
    this.rewrite_input.value = element.innerText
    this.edited = element
    setTimeout(()=> {
      this.rewrite_input.focus()
    },80)
  }
  edit_confirm() {
    if(this.edited.dataset.type === "key") {
      this.objects.forEach(obj => {
        let curr = obj
        let steps = this.edited.dataset.nestpath.split(".")
        steps = steps.filter(s => s !== "")
        steps.forEach(step => curr = curr[step])
        let oldkey = this.edited.innerText
        let val = curr[oldkey]
        let newkey = this.rewrite_input.value
        curr[newkey] = val
        delete curr[oldkey]
      })
    }
    if(this.edited.dataset.type === "value") {
      console.log("value")
      let objects
      if(this.edit_globally) objects = this.objects
      if(!this.edit_globally) objects = [this.active]

      objects.forEach(obj => {
        let curr = obj
        let steps = this.edited.dataset.nestpath.split(".")
        steps = steps.filter(s => s !== "")
        steps.forEach(step => curr = curr[step])
        console.log(steps)
        let key = this.edited.dataset.key
        if(this.rewrite_input.value === "false") curr[key] = false
        if(this.rewrite_input.value === "true")  curr[key] = true
        else curr[key] = this.rewrite_input.value
      })
    }
    this.edited.innerText = this.rewrite_input.value
    this.edit_end()
  }
  edit_end() {
    this.rewrite_input.replaceWith(this.edited)
    this.state.set("default")
  }
  // view_object(obj) {
  //   for(let key in obj) {
  //     let cont = El("div", "object-property", undefined, )
  //     let prop = El("div", "property-key", undefined, key)
  //     let colon = El("div", undefined, undefined, ":")
  //     let val = El("div", "property-value", undefined, obj[key])
  //     prop.dataset.type = "key"
  //     prop.dataset.nestpath = this.nest_path
  //     val.dataset.type = "value"
  //     val.dataset.key = key
  //     val.dataset.nestpath = this.nest_path
  //     cont.append(prop, colon, val)
  //     cont.dataset.nestpath = this.nest_path
  //     this.location.append(cont) 

  //     if(typeof obj[key] === "object") {
  //       // console.log("nested")
  //       colon.remove()
  //       val.remove()
  //       this.nest_level++
  //       this.group_count++
  //       this.nest_path += "." + key
  //       let group = El("div", "object-property-group", [["id", "object-property-group" + this.group_count]])
  //       let caret = El("div", "toggle-arrow icon-tiny")
  //       caret.style.alignSelf = "center"
  //       caret.dataset.group = this.group_count
  //       prop.dataset.group = this.group_count
  //       cont.append(caret)
  //       this.location.append(group)
  //       this.location = group
  //       if(Array.isArray(obj[key])) {
  //         //do view_array
  //       }
  //       this.view_object(obj[key])
  //     }
  //   }
  //   if(this.nest_level > 0) {
  //     // console.log("un-nested")
  //     this.nest_level -= 1
  //     let last = this.nest_path.lastIndexOf(".")
  //     if(last === 0) this.nest_path = ""
  //     else this.nest_path = this.nest_path.substring(0, last)
  //     this.location = this.location.parentElement
  //   }
  // }
  view_object(obj) {
    let isarray = false
    let generate = (key) => {
      let cont = El("div", "object-property", undefined, )
      let prop = El("div", "property-key", undefined, key)
      let colon = El("div", undefined, undefined, ":")
      let drag = El("div", "drag-widget icon-small")
      let opening = El("div", undefined, undefined, "(")
      let closing = El("div", undefined, undefined, ")")
      let val = El("div", "property-value", undefined,)
      prop.dataset.type = "key"
      prop.dataset.nestpath = this.nest_path

      let valtext = obj[key].toString()
      if(typeof obj[key] === "function") {
        valtext = valtext.replace(key, "")
        let o = valtext.indexOf("{")
        let c = valtext.lastIndexOf("}")
        valtext = valtext.substring(o + 1, c)
        // console.log(valtext)
      }
      val.innerText = valtext
      val.dataset.type = "value"
      val.dataset.key = key
      val.dataset.nestpath = this.nest_path
      if(!isarray) cont.append(drag, prop, colon)
      cont.append(val)
      cont.dataset.nestpath = this.nest_path
      this.location.append(cont) 

      if(typeof obj[key] === "object") {
        colon.remove()
        val.remove()
        this.nest_level++
        this.group_count++
        this.nest_path += "." + key
        let group = El("div", "object-property-group", [["id", "object-property-group" + this.group_count]])
        let caret = El("div", "toggle-arrow icon-tiny")
        caret.style.alignSelf = "center"
        caret.dataset.group = this.group_count
        prop.dataset.group = this.group_count
        cont.append(caret)
        this.location.append(group)
        this.location = group
        this.view_object(obj[key])
      }
    }

    if(Array.isArray(obj)) {
      console.log('array')
      isarray = true
      let opening = El("div", "no-select", undefined, "[")
      let closing = El("div", "no-select", undefined, "]")
      let ind = getChildIndex(this.location) - 1
      this.location.parentElement.childNodes[ind].append(opening)
      this.location.parentElement.append(closing)
      obj.forEach((child, index) => {
        generate(index)
      })
    }
    else 
    {
      for(let key in obj) {
        generate(key)
      }
    }
    if(this.nest_level > 0) {
      // console.log("un-nested")
      this.nest_level -= 1
      let last = this.nest_path.lastIndexOf(".")
      if(last === 0) this.nest_path = ""
      else this.nest_path = this.nest_path.substring(0, last)
      this.location = this.location.parentElement
    }
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
  export() {
    let newobj = {}
    this.objects.forEach(obj => {
      newobj[obj.key] = obj
    })
    for(let key in newobj) {
      delete newobj[key].key
    }
    console.log(newobj)
  }
  add_obj() {
    let newobj = _.cloneDeep(this.objects.at(-1))
    this.keys.push(newobj.key)
    this.objects.push(newobj)
    this.view_collection()
  }
  handle_input(event) {
    if(ui.windows.active !== this) return
    switch(event.type) {
      case "keydown"    : {this.handle_keydown(event); break;}
      case "keyup"      : {this.handle_keyup(event); break;}
      case "mousemove"  : {this.handle_mousemove(event); break;}
      case "mousedown"  : {this.handle_mousedown(event); break;}
      case "mouseup"    : {this.handle_mouseup(event); break;}
      case "click"      : {this.handle_click(event); break;}
    }
  }
  handle_keydown(event) {
    if(event.code === "Escape") this.edit_end()
    if(event.code === "Enter") this.edit_confirm()
  }
  handle_keyup(event) {

  }
  handle_mousemove(event) {

  }
  handle_mousedown(event) {
    let target = event.target
    if(event.button === 0) {
      if(target.closest(".add-prop")) {
        this.add_prop("prop" + randR(0,100000), true)
        this.view_object_tree(this.active)
      }
      if(target.closest(".object-item")) {
        let obj = this.objects.find(obj => obj.key === target.closest(".object-item").dataset.key)
        this.view_object_tree(obj)
      }
      if(target.closest(".icon-tiny.toggle-arrow")) {
        let icon = target.closest(".icon-tiny.toggle-arrow")
        icon.classList.toggle("active")
        let group = this.element.querySelector("#object-property-group" + icon.dataset.group)
        group.classList.toggle("hidden")
      }
      if(target.closest("#object-editor-add-obj")) {
        this.add_obj()
      }
      if(target.closest(".property-key")) this.edit_begin(target.closest(".property-key"))
      if(target.closest(".property-value")) this.edit_begin(target.closest(".property-value"))

    }
  }
  handle_mouseup(event) {

  }
  handle_click(event) {

  }
}