'using strict';
module.exports = EventTypeFactory

var ParameterCountError = require('../errors').ParameterCountError

// I'm sure this is confusing, but it was necessary for leaving this customizable.

// EventTypeFactories produce EventFactories. EventFactories produce Events.
// EventTypeFactories figure out what kind of EventFactories to produce based on
// config.json. If one does not exist, it will use defaults (DefaultEventTypesFactory).
// If you create a config.json, but would like to use the default handlers for certain kinds of
// events, read the README/check out the Github.

// You should need nothing here unless you are trying to create custom event handlers.

var DEFAULT_TYPE_MAP = {
  "default": [
    "click", "touch", "hover", "scroll", "wait"
  ]
}

function EventTypeFactory(typeMap, customTypes) {
  if(typeof typeMap === 'undefined')
    this.typeMap = DEFAULT_TYPE_MAP
  else 
    this.typeMap = typeMap
  
  validateTypeMap()
}

// Returns an array of all required EventFactories.
EventTypeFactory.prototype.generate = function () {
  for(var type in this.typeMap) {
    
  }
}

