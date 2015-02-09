module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options : {
        //beautify : true -> Need to figure out this stuff
      },
      all: {
        files: {
          'build/cts.min.js': ['build/cts.js'],
          'build/jquery.cts.selector.min.js': ['build/jquery.cts.selector.js'],
          'build/jquery.cts.typeahead.min.js': ['build/jquery.cts.typeahead.js'],
          'build/jquery.cts.service.min.js': ['build/jquery.cts.service.js'],
          'build/jquery.cts.xslt.min.js': ['build/jquery.cts.xslt.js']
        }
      },
      i18n: {
        files : {
          'build/i18n/en.min.js' : ["src/i18n/en.js"]
        }
      }
    },
    concat: {
      all: {
        files : {
          'build/cts.js' : [
            'src/cts.js', 
            'src/modules/utils.js', 
            'src/modules/service.js', 
            'src/modules/xslt.js', 
            'src/modules/text.js', 
            'src/modules/repository.js', 
            'src/modules/i18n.js', 
            'src/i18n/en.js'
          ],
          'build/jquery.cts.selector.js' : ['src/plugins/jquery.cts.selector.js'],
          'build/jquery.cts.typeahead.js' : ['src/plugins/jquery.cts.typeahead.js'],
          'build/jquery.cts.service.js' : ['src/plugins/jquery.cts.service.js'],
          'build/jquery.cts.xslt.js' : ['src/plugins/jquery.cts.xslt.js']
        }
      }
    },
    jslint: {
      all: ['src/*.js', 'src/**/*.js']
    },
    jasmine : {
      src : [
        'src/cts.js',
        'src/modules/**.js',
        'src/i18n/**.js'
      ],
      options : {
        vendor: [
          'node_modules/jasmine-ajax/lib/mock-ajax.js',
          'node_modules/jasmine-expect/dist/jasmine-matchers.js',
          'node_modules/jquery/dist/jquery.min.js',
          'node_modules/sinon/lib/sinon.js',
          'node_modules/jasmine-jquery/lib/jasmine-jquery.js'
        ],
        specs : 'spec/**/*.specs.js',
        keepRunner : true
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        options : {
          singleRun : true,
          browsers : ["PhantomJS"]
        }
      }
    }
  });

  // Register tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-karma');

  // Default task. 
  grunt.registerTask('default', ['concat', 'uglify']);
  grunt.registerTask('build', ['default']);
  //grunt.registerTask('jshint', ['jshint']);
  grunt.registerTask('test', ['jasmine', 'karma']);
};