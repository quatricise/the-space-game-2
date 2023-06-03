class SpritePreprocessor {
  static jobs = 0
  static beginJobTracking(callback) {
    this.callAfterJobTrackingFinished = callback
    this.isTrackingJobs = true
  }
  static stopJobTracking() {
    this.isTrackingJobs = false
  }
  static finishJobTracking() {
    console.log("Finished job tracking, total amount:" , this.jobs)
    this.isTrackingJobs = false
    if(this.jobs !== 0)
      throw "error"
    this.callAfterJobTrackingFinished()
  }
  static incrementJobCount() {
    console.log("Job added")
    this.jobs++
  }
  static decrementJobCount() {
    this.jobs--
    if(this.jobs === 0)
      this.finishJobTracking()
    if(this.jobs < 0)
      throw "error"
  }
  static async applyFilterToImage(imageSource, filter = {intensity: 0.5, hue: 296, saturationShift: 1.5}) {
    if(this.isTrackingJobs)
      this.incrementJobCount()
    
    let canvas = document.createElement("canvas")
    let ctx = canvas.getContext("2d")
    
    let image = new Image(); image.src = imageSource
    await image.decode()

    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight

    //draw the base image with altered saturation
    ctx.filter = `saturate(${filter.saturationShift}`
    ctx.drawImage(image, 0, 0)

    //draw an overlay that colors the image
    ctx.filter = ""
    ctx.globalCompositeOperation = "hue"
    ctx.globalAlpha = filter.intensity
    ctx.fillStyle = `hsl(${filter.hue}, 100%, 50%)`
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    //restore the alpha channel to match the original image
    ctx.filter = ""
    ctx.globalAlpha = 1.0
    ctx.globalCompositeOperation = "destination-in"
    ctx.drawImage(image, 0, 0)

    let processedImage = new Image(); 
        processedImage.src = canvas.toDataURL()

    if(this.isTrackingJobs)
      this.decrementJobCount()

    return processedImage
  }
  static prefilterImages() {
    this.processedImages.push()
  }
  static processedImages = []
}