//define the module
var StoryModule = (function() {
  //the purpose of this module is to get and manage the story. we'll keep track
  //of the story we're currently in among other things in here
  var story;
  var bookmark;
  //other variables go here

  //get the story
  var getStory = function() {
    $.getJSON('story.json', function(data) {
      story = data;
      mediator.publish('story_story_loaded');
    });
  }

  var setBookmark = function(val) {
    bookmark = val;

    //render the item for the bookmark we just received
    if(story[bookmark].type == 'instruction') {
      //make the overlay module draw the item
      mediator.publish('overlay_render', story[bookmark]);
    }
    else {
      //make the board module draw the item
      mediator.publish('board_render', story[bookmark]);

      //save it in a cookie if it's a level
      mediator.publish('cookie_data_save', story[bookmark].number);
    }
  }

  var advance = function() {
    if(bookmark < story.length-1) {
      setBookmark(++bookmark);
    }
  }

  var setBookmarkAtLevel = function(level) {
    if(level < 0)
      return;
    for(var i=0;i<story.length;++i) {
      if(story[i].number == level) {
        setBookmark(i);
        return;
      }
    }
  }

  return {
    getStory: getStory,
    setBookmark: setBookmark,
    setBookmarkAtLevel: setBookmarkAtLevel,
    advance: advance
  }
}())

//add the mediator to the module
mediator.installTo(StoryModule);

mediator.subscribe('story_get_story', StoryModule.getStory);
mediator.subscribe('story_set_bookmark_at_level', StoryModule.setBookmarkAtLevel);
mediator.subscribe('story_advance', StoryModule.advance);
mediator.subscribe('board_level_complete', StoryModule.advance);