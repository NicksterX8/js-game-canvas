import GameEntity from "./GameEntity.js"

export default class GameCanvas {
  constructor(canvasElement, settings, options) {
    this.options = options
    this.initCanvas(canvasElement, options)
    // initializes this.c and this.ctx
    this.layers = []
    this.entities = []

    // settings
    this.settings = settings

    this.clickHandler = () => {}

    this.c.addEventListener("click", (e) => {
      // e is the event
      // get x and y position using e.clientX/Y
      // to get position relative to canvas subtract from the coordinates the distance from the top and left the canvas is 
      let canvasPosition = this.c.getBoundingClientRect()
      let mouseX = e.clientX - canvasPosition.left
      let mouseY = e.clientY - canvasPosition.top

      this.clickHandler(mouseX, mouseY)
    })
  }

  initCanvas(canvas, options) {

    if (!options) {
      options = this.options
    }

    this.c = canvas
    this.ctx = this.c.getContext("2d", { alpha: options.alpha })

    if (options.pixelated) {
      //!!!THIS IS WHAT MAKES IT PIXEL-Y!!!
      this.ctx.mozImageSmoothingEnabled = false;
      this.ctx.webkitImageSmoothingEnabled = false;
      this.ctx.msImageSmoothingEnabled = false;
      this.ctx.imageSmoothingEnabled = false;
    }
  }

  clickHandler(mouseX, mouseY) {

  }

  getCenterX() {
    return this.c.width / 2
  }
  getCenterY() {
    return this.c.height / 2
  }

  lightmode() {
    this.settings.backgroundColor = 'white'
    this.settings.axis.color = 'black'
    this.settings.grid.color = 'grey'
  }

  darkmode() {
    this.settings.backgroundColor = 'black'
    this.settings.axis.color = 'white'
    this.settings.grid.color = 'grey'
  }

  resizeCanvas(width, height) {
    // set canvas size to 100% of window size
    this.c.width = width
    this.c.height = height

    // the canvas nees to be re-constructed after size
    this.initCanvas(this.c)
    this.draw() // and updated
  }

  updateEntities(entities) {
    this.entities = entities
    this.draw()
  }

  update(entities) {
    this.entities = entities
    this.draw()
  }

  draw() {
    this.ctx.globalAlpha = 1.0
    this.ctx.fillStyle = this.settings.backgroundColor
    this.ctx.fillRect(0, 0, this.c.width, this.c.height);

    // render specified entities (sometimes not all, for optimization)
    this.drawEntities()

    if (this.settings.grid.show) {
      this.drawGrid(this.settings.grid.size, this.settings.grid.size)
    }
    if (this.settings.axis.show) {
      this.drawAxis()
    }

    // draw text and stuff last so its on top
    this.ctx.globalAlpha = 1.0
    this.ctx.fillStyle = this.settings.entities.vectors.color
    this.ctx.lineWidth = 2
    this.ctx.font = '28px serif'
    this.ctx.textAlign = 'center'
    this.ctx.strokeStyle = 'white'
    this.ctx.strokeText("GAME CANVAS", this.c.width / 2, 30)
  }

  drawEntities() {
    
    // new draw method
    this.ctx.globalAlpha = 1.0

    for (let i = 0; i < this.entities.length; i++) {
      let entity = this.entities[i]
      
      if (entity.alpha === 0) {
        // invisible, don't draw
        continue
      }
      if (entity.alpha) {
        this.ctx.globalAlpha = entity.alpha
      } else {
        this.ctx.globalAlpha = this.settings.entities.defaultAlpha
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

      if (this.settings.entities.boxes.show) {
        this.ctx.beginPath()
        this.ctx.rect(parseInt(entity.x), parseInt(entity.y), entity.width, entity.height)
        this.ctx.strokeStyle = this.settings.entities.boxes.transformedColor
        this.ctx.globalAlpha = this.settings.entities.boxes.alpha
        this.ctx.lineWidth = this.settings.entities.boxes.lineWidth
        this.ctx.closePath()
        this.ctx.stroke()
      }

      if (entity.rotation) {
        this.ctx.translate(entity.x + entity.width / 2, (entity.y + (entity.height / 2)))
        this.ctx.rotate(-entity.rotation * Math.PI / 180)
        this.ctx.translate(-(entity.x + (entity.width / 2)), -(entity.y + (entity.height / 2)))
      }

      if (this.settings.entities.vectors.show) {
        this.ctx.lineWidth = 1
        this.ctx.globalAlpha = 1
        this.ctx.font = this.settings.entities.vectors.font
        this.ctx.strokeStyle = this.settings.entities.vectors.color
        this.ctx.strokeText(parseInt(entity.x) + "," + parseInt(entity.y), entity.x - 3, entity.y - 5)
      }

      if (this.settings.entities.boxes.show) {
        this.ctx.beginPath()
        this.ctx.rect(parseInt(entity.x), parseInt(entity.y), entity.width, entity.height)
        this.ctx.strokeStyle = this.settings.entities.boxes.color
        this.ctx.globalAlpha = this.settings.entities.boxes.alpha
        this.ctx.lineWidth = this.settings.entities.boxes.lineWidth
        this.ctx.closePath()
        this.ctx.stroke()
      }
    }
    this.ctx.globalAlpha = 1.0
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


