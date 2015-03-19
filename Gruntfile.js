module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ["./dist"],
    uglify: {
      options : {
        //beautify : true -> Need to figure out this stuff
      },
      all: {
        files: {
          'dist/cts.min.js': ['dist/cts.js']
        }
      },
      i18n: {
        files : {
          'dist/i18n/en.min.js' : ["src/i18n/en.js"]
        }
      }
    },
    concat: {
      all: {
        files : {
          'dist/cts.js' : [
            'src/cts.js', 
            'src/modules/utils.js', 
            'src/modules/service.js', 
            'src/modules/xslt.js', 
            'src/modules/endpoint.js', 
            'src/modules/text.js', 
            'src/modules/repository.js', 
            'src/modules/i18n.js', 
            'src/services/*.js', 
            'src/endpoints/*.js', 
            'src/xslt/*.js',
            'src/i18n/en.js'
          ]
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
        'src/i18n/**.js', 
        'src/services/**.js',
        'src/endpoints/**.js', 
        'src/xslt/**.js',
      ],
      options : {
        vendor: [
          'node_modules/jasmine-ajax/lib/mock-ajax.js',
          'node_modules/jasmine-expect/dist/jasmine-matchers.js',
          'node_modules/jquery/dist/jquery.min.js',
          'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
          'spec/javascripts/.helper.js'
        ],
        specs : 'spec/**/*.specs.js',
        keepRunner : true
      }
    },
    jsdoc : {
      dist : {
        src: [
          'src/cts.js', 
          'src/modules/*.js'
          ],
        options: {
          destination: 'doc_html',
          configure : "jsdoc.conf.json",
          template: './node_modules/grunt-jsdoc/node_modules/ink-docstrap/template'
        }
      }
    },
    'gh-pages': {
      src: ['doc_html']
    },
    release : {
      options: {
        additionalFiles: ['bower.json']
      }
    }
  });

  // Register tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks("grunt-jsdoc");

  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-release');

  // Default task. 
  grunt.registerTask('default', ['concat', 'uglify']);
  grunt.registerTask('build', ['default']);

  grunt.registerTask('test', ['jasmine']);
  grunt.registerTask('page', ['jsdoc', 'gh-pages'])

  grunt.registerTask('version', ['build', 'release', 'page']);
};
