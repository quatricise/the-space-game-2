async function loadFonts(callback) {
  let fonts = [
    {family: "space",       url: "../fonts/space_grotesk_variable.ttf"},
    {family: "big-t-comic", url: "../fonts/big-t-comic.ttf"},
  ]
  for(let font of fonts) {
    let fontFace = new FontFace(font.family, `url('${font.url}')`, {style: "normal", weight: 400})
    await fontFace.load()
    document.fonts.add(fontFace)
  }
  callback()
}