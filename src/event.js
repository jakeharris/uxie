'using strict';
module.exports = Event

var EventType = require('./event-type'),
    ParameterCountError = require('./errors').ParameterCountError,
    NotImplementedError = require('./errors').NotImplementedError

function Event (type) {
  if(type === undefined) throw new ParameterCountError()
  if(!(type instanceof EventType)) throw new TypeError()
  if(type.record === undefined || !(typeof(type.record) === 'function')) throw new NotImplementedError('Given EventType has no record() function to copy onto this Event.')
  if(type.save === undefined || !(typeof(type.save) === 'function')) throw new NotImplementedError('Given EventType has no save() function to copy onto this Event.')
  
  this.record = type.record
  this.save = type.save
}