class NPC {
  constructor() {
    this.location = {} //idk, maybe like the current world location, or something
    this.ship = {} //some ship
    this.database = new Map() //their local dictionary of facts
    characters.push(this)
  }
  controlShip() {

  }
  check_for_collision() {
    //filter rigidbodies for candidates for collision
    //maybe use this, but it might not be enough scope to effectively dodge projectiles
    let candidates = Collision.broadphaseFilter(this.ship) 
    //how far??
    //what is the step size? 
    //all im gonna do is vector.add to the craft's position based on a multiplication of its velocity
    //that same multiplication will be used on all candidates to project their positions
    //box collision is cheap, so i might use a lot of projections, like 20, and maybe 
    //i can compute the interval based on somehow combining the craft's AABB bounding-box 
    //with it's velocity to find the optimal step-size - one that is roughly equal to the craft's
    //real size

    //after i create the projection steps, containing the future positions of all candidates
    //and temporarily created AABB bounding boxes, i call Collision.boxBox() for each iteration
    
    //if a match is found, the craft will attempt several things: 

    //rotate by some effective amount, like 30deg, (so rotate velocity by this amount)
    //then reproject
    //if that solution wouldn't solve the problem...
    //rotate -30 deg

    //based on the NPC character like ambition and risk-taking some options may be preferred

    // 1) slow down to half the speed
    //then reproject its position AND perform tests against ONLY the colliding objects first
    //if that fixes the collision, all candidates are tested now too

    // 2) speed up to twice it's speed, or the maximum
    //reproject again

    // if neither of that works...

    // 3) try to halt to a stop
    //reproject

    //if that doesn't work, you're fucked



    // the collision should be efficient enough with using approximate box hitboxes, so that I can
    // perform a lot of calculations every frame and don't need to call this method only once per some
    // frames
  }

  interact() {
    //idk, maybe some dialogue thing
  }
}