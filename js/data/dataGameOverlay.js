data.gameOverlay = {
  movementTrap: {
    overlayType: "statusEffectIndicator",
    onSetup: "addStatusEffectToParent",
    statusEffectName: "movementTrap",
    refreshSpriteFrequencyMS: 1000,
    effectDurationMS: 5000,
    onFinishPlaying: "destroyOverlay"
  },
  overlayBeaconDeathmatch: {
    overlayType: "gameContextMenu",
    onFinishPlaying: ""
  },
  overlayOpenStationMenu: {
    overlayType: "gameContextMenu",
    onFinishPlaying: ""
  },
  overlayOpenMap: {
    overlayType: "gameContextMenu",
    onFinishPlaying: ""
  },
  overlayOpenMapAndUseKey: {
    overlayType: "gameContextMenu",
    onFinishPlaying: ""
  },
  overlayDockIntoStation: {
    overlayType: "gameContextMenu",
    onFinishPlaying: ""
  },
  targetSmall: {
    overlayType: "gameOverlay",
    onFinishPlaying: ""
  },
  scrapDebris: {
    overlayType: "gameOverlay",
    onFinishPlaying: ""
  },
  weaponSelect: {
    overlayType: "gameOverlay",
    refreshSpriteFrequencyMS: 1000 / 24,
    onFinishPlaying: "destroyOverlay",
    onFinishPlayingDelayMS: 200,
  },
  weaponNotCharged: {
    overlayType: "gameOverlay",
    refreshSpriteFrequencyMS: 1000 / 30,
    onFinishPlaying: "destroyOverlay",
  },
  noAmmo: {
    overlayType: "gameOverlay",
    refreshSpriteFrequencyMS: 1000 / 10,
    onFinishPlaying: "destroyOverlay",
    onFinishPlayingDelayMS: 250,
    maxOnScreen: 1,
    onLimitReach: "destroyOthers"
  },
  itemAdded: {
    overlayType: "gameOverlay",
    refreshSpriteFrequencyMS: 1000 / 10,
    onFinishPlaying: "destroyOverlay",
    onFinishPlayingDelayMS: 250,
    maxOnScreen: 1,
    onLimitReach: "destroyOthers"
  },
  cargoFull: {
    overlayType: "gameOverlay",
    refreshSpriteFrequencyMS: 1000 / 10,
    onFinishPlaying: "destroyOverlay",
    onFinishPlayingDelayMS: 250,
    maxOnScreen: 1,
    onLimitReach: "destroyOthers"
  },
}