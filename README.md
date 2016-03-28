![Travis-CI Build Status](https://travis-ci.org/javakat/uxie.svg?branch=master)
# uxie
A UX data collection sprite. [Original thoughts here.](https://gist.github.com/javakat/48b5e843e4d7a3a1d21d)

## Installation
At present, I don't have it hosted anywhere, so: clone this repository, `npm install`, make sure you've got Browserify (`npm install -g browserify`), and run `npm start` (or directly `browserify src/uxie.js -r ./src/uxie.js:Uxie -o dist/uxie.js`).

Now add the following to your HTML to get everything set up:
``` html
<html>
....
    <script src="uxie.js"></script>
    <script>
      var Uxie = require('Uxie')
      var ux = new Uxie()
    </script>
  </body>
</html>
```

And you're done!

## Configuration
There are two main things to configure about Uxie: your event submission method, and your event generation/handlers. If you do the above, everything will be taken care of for you; your Uxie object will automatically collect data about user activity on the page. However, because there is no official backend for this app yet, it defaults to posting this data (rather uselessly) to the console. So let's discuss that first.

You can configure everything in Uxie by submitting an `opts` parameter to the constructor, like so:
``` javascript
var Uxie = require('Uxie')
var ux = new Uxie({ /* good stuff goes here */})
```

### Event submission
Since it'd be handy to send our data back to a server for storage, you can configure a `submission` object that describes what Uxie should do with the data. The submission object is structured this way:
``` json
{
  "mode": "json",
  "url": "https://javakat.io"
}
```
Allowed values for `submission.mode`: `console`(default), `console-json`(prints JSON to console), `json`(submits JSON events to given URL).

Now, I don't currently support offbeat ports, or domains that don't support CORS. The URL property will be fed to the `open()` function on an [`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#open()), so be aware of that. I will support the former in the future for sure, but I needed to get done with this in time for [LD35](http://ludumdare.com/compo/)!

### Event configuration
This bit is a little more hands-on. 

Before anything, I advise creating a test suite for your forthcoming event. I use [mocha](https://mochajs.org), and it's super great. Give it a whirl! You can even look at my [EventFactory tests](https://github.com/javakat/uxie/blob/master/test/physical-event-factory.js) as examples.

Okay, with that out of the way, start by creating a seperate JS file that will define your event handlers and such. I use a factory pattern, so a name like `SpecificEventFactory` is best. Here's an example:
``` js
module.exports = SpecificEventFactory

// ParameterCountError is a custom Error class that is part of the Uxie project. Feel free to use it!
var ParameterCountError = require('../errors').ParameterCountError,
    EventFactory = require('./event-factory'),
    Event = require('../event')

// Factory for the creation of location-based Events (clicking, hovering, etc.)
function SpecificEventFactory() {
  'use strict';
}

SpecificEventFactory.prototype = Object.create(EventFactory.prototype)
SpecificEventFactory.prototype.constructor = SpecificEventFactory

// Begin recording data for this event
// Called when event is generated
SpecificEventFactory.prototype.record = function (e) {
  if(this.constructor.name === 'SpecificEventFactory') {
    throw new Error('This method is only stored here; it should be copied to an Event object for actual use.') 
  }
  
  /* Handle event beginning */
}

// Stop recording data for this event and clean up
// Called when event is over
SpecificEventFactory.prototype.save = function (e) {
  if(this.constructor.name === 'SpecificEventFactory') {
    throw new Error('This method is only stored here; it should be copied to an Event object for actual use.') 
  }
  
  /* Handle end of event */
}

SpecificEventFactory.prototype.generate = function (type, uid) {
  return new Event(type, this.record, this.save, uid)
}
```
You **MUST** require the `EventFactory` and `Event` classes. Your `SpecificEventFactory` class **MUST** inherit from `EventFactory` (lines 59-60, clarified on [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript)). This ensures that the Uxie engine can rely on certain methods and properties existing (yay, interfaces!).

Once you've created this class and defined its `save()` and `record()` functions, you need to give it to Uxie and tell it what event types it will handle. First, bundle it up with Browserify. You'll want to expose your `SpecificEventFactory` class, so run

WRONG WRONG WRONG
coming back to this stuff later

`browserify specific-event-factory.js -r ./src/specific-event-factory.js:SpecificEventFactory -o dist/specific-event-factory.js`

Then require it in your page:

``` html
<script src="specific-event-factory.js"></script>
<script src="uxie.js"></script>
<script>
  var SpecificEventFactory = require('SpecificEventFactory')
  var Uxie = require('Uxie')
  var ux = new Uxie({
    triggerMap: {
      'temporal': [
        'wait', 'scroll' 
      ],
      'physical': [
        'click', 'touch'
      ],
      'specific': [
        'hover' // whatever you want, man
      ]
    },
    typeMap: { 
      'temporal': TemporalEventFactory, 
      'physical': PhysicalEventFactory,
      'specific': SpecificEventFactory
    }
  })
</script>
```
