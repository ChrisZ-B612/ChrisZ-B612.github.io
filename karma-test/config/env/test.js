/**
 * Created by Chris, Z on 2016/1/5 8:52.
 */
'use strict';

module.exports = {
    karma: {
        browsers: ['Chrome'],
        preprocessors: {
            'karma-test/src/*.js': 'coverage',
            'karma-test/fixture/*.fixture.html': ['html2js']
        },
        reporters: ['progress', 'coverage'],
        autoWatch: false,
        singleRun: true
    }
};