module.exports = TemporalEventFactory

var ParameterCountError = require('../errors').ParameterCountError,
    EventFactory = require('./event-factory'),
    Event = require('../event')

// Factory for the creation of time-based Events (waiting, etc.)
function TemporalEventFactory() {
  'use strict';
}

TemporalEventFactory.prototype = Object.create(EventFactory.prototype)
TemporalEventFactory.prototype.constructor = TemporalEventFactory

TemporalEventFactory.prototype.record = function () {
  if(this.constructor.name === 'TemporalEventFactory') {
    throw new Error('This method is only stored here; it should be copied to an Event object for actual use.') 
  }
  this.startTime = new Date().getTime()
}
TemporalEventFactory.prototype.save = function () {
  if(this.constructor.name === 'TemporalEventFactory') {
    throw new Error('This method is only stored here; it should be copied to an Event object for actual use.') 
  }
  
  this.endTime = new Date().getTime()
}
// TODO: add user id generation. perhaps to EventFactory prototype?
TemporalEventFactory.prototype.generate = function (type) {
  var event = new Event()
  event.type = type
  event.save = this.save
  event.record = this.record
  return event
}