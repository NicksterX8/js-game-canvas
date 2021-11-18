import GameCanvasLayer from "./GameCanvasLayer.js"
import GameEntity from "./GameEntity.js"

export default class GameCanvas {
  constructor(layers, settings) {
    this.layers = layers
    this.entities = []

    this.settings = settings

    this.width = 500
    this.height = 500

    // REMOVE THIS LATER!
    window.addEventListener('resize', () => {
      this.resize(window.innerWidth, window.innerHeight)
    });

    this.entities = []

    this.update(this.entities)
    this.resize(window.innerWidth, window.innerHeight)
    this.draw()
  }

  handleClick(x, y) {
    console.log(x, y)
  }

  resize(width, height) {
    this.width = width
    this.height = height
    for (let i = 0; i < Object.keys(this.layers).length; i++) {
      this.layers[Object.keys(this.layers)[i]].resize(width, height)
    }
  }

  redraw() {
    for (let i = 0; i < Object.keys(this.layers).length; i++) {
      this.layers[Object.keys(this.layers)[i]].draw()
    }
  }

  draw() {
    this.redraw()
  }

  update(entities) {
    this.entities = entities
    this.layers.entity.update(this.entities)
    console.log("updated", new Date().getTime() % 100000)
  }

  handleClick(x, y) {
    console.log(x, y)
  }
}

const LAYERS = {
  event: 10,
  extras: 8,
  entities: 6,
  background: 0
}