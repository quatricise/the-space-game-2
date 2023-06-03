class Wreck extends Component {
  constructor(gameObject, objData) {
    super(gameObject, objData)
    this.fragmentCount = objData.count
    this.fragments = []
  }
  activate() {
    this.generateFragments()
    this.createExplosion()
    
    setTimeout(() => GameObject.destroy(this.gameObject), 0)
    
    if(this.gameObject === player.ship)
      gameManager.endGame()
  }
  createExplosion() {
    let transform = this.gameObject.transform.clone()
        transform.angularVelocity = 0
        transform.velocity.set(0)
    GameObject.create("explosion", "default", {transform, SFXName: "explosionDefault"}, {world: this.gameObject.gameWorld})
  }
  generateFragments() {
    let createPopupForWreckByIndex = Random.int(0, this.fragmentCount - 1)
    
    for(let i = 0; i < this.fragmentCount; i++) {
      let fragment = this.createFragment(i)
      if(i === createPopupForWreckByIndex && this.gameObject !== player.ship) {
        new UILootingPopupComponent(game, fragment, this.gameObject.cargo)
      }
        
    }
  }
  createFragment(index) {
    let hitbox = this.gameObject.wreckHitboxVault.hitboxes[index]
    let transform = this.gameObject.transform.clone()
        transform.angularVelocity += Random.float(-1.0, 1.0)
    let fragment = GameObject.create(
      "fragment", 
      "name", 
      {
        transform,
        parent: this.gameObject,
        fragmentData: {
          hitbox, 
          index
        }
      },
      {world: this.gameObject.gameWorld}
    )
    this.fragments.push(fragment)
    return fragment
  }
  update() {
    
  }
}