/** 
 * Object used to store and manipulate a set of GameObjects as if they were one. 
 * Objects otherwise retain autonomy. 
 * Objects can be freely added or taken out of the cluster. 
*/
class Cluster extends GameObject {
  constructor(/** @type Transform */ transform) {
    super(transform)

    /** @type Set<GameObject> */
    this.objects = new Set()

    /** @type String*/
    this.type = "cluster"

    /** @type String */
    this.name = "Cluster"

    /** "lump" or "chain". 
     * This determines how the object behaves when objects are destroyed or removed. 
     * Lump is a big group of objects where they are all connected to each other. If any object stops touching the others or is not held by special cluster connection.
     * Chain is
    */
    this.clusterType = "lump"
  }
  add(...objects) {
    this.objects.addAll(...objects)
  }
  remove(...objects) {
    objects.forEach(obj => this.objects.delete(obj))
  }
  calculateCenter() {
    if(this.objects.size === 0) return

    let vectors = this.objects.map(o => o.transform.position)
    this.transform.position.setFrom(Vector.avg(...vectors))
  }
  /** Chain cluster can break once one of the pieces is destroyed. The chain cluster always breaks into more chains. When a chain has only one link, it is destroyed. */
  break(/** @type Integer */ atIndex) {
    let cl = new Cluster()
    cl.add()
    let cl2 = new Cluster()
    cl2.add()
  }
  update() {
    this.calculateCenter()
    this.objects.forEach(obj => {
      obj.transform.angularVelocity = 0
      obj.transform.position.rotateAround(this.transform.position, this.transform.angularVelocity)
    })
  }
}

class ClusterConnection {
  constructor(type, limit) {
    /** 
     * "overlap" of "fixed".
     * Overlap - connection is broken once objects stop intersecting each other.
     * Fixed - connection is never broken by proximity. Can be broken by setting a limit on it and applying a stronger force to break the connection.
    */
    this.type = type

    /** @type Number - How much velocity gain the object must receive in a single instant to break the connection. */
    this.limit = limit ?? Infinity
  }
}