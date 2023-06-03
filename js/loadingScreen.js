class LoadingScreen extends GameWindow {
  constructor() {
    super("LoadingScreen", Q("#loading-screen"))
  }
  hide() {
    if(!this.visible) return

    this.element.animate([
      {filter: "opacity(1)"}, 
      {filter: "opacity(0)"},
    ], {
      duration: 1800,
      easing: "cubic-bezier(0.65, 0.0, 0.35, 1.0)"
    })
    .onfinish = () => {
      this.element.classList.add("hidden")
      this.visible = false
    }
  }
  setBackground(locationName) {
    Q("#loading-screen-background").src = `assets/loadingScreen/${locationName}.png`
  }
}