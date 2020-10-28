beforeEach(() => {
  jest.resetModules()
})

test('constructors', () => {
  const Index = require('./index')
  expect(Object.keys(Index)).toEqual(['World', 'Data'])
})
