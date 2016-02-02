var assert = require('assert'),
    EventFactory = require('../src/event-types/event-factory'),
    NotImplementedError = require('../src/errors').NotImplementedError

describe('EventFactory', function () {
  context('constructor', function () {
    it('throws an error if the constructor is run, because it is abstract', function () {
      assert.throws(function () { new EventFactory() }, NotImplementedError)
    })
  })
})