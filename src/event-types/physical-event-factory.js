module.exports = PhysicalEventFactory

var ParameterCountError = require('../errors').ParameterCountError,
    EventFactory = require('./event-factory'),
    Event = require('../event')

// Factory for the creation of location-based Events (clicking, hovering, etc.)
function PhysicalEventFactory() {
  'use strict';
}

PhysicalEventFactory.prototype = Object.create(EventFactory.prototype)
PhysicalEventFactory.prototype.constructor = PhysicalEventFactory

PhysicalEventFactory.prototype.record = function (e) {
  if(this.constructor.name === 'PhysicalEventFactory') {
    throw new Error('This method is only stored here; it should be copied to an Event object for actual use.') 
  }
  
  this.elementDown = e
}
PhysicalEventFactory.prototype.save = function (e) {
  if(this.constructor.name === 'PhysicalEventFactory') {
    throw new Error('This method is only stored here; it should be copied to an Event object for actual use.') 
  }
  
  this.elementUp = e
}
// TODO: add user id generation. perhaps to EventFactory prototype?
PhysicalEventFactory.prototype.generate = function (type) {
  console.log(this.record)
  return new Event(type, this.record, this.save)
}