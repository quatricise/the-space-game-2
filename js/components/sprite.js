class Sprite extends Component {
  constructor(gameObject) {
    super(gameObject)
  }
  update() {
    /* update container */
    this.container.position.set(this.gameObject.transform.position.x, this.gameObject.transform.position.y)
    this.container.rotation = this.gameObject.transform.rotation

    /* highlights */
    if(this.highlights) {
      if(this.gameObject.transform.rotation === this.gameObject.performanceData.previousRotation) return
      if(this.gameObject.stealth?.active) return
      if(this.gameObject.wrecked) return
      if(this.gameObject.dying) return
  
      let deg = this.gameObject.transform.rotation * 180/PI
      this.highlights.forEach((image, index) => {
        /* offset in degrees from the facing direction of the object */
        let offsetFromFront = index * 90 - deg
        if(offsetFromFront <= -270) 
          offsetFromFront += 360
        offsetFromFront = Math.abs(offsetFromFront)

        /* this puts the alpha between 0 and 1 with 0.01 precision */
        image.alpha = Math.max(0, Math.round((1 - offsetFromFront/90 )*100)/100) 
        image.alpha <= 0 ? image.renderable = false : image.renderable = true
        })
    }

    /* minimap icon */
    if(this.minimapIcon) {
      this.minimapIcon.position.set(this.gameObject.transform.position.x * Game.minimapScaleFactor, this.gameObject.transform.position.y * Game.minimapScaleFactor)
      this.minimapIcon.rotation = this.gameObject.transform.rotation
    }
  }
  //#region static methods
  static createDefault(gameObject) {
    let spriteComponent = new Sprite(gameObject)

    spriteComponent.container = new PIXI.Container()
    spriteComponent.all = []
    spriteComponent.highlights = []
    spriteComponent.flames = {}
    spriteComponent.wreck = []
    spriteComponent.orbits = []

    let newSources = []
    let objectSources = _.cloneDeep(sources.img[gameObject.type][gameObject.name])
    let folder = objectSources["folder"]
    delete objectSources["folder"]

    /* Preprocess sources, for some reason I've forgotten why this needs to be done. */
    objectSources.auto.forEach((src) => {
      let length = src.replace(/[^0-9\.]+/g, '') || 1

      if(src.includes("thumbnail")) 
        return
      else 
      if(src.includes("linework")) {
        length <= 1 ? newSources.push({src: "linework.png", length: length}) : newSources.push({src: "linework0000.png", length: length}) 
      }
      else 
      if(src.includes("fill")) {
        newSources.push({src: "fill.png", length: length})
      }
      else
      if(src.includes("highlights")) {
        newSources.push(
          {src: "highlights0.png", length: length}, 
          {src: "highlights90.png", length: length}, 
          {src: "highlights180.png", length: length}, 
          {src: "highlights270.png", length: length}
        )
      }
      else 
      if(src.includes("coatingLayer")) {
        newSources.push({src: "coatingLayer0000.png", length: length})
      }
      else 
      if(src.includes("coatingAnimation")) {
        newSources.push({src: "coatingAnimation0000.png", length: length})
      }
      else 
      if(src.includes("shieldCharge")) {
        newSources.push({src: "shieldChargeIndicator.png", length: length})
      }      
      else 
      if(src.includes("shieldForceField")) {
        newSources.push({src: "shieldForceField.png", length: length})
      }      
      else 
      if(src.includes("shieldBubble")) {
        newSources.push({src: "shieldBubble.png", length: length})
      }
      else 
      if(src.includes("shieldPulse")) {
        length <= 1 ? newSources.push({src: "shieldPulse.png", length: length}) : newSources.push({src: "shieldPulse0000.png", length: length}) 
      }
      else
      if(src.includes("shieldHardLightFront")) {
        length <= 1 ? newSources.push({src: "shieldHardLightFront.png", length: length}) : newSources.push({src: "shieldHardLightFront0000.png", length: length}) 
      }
      else
      if(src.includes("boostersIndicator")) {
        newSources.push({src: "boostersIndicator.png", length: length})
      }      
      else
      if(src.includes("brakeIndicator")) {
        newSources.push({src: "brakeIndicator.png", length: length})
      }      
      else
      if(src.includes("laserChargeProgress")) {
        newSources.push({src: "laserChargeProgress0000.png", length: length})
      }
      else
      if(src.includes("vwbOutline")) {
        newSources.push({src: "vwbOutline.png", length: length})
      }      
      else
      if(src.includes("glow")) {
        newSources.push({src: "glow.png", length: length})
      }
      else
      if(src.includes("boostersGlow")) {
        newSources.push({src: "boostersGlow0000.png", length: length})
      }
      else
      if(src.includes("wreck")) {
        newSources.push({src: "wreck0000.png", length: length})
      }
      else
      if(src.includes("ghost")) {
        newSources.push({src: "ghost.png", length: length})
      }      
      else
      if(src.includes("skip")) {
        newSources.push({src: "skip0000.png", length: length})
      }          
      else
      if(src.includes("flameLow")) {
        newSources.push({src: "flameLow0000.png", length: length})
      }  
      else
      if(src.includes("flameMedium")) {
        newSources.push({src: "flameMedium0000.png", length: length})
      }  
      else
      if(src.includes("flameHigh")) {
        newSources.push({src: "flameHigh0000.png", length: length})
      }  
      else
      if(src.includes("star")) {
        newSources.push({src: "star.png", length: 1})
      }
      else
      if(src.includes("orbit1")) {
        newSources.push({src: "orbit1.png", length: 1})
      }
      else
      if(src.includes("orbit2")) {
        newSources.push({src: "orbit2.png", length: 1})
      }
      else
      if(src.includes("orbit3")) {
        newSources.push({src: "orbit3.png", length: 1})
      }    
      else
      if(src.includes("stealthFill")) {
        newSources.push({src: "stealthFill.png", length: length})
      }
      else
      if(src.includes("stealthLinework")) {
        newSources.push({src: "stealthLinework.png", length: length})
      }
      else
      if(src.includes("overlayFill")) {
        newSources.push({src: "overlayFill.png", length: length})
      }
      else
      if(src.includes("particles")) {
        newSources.push({src: "particles0000.png", length: length})
      }
      else
      if(src.includes("death")) {
        newSources.push({src: "death.png", length: length})
      }
      else
      if(src.includes("hullDamage")) {
        newSources.push({src: "hullDamage0000.png", length: length})
      }
      else
      if(src.includes("hullInvulnerableAnimation")) {
        newSources.push({src: "hullInvulnerableAnimation0000.png", length: length})
      }
      else
      if(src.includes("hullRepairAnimation")) {
        newSources.push({src: "hullRepairAnimation0000.png", length: length})
      }
      else
      if(src.includes("weapons")) {
        newSources.push({src: "weapons", length: length})
      }
      else
      if(src.includes("gameOverlay")) {
        newSources.push({src: "gameOverlay.png", length: length})
      }
      else
      if(src.includes("travelAnimationSubmerge")) {
        newSources.push({src: "travelAnimationSubmerge.png", length: length})
      }
      else
      if(src.includes("travelAnimationEmerge")) {
        newSources.push({src: "travelAnimationEmerge.png", length: length})
      }
    })

    /* minimap sprite insertion */
    if(gameObject.type.includesAny("asteroid", "debris", "ship", "station", "ultraportBeacon", "satellite", "fragment", "pickup"))
      newSources.push({src: "minimapIcon.png", length: 1})
    
  //   /* shader attempt */
  //   let texture = PIXI.Texture.from("assets/asteroid/box.png")
  //   let uniforms = {
  //     color1: [255 / 255, 134 / 255, 48 / 255, 0.0],
  //     color2: [255 / 255, 134 / 255, 48 / 255, 1.0],
  //   }
  //   let frag = `
  //   precision mediump float;
  
  //   uniform vec4 color1;
  //   uniform vec4 color2;
  
  //   void main(void) {

  //     // Assuming a canvas width
  //     float factorX = gl_FragCoord.x / 1920.0;
  //     float factorY = gl_FragCoord.y / 1920.0;
      
  //     // Red to Blue gradient
  //     vec4 color = mix(color1, color2, factorX);
  
  //     gl_FragColor = color;
  //   }
  // `

  //   let program = PIXI.Program(undefined, frag, "test")
  //   let shader = new PIXI.Filter(null, frag, uniforms)
  //   spriteComponent.container.filters = [shader]
  //   /* shader attempt */

    /* create the actual pixi sprites and sort them */
    newSources.forEach((source) => {

      /* lets not create minimap icons for the dud preloaded gameObjects */
      if(gameObject.dud) return

      let url = folder + source.src
      let name = source.src
      let length = source.length
      let sprite

      /* some modifications and exceptions */
      if(name.includes("skip")) {
        url = "assets/skipAnimation/skip0000.png"
      }
      else
      if(name.includes("travelAnimation")) {
        url = "assets/travelAnimation/travelAnimation0000.png"
        length = 13
      }
      else
      if(name.includes("shieldPulse")) {
        url = "assets/shields/shieldPulse0000.png"
        length = 8
      }
      else
      /* this is a weird hack too, it returns because it actually registers a PIXI container, not a sprite. */
      if(name.includes("weapons")) {
        spriteComponent.weapons = new PIXI.Container()
        spriteComponent.container.addChild(spriteComponent.weapons)
        return
      }
      else
      if(name.includes("minimapIcon")) {
        /* awful hack that changes ship icon for the player ship only */
        gameObject.type === "ship" && gameObject.name === "theGrandMoth" ?
        url = "assets/minimapIcon/playerShip.png" :
        url = "assets/minimapIcon/" + gameObject.type + ".png"
      }

      //create either regular or animated sprite based on various conditions
      if(length > 1 && !name.includes("wreck")) 
      {
        sprite = Sprite.animatedSprite(url, length)
        if(name.includesAny("skip", "flame", "stealth", "particles", "hullDamage", "hullInvulnerableAnimation", "hullRepairAnimation", "travelAnimation", "coatingAnimation", "linework")) 
        {
          if(name.includes("stealth"))
            sprite.animationSpeed = 0.05
          else if(name.includes("coatingAnimation"))
            sprite.animationSpeed = 0.05
          else if(name.includes("travelAnimation"))
            sprite.animationSpeed = 0.2
          else if(name.includes("linework"))
            sprite.animationSpeed = 0.05
          else
            sprite.animationSpeed = 0.1
          sprite.play()
        }
      }
      else
      if(name.includes("wreck"))
      {
        for (let i = 0; i < length; i++) {
          sprite = PIXI.Sprite.from(folder + "wreck/wreck000" + i + ".png")
          spriteComponent.all.push(sprite)
          sprite.anchor.set(0.5)
          sprite.alpha = 0.0
          sprite.renderable = false
          spriteComponent.wreck.push(sprite)
        }
      }
      else
      if(name.includes("minimapIcon")) {
        sprite = PIXI.Sprite.from(url)
        game.minimapApp.stage.addChild(sprite)
      }
      else
      {
        sprite = PIXI.Sprite.from(url)
      }

      if(name.includes("highlights"))                 spriteComponent.highlights.push(sprite)
      if(name.includes("orbit"))                      spriteComponent.orbits.push(sprite)
      if(name.includes("ghost"))                      spriteComponent.ghost = sprite
      if(name.includes("skip"))                       spriteComponent.skip = sprite
      if(name.includes("glow"))                       spriteComponent.glow = sprite
      if(name.includes("boostersGlow"))               spriteComponent.boostersGlow = sprite
      if(name.includes("flame"))                      spriteComponent.flame = sprite
      if(name.includes("fill"))                       spriteComponent.fill = sprite
      if(name.includes("coatingLayer"))               spriteComponent.coatingLayer = sprite
      if(name.includes("coatingAnimation"))           spriteComponent.coatingAnimation = sprite
      if(name.includes("linework"))                   spriteComponent.linework = sprite
      if(name.includes("shieldCharge"))               spriteComponent.shieldCharge = sprite
      if(name.includes("shieldForceField"))           spriteComponent.shieldForceField = sprite
      if(name.includes("shieldBubble"))               spriteComponent.shieldBubble = sprite
      if(name.includes("shieldPulse"))                spriteComponent.shieldPulse = sprite
      if(name.includes("shieldHardLightFront"))       spriteComponent.shieldHardLightFront = sprite
      if(name.includes("vwbOutline"))                 spriteComponent.vwbOutline = sprite
      if(name.includes("boostersIndicator"))          spriteComponent.boostersIndicator = sprite
      if(name.includes("brakeIndicator"))             spriteComponent.brakeIndicator = sprite
      if(name.includes("laserChargeProgress"))        spriteComponent.laserChargeProgress = sprite
      if(name.includes("stealthFill"))                spriteComponent.stealthFill = sprite
      if(name.includes("stealthLinework"))            spriteComponent.stealthLinework = sprite
      if(name.includes("overlayFill"))                spriteComponent.overlayFill = sprite
      if(name.includes("particles"))                  spriteComponent.particles = sprite
      if(name.includes("death"))                      spriteComponent.death = sprite
      if(name.includes("minimapIcon"))                spriteComponent.minimapIcon = sprite
      if(name.includes("hullInvulnerableAnimation"))  spriteComponent.hullInvulnerableAnimation = sprite
      if(name.includes("hullRepairAnimation"))        spriteComponent.hullRepairAnimation = sprite
      if(name.includes("travelAnimationSubmerge"))    spriteComponent.travelAnimationSubmerge = sprite
      if(name.includes("travelAnimationEmerge"))      spriteComponent.travelAnimationEmerge = sprite
      
      sprite.anchor.set(0.5)

      /* let's not add a filter to highlights anymore */
      // if(name.includes("highlights")) {
      //   sprite.filters = [filters.highlightsContrast, filters.highlightsHueShift, filters.highlightsBrightness]
      // }

      if(name.includesAny("shield", "stealth", "death", "hullInvulnerableAnimation", "hullRepairAnimation", "travelAnimation", "coatingAnimation")) 
      {
        sprite.renderable = false
      }
      if(name.includes("flame")) 
      {
        if(name.includes("Low"))    spriteComponent.flames.low = sprite
        if(name.includes("Medium")) spriteComponent.flames.medium = sprite
        if(name.includes("High"))   spriteComponent.flames.high = sprite
      }

      spriteComponent.all.push(sprite)
      
      /* this is to prevent adding certain sprites to the container, they're not supposed to be bound to the GameObject's position */
      if(name.includesAny("skip", "ghost", "shieldPulse", "minimapIcon", "travelAnimation")) return

      spriteComponent.container.addChild(sprite)
    })

    gameObject.sprite = spriteComponent
  }
  static createForFragment(gameObject, fragmentIndex) {
    let spriteComponent = new Sprite(gameObject)
    gameObject.sprite = spriteComponent

    spriteComponent.container = new PIXI.Container()
    spriteComponent.all = []

    let url = `assets/${gameObject.parent.type}/${gameObject.parent.name}/wreck/wreck000${fragmentIndex}.png`
    let 
    sprite = PIXI.Sprite.from(url)
    sprite.anchor.set(0.5)

    /* insert minimap icon */
    let micon = PIXI.Sprite.from("assets/minimapIcon/fragment.png")
    spriteComponent.minimapIcon = micon
    game.minimapApp.stage.addChild(micon)

    spriteComponent.all.push(sprite, micon)
    spriteComponent.container.addChild(sprite)
  }
  static createForMapLabel(gameObject, text, color = "ffffff") {
    let spriteComponent = new Sprite(gameObject)
    gameObject.sprite = spriteComponent

    spriteComponent.container = new PIXI.Container()
    spriteComponent.all = []

    let 
    sprite = new PIXI.Text(text, {fontFamily: "big-t-comic", fill: "0x" + color, letterSpacing: -2})
    sprite.anchor.set(0.5)

    spriteComponent.all.push(sprite)
    spriteComponent.text = sprite
    spriteComponent.container.addChild(sprite)
  }
  static updateFlames(gameObject, intensity) {
    for(let key in gameObject.sprite.flames)
      gameObject.sprite.flames[key].renderable = false

    if(intensity === null) return

    gameObject.sprite.flames[intensity].renderable = true
  }
  static updateOrbits(gameObject) {
    gameObject.sprite.orbits.forEach((orbit, index) => {
      orbit.rotation += gameObject.orbitalVelocities[index] * dt
    })
  }
  static imgSequence(src = "path/to/file0000.png", framesTotal = 5) {
    let str = src.replaceAll("0000", "").replaceAll(".png", "")
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
  //#endregion
}