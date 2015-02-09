var Board = (function() {

  // DOM Elements
  var board;
  var cells = [];
  var levelLink;
  var overlay;
  var resetLink;


  // Variables for the page
  var active = false;
  var level; // Contains the level data
  var numLevels = -1;

  // Resets the level to its original state
  var reset = function() {
    render(level);
  };

  // Toggles between mute and unmute
  var toggleMute = function() {
    mediator.publish('sound_toggle_mute');
  };

  // Updates the board, called whenever a change is made
  var update = function() {
    $('td.selected').removeClass('selected');

    cells[level.selected.x][level.selected.y].addClass('selected');

    // Ensure that each cell is the color that they should be
    for(var i = 0; i < level.contents.length; ++i) {
      var x = i % 3;
      var y = Math.floor(i / 3);
      if(level.mode.indexOf('b&w') > -1) {
        if(level.colors[i] == "b") {
          cells[x][y].removeClass('white');
          cells[x][y].addClass('black');
        }
        else {
          cells[x][y].removeClass('black');
          cells[x][y].addClass('white');
        }
      }
    }

    if(isWin()) {
      board.fadeOut(options.fade, function() {
        mediator.publish('board_level_complete');
        mediator.publish('board_faded_out');
      });
      // Hide the intro tutorial if needbe
      $('#introtutorial').fadeOut(options.fade);


      mediator.publish('board_fade_out');
    }
  };

  var updateMuteButton = function(volume) {
    toggleMuteLink.html(volume ? 'mute' : 'unmute');
  };

  // Looks for a winning condition on the board, returns true or false
  function isWin() {
    var value = cell(0,0);
    for(var i = 0; i < 3; ++i) {
      for(var j = 0; j < 3; ++j) {
        if(cell(i,j) != value)
          return false;
      }
    }
    return true;
  }

  // Selects the cell to the left of the current cell
  function left() {
    if(active && level.selected.x > 0) {
      select(--level.selected.x, level.selected.y);
      update();
    }
  }

  // Selects the cell above the current cell
  function up() {
    if(active && level.selected.y > 0) {
      select(level.selected.x, --level.selected.y);
      update();
    }
  }

  // Selects the cell to the right of the current cell
  function right() {
    if(active && level.selected.x < 2) {
      select(++level.selected.x, level.selected.y);
      update();
    }
  }

  // Selects the cell under the current cell
  function down() {
    if(active && level.selected.y < 2) {
      select(level.selected.x, ++level.selected.y);
      update();
    }
  }

  // Selects a cell and modifies it's value if necessary
  function select(x, y) {
    var sel = level.selected;
    if(cells[sel.x][sel.y].hasClass('black')) {
      cell(sel.x, sel.y, cell(sel.x, sel.y)-1);
    }
    else {
      cell(sel.x, sel.y, cell(sel.x, sel.y)+1);
    }
    // Move the selector
    mediator.publish('selector_snap_to', x, y);

    // Play the tone
    mediator.publish('sound_play_tone', cell(sel.x, sel.y));
  }

  // Sets the value of a cell at x, y. If no value given, returns the value
  function cell(x, y, value) {
    if(arguments.length == 3)
      cells[x][y].html(value);
    else
      return parseInt(cells[x][y].html());
  }

  // Initially draws the level's cells
  var render = function(data) {
    // Deactivate previous overlays
    mediator.publish('overlay_set_inactive');

    level = data;

    // Show the level 1 tutorial if necessary
    if(level.number == "1") {
      $('#introtutorial').show();
    }

    // Parse the level data
    for(var i = 0; i < level.contents.length; ++i) {
      var x = i % 3;
      var y = Math.floor(i / 3);
      cell(x, y, level.contents[i]);
      if(level.mode.indexOf('b&w') > -1) {
        if(level.colors[i] == "b") {
          cells[x][y].removeClass('white');
          cells[x][y].addClass('black');
        }
        else {
          cells[x][y].removeClass('black');
          cells[x][y].addClass('white');
        }
      }
    }

    level.selected = {
      x: data.initialSelected.x,
      y: data.initialSelected.y
    };

    // Set the level text
    levelLink.html('level ' + level.number + '/' + numLevels);

    // Fade in once populated
    board.fadeIn(options.fade, function() {
      // Move the selector to the right place
      mediator.publish('selector_snap_to', level.selected.x, level.selected.y);

      mediator.publish('board_faded_in');
    });
    active = true;

    // Tell everyone we're fading in
    mediator.publish('board_fade_in');

    // Update to select the appropriate cell
    update();
  };

  // Can be called by other modules, setting the total number of levels
  var setNumLevels = function(num) {
    if(numLevels < 0) // This is a dirty workaround to bug #15, but it works
      numLevels = num;
  };

  // Fades out the board and sets it as inactive
  var setInactive = function() {
    board.fadeOut(options.fade);
    active = false;

    // Tell everyone we're fading out
    mediator.publish('board_fade_out');
  };

  var showLevelSelect = function() {
    mediator.publish('story_select_levels');
  };

  var quickHide = function() {
    board.hide();
  };

  var quickShow = function() {
    board.show();

  };

  // Populates the elements that have DOM objects in them
  var domReady = function() {

    board = $('#board');
    levelLink = $('#level');
    overlay = $('#overlay');
    resetLink = $('#reset');

    // Cells on the board
    for(var i = 0; i < 4; ++i) {
      cells.push([]);
      for(var j = 0; j < 4; ++j) {
        cells[i].push($('td[data-x="' + i + '"][data-y="' + j + '"]'));
      }
    }

    // Event bindings
    resetLink.on('click', reset);
  };

  // The facade
  return {
    render: render,
    up: up,
    down: down,
    left: left,
    right: right,
    reset: reset,
    setNumLevels: setNumLevels,
    setInactive: setInactive,
    updateMuteButton: updateMuteButton,
    quickHide: quickHide,
    quickShow: quickShow,
    domReady: domReady
  };
}());

// Add the mediator to the module
mediator.installTo(Board);

// Subscribe to messages

// Draw the board when told
Board.subscribe('board_render', Board.render);

// Listen to be told when to deactivate the view
Board.subscribe('board_set_inactive', Board.setNumLevels);

// Listen to the keyboard so the selector can be moved
Board.subscribe('controls_key_down', Board.down);
Board.subscribe('controls_key_left', Board.left);
Board.subscribe('controls_key_right', Board.right);
Board.subscribe('controls_key_up', Board.up);

Board.subscribe('swipe_down_board', Board.down);
Board.subscribe('swipe_left_board', Board.left);
Board.subscribe('swipe_right_board', Board.right);
Board.subscribe('swipe_up_board', Board.up);

// Listen to the keyboard for extra functionality
Board.subscribe('controls_key_r', Board.reset);

// Set the number of levels in this module
Board.subscribe('story_num_levels', Board.setNumLevels);

// Listen for the DOM to be loaded, from the loader for now
Board.subscribe('loader_dom_ready', Board.domReady);