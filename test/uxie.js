var assert = require('assert'),
    ParameterCountError = require('../src/errors').ParameterCountError,
    Configuration = require('../src/configuration'),
    EventType = require('../src/event-type'),
    Event = require('../src/event'),
    Uxie = require('../src/uxie')

describe('Uxie', function () {
  context('constructor', function () {
    it('throws a ParameterCountError if no Configuration is supplied', function () {
      assert.throws(function () {
        var uxie = new Uxie()
      }, ParameterCountError)
    })
    it('throws a TypeError if anything but a Configuration object is supplied', function () {
      assert.throws(function () {
        var uxie = new Uxie(4)
      }, TypeError)
    })
    before(function () {
      var c = new Configuration()
    })
    it('creates an Uxie object if a valid Configuration object is supplied', function () {
      assert.doesNotThrow(function () {
        var uxie = new Uxie(c)
      })
      var uxie = new Uxie(c)
      assert(uxie.event !== undefined, 'Initial event was not created on construction.')
    })
  })
  context('')
})