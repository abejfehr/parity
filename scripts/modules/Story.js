var Story = (function() {

  // Variables for the module
  var story;
  var bookmark;
  var saveObject;

  // Get things from the screen
  var selectDiv = $('#levelSelect');

  // Load the story
  var getStory = function() {
    $.getJSON('story.json', function(data) {
      story = data;
      mediator.publish('story_num_levels', getNumLevels());
      mediator.publish('story_story_loaded');
    });
  };

  // Gets the total number of levels in the story
  var getNumLevels = function() {
    var c = 0;
    for(var i=0;i<story.length;++i) {
      if(story[i].type == 'level') {
        ++c;
      }
    }
    return c;
  };

  // Set the bookmark of the current level
  var setBookmark = function(val) {
    bookmark = val;

    // Render it, and save it if it's a playable item
    if(story[bookmark].type == 'instruction') {
      mediator.publish('overlay_render', story[bookmark]);
      if(saveObject.visited_instructions.indexOf(bookmark) < 0)
        saveObject.visited_instructions.push(bookmark);
      mediator.publish('cookie_data_save', saveObject);
    }
    else {
      mediator.publish('board_render', story[bookmark]);
      if(saveObject.played_levels.indexOf(story[bookmark].number) < 0) {
        saveObject.played_levels.push(story[bookmark].number);
        saveObject.last_level = story[bookmark].number;
      }
      mediator.publish('cookie_data_save', saveObject);
    }
  };

  // Advances the story
  var advance = function() {
    if(bookmark < story.length - 1) {
      // Passes all the previously visited instruction pages
      while(visited(++bookmark) && bookmark != story.length - 1) { }
      setBookmark(bookmark);
    }
  };

  // Returns whether or not the instruction screen at the bookmark has
  // previously been visited
  var visited = function(bookmarkNo) {
    return (saveObject.visited_instructions.indexOf(bookmarkNo) >= 0);
  };

  // Sets the bookmark to the given point
  var setBookmarkAtLevel = function(so) {
    saveObject = so;
    if(saveObject.last_level < 0) {
      setBookmark(0);
      return;
    }

    for(var i=0;i<story.length;++i) {
      var level_index = saveObject.last_level;

      /**
       * The below code is for use with cheating, so any level can be visited
       * just by changing the URL to contain a hash with the level number.
       */

      /*
      if(parseInt(window.location.hash.substring(1)) > 0) {
        level_index = parseInt(window.location.hash.substring(1))
      }
      */

      if(story[i].number == level_index) {
        setBookmark(i);
        return;
      }
    }
  };

  // The publicly visible methods are available by this facade
  return {
    getStory: getStory,
    setBookmark: setBookmark,
    setBookmarkAtLevel: setBookmarkAtLevel,
    advance: advance,
  };
}());

// Add the mediator to the module
mediator.installTo(Story);

// Subscribe to messages

// Get the story, advance it, and set the bookmark when told
mediator.subscribe('story_get_story', Story.getStory);
mediator.subscribe('story_set_bookmark_at_level', Story.setBookmarkAtLevel);
mediator.subscribe('story_advance', Story.advance);

// Advance the story when notified that the current level has been completed
mediator.subscribe('board_level_complete', Story.advance);