class Sprite extends Component {
  constructor(obj) {
    super(obj)
    this.container = new PIXI.Container()
    this.all = []
    this.highlights = []
    this.wreck = []
    let objectSources = _.cloneDeep(sources.img[obj.type][obj.name])
    let folder = objectSources["folder"]
    delete objectSources["folder"]
    let newSources = []
    objectSources.auto?.forEach((src) => {
      let len = src.replace(/[^0-9\.]+/g, '') || 1
      if(src.includes("thumbnail")) 
        return
      if(src.includes("fill")) {
        newSources.push({src: "fill.png", length: len})
      }      
      if(src.includes("highlights")) {
        newSources.push(
          {src: "highlights0.png", length: len}, 
          {src: "highlights90.png", length: len}, 
          {src: "highlights180.png", length: len}, 
          {src: "highlights270.png", length: len}
        )
      }      
      if(src.includes("linework")) {
        newSources.push({src: "linework.png", length: len})
      }      
      if(src.includes("shieldCharge")) {
        newSources.push({src: "shieldChargeIndicator.png", length: len})
      }      
      if(src.includes("dashIndicator")) {
        newSources.push({src: "dashIndicator.png", length: len})
      }      
      if(src.includes("brakeIndicator")) {
        newSources.push({src: "brakeIndicator.png", length: len})
      }      
      if(src.includes("laserChargeProgress")) {
        newSources.push({src: "laserChargeProgress0000.png", length: len})
      }
      if(src.includes("vwbOutline")) {
        newSources.push({src: "vwbOutline.png", length: len})
      }      
      if(src.includes("glow")) {
        newSources.push({src: "glow.png", length: len})
      }
      if(src.includes("wreck")) {
        newSources.push({src: "wreck0000.png", length: len})
        //!!!!!!!!!!! fix this inconsistency
      }
      if(src.includes("ghost")) {
        newSources.push({src: "ghost.png", length: len})
      }      
      if(src.includes("skip")) {
        newSources.push({src: "skip0000.png", length: len})
      }      
      if(src.includes("weapon")) {
        newSources.push({src: src, length: len})
      }      
      if(src.includes("flame")) {
        newSources.push({src: "flame0000.png", length: len})
      }  
    })
    
    newSources.forEach(src => {
      let url = folder + src.src
      let name = src.src
      let wreck = []
      let length = src.length
      let sprite

      if(name.includes("skip")) url = "assets/skipAnimation/skip0000.png"
      if(name.includes("weapon")) 
      {
        let weaponName = name.split(" ")[1]
        url = "assets/weaponSprite/" + weaponName + ".png"
      }

      if(length > 1 && !name.includes("wreck")) 
      {
        sprite = Sprite.animatedSprite(url, length)
        if(name.includes("skip") || name.includes("flame")) {
          sprite.animationSpeed = 0.1 
          sprite.play()
        }
      }
      else
      if(name.includes("wreck")) 
      {
        for (let i = 0; i < length; i++) {
          sprite = PIXI.Sprite.from(folder + "wreck/wreck000" + i + ".png")
          this.container.addChild(sprite)
          this.all.push(sprite)
          sprite.anchor.set(0.5)
          sprite.alpha = 0.0
          wreck.push(sprite)
        }
      }
      else 
      {
        sprite = PIXI.Sprite.from(url)
      }
      if(name.includes("weapon")) sprite.position.set(obj.weaponSlots[0].x, obj.weaponSlots[0].y)

      if(name.includes("highlights"))             this.highlights.push(sprite)
      if(name.includes("wreck"))                  this.wreck.push(sprite)
      if(name.includes("ghost"))                  this.ghost = sprite
      if(name.includes("skip"))                   this.skip = sprite
      if(name.includes("glow"))                   this.glow = sprite
      if(name.includes("flame"))                  this.flame = sprite
      if(name.includes("fill"))                   this.fill = sprite
      if(name.includes("linework"))               this.linework = sprite
      if(name.includes("shieldCharge"))           this.shieldCharge = sprite
      if(name.includes("vwbOutline"))             this.vwbOutline = sprite
      if(name.includes("dashIndicator"))          this.dashIndicator = sprite
      if(name.includes("brakeIndicator"))         this.brakeIndicator = sprite
      if(name.includes("laserChargeProgress"))    this.laserChargeProgress = sprite
      //this is to prevent adding certain sprites to the container, it's not supposed to be bound to ship position
      if(name.includes("skip") || name.includes("ghost"))
        return
      sprite.anchor.set(0.5)
      this.container.addChild(sprite)
      this.all.push(sprite)
    })
    //#endregion
  }
  //#region instance methods
  update() {
    Sprite.update(this)
  }
  //#endregion
  //#region static methods
  // static construct(obj) {
  //   obj.container = new PIXI.Container()
  //   obj.sprite = {
  //     all: [],
  //     highlights: [],
  //     wreck: [],
  //   }
  //   if(!obj.type || !obj.name) 
  //     console.log(obj.type, obj.name)
  //   let objectSources = _.cloneDeep(sources.img[obj.type][obj.name])
  //   let folder = objectSources["folder"]
  //   if(!folder) 
  //     console.log(objectSources)
  //   delete objectSources["folder"]
  //   //generate a new object containing more detailed info about the images to be loaded, define length for animated sprites
  //   let newSources = []
  //   objectSources.auto?.forEach((src) => {
  //     let len = src.replace(/[^0-9\.]+/g, '') || 1
  //     if(src.includes("thumbnail")) 
  //       return
  //     if(src.includes("fill")) {
  //       newSources.push({src: "fill.png", length: len})
  //     }      
  //     if(src.includes("highlights")) {
  //       newSources.push(
  //         {src: "highlights_0.png", length: len}, 
  //         {src: "highlights_90.png", length: len}, 
  //         {src: "highlights_180.png", length: len}, 
  //         {src: "highlights_270.png", length: len}
  //       )
  //     }      
  //     if(src.includes("linework")) {
  //       newSources.push({src: "linework.png", length: len})
  //     }      
  //     if(src.includes("shieldCharge")) {
  //       newSources.push({src: "shield_charge_indicator.png", length: len})
  //     }      
  //     if(src.includes("dashIndicator")) {
  //       newSources.push({src: "dashIndicator.png", length: len})
  //     }      
  //     if(src.includes("brakeIndicator")) {
  //       newSources.push({src: "brakeIndicator.png", length: len})
  //     }      
  //     if(src.includes("laserChargeProgress")) {
  //       newSources.push({src: "laser_charge_progress_0000.png", length: len})
  //     }      
  //     if(src.includes("vwbOutline")) {
  //       newSources.push({src: "vwbOutline.png", length: len})
  //     }      
  //     if(src.includes("glow")) {
  //       newSources.push({src: "glow.png", length: len})
  //     }
  //     if(src.includes("wreck")) {
  //       newSources.push({src: "wreck_0000.png", length: len})
  //       //!!!!!!!!!!! fix this inconsistency
  //     }
  //     if(src.includes("ghost")) {
  //       newSources.push({src: "ghost.png", length: len})
  //     }      
  //     if(src.includes("skip")) {
  //       newSources.push({src: "skip_0000.png", length: len})
  //     }      
  //     if(src.includes("weapon")) {
  //       newSources.push({src: src, length: len})
  //     }      
  //     if(src.includes("flame")) {
  //       newSources.push({src: "flame_0000.png", length: len})
  //     }  
  //   })
    
