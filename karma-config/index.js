/**
 * Created by Chris, Z on 2016/1/5 8:50.
 */
'use strict';

var configSource = process.env.KarmaPrefix || 'test';
module.exports = require('./env/' + configSource);