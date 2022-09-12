class Person extends GameObject {
  constructor(name, job_title, location) {
    super()
    let person = data.person[name]
    this.name = person.name
    this.location = location
    this.job_title = data.job_title[job_title]
    this.display_name = person.display_name
    this.currency = 0
    this.inventory = new Inventory()
  }
  set_job_title(job_title) {
    if(!data.job_title[job_title]) throw "job_title not found"
    this.job_title = data.job_title[job_title]
  }
}