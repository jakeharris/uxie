var assert = require('assert'),
    Configuration = require('../src/configuration'),
    EventType = require('../src/event-type'),
    TriggerConflictError = require('../src/errors').TriggerConflictError

describe('Configuration', function () {
  context('constructor', function () {
    // sad paths
    it('throws a TypeError if a type other than an array or object is passed as the list of EventTypes', function () {
      assert.throws(function () {
        var c = new Configuration(4)
      })
    })
    it('throws a TypeError if an object or array whose properties contain no EventTypes is passed as the list of EventTypes', function () {
      assert.throws(function () {
        var c = new Configuration({a: ''})
      }, TypeError, 'Object notation failed.')
      assert.throws(function () {
        var c = new Configuration(['window'])
      }, TypeError, 'Array notation failed.')
    })
    it('throws a TriggerConflictError if any of the supplied EventTypes shares a trigger with any other', function () {
      assert.throws(function () {
        var c = new Configuration([
          new EventType('mouse', ['click', 'hover']),
          new EventType('touch', ['touch', 'hover'])
        ])
      }, TriggerConflictError)
    })
    it('throws a TypeError if a type other than a string is supplied for the url', function () {
      assert.throws(function () {
        var c = new Configuration([
          new EventType('mouse', ['click', 'hover']),
          new EventType('touch', ['touch'])
        ], 4)
      }, TypeError)
    })
    it('throws a TypeError if an invalid URL is supplied for the url'/*, function () {
      assert.throws(function () {
        var c = new Configuration([
          new EventType('mouse', ['click', 'hover']),
          new EventType('touch', ['touch'])
        ], 'htp:/4.4.')
      }, TypeError)
    }*/)
    
    // happy paths
    it('creates a Configuration object with reasonable defaults if no parameters are supplied', function () {
      var c = new Configuration()
      assert(c instanceof Configuration)
      assert('undefined' !== typeof(c.eventTypes))
      assert('object' === typeof(c.eventTypes))
      assert('string' === typeof(c.url))
    })
    it('creates a Configuration object when valid parameters are supplied', function () {
      assert.doesNotThrow(function () {
        var c = new Configuration([
          new EventType('mouse', ['click', 'hover']),
          new EventType('touch', ['touch'])
        ])
      }, 'EventTypes attempt failed.')
      assert.doesNotThrow(function () {
        var c = new Configuration([
          new EventType('mouse', ['click', 'hover']),
          new EventType('touch', ['touch'])
        ], 'http://google.com')
      })
    })
  })
})

