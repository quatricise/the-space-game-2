class Sprite extends Component {
  constructor() {
    super()
  }
  //#region static methods
  static construct(obj) {
    obj.container = new PIXI.Container()
    obj.sprite = {
      all: [],
      highlights: [],
      wreck: [],
    }
    if(!obj.type || !obj.name) console.log(obj.type, obj.name)
    let object_sources = _.cloneDeep(sources.img[obj.type][obj.name])
    let folder = object_sources["folder"]
    if(!folder) console.log(object_sources)
    delete object_sources["folder"]
    //generate a new object containing more detailed info about the images to be loaded, define length for animated sprites
    let new_sources = []
    object_sources.auto?.forEach((src) => {
      let len = src.replace(/[^0-9\.]+/g, '') || 1
      if(src.includes("thumbnail")) {
        return
      }      
      if(src.includes("fill")) {
        new_sources.push({src: "fill.png", length: len})
      }      
      if(src.includes("highlights")) {
        new_sources.push(
          {src: "highlights_0.png", length: len}, 
          {src: "highlights_90.png", length: len}, 
          {src: "highlights_180.png", length: len}, 
          {src: "highlights_270.png", length: len}
        )
      }      
      if(src.includes("linework")) {
        new_sources.push({src: "linework.png", length: len})
      }      
      if(src.includes("shield_charge")) {
        new_sources.push({src: "shield_charge_indicator.png", length: len})
      }      
      if(src.includes("dash_indicator")) {
        new_sources.push({src: "dash_indicator.png", length: len})
      }      
      if(src.includes("brake_indicator")) {
        new_sources.push({src: "brake_indicator.png", length: len})
      }      
      if(src.includes("laser_charge_progress")) {
        new_sources.push({src: "laser_charge_progress_0000.png", length: len})
      }      
      if(src.includes("vwb_outline")) {
        new_sources.push({src: "vwb_outline.png", length: len})
      }      
      if(src.includes("glow")) {
        new_sources.push({src: "glow.png", length: len})
      }
      if(src.includes("wreck")) {
        new_sources.push({src: "wreck_0000.png", length: len})
        //!!!!!!!!!!! fix this inconsistency
      }
      if(src.includes("ghost")) {
        new_sources.push({src: "ghost.png", length: len})
      }      
      if(src.includes("skip")) {
        new_sources.push({src: "skip_0000.png", length: len})
      }      
      if(src.includes("weapon")) {
        new_sources.push({src: src, length: len})
      }      
      if(src.includes("flame")) {
        new_sources.push({src: "flame_0000.png", length: len})
      }  
    })
    
    new_sources.forEach(src => {
      let url = folder + src.src
      let name = src.src
      let wreck = []
      let length = src.length
      let sprite

      if(name.includes("skip")) url = "assets/skip_animation/skip_0000.png"
      if(name.includes("weapon")) 
      {
        let weapon_name = name.split(" ")[1]
        url = "assets/weapon_sprite/" + weapon_name + ".png"
      }

      if(length > 1 && !name.includes("wreck")) 
      {
        sprite = this.animated_sprite(url, length)
        if(name.includes("skip") || name.includes("flame")) {
          sprite.animationSpeed = 0.1 
          sprite.play()
        }
      }
      else
      if(name.includes("wreck")) 
      {
        for (let i = 0; i < length; i++) {
          sprite = PIXI.Sprite.from(folder + "wreck/wreck_000" + i + ".png")
          obj.container.addChild(sprite)
          obj.sprite.all.push(sprite)
          sprite.anchor.set(0.5)
          sprite.alpha = 0.0
          wreck.push(sprite)
        }
      }
      else 
      {
        sprite = PIXI.Sprite.from(url)
      }
      if(name.includes("weapon")) sprite.position.set(obj.weapon_slots[0].x, obj.weapon_slots[0].y)

      if(name.includes("highlights"))            obj.sprite.highlights.push(sprite)
      if(name.includes("wreck"))                 obj.sprite.wreck.push(sprite)
      if(name.includes("ghost"))                 obj.sprite.ghost = sprite
      if(name.includes("skip"))                  obj.sprite.skip = sprite
      if(name.includes("glow"))                  obj.sprite.glow = sprite
      if(name.includes("flame"))                 obj.sprite.flame = sprite
      if(name.includes("fill"))                  obj.sprite.fill = sprite
      if(name.includes("linework"))              obj.sprite.linework = sprite
      if(name.includes("shield_charge"))         obj.sprite.shield_charge = sprite
      if(name.includes("vwb_outline"))           obj.sprite.vwb_outline = sprite
      if(name.includes("dash_indicator"))        obj.sprite.dash_indicator = sprite
      if(name.includes("brake_indicator"))       obj.sprite.brake_indicator = sprite
      if(name.includes("laser_charge_progress")) obj.sprite.laser_charge_progress = sprite
      if(
        name.includes("skip")||
        name.includes("ghost")
      ) {
        //this is to prevent adding the sprite to the container, it's not supposed to be bound to ship position
        return
      }
      sprite.anchor.set(0.5)
      obj.container.addChild(sprite)
      obj.sprite.all.push(sprite)
    })
  }
  static img_sequence(src = "path/to/file0000.png", frames_total = 5) {
    let str = src.slice(0, src.length - 8)
    let sequence = []
      for (let i = 0; i < frames_total; i++) {
        let src;
        if(i > 999) src = str + "" + i + ".png"
        else
        if(i > 99) src = str + "0" + i + ".png"
        else
        if(i > 9) src = str + "00" + i + ".png"
        else src = str + "000" + i + ".png"
        sequence.push(src)
      }
      return sequence
  }
  static animated_sprite(first_image = "assets/file0000.png", image_count) {
    let img_sequence = this.img_sequence(first_image, image_count)
    let textureArray = []
  
    for (let i = 0; i < img_sequence.length; i++)
    {
        let texture = PIXI.Texture.from(img_sequence[i]);
        textureArray.push(texture);
    };
    let sprite = new PIXI.AnimatedSprite(textureArray);
    return sprite
  }
  static update(obj) {
    if(!obj.container) return
    obj.container.position.x = obj.transform.position.x
    obj.container.position.y = obj.transform.position.y
    obj.container.rotation = obj.transform.rotation
    this.update_highlights(obj)
  }
  static update_highlights(obj) {
    if(!obj.sprite.highlights) return
    if(obj.wrecked) return
    let deg = obj.transform.rotation * 180/PI
    for (let [i, image] of obj.sprite.highlights.entries()) {
      //offset in degrees from the facing direction of the object
      let offsetFromFront = i * 90 - deg
      if(offsetFromFront <= -270) offsetFromFront = 360 + offsetFromFront
      offsetFromFront = Math.abs(offsetFromFront)
      //this puts the alpha between 0 and 1 with 0.01 precision
      image.alpha = Math.max(0, Math.round((1 - offsetFromFront/90 )*100)/100) 
    }
  }
  //#endregion
  update() {
    
  }
}