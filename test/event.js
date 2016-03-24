var assert = require('assert'),
    Event = require('../src/event'),
    ParameterCountError = require('../src/errors').ParameterCountError

describe('Event', function () {
  it('throws a ParameterCountError if no type is supplied', function () {
    assert.throws(function () {
      var e = new Event()
    }, ParameterCountError)
  })
  it('throws a TypeError if a non-string value is supplied as the type', function () {
    assert.throws(function () {
      var e = new Event(4)
    }, TypeError)
  })
  it('throws a ParameterCountError if no record function is supplied', function () {
    assert.throws(function () {
      var e = new Event('wait')
    }, ParameterCountError)
  })
  it('throws a TypeError if a non-function is supplied for record', function () {
    assert.throws(function () {
      var e = new Event('wait', 4)
    }, TypeError)
  })
  it('throws a ParameterCountError if no save function is supplied', function () {
    assert.throws(function () {
      var e = new Event('wait', function () {})
    }, ParameterCountError)
  })
  it('throws a TypeError if a non-function is supplied for save', function () {
    assert.throws(function () {
      var e = new Event('wait', function () {}, 4)
    }, TypeError)
  })
  it('throws a TypeError if a non-string value is supplied as the uid', function () {
    assert.throws(function () {
      var e = new Event('wait', function () {}, function () {}, 4)
    }, TypeError)
  })
  it('sets the uid to null if no uid is supplied', function () {
    var e
    assert.doesNotThrow(function () {
      e = new Event('wait', function () {}, function () {})
    })
    assert(e.uid === null)
  })
  it('sets the uid as expected if a string uid is supplied', function () {
    var e
    assert.doesNotThrow(function () {
      e = new Event('wait', function () {}, function () {}, '4j1fafa-3')
    })
    assert(e.uid === '4j1fafa-3')
  })
})