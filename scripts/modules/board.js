//define the module
var BoardModule = (function() {
  var board = $('#board');
  var cells = [];
  var levelLink = $('#level');
  var level; //actually contains the level data
  var overlay = $('#overlay');
  var resetLink = $('#reset');
  for(var i = 0; i < 4; ++i) {
    cells.push([]);
    for(var j = 0; j < 4; ++j) {
      cells[i].push($('td[data-x="' + i + '"][data-y="' + j + '"]'));
    }
  }

  // goes through the model(the story), draws the board accordingly,
  // and checks if it's a win scenario
  var update = function() {
    $('td.selected').removeClass('selected');

    cells[level.selected.x][level.selected.y].addClass('selected');

    //check if it's a win
    if(isWin()) {
      board.fadeOut(options['fade'], function() {
        mediator.publish('board_level_complete');
      })
    }
  }

  function isWin() {
    var value = cell(0,0);
    for(var i = 0; i < 3; ++i) {
      for(var j = 0; j < 3; ++j) {
        if(cell(i,j) != value)
          return false
      }
    }
    return true;
  }

    //selects the cell to the left of the current cell
  function left() {
    if(level.selected.x > 0) {
      select(--level.selected.x, level.selected.y);
      update();
    }
  }

  //selects the cell above the current cell
  function up() {
    if(level.selected.y > 0) {
      select(level.selected.x, --level.selected.y);
      update();
    }
  }

  //selects the cell to the right of the current cell
  function right() {
    if(level.selected.x < 2) {
      select(++level.selected.x, level.selected.y);
      update();
    }
  }

  //selects the cell under the current cell
  function down() {
    if(level.selected.y < 2) {
      select(level.selected.x, ++level.selected.y);
      update();
    }
  }

  //selects a cell and increases its value
  function select(x, y) {
    //increase the number in the selected cell
    cell(level.selected.x, level.selected.y, cell(level.selected.x, level.selected.y)+1);
  }


  //gets or sets a cells
  //input: -the x/y location of a cell
  //       -the value to put into the cell(optional)
  //returns: -the contents of the cell(if no value is given)
  //         -nothing, if a value is given
  function cell(x, y, value) {
    //either gets the contents of x, y or sets them
    if(arguments.length==3) {
      cells[x][y].html(value);
    }
    else {
      //return the value
      return parseInt(cells[x][y].html());
    }
  }


  var render = function(data) {
    //hide the overlay if needbe
    overlay.fadeOut(options['fade']);

    //do things here
    level = data;

    //parse its contents
    for(var i = 0; i < level.contents.length; ++i) {
      cell(i % 3, Math.floor(i / 3), level.contents[i]);
    }

    //set the currently selected cell
    level.selected = {
      x: data.initialSelected.x,
      y: data.initialSelected.y
    };

    //put the level number in the corner
    levelLink.html('level ' + level.number + '/' + 5); //TODO: fix this 5

    //fade in the level
    board.fadeIn(options['fade']);

    //update the screen
    update();

    //add the anchor to the url
    document.location.hash = "#" + level.number; //TODO: move this elsewhere
  }

  return {
    render: render,
    up: up,
    down: down,
    left: left,
    right: right
  }
}())

//add the mediator to the module
mediator.installTo(BoardModule);

//subscribe to messages
BoardModule.subscribe('board_render', BoardModule.render);
BoardModule.subscribe('controls_key_down', BoardModule.down);
BoardModule.subscribe('controls_key_left', BoardModule.left);
BoardModule.subscribe('controls_key_up', BoardModule.up);
BoardModule.subscribe('controls_key_right', BoardModule.right);