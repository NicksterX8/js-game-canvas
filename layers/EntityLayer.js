import GameCanvasLayer from '../GameCanvasLayer.js'

export default class EntityLayer extends GameCanvasLayer {
  constructor(canvasElement, options, settings) {
    super(canvasElement, options, settings)
    this.settings = settings
  }

  update(data) {
    if (data == undefined) {
      console.error("update data passed to entity layer is undefined")
      data = []
    }
    this.entities = data
    this.draw()
  }

  draw() {
    this.ctx.globalAlpha = 1.0
    this.ctx.clearRect(0, 0, this.c.width, this.c.height)

    for (let i = 0; i < this.entities.length; i++) {
      let entity = this.entities[i]
      
      if (entity.alpha === 0) {
        // invisible, don't draw
        continue
      }
      if (entity.alpha) {
        this.ctx.globalAlpha = entity.alpha
      } else {
        this.ctx.globalAlpha = this.settings.defaultAlpha
      }

      if (entity.rotation) {
        this.ctx.translate(entity.x + entity.width / 2, (entity.y + (entity.height / 2)))
        this.ctx.rotate(entity.rotation * Math.PI / 180)
        this.ctx.translate(-(entity.x + (entity.width / 2)), -(entity.y + (entity.height / 2)))
      }

      this.ctx.drawImage(
        entity.sprite,
        parseInt(entity.x), // renders center of game entity, rather than top left corner (where the position is placed)
        parseInt(entity.y),
        entity.width,
        entity.height
      )

      if (this.settings.boxes.show) {
        this.ctx.beginPath()
        this.ctx.rect(parseInt(entity.x), parseInt(entity.y), entity.width, entity.height)
        this.ctx.strokeStyle = this.settings.boxes.transformedColor
        this.ctx.globalAlpha = this.settings.boxes.alpha
        this.ctx.lineWidth = this.settings.boxes.lineWidth
        this.ctx.closePath()
        this.ctx.stroke()
      }

      if (entity.rotation) {
        this.ctx.translate(entity.x + entity.width / 2, (entity.y + (entity.height / 2)))
        this.ctx.rotate(-entity.rotation * Math.PI / 180)
        this.ctx.translate(-(entity.x + (entity.width / 2)), -(entity.y + (entity.height / 2)))
      }

      if (this.settings.vectors.show) {
        this.ctx.lineWidth = 1
        this.ctx.globalAlpha = 1
        this.ctx.font = this.settings.vectors.font
        this.ctx.strokeStyle = this.settings.vectors.color
        this.ctx.strokeText(parseInt(entity.x) + "," + parseInt(entity.y), entity.x - 3, entity.y - 5)
      }

      if (this.settings.boxes.show) {
        this.ctx.beginPath()
        this.ctx.rect(parseInt(entity.x), parseInt(entity.y), entity.width, entity.height)
        this.ctx.strokeStyle = this.settings.boxes.color
        this.ctx.globalAlpha = this.settings.boxes.alpha
        this.ctx.lineWidth = this.settings.boxes.lineWidth
        this.ctx.closePath()
        this.ctx.stroke()
      }
    }
    this.ctx.globalAlpha = 1.0
  }
  
}