  //   newSources.forEach(src => {
  //     let url = folder + src.src
  //     let name = src.src
  //     let wreck = []
  //     let length = src.length
  //     let sprite

  //     if(name.includes("skip")) url = "assets/skipAnimation/skip_0000.png"
  //     if(name.includes("weapon")) 
  //     {
  //       let weaponName = name.split(" ")[1]
  //       url = "assets/weaponSprite/" + weaponName + ".png"
  //     }

  //     if(length > 1 && !name.includes("wreck")) 
  //     {
  //       sprite = this.animatedSprite(url, length)
  //       if(name.includes("skip") || name.includes("flame")) {
  //         sprite.animationSpeed = 0.1 
  //         sprite.play()
  //       }
  //     }
  //     else
  //     if(name.includes("wreck")) 
  //     {
  //       for (let i = 0; i < length; i++) {
  //         sprite = PIXI.Sprite.from(folder + "wreck/wreck_000" + i + ".png")
  //         obj.container.addChild(sprite)
  //         obj.sprite.all.push(sprite)
  //         sprite.anchor.set(0.5)
  //         sprite.alpha = 0.0
  //         wreck.push(sprite)
  //       }
  //     }
  //     else 
  //     {
  //       sprite = PIXI.Sprite.from(url)
  //     }
  //     if(name.includes("weapon")) sprite.position.set(obj.weaponSlots[0].x, obj.weaponSlots[0].y)

