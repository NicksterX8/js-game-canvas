import GameCanvasLayer from '../GameCanvasLayer.js'

export default class EntityLayer extends GameCanvasLayer {
  constructor(canvasElement, options, settings) {
    super(canvasElement, options, settings)

    this.clickHandler = undefined
  }

  setClickHandler(clickHandler) {
    this.clickHandler = clickHandler
    this.c.addEventListener("click", (e) => {
      // e is the event
      // get x and y position using e.clientX/Y
      // to get position relative to canvas subtract from the coordinates the distance from the top and left the canvas is 
      let canvasPosition = this.c.getBoundingClientRect()
      let mouseX = e.clientX - canvasPosition.left
      let mouseY = e.clientY - canvasPosition.top

      this.handleClick(mouseX, mouseY)
    })
  }

  handleClick(x, y) {
    this.clickHandler(x, y)
  }

  draw() {

  }

  update(data) {
    
  }
}