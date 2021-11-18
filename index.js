import GameCanvasController from './GameCanvasController.js';
import GameCanvas from './GameCanvas.js'
import GameEntity from './GameEntity.js'
import SETTINGS from './settings.js'

import SettingsManager from './SettingsManager/main.js';
  (function() {
    // document images
    var imgs = {
      target: document.getElementById("target-img"),
      cookie: document.getElementById("cookie-img"),
      player: document.getElementById("player-img"),
    }
    
    const canvas = document.getElementById('main-canvas')
    let gameCanvasController = new GameCanvasController(canvas, layers, SETTINGS)
    let gameCanvas = gameCanvasController.canvas
    // gameCanvas.darkmode()
    
    /*
    let entities = [
      new GameEntity(200, 100, 200, 200, cookieImg),
      new GameEntity(0, 0, 100, 100, playerImg),
      new GameEntity(-50, canvas.height / 2, 100, 100, cookieImg),
      new GameEntity(-400, 400, 300, 300, targetImg),
      new GameEntity(400.4826, -421.63, 300, 300, targetImg),
    ]
    */

    let ents = [
      {
        x: 0,
        y: 0,
        width: 200,
        height: 200,
        sprite: imgs.target,
        rotation: 0
      },
      {
        x: 0,
        y: 0,
        width: 120,
        height: 120,
        sprite: imgs.target,
        rotation: 0
      },
      {
        x: 0,
        y: 0,
        width: 70,
        height: 70,
        sprite: imgs.target,
        rotation: 45
      },
      {
        x: 200,
        y: 200,
        width: 100,
        height: 100,
        sprite: imgs.target,
        rotation: 164
      },
      {
        x: 350,
        y: 200,
        width: 100,
        height: 100,
        sprite: imgs.cookie,
        rotation: 360
      },
      {
        x: -100,
        y: -200,
        width: 89.42,
        height: 30,
        sprite: imgs.player,
        rotation: 60
      }
    ]
    
    gameCanvasController.resize()

    gameCanvasController.updateCanvasEntities(ents)

    /*
    let updateButton = document.getElementById("update-button")
    updateButton.addEventListener("click", () => {
      entities[0].x += 5
      gameCanvas.draw()
    })
    */

    let settingsTabIsOpen = false

    let devSettingsToggle = document.getElementById("dev-settings-button")

    devSettingsToggle.addEventListener("click", () => {
      let settingsDiv = document.querySelector(".settings")
      if (settingsTabIsOpen) {
        settingsDiv.style.display = "none"
        devSettingsToggle.innerText = "Open Dev Settings"

        settingsTabIsOpen = false
      } else {
        settingsDiv.style.display = "flex"
        devSettingsToggle.innerText = "Close Dev Settings"

        settingsTabIsOpen = true
      }
      
    })

    let canvasSettingsManager = new SettingsManager(SETTINGS)
    canvasSettingsManager.newManager(
      document.querySelector('.settings-wrapper'),
      (olddata, key, newvalue, div, oldvalue) => {
        gameCanvas.draw()
      }
    )

    let controllerSettingsManager = new SettingsManager({ scale: gameCanvasController.scale })
    controllerSettingsManager.newManager(
      document.querySelector('#controller-settings-wrapper'),
      (olddata, key, newvalue, div, oldvalue) => {
        gameCanvasController.scale = newvalue
        gameCanvasController.updateCanvasEntities(ents)
      }
    )

    // infinite loop of rotating one degree at a time and re rendering
    function rotateEnt(i) {
      setTimeout(() => {
        ents[3].rotation = i
        gameCanvasController.updateCanvasEntities(ents)
        i++
        rotateEnt(i)
      }, 10)
    }
    rotateEnt(0)

  })();