  //     if(name.includes("highlights"))             obj.sprite.highlights.push(sprite)
  //     if(name.includes("wreck"))                  obj.sprite.wreck.push(sprite)
  //     if(name.includes("ghost"))                  obj.sprite.ghost = sprite
  //     if(name.includes("skip"))                   obj.sprite.skip = sprite
  //     if(name.includes("glow"))                   obj.sprite.glow = sprite
  //     if(name.includes("flame"))                  obj.sprite.flame = sprite
  //     if(name.includes("fill"))                   obj.sprite.fill = sprite
  //     if(name.includes("linework"))               obj.sprite.linework = sprite
  //     if(name.includes("shieldCharge"))           obj.sprite.shieldCharge = sprite
  //     if(name.includes("vwbOutline"))             obj.sprite.vwbOutline = sprite
  //     if(name.includes("dashIndicator"))          obj.sprite.dashIndicator = sprite
  //     if(name.includes("brakeIndicator"))         obj.sprite.brakeIndicator = sprite
  //     if(name.includes("laserChargeProgress"))    obj.sprite.laserChargeProgress = sprite
  //     if(
  //       name.includes("skip")||
  //       name.includes("ghost")
  //     ) {
  //       //this is to prevent adding the sprite to the container, it's not supposed to be bound to ship position
  //       return
  //     }
  //     sprite.anchor.set(0.5)
  //     obj.container.addChild(sprite)
  //     obj.sprite.all.push(sprite)
  //   })
  // }
  static imgSequence(src = "path/to/file0000.png", framesTotal = 5) {
    let str = src.slice(0, src.length - 8)
    let sequence = []
      for (let i = 0; i < framesTotal; i++) {
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
  static animatedSprite(firstImage = "assets/file0000.png", imageCount) {
    let imgSequence = this.imgSequence(firstImage, imageCount)
    let textureArray = []
  
    for (let i = 0; i < imgSequence.length; i++)
    {
        let texture = PIXI.Texture.from(imgSequence[i]);
        textureArray.push(texture);
    };
    let sprite = new PIXI.AnimatedSprite(textureArray);
    return sprite
  }
  static update(sprite) {
    let obj = sprite.gameObject
    if(!obj.container) return
    obj.container.position.x = obj.transform.position.x
    obj.container.position.y = obj.transform.position.y
    obj.container.rotation = obj.transform.rotation
    this.updateHighlights(obj)
  }
  static updateHighlights(sprite) {
    let obj = sprite.gameObject
    if(!obj.sprite.highlights) return
    if(obj.wrecked) return
    let deg = obj.transform.rotation * 180/PI
    for (let [index, image] of obj.sprite.highlights.entries()) {
      //offset in degrees from the facing direction of the object
      let offsetFromFront = index * 90 - deg
      if(offsetFromFront <= -270) offsetFromFront = 360 + offsetFromFront
      offsetFromFront = Math.abs(offsetFromFront)
      //this puts the alpha between 0 and 1 with 0.01 precision
      image.alpha = Math.max(0, Math.round((1 - offsetFromFront/90 )*100)/100) 
    }
  }
  //#endregion
}