const Data = require('./data')

class World {
  constructor ({ attach, parameters }) {
    this.attach = attach
    this.parameters = parameters

    this.skipped = false
    this._config = {}
    this._data = this._data || null
    this.debug = this.debug || []
    this.setup()
  }

  setConfig (config) {
    this._config = config
    if (!this._data && config.data) {
      this._data = new Data(config.data)
    }
    if (config.secrets && this._data) {
      Object.keys(config.secrets).forEach(key => this._data.set(key, config.secrets[key]))
    }
  }

  getConfig () {
    return this._config
  }

  get data () {
    return this._data
  }

  setup () {
    // Needs to be overrided by the plugin
  }
}

module.exports = World
