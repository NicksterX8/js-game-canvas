import GameCanvas from "./GameCanvas2.js"
import GameEntity from "./GameEntity.js"
import GameCanvasLayer from "./GameCanvasLayer.js"

export default class GameCanvasViewController {
  constructor(wrapper, layers, settings) {
    this.wrapper = wrapper
    this.settings = settings
    this.entities = []
    this.layers = this.createCanvasElements(layers)
    this.canvas = new GameCanvas(this.layers, settings)
    
    this.camera = {
      x: 0,
      y: 0,
      rotation: 10
    }

    this.scale = 1

    this.layers.event.setClickHandler(this.handleClick)
    window.addEventListener('resize', () => {
      this.resize()
    });
  }

  setScale(scale) {
    this.scale = scale / 10
    this.updateCanvasEntities()
  }

  createCanvasElements(layers) {
    
    let gameLayers = {}
    layers.forEach(layer => {
      // make element
      let canvas = document.createElement("canvas")
      canvas.id = "game-canvas-" + layer.key + "-layer"
      canvas.className = "game-canvas"
      canvas.width = this.width
      canvas.height = this.height
      this.wrapper.append(canvas)

      let options = layer.options

      const defaultOptions = {
        alpha: true,
        pixelated: true
      }
      if (!layer.options) {
        options = defaultOptions
      }

      gameLayers[layer.key] = new layer.layer(canvas, options, layer.settings)
    })

    return gameLayers
  }

  resize() {
    this.canvas.resize(window.innerWidth, window.innerHeight)
  }

  draw() {
    this.layers.background.draw()
    this.updateCanvasEntities()
    this.layers.extras.draw()
  }

  update() {
    this.updateCanvasEntities()
  }

  updateCanvasEntities(entities) {

    if (entities) {
      this.entities = entities
    }
    
    const canvasEntities = this.entities.map(entity => {

      let scaledWidth = entity.width * this.scale
      let scaledHeight = entity.height * this.scale

      let realPos = {
        // make position relative to the camera, then scale the result
        x: (entity.x - this.camera.x) * this.scale,
        y: (entity.y - this.camera.y) * this.scale
      }
      // convert from center coordinates to canvas coordinates (from top left corner)
      let canvasPos = this.getCanvasPos(realPos.x, realPos.y)

      // center position, so an entity at (0, 0) will be bisected by the axis,
      //  instead of having it's top left corner on the center of the canvas
      let centeredPos = {
        x: canvasPos.x - (scaledWidth / 2),
        y: canvasPos.y - (scaledHeight / 2)
      } 

      let pos = centeredPos

      let newEnt = {
        x: pos.x,
        y: pos.y,
        rotation: entity.rotation,

        sprite: entity.sprite,
        width: scaledWidth,
        height: scaledHeight,
        alpha: entity.alpha
      }

      return newEnt
    })

    this.canvas.update(canvasEntities)
    
  }

  handleClick(x, y) {
    console.log(x, y)
  }

  getCanvasPos(x, y) {
    // input position is a number distance from center, (0, 0) is the exact center of canvas, (width / 2, height / 2) is top left corner
    // basically like a mathematical graph 
    // the higher x is, the farther to the right the point is
    // the higher y is, the higher the point is

    // html5 canvases do this in a much different way, starts at the top left corner and y goes down
    // which is y is multiplied by -1
    return {
      x: this.canvas.width / 2 + x,
      y: this.canvas.height / 2 + (y * -1)

      /*
      y - this.getCenterY = y * -1 * this.settings.scale
      y * this.settings.scale = -y + this.getCenterY
      y = (-y + this.getCenterY) / this.settings.scale
      */
    }

    // 1: canvas.width
    // 0: canvas.width / 2
    // -1: 0
  }


}