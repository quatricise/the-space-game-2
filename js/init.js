/* sets of commands I can easily switch between to make it easier to do stuff */
const initMacros = {
  openDialogueEditor() {
    gameManager.setWindow(dialogueEditor)
  },
  loadGame() {
    gameManager.loadStartingLocation()
  },
  startIntroDialogue() {
    gameManager.setWindow(game)
    gameManager.setWindow(dialogueScreen)
    dialogueScreen.load("intro-king_and_ada")
  },
  openMap() {
    gameManager.setWindow(game)
    gameManager.setWindow(map)
  },
};

(function init() {
  attachListeners()
  Fact.loadFacts()
  loadFonts(() => map.load())
  gameManager.preloadImageAssets()
  AudioManager.prime()
  AudioManager.loadSounds()
  Item.registerItemsFromWeapons()
  gameManager.setWindow(startScreen)
  Q("#ship-graphic").classList.add(gameManager.playerData.shipName)
  Q("#ship-skip-charge-icon").classList.add(gameManager.playerData.shipName)
  gameUI.toggleDevIcons()
})();
