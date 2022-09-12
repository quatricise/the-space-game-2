class Collision {
  static broadphase(world, tested) {
    //let's just assume the entity is inside the same world
    return world.game_objects.rigid.filter(
      rigid => 
      rigid.cell_pos.x >= tested.cell_pos.x - 1 &&
      rigid.cell_pos.x <= tested.cell_pos.x + 1 &&
      rigid.cell_pos.y >= tested.cell_pos.y - 1 &&
      rigid.cell_pos.y <= tested.cell_pos.y + 1 &&
      rigid !== tested
    )
  }
  static auto(h1, h2) {
    if(typeof h1 !== "object" || typeof h2 !== "object") return
    if(h1.type === "polygon" && h2.type === "polygon")  return this.polygonHitboxPolygonHitbox(h1, h2)
    if(h1.type === "polygon" && h2.type === "circle")   return this.polygonHitboxCircle(h1, h2)
    if(h1.type === "circle" && h2.type === "polygon")   return this.polygonHitboxCircle(h2, h1)
    if(h1.type === "circle" && h2.type === "circle")    return this.circleCircle(h1, h2)
    if(h1 instanceof Vector) {
      console.log(h1, h2)
      if(h2.type === "polygon") return this.polygonHitboxPoint(h2, h1)
      if(h2.type === "circle") return this.pointCircle(h1, h2)
    }
    if(h2 instanceof Vector) {
      console.log(h1, h2)
      if(h1.type === "polygon") return this.polygonHitboxPoint(h1, h2)
      if(h1.type === "circle") return this.pointCircle(h2, h1)
    }
  }
  static lineCircle(line = [], circle) {
    return Intersects.lineCircle(line[0].x, line[0].y, line[1].x, line[1].y, circle.transform.position.x, circle.transform.position.y, circle.radius)
  }
  static linePolygon(line = [], polygon) {
    let verts = []
    polygon.vertices.forEach((vertex)=> {
      verts.push(vertex.x)
      verts.push(vertex.y)
    })
    let tolerance = 0
    return Intersects.linePolygon(line[0].x, line[0].y, line[1].x, line[1].y, verts, tolerance)
  }
  static linePolygonHitbox(line = [], hitbox) {
    let collided = false
    hitbox.bodies.forEach(body => {
      if(this.linePolygon(line, body)) collided = true
    })
    return collided
  }
  static polygonHitboxPolygonHitbox(hitbox1, hitbox2) {
    let collided = false
    let checked_bodies = []
      hitbox1.bodies.forEach(body1 => {
        hitbox2.bodies.forEach(body2 => {
          if(checked_bodies.find(body => body === body2)) return
          if(this.polygonPolygon(body1, body2)) collided = true
        })
        checked_bodies.push(body1)
    })
    return collided
  }
  static polygonHitboxPoint(hitbox, point) {
    let collided = false
    hitbox.bodies.forEach(body => {
      if(this.polygonPoint(body, point)) collided = true
    })
    return collided
  }
  static polygonHitboxCircle(hitbox, circle) {
    let collided = false
    hitbox.bodies.forEach(body => {
      if(this.polygonCircle(body, circle)) collided = true
    })
    return collided
  }
  static polygonCircle(polygon, circle) {
    let verts = []
    polygon.vertices.forEach((vertex)=> {
      verts.push(vertex.x)
      verts.push(vertex.y)
    })
    return Intersects.polygonCircle(
      verts,
      circle.transform.position.x,
      circle.transform.position.y,
      circle.radius,
    )
  }
  static polygonPoint(polygon, point) {
    let verts = []
    polygon.vertices.forEach((vertex)=> {
      verts.push(vertex.x)
      verts.push(vertex.y)
    })
    return Intersects.polygonPoint(
      verts,
      point.x,
      point.y,
    )
  }
  static polygonPolygon(polygon1, polygon2) {
    let verts1 = []
    let verts2 = []
    polygon1.vertices.forEach(vert=> {
      verts1.push(vert.x)
      verts1.push(vert.y)
    })
    polygon2.vertices.forEach(vert=> {
      verts2.push(vert.x)
      verts2.push(vert.y)
    })
    return Intersects.polygonPolygon(
      verts1,
      verts2,
    )
  }
  static circleCircle(circle1, circle2) {
    return Intersects.circleCircle(
      circle1.transform.position.x, circle1.transform.position.y, circle1.radius,
      circle2.transform.position.x, circle2.transform.position.y, circle2.radius,
    )
  }
  static pointCircle(point, circle) {
    return Intersects.pointCircle(
      point.x, point.y,
      circle.transform.position.x, circle.transform.position.y, circle.radius
    )
  }
  static boxBox(box1, box2) {
    return Intersects.boxBox(
      box1.x, box1.y, box1.w, box1.h, 
      box2.x, box2.y, box2.w, box2.h 
    )
  }
  static boxPoint(box, point) {
    return Intersects.boxPoint(
      box.x, box.y, box.w, box.h, 
      point.x, point.y
    )
  }
}

