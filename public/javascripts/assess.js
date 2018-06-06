#! /usr/bin/env node

/*
 * assess.js
 *
 * Copyright (c) 2018 Turgay Bircek
 * Version: 1.0.0
 * Date: 4/25/2018
 *
 * Provides error assessments.
 *
 */

//'use strict';

var assert = require('assert');

if ('production' === process.env.mode) {
  var nil = function() {};
  module.exports = {
    equal = nil;
    notEqual = nil;
    // all the other functions
  };
} else {
  // a wrapper like that one helps in not polluting the exported object
  module.exports = {
    equal = function(actual, expected, message) {
      assert.equal(actual, expected, message);
    },
    notEqual = function(actual, expected, message) {
      assert.notEqual(actual, expected, message);
    },
    // all the other functions
  }
}
