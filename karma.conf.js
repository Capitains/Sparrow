// Karma configuration
// Generated on Mon Feb 09 2015 11:27:25 GMT+0100 (CET)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine-jquery', 'jasmine'],


    // list of files / patterns to load in the browser
    files: [
      //Libraries
      'spec/javascripts/fixtures/XSLTProcessor.js',
      "./node_modules/handlebars/dist/handlebars.min.js",
      "./node_modules/typeahead.js/dist/typeahead.bundle.min.js",
      "node_modules/jasmine-ajax/lib/mock-ajax.js",
      "node_modules/jasmine-jquery/lib/jasmine-jquery.js",
      'spec/javascripts/.helper.js',

      //Abstractions
      'src/cts.js',
      'src/modules/*.js',
      'src/i18n/*.js',
      'src/services/*.js',
      'src/xslt/*.js',
      'src/endpoints/**.js', 

      //jQuery Plugins
      'src/plugins/*.js',

      //Fixutres
      {pattern:'spec/javascripts/fixtures/**/*.xml', included:false, watched:false},
      
      //Specs
      'spec/e2e/**/*.js',

    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Firefox', 'Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
