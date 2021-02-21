beforeEach(() => {
  jest.resetModules()
})

describe('# Data', () => {
  describe('constructors', () => {
    test('constructors using default options', () => {
      const RestQData = require('@restqa/restqdata')
      jest.mock('@restqa/restqdata')

      require('./data')()

      expect(RestQData.mock.calls.length).toBe(1)
      const expectedOptions = {
        startSymbol: '{{',
        endSymbol: '}}'
      }
      expect(RestQData.mock.calls[0][0]).toEqual(expectedOptions)
    })

    test('constructors with specify options', () => {
      const RestQData = require('@restqa/restqdata')
      jest.mock('@restqa/restqdata')

      const expectedOptions = {
        startSymbol: '[[',
        endSymbol: ']]'
      }
      require('./data')(expectedOptions)

      expect(RestQData.mock.calls.length).toBe(1)
      expect(RestQData.mock.calls[0][0]).toEqual(expectedOptions)
    })
  })

  describe('parse', () => {
    test('no channel on the options', () => {
      require('@restqa/restqdata')
      jest.mock('@restqa/restqdata')

      const Data = require('./data')()
      expect(Data.parse()).toBeUndefined()
    })

    test('Parse string without placeholder', async () => {
      const RestQData = require('@restqa/restqdata')
      jest.mock('@restqa/restqdata')
      const get = jest.fn()

      RestQData.mockReturnValue({
        get
      })

      const options = {
        channel: 'confluence',
        startSymbol: '[[',
        endSymbol: ']]'
      }

      const Data = await require('./data')(options)

      const scenario = `
        This is my string {{a.1.foo}} that contains {{ b.1.bar }}
        And a last value {{ c.1.here }}
      `

      Data.parse({ scenario })
      expect(get.mock.calls.length).toEqual(0)
    })

    test('Parse string in order to get all the placeholded values', async () => {
      const RestQData = require('@restqa/restqdata')
      jest.mock('@restqa/restqdata')
      const get = jest.fn()
        .mockResolvedValueOnce({ foo: 'foo-value' })
        .mockResolvedValueOnce({ bar: 'bar-value' })
        .mockResolvedValueOnce({ here: 'here-value' })

      RestQData.mockReturnValue({
        get
      })

      const options = {
        channel: 'confluence'
      }

      const Data = await require('./data')(options)

      const scenario = `
        This is my string {{a.1.foo}} that contains {{ b.1.bar }}
        And a last value {{ c.1.here }}
      `

      Data.parse({ scenario })
      expect(get.mock.calls.length).toEqual(3)
      expect(get.mock.calls[0]).toEqual(['a', '1'])
      expect(get.mock.calls[1]).toEqual(['b', '1'])
      expect(get.mock.calls[2]).toEqual(['c', '1'])
    })

    test('Parse string in order to get all the placeholded values (duplicated resource: reduce the calls)', async () => {
      const RestQData = require('@restqa/restqdata')
      jest.mock('@restqa/restqdata')
      const get = jest.fn()
        .mockResolvedValueOnce({
          here: 'here-value',
          bar: 'bar-value',
          foo: 'foo-value'
        })

      RestQData.mockReturnValue({
        get
      })

      const options = {
        channel: 'confluence'
      }

      const Data = await require('./data')(options)
      const scenario = `
        This is my string {{a.1.foo}} that contains {{ a.1.bar }}
        And a last value {{ a.1.here }}
      `

      Data.parse({ scenario })
      expect(get.mock.calls.length).toEqual(1)
      expect(get.mock.calls[0]).toEqual(['a', '1'])
    })
  })

  describe('getter/setter', () => {
    test('get - when the value is not a string', () => {
      require('@restqa/restqdata')
      jest.mock('@restqa/restqdata')

      const Data = require('./data')()
      const result = Data.get({})

      expect(result).toEqual({})
    })

    test('get - when the value is a string but not a placehoder', () => {
      require('@restqa/restqdata')
      jest.mock('@restqa/restqdata')

      const Data = require('./data')()
      const result = Data.get('foo')

      expect(result).toEqual('foo')
    })

    test('get - when the value is a  placehoder string', () => {
      require('@restqa/restqdata')
      jest.mock('@restqa/restqdata')

      const Data = require('./data')()
      Data.set('foo', 'bar')
      const result = Data.get('{{ foo }}')

      expect(result).toEqual('bar')
    })

    test('get - when the value has multiple  placehoder strings', () => {
      require('@restqa/restqdata')
      jest.mock('@restqa/restqdata')

      const Data = require('./data')()
      Data.set('foo', 'bar')
      Data.set('foo1', 'bar1')
      Data.set('foo2', 'bar2')
      const result = Data.get('this is the first one {{ foo }}, then seconde one {{ foo1 }} or the last one {{ foo2 }}')

      expect(result).toEqual('this is the first one bar, then seconde one bar1 or the last one bar2')
    })

    test('get - when the value is a  placehoder string - different symbole', () => {
      require('@restqa/restqdata')
      jest.mock('@restqa/restqdata')

      const Data = require('./data')()
      Data.set('foo', 'bar')
      const result = Data.get('[[ foo ]]')

      expect(result).toEqual('[[ foo ]]')
    })
  })

  describe('getFile', () => {
    test('get - when the value is not a string', () => {
      const RestQData = require('@restqa/restqdata')
      jest.mock('@restqa/restqdata')

      const storage = {
        get: jest.fn().mockReturnValue('/usr/src/my-file.png')
      }

      RestQData.mockReturnValue({
        storage
      })

      const Data = require('./data')()
      const result = Data.getFile('my-file.png')

      expect(result).toEqual('/usr/src/my-file.png')
      expect(storage.get.mock.calls.length).toBe(1)
      expect(storage.get.mock.calls[0][0]).toBe('my-file.png')
    })
  })
})
