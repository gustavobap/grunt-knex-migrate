var matchdep = require('matchdep');

module.exports = function(grunt) {
  matchdep.filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    jshint: {},

    mochacli: {
      all: ['test/**/*.test.js', '!test/tmp/**/*.js']
    },

    clean: {
      example: [],
      test: ['test/tmp']
    },

    mkdir: {
      test: {
        options: {
          create: [
            'test/tmp/simple/db',
            'test/tmp/staticfile/db',
            'test/tmp/function/db'
          ]
        }
      }
    }
  });

  grunt.registerTask('swapTestConfig:simple', 'swap `knexmigrate` config', function() {
    grunt.config.set('knexmigrate', require('./test/simple'));
  });

  grunt.registerTask('swapTestConfig:staticfile', 'swap `knexmigrate` config', function() {
    grunt.config.set('knexmigrate', './test/staticfile.json');
  });

  grunt.registerTask('swapTestConfig:function', 'swap `knexmigrate` config', function() {
    grunt.config.set('knexmigrate', function(cb) { return cb(null, require('./test/function')); });
  });

  grunt.registerTask('testrun', 'Test run for knexmigrate', function() {
    grunt.task.run([
      'swapTestConfig:simple',
      'knexmigrate:make:create_posts',

      'swapTestConfig:staticfile',
      'knexmigrate:make:create_posts',

      'swapTestConfig:function',
      'knexmigrate:make:create_posts'
    ]);
  });

  grunt.loadTasks('tasks');

  grunt.registerTask('test', ['clean:test', 'mkdir:test', 'testrun', 'mochacli']);
};