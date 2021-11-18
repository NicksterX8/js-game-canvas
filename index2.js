import SETTINGS from './settings.js'
import SettingsManager from './SettingsManager/main.js'
import EntityLayer from './layers/EntityLayer.js'
import BackgroundLayer from './layers/BackgroundLayer.js'
import EventLayer from './layers/EventLayer.js'
import GameCanvasViewController from './GameCanvasViewController.js'
import ExtrasLayer from './layers/ExtrasLayer.js'

(function() {

  // get dom elements
  var canvasWrapper = document.getElementById("canvas-wrapper")
  var imgs = {
    target: document.getElementById("target-img"),
    cookie: document.getElementById("cookie-img"),
    player: document.getElementById("player-img"),
  }

  const layers = [
    {
      key: "background",
      layer: BackgroundLayer,
      options: { alpha: false, pixelated: false },
      settings: SETTINGS.background
    },
    {
      key: "entity",
      layer: EntityLayer,
      settings: SETTINGS.entities
    },
    {
      key: "extras",
      layer: ExtrasLayer,
      settings: {
        grid: SETTINGS.grid,
        axis: SETTINGS.axis,
        
      }
    },
    {
      key: "event",
      layer: EventLayer,
    },
  ]

  let viewController = new GameCanvasViewController(canvasWrapper, layers, SETTINGS)
  let entities = [
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

  function addDemoEnts(number) {
    for (let i = 0; i < number; i++) {
      entities.push({
        x: ((viewController.canvas.width) * Math.random()) - viewController.canvas.width / 2,
        y: (viewController.canvas.height * Math.random()) - viewController.canvas.height / 2,
        width: 80 * (Math.random() + 0.75),
        height: 80 *(Math.random() + 0.75),
        sprite: imgs.cookie,
        rotation: 360 * Math.random()
      })
    }
  }
  entities = []
  addDemoEnts(200)
  
  viewController.updateCanvasEntities(entities)

  let settingsTabIsOpen = false

  let devSettingsToggle = document.getElementById("dev-settings-button")

  devSettingsToggle.addEventListener("click", () => {
    let settingsDiv = document.querySelector(".settings")
    if (settingsTabIsOpen) {
      settingsDiv.style.display = "none"
      devSettingsToggle.innerText = "Open Settings"

      settingsTabIsOpen = false
    } else {
      settingsDiv.style.display = "flex"
      devSettingsToggle.innerText = "Close Settings"

      settingsTabIsOpen = true
    }
  })

  let canvasSettingsManager = new SettingsManager(SETTINGS)
  canvasSettingsManager.newManager(
    document.querySelector('.settings-wrapper'),
    (olddata, key, newvalue, div, oldvalue) => {
      viewController.setScale(SETTINGS.scale)
      viewController.draw()
    }
  )

  // infinite loop of rotating one degree at a time and re rendering
  function loopEnts(callback, time) {
    loop()
    function loop() {
      setTimeout(() => {
        entities.forEach(entity => {
          callback(entity)
        })
        viewController.updateCanvasEntities(entities)
        loop()
      }, time)
    }
    
  }

  // increase all entities' rotation by speed every delay miliseconds
  function rotateAll(delay, speed) {
    loopEnts((entity) => {
      entity.rotation += 2
    }, delay)
  }
  
  // move all entities by x every delay miliseconds
  function moveAll(delay, x) {
    loopEnts((entity) => {
      entity.x += x
      if (entity.x > (viewController.canvas.width / 2) + entity.width) {
        entity.x = (viewController.canvas.width / -2) - entity.width
      }
    }, delay)
  }

  moveAll(25, 4)
  rotateAll(25)

  
})()





