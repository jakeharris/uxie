module.exports = Uxie

var EventFactoryFactory = require('./event-types/event-factory-factory'),
    EventFactory = require('./event-types/event-factory'),
    Event = require('./event'),
    ParameterCountError = require('./errors').ParameterCountError

var DEFAULT_TRIGGER_MAP = {
      'temporal': [
        'wait', 'scroll' 
      ],
      'physical': [
        'click', 'touch'
      ]
    }

function Uxie (opts) {
  'use strict';
  if(opts && opts.typeMap !== undefined) {
    // should only ever be run here. this function is just for keeping
    // things tidy, not really for code reuse.
    this.validateParameters(opts)

    this.factories = new EventFactoryFactory(opts.typeMap, opts.customTypes)
    this.triggerMap = opts.triggerMap
  }
  else {
    this.factories = new EventFactoryFactory()
    this.triggerMap = DEFAULT_TRIGGER_MAP
  }
    
  this.generateTriggerList()
  this.generateTriggerDictionary()
  this.factories.generate()
  
  if(this.triggerList.indexOf('wait') !== -1) {
    this.currentEvent = this.factories.getFactoryFor(this.getFactoryTypeFor('wait')).generate()
  }

  for(var t in this.triggerList) {
    var eventType = this.triggerList[t]
    this.addEventListener(eventType)
  }
}

Uxie.prototype = Object.create(Object.prototype)
Uxie.prototype.constructor = Uxie

// Ensures all relevant inputs are sound.
Uxie.prototype.validateParameters = function (opts) {
  if(typeof opts.typeMap !== 'object') 
      throw new TypeError('opts.typeMap must be a traditional JavaScript object. A value of type ' + typeof opts.typeMap + ' was supplied.')
  if(Object.keys(opts.typeMap).length === 0)
    throw new TypeError('opts.typeMap was empty. If you didn\'t intend to supply a custom typeMap, remove this. You don\'t need to supply a typeMap if you would just like to use the defaults.')
  for(var k in opts.typeMap) {
    if(k === undefined || k === '')
      throw new TypeError('Each type in the typeMap must have a colloquial name; otherwise it doesn\'t serve much purpose. :P') 
    if(typeof opts.typeMap[k] !== 'function')
      throw new TypeError('Each type in the typeMap must be a function that can construct Events. Entry with name "' + k + '" did not have a such a matching function.')
    if(!(opts.typeMap[k].prototype instanceof EventFactory))
      throw new TypeError('Each type in the typeMap must implement the EventFactory class. Entry with name "' + k + '" did not.')
  }
  if(opts.triggerMap === undefined)
    throw new SyntaxError('If a typeMap is supplied, you must also supply a triggerMap; there should be no case where editing only one was sufficient.')
  if(typeof opts.triggerMap !== 'object')
    throw new TypeError('opts.triggerMap must be a traditional JavaScript object. A value of type ' + typeof opts.triggerMap + ' was supplied.')
  if(Object.keys(opts.triggerMap).length === 0)
    throw new TypeError('opts.triggerMap was empty. Check out the Github if you need help writing a proper triggerMap.')

  if(typeof opts.customTypes === 'undefined')
    opts.customTypes = []
  for(var k in opts.typeMap)
    if(typeof opts.typeMap[k] === 'undefined' && !opts.customTypes.indexOf(opts.typeMap[k]) !== -1)
      throw new SyntaxError('opts.typeMap contains a mapping to a custom EventFactory type, but the constructor for that type wasn\'t supplied in opts.customTypes.\nInvalid type name: ' + k + ' (' + opts.typeMap[k] + ')')
}

// Grab the trigger type's corresponding EventFactory
Uxie.prototype.getFactoryFor = function (trigger) {
  for(var k in this.triggerMap)
    for(var v in this.triggerMap[k])
      if(this.triggerMap[k][v] === trigger)
        return this.factories.types[k]
  throw new Error('Couldn\'t find an EventFactory for the given trigger.\nGiven trigger: ' + trigger + '\nTrigger map: ' + this.triggerMap)
}

// Generates the list of configured triggers for convenience.
Uxie.prototype.generateTriggerList = function () {
  this.triggerList = []
  for(var k in this.triggerMap)
    for(var v in this.triggerMap[k]) 
      if(this.triggerList.indexOf(v) === -1)
        this.triggerList.push(this.triggerMap[k][v])
}

// Generates a dictionary mapping event types to their factory types for convenience.
Uxie.prototype.generateTriggerDictionary = function () {
  this.triggerDictionary = {}
  for(var k in this.triggerMap)
    for(var v in this.triggerMap[k])
      this.triggerDictionary[this.triggerMap[k][v]] = k
}

// Returns a string denoting the Factory that should handle this event type.
Uxie.prototype.getFactoryTypeFor = function (type) {
  if(type === undefined)
    throw new ParameterCountError('An event type (string) must be supplied.')
  if(typeof type !== 'string')
    throw new TypeError('The given type must be a string. Received: ' + typeof type + '.')
  if(this.triggerList.indexOf(type) === -1)
    throw new Error('No event type with that name exists. Received: ' + type + '.')
    
  return this.triggerDictionary[type]
}

// Add an event listener to the window object.
Uxie.prototype.addEventListener = function (eventType) {
  // we're gonna dummy the window object if it doesn't exist. otherwise
  // this isn't very helpful ;)
  if(window === undefined) 
    var window = { addEventListener: function (eventType, handler) {} }
  window.addEventListener(eventType, function (e) {
    this.currentEvent.save(e)
    this.submit(this.currentEvent)
    this.currentEvent = this.factories.getFactoryFor(this.getFactoryTypeFor(eventType)).generate()
    this.currentEvent.record(e)
  }.bind(this))
}

Uxie.prototype.submit = function (event) {
  if(event === undefined) 
    throw new ParameterCountError('Submission requires an Event.')
  if(!(event instanceof Event))
    throw new TypeError('Only submission of Events is allowed. Received: ' + event + ', which is not an instance of Event.')
    
  if(event.startTime !== undefined)
    console.log('Event runtime: ' + (event.endTime - event.startTime) + 'ms')
  else if (event.elementDown !== undefined)
    console.log('Event triggered on: \n' + event.elementDown + '\n and was released on: ' + event.elementUp)
}

Uxie.DEFAULT_TRIGGER_MAP = DEFAULT_TRIGGER_MAP