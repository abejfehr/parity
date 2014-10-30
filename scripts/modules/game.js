//define the module
var GameModule = (function() {
  return {
    write: function(text) {
      document.getElementById('canvas').innerHTML = text;
    }
  }
}())

//add the mediator to the module
mediator.installTo(GameModule);

GameModule.subscribe('loader_story_loaded', function() {
  //check to see if there's any save data
  mediator.publish('cookie_data_load');
})

GameModule.subscribe('cookie_data_load_complete', function(level) {
  //level is the level to be loaded
  mediator.publish('story_set_bookmark_at_level', level);
})