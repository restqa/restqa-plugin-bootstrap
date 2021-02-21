const RestQData = require('@restqa/restqdata')

function Data (options) {
  options = Object.assign({
    startSymbol: '{{',
    endSymbol: '}}'
  }, options)

  const o = {
    start: `\\${options.startSymbol[0]}\\${options.startSymbol[1]}([^${'\\' + options.startSymbol[0]}`,
    end: `\\${options.endSymbol[0]}]+)\\${options.endSymbol[0]}\\${options.endSymbol[1]}`
  }

  const matchRegexp = new RegExp(`${o.start}${o.end}`) // Build a regex like : /\{\{([^\{\}]+)\}\}/ to match all the values with placeholders
  const dataRegex = /(.*).(\d).(.*)/

  const rData = RestQData(options)
  const data = {}

  function parse (scenario) {
    if (!options.channel) return
    let list = JSON.stringify(scenario, null, 2).match(new RegExp(matchRegexp, 'g')) || []
    list = list.map(getDataVariable)
      .filter(_ => _.match(dataRegex))
      .map(_ => _.replace(/.[^.]*$/, '')) // return an array like ['1.users']

    list = [...new Set(list)] // dedup array
    list = list.map(value => retrieve(value)) // retrieve data promises

    return Promise.all(list)
  }

  async function retrieve (value) {
    const [resource, row] = value.trim().split('.')
    const response = await rData.get(resource, row)

    Object.keys(response)
      .forEach(key => {
        set(`${value}.${key}`, response[key])
      })
  }

  function getDataVariable (variable) {
    return variable
      .replace(options.startSymbol, '')
      .replace(options.endSymbol, '')
      .trim()
  }

  function get (value) {
    if (typeof value !== 'string') return value
    const properties = value.match(new RegExp(matchRegexp.source, 'g'))
    if (!properties) return value

    return properties.reduce((value, item) => {
      return value.replace(item, data[getDataVariable(item)])
    }, value)
  }

  function set (property, value) {
    data[property] = value
  }

  function getFile (filename) {
    return rData.storage.get(filename)
  }

  return {
    parse,
    get,
    set,
    getFile
  }
}

module.exports = Data
