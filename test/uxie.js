var assert = require('assert'),
    sinon = require('sinon'),
    Uxie = require('../src/uxie'),
    Event = require('../src/event'),
    EventFactoryFactory = require('../src/event-types/event-factory-factory'),
    TemporalEventFactory = require('../src/event-types/temporal-event-factory'),
    ParameterCountError = require('../src/errors').ParameterCountError

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
    it('throws a TypeError if opts.typeMap is supplied, but not all supplied types inherit EventFactory', function () {
      var typeMap = {}
      typeMap.temporal = EventFactoryFactory.DEFAULT_TYPE_MAP.temporal
      typeMap.physical = EventFactoryFactory.DEFAULT_TYPE_MAP.physical
      typeMap.test = function Barnacle () { }
      
      var opts = { typeMap: typeMap }
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
    it('creates no initial Event if the configuration doesn\'t define a wait-type Event', function () {
      var opts = { typeMap: EventFactoryFactory.DEFAULT_TYPE_MAP, triggerMap: { 'temporal': ['hover', 'scroll']} }
      var uxie = new Uxie(opts)
      assert(typeof uxie.currentEvent === 'undefined')
    })
    it('sets up event handlers for each default trigger', function () {
      var spy = sinon.spy()
      Uxie.prototype.addEventListener = spy
      
      var uxie = new Uxie()
      assert.equal(uxie.addEventListener.callCount, uxie.triggerList.length)
    })
  })
  context('getFactoryTypeFor()', function () {
    it('throws a ParameterCountError if no event type is supplied', function () {
      var uxie = new Uxie()
      assert.throws(function () {
        uxie.getFactoryTypeFor()
      }, ParameterCountError)
    })
    it('throws a TypeError if type is not a string', function () {
      var uxie = new Uxie()
      assert.throws(function () {
        uxie.getFactoryTypeFor(4)
      }, TypeError)
    })
    it('throws an Error if the given event type is not in the trigger map', function () {
      var uxie = new Uxie()
      assert.throws(function () {
        uxie.getFactoryTypeFor('senpai...')
      }, Error)
    })
    it('returns a string denoting the broader type of event the given event type belongs to', function () {
      var uxie = new Uxie()
      assert.doesNotThrow(function () {
        uxie.getFactoryTypeFor('wait')
      })
      assert.equal(uxie.getFactoryTypeFor('wait'), 'temporal')
    })
  })
  context('submit()', function () {
    it('throws a ParameterCountError if no event is supplied', function () {
      var uxie = new Uxie()
      
      assert.throws(function () {
        uxie.submit()
      }, ParameterCountError)
    })
    it('throws a TypeError if the supplied parameter is not an Event', function () {
      var uxie = new Uxie()
      
      assert.throws(function () {
        uxie.submit(4)
      })
    })
    it('prints the Event\'s contents to the console if it worked', function () {
      var stub = sinon.stub(console, 'log')
      
      var e = new TemporalEventFactory().generate()
      e.record()
      var uxie = new Uxie()
      e.save()
      uxie.submit(e)
      
      stub.restore()
      sinon.assert.calledOnce(stub)
    })
  })
})