//old functions for reference
function collision_test() { 
  let total = 0
  let number_of_checks = 0
  rigids.forEach(rigid => {
    rigid.collided = false
    rigid.collided_with = null
    rigid.stuck = false
  })
  rigids.forEach(rigid => {
    let candidates = Collision.broadphase(rigid) 
    //second phase
    candidates.forEach(candidate => {
      //temporary variable for one iteration of the forEach loop
      let collided = false
      number_of_checks++
      if(rigid.vwb || candidate.vwb) return

      //circle x circle
      if(rigid.hitbox.type === "circle" && candidate.hitbox.type === "circle") {
        let circle1 = {
          pos: {
            x: rigid.transform.position.x,
            y: rigid.transform.position.y,
          },
          radius: rigid.hitbox.radius
        }
        let circle2 = {
          pos: {
            x: candidate.transform.position.x,
            y: candidate.transform.position.y,
          },
          radius: candidate.hitbox.radius
        }
        if(Collision.circleCircle(circle1, circle2)) {
          collided = true
          total++
        }
      }
      else
      //circle x polygon
      if(
        (rigid.hitbox.type === "polygon" && candidate.hitbox.type === "circle") 
        ||
        (rigid.hitbox.type === "circle" && candidate.hitbox.type === "polygon") 
      ) {
        let circular = candidate
        let polygonal = rigid
        if(rigid.hitbox.type === "circle") {
          circular = rigid
          polygonal = candidate
        }
        polygonal.hitbox.bodies.forEach(body => {
          if(Collision.polygonCircle(body, circular.hitbox)) {
            collided = true
            total++
          }
        })
      }
      else
      //polygon x polygon
      if(rigid.hitbox.type === "polygon" && candidate.hitbox.type === "polygon") {
        if(Collision.polygonHitboxPolygonHitbox(rigid.hitbox, candidate.hitbox)) {
          collided = true
          total++
        }
      }
      //if any test has been successful, mark both as collided
      if(collided) {
        rigid.collided = candidate.collided = true
        rigid.collided_with = candidate
        candidate.collided_with = rigid
        rigid.collided_with.stuck = true
        rigid.stuck = true
        rigid.collided_with.stuck_for += 1
        rigid.stuck_for += 1
      }
    })
    //rule out duplicit collision checks by marking the current object as tested
    rigid.hitbox.tested = true
  })
  rigids.forEach(rigid => {rigid.hitbox.tested = false})
  if(debug.hitbox) console.log("number of checks/s: " + number_of_checks)

  //proto laser code
  lasers.forEach(laser => {
    if(laser.find(v => v.data.hit === true)) return
    rigids.forEach(rigid => {
      if(laser.find(v => v.data.hit === true)) return
      if(rigid === laser[0].data.owner) return
      let hit = false
      if(rigid.hitbox.type === "circle" && Collision.lineCircle(laser, rigid.hitbox)) hit = true
      if(rigid.hitbox.type === "polygon" && Collision.linePolygonHitbox(laser, rigid.hitbox)) hit = true

      if(hit) {
        let distance = laser[0].distance(rigid.pos)
        let length = laser[0].distance(laser[1])
        let diff = laser[1].clone().sub(laser[0])
        diff.mult(distance/length)
        laser[1] = laser[0].clone().add(diff)
        
        laser.forEach(v => v.data.hit = true)
        if(rigid instanceof Ship) rigid.hull_damage()
        if(rigid instanceof Asteroid) {
          let angle = Math.atan2(laser[1].y - laser[0].y, laser[1].x - laser[0].x)
          let angle2 = Math.atan2(rigid.transform.position.y - laser[0].y, rigid.transform.position.x - laser[0].x)
          if(angle < angle2) rigid.rotation_velocity += PI * (angle2 - angle)
          if(angle > angle2) rigid.rotation_velocity -= PI * (angle - angle2)

          rigid.transform.velocity.add(Vector.fromAngle(angle).mult(3))
        }
      }
    })
  })
  //prototype hard-light shield
  ships.forEach(ship => {
    projectiles.forEach(proj => {
      if(proj.owner === ship) return
      let shield = ship.hard_shield
      let angle = Math.atan2(proj.transform.position.y - ship.transform.position.y, proj.transform.position.x - ship.transform.position.x)
      if(angle < 0) angle += PI*2
      if(
        proj.hitbox.type === "circle" && 
        (angle > ship.rotation + shield.rot_offset && angle < ship.rotation + shield.rot_offset + shield.arclen) &&
        Collision.circleCircle(proj.hitbox, {
          radius: ship.hard_shield.radius,
          pos: ship.transform.position.clone(),
        })
      ) {
        proj.collided = true
        ship.collided = true
        ship.collided_with = proj
        proj.collided_with = ship.hard_shield
      }
    })
  })
  //test player inside interactable objects
  interactables.forEach(interactable => {
    if(interactable.hitbox.type === "box") {
      if(Collision.boxPoint(interactable.hitbox.bb, player.ship.pos)) {
        interactable.enter()
      }
      else {
        interactable.leave()
      }
    }
  })
  Q('#collision-count').innerText = total
}

