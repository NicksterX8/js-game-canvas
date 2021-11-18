export default class GameCanvasLayer {
  constructor(canvasElement, options, settings) {
    this.c = canvasElement
    this.options = options
    this.settings = settings
    this.ctx = this.getNewContext()
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.c.width, this.c.height)
  }

  getNewContext() {
    let ctx = this.c.getContext("2d", { alpha: this.options.alpha })

    if (this.options.pixelated) {
      //!!!THIS IS WHAT MAKES IT PIXEL-Y!!!
      ctx.mozImageSmoothingEnabled = false;
      ctx.webkitImageSmoothingEnabled = false;
      ctx.msImageSmoothingEnabled = false;
      ctx.imageSmoothingEnabled = false;
    }

    return ctx
  }

  resize(width, height) {
    // set canvas size to 100% of window size
    this.c.width = width
    this.c.height = height

    // the canvas nees to be re-constructed after size
    this.ctx = this.getNewContext()
    this.draw() // and updated
  }

  update(data) {
    console.error("GameCanvas' prototype method update is not overridden")
    this.draw()
  }

  draw() {
    console.error("GameCanvas' prototype method draw is not overridden")
  }
}


