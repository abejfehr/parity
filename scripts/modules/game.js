// game.js(GameModule)

var GameModule = (function() {
  // Doesn't need to be interacted with, only mediates at a high level
  return { }
}())

// Add the mediator to the module
mediator.installTo(GameModule);

// Loads the cookies when the story is finally loaded
GameModule.subscribe('loader_story_loaded', function() {
  mediator.publish('cookie_data_load');
})

// Sets bookmark for the story at the level loaded by the CookieDataManager
GameModule.subscribe('cookie_data_load_complete', function(saveObject) {
  mediator.publish('story_set_bookmark_at_level', saveObject);
})