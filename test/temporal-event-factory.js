var assert = require('assert'),
    TemporalEventFactory = require('../src/event-types/temporal-event-factory'),
    EventFactory = require('../src/event-types/event-factory'),
    Event = require ('../src/event')

describe('TemporalEventsFactory', function () {
  context('constructor', function () {
    it('succeeds, since the constructor does nothing on its own', function () {
      var factory = new TemporalEventFactory()
      assert(factory instanceof TemporalEventFactory)
      assert(factory instanceof EventFactory)
    })
  })
  context('generate()', function () {
    it('returns an Event object with the appropriate event handlers (save and record)', function () {
      var factory = new TemporalEventFactory()
      var event = factory.generate('wait')
      assert(event instanceof Event)
      assert(event.record === factory.record)
      assert(event.save   === factory.save  )
    })
    it('returns an Event object with an appropriate user ID assigned to it')
  })
  context('record()', function () {
    it('throws an error if it is called, since this function is copied onto the Events this Factory generates', function () {
      var factory = new TemporalEventFactory()
      assert.throws(function () {
        factory.record()
      })
    })
  })
  context('save()', function () {
    it('throws an error if it is called, since this function is copied onto the Events this Factory generates', function () {
      var factory = new TemporalEventFactory()
      assert.throws(function () {
        factory.save()
      })
    })
  })
})