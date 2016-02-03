var assert = require('assert'),
    PhysicalEventFactory = require('../src/event-types/physical-event-factory'),
    EventFactory = require('../src/event-types/event-factory'),
    Event = require ('../src/event')

describe('PhysicalEventFactory', function () {
  context('constructor', function () {
    it('succeeds, since the constructor does nothing on its own', function () {
      var factory = new PhysicalEventFactory()
      assert(factory instanceof PhysicalEventFactory)
      assert(factory instanceof EventFactory)
    })
  })
  context('generate()', function () {
    it('returns an Event object with the appropriate event handlers (save and record)', function () {
      var factory = new PhysicalEventFactory()
      var event = factory.generate()
      assert(event instanceof Event)
      assert(event.record === factory.record)
      assert(event.save   === factory.save  )
    })
    it('returns an Event object with an appropriate user ID assigned to it')
  })
  context('record()', function () {
    it('throws an error if it is called, since this function is copied onto the Events this Factory generates', function () {
      var factory = new PhysicalEventFactory()
      assert.throws(function () {
        factory.record()
      })
    })
  })
  context('save()', function () {
    it('throws an error if it is called, since this function is copied onto the Events this Factory generates', function () {
      var factory = new PhysicalEventFactory()
      assert.throws(function () {
        factory.save()
      })
    })
  })
})