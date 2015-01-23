module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      my_target: {
        files: {
          'build/cts.min.js': ['build/cts.js']
        }
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['src/cts.js', 'src/modules/repository.js'],
        dest: 'build/cts.js',
      },
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