var Story = (function() {

  // Variables for the module
  var story;
  var bookmark;
  var saveObject;
  var storybook;

  // Get things from the screen
  var selectDiv = $('#levelSelect');

  // Load the story
  var getStory = function() {
    $.getJSON('story.json', function(data) {
      storybook = data;
      story = storybook[0].levels;
      mediator.publish('story_num_levels', getNumLevels());
      mediator.publish('story_story_loaded');
    });
  }

  // Gets the total number of levels in the story
  var getNumLevels = function() {
    var c = 0;
    for(var i=0;i<story.length;++i) {
      if(story[i].type == 'level') {
        ++c;
      }
    }
    return c;
  }

  // Set the bookmark of the current level
  var setBookmark = function(val) {
    bookmark = val;

    // Render it, and save it if it's a playable item
    if(story[bookmark].type == 'instruction') {
      mediator.publish('overlay_render', story[bookmark]);
      saveObject.visited_instructions.push(bookmark);
      mediator.publish('cookie_data_save', saveObject);
    }
    else {
      mediator.publish('board_render', story[bookmark]);
      saveObject.played_levels.push(story[bookmark].number);
      mediator.publish('cookie_data_save', saveObject);
    }
  }

  // Advances the story
  var advance = function() {
    if(bookmark < story.length - 1) {
      // Passes all the previously visited instruction pages
      while(visited(++bookmark) && bookmark != story.length - 1) { }
      setBookmark(bookmark);
    }
  }

  // Returns whether or not the instruction screen at the bookmark has
  // previously been visited
  var visited = function(bookmarkNo) {
    return (saveObject.visited_instructions.indexOf(bookmarkNo) >= 0);
  }

  // Sets the bookmark to the given point
  var setBookmarkAtLevel = function(so) {
    saveObject = so;
    if(saveObject.last_level < 0) {
      setBookmark(0);
      return;
    }

    for(var i=0;i<story.length;++i) {
      if(story[i].number == saveObject.level) {
        setBookmark(i);
        return;
      }
    }
  }

  var drawStorySelect = function() {
    selectDiv.html('');

    var table = $('<table></table>').addClass('selectTable');

    for (var i = 0; i < storybook.length; ++i) {
      var row = $('<tr></tr>').addClass('storySelectRow');
      var cell = $('<td></td>').addClass('storySelectCell');
      cell.html(storybook[i].name);
      row.append(cell);
      table.append(row);
    }

    selectDiv.append(table);
  }

  var drawLevelSelect = function() {
    selectDiv.show();
    selectDiv.html('');

    var table = $('<table></table>').addClass('selectTable');

    for (var i = 0, k = 0; i < story.length; ++i) {

      // Only create a new row one in 5 times
      if(k % 5 == 0)
        var row = $('<tr></tr>').addClass('levelSelectRow');

      var cell = $('<td><img src="#"></td>').addClass('levelSelectCell');
      var inner = $('<div></div>').addClass('inner');
      if(story[i] && story[i].number) {
        inner.html(story[i].number);
        cell.append(inner);
        row.append(cell);
        ++k;
      }
      table.append(row);
    }
    selectDiv.append(table);
  }

  // The publicly visible methods are available by this facade
  return {
    getStory: getStory,
    setBookmark: setBookmark,
    setBookmarkAtLevel: setBookmarkAtLevel,
    advance: advance,
    drawStorySelect: drawStorySelect,
    drawLevelSelect: drawLevelSelect
  }
}())

// Add the mediator to the module
mediator.installTo(Story);

// Subscribe to messages

// Get the story, advance it, and set the bookmark when told
mediator.subscribe('story_get_story', Story.getStory);
mediator.subscribe('story_set_bookmark_at_level', Story.setBookmarkAtLevel);
mediator.subscribe('story_advance', Story.advance);

// Advance the story when notified that the current level has been completed
mediator.subscribe('board_level_complete', Story.advance);
mediator.subscribe('story_select_levels', Story.drawLevelSelect);
