import GameCanvasLayer from '../GameCanvasLayer.js'

export default class BackgroundLayer extends GameCanvasLayer {
  constructor(canvasElement, options, settings) {
    super(canvasElement, options, settings)
  }

  draw() {
    this.ctx.globalAlpha = 1.0
    this.ctx.fillStyle = this.settings.color
    this.ctx.fillRect(0, 0, this.c.width, this.c.height);
  }

  update(data) {
    this.draw()
  }
}