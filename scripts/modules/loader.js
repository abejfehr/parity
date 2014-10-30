//define the module
var LoaderModule = (function() {
  var modules = ['game', 'cookiedata', 'controls'];

  var loadModules = function() {
    require(['lib/jquery-2.1.1.min'], function() {
      require(
        ['modules/game',
        'modules/cookiedata',
        'modules/controls',
        'modules/overlay',
        'modules/board',
        'modules/story'],
        function() {
          mediator.publish('loader_modules_loaded');
        });
    });
  };

  var loadStory = function() {
    mediator.publish('story_get_story');
  }

  return {
    loadModules: loadModules,
    loadStory: loadStory
  }
}());

//add the mediator to the module
mediator.installTo(LoaderModule);

//subscribe to events
mediator.subscribe('loader_load_modules', LoaderModule.loadModules);
mediator.subscribe('loader_modules_loaded', LoaderModule.loadStory);
mediator.subscribe('story_story_loaded', function() { mediator.publish('loader_story_loaded'); });