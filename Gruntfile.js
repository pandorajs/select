/*
 * Select
 * https://github.com/pandorajs/select
 *
 * Copyright (c) 2014 pandorajs
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  'use strict';

  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    idleading: '<%= pkg.family %>/<%= pkg.name %>/<%= pkg.version %>/',

    sea: 'sea-modules/<%= idleading %>',

    jshint: {
      files: ['src/*.js','!src/sifter.js'],
      options: {
        jshintrc: true
      }
    },

    qunit: {
      options: {
        '--web-security': 'no',
        coverage: {
          baseUrl: './',
          src: ['src/*.js'],
          instrumentedFiles: 'temp/',
          lcovReport: 'report/',
          linesThresholdPct: 60
        }
      },
      all: ['test/*.html']
    },

    coveralls: {
      options: {
        force: true
      },
      all: {
        src: 'report/*.info'
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        autoWatch: true
      }
    },

    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        options: {
          paths: 'src',
          outdir: 'doc'
        }
      }
    },

    less: {
      select: {
        files: {
          'src/select.css': 'src/select.less'
        }
      }
    },

    spawn: {
      docWatch: {
        command: 'spm',
        commandArgs: ['doc','watch']
      },
      docBuild: {
        command: 'spm',
        commandArgs: ['doc','build']
      }
    },

    watch: {
      less: {
        files: ['src/*.less'],
        tasks: ['less']
      }
    },

    clean: {
      pages: {
        files: {
          src: ['gh-pages/**/*', '!gh-pages/.git*']
        }
      },
      doc: {
        files: {
          src: ['doc/**']
        }
      },
      dist: {
        files: {
          src: ['dist/**/*']
        }
      },
      build: {
        files: {
          src: ['.build/**']
        }
      },
      sea: {
        files: {
          src: ['<%= sea %>**']
        }
      }
    },

    copy: {
      doc: {
        files: [{
          expand: true,
          cwd: 'doc/',
          src: ['**'],
          dest: 'gh-pages/'
        }]
      },
      sea: {
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['**'],
          dest: '<%= sea %>'
        }]
      },

      sifter: {
        src: 'vendor/sifter/sifter.js',
        dest: 'src/sifter.js',
        options: {
          process: function (content, srcpath) {
            var ret = 'define(function(require, exports, module){\n';
            ret += content;
            ret += '\n});';
            return ret;
          }
        }
      }
    },

    transport: {
      options: {
        debug: true,
        idleading: '<%= idleading %>',
        alias: '<%= pkg.spm.alias %>'
      },
      src: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['*.js', '*.handlebars', '*.css'],
          dest: '.build/'
        }]
      }
    },

    concat: {
      options: {
        debug: true,
        include: 'relative'
      },
      src: {
        files: [{
          expand: true,
          cwd: '.build/',
          src: ['*.js'],
          dest: 'dist/'
        }]
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %>-<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n',
        beautify: {
          'ascii_only': true
        },
        // mangle: true,
        compress: {
          'global_defs': {
            'DEBUG': false
          },
          'dead_code': true
        }
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['*.js', '!*-debug.js'],
          dest: 'dist/'
        }]
      }
    }

  });

  grunt.registerTask('build', ['clean:dist','jshint', 'transport', 'concat', 'clean:build', 'uglify','spawn:docBuild']);

  grunt.registerTask('demo', ['clean:sea', 'copy:sea']);

  grunt.registerTask('doc', ['clean:doc', 'yuidoc', 'clean:pages', 'copy:doc']);

  grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('serve', ['watch', 'spawn']);

  grunt.registerTask('default', ['test', 'doc', 'build', 'demo']);

};
