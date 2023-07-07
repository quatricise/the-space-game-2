/* sets of commands I can easily switch between to make it easier to do stuff */
const initMacros = {
  async openDialogueEditor() {
    gameManager.setWindow(dialogueEditor)
  },
  async loadGame() {
    gameManager.loadStartingLocation()
  },
  async startIntroDialogue() {
    gameManager.setWindow(game)
    gameManager.setWindow(dialogueScreen)
    dialogueScreen.load("intro-king_and_ada")
  },
  async openMap() {
    gameManager.setWindow(game)
    await waitFor(1000)
    gameManager.setWindow(map)
  },
  async loadKreos() {
    gameManager.loadStartingLocation()
    await waitFor(4000)
    gameManager.loadLocation("mantu")
    await waitFor(2000)
    player.ship.transform.position.setFrom(game.gameObjects.npc[0].ship.transform.position)
    game.updateGameObjects(true)
  },
};

(function init() {
  SaveConverter.generateReverseDictionary()
  gameManager.preloadImageAssets()
  Cutscene.preloadScenes()
  Hint.preloadAssets()
  attachListeners()
  Fact.loadFacts()
  loadFonts(() => map.load())
  AudioManager.prime()
  AudioManager.loadSounds()
  Item.registerItemsFromWeapons()
  gameManager.setWindow(startScreen)
  Q("#ship-graphic").classList.add(gameManager.playerData.shipName)
  Q("#ship-skip-charge-icon").classList.add(gameManager.playerData.shipName)
  gameUI.toggleDevIcons()

  /* macro */
  initMacros.openDialogueEditor()
})();
