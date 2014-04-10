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
    fade: 300
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
    if(level.selected.x < 3) {
      select(++level.selected.x, level.selected.y);
      update();
    }
  }



  //selects the cell under the current cell
  function down() {
    if(level.selected.y < 3) {
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



  // gets the level in the current page of the story, parses
  // it, and puts it in the grid
  function loadScreen() {
    if(story[bookmark].type == 'level') {
      level = story[bookmark];
      for(var i=0;i<story[bookmark].contents.length;++i) {
        cell(i%4,Math.floor(i/4),story[bookmark].contents[i]);
      }

      level.selected = story[bookmark].initialSelected;

      //put the level number in the corner
      levelText.html("level " + level.number + "/" + numLevels());

      //fade in the level
      board.fadeIn(options['fade']);
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
      button.html(action);

      overlay.fadeIn(options['fade']);
    }

    update();
  }



  //resets the board back to the level's beginning
  function reset() {
    loadScreen();
  }



  //checks to see if there's a win condition or not
  //returns: boolean
  function isWin() {
    var value = cell(0,0);
    for(var i=0;i<4;++i) {
      for(var j=0;j<4;++j) {
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
    loadScreen();
  }



  //fades out the board
  //input: -the callback to call when the fade is completed
  function fadeOut(callback) {
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
          fadeOut(loadScreen);
          return;
      }
    }
    if(++bookmark < story.length) {
      fadeOut(loadScreen);
    }
    else {
      //show the end
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



  //what happens when the game is finished
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