function collision_solve() {
  //prototype projectile code
  rigids.forEach(rigid => {
    if(!rigid.collided) return
    if(rigid instanceof Ship && rigid.collided_with instanceof Projectile) {
      if(rigid.collided_with.owner === rigid) return
      rigid.hull_damage()
      rigid.collided_with.destroy()
    }
    if(rigid instanceof Asteroid && rigid.collided_with instanceof Projectile) {
      rigid.take_damage()
      rigid.collided_with.destroy()
    }
    if(rigid instanceof Debris && rigid.collided_with instanceof Projectile) {
      rigid.collided_with.destroy()
    }
  })
  //collision damage
  rigids.forEach(rigid => {
    if(!rigid.collided) return
    if(rigid instanceof Ship && (
      rigid.collided_with instanceof Asteroid || 
      rigid.collided_with instanceof Ship ||
      rigid.collided_with instanceof Debris
      )
      && !rigid.stuck
    ) {
      rigid.hull_damage()
    }
  })
  //physics solver
  rigids.forEach(rigid => {
    if(!rigid.collided) {
      rigid.stuck = false
      rigid.stuck_for = 0
      return
    }
    //projectiles do not collide with other projectiles, as a general rule
    if(rigid instanceof Projectile) return 
    if(rigid.collided_with instanceof Projectile && rigid.collided_with.owner === rigid) return
    let rigid2 = rigid.collided_with

    let vel = rigid.transform.velocity.clone()
    let vel2 = rigid2.transform.velocity.clone()
    let result = vel.add(vel2)

    rigid.transform.velocity
    .set(result.x, result.y)
    .mult( 0.5)

    rigid2.transform.velocity
    .set(result.x, result.y)
    .mult( 0.5)

    //approach 2

    // let mass_total = rigid.mass + rigid2.mass
    // let step = 1/mass_total
    // let fac1 = step * rigid.mass
    // let fac2 = step * rigid2.mass

    // rigid.transform.velocity
    // .set(result.x, result.y)
    // .mult( fac1)

    // rigid2.transform.velocity
    // .set(result.x, result.y)
    // .mult( fac2)

    //approach 3
    // let add1 = rigid2.  vel.clone().mult(fac2)
    // let add2 = rigid.   vel.clone().mult(fac1)

    // rigid.transform.velocity.add(add1)
    // rigid2.transform.velocity.add(add2)

    rigid.collided = false
    rigid2.collided = false
  })
  //event based 
  collision_events.forEach(event => {
    if(event.obj1.destroyed || event.obj2.destroyed) return
  })
  collision_events = []
}