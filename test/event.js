var assert = require('assert'),
    Event = require('../src/event'),
    EventType = require('../src/event-type')

describe('Event', function () {
  beforeEach(function () {
    var et = new EventType('mouse', ['click', 'touch'])
  })
  context('constructor', function () {
    // sad paths
    it('throws a ParameterCountError if no EventType is supplied', function () {
      assert.throws(function () {
        var e = new Event()
      }, ParameterCountError)
    })
    it('throws a TypeError if the event type supplied is not an EventType object', function () {
      assert.throws(function () {
        var e = new Event(4)
      }, TypeError)
    })
    it('throws a NotImplementedError if the supplied EventType has no record() function', function () {
      et.record = null
      assert.throws(function () {
        var e = new Event(et)
      }, NotImplementedError)
    })
    it('throws a NotImplementedError if the supplied EventType has no save() function', function () {
      delete et.save
      assert.throws(function () {
        var e = new Event(et)
      }, NotImplementedError)
    })
    
    // happy paths
    it('creates an Event if a valid EventType is supplied', function () {
      assert.doesNotThrow(function () {
        var e = new Event(et)
      })
    })
    it('generates a user id if a valid EventType is supplied')
    it('copies the record() function from the supplied EventType', function () {
      var e = new Event(et)
      assert(e.record  !== undefined, 'record() was undefined')
      assert(et.record === e.record)
    })
    it('copies the save() function from the supplied EventType', function () {
      var e = new Event(et)
      assert(e.save  !== undefined, 'save() was undefined')
      assert(et.save === e.save)
    })
  })
  context('record', function () {
    it('is a function', function () {
      assert('function' === typeof(new Event(et).record))
    })
  })
  context('save', function () {
    it('is a function', function () {
      assert('function' === typeof(new Event(et).save))
    })
  })
})