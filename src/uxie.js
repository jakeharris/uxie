'using strict';
module.exports = Uxie

var EventFactoryFactory = require('./event-types/event-factory-factory'),
    Event = require('./event')

var DEFAULT_TRIGGER_MAP = {
      'temporal': [
        'wait', 'scroll' 
      ],
      'physical': [
        'click', 'touch', 'hover'
      ]
    }

function Uxie (opts) {
  if(opts && opts.typeMap !== undefined) {
    // should only ever be run here. this function is just for keeping
    // things tidy, not really for code reuse.
    this.validateParameters(opts)

    this.factories = new EventFactoryFactory(opts.typeMap, opts.customTypes)
    this.triggerMap = opts.triggerMap
    this.generateTriggerList()
  }
  else {
    this.factories = new EventFactoryFactory()
    this.triggerMap = DEFAULT_TRIGGER_MAP
    this.generateTriggerList()
  }
  
  this.factories.generate()
  
  if(this.triggerList.indexOf('wait') !== -1) {
    this.currentEvent = this.getFactoryFor('wait').generate()
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
  for(k in opts.typeMap) {
    if(k === undefined || k === '')
      throw new TypeError('Each type in the typeMap must have a colloquial name; otherwise it doesn\'t serve much purpose. :P') 
    if(typeof opts.typeMap[k] !== 'function')
      throw new TypeError('Each type in the typeMap must be a function that can construct Events. Entry with name "' + k + '" did not have a such a matching function.')
  }
  if(opts.triggerMap === undefined)
    throw new SyntaxError('If a typeMap is supplied, you must also supply a triggerMap; there should be no case where editing only one was sufficient.')
  if(typeof opts.triggerMap !== 'object')
    throw new TypeError('opts.triggerMap must be a traditional JavaScript object. A value of type ' + typeof opts.triggerMap + ' was supplied.')
  if(Object.keys(opts.triggerMap).length === 0)
    throw new TypeError('opts.triggerMap was empty. Check out the Github if you need help writing a proper triggerMap.')

  if(typeof opts.customTypes === 'undefined')
    opts.customTypes = []
  for(k in opts.typeMap)
    if(typeof opts.typeMap[k] === 'undefined' && !opts.customTypes.indexOf(opts.typeMap[k]) !== -1)
      throw new SyntaxError('opts.typeMap contains a mapping to a custom EventFactory type, but the constructor for that type wasn\'t supplied in opts.customTypes.\nInvalid type name: ' + k + ' (' + opts.typeMap[k] + ')')
}

// Grab the trigger type's corresponding EventFactory
Uxie.prototype.getFactoryFor = function (trigger) {
  for(k in this.triggerMap)
    for(v in this.triggerMap[k])
      if(this.triggerMap[k][v] === trigger)
        return this.factories.types[k]
  throw new Error('Couldn\'t find an EventFactory for the given trigger.\nGiven trigger: ' + trigger + '\nTrigger map: ' + this.triggerMap)
}

// Generates the list of configured triggers for convenience.
Uxie.prototype.generateTriggerList = function () {
  this.triggerList = []
  for(k in this.triggerMap)
    for(v in this.triggerMap[k]) 
      if(this.triggerList.indexOf(v) === -1)
        this.triggerList.push(this.triggerMap[k][v])
}

Uxie.DEFAULT_TRIGGER_MAP = DEFAULT_TRIGGER_MAP