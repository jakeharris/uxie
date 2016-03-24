'using strict';
module.exports = Event

var ParameterCountError = require('../src/errors').ParameterCountError

function Event (type, record, save, uid) {
  if(type === undefined)
    throw new ParameterCountError('Events must have a type (string).')
  if(typeof type !== 'string')
    throw new TypeError('The event type must be a string. Received: ' + typeof type)
  if(record === undefined)
    throw new ParameterCountError('Events must have a record method with which they can begin recording relevant data.')
  if(typeof record !== 'function')
    throw new TypeError('The record parameter must be a function. Received: ' + typeof record)
  if(save === undefined)
    throw new ParameterCountError('Events must have a save method with which they can save their contents.')
  if(typeof save !== 'function')
    throw new TypeError('The save parameter must be a function. Received: ' + typeof save)
  if(uid !== undefined && typeof uid !== 'string')
    throw new TypeError('The user\'s id must be a string. Received: ' + typeof uid)
  this.type = type
  this.record = record
  this.save = save
  if(uid !== undefined) this.uid = uid
  else this.uid = null
}

