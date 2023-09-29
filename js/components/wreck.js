class Wreck extends Component {
  constructor(gameObject, objData) {
    super(gameObject, objData)
    this.fragmentCount = objData.count
    this.fragments = []
  }
  activate() {
    this.createFragments()
    this.createExplosion()
    
    setTimeout(() => GameObject.destroy(this.gameObject), 0)
    
    if(this.gameObject === player.ship)
      gameManager.endGame()
  }
  createExplosion() {
    let 
    transform = this.gameObject.transform.clone()
    transform.angularVelocity = 0
    transform.velocity.set(0)
    
    GameObject.create("explosion", "default", {transform, SFXName: "explosionDefault"}, {world: this.gameObject.gameWorld})
  }
  createFragments() {
    let indexOfLootableWreck = Random.int(0, this.fragmentCount - 1)

    /* 
    sometimes insert a single weapon into the cargo system, 
    this could result in duplication later when I fix NPC ships not having weapons in cargo, but that's a future problem 
    */
    if(Random.chance(50) && this.gameObject.weapons) {

      let weapon = this.gameObject.weapons.weapons.random()
      if(weapon.canBeDismounted) {
        this.gameObject.cargo.addItems(new Item(weapon.name))
      }
    }
    
    for(let i = 0; i < this.fragmentCount; i++) {
      let fragment = this.createFragment(i)
      if(i === indexOfLootableWreck && this.gameObject !== player.ship) {
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