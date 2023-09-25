let dt = 0 
let dtf = 0
let fps = 0

let cdt = 0
let cLastTime = 0

let adt = 0 //audiodeltatime

let cw = window.innerWidth
let ch = window.innerHeight

let player = {}
const filters = {}

const filterManager           = new FilterManager()
const gameManager             = new GameManager()
const interactionManager      = new InteractionManager()
const mouse                   = new Mouse()
const gameUI                  = new GameUI()

const game                    = new Game()
const locationEditor          = new LocationEditor()
const dialogueEditor          = new DialogueEditor()
const hitboxEditor            = new HitboxEditor()
const dialogueScreen          = new DialogueScreen()
const starSystemDetail        = new StarSystemDetail()
const inventory               = new InventoryWindow()
const map                     = new WorldMap()
const startScreen             = new StartScreen()
const saveSelectScreen        = new SaveSelectScreen()
const settingsScreen          = new SettingsScreen()
const gameoverScreen          = new GameoverScreen()
const loadingScreen           = new LoadingScreen()
const creditScreen            = new CreditScreen()
const pauseScreen             = new PauseScreen()
const receivedItemModal       = new ReceivedItemModal()
const cutsceneWindow          = new CutsceneWindow()
const questDesigner           = new QuestDesigner()

gameManager.windows.push(
  game,
  locationEditor,
  dialogueEditor,
  hitboxEditor, 
  dialogueScreen,
  starSystemDetail,
  inventory,
  map,
  startScreen,
  saveSelectScreen,
  settingsScreen,
  gameoverScreen,
  loadingScreen,
  creditScreen,
  pauseScreen,
  receivedItemModal,
  cutsceneWindow,
  questDesigner,
)

window.onresize = () => {
  cw = window.innerWidth
  ch = window.innerHeight
  gameManager.windows.forEach(win => {
    win.app?.resize()
    win.camera?.contextDim.set(cw, ch)
  })
  dialogueEditor.canvas.width = cw
  dialogueEditor.canvas.height = ch
}

// window.onblur = () => gameManager.pauseGame()

/* mutation observer used to update hints */
{
  const container = Q("#interaction-container")
  const audioCall = Q("#audio-call-panel")

  let canUpdate = true
  const callback = async () => {

    /* this is run because the UI shuffles and I want to hide tooltips that would correspond to incorrect or hidden elements */
    gameUI.cancelTooltipPopup()

    await waitFor(250)
    if(!canUpdate) return
    setTimeout(() => canUpdate = true, 1000)
    canUpdate = false
    
    /* 
    if the total number of visible audio call panels AND big hints is less than 1,
    try to maximize the first hint, if it doesn't exist, maximize audio call
    */
    if(Qa('#interaction-container .hint:not(.hidden), #audio-call-panel:not(.hidden)').length < 1) {
      let firstVisibleHint = game.gameObjects.hint.find(h => h.hintText)
      firstVisibleHint ? firstVisibleHint.maximize() : gameUI.maximizeAudioCallPanel()
    }
  }
  
  /* 
  fuckin call this periodically, solves the problem
  but popup tooltips are messed up then, so let's not call it for now
   */
  // setInterval(callback, 250)

  const interactionObserver = new MutationObserver(callback)
  interactionObserver.observe(container, {childList: true})
  interactionObserver.observe(audioCall, {attributes: true})
}

function perfRun(fn = function() {}, context, ...args) {
  [1, 10, 100, 1000]
  .forEach(value => {
    let start = performance.now()
    for(let i = 0; i < value; ++i)
      fn.apply(context, args)
    console.log(performance.now() - start)
  })
}