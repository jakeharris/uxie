'using strict';
module.exports = EventFactoryFactory

var ParameterCountError = require('../errors').ParameterCountError,
    TemporalEventFactory = require('./temporal-event-factory'),
    PhysicalEventFactory = require('./physical-event-factory')

// I'm sure this is confusing, but it was necessary for leaving this customizable.

// EventFactoryFactories produce EventFactories. EventFactories produce Events.
// EventFactoryFactories figure out what kind of EventFactories to produce based on
// config.json. If one does not exist, it will use defaults (DefaultEventTypesFactory).
// If you create a config.json, but would like to use the default handlers for certain kinds of
// events, read the README/check out the Github.

// You should need nothing here unless you are trying to create custom event handlers.


// A Factory for EventFactories! That's not confusing!
function EventFactoryFactory (typeMap, customTypes) {
  if(typeof typeMap === 'undefined')
    this.typeMap = EventFactoryFactory.DEFAULT_TYPE_MAP
  else if (typeof customTypes === 'undefined') 
    throw new ParameterCountError('Because a custom type map is supplied, you must also supply an array containing constructors for your custom types.')
  else if (typeof typeMap !== 'object')
    throw new TypeError('The type map must be a traditional Javascript object.')
  else
    this.typeMap = typeMap
}

EventFactoryFactory.prototype = Object.create(Object.prototype)
EventFactoryFactory.prototype.constructor = EventFactoryFactory

// Returns an array of all required EventFactories.
EventFactoryFactory.prototype.generate = function () {
  var factories = {}
  
  for(var k in this.typeMap)
    factories[k] = new this.typeMap[k]()
  
  this.types = factories
  return this.types
}
EventFactoryFactory.DEFAULT_TYPE_MAP = { 'temporal': TemporalEventFactory, 'physical': PhysicalEventFactory }