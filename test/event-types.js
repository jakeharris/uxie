var assert = require('assert'),
    EventType = require('../src/event-type'),
    ParameterCountError = require('../src/errors').ParameterCountError

describe('EventType', function () {
  context('constructor', function () {
    // sad paths
    it('throws a ParameterCountError if no name is supplied', function () {
      assert.throws(function () {
        var et = new EventType()
      }, ParameterCountError)
    })
    it('throws a TypeError if the name supplied is not a string', function () {
      assert.throws(function () {
        var et = new EventType(4)
      }, TypeError)
    })
    it('throws a ParameterCountError if no triggers are supplied', function () {
      assert.throws(function () {
        var et = new EventType('mouse')
      }, ParameterCountError)
    })
    it('throws a TypeError if the triggers parameter supplied contains no triggers', function () {
      assert.throws(function () {
        var et = new EventType('mouse', 4)
      }, TypeError)
    })
    
    // happy paths
    it('does not throw an error if valid parameters are supplied', function () {
      assert.doesNotThrow(function () {
        var et = new EventType('mouse', ['click', 'hover'])
      })
    })
  })
  context('record()', function () {
    it('is a function', function () {
      assert('function' === typeof(new EventType('mouse', ['click', 'hover']).record))
    })
    it('throws an Error if it is called', function () {
      assert.throws(function () {
        new EventType('mouse', ['click', 'hover']).record()
      })
    })
    // the above is all we can really check meaningfully. it's an arbitrary callback
  })
  context('save()', function () {
    it('is a function', function () {
      assert('function' === typeof(new EventType('mouse', ['click', 'hover']).save))
    })
    it('throws an Error if it is called', function () {
      assert.throws(function () {
        new EventType('mouse', ['click', 'hover']).save()
      })
    })
    // the above is all we can really check meaningfully. it's an arbitrary callback
  })
})