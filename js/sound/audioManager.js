class AudioManager {
  static musicVolume = 1
  static SFXVolume = 1
  static ready = false

  static currentSoundSourceElement = null
  static currentSoundEvent = null
  static SFXList = {}
  static musicList = {}

  static SFXAudioClips = {}
  static musicAudioClips = {}
  static SFXGainNodes = {}
  static musicGainNodes = {}

  static audioEmitters = []

  static totalRegularAudio = 0
  static totalRegularAudioLoaded = 0

  static ctx = new (AudioContext || webkitAudioContext)()

  static prime() {
    document.addEventListener("click", this.primeListener, false)
  }
  static primeListener = (e) => {
    this.setup()
    document.removeEventListener("click", this.primeListener)
  }
  static setup() {
    document.addEventListener("mouseover",  this.playSFXOnMouse.bind(this), false)
    document.addEventListener("mouseout",   this.playSFXOnMouse.bind(this), false)
    document.addEventListener("mousedown",  this.playSFXOnMouse.bind(this), false)
    this.update()
    this.playLoopedAudio("music", "mainTheme", 0.8)
  }
  //#region sound loading
  static loadSounds() {
    for(let category in sources.audio) {
      for(let sound of sources.audio[category]) {
        this.loadSound(category, sound)
        this.totalRegularAudio++
      }
    }
  }
  static loadSound(category, name) {
    let audioName = name.split(" ")[0]
    let isLooped = name.includes("loop") ? true : false

    if(isLooped)
      this.loadLoopedAudio(category, audioName)
    else
      this.loadRegularAudio(category, audioName)
  }
  static loadRegularAudio(category, audioName) {
    let 
    audio = new Audio()
    audio.src = `audio/${category}/${audioName}.ogg`
    audio.oncanplaythrough = () => {
      this[category + "List"][audioName] = audio
      this.updateLoadProgress(category + audioName)
      audio.oncanplaythrough = () => {}
    }
  }
  static loadLoopedAudio(category, audioName) {
    this[category + "AudioClips"][audioName] = new LoopedAudioClip(
      `audio/${category}/${audioName}.ogg`,
      audioName,
    )
  }
  static getMissingAudioNames() {
    
  }
  static updateLoadProgress(identifier) {
    this.totalRegularAudioLoaded++
    Logger.log(identifier)
    if(this.totalRegularAudio === this.totalRegularAudioLoaded) {
      this.ready = true
      console.log("Regular audio loaded.", this.totalRegularAudioLoaded + " / " + this.totalRegularAudio)
    }
  }
  //#endregion
  //#region play audio methods
  static playSFX(name, volume = 1) {
    if(!this.SFXList[name]) return
    this.SFXList[name].volume = clamp(volume, 0, 1) * this.SFXVolume
    this.SFXList[name].currentTime = 0
    this.SFXList[name].play()
  }
  static playMusic(name, volume = 1) {
    if(!this.musicList[name]) return
    this.musicList[name].volume = clamp(volume, 0, 1) * this.musicVolume
    this.musicList[name].currentTime = 0
    this.musicList[name].play()
  }
  static stopSFX(name) {
    if(!this.SFXList[name]) return
    this.SFXList[name].pause()    
  }
  static stopMusic(name) {
    if(!this.musicList[name]) return
    this.musicList[name].pause()    
  }
  static playSFXOnMouse(e) {
    let soundTarget = e.target.closest("*[data-playsfx]")
    if(!this.currentSoundSourceElement?.contains(e.target))
      this.currentSoundSourceElement = null

    if(!soundTarget) return

    let playOnEvents = soundTarget.dataset.playonevents.split(" ")
    let sounds = soundTarget.dataset.sounds.split(" ")
    let volumes = soundTarget.dataset.volumes?.split(" ") ?? playOnEvents.map(ev => 1)
    let soundIndex = playOnEvents.indexOf(e.type)
    let soundName = sounds[soundIndex]
    let volume = volumes[soundIndex]

    /* check if the event type is found on the element dataset */
    let elementMatchesEventType = false
    for(let eventType of playOnEvents)
      if(eventType === e.type)
        elementMatchesEventType = true
    if(!elementMatchesEventType) return

    if(
      soundTarget === this.currentSoundSourceElement &&
      this.currentSoundEvent === e.type &&
      e.type !== "mousedown"
    ) return

    this.currentSoundSourceElement = soundTarget
    this.currentSoundEvent = e.type
    this["playSFXOn" + e.type.capitalize()](soundName, volume, e)
  }
  static playSFXOnMouseover(soundName, volume, event) {
    this.playSFX(soundName, volume)
  }
  static playSFXOnMouseout(soundName, volume, event) {
    this.playSFX(soundName, volume)
  }
  static playSFXOnMousedown(soundName, volume, event) {
    this.playSFX(soundName, volume)
  }
  static playLoopedAudio(category, name, volume = 1) {
    let isMusicPlaying
    for(let key in this.musicAudioClips)
      if(this.musicAudioClips[key].playing)
        isMusicPlaying = true

    if(category === "music" && isMusicPlaying)
      for(let key in this.musicAudioClips)
        if(this.musicAudioClips[key].playing)
          this.musicAudioClips[key].fadeOut(4500)
    
    this[category + "AudioClips"][name].start()

    if(category === "music" && isMusicPlaying) {
      this[category + "AudioClips"][name].setVolume(0)
      setTimeout(() => this[category + "AudioClips"][name].fadeIn(6000, volume), 500)
    }
    else {
      this[category + "AudioClips"][name].setVolume(volume)
    }
  }
  static stopLoopedAudio(category, name) {
    this[category + "AudioClips"][name].stop()
  }
  static dimMusic(toVolume) {
    for(let key in this.musicAudioClips)
      if(this.musicAudioClips[key].playing)
        this.musicAudioClips[key].fadeTo(3500, toVolume)
  }
  static restoreMusic() {
    for(let key in this.musicAudioClips)
      if(this.musicAudioClips[key].playing)
        this.musicAudioClips[key].fadeTo(3500, this.musicAudioClips[key].previousVolume)
  }
  //#region an attempt to do audio layers - not functional
  static audioLayers = [
    {
      sourceNode: null,
      volume: 1
    }
  ]
  //#endregion
  static audioLastTime = 0
  static update() {
    /* set audio delta time */
    let now = Date.now()
    adt = (now - this.audioLastTime) / 1000
    this.audioLastTime = now

    for(let key in this.musicAudioClips)
      this.musicAudioClips[key].update()
    
    window.requestAnimationFrame(this.update.bind(this))
  }
}