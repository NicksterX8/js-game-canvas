import GameCanvasLayer from '../GameCanvasLayer.js'

export default class ExtrasLayer extends GameCanvasLayer {
  constructor(canvasElement, options, settings) {
    super(canvasElement, options, settings)
  }

  draw() {
    this.clearCanvas()
    if (this.settings.grid.show) {
      this.drawGrid(this.settings.grid.size,this.settings.grid.size)
    }
    if (this.settings.axis.show) {
      this.drawAxis()
    }
  }

  update(data) {
    this.draw()
  }

  drawAxis() {
    this.ctx.lineWidth = this.settings.axis.lineWidth
    this.ctx.strokeStyle = this.settings.axis.color
    this.ctx.globalAlpha = this.settings.axis.alpha
    this.ctx.beginPath()

    // vertical line
    this.ctx.moveTo((this.c.width / 2), 0)
    this.ctx.lineTo((this.c.width / 2), this.c.height)

    //horizontal line
    this.ctx.moveTo(0, (this.c.height / 2))
    this.ctx.lineTo(this.c.width, (this.c.height / 2))

    this.ctx.closePath()

    this.ctx.stroke()

    if (this.settings.grid.showVectors) {
      this.ctx.beginPath()
      // draw x, y notes on certain grid points
      this.ctx.globalAlpha = 1.0
      this.ctx.font = '24px serif'
      this.ctx.strokeStyle = 'orange'
      this.ctx.textAlign = 'center'
      // draw text for each grid point showing position (vector)
      for (let x = 0; x < 1; x += 5) {
        for (let y = 0; y < 5; y += 5) {

          let pos = {x: x, y: y}

          this.ctx.strokeText(`${parseInt(pos.x)},${parseInt(pos.y)}`, pos.x, pos.y);
        }
      }
      this.ctx.closePath()
      this.ctx.stroke()
    }
  }

  drawGrid(width, height) {

    this.ctx.lineWidth = 1
    let columnWidth = width
    let rowWidth = height

    this.ctx.beginPath()
    this.ctx.globalAlpha = this.settings.grid.alpha
    this.ctx.strokeStyle = this.settings.grid.color
    this.ctx.lineWidth = this.settings.grid.lineWidth

    // vertical lines
    for (let x = (this.c.width / 2); x > 0; x -= columnWidth) {
      this.ctx.moveTo(x, 0)
      this.ctx.lineTo(x, this.c.height)
    }
    for (let x = (this.c.width / 2); x < this.c.width; x += columnWidth) {
      this.ctx.moveTo(x, 0)
      this.ctx.lineTo(x, this.c.height)
    }

    // horizontal lines
    for (let y = (this.c.height / 2); y > 0; y -= rowWidth) {
      this.ctx.moveTo(0, y)
      this.ctx.lineTo(this.c.width, y)
    }
    for (let y = (this.c.height / 2); y < this.c.height; y += rowWidth) {
      this.ctx.moveTo(0, y)
      this.ctx.lineTo(this.c.width, y)
    }
    
    this.ctx.closePath()
    this.ctx.stroke()
    this.ctx.globalAlpha = 1.0
  }
}