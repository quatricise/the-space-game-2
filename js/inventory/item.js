class Item {
  constructor(name) {
    this.name = name
  }
  static createItemElement(itemData, options = {enableDrag: false, smallItem: false}) {
    let 
    item = El("div", "inventory-item tooltip")
    item.dataset.tooltipdescription = itemData.description
    item.dataset.tooltip =            itemData.title
    item.dataset.itemname =           itemData.name
    item.dataset.itemtype =           itemData.itemType ?? "regular"
    item.dataset.tooltiptype =        itemData.itemType || "item"
    item.dataset.playsfx =            ""
    item.dataset.sounds =             "buttonNoAction"
    item.dataset.playonevents =       "mouseover"
    item.dataset.volumes =            "0.15"
    item.dataset.cansell =            boolToString(itemData.flags.canSell)
    item.dataset.buycost =            itemData.buyCost

    let 
    img = new Image()
    img.src = `assets/${itemData.folder ?? "item"}/${itemData.thumbnail}.png`
    
    if(options.enableDrag)
      item.dataset.draggable = "true"
    if(options.smallItem)
      item.classList.add("small")

    item.append(img)
    return item
  }
  static createEmptyItemElement(options = {smallItem: false}) {
    let item = El("div", "inventory-item empty")
    let img = new Image()
    options.smallItem ? img.src = "assets/item/emptySmall.png" : img.src = "assets/item/empty.png"
    item.append(img)
    return item
  }
  static registerItemsFromWeapons() {
    for(let name in data.weapon) {
      this.registerItemDataFromWeapon(name, data.weapon[name])
    }
  }
  static registerItemDataFromWeapon(name, weaponRef) {
    data.item[name] = {
      name: name,
      itemType: "weapon",
      title: weaponRef.displayName,
      description: weaponRef.description,
      thumbnail: name,
      buyCost: weaponRef.buyCost,
      folder: "weapon",
      flags: {canSell: true, questItem: false, canSellOnBlackMarket: true}
    }
  }
}