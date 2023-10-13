class AudioEmitter extends GameObject {
  constructor(category, name, parent, options = {volumeFadeDistance: 1000, maxVolume: 1}) {
    super()
    this.type = "audioEmitter"
    this.name = name
    this.category = category
    this.parent = parent
    this.volumeFadeDistance = options.volumeFadeDistance
    this.maxVolume = options.maxVolume ?? 1

    this._wasCloseLastFrame = false

    /** @type LoopedAudioClip */
    this.audioClip = new LoopedAudioClip(
      `audio/${this.category}/${this.name}.ogg`,
      this.name,
    )
    this.audioClip.onload = () => this.ready = true
  }
  update() {
    if(!this.ready) return

    this.transform.position.setFrom(this.parent.transform.position)
    this.checkDistance()
  }
  checkDistance() {
    let distance = GameObject.distance(this, player?.ship)

    if(distance < this.volumeFadeDistance && !this._wasCloseLastFrame)
      this.audioClip.start()
    if(distance >= this.volumeFadeDistance && this._wasCloseLastFrame)
      this.audioClip.stop()
    
    this._wasCloseLastFrame = distance < this.volumeFadeDistance
    
    if(this.category === "SFX")
      this.audioClip.setVolume((1 - distance/this.volumeFadeDistance) * this.maxVolume * AudioManager.SFXVolume)
    else
      this.audioClip.setVolume((1 - distance/this.volumeFadeDistance) * this.maxVolume * AudioManager.musicVolume)  
  }
  destroy() {
    this.audioClip?.destroy()
  }
}