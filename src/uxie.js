'using strict';
module.exports = Uxie

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
    if(opts.triggerMap === undefined || opts.triggerMap === {})
  }
  
}

Uxie.prototype = Object.create(Object.prototype)
Uxie.prototype.constructor = Uxie