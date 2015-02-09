module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
     jshint: {
        prod: {
          src: [
            'scripts/core.js',
            'scripts/modules/Board.js',
            'scripts/modules/Keyboard.js',
            'scripts/modules/Manager.js',
            'scripts/modules/Overlay.js',
            'scripts/modules/Selector.js',
            'scripts/modules/StateData.js',
            'scripts/modules/Story.js',
            'scripts/modules/Swipe.js',
            'scripts/modules/Window.js'
         ]
        }
      },
      concat: {
        prod: {
          src: [
          'scripts/lib/jquery-2.1.1.min.js',
          'scripts/lib/jquery.touchSwipe.min.js',
          'scripts/core.js',
          'scripts/modules/Board.js',
          'scripts/modules/Keyboard.js',
          'scripts/modules/Manager.js',
          'scripts/modules/Overlay.js',
          'scripts/modules/Selector.js',
          'scripts/modules/StateData.js',
          'scripts/modules/Story.js',
          'scripts/modules/Swipe.js',
          'scripts/modules/Window.js'
          ],
        dest: 'scripts/production.js'
        }
      },
      uglify: {
        prod: {
          src: 'scripts/production.js',
          dest: 'scripts/production.min.js'
        }
      }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.registerTask('default', ['jshint','concat','uglify']);
};
