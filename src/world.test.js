beforeEach(() => {
  jest.resetModules()
})

describe('# world', () => {
  test('constructors', () => {
    const World = require('./world')

    const world = new World({ attach: 'attach', parameters: 'parameters' })

    expect(world.skipped).toBe(false)
    expect(world.attach).toEqual('attach')
    expect(world.parameters).toEqual('parameters')
    expect(world._config).toEqual({})
    expect(world._data).toBeNull()
  })

  test('setConfig without secret', () => {
    const Data = require('./data')
    jest.mock('./data')
    Data.mockReturnValue({
      set: jest.fn()
    })

    const World = require('./world')

    const world = new World({})
    world.setConfig({ foo: 'bar', data: {} })

    expect(world._config).toEqual({ foo: 'bar', data: {} })
    expect(world._data).not.toBeNull()
    expect(world._data.set.mock.calls).toHaveLength(0)
  })

  test('setConfig with secret', () => {
    const Data = require('./data')
    jest.mock('./data')
    Data.mockReturnValue({
      set: jest.fn()
    })

    const World = require('./world')

    const world = new World({})
    const config = {
      foo: 'bar',
      data: {},
      secrets: {
        so: 'blur'
      }
    }
    world.setConfig(config)

    expect(world.getConfig()).toEqual(config)
    expect(world.data).not.toBeNull()
    expect(world.data.set.mock.calls).toHaveLength(1)
    expect(world.data.set.mock.calls[0][0]).toBe('so')
    expect(world.data.set.mock.calls[0][1]).toBe('blur')
  })

  test('setConfig without default data or config data', () => {
    const Data = require('./data')
    jest.mock('./data')
    Data.mockReturnValue({
      set: jest.fn()
    })

    const World = require('./world')

    const world = new World({})
    const config = {
      foo: 'bar',
      secrets: {
        so: 'blur'
      }
    }
    world.setConfig(config)

    expect(world.getConfig()).toEqual(config)
    expect(world.data).toBeNull()
    expect(Data.mock.calls).toHaveLength(0)
  })
})
