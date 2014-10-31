module.exports = function(config) {
  config.set({
    frameworks: ['mocha'],
    browsers: ['PhantomJS'],
    customLaunchers: {
      'PhantomJS_custom': {
        base: 'PhantomJS',
        options: {
          windowName: 'my-window',
          settings: {
            webSecurityEnabled: false
          }
        },
        flags: ['--remote-debugger-port=9000']
      }
    },

    plugins: ['karma-mocha','karma-mocha-reporter','karma-coverage','karma-phantomjs-launcher'],
    files: [
      {pattern:'vendor/seajs/sea.js', included: true},
      {pattern:'vendor/seajs/seajs-text.js', included: true},
      {pattern:'sea-modules/**/*.js', included: false},
      {pattern: 'src/*.js', included: false},
      {pattern: 'src/*.css', included: true},
      {pattern: 'src/*.handlebars', included: false},
      {pattern: 'test/*-spec.js', included: false},
      './test/test-main.js'
    ],
    // coverage reporter generates the coverage
    reporters: ['progress','mocha', 'coverage'],

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'src/select.js': ['coverage']
    },

    // optionally, configure the reporter
    coverageReporter: {
      reporters: [
        {
          type: 'json',
          dir: 'test/coverage'
        }, {
          type: 'lcov',
          dir: 'report/'
        }
      ]
    }

  });
};
