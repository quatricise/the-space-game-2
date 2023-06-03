class PauseScreen extends GameWindow {
  constructor() {
    super("PauseScreen", Q('#pause-screen'))
    this.createSliders()
  }
  createSliders() {
    this.musicVolumeSlider = new UISliderComponent(
      this, 
      Q("#pause-screen-slider-container-music"), 
      AudioManager,
      "musicVolume",
      {range: [0, 1], steps: 20}
    )
    this.sfxVolumeSlider = new UISliderComponent(
      this, 
      Q("#pause-screen-slider-container-sfx"), 
      AudioManager,
      "SFXVolume",
      {range: [0, 1], steps: 20}
    )
  }
  show() {
    this.element.classList.remove('hidden')
    Q("#game").style.backdropFilter = "blur(5px)"
  }
  hide() {
    this.element.classList.add('hidden')
    Q("#game").style.backdropFilter = ""
  }
  handleKeydown(event) {
    if(event.code === binds.pause)
      gameManager.unpauseGame()
  }
}