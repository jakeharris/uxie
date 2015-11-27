'using strict';

function ParameterCountError(msg) {
  // The wrong number of parameters was supplied
  // to a function.
  Error.captureStackTrace(this, this.constructor)
  this.name = 'ParameterCountError'
  this.message = msg
}
function NotImplementedError(msg) {
  // The function wasn't complete, or an
  // interface method should have been overridden
  // that was not.
  Error.captureStackTrace(this, this.constructor)
  this.name = 'NotImplementedError'
  this.message = msg
}
function TriggerConflictError(msg) {
  // The function wasn't complete, or an
  // interface method should have been overridden
  // that was not.
  Error.captureStackTrace(this, this.constructor)
  this.name = 'TriggerConflictError'
  this.message = msg
}

ParameterCountError.prototype = Object.create(Error.prototype)
ParameterCountError.prototype.constructor = ParameterCountError

NotImplementedError.prototype = Object.create(Error.prototype)
NotImplementedError.prototype.constructor = NotImplementedError

TriggerConflictError.prototype = Object.create(Error.prototype)
TriggerConflictError.prototype.constructor = TriggerConflictError

module.exports.ParameterCountError = ParameterCountError
module.exports.NotImplementedError = NotImplementedError
module.exports.TriggerConflictError = TriggerConflictError