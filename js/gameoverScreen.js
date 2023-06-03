class GameoverScreen extends GameWindow {
  constructor() {
    super("GameoverScreen", Q("#gameover-screen"))
  }
  show() {
    if(this.visible) return

    this.createQuote()

    this.element.classList.remove("hidden")
    this.element.animate([
      {filter: "opacity(0)", transform: "scale(0.965)"},
      {filter: "opacity(1)", transform: "scale(1.0)"},
    ], {
      duration: 1800,
      easing: "cubic-bezier(0.65, 0.0, 0.35, 1.0)"
    }).onfinish = () => this.visible = true
  }
  hide() {
    if(!this.visible) return

    this.element.animate([
      {filter: "opacity(1)", transform: "scale(1.0)"},
      {filter: "opacity(0)", transform: "scale(0.965)"},
    ], {
      duration: 1800,
      easing: "cubic-bezier(0.65, 0.0, 0.35, 1.0)"
    })
    .onfinish = () => {
      this.element.classList.add("hidden")
      this.visible = false
      this.destroyQuote()
    }
  }
  createQuote() {
    let quote = Random.from(...data.quotes)
    let element = El("div", "quote-container")
    let author =  El("div", "quote-author", undefined, data.person[quote.authorRef].displayName)
    let text =    El("div", "quote-text", undefined, quote.text)
    element.append(text, author)
    Q("#gameover-screen-content").append(element)
    this.quoteElement = element
  }
  destroyQuote() {
    this.quoteElement?.remove()
  }
  handleKeydown(e) {
    if(e.code === "Enter" || e.code === "NumpadEnter") Q("#gameover-button-reload-from-checkpoint").click()
  }
}