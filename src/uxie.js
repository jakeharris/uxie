module.exports = Uxie

var EventFactoryFactory = require('./event-types/event-factory-factory'),
    EventFactory = require('./event-types/event-factory'),
    Event = require('./event'),
    ParameterCountError = require('./errors').ParameterCountError

var DEFAULT_TRIGGER_MAP = {
      'temporal': [
        'wait', 'scroll' 
      ],
      'physical': [
        'click', 'touch'
      ]
    }

function Uxie (opts) {
  'use strict';
  if(opts && opts.typeMap !== undefined) {
    // should only ever be run here. this function is just for keeping
    // things tidy, not really for code reuse.
    this.validateParameters(opts)

    this.factories = new EventFactoryFactory(opts.typeMap, opts.customTypes)
    this.triggerMap = opts.triggerMap
  }
  else {
    this.factories = new EventFactoryFactory()
    this.triggerMap = DEFAULT_TRIGGER_MAP
  }
  
  if(opts && opts.submission !== undefined)
    if(typeof opts.submission !== 'object')
      throw new TypeError('Submission configuration must be a formal object. Received: ' + typeof opts.submission)
    else 
      this.submission = opts.submission
  else
    this.submission = Uxie.DEFAULT_SUBMISSION_CONFIGURATION
  
  this.generateUID()
  this.generateTriggerList()
  this.generateTriggerDictionary()
  this.factories.generate()

  for(var t in this.triggerList) {
    var eventType = this.triggerList[t]
    this.addEventListener(eventType)
  }
  
  if(this.triggerList.indexOf('wait') !== -1) {
    this.waitInterval = 0 // just some integer so it exists
    this.waitLength = Uxie.DEFAULT_WAIT_LENGTH
  }
}

Uxie.prototype = Object.create(Object.prototype)
Uxie.prototype.constructor = Uxie

// Ensures all relevant inputs are sound.
Uxie.prototype.validateParameters = function (opts) {
  if(typeof opts.typeMap !== 'object') 
      throw new TypeError('opts.typeMap must be a traditional JavaScript object. A value of type ' + typeof opts.typeMap + ' was supplied.')
  if(Object.keys(opts.typeMap).length === 0)
    throw new TypeError('opts.typeMap was empty. If you didn\'t intend to supply a custom typeMap, remove this. You don\'t need to supply a typeMap if you would just like to use the defaults.')
  for(var k in opts.typeMap) {
    if(k === undefined || k === '')
      throw new TypeError('Each type in the typeMap must have a colloquial name; otherwise it doesn\'t serve much purpose. :P') 
    if(typeof opts.typeMap[k] !== 'function')
      throw new TypeError('Each type in the typeMap must be a function that can construct Events. Entry with name "' + k + '" did not have a such a matching function.')
    if(!(opts.typeMap[k].prototype instanceof EventFactory))
      throw new TypeError('Each type in the typeMap must implement the EventFactory class. Entry with name "' + k + '" did not.')
  }
  if(opts.triggerMap === undefined)
    throw new SyntaxError('If a typeMap is supplied, you must also supply a triggerMap; there should be no case where editing only one was sufficient.')
  if(typeof opts.triggerMap !== 'object')
    throw new TypeError('opts.triggerMap must be a traditional JavaScript object. A value of type ' + typeof opts.triggerMap + ' was supplied.')
  if(Object.keys(opts.triggerMap).length === 0)
    throw new TypeError('opts.triggerMap was empty. Check out the Github if you need help writing a proper triggerMap.')

  if(typeof opts.customTypes === 'undefined')
    opts.customTypes = []
  for(var k in opts.typeMap)
    if(typeof opts.typeMap[k] === 'undefined' && !opts.customTypes.indexOf(opts.typeMap[k]) !== -1)
      throw new SyntaxError('opts.typeMap contains a mapping to a custom EventFactory type, but the constructor for that type wasn\'t supplied in opts.customTypes.\nInvalid type name: ' + k + ' (' + opts.typeMap[k] + ')')
}

// Grab the trigger type's corresponding EventFactory
Uxie.prototype.getFactoryFor = function (trigger) {
  for(var k in this.triggerMap)
    for(var v in this.triggerMap[k])
      if(this.triggerMap[k][v] === trigger)
        return this.factories.types[k]
  throw new Error('Couldn\'t find an EventFactory for the given trigger.\nGiven trigger: ' + trigger + '\nTrigger map: ' + this.triggerMap)
}

// Generates the list of configured triggers for convenience.
Uxie.prototype.generateTriggerList = function () {
  this.triggerList = []
  for(var k in this.triggerMap)
    for(var v in this.triggerMap[k]) 
      if(this.triggerList.indexOf(v) === -1)
        this.triggerList.push(this.triggerMap[k][v])
}

