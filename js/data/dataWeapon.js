data.weapon = {
  missileHelios: {
    displayName: "Helios Missile Launcher Mk. I",
    displayNameShort: "Helios I",
    description: "Homing missile that does 2 damage and causes internal fires. Standard weapon of the Crown fleet.",
    spriteCount: 5,
    buyCost: 90,
    weaponData: {
      chargeMethod: "auto",
      fireMethod: "mousedown",
      canBeDismounted: true,
      power: 1,
      type: "missile",
      projectile: "missileHelios",
      chargeDurationMS: 3500, 
    },
    methods: {
      onkeydown(event) {

      },
      onkeyup(event) {
        
      },
      onmousemove(event) {
        
      },
      onmousedown(event) {
        if(this.ready)
          this.fire()
      },
      onmouseup(event) {
        
      },
      onclick(event) {

      },
      onwheel(event) {
        
      },
      fire() {
        let sprite = this.gameObject.sprite.weapons.children[this.slotIndex]
        if(sprite) {
          sprite.gotoAndPlay(2)
          sprite.onComplete = () => sprite.gotoAndStop(0)
        }

        let position = this.gameObject.transform.position.clone()
        let projectileOffsetToMatchSlotPosition = new Vector(
          this.gameObject.weaponSlots[this.slotIndex].x,
          this.gameObject.weaponSlots[this.slotIndex].y,
        )
        .rotate(this.gameObject.transform.rotation)
        position.add(projectileOffsetToMatchSlotPosition)

        let angleToShipTargetPosition = position.angleTo(this.gameObject.targetPosition)
        let velocity = Vector.fromAngle(angleToShipTargetPosition).mult(data.projectile[this.projectile].speed / 4)

        GameObject.create(
          "projectile", 
          this.projectile, 
          {
            transform: new Transform(
              position,
              velocity,
            ),
            owner: this.gameObject,
            target: this.target,
          },
          {
            world: this.gameObject.gameWorld
          }
        )
        this.ready = false
        this.timers.recharge.start()
        AudioManager.playSFX("rocketWeaponFire")
      },
      recharge() {
        this.ready = true
        this.gameObject.sprite.weapons.children[this.slotIndex]?.gotoAndStop(1)
      },
      findTarget() {
        if(!this.ready) return
        let foundTarget = false
        if(this.gameObject === player.ship) {
          game.gameObjects.ship.forEach(ship => {
            if(!Collision.auto(mouse.worldPosition, ship.hitbox)) return
            if(ship === player.ship) return
            foundTarget = true
            if(ship === this.target) return
            this.setTarget(ship)
          })
        }

        if(!foundTarget)
          this.unsetTarget()
      },
      setTarget(target) {
        AudioManager.playSFX("buttonNoAction", 0.4)
        this.target = target
        this.targetOverlay = GameObject.create("gameOverlay", "targetSmall", {parent: target}, {world: this.gameObject.gameWorld})
      },
      unsetTarget() {
        if(this.targetOverlay)
          GameObject.destroy(this.targetOverlay)
        this.targetOverlay = null
        this.target = null
      },
      updateSpecific() {
        if(!this.powered) return

        this.findTarget()
        this.timers.update()
      },
      setup() {
        this.timers = new Timer(
          ["recharge", this.chargeDurationMS, {loop: false, active: false, onfinish: this.recharge.bind(this)}]
        )
      }
    }
  },
  snakeMissileII: {
    displayName: "Snake Missile Launcher Mk. II",
    displayNameShort: "Snake M. II",
    description: "Launches 3 small missiles, each moves in a wonky pattern, which is hard to dodge.",
    spriteCount: 5,
    buyCost: 80,
    weaponData: {
      chargeMethod: "auto",
      fireMethod: "mousedown",
      canBeDismounted: true,
      power: 1,
      type: "missile",
      projectile: "snakeMissile",
      chargeDurationMS: 4000, 
      collisionGroup: uniqueIDString(),
    },
    methods: {
      onkeydown(event) {

      },
      onkeyup(event) {
        
      },
      onmousemove(event) {
        
      },
      onmousedown(event) {
        if(this.ready)
          this.fire()
      },
      onmouseup(event) {
        
      },
      onclick(event) {

      },
      onwheel(event) {
        
      },
      fire() {
        let sprite = this.gameObject.sprite.weapons.children[this.slotIndex]
        if(sprite) {
          sprite.gotoAndPlay(2)
          sprite.onComplete = () => sprite.gotoAndStop(0)
        }

        /* where the projectile will originate from */
        let origin = this.gameObject.transform.position.clone()

        /* based on the weapon slot location on the ship */
        let offset = new Vector(
          this.gameObject.weaponSlots[this.slotIndex].x,
          this.gameObject.weaponSlots[this.slotIndex].y,
        )
        .rotate(this.gameObject.transform.rotation)

        origin.add(offset)

        let angleToShipTargetPosition = origin.angleTo(this.gameObject.targetPosition)
        let velocity = Vector.fromAngle(angleToShipTargetPosition).mult(data.projectile[this.projectile].speed / 4)
        
        let count = 3
        for(let i = 0; i < count; i++) {
          GameObject.create(
            "projectile", 
            this.projectile, 
            {
              transform: new Transform(
                origin,
                velocity,
              ),
              owner: this.gameObject,
              target: this.target,
              collisionGroup: this.collisionGroup
            },
            {
              world: this.gameObject.gameWorld
            }
          )
        }
        
        this.ready = false
        this.timers.recharge.start()
        AudioManager.playSFX("rocketWeaponFire")
      },
      recharge() {
        this.ready = true
        this.gameObject.sprite.weapons.children[this.slotIndex]?.gotoAndStop(1)
      },
      findTarget() {
        if(!this.ready) return
        let foundTarget = false
        if(this.gameObject === player.ship) {
          game.gameObjects.ship.forEach(ship => {
            if(!Collision.auto(mouse.worldPosition, ship.hitbox)) return
            if(ship === player.ship) return
            foundTarget = true
            if(ship === this.target) return
            this.setTarget(ship)
          })
        }

        if(!foundTarget)
          this.unsetTarget()
      },
      setTarget(target) {
        AudioManager.playSFX("buttonNoAction", 0.4)
        this.target = target
        this.targetOverlay = GameObject.create("gameOverlay", "targetSmall", {parent: target}, {world: this.gameObject.gameWorld})
      },
      unsetTarget() {
        if(this.targetOverlay)
          GameObject.destroy(this.targetOverlay)
        this.targetOverlay = null
        this.target = null
      },
      updateSpecific() {
        if(!this.powered) return

        this.findTarget()
        this.timers.update()
      },
      setup() {
        this.timers = new Timer(
          ["recharge", this.chargeDurationMS, {loop: false, active: false, onfinish: this.recharge.bind(this)}]
        )
      }
    }
  },
  trapMissile: {
    displayName: "Movement Trap Missile",
    displayNameShort: "Trap M.",
    description: "A unique weapon designed to jam target's engine. It prevents targets from moving for several seconds. It does no physical damage.",
    buyCost: 80,
    spriteCount: 6,
    iconColor: "#d42519",
    weaponData: {
      chargeMethod: "auto",
      fireMethod: "mousedown",
      canBeDismounted: true,
      power: 1,
      type: "missile",
      projectile: "trapMissile",
      chargeDurationMS: 7500, 
    },
    methods: {
      onkeydown(event) {

      },
      onkeyup(event) {
        
      },
      onmousemove(event) {
        
      },
      onmousedown(event) {
        if(this.ready)
          this.fire()
      },
      onmouseup(event) {
        
      },
      onclick(event) {

      },
      onwheel(event) {
        
      },
      fire() {
        let sprite = this.gameObject.sprite.weapons.children[this.slotIndex]
        if(sprite) {
          sprite.gotoAndPlay(2)
          sprite.onComplete = () => sprite.gotoAndStop(0)
        }

        let position = this.gameObject.transform.position.clone()
        let projectileOffsetToMatchSlotPosition = new Vector(
          this.gameObject.weaponSlots[this.slotIndex].x,
          this.gameObject.weaponSlots[this.slotIndex].y,
        )
        .rotate(this.gameObject.transform.rotation)
        position.add(projectileOffsetToMatchSlotPosition)

        let angleToShipTargetPosition = position.angleTo(this.gameObject.targetPosition)
        let velocity = Vector.fromAngle(angleToShipTargetPosition).mult(data.projectile[this.projectile].speed)

        GameObject.create(
          "projectile", 
          this.projectile, 
          {
            transform: new Transform(
              position,
              velocity,
            ),
            owner: this.gameObject,
            target: null,
          },
          {
            world: this.gameObject.gameWorld
          }
        )
        this.ready = false
        this.timers.recharge.start()
        AudioManager.playSFX("rocketWeaponFire")
      },
      recharge() {
        this.ready = true
        this.gameObject.sprite.weapons.children[this.slotIndex]?.gotoAndStop(1)
      },
      updateSpecific() {
        if(!this.powered) return

        this.timers.update()
      },
      setup() {
        this.timers = new Timer(
          ["recharge", this.chargeDurationMS, {loop: false, active: false, onfinish: this.recharge.bind(this)}]
        )
      }
    }
  },
  pushBomb: {
    displayName: "Push Bomb",
    displayNameShort: "Push Bomb",
    description: "Weapon designed to fling a target in a specific direction. It does no physical damage.",
    buyCost: 45,
    spriteCount: 7,
    weaponData: {
      chargeMethod: "auto",
      fireMethod: "mousedown",
      aimMethod: "mouseup",
      canBeDismounted: true,
      power: 1,
      type: "bomb",
      projectile: "missileHelios",
      chargeDurationMS: 4000,
      target: null,
      targetOverlay: null,
    },
    methods: {
      onkeydown(event) {

      },
      onkeyup(event) {
        
      },
      onmousemove(event) {
        
      },
      onmousedown(event) {
        if(this.ready)
          this.findTarget()
      },
      onmouseup(event) {
        if(this.target)
          this.fire()
      },
      onclick(event) {

      },
      onwheel(event) {
        
      },
      findTarget() {
        if(!this.ready) return
        let foundTarget = false
        if(this.gameObject === player.ship) {
          game.gameObjects.ship.forEach(ship => {
            if(!Collision.auto(mouse.worldPosition, ship.hitbox)) return
            foundTarget = true
            if(ship == this.target) return
            if(ship == player.ship) return
            
            this.setTarget(ship)
          })
        }
        if(!foundTarget)
          this.unsetTarget()
      },
      setTarget(target) {
        AudioManager.playSFX("buttonNoAction", 0.4)
        this.target = target
        this.targetOverlay = GameObject.create("gameOverlay", "targetSmall", {parent: target}, {world: this.gameObject.gameWorld})
      },
      unsetTarget() {
        if(this.targetOverlay)
          GameObject.destroy(this.targetOverlay)
        this.targetOverlay = null
        this.target = null
      },
      fire() {
        let sprite = this.gameObject.sprite.weapons.children[this.slotIndex]
        if(sprite) {
          sprite.gotoAndPlay(2)
          sprite.onComplete = () => sprite.gotoAndStop(0)
        }

        let position = this.gameObject.transform.position.clone()
        let projectileOffsetToMatchSlotPosition = new Vector(
          this.gameObject.weaponSlots[this.slotIndex].x,
          this.gameObject.weaponSlots[this.slotIndex].y,
        )
        .rotate(this.gameObject.transform.rotation)
        position.add(projectileOffsetToMatchSlotPosition)

        let angleToShipTargetPosition = position.angleTo(this.gameObject.targetPosition)
        let velocity = Vector.fromAngle(angleToShipTargetPosition).mult(data.projectile[this.projectile].speed)

        GameObject.create(
          "projectile", 
          this.projectile, 
          {
            transform: new Transform(
              position,
              velocity,
            ),
            owner: this.gameObject,
            target: null,
          },
          {
            world: this.gameObject.gameWorld
          }
        )
        this.ready = false
        this.timers.recharge.start()
        AudioManager.playSFX("rocketWeaponFire")
      },
      recharge() {
        this.ready = true
        this.gameObject.sprite.weapons.children[this.slotIndex]?.gotoAndStop(1)
      },
      updateSpecific() {
        if(!this.powered) return

        this.timers.update()
      },
      setup() {
        this.timers = new Timer(
          ["recharge", this.chargeDurationMS, {loop: false, active: false, onfinish: this.recharge.bind(this)}]
        )
      }
    }
  },
  plasmaCannonI: {
    displayName: "Plasma Cannon Mk. I",
    displayNameShort: "Plasma I",
    description: "A very standard plasma cannon. Does 1 damage with no special effects.",
    buyCost: 60,
    spriteCount: 7,
    weaponData: {
      chargeMethod: "auto",
      fireMethod: "mousedown",
      canBeDismounted: true,
      power: 1,
      type: "plasma",
      projectile: "plasmaShotI",
      chargeDurationMS: 1600,
    },
    methods: {
      onkeydown(event) {

      },
      onkeyup(event) {
        
      },
      onmousemove(event) {
        
      },
      onmousedown(event) {
        if(this.ready)
          this.fire()
      },
      onmouseup(event) {
        
      },
      onclick(event) {

      },
      onwheel(event) {
        
      },
      recharge() {
        this.ready = true
        this.gameObject.sprite.weapons.children[this.slotIndex]?.gotoAndStop(1)
      },
      fire() {
        let sprite = this.gameObject.sprite.weapons.children[this.slotIndex]
        if(sprite) {
          sprite.gotoAndPlay(2)
          sprite.onComplete = () => sprite.gotoAndStop(0)
        }
        let position = this.gameObject.transform.position.clone()
        let projectileOffsetToMatchSlotPosition = new Vector(
          this.gameObject.weaponSlots[this.slotIndex].x,
          this.gameObject.weaponSlots[this.slotIndex].y,
        )
        .rotate(this.gameObject.transform.rotation)
        position.add(projectileOffsetToMatchSlotPosition)

        let angleToShipTargetPosition = position.angleTo(this.gameObject.targetPosition)
        let velocity = Vector.fromAngle(angleToShipTargetPosition).mult(data.projectile[this.projectile].speed)

        GameObject.create(
          "projectile", 
          this.projectile, 
          {
            transform: new Transform(
              position,
              velocity,
            ),
            owner: this.gameObject,
            target: null,
          },
          {
            world: this.gameObject.gameWorld
          }
        )
        this.ready = false
        this.timers.recharge.start()
        AudioManager.playSFX("plasmaWeaponFire")
      },
      updateSpecific() {
        if(!this.powered) return

        this.timers.update()
      },
      setup() {
        this.timers = new Timer(
          ["recharge", this.chargeDurationMS, {loop: false, active: false, onfinish: this.recharge.bind(this)}]
        )
      }
    }
  },
  plasmaCannonII: {
    displayName: "Plasma Cannon Mk. II",
    displayNameShort: "Plasma II",
    description: "A more powerful plasma cannon, that charges up to two standard plasma shots, which allows for more flexibility in combat.",
    buyCost: 75,
    spriteCount: 8,
    weaponData: {
      chargeMethod: "auto",
      fireMethod: "mousedown",
      canBeDismounted: true,
      power: 2,
      type: "plasma",
      projectile: "plasmaShotI",
      chargeDurationMS: 1600,
      chargesMax: 2,
      charges: 0,
    },
    methods: {
      onkeydown(event) {

      },
      onkeyup(event) {
        
      },
      onmousemove(event) {
        
      },
      onmousedown(event) {
        if(this.ready)
          this.fire()
      },
      onmouseup(event) {
        
      },
      onclick(event) {

      },
      onwheel(event) {
        
      },
      recharge() {
        this.ready = true
        this.charges = Math.min(this.chargesMax, this.charges + 1)
        this.gameObject.sprite.weapons.children[this.slotIndex]?.gotoAndStop(this.charges)
        if(this.charges < this.chargesMax)
          this.timers.recharge.start()
      },
      fire() {
        let sprite = this.gameObject.sprite.weapons.children[this.slotIndex]
        if(sprite) {
          sprite.gotoAndPlay(this.charges + 1)
          sprite.onComplete = () => sprite.gotoAndStop(this.charges)
        }
        let position = this.gameObject.transform.position.clone()
        let projectileOffsetToMatchSlotPosition = new Vector(
          this.gameObject.weaponSlots[this.slotIndex].x,
          this.gameObject.weaponSlots[this.slotIndex].y,
        )
        .rotate(this.gameObject.transform.rotation)
        position.add(projectileOffsetToMatchSlotPosition)

        let angleToShipTargetPosition = position.angleTo(this.gameObject.targetPosition)
        let velocity = Vector.fromAngle(angleToShipTargetPosition).mult(data.projectile[this.projectile].speed)

        GameObject.create(
          "projectile", 
          this.projectile, 
          {
            transform: new Transform(
              position,
              velocity,
            ),
            owner: this.gameObject,
            target: null,
          },
          {
            world: this.gameObject.gameWorld
          }
        )
        this.charges--
        this.charges > 0 ? this.ready = true : this.ready = false
        
        this.timers.recharge.start()
        AudioManager.playSFX("plasmaWeaponFire")
      },
      updateSpecific() {
        if(!this.powered) return

        this.timers.update()

        if(!this.timers.recharge.active && this.charges < this.chargesMax)
          this.timers.recharge.start()
      },
      setup() {
        this.timers = new Timer(
          ["recharge", this.chargeDurationMS, {loop: false, active: false, onfinish: this.recharge.bind(this)}]
        )
      }
    }
  },
  plasmaChain: {
    displayName: "Plasma Chain Cannon",
    displayNameShort: "Plasma C.",
    description: "A more powerful plasma cannon, that charges up to 6 standard plasma shots, which are all fired in a burst. \n Very good at spamming a smaller fleet of ships.",
    buyCost: 70,
    spriteCount: 7,
    weaponData: {
      chargeMethod: "auto",
      fireMethod: "mousedown",
      canBeDismounted: true,
      power: 3,
      type: "plasma",
      projectile: "plasmaShotI",
      chargeDurationMS: 850,
      nextShotDelay: 120,
      charges: 0,
      chargesMax: 6,
      collisionGroup: uniqueIDString()
    },
    methods: {
      onkeydown(event) {

      },
      onkeyup(event) {
        
      },
      onmousemove(event) {
        
      },
      onmousedown(event) {
        if(this.ready && this.charges == this.chargesMax)
          this.fireNextShot()
      },
      onmouseup(event) {
        
      },
      onclick(event) {

      },
      onwheel(event) {
        
      },
      recharge() {
        this.charges = Math.min(this.chargesMax, this.charges + 1)
        if(this.charges < this.chargesMax)
          this.timers.recharge.start()
        else {
          this.ready = true
          this.gameObject.sprite.weapons.children[this.slotIndex]?.gotoAndStop(1)
        }
      },
      scheduleNextShot() {
        this.ready = false
        if(this.charges) {
          this.timers.fireNextShot.start()
        }
        else {
          this.timers.fireNextShot.reset()
          this.timers.recharge.start()
        }
      },
      fireNextShot() {
        this.fire()
        this.scheduleNextShot()
      },
      fire() {
        let sprite = this.gameObject.sprite.weapons.children[this.slotIndex]
        if(sprite) {
          sprite.gotoAndPlay(2)
          sprite.onComplete = () => sprite.gotoAndStop(0)
        }
        let position = this.gameObject.transform.position.clone()
        let projectileOffsetToMatchSlotPosition = new Vector(
          this.gameObject.weaponSlots[this.slotIndex].x,
          this.gameObject.weaponSlots[this.slotIndex].y,
        )
        .rotate(this.gameObject.transform.rotation)
        position.add(projectileOffsetToMatchSlotPosition)

        let angleToShipTargetPosition = position.angleTo(this.gameObject.targetPosition)
        let velocity = Vector.fromAngle(angleToShipTargetPosition).mult(data.projectile[this.projectile].speed)

        GameObject.create(
          "projectile", 
          this.projectile, 
          {
            transform: new Transform(
              position,
              velocity,
            ),
            owner: this.gameObject,
            target: null,
            collisionGroup: this.collisionGroup
          },
          {
            world: this.gameObject.gameWorld
          }
        )
        this.charges--
        AudioManager.playSFX("plasmaWeaponFire")
      },
      updateSpecific() {
        if(!this.powered) return

        this.timers.update()

        if(!this.timers.recharge.active && this.charges < this.chargesMax && !this.isFiring)
          this.timers.recharge.start()
      },
      setup() {
        this.timers = new Timer(
          ["recharge", this.chargeDurationMS, {loop: false, active: false, onfinish: this.recharge.bind(this)}],
          ["fireNextShot", this.nextShotDelay, {loop: true, active: false, onfinish: this.fireNextShot.bind(this)}],
        )
      }
    }
  },
  forkLaserI: {
    displayName: "Fork Laser Mk. I",
    displayNameShort: "Fork Laser",
    description: "Unusually designed laser weapon - it shoots one powerful beam, which is split by a prism into two less powerful beams. If your target is large enough, both beams usually hit.",
    buyCost: 60,
    spriteCount: 1,
    weaponData: {
      canBeDismounted: false,
      power: 1,
      type: "laser",
      chargeDurationMS: 1500,
      damagePerBeam: 1,
    },
    methods: {
      onkeydown(event) {

      },
      onkeyup(event) {
        
      },
      onmousemove(event) {
        
      },
      onmousedown(event) {
        
      },
      onmouseup(event) {
        
      },
      onclick(event) {

      },
      onwheel(event) {
        
      },
      fire() {
        
      },
      updateSpecific() {
        if(!this.powered) return


      },
      setup() {
        
      }
    }
  },
  burstLaser: {
    displayName: "Burst Laser Mk. I",
    displayNameShort: "Burst L. I",
    description: "Poorly designed but powerful weapon. Suffers from slight inaccuracy. Shoots three consecutive layers, each with a 50% chance to do damage.",
    buyCost: 80,
    spriteCount: 1,
    weaponData: {
      chargeMethod: "auto",
      fireMethod: "mousedown",
      canBeDismounted: true,
      power: 1,
      type: "laser",
      chargeDurationMS: 3000,
      charges: 0,
      chargesMax: 3,
      damagePerBeam: 1,
      chanceToDamage: 0.5,
    },
    methods: {
      onkeydown(event) {

      },
      onkeyup(event) {
        
      },
      onmousemove(event) {
        
      },
      onmousedown(event) {
        if(this.ready)
          this.fire()
      },
      onmouseup(event) {
        
      },
      onclick(event) {

      },
      onwheel(event) {
        
      },
      recharge() {
        this.charges = this.chargesMax
        this.ready = true
      },
      fire() {
        
      },
      updateSpecific() {
        if(!this.powered) return


      },
      setup() {
        this.timers = new Timer(
          ["recharge", this.chargeDurationMS, {loop: false, active: false, onfinish: this.recharge.bind(this)}],
          ["fireNextShot", this.nextShotDelay, {loop: true, active: false, onfinish: this.fireNextShot.bind(this)}],
        )
      }
    }
  },
  waspLaserFront: {
    displayName: "Wasp Fighter Front Laser",
    displayNameShort: "Wasp L.",
    description: "Powerful and unwieldy, a special laser used by the Wasp tribe. It takes a while to charge and it's hard to aim, but does serious damage.",
    buyCost: null,
    spriteCount: 1,
    weaponData: {
      chargeMethod: "mousedown",
      fireMethod: "mouseup",
      canBeDismounted: false,
      type: "laser",
      power: 1,
      damagePerCharge: 1,
      chargesMax: 4,
      charges: 0,
      chargeCurrent: 0,
      charging: false,
      chargeDurationMS: 1000,
      previousDamage: 0,
      weaponOrigin: {x: 80, y: 0},
      sprites: [],
      prefireSprites: [],
    },
    methods: {
      onkeydown(event) {

      },
      onkeyup(event) {
        
      },
      onmousemove(event) {
        
      },
      onmousedown(event) {
        this.charging = true
        this.generateLaserPrefireSprites()
      },
      onmouseup(event) {
        this.charging = false
        if(this.ready)
          this.fire()
        this.destroyLaserPrefireSprites()
      },
      onclick(event) {
        
      },
      onwheel(event) {
        
      },
      fire() {
        this.ready = false
        let laserDamage = this.charges * this.damagePerCharge
        this.previousDamage = laserDamage

        this.charges = 0
        this.chargeCurrent = 0
        
        this.line = new Line(
          this.getWeaponFireOrigin(),
          this.getWeaponFireOrigin().add(Vector.fromAngle(this.gameObject.transform.rotation).mult(100000))
        )
        this.line.endPoint.sub(this.line.startPoint).mult(50)

        let targets = []
        let laserDistance
        this.gameObject.gameWorld.gameObjects.gameObject.forEach(obj => {
          if(!obj.hitbox) return
          if(!obj.rigidbody) return
          if(obj === this.gameObject) return
          if(obj instanceof Interactable) return
          
          if(Collision.auto(obj.hitbox, this.line))
            targets.push(obj)
        })
        if(targets.length) {
          let closest = GameObject.closest(this.gameObject, ...targets)
          let protoCollisionEvent = {impactSpeed: 100000, impactDamage: laserDamage}
          this.createHitParticles(closest, laserDamage)
          closest.sprite.container.filters = [filters.laserHit]
          setTimeout(() => {
            if(closest.destroyed) return
            closest.sprite.container.filters = []
          }, 250)
          closest.handleImpact(protoCollisionEvent)
          laserDistance = GameObject.distance(this.gameObject, closest)
        }
        this.generateLaserSprite(laserDistance, laserDamage)
        this.createFireParticles(laserDamage)
        this.gameObject.gameWorld.camera.shake(1 + laserDamage / 8)
        this.pushGameObject(Vector.fromAngle(this.gameObject.transform.rotation).invert().mult(25 * laserDamage))
        AudioManager.playSFX("plasmaWeaponFire")
      },
      pushGameObject(pushVector) {
        this.gameObject.transform.velocity.add(pushVector)
      },
      createHitParticles(target, laserDamage) {
        let count = Random.int(Math.ceil(laserDamage / 1.5), Math.ceil(laserDamage / 1.5) * 1.5)
        let spawnAttempts = 0
        let successfulSpawns = 0
        for(let i = 0; i < count; i++) {
          spawnAttempts++
          if(spawnAttempts > 50) break

          let position = target.transform.position.clone()
          if(i > 0) 
            position.add(new Vector(...Random.intArray(-120, 120, 2))) 
          if(!Collision.auto(position, target.hitbox)) {
            i--
            continue
          }
          let velocity = new Vector()
          let rotation = Random.rotation()
          let particle = GameObject.create(
            "particle", 
            "laserHit", 
            {transform: new Transform(position, velocity, rotation)}, 
            {world: target.gameWorld}
          )
          particle.sprite.container.scale.set(Random.decimal(0.4 + laserDamage / 8, 0.9 + laserDamage / 8, 1))
          successfulSpawns++
        }
      },
      createFireParticles(laserDamage) {
        let position = this.getWeaponFireOrigin()
        let rotation = Random.rotation()
        let particle = GameObject.create(
          "particle", 
          "laserHit", 
          {transform: new Transform(position, undefined, rotation)}, 
          {world: this.gameObject.gameWorld}
        )
        particle.sprite.container.scale.set(Random.decimal(0.4 + laserDamage / 8, 0.9 + laserDamage / 8, 1))
      },
      getWeaponFireOrigin() {
        let weaponOffsetVector = new Vector(this.weaponOrigin.x, this.weaponOrigin.y).rotate(this.gameObject.transform.rotation)
        return this.gameObject.transform.position.clone().add(weaponOffsetVector)
      },
      generateLaserSprite(distance = 2000, brightnessMultiplier) {
        this.destroyLaserSprite()
        let spriteSize = 64
        let angle = this.line.angle
        let offsetVector = Vector.fromAngle(angle).mult(spriteSize)
        let startingPosition = this.getWeaponFireOrigin()
        let iterationCount = Math.floor(distance / spriteSize)
        let filter = new PIXI.filters.ColorMatrixFilter()
            filter.brightness(0.9 + brightnessMultiplier/10)

        for(let i = 0; i < iterationCount; i++) {
          let position = startingPosition.clone().add(offsetVector.clone().mult(i))
          let sprite
          if(i === iterationCount - 1)
            sprite = new PIXI.Sprite.from(`assets/weaponFX/laserFireThickCap000${Random.int(0, 1)}.png`)
          else
            sprite = new PIXI.Sprite.from(`assets/weaponFX/laserFireThick000${Random.int(0, 3)}.png`)
          sprite.anchor.set(0.5)
          sprite.position.set(position.x, position.y)
          sprite.rotation = angle
          sprite.filters = [filter]

          if(Random.bool() && i < iterationCount - 1)
            sprite.rotation += PI
          
          this.gameObject.gameWorld.layers.overlays.addChild(sprite)
          this.sprites.push(sprite)
        }
      },
      destroyLaserSprite() {
        this.sprites.forEach(sprite => this.gameObject.gameWorld.layers.overlays.removeChild(sprite))
        this.sprites = []
      },
      updateWeaponSprite() {
        this.gameObject.sprite.laserChargeProgress.gotoAndStop(this.charges)
      },
      updateLaserSprite() {
        if(this.charging)
          this.updateLaserPrefireSprites()
        if(this.sprites)
          this.updateLaserFireSprite()
      },
      updateLaserFireSprite() {
        for(let sprite of this.sprites) {
          sprite.alpha -= (2 - this.previousDamage/(this.damagePerCharge * this.chargesMax + 1)) * dt
          if(sprite.alpha <= 0) {
            this.destroyLaserSprite()
            break
          }
        }
      },
      destroyLaserPrefireSprites() {
        this.prefireSprites.forEach(sprite => this.gameObject.gameWorld.layers.overlays.removeChild(sprite))
        this.prefireSprites = []
      },
      generateLaserPrefireSprites() {
        this.destroyLaserPrefireSprites()

        let spriteSize = 64
        let spriteCount = 30
        let angle = this.gameObject.transform.rotation
        let offsetVector = Vector.fromAngle(angle).mult(spriteSize)
        let startingPosition = this.getWeaponFireOrigin()

        for(let i = 0; i < spriteCount; i++) {
          let position = startingPosition.clone().add(offsetVector.clone().mult(i))
          let sprite = new PIXI.Sprite.from(`assets/weaponFX/laserFirePrefire.png`)
              sprite.anchor.set(0.5)
              sprite.position.set(position.x + offsetVector.x / 2, position.y + offsetVector.y / 2)
              sprite.rotation = angle
          Random.bool() ? sprite.rotation += PI : null
          this.gameObject.gameWorld.layers.overlays.addChild(sprite)
          this.prefireSprites.push(sprite)
        }
      },
      updateLaserPrefireSprites() {
        let spriteSize = 64
        let angle = this.gameObject.transform.rotation + Random.float(-0.01 * (this.charges / this.chargesMax), 0.01 * (this.charges / this.chargesMax))
        let offsetVector = Vector.fromAngle(angle).mult(spriteSize)
        let startingPosition = this.getWeaponFireOrigin()
        let alpha = ((this.chargeCurrent / this.chargeDurationMS) / this.chargesMax) + this.charges / this.chargesMax + Random.float(-0.05, 0.05)

        this.prefireSprites.forEach((sprite, i) => {
          let position = startingPosition.clone().add(offsetVector.clone().mult(i))
          sprite.alpha = alpha
          sprite.rotation = angle
          sprite.position.set(position.x + offsetVector.x/2, position.y + offsetVector.y / 2)
        })
      },
      updateCharge() {
        if(this.charges === 0 && !this.charging) return
        if(this.charges === this.chargesMax && this.charging) return

        this.charging ? this.chargeCurrent += 1000 * dt : this.chargeCurrent -= 1000 * dt

        this.chargeCurrent = Math.max(0, this.chargeCurrent)

        if(this.chargeCurrent > this.chargeDurationMS) {
          this.charges++
          this.chargeCurrent = 0
        }
        else
        if(this.chargeCurrent <= 0) {
          this.charges--
          this.chargeCurrent = this.chargeDurationMS
        }

        this.charges > 0 ? this.ready = true : this.ready = false
      },
      updateSpecific() {
        if(!this.powered) return

        this.updateCharge()
        this.updateWeaponSprite()
        this.updateLaserSprite()
      },
      setup() {
        
      }
    }
  },
  debrisGun: {
    displayName: "Debris Gun",
    displayNameShort: "Debris",
    description: "A garbage weapon. Literally. Uses collected debris from ship's cargo to function.",
    buyCost: 60,
    spriteCount: 7,
    weaponData: {
      chargeMethod: "auto",
      fireMethod: "mousedown",
      canBeDismounted: true,
      power: 1,
      type: "solid",
      projectile: "debris",
      chargeDurationMS: 2800, 
    },
    methods: {
      onkeydown(event) {

      },
      onkeyup(event) {
        
      },
      onmousemove(event) {
        
      },
      onmousedown(event) {
        if(this.ready)
          this.fire()
      },
      onmouseup(event) {
        
      },
      onclick(event) {

      },
      onwheel(event) {
        
      },
      fire() {
        if(!this.gameObject.cargo.removeItemByName("debris")) {
          this.createNoAmmoOverlay()
          this.createNotReadyOverlay()
          return
        }

        let sprite = this.gameObject.sprite.weapons.children[this.slotIndex]
        if(sprite) {
          sprite.gotoAndPlay(2)
          sprite.onComplete = () => sprite.gotoAndStop(0)
        }
        let projectileOffset = new Vector(this.gameObject.weaponSlots[this.slotIndex].x, this.gameObject.weaponSlots[this.slotIndex].y,)
        .rotate(this.gameObject.transform.rotation)

        let basePosition = this.gameObject.transform.position.clone().add(projectileOffset)
        let projectileCount = Random.int(3, 8)
        let collisionGroup = uniqueIDString()

        for(let i = 0; i < projectileCount; i++) {
          /* break if run out of debris */
          if(!this.gameObject.cargo.removeItemByName("debris")) break

          let position = basePosition.clone()
          .add(
            new Vector(
              Random.int(-25, 25), 
              Random.int(-25, 25)
            )
          )
          let angleToShipTargetPosition = basePosition.angleTo(this.gameObject.targetPosition) + Random.float(-0.10, 0.10)
          let velocity = Vector.fromAngle(angleToShipTargetPosition)
          .mult(data.projectile[this.projectile].speed)
          .mult(Random.float(0.90, 1.05))
          let angularVelocity = Random.float(0, PI/2)
          let rotation = Random.float(0, TAU)

          GameObject.create(
            "projectile", 
            this.projectile,
            {
              transform: new Transform(
                position,
                velocity,
                rotation,
                angularVelocity,
              ),
              owner: this.gameObject,
              target: null,
              collisionGroup,
            },
            {
              world: this.gameObject.gameWorld
            }
          )
        }
        this.ready = false
        this.timers.recharge.start()
        AudioManager.playSFX("rocketWeaponFire")
      },
      recharge() {
        this.ready = true
        this.gameObject.sprite.weapons.children[this.slotIndex]?.gotoAndStop(1)
      },
      updateSpecific() {
        if(!this.powered) return

        this.timers.update()
      },
      setup() {
        this.timers = new Timer(
          ["recharge", this.chargeDurationMS, {loop: false, active: false, onfinish: this.recharge.bind(this)}],
        )
      }
    }
  },
  lavaGun: {
    displayName: "Lava Gun I.",
    displayNameShort: "Lava I.",
    description: "Very powerful experimental weapon, it spits fast-flying molten rock. Only found on lava ships.",
    buyCost: 90,
    spriteCount: 7,
    weaponData: {
      chargeMethod: "auto",
      fireMethod: "mousedown",
      canBeDismounted: false,
      power: 1,
      type: "solid",
      projectiles: ["lava", "lavaSmall", "lavaBig"],
      chargeDurationMS: 4500, 
    },
    methods: {
      onkeydown(event) {

      },
      onkeyup(event) {
        
      },
      onmousemove(event) {
        
      },
      onmousedown(event) {
        if(this.charging) return
          this.chargeBegin()
      },
      onmouseup(event) {
        
      },
      onclick(event) {

      },
      onwheel(event) {
        
      },
      fire() {
        let sprite = this.gameObject.sprite.weapons.children[this.slotIndex]
        if(sprite) {
          sprite.gotoAndPlay(2)
          sprite.onComplete = () => sprite.gotoAndStop(0)
        }
        let projectileOffset = new Vector(this.gameObject.weaponSlots[this.slotIndex].x, this.gameObject.weaponSlots[this.slotIndex].y,)
        .rotate(this.gameObject.transform.rotation)

        let basePosition = this.gameObject.transform.position.clone().add(projectileOffset)
        let projectileCount = Random.int(5, 10)
        let collisionGroup = uniqueIDString()

        /** @type Float from 0 to 1 */
        let speedVariation = 0.30

        for(let i = 0; i < projectileCount; i++) {
          let projectileName = Random.from(...this.projectiles)
          let position = basePosition.clone()
          .add(
            new Vector(
              Random.int(-25, 25),
              Random.int(-25, 25)
            )
          )
          let randomizedAngle = basePosition.angleTo(this.gameObject.targetPosition) + Random.float(-0.5, 0.5)
          let velocity = Vector.fromAngle(randomizedAngle)
          .mult(data.projectile[this.projectiles[0]].speed * (1 - Random.float(0, speedVariation)))
          let angularVelocity = Random.float(0, PI/2)
          let rotation = Random.float(0, TAU)

          GameObject.create(
            "projectile", 
            projectileName,
            {
              transform: new Transform(
                position,
                velocity,
                rotation,
                angularVelocity,
              ),
              owner: this.gameObject,
              target: null,
              collisionGroup,
            },
            {
              world: this.gameObject.gameWorld
            }
          )
        }
        this.charging = false
        this.ready = true
        AudioManager.playSFX("rocketWeaponFire")
      },
      chargeBegin() {
        this.charging = true
        this.ready = false
        this.timers.chargeBegin.start()
      },
      updateWeaponSprite() {
        let spriteCount = this.gameObject.sprite.laserChargeProgress.textures.length
        let index = (this.timers.chargeBegin.currentTime / this.timers.chargeBegin.duration) * (spriteCount - 1)
        index = Math.round(index)
        this.gameObject.sprite.laserChargeProgress.gotoAndStop(index)
      },
      updateSpecific() {
        if(!this.powered) return

        this.timers.update()
        this.updateWeaponSprite()
      },
      setup() {
        this.timers = new Timer(
          ["chargeBegin", this.chargeDurationMS, {loop: false, active: false, onfinish: this.fire.bind(this)}]
        )
      }
    }
  },
}
