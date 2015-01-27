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
          'build/jquery.cts.selector.min.js': ['build/jquery.cts.selector.js']
        }
      },
      i18n: {
        files : {
          'build/i18n/en.min.js' : ["src/i18n/en.js"]
        }
        /*files: [{
            cwd: 'src/i18n/js',
            src: '*.js',
            dest: 'build/i18n/js'
        }]*/
      }
    },
    concat: {
      all: {
        files : {
          'build/cts.js' : ['src/cts.js', 'src/modules/text.js', 'src/modules/repository.js', 'src/modules/i18n.js'],
          'build/jquery.cts.selector.js' : ['src/plugins/jquery.cts.selector.js']
        }
      }
    },
    jasmine : {
      // Your project's source files
      src : 'src/**/*.js',
      // Your Jasmine spec files
      specs : 'specs/**/*.js'
    }
  });

  // Register tasks.
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');

  // Default task. 
  grunt.registerTask('default', ['concat', 'uglify']);
  grunt.registerTask('build', ['default']);
  grunt.registerTask('test', ['default', 'jasmine']);
};