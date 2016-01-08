/**
 * Created by Chris, Z on 2016/1/5 8:52.
 */
'use strict';

module.exports = {
    karma: {
        browsers: ['Chrome'],
        preprocessors: {
            'lib/*.js': 'coverage',
            'test/*.html': ['html2js']
        },
        reporters: ['progress', 'coverage'],
        autoWatch: false,
        singleRun: true
    }
};