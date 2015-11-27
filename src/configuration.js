'using strict';
module.exports = Configuration

var EventType = require('./event-type'),
    Url = require('url'),
    TriggerConflictError = require('./errors').TriggerConflictError

function Configuration (types, url) {
  if(types && typeof(types) !== 'object') throw new TypeError('List of event types must be an array or object.')
  if(url && typeof(url) !== 'string') throw new TypeError('Server URL must be a string.')
  
  if(types === undefined)
    types = [
      new EventType('mouse', ['click', 'hover']),
      new EventType('touch', ['touch'])
    ]
  if(url === undefined)
    url = 'http://localhost'
  
  var checkForTypes = function (types) {
        var anyTypes = false
        for(var t in types)
           if(types[t] instanceof EventType)
             anyTypes = true
             
        if(!anyTypes) throw new TypeError('List of event types must contain at least one EventType.')
      },
      checkForTriggerConflicts = function (types) {
        var isTriggerConflict = false,
            triggers = []
        for(var t in types)
          if(types[t] instanceof EventType)
            for(var trigger in types[t].triggers)
              if(triggers.length === 0)
                triggers.push(types[t].triggers[trigger])
              else 
                for(var doneTrigger in triggers)
                  if(types[t].triggers[trigger] == triggers[doneTrigger])
                    
                    throw new TriggerConflictError('Some EventTypes have conflicting triggers. Trigger list: \n' + triggers.toString() + ',\n offending EventType: \n' + types[t].toString())
                  else
                    triggers.push(types[t].triggers[trigger])
                  
      }//,
//      validateURL = function (url) {
//        return new Url(url)
//      }
  
  checkForTypes(types)
  checkForTriggerConflicts(types)
//  validateURL(url)
  
  this.eventTypes = types
  this.url = url
  
}
