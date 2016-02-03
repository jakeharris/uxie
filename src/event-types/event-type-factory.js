'using strict';
module.exports = EventTypeFactory

var ParameterCountError = require('../errors').ParameterCountError,
    DefaultEventTypesFactory = require('./default-event-types-factory')

// I'm sure this is confusing, but it was necessary for leaving this customizable.

// EventTypeFactories produce EventFactories. EventFactories produce Events.
// EventTypeFactories figure out what kind of EventFactories to produce based on
// config.json. If one does not exist, it will use defaults (DefaultEventTypesFactory).
// If you create a config.json, but would like to use the default handlers for certain kinds of
// events, read the README/check out the Github.

// You should need nothing here unless you are trying to create custom event handlers.

var DEFAULT_TYPE_LIST = [ 'temporal', 'physical' ]

function EventTypeFactory (typeList, customTypes) {
  if(typeof typeList === 'undefined')
    this.typeList = DEFAULT_TYPE_LIST
  else if (typeof customTypes === 'undefined') 
    throw new ParameterCountError('Because a custom type map is supplied, you must also supply an array containing constructors for your custom types.')
  else if (typeof typeMap !== 'object')
    throw new TypeError('The type map must be a traditional Javascript object.')
  else
    this.typeList = typeList
}

EventTypeFactory.prototype = Object.create(Object.prototype)
EventTypeFactory.prototype.constructor = EventTypeFactory

// Returns an array of all required EventFactories.
EventTypeFactory.prototype.generate = function () {
  var factories = []
  if(this.typeList === DEFAULT_TYPE_LIST)
    factories = [ new DefaultEventTypesFactory() ]
    
  this.types = factories
  return this.types
}