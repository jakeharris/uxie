'using strict';
module.exports = Uxie

var EventFactoryFactory = require('./event-types/event-factory-factory')

var TRIGGER_LIST = [ 'wait', 'scroll', 'click', 'touch', 'hover' ], // hover should ONLY be linked to very particular elements.
    DEFAULT_TRIGGER_MAP = {
      'temporal': [
        'wait', 'scroll' 
      ],
      'physical': [
        'click', 'touch', 'hover'
      ]
    }

function Uxie (opts) {
  if(opts.typeMap !== undefined) {
    if(typeof opts.typeMap !== 'object') 
      throw new TypeError('opts.typeMap must be a traditional JavaScript object. A value of type ' + typeof opts.typeMap + ' was supplied.')
    if(opts.typeMap === {})
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
    if(opts.triggerMap === {})
      throw new TypeError('opts.triggerMap was empty. Check out the Github if you need help writing a proper triggerMap.')
    for(k in opts.triggerMap)
      if(!TRIGGER_LIST.includes(opts.triggerMap[k]))
        throw new TypeError('opts.triggerMap contained a trigger name that we don\'t track.\nInvalid trigger name: ' + opts.triggerMap[k] + '\nList of valid trigger names: ' + TRIGGER_LIST)
      
    for(k in opts.typeMap)
      if(typeof opts.typeMap[k] === 'undefined' && !opts.customTypes.inclues(opts.typeMap[k]))
        throw new SyntaxError('opts.typeMap contains a mapping to a custom EventFactory type, but the constructor for that type wasn\'t supplied in opts.customTypes.\nInvalid type name: ' + k + ' (' + opts.typeMap[k] + ')')
        
    this.eff = new EventFactoryFactory(opts.typeMap, opts.customTypes)
    this.triggerMap = opts.triggerMap
  }
  else {
    this.eff = new EventFactoryFactory()
    this.triggerMap = DEFAULT_TRIGGER_MAP
  }
}

Uxie.prototype = Object.create(Object.prototype)
Uxie.prototype.constructor = Uxie