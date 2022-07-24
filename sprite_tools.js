class SpriteTools {
  static constructSprites(obj) {
    obj.sprite_container = new PIXI.Container()
    obj.sprites = [] 
    obj.sprites_special = {
      highlights: [], 
      animated: [],
    }
    let orig = _.cloneDeep(obj.sources)
    let folder = orig["folder"]
    delete orig["folder"]
    let sources = []
    orig.auto?.forEach((src)=> {
      let len = src.replace(/[^0-9\.]+/g, '') || 1
      if(src.includes("thumbnail")) {
        return
      }      
      if(src.includes("fill")) {
        sources.push({src: "fill.png", length: len})
      }      
      if(src.includes("highlights")) {
        sources.push(
          {src: "highlights_0.png", length: len}, 
          {src: "highlights_90.png", length: len}, 
          {src: "highlights_180.png", length: len}, 
          {src: "highlights_270.png", length: len}
        )
      }      
      if(src.includes("linework")) {
        sources.push({src: "linework.png", length: len})
      }      
      if(src.includes("shield_charge")) {
        sources.push({src: "shield_charge_indicator.png", length: len})
      }      
      if(src.includes("dash_indicator")) {
        sources.push({src: "dash_indicator.png", length: len})
      }      
      if(src.includes("laser_charge_progress")) {
        sources.push({src: "laser_charge_progress_0000.png", length: len})
      }      
      if(src.includes("vwb_outline")) {
        sources.push({src: "vwb_outline.png", length: len})
      }      
      if(src.includes("glow")) {
        sources.push({src: "glow.png", length: len})
      }      
      if(src.includes("ghost")) {
        sources.push({src: "ghost.png", length: len})
      }      
      if(src.includes("skip")) {
        sources.push({src: "skip_0000.png", length: len})
      }      
      if(src.includes("flame")) {
        sources.push({src: "flame_0000.png", length: len})
      }  
    })
    
    sources.forEach(src => {
      let url = folder + src.src
      let name = src.src
      if(name.includes("skip")) url = "assets/skip_animation/skip_0000.png"
      let length = src.length
      // console.log(url, length)
      let sprite
      if(length > 1) {
        sprite = AnimatedSprite(url, length)
        if(name.includes("skip") || name.includes("flame")) {
          sprite.animationSpeed = 0.1 
          sprite.play()
        }
      }
      else {
        sprite = PIXI.Sprite.from(url);
      }
      sprite.anchor.x = 0.5
      sprite.anchor.y = 0.5

      if(name.includes("highlights")) obj.sprites_special.highlights.push(sprite)
      if(name.includes("ghost")) {obj.sprites_special.ghost = sprite; return}
      if(name.includes("skip")) {obj.sprites_special.skip = sprite; return}
      if(name.includes("shield_charge")) {obj.sprites_special.shield_charge = sprite}
      if(name.includes("vwb_outline")) {obj.sprites_special.vwb_outline = sprite}
      if(name.includes("dash_indicator")) {obj.sprites_special.dash_indicator = sprite}
      if(name.includes("laser_charge_progress")) {obj.sprites_special.laser_charge_progress = sprite}
      
      obj.sprite_container.addChild(sprite)
      obj.sprites.push(sprite)
    })
  }
  static update_sprite(obj) {
    obj.sprite_container.position.x = obj.pos.x
    obj.sprite_container.position.y = obj.pos.y
    obj.sprite_container.rotation = obj.rotation
    this.updateHighlights(obj)
  }
  static updateHighlights(obj) {
    if(!obj.sprites_special.highlights) return
    //update highlights
    let deg = obj.rotation * 180/PI
    for (let i = 0; i < obj.sprites_special.highlights.length; i++) {

      let offsetFromFront = i*90 - deg
      if(offsetFromFront <= -270) offsetFromFront = 360 + offsetFromFront
      offsetFromFront = Math.abs(offsetFromFront)
      obj.sprites_special.highlights[i].alpha = Math.max(0,Math.round((1 - offsetFromFront/90 )*100)/100) //this puts the alpha between 0 and 1 with 0.01 precision
    }
  }
}


function ImgSequence(src = "path/to/file0000.png", frames_total = 5) {
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

function AnimatedSprite(first_image = "assets/file0000.png", image_count) {
  let img_sequence = ImgSequence(first_image, image_count)
  let textureArray = []

  for (let i = 0; i < img_sequence.length; i++)
  {
      let texture = PIXI.Texture.from(img_sequence[i]);
      textureArray.push(texture);
  };
  let sprite = new PIXI.AnimatedSprite(textureArray);
  return sprite
}