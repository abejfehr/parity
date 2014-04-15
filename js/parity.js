//
// Parity
// Author:  Abe Fehr
// Version: 0.1
//

$(document).ready(function() {

  //all the page objects
  var resetLink = $('#reset');
  var levelText = $('#level');
  var overlay   = $('#overlay');
  var button    = $('#overlay > #holder > button');
  var board     = $('#board');
  var cells = [];
  for(var i=0;i<4;++i) {
    cells.push([]);
    for(var j=0;j<4;++j) {
      cells[i].push($('td[data-x="' + i + '"][data-y="' + j + '"]'));
    }
  }

  //the bookmark in the story of the game
  var bookmark = 0;

  var options = {
    fade: 300 //the time in ms for the fade
  }

  //where we'll store the current level
  var level;

  //where we'll store the instructions and the levels
  var story;



  $(document).keydown(function(e){
    if(story[bookmark].type == 'level') {
      if(e.keyCode == 37) {
        left();
        return false;
      }
      if(e.keyCode == 38) {
        up();
        return false;
      }
      if(e.keyCode == 39) {
        right();
        return false;
      }
      if(e.keyCode == 40) {
        down();
        return false;
      }
    }
    else if(story[bookmark].type == 'overlay') {
      if(e.keyCode == 32) {
        button.trigger('click');
      }
    }
  });



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



  // goes through the model(the story), draws the board accordingly,
  // and checks if it's a win scenario
  function update() {
    if(story[bookmark].type == 'level') {
      //go through the board and clear it of all the "selected" classes
      $('td.selected').removeClass('selected');

      cells[level.selected.x][level.selected.y].addClass('selected');

      //check if it's a win
      if(isWin()) {
        advanceStory();
      }
    }
  }



  // gets the current page of the story where the bookmark is, parses
  // it, and puts it in the grid
  function loadCurrentPage() {
    if(story[bookmark].type == 'level') {
      if(story[bookmark].contents == 'generated') {
        //generate a level
        data = generate(story[bookmark]);
        loadLevel(data);
      }
      else {
        loadLevel(story[bookmark]);
      }
    }
    else if(story[bookmark].type == 'overlay') {
      //get the current slide that the overlay is on
      if(!story[bookmark].current)
        story[bookmark].current = 0;
      var slide = story[bookmark].current;

      //put the text from the thingy into the overlay
      var title   = story[bookmark].contents[slide].title;
      var content = story[bookmark].contents[slide].content;
      var action  = story[bookmark].contents[slide].button;

      $('#overlay > h1').html(title);
      $('#overlay > p').html(content);
      if(action) {
        button.show();
        button.html(action);
      }
      else
        button.hide();

      overlay.fadeIn(options['fade']);
      update();
    }
  }



  //validation function to be used later
  function valid(direction, x, y) {
    switch(direction) {
      case 0:
        return false;
      case 1: //north
        if(y == 0) {
          return false;
        }
        return true;
      case 2: //east
        if(x == 2) {
          return false;
        }
        return true;
      case 3: //south
        if(y == 2) {
          return false;
        }
        return true;
      case 4: //west
        if(x == 0) {
          return false;
        }
        return true;
    }
  }



  //generates a level
  function generate(level) {
    //create a new object
    //create an array for the level data
    var content = [];

    //push the initial value into the array that number of times
    for(var i=0;i<9;++i) {
      content.push(level.schema.end);
    }

    //generate a random number of steps in the bounds
    var moveRange = level.schema.maxNumMoves - level.schema.minNumMoves;
    var numMoves = level.schema.minNumMoves + Math.random()*(moveRange);

    //generate a random starting location
    var x = Math.floor(Math.random()*3);
    var y = Math.floor(Math.random()*3);

    //loop through all the moves
    for(var i=0;i<numMoves;++i) {
      //for each time, move the coordinates by one in a random direction...
      var direction = 0; //initialize it to 0(non-real direction)
      while(!valid(direction, x, y)) {
        //generate a number between 1 and 4 inclusive
        direction = Math.floor(1 + Math.random()*4);
      }
      //at this point, the direction is valid so we're just moving it one
      switch(direction) {
        case 1: //north
          --content[y*3+x];
          --y;
          break;
        case 2: //east
          --content[y*3+x];
          ++x;
          break;
        case 3: //south
          --content[y*3+x];
          ++y;
          break;
        case 4: //west
          --content[y*3+x];
          --x;
          break;
      }
    }

    return {
      type: level.type,
      number: level.number,
      contents: content,
      initialSelected: { x: x, y: y }
    };
  }



  //loads a level
  function loadLevel(data) {
    //set the level data
    level = data;

    //parse its contents
    for(var i=0;i<level.contents.length;++i) {
      cell(i%3,Math.floor(i/3),level.contents[i]);
    }

    //set the currently selected cell
    level.selected = {
      x: data.initialSelected.x,
      y: data.initialSelected.y
    };

    //put the level number in the corner
    levelText.html("level " + level.number + "/" + numLevels());

    //fade in the level
    board.fadeIn(options['fade']);

    //update the screen
    update();
  }



  //resets the board back to the level's beginning
  function reset() {
    loadLevel(level);
  }



  //checks to see if there's a win condition or not
  //returns: boolean
  function isWin() {
    var value = cell(0,0);
    for(var i=0;i<3;++i) {
      for(var j=0;j<3;++j) {
        if(cell(i,j) != value)
          return false
      }
    }
    return true;
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



  //starts the game by initializing the level text and displaying
  //the first level
  function start() {
    //put the level number in the corner
    levelText.html("level 0/" + numLevels());
    loadCurrentPage();
  }



  //fades out the board
  //input: -the callback to call when the fade is completed
  function fadeOut(callback) {
    //only fade out that visible component
    if(board.is(':visible'))
      board.fadeOut(options['fade'], callback);

    if(overlay.is(':visible'))
      overlay.fadeOut(options['fade'], callback);
  }



  //tries to advance the story
  function advanceStory() {
    //tries to advance the current slide first if it's an overlay
    if(story[bookmark].type == 'overlay') {
      if(++story[bookmark].current < story[bookmark].contents.length) {
          fadeOut(loadCurrentPage);
          return;
      }
    }

    if(++bookmark < story.length) {
      fadeOut(loadCurrentPage);
    }
    else {
      end();
    }
  }



  //gets the number of levels in the story
  function numLevels() {
    //go through the stuff in the story
    var sum = 0;
    for(var i=0;i<story.length;++i) {
      if(story[i].type=='level') {
        ++sum;
      }
    }
    return sum;
  }



  //what happens when the game is finished, still needs to be made
  function end() {
    alert('the end!');
  }



  //event assignments
  button.click(advanceStory);
  resetLink.click(reset);

  //start the game off by getting the story
  $.getJSON('story.json', function(data) {
    story = data;
    start();
  });
});
