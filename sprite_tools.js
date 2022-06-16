class SpriteTools {
  static constructSprites(obj) {
    let sources = obj.sources
    for (let src in sources) {
      let sprite = PIXI.Sprite.from(sources[src].src);

      if(sources[src].src.includes("highlights")) obj.sprites_special.highlights.push(sprite)

      if(src.includes("animated")) {
        let anim = AnimatedSprite(sources[src].src, sources[src].length)
        anim.anchor.x = 0.5
        anim.anchor.y = 0.5
        anim.animationSpeed = 0.1
        anim.play()
        obj.sprite_container.addChild(anim)
        obj.sprites_special.animated.push(anim)
        continue
      }

      sprite.anchor.x = 0.5
      sprite.anchor.y = 0.5

      obj.sprite_container.addChild(sprite)
      obj.sprites.push(sprite)
    }
  }
  static updateHighlights(obj) {
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