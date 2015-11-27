'using strict';
module.exports = EventType

var ParameterCountError = require('./errors').ParameterCountError

function EventType(name, triggers) {
  if(name === undefined) throw new ParameterCountError('Name must be supplied.')
  if(typeof(name) !== 'string') throw new TypeError('Name must be a string.')
  if(triggers === undefined) throw new ParameterCountError('Trigger list must be supplied.')
  if(typeof(triggers) !== 'object') throw new TypeError('Trigger list must be an object or array.')
  
  this.name = name
  this.triggers = triggers
}

EventType.prototype.record = function () {
  if(this.constructor.name === 'EventType') {
    throw new Error('This method is only stored here; it should be copied to an Event object for actual use.') 
  }
  
  this.startTime = new Date().now
}
EventType.prototype.save = function () {
  if(this.constructor.name === 'EventType') {
    throw new Error('This method is only stored here; it should be copied to an Event object for actual use.') 
  }
  
  this.endTime = new Date().now
}