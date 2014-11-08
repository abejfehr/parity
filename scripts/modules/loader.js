// loader.js(LoaderModule)
var LoaderModule = (function() {

  // Libraries to load
  var libs = ['lib/jquery.jrumble.1.3.min'];

  // Available modules to load
  var modules = [
    'modules/game',
    'modules/cookiedata',
    'modules/controls',
    'modules/overlay',
    'modules/board',
    'modules/story'];

  // Loads the modules for the game
  var loadModules = function() {
    require(['lib/jquery-2.1.1.min'], function() {
      require(libs, function() {
        require(modules, function() {
          mediator.publish('loader_modules_loaded');
          $('#loader').fadeOut(300);
        });
      });
    });
  };

  // Loads the story of the game(story.json)
  var loadStory = function() {
    mediator.publish('story_get_story');
  }

  // The externally available facade
  return {
    loadModules: loadModules,
    loadStory: loadStory
  }
}());

// Add the mediator to the module
mediator.installTo(LoaderModule);

// Subscribe to events

// Instruction to load the modules
mediator.subscribe('loader_load_modules', LoaderModule.loadModules);

// Notify that modules are loaded
mediator.subscribe('loader_modules_loaded', LoaderModule.loadStory);

// Notify that the story is loaded
mediator.subscribe('story_story_loaded', function() {
  mediator.publish('loader_story_loaded');
});