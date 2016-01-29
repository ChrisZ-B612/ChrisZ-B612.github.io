/**
 * Created by Chris, Z on 2016/1/5 8:52.
 */
'use strict';

module.exports = {
    karma: {
        browsers: ['PhantomJS'],
        preprocessors: {
            'karma-test/fixture/*.fixture.html': ['html2js']
        },
        reporters: ['progress'],
        autoWatch: true,
        singleRun: false
    }
};