// Generates a dictionary mapping event types to their factory types for convenience.
Uxie.prototype.generateTriggerDictionary = function () {
  this.triggerDictionary = {}
  for(var k in this.triggerMap)
    for(var v in this.triggerMap[k])
      this.triggerDictionary[this.triggerMap[k][v]] = k
}

// Returns a string denoting the Factory that should handle this event type.
Uxie.prototype.getFactoryTypeFor = function (type) {
  if(type === undefined)
    throw new ParameterCountError('An event type (string) must be supplied.')
  if(typeof type !== 'string')
    throw new TypeError('The given type must be a string. Received: ' + typeof type + '.')
  if(this.triggerList.indexOf(type) === -1)
    throw new Error('No event type with that name exists. Received: ' + type + '.')
    
  return this.triggerDictionary[type]
}

// Add an event listener to the window object.
Uxie.prototype.addEventListener = function (eventType, handler) {
  // we're gonna assume the window object exists. otherwise
  // this isn't very helpful ;)
  
  // because of this, this would be a good place for abstraction --
  // if I/people think this tool could be useful for other things,
  // we can allow an option to determine what global stuff we're using,
  // if any, instead of the window object (event handler abstraction)
  
  // similarly, this is a good place to think about establishing
  // an abstraction for *triggering* events, since they
  // may not always be in-browser events, and they may be custom
  // events in whatever environment they're run in...etc.

  if(handler === undefined)
    window.addEventListener(eventType, Uxie.DEFAULT_EVENT_LISTENER.bind(this, eventType))
  else
    window.addEventListener(eventType, handler.bind(this))
}

// Submit an event to the console/database/whatever.
// Needs more flexibility.
Uxie.prototype.submit = function (event) {
  if(event === undefined) 
    throw new ParameterCountError('Submission requires an Event.')
  if(!(event instanceof Event))
    throw new TypeError('Only submission of Events is allowed. Received: ' + event + ', which is not an instance of Event.')
    
  switch(this.submission.mode) {
    case 'console':
      if(event.startTime !== undefined)
        console.log('Event (' + event.type + ') runtime: ' + (event.endTime - event.startTime) + 'ms')
      else if (event.elementDown !== undefined) {
        console.log('Event (' + event.type + ') triggered on: \n')
        console.log(event.elementDown)
      }
      break;
    case 'json-console':
      console.log(JSON.stringify(event))
      break;
    case 'json':
      var json = JSON.stringify(event),
          xhr = new XMLHttpRequest()
      
      xhr.open('post', this.submission.url, true)
      
      xhr.setRequestHeader("content-type", "application/json")
      xhr.setRequestHeader("content-length", json.length)
      xhr.setRequestHeader("connection", "close")

      xhr.timeout = 2000
      
      xhr.send()
  }
  
}

// Generate a user id for the session.
// Used for building user stories in other tools.
Uxie.prototype.generateUID = function () {
  var canCookie = ((typeof document !== 'undefined') && (typeof document.cookie !== 'undefined'))
  
  // if we have access to cookies, read the UID cookie, if one exists.
  // if one doesn't exist, generate one and save it in a cookie.
  if(canCookie) {
    var cookie = document.cookie.replace(/(?:(?:^|.*;\s*)uid\s*\=\s*([^;]*).*$)|^.*$/, '$1')
    if(cookie.length > 0)
      this.uid = cookie
    else this.uid = Math.random().toString(36).slice(2)
  }
  // if we don't have access to cookies, our user stories won't work
  // very well, but we'll assume you have some other method of taking
  // care of business.
  else {
    this.uid = Math.random().toString(36).slice(2)
  }
}

Uxie.DEFAULT_TRIGGER_MAP = DEFAULT_TRIGGER_MAP
Uxie.DEFAULT_SUBMISSION_CONFIGURATION = {
  'mode':'console'
}
Uxie.SUPPORTED_SUBMISSION_MODES = [ 'console', 'json-console', 'json']
Uxie.DEFAULT_EVENT_LISTENER = function (eventType, e) {
  clearTimeout(this.waitInterval)
  if(this.currentEvent !== undefined) {
    this.currentEvent.save(e)
    this.submit(this.currentEvent)
  }
  this.currentEvent = this.factories.getFactoryFor(this.getFactoryTypeFor(eventType)).generate(eventType, this.uid)
  this.currentEvent.record(e)
  if(eventType !== 'wait') {
    this.waitInterval = setTimeout(function () {
      var we = this.factories.getFactoryFor(this.getFactoryTypeFor('wait')).generate('wait', this.uid)
      window.dispatchEvent(new CustomEvent('wait', { detail: we }))
    }.bind(this), Uxie.DEFAULT_WAIT_LENGTH)
  }
}
Uxie.DEFAULT_WAIT_LENGTH = 50 // in ms (30ms was too small, as sometimes this elapses between scroll events on a rapid scroll)