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
            'src/modules/endpoint.js', 
            'src/modules/text.js', 
            'src/modules/repository.js', 
            'src/modules/i18n.js', 
            'src/services/*.js', 
            'src/endpoints/*.js', 
            'src/xslt/*.js',
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
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        options : {
          singleRun : true,
          browsers : ["PhantomJS"]
        }
      }
    },
    markdown: {
      all: {
        files: [
          {src: ['README.md'], dest: 'index.html'},
          {src: ['./doc/i18n.md'], dest: 'doc_html/i18n.html'},
          {src: ['./doc/plugins/jquery.cts.selector.md'],  dest: 'doc_html/plugins.jquery.cts.selector.html'},
          {src: ['./doc/plugins/jquery.cts.typeahead.md'], dest: 'doc_html/plugins.jquery.cts.typeahead.html'},
          {src: ['./doc/plugins/jquery.cts.xslt.md'],      dest: 'doc_html/plugins.jquery.cts.xslt.html'},
          {src: ['./doc/plugins/jquery.cts.service.md'],   dest: 'doc_html/plugins.jquery.cts.service.html'},

          {src: ['./doc/services/llt.tokenizer.md'],       dest: 'doc_html/services.llt.tokenizer.html'},
          {src: ['./doc/services/new.md'],                 dest: 'doc_html/services.new.html'},

          {src: ['./doc/xslt/llt.segtok_to_tb.md'],        dest: 'doc_html/xslt.llt.segtok_to_tb.html'},
          {src: ['./doc/xslt/new.md'],                     dest: 'doc_html/xslt.new.html'}

        ],
        options : {
          template : "./doc/template/template.html"
        }
      }
    },
    jsdoc : {
      dist : {
        src: [
          'src/cts.js', 
          'src/modules/*.js'
          ],
        options: {
          destination: 'doc_html/api',
          configure : "jsdoc.conf.json",
          template: './node_modules/grunt-jsdoc/node_modules/ink-docstrap/template'
        }
      }
    },
    replace: {
      index : {
        src : './index.html', 
        dest : 'index.html',
        replacements: [{
          from: 'doc/plugins/',                   // string replacement
          to: '/doc_html/plugins.'
        },{
          from: 'doc/services/',                   // string replacement
          to: '/doc_html/services.'
        },{
          from: 'doc/xslt/',                   // string replacement
          to: '/doc_html/xslt.'
        },{
          from: '../plugins/',                   // string replacement
          to: '/doc_html/plugins.'
        },{
          from: '../services/',                   // string replacement
          to: '/doc_html/services.'
        },{
          from: '../xslt/',                   // string replacement
          to: '/doc_html/xslt.'
        },{
          from: 'doc/',                   // string replacement
          to: '/doc_html/'
        },{
          from: 'README.md',                   // string replacement
          to: '/index.html'
        },{
          from: '../',                   // string replacement
          to: ''
        },{
          from: '.md',                   // string replacement
          to: '.html'
        },{
          from: '"/',                   // string replacement
          to: '"/Capitains-Sparrow'
        }]
      },
      htmlpages: {
        src : './doc_html/*.html',
        dest : './doc_html/',
        replacements: [{
          from: 'doc/plugins/',                   // string replacement
          to: 'plugins.'
        },{
          from: 'doc/services/',                   // string replacement
          to: 'services.'
        },{
          from: 'doc/xslt/',                   // string replacement
          to: 'xslt.'
        },{
          from: '../plugins/',                   // string replacement
          to: 'plugins.'
        },{
          from: '../services/',                   // string replacement
          to: 'services.'
        },{
          from: '../xslt/',                   // string replacement
          to: 'xslt.'
        },{
          from: 'doc/',                   // string replacement
          to: ''
        },{
          from: 'README.md',                   // string replacement
          to: '/index.html'
        },{
          from: '../',                   // string replacement
          to: ''
        },{
          from: '.md',                   // string replacement
          to: '.html'
        },{
          from: 'src/',                   // string replacement
          to: 'https://github.com/PerseusDL/Capitains-Sparrow/blob/master/src/'
        },{
          from: '/https',                   // string replacement
          to: 'https'
        },{
          from: '"/',                   // string replacement
          to: '"/Capitains-Sparrow'
        }]
      }
    },
    'gh-pages': {
      src: ['**']
    }
  });

  // Register tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks("grunt-jsdoc");
  grunt.loadNpmTasks("grunt-markdown");
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-gh-pages');

  // Default task. 
  grunt.registerTask('default', ['concat', 'uglify']);
  grunt.registerTask('build', ['default']);
  //grunt.registerTask('jshint', ['jshint']);
  grunt.registerTask('test', ['jasmine', 'karma']);
  grunt.registerTask('doc', ['markdown', 'replace', 'jsdoc'])
  grunt.registerTask('page', ['doc', 'gh-pages'])
};