var Loader = (function() {

  // Libraries to load
  var libs = [
  'lib/jquery.jrumble.1.3.min',
  'lib/jquery.touchSwipe.min',
  'lib/riffwave',
  'lib/fade'];

  // Available modules to load
  var modules = [
    'modules/Board',
    'modules/Keyboard',
    'modules/Manager',
    'modules/Overlay',
    'modules/Selector',
    'modules/Sound',
    'modules/StateData',
    'modules/Story',
    'modules/Swipe',
    'modules/Window'];

  // Loads the modules for the game
  var loadModules = function() {
    require(['lib/jquery-2.1.1.min'], function() {
      require(libs, function() {
        require(modules, function() {
          mediator.publish('loader_modules_loaded');
          $('#loader').fadeOut(300); // Fades out the loading screen
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
mediator.installTo(Loader);

// Subscribe to events

// Instruction to load the modules
mediator.subscribe('loader_load_modules', Loader.loadModules);

// Notify that modules are loaded
mediator.subscribe('loader_modules_loaded', Loader.loadStory);

// Notify that the story is loaded
mediator.subscribe('story_story_loaded', function() {
  mediator.publish('loader_story_loaded');
});