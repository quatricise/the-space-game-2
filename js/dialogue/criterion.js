class Criterion {
  constructor() {
    this.requirements = []
    this.element = null
  }
  addRequirement(requirement) {
    this.requirements.push(requirement)
    return requirement
  }
  removeRequirement(requirement) {
    this.requirements.remove(requirement)
    return requirement
  }
  get plain() {
    return {
      requirements: [...this.requirements]
    }
  }
  validate() {
    for(let req of this.requirements) {
      
    }
    return true
  }
}