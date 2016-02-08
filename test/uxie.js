var assert = require('assert'),
    Uxie = require('../src/uxie'),
    EventFactoryFactory = require('../src/event-types/event-factory-factory'),
    TemporalEventFactory = require('../src/event-types/temporal-event-factory')

describe('Uxie', function () {
  context('constructor', function () {
    it('throws a TypeError if opts.typeMap is supplied, but is not an object', function () {
      var opts = { typeMap: 4 }
      assert.throws(function () {
        var uxie = new Uxie(opts)
      }, TypeError)
    })
    it('throws a TypeError if opts.typeMap is supplied, but is empty', function () {
      var opts = { typeMap: {} }
      assert.throws(function () {
        var uxie = new Uxie(opts)
      }, TypeError)
    })
    it('throws a TypeError if opts.typeMap is supplied, but a type name is empty', function () {
      var opts = { typeMap: { '': TemporalEventFactory } }
      assert.throws(function () {
        var uxie = new Uxie(opts)
      }, TypeError) 
    })
    it('throws a TypeError if opts.typeMap is supplied, but not all supplied types are functions', function () {
      var opts = { typeMap: { 'temporal': 4 } }
      assert.throws(function () {
        var uxie = new Uxie(opts)
      }, TypeError)
    })
    it('throws a SyntaxError if opts.typeMap is supplied and valid, but opts.triggerMap is not supplied', function () {
      var opts = { typeMap: EventFactoryFactory.DEFAULT_TYPE_MAP }
      assert.throws(function () {
        var uxie = new Uxie(opts)
      }, SyntaxError) 
    })
    it('throws a TypeError if opts.typeMap is supplied and valid, but opts.triggerMap is not an object', function () {
      var opts = { typeMap: EventFactoryFactory.DEFAULT_TYPE_MAP, triggerMap: 4 }
      assert.throws(function () {
        var uxie = new Uxie(opts)
      }, TypeError) 
    })
    it('throws a TypeError if opts.typeMap is supplied and valid, but opts.triggerMap is empty', function () {
      var opts = { typeMap: EventFactoryFactory.DEFAULT_TYPE_MAP, triggerMap: {} }
      assert.throws(function () {
        var uxie = new Uxie(opts)
      }, TypeError) 
    })
    it('throws a TypeError if opts.typeMap is supplied and valid, but at least one provided event trigger is invalid', function () {
      var opts = { typeMap: EventFactoryFactory.DEFAULT_TYPE_MAP, triggerMap: { 'temporal': ['wait', 'scroll', 'water'] } }
      assert.throws(function () {
        var uxie = new Uxie(opts)
      }, TypeError)  
    })
    it('succeeds if no parameters are supplied', function () {
      assert.doesNotThrow(function () {
        var uxie = new Uxie()
      })
      var uxie = new Uxie()
      assert(uxie instanceof Uxie)
    })
    it('succeeds if irrelevant parameters are supplied', function () {
      var opts = { 'moon': 'light' }
      assert.doesNotThrow(function () {
        var uxie = new Uxie(opts)
      })
      var uxie = new Uxie(opts)
      assert(uxie instanceof Uxie)
    })
    it('succeeds if valid parameters are supplied', function () {
      var opts = { typeMap: EventFactoryFactory.DEFAULT_TYPE_MAP, triggerMap: { 'temporal': ['wait', 'scroll']} }
      assert.doesNotThrow(function () {
        var uxie = new Uxie(opts)
      })
      var uxie = new Uxie(opts)
      assert(uxie instanceof Uxie)
    })
    it('creates an initial wait-type Event, if that is supported by the configuration', function () {
      var uxie = new Uxie()
      assert(uxie.currentEvent instanceof Event)
      assert(uxie.currentEvent.save === new TemporalEventFactory().save)
    })
  })
})