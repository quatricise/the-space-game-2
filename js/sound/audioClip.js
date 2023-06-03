class LoopedAudioClip {
  constructor(src, name) {
    this.src = src
    this.name = name
    this.audioNode = null
    this.audioBuffer = null
    this.gainNode = null
    this.playing = false
    this.loaded = false
    this.volume = 1
    this.previousVolume = null
    this.fadeData = {
      from: 0,
      to: 1,
    }
    this.setup()
  }
  setup() {
    this.gainNode = AudioManager.ctx.createGain()
    this.gainNode.connect(AudioManager.ctx.destination)
    this.fetchSourceData()
    this.createAudioNode()
    this.timers = new Timer(
      ["fadeTick", 1000, {loop: false, active: false, onfinish: this.fadeEnd.bind(this)}]
    )
    this.timers.setToAudioDelta()
  }
  onload() {

  }
  fetchSourceData() {
    fetch(this.src, {mode: "cors"})
    .then(function(resp) {return resp.arrayBuffer()})
    .then(this.decodeAudioData.bind(this));
  }
  decodeAudioData(buffer) {
    AudioManager.ctx.decodeAudioData(buffer, this.setAudioBuffer.bind(this));
  }
  setAudioBuffer(audioBuffer) {
    this.audioBuffer = audioBuffer
    this.loaded = true
    this.onload()
    this.createAudioNode()
  }
  createAudioNode() {
    this.audioNode = AudioManager.ctx.createBufferSource()
    this.audioNode.buffer = this.audioBuffer
    this.audioNode.connect(this.gainNode)
    this.audioNode.loop = true
  }
  start() {
    if(!this.loaded) return
    if(this.playing) return
    this.createAudioNode()
    this.audioNode.start()
    this.playing = true
  }
  stop() {
    if(!this.loaded) return
    if(!this.playing) return
    this.audioNode.disconnect()
    this.audioNode.stop()
    this.audioNode = null
    this.playing = false
  }
  fadeIn(duration, volume = 1) {
    this.previousVolume = this.volume
    this.fadeStart(0, volume, duration)
  }
  fadeOut(duration) {
    this.fadeStart(this.volume, 0, duration)
  }
  fadeTo(duration, volume) {
    this.previousVolume = this.volume
    this.fadeStart(this.volume, volume, duration)
  }
  fadeStart(from, to, duration) {
    this.fadeData.from = from
    this.fadeData.to = to
    this.timers.fadeTick.duration = duration
    this.timers.fadeTick.start()
  }
  fadeEnd() {
    if(this.volume < 0.25) this.stop() //this basically
  }
  fadeTick() {
    this.setVolume(
      Ease.Linear(this.timers.fadeTick.currentTime, this.fadeData.from, this.fadeData.to - this.fadeData.from, this.timers.fadeTick.duration)
    )
  }
  setVolume(volume) {
    this.volume = clamp(volume, 0, 1)
    this.gainNode.gain.setValueAtTime(this.volume * AudioManager.musicVolume, AudioManager.ctx.currentTime)
  }
  update() {
    this.timers.update()
    if(this.timers.fadeTick.active)
      this.fadeTick()
  }
}