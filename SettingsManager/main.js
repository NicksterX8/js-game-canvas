export default class SettingsManager {

  #onSettingChange

  constructor(data) {
    this.data = data
    this.#onSettingChange = () => {}
    this.divs = []
  }

  set(setting, key, value) {
    setting[key] = value
    this.divs.forEach(div => {
      div.querySelector(".settings-manager").remove()
      div.append(this.#manager())
      
    })
  }

  newManager(div, callback) {
    if (callback) {
      this.#onSettingChange = callback
    }
    div.append(this.#manager())
    this.divs.push(div)
  }

  #manager() {
    let div = document.createElement("div")
    div.className = "settings-manager"

    let settingsDiv = document.createElement("div")
    settingsDiv.className = "settings-list"

    let keys = Object.keys(this.data)
    keys.forEach(key => {
      settingsDiv.append(this.#setting(this.data, key))
    })

    div.append(settingsDiv)

    return div
  }

  #setting(data, key) {
    let div = document.createElement("div")
    div.className = "setting"
    div.id = "setting-for-" + key
    let label = document.createElement("label")
    label.innerText = this.#firstCapitalized(key)
    div.append(label)
    
    if (typeof data[key] == 'number' || typeof data[key] == 'string') {
      let input = document.createElement("input")
      div.append(input)
      div = this.#textSetting(data, key, div, typeof data[key])
    }
    else if (typeof data[key] == 'boolean') {
      let input = document.createElement("input")
      div.append(input)
      div = this.#booleanSetting(data, key, div)
    }
    else if (typeof data[key] === 'object') {
      let keys = Object.keys(data[key])
      label.innerText = this.#firstCapitalized(key) + ":"
      div.className = "setting setting-object"

      for (let i = 0; i < keys.length; i++) {
        if (keys[i] == "all" && typeof data[key][keys[i]] === "boolean") {
          let input = document.createElement("input")
          input.type = "checkbox"
          input.checked = data[key][keys[i]]
          input.className += "setting-object-toggle"
          input.addEventListener("change", () => {
            data[key][keys[i]] = input.checked
            if (input.checked) {
              div.querySelectorAll(".setting").forEach(setting => {
                this.#removeClass(setting, "disabled")
              })
              
            } else {
              div.querySelectorAll(".setting").forEach(setting => {
                setting.className += " disabled"
              })
            }
          })
          div.append(input)
          break
        }
      }

      for (let i = 0; i < keys.length; i++) {
        if (keys[i] !== "all" || typeof data[key][keys[i]] !== "boolean") {
          div.append(this.#setting(data[key], keys[i]))
        }
      }

    }
    else {
      console.error("data type is not supported", data, key, data[key])
    }

    return div
  }

  #getValueFromKeyPath(keypathArray) {
    let value = this.data
    keypathArray.forEach(key => {
      if (value === undefined || value === null) {
        console.error("key path value couldnt be found with", this.data, keypathArray)
      }
      value = value[key]
      
    })
    return value
  }

  // random utitlity functions

  #removeClass(div, className) {
    div.className = div.className.replace(className, "").replace("  ", " ")
  }

  #firstCapitalized(string) {
    return string.slice(0, 1).toUpperCase() + string.slice(1)
  }

  // setting types / views

  #textSetting(data, key, div, datatype) {
    div.className += " setting-input text-setting"
    let input = div.querySelector("input")
    if (datatype === "number") {
      input.type = "number"
      let step = parseInt(data[key] / 10)
      input.setAttribute("step", step)
    } else {
      input.type = "text"
    }
    input.value = data[key]

    let label = div.querySelector("label")
    label.innerText = this.#firstCapitalized(key) + ":"

    input.addEventListener("change", () => {
      // console.log(input.value)
      if (datatype === 'number') {
        let oldvalue = data[key]
        let newvalue = parseFloat(input.value)
        data[key] = newvalue
        input.type = 'number'
        this.#onSettingChange(data, key, newvalue, div, oldvalue)
      } else {
        data[key] = input.value
        this.#onSettingChange(data, key, input.value, div)
      }
      
    })

    return div
  }

  #booleanSetting(data, key, div, callback) {
    div.className += " setting-input boolean-setting"
    let input = div.querySelector("input")
    input.type = "checkbox"
    input.checked = data[key]

    let label = div.querySelector("label")
    label.innerText = this.#firstCapitalized(key) + "?"

    input.addEventListener("change", () => {
      let oldvalue
      if (input.checked === false) {
        oldvalue = true
        data[key] = false
      }
      else if (input.checked === true) {
        oldvalue = false
        data[key] = true
      }
      this.#onSettingChange(data, key, oldvalue, div)
      
    })

    return div
  }
}
