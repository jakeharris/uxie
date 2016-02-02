'using strict';
module.exports = EventFactory

var ParameterCountError = require('../errors').ParameterCountError,
    NotImplementedError = require('../errors').NotImplementedError

function EventFactory(name, triggers) {
  throw new NotImplementedError('This class is abstract by design. Extend this class (via proper use of prototypes -- see the DefaultEventTypesFactory for an example) if you want things to work out.')
}

EventFactory.prototype.record = function () {
  throw new NotImplementedError('This class is abstract by design. Extend this class (via proper use of prototypes -- see the DefaultEventTypesFactory for an example) if you want things to work out.')
}
EventFactory.prototype.save = function () {
  throw new NotImplementedError('This class is abstract by design. Extend this class (via proper use of prototypes -- see the DefaultEventTypesFactory for an example) if you want things to work out.')
}
